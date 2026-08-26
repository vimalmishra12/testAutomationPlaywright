"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json -> css.ComproC1.manageGradingScales
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var mgs = selectorFile.css.ComproC1.manageGradingScales;

/**
 * TIMEOUT BUDGET - not a measured transition.
 *
 * The grading-CATEGORY page's transitions were measured live on 2026-08-18 (create 1.39 s,
 * remove 2.17 s, banner lifetime ~15 s) and 15 s was set at ~7x the worst case. This page
 * is the same app, the same school-settings family and the same create/delete shape, so the
 * same budget is carried over as a STARTING POINT.
 *
 * Every wait below is on a real signal (the list contents, a modal's visibility, an
 * aria-expanded flip) rather than a fixed sleep, so the number is only an upper bound.
 * Phase 2 logs the actual settle times - replace this comment with measured figures then.
 */
var SETTLE_TIMEOUT = 15000;

/**
 * SELECTOR TRAPS on the grading-scales pages (all verified live 2026-08-19, thor,
 * FCN-CHZ-PDA) - read before changing anything.
 *
 * 1. FOUR .modal-content elements live in the DOM AT ALL TIMES on the Manage page:
 *    set-as-default, generic error, max-limit and delete-confirmation. Only one is ever
 *    visible. This is the same trap the grading-CATEGORIES page has, so any assertion on
 *    modal PRESENCE is a guaranteed false green. Every modal selector here is :has(...)-
 *    scoped to one specific modal and every check goes through isDisplayed.
 *
 *    Bonus: because the max-limit modal is pre-rendered, its copy was captured WITHOUT
 *    filling the school to its cap - which is why TST_GSCL_TC_4 can stay unautomated
 *    (blocked, shared school) with its expected copy already verified word for word.
 *
 * 2. The row action qids are POSITIONAL (manageGradingScaleLinkDropDown-0, -1, ...), not
 *    keyed by scale name. Look a scale's row index up by name every time - never cache it.
 *
 * 3. UNLIKE the categories page, the DEFAULT scale's menu genuinely OMITS "Set as default"
 *    and "Delete" from the DOM - it is not a hidden-but-present element. Verified live:
 *    the default row exposes only manageGradingScaleOption-1-0 (View details), while every
 *    custom row exposes options -1-, -2- and -3-. TST_GSCL_TC_11 therefore asserts an
 *    element COUNT of 0 for that row's delete option, which is a truthful check here even
 *    though it would be a false green on the categories page.
 *
 * 4. BAND ROWS RE-INDEX WHEN A MIDDLE BAND IS ADDED. On a fresh create form the rows are
 *    0 = Highest grade, 1 = Lowest grade. After one "+ Add new grade" they become
 *    0 = Highest, 1 = the NEW middle band, 2 = Lowest. So "the Lowest grade is index 1" is
 *    only true until a middle band exists. Use getData_bandRowCount() and address the
 *    lowest row as (count - 1), never as a literal 1.
 *
 * 5. The Cancel button on the create form raises an "Are you sure? All changes will be
 *    lost" confirmation ONLY when the form has been edited; on an untouched form it
 *    returns to the Manage page directly. click_cancelCreate handles both.
 *
 * 6. "Set as default" is SCHOOL-WIDE state ("All newly created classes will be associated
 *    with this grading scale"). FCN-CHZ-PDA is shared, so reset_state restores the original
 *    default before sweeping - and it MUST restore first, because the default scale has no
 *    Delete option (trap 3) and could not otherwise be removed.
 *
 * 7. FIELD LENGTH CAPS (captured live 2026-08-19; the manual cases do not mention them):
 *      #grading-scale-title  maxlength="20"
 *      #grade-name-<n>       maxlength="20"
 *      #grade-from-<n>       maxlength="3"
 *    These are the INPUT's own caps, so an over-long value is silently kept at the cap and
 *    never settles. set_title detects that and fails fast rather than burning its whole
 *    budget - see its comment. Any generated scale name must fit 20 characters.
 *
 * PAGE SCOPING: the three views expose mutually exclusive Angular component tags -
 * <manage-grading-scale> (list), <create-grading-scale> (form) and <grading-scale-details>
 * (details). All three render an unclassed <h1>, so the component tag is what stops one
 * page's heading selector matching another's. Never shorten these to a bare h1.
 * (Note the SINGULAR "scale" in the list/form tags - the plural spelling matches nothing.)
 */

/** getText with ADR-009's Error return folded into "", so callers can compare strings. */
async function readText(selector) {
  var t = await action.getText(selector);
  return t && t.message ? "" : String(t).trim();
}

/** getValue with the same Error-to-"" folding. */
async function readValue(selector) {
  var v = await action.getValue(selector);
  return v && v.message ? "" : String(v);
}

/** Reads every listed scale name, in DOM order. Returns [] if unreadable. */
async function readScaleNames() {
  var count = await action.getElementCount(mgs.scaleName);
  if (typeof count !== "number" || count === 0) return [];
  var names = [];
  for (var i = 0; i < count; i++) {
    var txt = await action.getText(mgs.scaleNameByIndex.replace("{{n}}", String(i)));
    // A row can vanish mid-read while the list re-renders - record a miss, do not throw.
    names.push(txt && txt.message ? "" : String(txt).trim());
  }
  return names;
}

