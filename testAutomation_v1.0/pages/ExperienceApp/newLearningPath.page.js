"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

/**
 * Module NLPP — the New Learning Path (NLP) player, e.g. the "Projects" component of cqaautomationbundle1
 * (product cqaautomationpr1). Grounded live on production 2026-09-25 — see
 * product-knowledge/ExperienceApp/new-learning-path.md.
 *
 * What differs from the classic Learning Path (practiceExtra.page.js):
 * - Route /nlp/<role>/… ; the TOC is a single vertical PAGE (Unit → Lesson → numbered activities), not a
 *   slide-out sidebar. Opening an activity replaces the TOC with an activity view (/view/item/…) whose header
 *   holds only the logo and "Close Activity" (×); × returns to the TOC.
 * - A learner's FIRST launch of a product goes through /createUA with "We're setting up the learning materials
 *   for you" and a percentage PROGRESS BAR (measured ~64 s to 100 % on prod) — per product, not per learner.
 * - A finished scorable REOPENS as a fresh attempt (the classic LP does not offer it again).
 * What is the SAME: the activity engine inside #content-course-ext (frames, rich dropdowns, Check/Next, the
 * Flashcards deck, the Practice Set editor/Submit/confirm ids) — those steps delegate to practiceExtra.page.js
 * rather than duplicating its mechanics (dropdown centre-click, deck settle time, CSS-only-disabled Submit).
 */
