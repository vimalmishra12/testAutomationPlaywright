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
  // [2026-09-22] The loader overlay absorbs clicks on already-visible elements, so it is part of
  // this page's readiness. Resolved from the selector file rather than inlined (Rule 2 /
  // experience-shared.md B1).
  pageLoader: selectorFile.css.ComproC1.dashboard.pageLoader,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.help_btn),
    };
    return res;
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
    console.log("this is testdata 131" , testdata);

    // [2026-09-22] Wait for the loader overlay to clear before clicking a card. Third argument of
    // waitForDisplayed is `reverse` (baseActionLibrary.js:259) -> waits for state "hidden".
    // Gated on isDisplayed so a page with no loader costs one visibility read, not a full timeout.
    if (await action.isDisplayed(this.pageLoader)) {
      await action.waitForDisplayed(this.pageLoader, 15000, true);
    }

    // Wait for the dashboard cards to render
    await action.waitForDisplayed(this.ebook_btn, 30000);
    const targetIdx = parseInt(testdata.launchEbook, 10);
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      const count = await action.getElementCount(this.ebook_btn);
      // getElementCount returns the caught Error when the read itself fails (ADR-009), and
      // `Error > n` is false — unguarded, a failed read spins to the deadline instead of
      // reporting the failure. Same guard as schoolClasses.page.js:324.
      if (typeof count !== "number") {
        await logger.logInto(
          await stackTrace.get(),
          count + " ebook_btn count read failed; abandoning the wait",
          "error"
        );
        break;
      }
      if (count > targetIdx) break;
      await browser.pause(500);
    }
    await browser.pause(1500);

    const kthElement = await action.getKthElement(this.ebook_btn, testdata.launchEbook);
    if (kthElement) {
      await action.scrollIntoView(kthElement);
      await browser.pause(500);
      res = await action.click(kthElement);

      if (res === true) {
        await logger.logInto(
          await stackTrace.get(),
          "4th ebook_btn is clicked"
        );
        const eBookPage = require("./eBook.page.js");
        // WORKAROUND — the loader overlay / late card render absorbs this click, so the reader may
        // not start even though the click returned true. Invariant 14: a click that a real user
        // would also lose is a candidate product defect — reported, not papered over. Marked so it
        // is removable once the behaviour is classified (experience-shared.md B2/B3).
        let launched = await action.waitForDisplayed(eBookPage.homeButton, 8000);
        if (launched !== true) {
          console.log("⚠️ eBook reader not detected after 8s; re-clicking eBook card...");
          const retryKth = await action.getKthElement(this.ebook_btn, testdata.launchEbook);
          if (retryKth) {
            await action.click(retryKth);
          }
        }
        // isInitialized() after EVERY successful navigating click, including the first attempt
        // (Rule 4 / Invariant 5). Returning { pageStatus: true } on the happy path meant a click
        // that landed on the wrong card still reported success.
        res = await eBookPage.isInitialized();
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