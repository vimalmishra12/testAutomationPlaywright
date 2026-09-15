"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Resolves to C1Selectors.json → css.ComproC1.adminNotifications
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var an = selectorFile.css.ComproC1.adminNotifications;

/**
 * Admin App → notifications bell and panel (module INVI, TC_7..12).
 *
 * Separate from `invitationNotification.page.js`, which drives the invitation-ACCEPT flow through the
 * same bell. The panel read here is a different UI, and one test file per page object keeps
 * TST_INVI_TC_7..12 in their own TC-repository module — two modules sharing one test file make the
 * second unreachable (testrunner.js takes the first module matching a testFile; LIBR lesson).
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS HANDLED  (grounded live on Thor 2026-08-27 / 2026-09-14 — admin-shared.md §A9, §A12)
 * ---------------------------------------------------------------------------------------
 *
 * 1. THE PANEL IS NOT PRE-RENDERED. tippy.js builds it on the first click — the §B2 "read it before
 *    it opens" trick does not apply. Every panel read opens the panel first.
 *
 * 2. `.notification-dropdown` IS THE BELL'S 56 px WRAPPER, NOT THE PANEL. Its presence says nothing
 *    about whether the panel is open. → "open" is proven by the panel HEADING being visible.
 *
 * 3. TWO VISIBLE ELEMENTS SHARE qid `ntf-2` (`.close` and `.close-dummy`) — the close selector is
 *    scoped by class.
 *
 * 4. ROW QIDS ARE POSITIONAL AND BASED AT 30, and only FIVE rows render whatever the unread total.
 *    → rows are addressed by index within `button.tippy-dropdown-item`, never by qid.
 *
 * 5. THE COUNT IS LIVE DATA — 92 on 2026-08-27, 93 on 2026-09-14. Nothing here returns an expected
 *    number; tests compare the badge to the heading, or before to after, within one run.
 *
 * 6. CLICKING A ROW MARKS IT READ AND CANNOT BE UNDONE. Only `click_oldestReportReadyRow` does it,
 *    for TST_INVI_TC_12, under the user's decision to consume one notification per run.
 */

/** Panel open/close budget. BUDGET — unmeasured; the panel rendered within the first read in grounding. */
var PANEL_TIMEOUT = 10000;

/** Navigation budget for a clicked notification. BUDGET — unmeasured (the click was never grounded). */
var NAV_TIMEOUT = 45000;

