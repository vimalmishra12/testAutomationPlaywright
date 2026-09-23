"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
  help_btn: selectorFile.css.ComproC1.dashboard.help_btn,
  progress_btn: selectorFile.css.ComproC1.dashboard.progress_btn,
  praticeExtra_btn: selectorFile.css.ComproC1.dashboard.praticeExtra_btn,
  ebook_btn: selectorFile.css.ComproC1.dashboard.ebook_btn,
  homework_btn: selectorFile.css.ComproC1.dashboard.homework_btn,
  myProgress_btn: selectorFile.css.ComproC1.dashboard.myProgress_btn,
  createNewClass: selectorFile.css.ComproC1.dashboard.createNewClass,
  activeClassCard: selectorFile.css.ComproC1.dashboard.activeClassCard,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.help_btn),
    };
    return res;
  },

  /**
   * First landing of a newly verified teacher: waits for the dashboard to settle, closes the
   * IntroJS welcome tour if it is up, and reports whether "Complete your account" is shown.
   *
   * Why a two-signal wait [2026-09-22, SOURCE playwright-automation-c1 DashboardPage]: after
   * e-mail verification the app goes through slow Gigya redirects, and the tour appears on
   * some redirect paths and not others — either the tour overlay or the setup button is
   * the "dashboard has settled" signal. SOURCE measured up to 3 min on thor (budget below).
   * The tour intercepts pointer events, so it must be gone before anything is clicked.
   *
   * [2026-09-22, prod trace] The tour's dialog is `.introjs-tooltip` (qid s-gtour-cntr-1);
   * `.introjs-overlay` is NOT always rendered, so it is not a usable sentinel. The tour also
   * mounts AFTER the setup button: measured ~1.8 s later on a fresh login. So once the button
   * shows we still give the tour TOUR_LATE_MS to appear — a presence-only check at that moment
   * reported "no tour" and the next click was intercepted.
   */
  dismiss_introTour_getTeacherSetupPrompt: async function () {
    await logger.logInto(await stackTrace.get());
    var ds = selectorFile.css.ComproC1.dashboard;
    var TOUR_LATE_MS = 5000;
    var deadline = Date.now() + 180000;
    while (Date.now() < deadline) {
      if (true == (await action.isDisplayed(ds.introTourDialog))) break;
      if (true == (await action.isDisplayed(ds.teacherCompleteAccountBtn))) {
        // Button first: wait (bounded) for the late tour; absence after the budget is fine.
        await action.waitForDisplayed(ds.introTourDialog, TOUR_LATE_MS);
        break;
      }
      await browser.pause(1000);
    }
    var tourShown = true == (await action.isDisplayed(ds.introTourDialog));
    if (tourShown) {
      await action.click(ds.introTourSkipBtn);
      await action.waitForDisplayed(ds.introTourDialog, 10000, true);
    }
    return {
      tourShown: tourShown,
      tourClosed: true != (await action.isDisplayed(ds.introTourDialog)),
      completeAccountShown: true == (await action.waitForDisplayed(ds.teacherCompleteAccountBtn, 120000)),
    };
  },

  /**
   * First landing of a newly verified LEARNER: waits for the learner welcome screen's Continue
   * button (SOURCE DashboardPage.verifyLeanerSignUpComplete, qid l-wl-btn-1), closing a guided
   * tour first if one comes up. Budget as for the teacher: post-verification Gigya redirects are
   * slow (SOURCE allowed minutes on thor; seconds on prod in our runs).
   */
  getData_learnerWelcome: async function () {
    await logger.logInto(await stackTrace.get());
    var ds = selectorFile.css.ComproC1.dashboard;
    var shown = true == (await action.waitForDisplayed(ds.learnerWelcomeContinueBtn, 180000));
    var tour = await this.close_introTourIfShown();
    return { continueShown: shown, tourClosed: tour.tourClosed };
  },

  /**
   * Learner dashboard after accepting a class invite on a School Level Licence (SLE) school:
   * the class card (matched BY NAME), its component tile (e.g. "Practice Extra") inside that
   * card, and whether the activation-code prompt is shown. With an SLE the product comes from
   * the school licence, so the tile must be there with NO activation code (SOURCE
   * DashboardPage.verifyComponentAvailableWithoutActivation). The tile is looked up inside the
   * named card: once a product is active, other class cards can list the same component.
   */
  getData_learnerClassAccess: async function (className, componentName) {
    await logger.logInto(await stackTrace.get(), "class:" + className + " component:" + componentName);
    var ds = selectorFile.css.ComproC1.dashboard;
    var card = action.getFilteredLocator(ds.learnerClassCard, className);
    var tile = action.getNestedFilteredLocator(ds.learnerClassCard, className, ds.componentTile, componentName);
    // SOURCE allowed 2 min for the component to appear after the accept.
    var classShown = true == (await action.waitForDisplayed(card, 60000));
    var componentShown = classShown && true == (await action.waitForDisplayed(tile, 120000));
    return {
      classShown: classShown,
      componentShown: componentShown,
      activationPromptShown: true == (await action.isDisplayed(ds.activationCodeInput)),
    };
  },

  /**
   * Opens a component (e.g. "Practice Extra") from the card of class `className` on the learner
   * dashboard, then waits for the Learning Path player. [2026-09-22] Replaces click_praticeExtra_btn
   * for the LP suite: that one clicks the FIRST tile on the page (its selector is shared with
   * ebook_btn) — positional (Invariant 2). The tile is scoped to the named card.
   */
  click_classComponent: async function (className, componentName) {
    await logger.logInto(await stackTrace.get(), "class:" + className + " component:" + componentName);
    var ds = selectorFile.css.ComproC1.dashboard;
    var tile = action.getNestedFilteredLocator(ds.learnerClassCard, className, ds.componentTile, componentName);
    var res = await action.waitForDisplayed(tile, 60000);
    if (true == res) res = await action.click(tile);
    if (true != res) return { pageStatus: false, provisioningShown: false };
    return await require("./practiceExtra.page.js").isInitialized_player();
  },

  /**
   * LP-027 (TST_DASH_TC_16): the SLE-granted component's tile and class card carry no expiry date,
   * and launching it shows the app's loading indicator before the player. [2026-09-23, prod]
   * The indicator is a SPINNER (`div.loader`, ~1 s), not a progress bar; it is polled every 100 ms
   * from the click until the player chrome shows, because it is gone again within a second.
   * Readiness = the activity title link (outer page, present for EVERY activity type) — NOT the
   * iframe, which the Practice Set does not use (a learner resuming at PS has no iframe).
   */
  launch_classComponent_watchLoading: async function (className, componentName) {
    await logger.logInto(await stackTrace.get(), "class:" + className + " component:" + componentName);
    var ds = selectorFile.css.ComproC1.dashboard;
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var card = action.getFilteredLocator(ds.learnerClassCard, className);
    var tile = action.getNestedFilteredLocator(ds.learnerClassCard, className, ds.componentTile, componentName);
    var out = { tileShown: false, expiryText: null, loaderSeen: false, playerShown: false };
    out.tileShown = true == (await action.waitForDisplayed(tile, 60000));
    if (!out.tileShown) return out;
    // Any "expir…" wording on the tile or its class card (prod shows none: "Practice Extra / Continue learning").
    var texts = [await action.getText(tile), await action.getText(card)].join("\n");
    var hit = texts.split("\n").filter(function (l) { return /expir/i.test(l); });
    out.expiryText = hit.length ? hit.join(" | ") : null;
    if (true != (await action.click(tile))) return out;
    // Measured 2026-09-23: loader visible from ~0.2 s to ~1.1 s after the click; 60 s bound for a slow first launch.
    var deadline = Date.now() + 60000;
    while (Date.now() < deadline) {
      if (!out.loaderSeen && true == (await action.isDisplayed(ds.learningPathLoader))) out.loaderSeen = true;
      if (true == (await action.isDisplayed(pe.activityTitleBtn))) { out.playerShown = true; break; }
      await browser.pause(100);
    }
    return out;
  },

  /**
   * LP-020 (TST_DASH_TC_15): a verified learner who has NOT yet accepted a class invite (so has no
   * class and no product). [2026-09-23, prod full run] Such a learner is NOT shown the dashboard: login
   * routes them straight to the Invitations page with the pending class listed. The landing (route +
   * this run's class listed) is the readiness signal, so an unfinished page cannot pass for an empty one;
   * then no class card and no component tile may be visible anywhere on it.
   */
  getData_learnerWithoutClass: async function (className, componentName) {
    await logger.logInto(await stackTrace.get(), "class:" + className + " component:" + componentName);
    var ds = selectorFile.css.ComproC1.dashboard;
    await action.waitForDocumentLoad();
    var landing = await require("./invitationNotification.page.js").getData_invitationsLanding(className);
    return {
      onInvitations: landing.onInvitations,
      classListed: landing.classListed,
      classCardShown: true == (await action.isDisplayed(ds.learnerClassCard)),
      componentShown: true == (await action.isDisplayed(action.getFilteredLocator(ds.componentTile, componentName))),
    };
  },

  /**
   * Closes the IntroJS guided tour if one shows after login, and reports whether the dashboard
   * is left usable. [2026-09-22, prod] The tour re-appears on EVERY fresh login of a new
   * teacher, and mounts ~1.8 s after the dashboard is ready — so it gets TOUR_LATE_MS to show
   * before we decide there is none. Anything clicked while it is up is swallowed.
   */
  close_introTourIfShown: async function () {
    await logger.logInto(await stackTrace.get());
    var ds = selectorFile.css.ComproC1.dashboard;
    var TOUR_LATE_MS = 5000;
    await action.waitForDisplayed(ds.introTourDialog, TOUR_LATE_MS);
    var tourShown = true == (await action.isDisplayed(ds.introTourDialog));
    if (tourShown) {
      await action.click(ds.introTourSkipBtn);
      await action.waitForDisplayed(ds.introTourDialog, 10000, true);
    }
    return { tourShown: tourShown, tourClosed: true != (await action.isDisplayed(ds.introTourDialog)) };
  },

  getData_dashboard: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      help_btn:
        (await action.getElementCount(this.help_btn)) > 0
          ? await action.getText(this.help_btn)
          : null,
    };
    console.log(obj);
    return obj;
  },

  getData_activeClasses: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    const ebook = await action.getKthElement(this.ebook_btn,  testdata[1].launchEbook);
    const res = await action.getText(ebook) ; 
    var obj;
    obj = {
      progress_btn:
        (await action.getElementCount(this.progress_btn)) > 0
          ? await action.getText(this.progress_btn)
          : null,
      praticeExtra_btn:
        (await action.getElementCount(this.praticeExtra_btn)) > 0
          ? await action.getText(this.praticeExtra_btn)
          : null,
      ebook_btn:
        ( await action.getElementCount(this.ebook_btn)) > 0
          ? await action.getText(ebook)
          : null,
      homework_btn:
        (await action.getElementCount(this.homework_btn)) > 0
          ? await action.getText(this.homework_btn)
          : null,
      myProgress_btn:
        (await action.getElementCount(this.myProgress_btn)) > 0
          ? await action.getText(this.myProgress_btn)
          : null,
    };
    return obj;
  },

  click_help_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.help_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " help_btn is clicked");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "help_btn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_progress_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.progress_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " progress_btn is clicked");
      res = await require("./progress.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "progress_btn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_praticeExtra_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    var res2 = {
      pageStatus: await action.waitForDisplayed(this.praticeExtra_btn),
    };
    res = await action.click(this.praticeExtra_btn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " praticeExtra_btn is clicked"
      );
      res = await require("./practiceExtra.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "praticeExtra_btn is NOT clicked",
        "error"
      );
    }
    console.log("Button", res);
    return res;
  },

  
  click_ebook_btn: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var res;
    console.log("this is testdata 131" , testdata)
    // [2026-06-11] Playwright migration: the dashboard eBook cards load LAZILY after the
    // dashboard shell. Wait for them to be present before picking the kth card, otherwise
    // getKthElement runs against an empty/partial list and the click flakily times out
    // (drawing/player TST_DASH_TC_5). Then settle briefly so the chosen card is interactive.
    await action.waitForDisplayed(this.ebook_btn, 30000);
    await browser.pause(1500);
    const kthElement = await action.getKthElement(this.ebook_btn, testdata.launchEbook);
    if (kthElement) {
      res = await action.click(kthElement);

      if (res === true) {
        await logger.logInto(
          await stackTrace.get(),
          "4th ebook_btn is clicked"
        );
        res = await require("./eBook.page.js").isInitialized();
      } else {
        await logger.logInto(
          await stackTrace.get(),
          res + " - 4th ebook_btn is NOT clicked",
          "error"
        );
      }
    } else {
      await logger.logInto(
        await stackTrace.get(),
        "4th ebook_btn could not be found",
        "error"
      );
      res = null;
    }

    return res;
  },

  click_homework_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.homework_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " homework_btn is clicked");
      res = await require("./myHomework.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "homework_btn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_myProgress_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.myProgress_btn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " myProgress_btn is clicked"
      );
      res = await require("./myProgress.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "myProgress_btn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_createNewClass: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.createNewClass);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        ' createNewClass is clicked'
      );
      browser.pause(10000);
      res = await require('./createNewClass.page').isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'createNewClass is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_activeClassCard: async function (value) {
    await logger.logInto(await stackTrace.get());
    var res;
    await action.waitForDocumentLoad();
    var classSelector = this.activeClassCard.replace('{CLASS_NAME}',value);
    res = await action.click(classSelector);
    console.log('RES VAL', res);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        ' activeClassCard is clicked'
      );
      res = await require('./activeClass.page').isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'activeClassCard is NOT clicked',
        'error'
      );
    }
    console.log('RES VAL BEFORE RETURN', res);
    return res;
  },

};