/** Polls until `name` is present (want true) or absent (want false). */
async function waitForScaleState(name, want, timeoutMs) {
  var deadline = Date.now() + (timeoutMs || SETTLE_TIMEOUT);
  while (Date.now() < deadline) {
    var names = await readScaleNames();
    if ((names.indexOf(name) !== -1) === want) return true;
    await browser.pause(250); // nothing observable to wait on between polls
  }
  return false;
}

/** Polls until the `default` badge sits on `name`. */
async function waitForDefaultScale(name, timeoutMs) {
  var deadline = Date.now() + (timeoutMs || SETTLE_TIMEOUT);
  var last = "";
  while (Date.now() < deadline) {
    last = await readText(mgs.defaultScaleName);
    if (last === name) return { matched: true, text: last };
    await browser.pause(250);
  }
  return { matched: false, text: last };
}

module.exports = {
  schoolSettingsToggle: mgs.schoolSettingsToggle,
  manageGradingScalesLink: mgs.manageGradingScalesLink,
  managePage: mgs.managePage,
  pageHeading: mgs.pageHeading,
  userGuideLink: mgs.userGuideLink,
  createScaleBtn: mgs.createScaleBtn,
  backLink: mgs.backLink,
  scaleRow: mgs.scaleRow,
  scaleName: mgs.scaleName,
  defaultBadge: mgs.defaultBadge,
  defaultScaleName: mgs.defaultScaleName,
  // Selector TEMPLATES ({{n}} = 0-based row index) - resolved per row at call time.
  scaleNameByIndex: mgs.scaleNameByIndex,
  targetScoreByIndex: mgs.targetScoreByIndex,
  rowActionsToggleByIndex: mgs.rowActionsToggleByIndex,
  rowMenuByIndex: mgs.rowMenuByIndex,
  rowMenuOpen: mgs.rowMenuOpen,
  rowViewDetailsByIndex: mgs.rowViewDetailsByIndex,
  rowSetDefaultByIndex: mgs.rowSetDefaultByIndex,
  rowDeleteByIndex: mgs.rowDeleteByIndex,
  // Create form
  createPage: mgs.createPage,
  createHeading: mgs.createHeading,
  titleInput: mgs.titleInput,
  gradeNameByIndex: mgs.gradeNameByIndex,
  gradeFromByIndex: mgs.gradeFromByIndex,
  gradeToByIndex: mgs.gradeToByIndex,
  gradeTargetByIndex: mgs.gradeTargetByIndex,
  gradeTargetLabelByIndex: mgs.gradeTargetLabelByIndex,
  addGradeByIndex: mgs.addGradeByIndex,
  deleteGradeByIndex: mgs.deleteGradeByIndex,
  saveScaleBtn: mgs.saveScaleBtn,
  cancelScaleBtn: mgs.cancelScaleBtn,
  unsavedModal: mgs.unsavedModal,
  unsavedConfirmBtn: mgs.unsavedConfirmBtn,
  unsavedCancelBtn: mgs.unsavedCancelBtn,
  // Modals
  setDefaultModal: mgs.setDefaultModal,
  setDefaultConfirmBtn: mgs.setDefaultConfirmBtn,
  setDefaultCancelBtn: mgs.setDefaultCancelBtn,
  deleteModal: mgs.deleteModal,
  deleteConfirmBtn: mgs.deleteConfirmBtn,
  deleteCancelBtn: mgs.deleteCancelBtn,
  maxLimitModal: mgs.maxLimitModal,
  errorModal: mgs.errorModal,
  // Details page
  detailsPage: mgs.detailsPage,
  detailsHeading: mgs.detailsHeading,
  detailsBackLink: mgs.detailsBackLink,
  bandsToggle: mgs.bandsToggle,
  bandsPanel: mgs.bandsPanel,
  bandsPanelOpen: mgs.bandsPanelOpen,
  bandCell: mgs.bandCell,
  bandTargetScore: mgs.bandTargetScore,
  detailsClassesHeading: mgs.detailsClassesHeading,
  detailsNoClassesBox: mgs.detailsNoClassesBox,
  detailsNoClassesText: mgs.detailsNoClassesText,
  detailsClassRow: mgs.detailsClassRow,
  detailsClassRowByKey: mgs.detailsClassRowByKey,
  detailsClassNameByKey: mgs.detailsClassNameByKey,
  detailsClassStatusByKey: mgs.detailsClassStatusByKey,
  detailsClassGradeSettingsLinkByKey: mgs.detailsClassGradeSettingsLinkByKey,
  detailsLoadMoreLink: mgs.detailsLoadMoreLink,

  /**
   * Confirms the Grading scales (Manage) page has loaded. Anchors on "Create grading
   * scale", which is unique to this view; the <h1> carries no id or class.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.createScaleBtn, SETTLE_TIMEOUT) };
  },

  /**
   * Navigates Classes tab -> School settings -> Manage grading scales (the real user path,
   * Req #10). Deliberately NOT a direct URL jump: a break in the dropdown route must fail
   * the run rather than be routed around (Invariant 14).
   *
   * The menu lives in the DOM with display:none while closed, so the wait between the two
   * clicks is waitForDisplayed - an existence check would pass instantly on a hidden link.
   */
  navigate_fromClassesTab: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.toggleClicked = await action.click(this.schoolSettingsToggle);
    if (true != res.toggleClicked) return res;
    res.menuShown = await action.waitForDisplayed(this.manageGradingScalesLink, SETTLE_TIMEOUT);
    if (true != res.menuShown) return res;
    res.linkClicked = await action.click(this.manageGradingScalesLink);
    if (true != res.linkClicked) return res;
    var init = await this.isInitialized();
    res.pageStatus = init.pageStatus;
    return res;
  },

  /** True when the Manage grading scales page is currently on screen. */
  getData_onPage: async function () {
    await logger.logInto(await stackTrace.get());
    return { displayed: (await action.isDisplayed(this.createScaleBtn)) === true, pageStatus: true };
  },

  /**
   * Everything TST_GSCL_TC_1 (Req #10) asserts about the Manage page in one pass.
   * Visibility rather than counts throughout - see trap 1.
   */
  getData_pageComponents: async function () {
    await logger.logInto(await stackTrace.get());
    var rows = await action.getElementCount(this.scaleRow);
    return {
      heading: await readText(this.pageHeading),
      userGuideDisplayed: (await action.isDisplayed(this.userGuideLink)) === true,
      createBtnDisplayed: (await action.isDisplayed(this.createScaleBtn)) === true,
      defaultBadgeDisplayed: (await action.isDisplayed(this.defaultBadge)) === true,
      defaultScale: await readText(this.defaultScaleName),
      rowCount: typeof rows === "number" ? rows : -1,
      pageStatus: true
    };
  },

  /** All listed scale names, in DOM order. */
  getData_scaleNames: async function () {
    await logger.logInto(await stackTrace.get());
    var names = await readScaleNames();
    return { count: names.length, names: names, pageStatus: true };
  },

  /** True when `name` is listed. */
  getData_scaleListed: async function (name) {
    await logger.logInto(await stackTrace.get());
    var names = await readScaleNames();
    return { listed: names.indexOf(name) !== -1, names: names, pageStatus: true };
  },

  /** The name currently carrying the `default` badge. */
  getData_defaultScaleName: async function () {
    await logger.logInto(await stackTrace.get());
    return { name: await readText(this.defaultScaleName), pageStatus: true };
  },

  /** The "Target score ..." line on `name`'s row. */
  getData_targetScore: async function (name) {
    var res = { pageStatus: false, index: -1, text: "" };
    await logger.logInto(await stackTrace.get());
    var names = await readScaleNames();
    res.index = names.indexOf(name);
    if (res.index === -1) return res;
    res.text = await readText(this.targetScoreByIndex.replace("{{n}}", String(res.index)));
    res.pageStatus = true;
    return res;
  },

  /**
   * Opens `name`'s "Open drop down" menu and reports which options are really VISIBLE and
   * how many exist in the DOM.
   *
   * Both facts are returned because they answer different questions: the default scale
   * omits Set-as-default and Delete entirely (trap 3), so TST_GSCL_TC_11 checks the counts,
   * while the positive TCs check visibility before clicking.
   */
  click_openRowMenu: async function (name) {
    var res = {
      pageStatus: false, index: -1, menuDisplayed: false,
      viewDetailsDisplayed: false, setDefaultDisplayed: false, deleteDisplayed: false,
      setDefaultCount: -1, deleteCount: -1
    };
    await logger.logInto(await stackTrace.get());
    var names = await readScaleNames();
    res.index = names.indexOf(name);
    if (res.index === -1) return res;
    var i = String(res.index);
    res.toggleClicked = await action.click(this.rowActionsToggleByIndex.replace("{{n}}", i));
    if (true != res.toggleClicked) return res;
    res.menuDisplayed = (await action.waitForDisplayed(this.rowMenuByIndex.replace("{{n}}", i), SETTLE_TIMEOUT)) === true;
    if (!res.menuDisplayed) return res;
    res.viewDetailsDisplayed = (await action.isDisplayed(this.rowViewDetailsByIndex.replace("{{n}}", i))) === true;
    res.setDefaultDisplayed = (await action.isDisplayed(this.rowSetDefaultByIndex.replace("{{n}}", i))) === true;
    res.deleteDisplayed = (await action.isDisplayed(this.rowDeleteByIndex.replace("{{n}}", i))) === true;
    var sd = await action.getElementCount(this.rowSetDefaultByIndex.replace("{{n}}", i));
    var dl = await action.getElementCount(this.rowDeleteByIndex.replace("{{n}}", i));
    res.setDefaultCount = typeof sd === "number" ? sd : -1;
    res.deleteCount = typeof dl === "number" ? dl : -1;
    res.pageStatus = true;
    return res;
  },

  /**
   * Closes an open row dropdown with Escape. Housekeeping only - a TC that ends with a menu
   * open does so on purpose, for its screenshot.
   */
  click_closeRowMenu: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.pressed = await action.keyPress("Escape");
    if (true != res.pressed) return res;
    res.pageStatus = await action.waitForDisplayed(this.rowMenuOpen, SETTLE_TIMEOUT, true);
    return res;
  },

  /* ---------------------------------------------------------------- create form ------ */

  /** Confirms the Create grading scale form has loaded (anchored on its title field). */
  isCreateInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.titleInput, SETTLE_TIMEOUT) };
  },

  /** True when the Create grading scale form is on screen. */
  getData_onCreatePage: async function () {
    await logger.logInto(await stackTrace.get());
    return { displayed: (await action.isDisplayed(this.createPage)) === true, pageStatus: true };
  },

  /** Opens the Create grading scale form and waits for it. */
  click_createScale: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.createScaleBtn);
    if (true != res.clicked) return res;
    var init = await this.isCreateInitialized();
    res.pageStatus = init.pageStatus;
    return res;
  },

  /**
   * Types the scale title, then POLLS the field until it really holds `value`.
   *
   * WHY the read-back: the grading-CATEGORY name field on this same app silently dropped 10
   * of 28 characters from pressSequentially because typing outran its async validation
   * (measured 2026-08-18), and Harish saw the same on the bulk-form teacher-email field.
   * Trusting addValue's own "true" there produced a green test that had created a
   * differently-named record. This method therefore makes the FIELD's value the wait
   * signal, and tops up only what is missing rather than retyping from scratch.
   *
   * It also separates the two possible causes: if the field never reaches the full value,
   * the truncation is ours; if it does and the app still stores a short name, it is the
   * product's and must be reported, not worked around (Invariant 14).
   */
  set_title: async function (value) {
    var res = { pageStatus: false, readBack: "", settleMs: 0, topUps: 0, capped: false, diagnosis: "" };
    await logger.logInto(await stackTrace.get());
    res.cleared = await action.clearValue(this.titleInput);
    if (true != res.cleared) return res;
    if (value !== "") {
      res.typed = await action.addValue(this.titleInput, value);
      if (true != res.typed) return res;
    }
    var started = Date.now();
    var deadline = started + SETTLE_TIMEOUT;
    var stalledAt = "";
    var stalls = 0;
    while (Date.now() < deadline) {
      res.readBack = await readValue(this.titleInput);
      if (res.readBack === value) { res.pageStatus = true; break; }

      // FAIL FAST on a hard field cap. The field carries maxlength="20" (captured live
      // 2026-08-19), so an over-long value can NEVER settle - the first build spent the
      // whole 15 s budget topping up a field that had stopped accepting characters, in six
      // TCs, turning a one-line data problem into a 3-minute run with a confusing message.
      // Two consecutive top-ups that move nothing means the field is capped, not slow.
      if (res.readBack === stalledAt) {
        stalls++;
        if (stalls >= 2) {
          res.capped = true;
          res.diagnosis =
            "field stopped accepting input at " + res.readBack.length + " characters while " +
            value.length + " were requested - check the input's maxlength before assuming a typing race";
          break;
        }
      } else {
        stalls = 0;
        stalledAt = res.readBack;
      }

      // Only append the missing tail when what IS there is a correct prefix; anything else
      // means the field holds something unexpected, so clear and start over.
      if (value.indexOf(res.readBack) === 0) {
        res.topUps++;
        await action.addValue(this.titleInput, value.slice(res.readBack.length));
      } else {
        res.topUps++;
        await action.clearValue(this.titleInput);
        if (value !== "") await action.addValue(this.titleInput, value);
      }
      await browser.pause(150);
    }
    res.settleMs = Date.now() - started;
    if (value === "") res.pageStatus = res.readBack === "";
    return res;
  },

  /** How many band rows the form currently has (trap 4 - the lowest row is count - 1). */
  getData_bandRowCount: async function () {
    await logger.logInto(await stackTrace.get());
    var n = await action.getElementCount("input[qid^='grade-name-']");
    return { count: typeof n === "number" ? n : -1, pageStatus: true };
  },

  /**
   * Fills one band row. `from` / `to` are optional because the product fixes the Highest
   * row's To at 100% and the Lowest row's From at 0% - those inputs do not exist, so the
   * caller passes only the fields that row actually has (trap 4).
   */
  set_band: async function (index, band) {
    var res = { pageStatus: false, index: index };
    await logger.logInto(await stackTrace.get());
    var i = String(index);
    if (band.name !== undefined) {
      res.nameCleared = await action.clearValue(this.gradeNameByIndex.replace("{{n}}", i));
      if (true != res.nameCleared) return res;
      res.nameTyped = await action.addValue(this.gradeNameByIndex.replace("{{n}}", i), band.name);
      if (true != res.nameTyped) return res;
    }
    if (band.from !== undefined) {
      res.fromCleared = await action.clearValue(this.gradeFromByIndex.replace("{{n}}", i));
      if (true != res.fromCleared) return res;
      res.fromTyped = await action.addValue(this.gradeFromByIndex.replace("{{n}}", i), String(band.from));
      if (true != res.fromTyped) return res;
    }
    if (band.to !== undefined) {
      res.toCleared = await action.clearValue(this.gradeToByIndex.replace("{{n}}", i));
      if (true != res.toCleared) return res;
      res.toTyped = await action.addValue(this.gradeToByIndex.replace("{{n}}", i), String(band.to));
      if (true != res.toTyped) return res;
    }
    res.pageStatus = true;
    return res;
  },

  /**
   * Moves focus off the field that was typed into last, with Tab.
   *
   * WHY [2026-08-19]: set_band fills one input then moves to the next, which blurs the
   * previous one - but the LAST field typed is never blurred, so an Angular form using
   * updateOn:'blur' would never receive that value and "Save grading scale" would stay
   * disabled on a form that looks complete. Committing the final field explicitly removes
   * that whole class of doubt.
   */
  blur_activeField: async function (blurKey) {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.pageStatus = (await action.pressKeyboardKey(blurKey)) === true;
    return res;
  },

  /** Reads back one band row's values, so a TC can prove what actually landed. */
  getData_band: async function (index) {
    await logger.logInto(await stackTrace.get());
    var i = String(index);
    var fromCount = await action.getElementCount(this.gradeFromByIndex.replace("{{n}}", i));
    var toCount = await action.getElementCount(this.gradeToByIndex.replace("{{n}}", i));
    return {
      name: await readValue(this.gradeNameByIndex.replace("{{n}}", i)),
      hasFrom: fromCount === 1,
      hasTo: toCount === 1,
      from: fromCount === 1 ? await readValue(this.gradeFromByIndex.replace("{{n}}", i)) : null,
      to: toCount === 1 ? await readValue(this.gradeToByIndex.replace("{{n}}", i)) : null,
      pageStatus: true
    };
  },

  /**
   * Clicks "+ Add new grade" below row `index` and waits for the row count to actually
   * grow. Waiting on the count rather than on the link's own return value is what makes
   * trap 4's re-indexing observable to the caller.
   */
  click_addGrade: async function (index) {
    var res = { pageStatus: false, before: -1, after: -1 };
    await logger.logInto(await stackTrace.get());
    res.before = (await this.getData_bandRowCount()).count;
    res.clicked = await action.click(this.addGradeByIndex.replace("{{n}}", String(index)));
    if (true != res.clicked) return res;
    var deadline = Date.now() + SETTLE_TIMEOUT;
    while (Date.now() < deadline) {
      res.after = (await this.getData_bandRowCount()).count;
      if (res.after > res.before) { res.pageStatus = true; break; }
      await browser.pause(150);
    }
    return res;
  },

  /**
   * Marks band `index` as the target score.
   *
   * Clicks the LABEL, not the radio: this app's custom form controls overlay their input
   * with the label, and clicking the input then fails with "label intercepts pointer
   * events" (established on the bulk-class form, 2026-08-18). The label carries
   * for="grade-target-<n>", so the click still lands on the right row.
   */
  click_setTarget: async function (index) {
    var res = { pageStatus: false, index: index };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.gradeTargetLabelByIndex.replace("{{n}}", String(index)));
    if (true != res.clicked) return res;
    var deadline = Date.now() + SETTLE_TIMEOUT;
    while (Date.now() < deadline) {
      res.selected = (await action.isSelected(this.gradeTargetByIndex.replace("{{n}}", String(index)))) === true;
      if (res.selected) { res.pageStatus = true; break; }
      await browser.pause(150);
    }
    return res;
  },

  /** Whether band `index` is currently the target score. */
  getData_targetSelected: async function (index) {
    await logger.logInto(await stackTrace.get());
    return {
      selected: (await action.isSelected(this.gradeTargetByIndex.replace("{{n}}", String(index)))) === true,
      pageStatus: true
    };
  },

  /**
   * Whether "Save grading scale" is currently enabled.
   *
   * The class is reported alongside the enabled state because this app has BOTH kinds of
   * disabled button: natively disabled ones and CSS-class-only ones that stay clickable
   * (established on the bulk-class form, 2026-08-18). This button is natively disabled -
   * if that ever changes, the class in the log says so instead of the test quietly clicking
   * a button that does nothing.
   */
  getData_saveEnabled: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      enabled: (await action.isEnabled(this.saveScaleBtn)) === true,
      cssClass: await action.getAttribute(this.saveScaleBtn, "class"),
      pageStatus: true
    };
  },

  /**
   * One snapshot of everything the form's validity depends on. Exists so a failing
   * "Save stayed disabled" assertion can report WHY in the same run, rather than costing
   * another ~3-minute pass against a shared school to find out.
   */
  getData_formState: async function () {
    await logger.logInto(await stackTrace.get());
    var rows = (await this.getData_bandRowCount()).count;
    var bands = [];
    for (var i = 0; i < rows; i++) bands.push(await this.getData_band(i));
    var save = await this.getData_saveEnabled();
    return {
      title: await readValue(this.titleInput),
      bandRowCount: rows,
      bands: bands,
      targetOnRow: await (async function (self) {
        for (var j = 0; j < rows; j++) {
          if ((await action.isSelected(self.gradeTargetByIndex.replace("{{n}}", String(j)))) === true) return j;
        }
        return -1;
      })(this),
      saveEnabled: save.enabled,
      saveClass: save.cssClass,
      pageStatus: true
    };
  },

  /**
   * Saves the scale and waits for it to actually appear in the Manage list.
   *
   * The list is the signal, not the button click: only the list proves the record exists.
   * Whether this page also raises a success banner is unknown at build time (no scale was
   * created during capture, deliberately - the school is shared); Phase 2 records it.
   */
  click_saveScale: async function (name) {
    var res = { pageStatus: false, listed: false, preSaveTitle: "" };
    await logger.logInto(await stackTrace.get());
    res.preSaveTitle = await readValue(this.titleInput);
    res.clicked = await action.click(this.saveScaleBtn);
    if (true != res.clicked) return res;
    var init = await this.isInitialized();
    res.backOnManagePage = init.pageStatus;
    if (true != init.pageStatus) return res;
    res.listed = await waitForScaleState(name, true, SETTLE_TIMEOUT);
    res.pageStatus = res.listed;
    return res;
  },

  /**
   * Leaves the create form. Handles both of trap 5's outcomes: an edited form raises the
   * "All changes will be lost" confirmation, an untouched one returns straight to the list.
   */
  click_cancelCreate: async function () {
    var res = { pageStatus: false, confirmationShown: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.cancelScaleBtn);
    if (true != res.clicked) return res;
    res.confirmationShown = (await action.waitForDisplayed(this.unsavedModal, 3000)) === true;
    if (res.confirmationShown) {
      res.confirmClicked = await action.click(this.unsavedConfirmBtn);
      if (true != res.confirmClicked) return res;
    }
    var init = await this.isInitialized();
    res.pageStatus = init.pageStatus;
    return res;
  },

  /* ------------------------------------------------------------------- details ------- */

  /** True when a scale's View details page is on screen. */
  getData_onDetailsPage: async function () {
    await logger.logInto(await stackTrace.get());
    return { displayed: (await action.isDisplayed(this.detailsPage)) === true, pageStatus: true };
  },

  /** Confirms the View details page has loaded (anchored on its own Back link). */
  isDetailsInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.detailsBackLink, SETTLE_TIMEOUT) };
  },

  /** Opens `name`'s View details page via the row menu (the real user route). */
  click_viewDetails: async function (name) {
    var res = { pageStatus: false, index: -1, urlMatched: false };
    await logger.logInto(await stackTrace.get());
    var opened = await this.click_openRowMenu(name);
    res.index = opened.index;
    res.menuOpened = opened.pageStatus;
    if (true != opened.pageStatus) return res;
    res.clicked = await action.click(this.rowViewDetailsByIndex.replace("{{n}}", String(opened.index)));
    if (true != res.clicked) return res;
    res.urlMatched = (await action.waitForUrl("**/grading-scales/*", SETTLE_TIMEOUT)) === true;
    var init = await this.isDetailsInitialized();
    res.pageStatus = init.pageStatus === true && res.urlMatched;
    return res;
  },

  /** Everything TST_GSCL_TC_6 asserts about the details page. */
  getData_detailsPage: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      heading: await readText(this.detailsHeading),
      bandsToggleDisplayed: (await action.isDisplayed(this.bandsToggle)) === true,
      bandsExpanded: await action.getAttribute(this.bandsToggle, "aria-expanded"),
      classesHeading: await readText(this.detailsClassesHeading),
      noClassesDisplayed: (await action.isDisplayed(this.detailsNoClassesBox)) === true,
      noClassesText: await readText(this.detailsNoClassesBox),
      pageStatus: true
    };
  },

  /**
   * Expands the "Grading scale bands" accordion (Req #16) and waits for the panel to become
   * VISIBLE - the panel stays in the DOM while collapsed, so presence proves nothing.
   * aria-expanded is captured too, since that is the control's own account of its state.
   */
  click_expandBands: async function () {
    var res = { pageStatus: false, expandedBefore: "", expandedAfter: "" };
    await logger.logInto(await stackTrace.get());
    res.expandedBefore = await action.getAttribute(this.bandsToggle, "aria-expanded");
    res.clicked = await action.click(this.bandsToggle);
    if (true != res.clicked) return res;
    res.panelShown = (await action.waitForDisplayed(this.bandsPanelOpen, SETTLE_TIMEOUT)) === true;
    res.expandedAfter = await action.getAttribute(this.bandsToggle, "aria-expanded");
    res.pageStatus = res.panelShown;
    return res;
  },

  /**
   * The band rows shown once the accordion is expanded.
   *
   * Cells are read through getKthElement, which returns a LAZY nth() Locator - the action
   * library's el() accepts a Locator as well as a selector string, so getText resolves it
   * at call time. Do NOT String() the return of getKthElement: it is a Locator object, not
   * the cell's text.
   */
  getData_bands: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await action.getElementCount(this.bandCell);
    var cells = [];
    if (typeof count === "number") {
      for (var i = 0; i < count; i++) {
        var cell = await action.getKthElement(this.bandCell, i);
        if (cell === null) { cells.push(""); continue; }
        var txt = await action.getText(cell);
        cells.push(txt && txt.message ? "" : String(txt).trim());
      }
    }
    return {
      cellCount: typeof count === "number" ? count : -1,
      cells: cells,
      targetScoreText: await readText(this.bandTargetScore),
      panelDisplayed: (await action.isDisplayed(this.bandsPanelOpen)) === true,
      pageStatus: true
    };
  },

  /* ------------------------------------------- details page: the CLASSES list (TC_7) ----- */

  /**
   * Reads the row a class occupies on a scale's details page (Req #13 / TST_GSCL_TC_7).
   *
   * ADDRESSED BY CLASS KEY, NEVER BY NAME. Two reasons, both observed live 2026-08-20:
   *   - Class names on FCN-CHZ-PDA are already duplicated (many `BulkCSV_Class1`,
   *     `AutoClass_CreateOnly`, and one `AutoClass_CGST` per past CGST run).
   *   - DELETE IS SOFT, and this page lists Deleted classes alongside Active ones, so every
   *     run of the CGST suite leaves another same-named row here permanently.
   * The key is unique per class, so it is the only safe handle.
   *
   * The list PAGINATES AT 20 (heading read `Classes (69)` with 20 rows rendered). A newly
   * created class sorts to the top, so page 1 is normally enough - but the loop below pages
   * forward rather than assuming that ordering, because a silent "not found" caused by
   * pagination would look identical to the feature being broken. Bounded, and it reports
   * how many pages it took (Invariant 13/14: this is real user interaction, not a retry).
   */
  getData_detailsClassRow: async function (classKey, maxPages) {
    var res = { found: false, name: "", status: "", pagesLoaded: 0, rowCount: 0, pageStatus: true };
    await logger.logInto(await stackTrace.get());
    var rowSel = this.detailsClassRowByKey.replace("{{key}}", classKey);
    var limit = typeof maxPages === "number" ? maxPages : 10;

    for (var page = 0; page <= limit; page++) {
      res.rowCount = await action.getElementCount(this.detailsClassRow);
      if ((await action.getElementCount(rowSel)) > 0) { res.found = true; break; }
      // Load more is REMOVED from the DOM once the last batch is in, so its absence is the
      // authoritative "no more pages" signal (same behaviour as the Classes tab).
      if ((await action.getElementCount(this.detailsLoadMoreLink)) === 0) break;
      if (true != (await action.click(this.detailsLoadMoreLink))) break;
      res.pagesLoaded++;
      await action.waitForDocumentLoad();
    }

    if (res.found) {
      res.name = await readText(this.detailsClassNameByKey.replace("{{key}}", classKey));
      res.status = await readText(this.detailsClassStatusByKey.replace("{{key}}", classKey));
    }
    return res;
  },

  /**
   * Clicks a listed class's "Class grade settings" link and lands on that class's grade
   * settings page (TST_GSCL_TC_7).
   *
   * NOTE the manual test case says "click a listed class" - that is WRONG and was written
   * before anyone had seen this page with classes on it. The class name is plain text
   * (`span.item-text`); the only control in the row is a dedicated "Class grade settings"
   * link. Verified live 2026-08-20.
   *
   * ⚠ ONLY MEANINGFUL FOR AN ACTIVE CLASS. Clicking this link on a row whose status is
   * `Deleted` does NOT open grade settings - it drops the school context entirely and lands
   * back on "My school accounts" with a dialog reading "Sorry! The item is not available
   * because the class is no longer active". That is the product explaining itself, not a
   * bug - but it means this TC must run while the class under test is still live, i.e.
   * BEFORE the suite's delete step.
   */
  click_classGradeSettingsByKey: async function (classKey) {
    var res = { pageStatus: false, found: false, status: "" };
    await logger.logInto(await stackTrace.get());
    var row = await this.getData_detailsClassRow(classKey);
    res.found = row.found;
    res.name = row.name;
    res.status = row.status;
    if (true != row.found) {
      await logger.logInto(
        await stackTrace.get(),
        "class key '" + classKey + "' is not listed on this scale's details page",
        "error"
      );
      return res;
    }
    res.clicked = await action.click(
      this.detailsClassGradeSettingsLinkByKey.replace("{{key}}", classKey)
    );
    if (true != res.clicked) return res;
    var init = await require("./classGradeSettings.page").isInitialized();
    res.pageStatus = init.pageStatus === true;
    res.formSettled = init.formSettled;
    return res;
  },

  /** Returns from the details page to the Manage list via its own Back link. */
  click_backFromDetails: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.detailsBackLink);
    if (true != res.clicked) return res;
    var init = await this.isInitialized();
    res.pageStatus = init.pageStatus;
    return res;
  },

  /* -------------------------------------------------------------- set as default ----- */

  /** Opens the "Set as default" confirmation for `name`. */
  click_setAsDefault: async function (name) {
    var res = { pageStatus: false, index: -1 };
    await logger.logInto(await stackTrace.get());
    var opened = await this.click_openRowMenu(name);
    res.index = opened.index;
    if (true != opened.pageStatus) return res;
    if (!opened.setDefaultDisplayed) return res; // the default scale offers no such option
    res.clicked = await action.click(this.rowSetDefaultByIndex.replace("{{n}}", String(opened.index)));
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.setDefaultModal, SETTLE_TIMEOUT);
    return res;
  },

  /** Whether the set-as-default confirmation is VISIBLE, plus its copy. */
  getData_setDefaultModal: async function () {
    await logger.logInto(await stackTrace.get());
    var displayed = (await action.isDisplayed(this.setDefaultModal)) === true;
    return {
      displayed: displayed,
      text: displayed ? await readText(this.setDefaultModal) : "",
      pageStatus: true
    };
  },

  /** Confirms set-as-default, then waits for the badge to actually move onto `name`. */
  click_confirmSetDefault: async function (name) {
    var res = { pageStatus: false, becameDefault: false, defaultNow: "" };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.setDefaultConfirmBtn);
    if (true != res.clicked) return res;
    var moved = await waitForDefaultScale(name, SETTLE_TIMEOUT);
    res.becameDefault = moved.matched;
    res.defaultNow = moved.text;
    res.pageStatus = res.becameDefault;
    return res;
  },

  /** Dismisses the set-as-default confirmation and waits for it to close. */
  click_cancelSetDefault: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.setDefaultCancelBtn);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.setDefaultModal, SETTLE_TIMEOUT, true);
    return res;
  },

  /* -------------------------------------------------------------------- delete ------- */

  /** Opens the Delete confirmation for `name`. */
  click_deleteScale: async function (name) {
    var res = { pageStatus: false, index: -1, deleteAvailable: false };
    await logger.logInto(await stackTrace.get());
    var opened = await this.click_openRowMenu(name);
    res.index = opened.index;
    res.deleteAvailable = opened.deleteDisplayed;
    if (true != opened.pageStatus) return res;
    if (!opened.deleteDisplayed) return res; // the default scale cannot be deleted (trap 3)
    res.clicked = await action.click(this.rowDeleteByIndex.replace("{{n}}", String(opened.index)));
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.deleteModal, SETTLE_TIMEOUT);
    return res;
  },

  /** Whether the delete confirmation is VISIBLE, plus its copy. */
  getData_deleteModal: async function () {
    await logger.logInto(await stackTrace.get());
    var displayed = (await action.isDisplayed(this.deleteModal)) === true;
    return {
      displayed: displayed,
      text: displayed ? await readText(this.deleteModal) : "",
      pageStatus: true
    };
  },

  /** Confirms deletion, then waits for `name` to actually leave the list. */
  click_confirmDelete: async function (name) {
    var res = { pageStatus: false, removed: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.deleteConfirmBtn);
    if (true != res.clicked) return res;
    res.removed = await waitForScaleState(name, false, SETTLE_TIMEOUT);
    res.pageStatus = res.removed;
    return res;
  },

  /** Dismisses the delete confirmation and waits for it to close. */
  click_cancelDelete: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.deleteCancelBtn);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.deleteModal, SETTLE_TIMEOUT, true);
    return res;
  },

  /* --------------------------------------------------------------- housekeeping ------ */

  /**
   * Housekeeping: leaves the page in a known state - on the Manage grading scales list,
   * nothing open, `expectedDefault` carrying the default badge, and no scale whose name
   * starts with `prefix`.
   *
   * Runs at the START of each TC (BeforeEach), not the end. The mochawesome screenshot is
   * taken by a ROOT afterEach hook, which Mocha runs AFTER the suite-level hooks that
   * execute the exec file's AfterEach list - so sweeping in AfterEach would delete each
   * scale a moment BEFORE its screenshot was taken, and every create/delete TC would be
   * evidenced by a picture of a list that no longer contains its subject (ADR-019).
   *
   * ORDER MATTERS. The default is restored BEFORE the sweep, because the default scale
   * exposes no Delete option (trap 3): a run that died after TST_GSCL_TC_8 leaves one of
   * our own AutoScale_* entries as the school default, and it cannot be removed until the
   * badge has been handed back. Restoring first also limits how long a SHARED school sits
   * on our scale, which would otherwise attach it to every class created meanwhile.
   *
   * Nothing is swallowed - every step reports its outcome (Invariant 13).
   */
  reset_state: async function (prefix, expectedDefault) {
    var res = { pageStatus: false, removed: [], failed: [] };
    await logger.logInto(await stackTrace.get());

    // 1. Get back onto the Manage list from wherever the previous TC ended.
    if ((await this.getData_onDetailsPage()).displayed) {
      res.leftDetailsPage = (await this.click_backFromDetails()).pageStatus;
      if (true != res.leftDetailsPage) return res;
    }
    if ((await this.getData_onCreatePage()).displayed) {
      res.leftCreatePage = (await this.click_cancelCreate()).pageStatus;
      if (true != res.leftCreatePage) return res;
    }
    if (!(await this.getData_onPage()).displayed) {
      var nav = await this.navigate_fromClassesTab();
      res.navigated = nav.pageStatus;
      if (true != nav.pageStatus) return res;
    }

    // 2. Close anything a previous TC left open, so the clicks below cannot be intercepted.
    if ((await action.isDisplayed(this.rowMenuOpen)) === true) {
      res.closedRowMenu = (await this.click_closeRowMenu()).pageStatus;
      if (true != res.closedRowMenu) return res;
    }
    if ((await action.isDisplayed(this.setDefaultModal)) === true) {
      res.closedSetDefaultModal = (await this.click_cancelSetDefault()).pageStatus;
    }
    if ((await action.isDisplayed(this.deleteModal)) === true) {
      res.closedDeleteModal = (await this.click_cancelDelete()).pageStatus;
    }

    // 3. Hand the default badge back BEFORE sweeping - see ORDER MATTERS above.
    res.defaultBefore = await readText(this.defaultScaleName);
    if (expectedDefault && res.defaultBefore !== expectedDefault) {
      var restored = await this.click_setAsDefault(expectedDefault);
      res.defaultRestoreOpened = restored.pageStatus;
      if (true != restored.pageStatus) { res.failed.push("restore-default:" + expectedDefault); return res; }
      var confirmed = await this.click_confirmSetDefault(expectedDefault);
      res.defaultRestored = confirmed.becameDefault;
      if (true != confirmed.becameDefault) { res.failed.push("restore-default:" + expectedDefault); return res; }
    }
    res.defaultAfter = await readText(this.defaultScaleName);

    // 4. Remove one at a time, re-reading names each pass: every removal re-indexes the rows.
    for (var guard = 0; guard < 25; guard++) {
      var names = await readScaleNames();
      var stale = names.filter(function (n) { return n.indexOf(prefix) === 0; });
      if (stale.length === 0) break;
      var target = stale[0];
      var opened = await this.click_deleteScale(target);
      if (true != opened.pageStatus) { res.failed.push(target); break; }
      var done = await this.click_confirmDelete(target);
      if (true == done.removed) res.removed.push(target);
      else { res.failed.push(target); break; }
    }

    res.pageStatus = res.failed.length === 0;
    return res;
  }
};