module.exports = {
  tocWrapper: selectorFile.css.ComproC1.newLearningPath.tocWrapper,

  /**
   * NLP TOC page ready. On a learner's first launch the provisioning screen shows first: it is given 5 s to
   * appear and then up to `provisioningTimeoutMs` (default 300 s; measured ~64 s to reach 100 %) to clear.
   * Ready = the TOC's first unit row is visible (the page has no other stable anchor before it renders).
   */
  isInitialized: async function (provisioningTimeoutMs) {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    await action.waitForDocumentLoad();
    var provisioningShown = true == (await action.waitForDisplayed(nl.provisioningScreen, 5000));
    if (provisioningShown) await action.waitForDisplayed(nl.provisioningScreen, provisioningTimeoutMs || 300000, true);
    return {
      pageStatus: true == (await action.waitForDisplayed(nl.unitRow, 60000)),
      provisioningShown: provisioningShown,
    };
  },

  /** TOC row of an activity by its TOC label, which carries its number (e.g. "1. BASE04_Dropdown_Scorable.zip"). */
  activityRow: function (label) {
    return selectorFile.css.ComproC1.newLearningPath.activityRow.replace(/\{NAME\}/g, label);
  },

  /** Normalised text (whitespace squashed) of the first match, or null when absent / not visible. */
  _text: async function (sel) {
    if (true != (await action.isDisplayed(sel))) return null;
    var t = await action.getText(sel);
    return typeof t === "string" ? t.replace(/\s+/g, " ").trim() : null;
  },

  /**
   * TC-NLP-001/016: what the TOC page shows — product and component titles, the numbered unit, the lesson,
   * the numbered activities IN ORDER, which rows carry a medal (scorable types), the connector dots between
   * rows, and whether the unit is expanded. Read on the TOC page (not inside an activity).
   */
  getData_toc: async function () {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = { tocShown: false, productTitle: null, componentTitle: null, unitText: null, unitNumber: null, unitExpanded: null, lessonName: null, activities: [], medalRows: [], connectors: 0 };
    out.tocShown = true == (await action.waitForDisplayed(nl.unitRow, 30000));
    if (!out.tocShown) return out;
    out.productTitle = await this._text(nl.productTitle);
    out.componentTitle = await this._text(nl.componentTitle);
    out.unitText = await this._text(nl.unitRow);
    out.unitNumber = await this._text(nl.unitNumber);
    out.unitExpanded = await action.getAttribute(nl.unitRow, "aria-expanded");
    out.lessonName = await this._text(nl.lessonName);
    var n = await action.getElementCount(nl.anyActivity);
    for (var k = 0; k < n; k++) {
      var row = await action.getKthElement(nl.anyActivity, k);
      var label = row ? await action.getAttribute(row, "aria-label") : null;
      out.activities.push(label);
      if (label && (await action.getElementCount(nl.activityMedalImg.replace(/\{NAME\}/g, label))) > 0) out.medalRows.push(label);
    }
    out.connectors = await action.getElementCount(nl.activityConnector);
    return out;
  },

  /**
   * TC-NLP-016: clicks the unit header (Bootstrap collapse) and waits for `probeActivity` to reach the state the
   * toggle should produce. Returns the probe's visibility and the header's aria-expanded after the toggle.
   */
  toggle_unit: async function (unitName, probeActivity) {
    await logger.logInto(await stackTrace.get(), "unit:" + unitName);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var row = this.activityRow(probeActivity);
    var wasShown = true == (await action.isDisplayed(row));
    var header = action.getFilteredLocator(nl.unitRow, unitName);
    var res = await action.click(header);
    // Bootstrap's collapse animates (~0.35 s); the wait returns as soon as the probe row reaches the new state.
    if (true == res) await action.waitForDisplayed(row, 10000, wasShown);
    return {
      clicked: true == res,
      wasShown: wasShown,
      isShown: true == (await action.isDisplayed(row)),
      expanded: await action.getAttribute(header, "aria-expanded"),
    };
  },

  /**
   * Opens an activity from the TOC page and waits for the activity view to name it (h1.open-sidebar title =
   * the activity name WITHOUT its TOC number). Every activity type has this header (the PS has no iframe).
   */
  open_activity: async function (label, title) {
    await logger.logInto(await stackTrace.get(), "activity:" + label);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    // The TOC is only reachable from the TOC page: when another activity is open, close it first (×).
    if (true == (await action.isDisplayed(nl.closeActivityBtn))) await this.click_closeActivity();
    var res = await action.waitForDisplayed(this.activityRow(label), 30000);
    if (true == res) res = await action.click(this.activityRow(label));
    var shownTitle = null;
    if (true == res && true == (await action.waitForDisplayed(nl.activityTitle, 30000))) {
      var deadline = Date.now() + 30000;
      while (Date.now() < deadline) {
        shownTitle = await action.getAttribute(nl.activityTitle, "title");
        if (shownTitle === title) break;
        await browser.pause(250);
      }
    }
    return {
      clicked: true == res,
      title: shownTitle,
      inActivityView: /\/view\/item\//.test(await browser.getUrl()),
      closeShown: true == (await action.isDisplayed(nl.closeActivityBtn)),
    };
  },

  /** "Close Activity" (×) — back to the TOC page: the URL drops /view/item and the TOC rows render again. */
  click_closeActivity: async function () {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var res = await action.click(nl.closeActivityBtn);
    var tocShown = true == res && true == (await action.waitForDisplayed(nl.anyActivity, 30000));
    var url = await browser.getUrl();
    return { tocShown: tocShown, onToc: /\/nlp\//.test(url) && !/\/view\/item\//.test(url), url: url };
  },

  /**
   * TC-NLP-017: an activity's state as the TOC shows it — in-progress icon, completed tick, the medal's state
   * class (lch-medal-not-started / -abovethreshold / …) — and the unit's status line (e.g. "In progress").
   */
  getData_activityState: async function (label) {
    await logger.logInto(await stackTrace.get(), "activity:" + label);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var name = function (s) { return s.replace(/\{NAME\}/g, label); };
    await action.waitForDisplayed(this.activityRow(label), 30000);
    var medal = (await action.getElementCount(name(nl.activityMedalState))) > 0 ? await action.getAttribute(name(nl.activityMedalState), "class") : null;
    return {
      inProgress: (await action.getElementCount(name(nl.activityInProgressIcon))) > 0,
      completed: (await action.getElementCount(name(nl.activityCompletedTick))) > 0,
      medalState: medal,
      unitStatus: await this._text(nl.unitStatus),
    };
  },

  /**
   * TC-NLP-003/004: answers frame `frameIndex` and clicks Check — the activity engine is the classic LP one,
   * so this delegates to practiceExtra.answer_frame (centre-click on the rich dropdown, filled-count wait).
   */
  answer_frame: async function (frameIndex, answers) {
    await logger.logInto(await stackTrace.get(), "frame:" + frameIndex);
    return await require("./practiceExtra.page.js").answer_frame(frameIndex, answers);
  },

  /** Next (outer page, a.green-btn titled Next) → the following frame or the result screen. */
  click_next: async function () {
    await logger.logInto(await stackTrace.get());
    await action.switchToParentFrame();
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var res = await action.waitForDisplayed(nl.nextBtn, 15000);
    if (true == res) res = await action.click(nl.nextBtn);
    return res;
  },

  /**
   * TC-NLP-017: the reopened scorable — which frame it lands on and whether frame `frameIndex` kept its checked
   * answers (`.wrapper-dropdown.filled` / `.rich-dropdown.checked-correct`), and whether it offers Next to carry on.
   */
  getData_frameState: async function (frameIndex) {
    await logger.logInto(await stackTrace.get(), "frame:" + frameIndex);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var n = String(frameIndex);
    var out = { frameShown: false, filledCount: -1, correctCount: -1, nextShown: false };
    await action.switchToFrame(nl.playerIframe);
    out.frameShown = true == (await action.waitForDisplayed(nl.frameWrap.replace(/\{N\}/g, n), 30000));
    if (out.frameShown) {
      out.filledCount = await action.getElementCount(nl.frameDropdownFilled.replace(/\{N\}/g, n));
      out.correctCount = await action.getElementCount(nl.frameCheckedCorrect.replace(/\{N\}/g, n));
    }
    await action.switchToParentFrame();
    // A checked frame offers Next (not Check); the chrome renders with the frame, 10 s bound.
    out.nextShown = true == (await action.waitForDisplayed(nl.nextBtn, 10000));
    return out;
  },

  /** TC-NLP-004: the result screen — heading ("Amazing!") and score line; and whether "Next activity" is offered. */
  getData_result: async function () {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    await action.switchToParentFrame();
    var shown = true == (await action.waitForDisplayed(nl.scoreMessage, 30000));
    return {
      shown: shown,
      heading: shown ? await this._text(nl.resultHeading) : null,
      scoreText: shown ? await this._text(nl.scoreMessage) : null,
      // resultScreen-1 is pre-rendered and hidden elsewhere — visibility, never presence (Invariant 15).
      nextActivityShown: true == (await action.isDisplayed(nl.resultNextActivityBtn)),
    };
  },

  /** Waits (≤ 30 s) for the activity view to name `title`; returns the title shown last. */
  _waitForActivityTitle: async function (title) {
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var shown = null;
    var deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      if (true == (await action.isDisplayed(nl.activityTitle))) {
        shown = await action.getAttribute(nl.activityTitle, "title");
        if (shown === title) break;
      }
      await browser.pause(250);
    }
    return shown;
  },

  /** TC-NLP-005: the result screen's "Next activity" bridges to the next activity (Flashcards). */
  click_resultNextActivity: async function (expectedTitle) {
    await logger.logInto(await stackTrace.get(), "expected:" + expectedTitle);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var res = await action.click(nl.resultNextActivityBtn);
    return { clicked: true == res, title: true == res ? await this._waitForActivityTitle(expectedTitle) : null };
  },

  /**
   * TC-NLP-005: pages the Flashcards deck to its last card (practiceExtra.page_deckToEnd — deck-state driven,
   * 2.5 s settle per card: a Next within ~1.8 s of a card change is ignored) and reports whether the
   * "NEXT ACTIVITY" bridge is then offered.
   */
  page_deckToBridge: async function () {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var deck = await require("./practiceExtra.page.js").page_deckToEnd();
    // page_deckToEnd's gradingSeen is NOT valid here: in NLP the deck's own Next/Previous are a.green-btn too,
    // which is the classic LP's Check selector. Grading is read as a visible button titled Check instead.
    delete deck.gradingSeen;
    deck.checkShown = true == (await action.isDisplayed(nl.checkBtn));
    deck.bridgeShown = true == (await action.waitForDisplayed(nl.nextActivityBtn, 10000));
    return deck;
  },

  /**
   * TC-NLP-001/002: follows a launch from the dashboard tile until the NLP TOC renders, sampling every 200 ms
   * what the learner sees on the way: the app loader, the one-time provisioning screen ("We're setting up the
   * learning materials for you") and its progress bar — whose highest percentage is recorded (read from the
   * bar's style width; its aria-valuenow stays 0 on prod). Measured on prod 2026-09-25: loader ~0.4 s, then
   * provisioning from ~1.5 s, 80 % at 60 s, 100 % at ~64 s. `loaderSel` is the dashboard's loader (caller's page).
   */
  watch_launch: async function (loaderSel, timeoutMs) {
    await logger.logInto(await stackTrace.get(), "timeout:" + timeoutMs);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = { loaderSeen: false, provisioningSeen: false, progressBarSeen: false, maxPercent: -1, tocShown: false, waitedMs: 0, route: null };
    var start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (!out.loaderSeen && true == (await action.isDisplayed(loaderSel))) out.loaderSeen = true;
      if (true == (await action.isDisplayed(nl.provisioningScreen))) {
        out.provisioningSeen = true;
        if (true == (await action.isDisplayed(nl.provisioningProgressBar))) {
          out.progressBarSeen = true;
          var m = String((await action.getAttribute(nl.provisioningProgressBar, "style")) || "").match(/width:\s*(\d+)/);
          if (m && Number(m[1]) > out.maxPercent) out.maxPercent = Number(m[1]);
        }
      }
      if (true == (await action.isDisplayed(nl.unitRow))) { out.tocShown = true; break; }
      await browser.pause(200);
    }
    out.waitedMs = Date.now() - start;
    out.route = await browser.getUrl();
    return out;
  },

  /** TC-NLP-005/006: NEXT ACTIVITY (after a non-scorable) → the next activity. */
  click_nextActivity: async function (expectedTitle) {
    await logger.logInto(await stackTrace.get(), "expected:" + expectedTitle);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var res = await action.click(nl.nextActivityBtn);
    return { clicked: true == res, title: true == res ? await this._waitForActivityTitle(expectedTitle) : null };
  },

  /**
   * TC-NLP-006: type → Submit → "Ready to submit?" → Submit (practiceExtra.submit_ps: same ids, CSS-only-disabled
   * Submit until text is typed), then the NLP submitted badge: ".submitted-info" reads "Submitted" (its medal img
   * alt is "Activity status: evaluation pending") and the answer is shown read-only.
   */
  submit_ps: async function (answer) {
    await logger.logInto(await stackTrace.get(), "answer:" + answer);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = await require("./practiceExtra.page.js").submit_ps(answer);
    out.badgeShown = true == (await action.waitForDisplayed(nl.psSubmittedInfo, 30000));
    out.badgeText = out.badgeShown ? await this._text(nl.psSubmittedInfo) : null;
    return out;
  },

  /**
   * TC-NLP-007: from the TOC page, the Cambridge One Home logo → the full C1 dashboard, whose header carries the
   * profile menu (the activity view's header has none). Returns where it landed.
   */
  click_homeLogo: async function (dashboardUrlPattern) {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var res = await action.click(nl.tocHomeLogo);
    var onDashboard = true == res && true == (await action.waitForUrl(new RegExp(dashboardUrlPattern), 30000));
    return {
      onDashboard: onDashboard,
      profileMenuShown: onDashboard && true == (await action.waitForDisplayed(nl.dashboardProfileMenu, 30000)),
    };
  },

  /** Whether the activity view's header offers a profile menu (TC-NLP-007: it does not — only logo and ×). */
  getData_activityHeader: async function () {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    return {
      logoShown: true == (await action.isDisplayed(nl.activityHomeLogo)),
      closeShown: true == (await action.isDisplayed(nl.closeActivityBtn)),
      profileMenuShown: true == (await action.isDisplayed(nl.dashboardProfileMenu)) || true == (await action.isDisplayed(nl.tocProfileMenu)),
    };
  },

  /**
   * TC-NLP-019: opens the HTML activity from the TOC, waits for its content (activity iframe), stays `dwellMs` (the
   * sheet's ~3 s auto-complete dwell — nothing on screen marks it, so this is a sanctioned pause), closes it and waits
   * (≤ 15 s; seen < 3 s) for the TOC row's completed tick. No submit control is offered.
   */
  open_htmlActivity: async function (label, title, dwellMs) {
    await logger.logInto(await stackTrace.get(), "activity:" + label);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = { tickBefore: null, title: null, contentShown: false, submitShown: false, closed: false, tickAfter: false };
    out.tickBefore = (await this.getData_activityState(label)).completed;
    out.title = (await this.open_activity(label, title)).title;
    out.contentShown = true == (await action.waitForDisplayed(nl.playerIframe, 60000));
    out.submitShown = true == (await action.isDisplayed(nl.psSubmitBtn)) || true == (await action.isDisplayed(nl.checkBtn));
    if (out.contentShown) await browser.pause(dwellMs);
    out.closed = (await this.click_closeActivity()).onToc;
    out.tickAfter = out.closed && true == (await action.waitForDisplayed(nl.activityCompletedTick.replace(/\{NAME\}/g, label), 15000));
    return out;
  },

  /**
   * TC-NLP-020, same rule as the classic LP's PDF (LP-022, TST_PEXT_TC_21 — user decision 2026-09-25): the learner
   * LANDS on the PDF via NEXT ACTIVITY from the (HTML) activity before it, reads its DOWNLOAD PAGE (instructions, file
   * name, Download link — not the PDF) and landing marks it completed. Download is NEVER clicked.
   * [run 3, 2026-09-25] Leaving the page at once did not complete it (no tick within 15 s); the probe that stayed ~6 s
   * did. The TOC is not on screen while landed, so the page is given the same dwell as the HTML activity (the sheet's
   * "same auto-complete-on-dwell pattern") before ×, then the TOC row's tick is waited for (≤ 15 s).
   */
  open_pdfActivity: async function (fromLabel, fromTitle, label, title, dwellMs) {
    await logger.logInto(await stackTrace.get(), "from:" + fromLabel + " activity:" + label);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = { tickBefore: null, fromTitle: null, title: null, pageShown: false, instructions: null, fileName: null, downloadShown: false, closed: false, tickAfter: false };
    out.tickBefore = (await this.getData_activityState(label)).completed;
    out.fromTitle = (await this.open_activity(fromLabel, fromTitle)).title;
    out.title = (await this.click_nextActivity(title)).title;
    out.pageShown = true == (await action.waitForDisplayed(nl.downloadPage, 30000));
    if (out.pageShown) await browser.pause(dwellMs);
    if (out.pageShown) {
      out.instructions = await this._text(nl.downloadInstructions);
      out.fileName = await this._text(nl.downloadFileName);
      out.downloadShown = true == (await action.isDisplayed(nl.downloadLink));
    }
    out.closed = (await this.click_closeActivity()).onToc;
    out.tickAfter = out.closed && true == (await action.waitForDisplayed(nl.activityCompletedTick.replace(/\{NAME\}/g, label), 15000));
    return out;
  },

  // ---------------------------------------------------------------------------------------------
  // Group activities (TC-NLP-021/022) — grounded 2026-09-25 on Class jyaf, group "NLPGroup qt4c" (learners _sh6x
  // and _i25k, teacher _6fho). A learner in a group sees the GROUP name as the activity heading.
  // ---------------------------------------------------------------------------------------------

  /** Collaborative Task as shown now: the group heading and every comment (author + text), in order. */
  getData_collab: async function () {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = { editorShown: false, groupName: null, comments: [] };
    out.editorShown = true == (await action.waitForDisplayed(nl.collabEditor, 60000));
    if (!out.editorShown) return out;
    out.groupName = await this._text(nl.collabGroupName);
    // [2026-09-25, debug run] The comments load AFTER the editor renders (read at once: none). Wait for either a
    // comment card or the "No comments yet" empty state (≤ 20 s) before counting.
    var deadline = Date.now() + 20000;
    while (Date.now() < deadline) {
      if (true == (await action.isDisplayed(nl.collabComment)) || true == (await action.isDisplayed(nl.collabNoComments))) break;
      await browser.pause(250);
    }
    var n = await action.getElementCount(nl.collabComment);
    // The k-th card's author / body through the action library's nth-nested locator ("" = no text filter).
    for (var k = 0; k < n; k++) {
      out.comments.push({
        actor: String(await action.getText(action.getNthNestedFilteredLocator(nl.collabComment, k, nl.collabCommentActor, ""))).replace(/\s+/g, " ").trim(),
        text: String(await action.getText(action.getNthNestedFilteredLocator(nl.collabComment, k, nl.collabCommentBody, ""))).replace(/\s+/g, " ").trim(),
      });
    }
    return out;
  },

  /**
   * Posts `text` as a comment on the Collaborative Task (learner or teacher) and waits (≤ 30 s; measured < 5 s) for a
   * comment card carrying it. Ready (#ready-collabTask-btn) is NEVER clicked — the scenario is about the comments.
   */
  post_collabComment: async function (text) {
    await logger.logInto(await stackTrace.get(), "comment:" + text);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var res = await action.click(nl.collabEditor);
    if (true == res) res = await action.addValue(nl.collabEditor, text);
    if (true == res) res = await action.click(nl.collabPostBtn);
    var shown = true == res && true == (await action.waitForDisplayed(action.getFilteredLocator(nl.collabComment, text), 30000));
    return { posted: true == res, shown: shown };
  },

  /**
   * Teacher / preview: a group activity first shows "Select group" (/item/<path>/group-selection); picks the
   * group by NAME and waits for the activity view (its heading then names the group).
   */
  select_group: async function (groupName) {
    await logger.logInto(await stackTrace.get(), "group:" + groupName);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var row = action.getFilteredLocator(nl.groupSelectRow, groupName);
    var listed = true == (await action.waitForUrl(/\/group-selection/, 30000)) && true == (await action.waitForDisplayed(row, 30000));
    var res = listed ? await action.click(row) : false;
    return { listed: listed, opened: true == res && true == (await action.waitForUrl(/\/view\/item\/.*group=/, 30000)) };
  },

  /** Teacher / preview: opens a group activity from the TOC page and picks the group (see select_group). */
  open_activityForGroup: async function (label, groupName) {
    await logger.logInto(await stackTrace.get(), "activity:" + label + " group:" + groupName);
    var res = await action.waitForDisplayed(this.activityRow(label), 30000);
    if (true == res) res = await action.click(this.activityRow(label));
    if (true != res) return { listed: false, opened: false };
    return await this.select_group(groupName);
  },

  /**
   * TC-NLP-022: one learner submits the Group PS for the group — title + answer, Submit, "Ready to submit your
   * group's work?" → Yes, submit — then reads the submitted state ("<learner> on behalf of <group>", Submitted,
   * the title and the answer). Submit is CSS-disabled until the answer has text. ONE SUBMISSION PER GROUP.
   */
  submit_groupPs: async function (title, answer) {
    await logger.logInto(await stackTrace.get(), "title:" + title);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = { typed: false, submitEnabled: false, confirmTitle: null, confirmClosed: false, submitted: null };
    var res = await action.waitForDisplayed(nl.gpsEditor, 60000);
    if (true == res) res = await action.click(nl.gpsTitleInput);
    if (true == res) res = await action.addValue(nl.gpsTitleInput, title);
    if (true == res) res = await action.click(nl.gpsEditor);
    if (true == res) res = await action.addValue(nl.gpsEditor, answer);
    out.typed = true == res;
    var deadline = Date.now() + 5000;
    while (out.typed && Date.now() < deadline) {
      if (!/\bdisabled\b/.test((await action.getAttribute(nl.psSubmitBtn, "class")) || "")) { out.submitEnabled = true; break; }
      await browser.pause(200);
    }
    if (!out.submitEnabled || true != (await action.click(nl.psSubmitBtn))) return out;
    // #exampleModal is pre-rendered (and has a "class hasn't started" variant) — read the title only once visible.
    if (true != (await action.waitForDisplayed(nl.psConfirmTitle, 10000))) return out;
    out.confirmTitle = await this._text(nl.psConfirmTitle);
    if (true != (await action.click(nl.psConfirmSubmitBtn))) return out;
    out.confirmClosed = true == (await action.waitForDisplayed(nl.psConfirmModal, 15000, true));
    out.submitted = await this.getData_submission();
    return out;
  },

  /** The submitted (group) PS as a member sees it: who submitted on whose behalf, the badge, title and answer. */
  getData_submission: async function () {
    await logger.logInto(await stackTrace.get());
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var shown = true == (await action.waitForDisplayed(nl.psSubmittedInfo, 30000));
    return {
      shown: shown,
      submittedBy: shown ? await this._text(nl.psSubmittedBy) : null,
      badge: shown ? await this._text(nl.psSubmittedInfo) : null,
      title: shown ? await this._text(nl.psSubmissionTitle) : null,
      answer: shown ? await this._text(nl.psAnswerText) : null,
      editorShown: true == (await action.isDisplayed(nl.gpsEditor)),
      // Present only once marked: the member's "Score : <n> %" and the teacher's block (score + feedback).
      score: shown ? await this._text(nl.psScore) : null,
      teacherScore: shown ? await this._text(nl.psTeacherScore) : null,
      teacherFeedback: shown ? await this._text(nl.psTeacherFeedback) : null,
    };
  },

  /**
   * TC-NLP-012/014/015: a teacher / admin preview of an NLP component — /nlp/teacher/… with the TOC listing
   * activities; then one activity is opened (it must load) and closed again with ×, back on the TOC.
   * Nothing is saved on these paths: a preview creates no learner progress.
   */
  preview_component: async function (activityLabel, activityTitle) {
    await logger.logInto(await stackTrace.get(), "activity:" + activityLabel);
    var nl = selectorFile.css.ComproC1.newLearningPath;
    var out = { onRoute: false, tocShown: false, activityCount: 0, opened: null, iframeShown: false, closed: null };
    out.onRoute = true == (await action.waitForUrl(/\/nlp\/teacher\//, 120000));
    out.tocShown = out.onRoute && (await this.isInitialized(60000)).pageStatus;
    if (!out.tocShown) return out;
    out.activityCount = await action.getElementCount(nl.anyActivity);
    out.opened = await this.open_activity(activityLabel, activityTitle);
    out.iframeShown = true == (await action.waitForDisplayed(nl.playerIframe, 60000));
    out.closed = await this.click_closeActivity();
    return out;
  },
};
