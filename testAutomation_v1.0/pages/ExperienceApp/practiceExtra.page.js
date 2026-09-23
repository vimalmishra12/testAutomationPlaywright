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

  // ---------------------------------------------------------------------------------------------
  // LP batch 2 (LP-007…011, 014, 015, 018, 019, 026) — grounded live on production 2026-09-23.
  // TOC model: UNIT view (#unitViewCrossBtn, `.unit-level-item` rows) ⇄ LESSON view
  // (#lessonViewCrossBtn, a Lesson accordion listing the activities). The open control opens the
  // lesson view of the current activity; "Go to unit view" (#lessonViewBackBtn) goes up a level.
  // Opening an activity from the TOC leaves the TOC OPEN. Only one sidebar element ever exists.
  // ---------------------------------------------------------------------------------------------

  /** TOC activity row by its exact title (e.g. "Flashcards.zip", "PS"). */
  activityRow: function (name) {
    return selectorFile.css.ComproC1.practiceExtra.tocActivity.replace(/\{NAME\}/g, name);
  },

  /** Which activities of `names` are visible in the TOC right now. */
  getData_tocActivities: async function (names) {
    await logger.logInto(await stackTrace.get(), "names:" + names.join(" | "));
    var shown = [];
    for (var i = 0; i < names.length; i++) {
      if (true == (await action.isDisplayed(this.activityRow(names[i])))) shown.push(names[i]);
    }
    return { shown: shown };
  },

  /**
   * HOUSEKEEPING (TC_101): TOC open at the UNIT view. From a closed TOC it opens (lesson view on any
   * entry but the first), then goes up with "Go to unit view".
   */
  ensure_tocUnitView: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    if (true != (await action.isDisplayed(pe.tocSidebar))) {
      await action.click(pe.tocOpenBtn);
      await action.waitForDisplayed(pe.tocSidebar, 10000);
    }
    if (true == (await action.isDisplayed(pe.tocLessonViewCloseBtn))) {
      await action.click(pe.tocGoToUnitViewBtn);
    }
    return { unitView: true == (await action.waitForDisplayed(pe.tocUnitViewCloseBtn, 10000)) };
  },

  /** "Go to unit view" from the lesson view (LP-026). Success = unit view shown, lesson view gone. */
  click_goToUnitView: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var res = await action.click(pe.tocGoToUnitViewBtn);
    return {
      unitView: true == res && true == (await action.waitForDisplayed(pe.tocUnitViewCloseBtn, 10000)),
      lessonViewHidden: true == (await action.waitForDisplayed(pe.tocLessonViewCloseBtn, 10000, true)),
    };
  },

  /** Drills into a unit from the unit view (LP-007): the lesson view replaces the unit list. */
  click_tocUnit: async function (unitName) {
    await logger.logInto(await stackTrace.get(), "unit:" + unitName);
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var res = await action.click(action.getFilteredLocator(pe.tocUnitItem, unitName));
    return {
      lessonView: true == res && true == (await action.waitForDisplayed(pe.tocLessonViewCloseBtn, 10000)),
      unitListHidden: true == (await action.waitForDisplayed(pe.tocUnitViewCloseBtn, 10000, true)),
    };
  },

  /**
   * Toggles a lesson accordion (LP-026) and waits for `probeActivity` to reach the state the toggle
   * should produce (Bootstrap collapse — hidden when collapsed). Returns the probe's visibility after.
   */
  toggle_tocLesson: async function (lessonName, probeActivity) {
    await logger.logInto(await stackTrace.get(), "lesson:" + lessonName);
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var row = this.activityRow(probeActivity);
    var wasShown = true == (await action.isDisplayed(row));
    var res = await action.click(action.getFilteredLocator(pe.tocLessonToggle, lessonName));
    if (true == res) await action.waitForDisplayed(row, 10000, wasShown);
    return { clicked: true == res, wasShown: wasShown, isShown: true == (await action.isDisplayed(row)) };
  },

  /**
   * LP-019: activates the TOC open control from the KEYBOARD. While the TOC is open the control is
   * covered by the sidebar, so a mouse cannot reach it — a keyboard user can. [2026-09-23, prod] The
   * control is a TOGGLE: activating it while open CLOSES the TOC. Waits (≤10 s) for the state to
   * change, so "nothing happened" comes back as isOpen === wasOpen. Also counts visible sidebars.
   */
  keyboard_toggleToc: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var wasOpen = true == (await action.isDisplayed(pe.tocSidebar));
    var res = await action.focus(pe.tocOpenBtn);
    if (true == res) res = await action.pressKey(pe.tocOpenBtn, "Enter");
    if (true == res) await action.waitForDisplayed(pe.tocSidebar, 10000, wasOpen);
    return {
      pressed: true == res,
      wasOpen: wasOpen,
      isOpen: true == (await action.isDisplayed(pe.tocSidebar)),
      visibleSidebars: await action.getElementCount(pe.tocSidebar + ":visible"),
    };
  },

  /**
   * Opens an activity from the (open) TOC (LP-008/010) and waits until the player's activity title
   * reads its name — the one signal every activity type shares (the PS has no iframe).
   */
  open_tocActivity: async function (name) {
    await logger.logInto(await stackTrace.get(), "activity:" + name);
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var res = await action.click(this.activityRow(name));
    var title = null;
    var deadline = Date.now() + 30000;
    while (true == res && Date.now() < deadline) {
      title = await action.getAttribute(pe.activityTitleBtn, "title");
      if (title === name) break;
      await browser.pause(250);
    }
    return { clicked: true == res, title: title };
  },

  /** Flashcards deck state (inside the activity iframe): card count and the current card (0-based). */
  getData_deck: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    await action.switchToFrame(pe.playerIframe);
    var out = { loaded: true == (await action.waitForDisplayed(pe.deckStep, 30000)), steps: 0, current: -1 };
    if (out.loaded) {
      out.steps = await action.getElementCount(pe.deckStep);
      out.current = await this._deckCurrent(out.steps);
    }
    await action.switchToParentFrame();
    return out;
  },

  /** 0-based index of `li.step.current` (caller has switched into the iframe). */
  _deckCurrent: async function (steps) {
    var pe = selectorFile.css.ComproC1.practiceExtra;
    for (var k = 1; k <= steps; k++) {
      if ((await action.getElementCount(pe.deckStepCurrentAt.replace(/\{K\}/g, String(k)))) > 0) return k - 1;
    }
    return -1;
  },

  /**
   * LP-009: pages the Flashcards deck from its FIRST card to its LAST with the outer Next, and records
   * whether any grading control (outer Check `a.green-btn`, in-activity `a.btn-check`) is ever visible.
   * - The deck remembers where a learner left it, so it is first rewound with Previous (setup).
   * - The loop is driven by the deck's own state (`li.step.current` reaching the last step), not a
   *   fixed click count (LP-017).
   * - [measured 2026-09-23, prod] A Next click within ~1.8 s of the previous card change is IGNORED
   *   (≥ 2.0 s always accepted), and nothing observable marks the end of that window — so each
   *   card change is followed by a sanctioned DECK_SETTLE_MS pause (Invariant 1).
   * - The Next after the last card leaves for the next activity, so the loop stops ON the last card.
   */
  page_deckToEnd: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var DECK_SETTLE_MS = 2500;
    var self = this;
    var out = { steps: 0, startIndex: -1, endIndex: -1, paged: 0, gradingSeen: false, stuckAt: null };
    var deck = await this.getData_deck();
    out.steps = deck.steps;
    var current = deck.current;
    // One step of the deck in either direction; true when the current card moved to `target`.
    async function step(btn, target) {
      if (true == (await action.isDisplayed(pe.checkBtn))) out.gradingSeen = true;
      var res = await action.click(btn);
      await action.switchToFrame(pe.playerIframe);
      if (true == res) res = await action.waitForDisplayed(pe.deckStepCurrentAt.replace(/\{K\}/g, String(target + 1)), 15000);
      if (true == (await action.isDisplayed(pe.activityCheckInner))) out.gradingSeen = true;
      await action.switchToParentFrame();
      if (true == res) await browser.pause(DECK_SETTLE_MS);
      return true == res;
    }
    // Setup: rewind to the first card.
    while (current > 0) {
      if (!(await step(pe.prevBtn, current - 1))) { out.stuckAt = "rewind at card " + (current + 1); return out; }
      current--;
    }
    out.startIndex = current;
    while (current >= 0 && current < out.steps - 1) {
      if (!(await step(pe.nextBtn, current + 1))) { out.stuckAt = "card " + (current + 1); break; }
      current++;
      out.paged++;
    }
    await action.switchToFrame(pe.playerIframe);
    out.endIndex = await self._deckCurrent(out.steps);
    if (true == (await action.isDisplayed(pe.activityCheckInner))) out.gradingSeen = true;
    await action.switchToParentFrame();
    if (true == (await action.isDisplayed(pe.checkBtn))) out.gradingSeen = true;
    return out;
  },

  /** The Practice Set answer screen (LP-010): editor, Submit (and its state), word count. */
  getData_psScreen: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var editorShown = true == (await action.waitForDisplayed(pe.psEditor, 30000));
    return {
      editorShown: editorShown,
      editorText: editorShown ? (await action.getText(pe.psEditor)).trim() : null,
      submitShown: true == (await action.isDisplayed(pe.psSubmitBtn)),
      submitClass: await action.getAttribute(pe.psSubmitBtn, "class"),
      wordCount: editorShown ? (await action.getText(pe.psWordCount)).trim() : null,
    };
  },

  /**
   * LP-014: Submit with an EMPTY editor. [2026-09-23, prod] Submit is disabled by CSS class only
   * (`btn disabled`, no `disabled` attribute), so the click is attempted with a SHORT timeout — a
   * pointer-events:none button makes Playwright wait for it — and the outcome is read from the app:
   * the "Ready to submit?" dialog must not open. The click result is reported, not relied on.
   */
  click_psSubmitWhenEmpty: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var before = await this.getData_psScreen();
    var clickRes = await action.click(pe.psSubmitBtn, { timeout: 3000 });
    // The dialog, when it does open, is visible within ~1 s (probe 2026-09-23); 5 s bound.
    var dialogShown = true == (await action.waitForDisplayed(pe.psReadyToSubmitTitle, 5000));
    return {
      editorEmpty: before.editorShown && before.editorText === "",
      submitClass: before.submitClass,
      clickLanded: true == clickRes,
      dialogShown: dialogShown,
      attemptedShown: true == (await action.isDisplayed(pe.psAttemptedAnswer)),
    };
  },

  /**
   * LP-011: type an answer, Submit, confirm in "Ready to submit?". ONE ATTEMPT PER LEARNER.
   * Submit becomes enabled (class loses `disabled`) once the editor has text. Submitted state = SOURCE's
   * `div.attempted-answer`, verified live 2026-09-23: it holds the answer text; TOC: "evaluation pending".
   */
  submit_ps: async function (answer) {
    await logger.logInto(await stackTrace.get(), "answer:" + answer);
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var out = { typed: false, submitEnabled: false, confirmShown: false, confirmClosed: false, attemptedShown: false };
    var res = await action.click(pe.psEditor);
    if (true == res) res = await action.addValue(pe.psEditor, answer);
    out.typed = true == res;
    var deadline = Date.now() + 5000;
    while (out.typed && Date.now() < deadline) {
      if (!/\bdisabled\b/.test((await action.getAttribute(pe.psSubmitBtn, "class")) || "")) { out.submitEnabled = true; break; }
      await browser.pause(200);
    }
    if (!out.submitEnabled) return out;
    if (true != (await action.click(pe.psSubmitBtn))) return out;
    out.confirmShown = true == (await action.waitForDisplayed(pe.psReadyToSubmitTitle, 10000));
    if (!out.confirmShown) return out;
    if (true != (await action.click(pe.psConfirmSubmitBtn))) return out;
    out.confirmClosed = true == (await action.waitForDisplayed(pe.psConfirmModal, 15000, true));
    out.attemptedShown = true == (await action.waitForDisplayed(pe.psAttemptedAnswer, 30000));
    // [2026-09-23, prod] The submitted state shows the answer read-only; editor and Submit are removed.
    out.attemptedText = out.attemptedShown ? (await action.getText(pe.psAttemptedAnswer)).trim() : null;
    return out;
  },

  /**
   * LP-015: leave the (submitted) PS for another activity via the TOC, come back, and report what the
   * PS shows. Opens the TOC first if it is closed; opening an activity leaves the TOC open.
   */
  revisit_activity: async function (awayName, backName) {
    await logger.logInto(await stackTrace.get(), "away:" + awayName + " back:" + backName);
    var pe = selectorFile.css.ComproC1.practiceExtra;
    if (true != (await action.isDisplayed(pe.tocSidebar))) await this.click_openToc();
    var away = await this.open_tocActivity(awayName);
    if (true != (await action.isDisplayed(pe.tocSidebar))) await this.click_openToc();
    var back = await this.open_tocActivity(backName);
    var attemptedShown = back.title === backName && true == (await action.waitForDisplayed(pe.psAttemptedAnswer, 30000));
    return {
      awayTitle: away.title,
      backTitle: back.title,
      attemptedShown: attemptedShown,
      attemptedText: attemptedShown ? (await action.getText(pe.psAttemptedAnswer)).trim() : null,
      editorShown: true == (await action.isDisplayed(pe.psEditor)),
      submitShown: true == (await action.isDisplayed(pe.psSubmitBtn)),
    };
  },

  /**
   * LP-018: the lesson-view close control. [2026-09-23, prod] It closes the TOC ONLY — the learner stays
   * in the Learning Path on the same activity (the scenario sheet assumed it left the player).
   */
  click_closeLessonView: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var wasLessonView = true == (await action.isDisplayed(pe.tocLessonViewCloseBtn));
    var titleBefore = await action.getAttribute(pe.activityTitleBtn, "title");
    var res = await action.click(pe.tocLessonViewCloseBtn);
    var tocHidden = true == res && true == (await action.waitForDisplayed(pe.tocSidebar, 10000, true));
    var url = await browser.getUrl();
    return {
      wasLessonView: wasLessonView,
      tocHidden: tocHidden,
      inLearningPath: /\/learning-path\//.test(url),
      sameActivity: (await action.getAttribute(pe.activityTitleBtn, "title")) === titleBefore,
    };
  },

  /** LP-018 (the way OUT): the player's Back link returns the learner to the learner dashboard. */
  click_back: async function () {
    await logger.logInto(await stackTrace.get());
    var pe = selectorFile.css.ComproC1.practiceExtra;
    var res = await action.click(pe.backBtn);
    return { onDashboard: true == res && true == (await action.waitForUrl(/\/dashboard\/learner\/dashboard/, 30000)) };
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
