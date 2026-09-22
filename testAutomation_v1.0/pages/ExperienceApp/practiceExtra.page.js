"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
  practice_extra: selectorFile.css.ComproC1.practiceExtra.practice_extra,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.practice_extra),
    };
    return res;
  },

  /**
   * Readiness of the Learning Path PLAYER (module PEXT, LP migration 2026-09-22). Kept separate from
   * isInitialized(), whose legacy anchor (h2.mb-0) serves DASH_TC_4's suites.
   * A learner's FIRST launch can show "We're setting up the learning materials for you" before the
   * player (SOURCE: up to ~3 min on thor). It is given 5 s to appear; if it does, we wait for it to
   * clear, then for the activity iframe.
   */
  isInitialized_player: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    await action.waitForDocumentLoad();
    var provisioningShown = true == (await action.waitForDisplayed(pe.provisioningMessage, 5000));
    if (provisioningShown) await action.waitForDisplayed(pe.provisioningMessage, 180000, true);
    return {
      pageStatus: true == (await action.waitForDisplayed(pe.playerIframe, 60000)),
      provisioningShown: provisioningShown,
    };
  },

  /** What the player shows right now: the activity iframe and the TOC sidebar (LP-001). */
  getData_player: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    return {
      iframeShown: true == (await action.isDisplayed(pe.playerIframe)),
      // Informational only: the TOC self-opens on a learner's FIRST entry, not later ones.
      tocShown: true == (await action.isDisplayed(pe.tocSidebar)),
    };
  },

  /**
   * Opens the TOC sidebar (LP-005). The sidebar stays in the DOM when closed (the app toggles
   * `d-none`), so the result is a VISIBILITY wait, never a presence check (Invariant 15).
   */
  click_openToc: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var res = await action.click(pe.tocOpenBtn);
    return { tocShown: true == res && true == (await action.waitForDisplayed(pe.tocSidebar, 10000)) };
  },

  /**
   * HOUSEKEEPING: leaves the TOC closed whatever state the player opened in, so the open/close
   * TCs start from one known state. [2026-09-22, prod trace] The TOC opens by itself only on a
   * learner's FIRST entry (unit view); later entries start closed. The two TOC views have different
   * close buttons (#unitViewCrossBtn / #lessonViewCrossBtn) — tocCloseBtn matches both by aria-label.
   */
  ensure_tocClosed: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var wasOpen = true == (await action.isDisplayed(pe.tocSidebar));
    if (wasOpen) {
      await action.click(pe.tocCloseBtn);
      await action.waitForDisplayed(pe.tocSidebar, 10000, true);
    }
    return { wasOpen: wasOpen, tocClosed: true != (await action.isDisplayed(pe.tocSidebar)) };
  },

  /** Closes the TOC sidebar (LP-006); success = the sidebar becomes hidden (`d-none`). */
  click_closeToc: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var res = await action.click(pe.tocCloseBtn);
    return { tocHidden: true == res && true == (await action.waitForDisplayed(pe.tocSidebar, 10000, true)) };
  },

  /**
   * Scorable activity (LP-002/003): answers every rich dropdown of frame `frameIndex` (0-based) in
   * order, then clicks Check. Mirrors SOURCE LearningpathPage.submitScorable / openAndSelect.
   * - The activity lives in an iframe; Check/Next are on the OUTER page (switch back first).
   * - A rich dropdown CLOSES when the page scrolls, so the option is clicked at its centre
   *   without scrolling (action.clickAtCenter). Frames 3/4 hold four dropdowns with the SAME
   *   options, so the option is addressed inside the n-th dropdown.
   * - A dropdown is "registered" when the frame gains another `.wrapper-dropdown.filled`.
   * ONE ATTEMPT PER LEARNER: progress is saved as we go — a half-done activity is not offered fresh.
   */
  answer_frame: async function (frameIndex, answers) {
    await logger.logInto(await stackTrace.get(), "frame:" + frameIndex + " answers:" + answers.join(" | "));
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var n = String(frameIndex);
    var dropdownSel = pe.frameDropdown.replace(/\{N\}/g, n);
    var filledSel = pe.frameDropdownFilled.replace(/\{N\}/g, n);
    var out = { frameShown: false, dropdownCount: 0, filledCount: 0, checked: false };

    await action.switchToFrame(pe.playerIframe);
    out.frameShown = true == (await action.waitForDisplayed(pe.frameWrap.replace(/\{N\}/g, n), 30000))
      && true == (await action.waitForDisplayed(dropdownSel, 30000));
    if (!out.frameShown) { await action.switchToParentFrame(); return out; }
    out.dropdownCount = await action.getElementCount(dropdownSel);

    for (var k = 0; k < answers.length; k++) {
      var escaped = answers[k].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var option = action.getNthNestedFilteredLocator(dropdownSel, k, pe.dropdownOption, new RegExp("^\\s*" + escaped + "\\s*$"));
      var res = await action.click(await action.getKthElement(dropdownSel, k));
      if (true == res) res = await action.waitForDisplayed(option, 15000);
      // The list animates open; SOURCE measured ~300 ms before a centre click lands reliably.
      // Nothing observable marks "animation done", so this is a sanctioned short pause (Invariant 1).
      if (true == res) await browser.pause(300);
      if (true == res) res = await action.clickAtCenter(option);
      if (true != res) break;
      // Registered = one more filled dropdown in this frame (bounded; SOURCE allowed 30 s).
      var deadline = Date.now() + 30000;
      while (Date.now() < deadline && (await action.getElementCount(filledSel)) < k + 1) await browser.pause(250);
    }
    out.filledCount = await action.getElementCount(filledSel);
    await action.switchToParentFrame();
    out.checked = true == (await action.click(pe.checkBtn));
    return out;
  },

  /** Next (outer page) → the following frame / the result screen. */
  click_next: async function () {
    await logger.logInto(await stackTrace.get());
    await action.switchToParentFrame();
    return await action.click(selectorFile.css.ComproC1.practiceExtra.nextBtn);
  },

  /** The result screen's score line (p.score, outer page), e.g. "Amazing! You scored 4 out of 4". */
  getData_score: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    await action.switchToParentFrame();
    if (true != (await action.waitForDisplayed(pe.scoreMessage, 30000))) return { scoreText: null };
    return { scoreText: (await action.getText(pe.scoreMessage)).trim() };
  },

  getData_practiceExtra: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      practice_extra:
        (await action.getElementCount(this.practice_extra)) > 0
          ? await action.getText(this.practice_extra)
          : null,
      my_homework:
        (await action.getElementCount(this.my_homework)) > 0
          ? await action.getText(this.my_homework)
          : null,
    };
    return obj;
  },
};