module.exports = {
  bell: an.bell,
  panelHeading: an.panelHeading,
  panelReadCount: an.panelReadCount,
  timeGroupTitle: an.timeGroupTitle,
  row: an.row,
  unreadRow: an.unreadRow,
  closeBtn: an.closeBtn,
  seeOlderLink: an.seeOlderLink,

  /** Confirms the header bell is rendered. */
  isInitialized: async function () {
    return await action.waitForDisplayed(this.bell, NAV_TIMEOUT);
  },

  /**
   * Reads the bell's accessible name and extracts the unread count from it.
   * The aria-label ("Notifications (93 unread notifications)") is the clean source; the badge text
   * duplicates it. Returns the count as a number, or null if the label does not match.
   */
  getData_bell: async function () {
    var aria = await action.getAttribute(this.bell, "aria-label");
    var text = await action.getText(this.bell);
    var m = typeof aria == "string" ? aria.match(/\((\d+)\s+unread/i) : null;
    return {
      ariaLabel: aria,
      text: typeof text == "string" ? text.replace(/\s+/g, " ").trim() : null,
      unreadFromAria: m ? Number(m[1]) : null
    };
  },

  /** Opens the panel and waits for its heading to be visible (traps 1 and 2). */
  open_panel: async function () {
    await logger.logInto(await stackTrace.get(), "opening the notifications panel");
    if (true == (await action.isDisplayed(this.panelHeading))) return true;
    var res = await action.click(this.bell);
    if (true != res) return res;
    return await action.waitForDisplayed(this.panelHeading, PANEL_TIMEOUT);
  },

  /**
   * Reads the open panel: heading, time groups, and each rendered row split into its lines
   * (title, body, date). Assumes `open_panel` has been called.
   */
  getData_panel: async function () {
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    var heading = squash(await action.getText(this.panelHeading));
    var m = heading ? heading.match(/\((\d+)\)/) : null;

    var groupCount = await action.getElementCount(this.timeGroupTitle);
    var groups = [];
    for (var g = 0; typeof groupCount == "number" && g < groupCount; g++) {
      var ge = await action.getKthElement(this.timeGroupTitle, g);
      groups.push(ge ? squash(await action.getText(ge)) : null);
    }

    var rowCount = await action.getElementCount(this.row);
    var rows = [];
    for (var i = 0; typeof rowCount == "number" && i < rowCount; i++) {
      var re = await action.getKthElement(this.row, i);
      var t = re ? await action.getText(re) : "";
      rows.push(typeof t == "string" ? t.split("\n").map(function (s) { return s.trim(); }).filter(Boolean) : []);
    }

    return {
      heading: heading,
      countFromHeading: m ? Number(m[1]) : null,
      timeGroups: groups,
      rowCount: typeof rowCount == "number" ? rowCount : -1,
      rows: rows,
      seeOlderText: squash(await action.getText(this.seeOlderLink)),
      closeVisible: true == (await action.isDisplayed(this.closeBtn))
    };
  },

  /**
   * Closes the panel with its "×" and waits for the heading to disappear.
   * The close's timing was never measured (grounding could not settle it) — the result is returned
   * for the test to assert, never assumed.
   */
  close_panel: async function () {
    // closeBtn targets `.close-dummy`: both ntf-2 elements are visible, but the `.close-dummy` ×
    // inside .notification-body sits on top of `.close` and receives the real click (Playwright:
    // "subtree intercepts pointer events"). Clicking it closes the panel — verified run 2026-09-14.
    var res = await action.click(this.closeBtn);
    if (true != res) return res;
    // Closing REMOVES the panel from the DOM (heading and row counts drop to 0 — diagnostic run
    // 2026-09-15), so the hidden wait here is a truthful signal, not an opacity false green (§B2).
    return await action.waitForDisplayed(this.panelHeading, PANEL_TIMEOUT, true);
  },

  /**
   * TST_INVI_TC_12 ONLY — clicks the OLDEST visible report-ready notification, which marks it read
   * permanently [user decision, 2026-09-14: accept one per run].
   *
   * "Oldest" = the LAST rendered UNREAD row whose title ends "report is ready", so repeated runs
   * consume the stale end of the list first. The panel lists READ rows too, and clicking one does
   * not change the count — so the row must carry the unread marker `.mark-read-circle` (second run
   * 2026-09-14 re-clicked the row the first run had read: 92 → 92). Returns the row's text and the
   * URL it navigated to.
   */
  click_oldestReportReadyRow: async function () {
    var opened = await this.open_panel();
    if (true != opened) return { clicked: opened };
    var rowCount = await action.getElementCount(this.unreadRow);
    var target = -1;
    var lines = [];
    for (var i = (typeof rowCount == "number" ? rowCount : 0) - 1; i >= 0; i--) {
      var re = await action.getKthElement(this.unreadRow, i);
      var t = re ? await action.getText(re) : "";
      var split = typeof t == "string" ? t.split("\n").map(function (s) { return s.trim(); }).filter(Boolean) : [];
      if (split.length && /report is ready$/i.test(split[0])) { target = i; lines = split; break; }
    }
    if (target < 0) {
      return { clicked: new Error("no UNREAD report-ready notification is visible in the panel") };
    }
    var before = await browser.getUrl();
    var el = await action.getKthElement(this.unreadRow, target);
    var res = await action.click(el);
    if (true != res) return { clicked: res, rowLines: lines };

    var deadline = Date.now() + NAV_TIMEOUT;
    var url = before;
    while (Date.now() < deadline) {
      url = await browser.getUrl();
      if (url !== before) break;
      await browser.pause(200);
    }
    return { clicked: true, rowIndex: target, rowLines: lines, urlBefore: before, urlAfter: url };
  }
};
