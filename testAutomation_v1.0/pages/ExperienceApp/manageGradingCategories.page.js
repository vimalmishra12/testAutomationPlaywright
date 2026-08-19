"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json -> css.ComproC1.manageGradingCategories
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var mgc = selectorFile.css.ComproC1.manageGradingCategories;

/**
 * MEASURED LIVE 2026-08-18 (thor, school FCN-CHZ-PDA) - do not replace with guesses:
 *
 *   create -> success banner appears  1.39 s ; category appears in list  1.39 s
 *   remove -> success banner appears  2.17 s ; category leaves list      2.17 s
 *   banner stays on screen           ~15.0 s  (both banners)
 *
 * The banner and the list update in the SAME tick, so neither is "ahead" of the other.
 * The 15 s budgets below are ~7x the measured worst case, not an invented number.
 */
var SETTLE_TIMEOUT = 15000;

/**
 * SELECTOR TRAPS on this page (verified live 2026-08-18) - read before changing anything:
 *
 * 1. FOUR .modal-content elements exist in the DOM AT ALL TIMES: create, max-limit,
 *    generic error, and remove-confirmation. Only one is ever visible. Any assertion on
 *    modal PRESENCE is therefore a guaranteed false green (Invariant 1). Every modal
 *    selector here is scoped with :has(...) to one specific modal, and every check goes
 *    through isDisplayed / waitForDisplayed - never getElementCount.
 *
 * 2. The row action qids are POSITIONAL (gradingCategoryActionLink-0, -1, ...), not keyed
 *    by category name. A category's row index must be looked up by name every time
 *    (readCategoryNames below) - never cached, never assumed.
 *
 * 3. The list is sorted alphabetically, so a newly created category can land at ANY index
 *    depending on its name. Position is never stable.
 *
 * 4. .message-banner-panel-wrapper is the ONE element here that is genuinely removed from
 *    the DOM when it is not showing (polled 20 s, never present). For the banner only,
 *    presence is a truthful signal.
 *
 * 5. The row dropdown ITEMS ("See details" / "Remove") are in the DOM for EVERY row at all
 *    times, menu open or closed - verified live 2026-08-19: with 3 categories listed and
 *    no menu open, 3 "See details" links exist and 0 are visible. Opening one row's menu
 *    makes only THAT row's items visible (its .dropdown-menu gains .show). So counting the
 *    items is the same false green as trap 1: TST_GCAT_TC_1 opens the menu and checks each
 *    item with isDisplayed.
 *
 * 6. The DETAILS page (.../manage-grading-categories/<id>/classes) does NOT contain the
 *    Classes-tab "School settings" toggle - verified live 2026-08-19. navigate_fromClassesTab
 *    therefore CANNOT recover from there, and reset_state must first step back via the
 *    details page's own Back link (a[qid=gradingCategoryClass-1], verified to return to the
 *    Manage page). This matters because TST_GCAT_TC_6 deliberately ENDS on the details page
 *    so its screenshot carries the evidence (ADR-019).
 *
 * PAGE SCOPING: the two views expose mutually exclusive Angular component tags -
 * <manage-grading-category> (list) and <grading-category-classes> (details). Both views
 * render an unclassed <h1> and a single h2.heading-2, so the component tag is what keeps
 * "the Manage page heading" and "the details page title" from silently matching each
 * other. Never shorten these selectors to a bare h1/h2.
 */

// Product copy for the two success banners, measured live 2026-08-18. Held here because
// waiting for the RIGHT banner is page behaviour; the TCs assert the copy independently,
// so a wording change still fails a test rather than being silently absorbed.
var BANNER_CREATED = "Grading category successfully created";
var BANNER_REMOVED = "Grading category successfully removed";

/**
 * Waits until the banner actually SAYS `expected`, rather than until "a banner is visible".
 *
 * WHY [2026-08-18]: the banner element is reused and each message lingers ~15 s. A TC that
 * creates a category and then removes it is still showing the "successfully created" banner
 * when the removal completes, so waiting on visibility returns instantly and reads the
 * PREVIOUS message. That is the same wrong-signal mistake the Classes-tab work hit five
 * times: wait on the content that changed, never on the container that holds it.
 *
 * Returns { matched, text } - `text` is whatever was on screen when the budget ran out, so
 * a failing TC can report what it actually saw.
 */
async function waitForBannerText(expected, timeoutMs) {
  var deadline = Date.now() + (timeoutMs || SETTLE_TIMEOUT);
  var last = "";
  while (Date.now() < deadline) {
    if ((await action.isDisplayed(mgc.messageBanner)) === true) {
      var t = await action.getText(mgc.messageBannerText);
      last = t && t.message ? "" : String(t).trim();
      if (last === expected) return { matched: true, text: last };
    }
    await browser.pause(200); // polling interval - the text can change without any other signal
  }
  return { matched: false, text: last };
}

/**
 * getText with ADR-009's Error return folded into "", so callers can compare plain strings.
 * An unreadable element and an empty one are deliberately indistinguishable here: both mean
 * "the expected copy is not on screen", which is exactly what the TCs assert against.
 */
async function readText(selector) {
  var t = await action.getText(selector);
  return t && t.message ? "" : String(t).trim();
}

/** Reads every category name currently listed, in DOM order. Returns [] if unreadable. */
async function readCategoryNames() {
  var count = await action.getElementCount(mgc.categoryName);
  if (typeof count !== "number" || count === 0) return [];
  var names = [];
  for (var i = 0; i < count; i++) {
    var txt = await action.getText(mgc.categoryNameByIndex.replace("{{n}}", String(i)));
    // getText returns an Error object on failure (ADR-009); a row can vanish mid-read
    // while the list re-renders. Record it as a miss rather than throwing.
    names.push(txt && txt.message ? "" : String(txt).trim());
  }
  return names;
}

/**
 * Polls until `name` is present (want === true) or absent (want === false) in the list.
 * Returns true if the wanted state was reached, false on timeout.
 */
async function waitForCategoryState(name, want, timeoutMs) {
  var deadline = Date.now() + (timeoutMs || SETTLE_TIMEOUT);
  while (Date.now() < deadline) {
    var names = await readCategoryNames();
    if ((names.indexOf(name) !== -1) === want) return true;
    await browser.pause(250); // polling interval - nothing observable to wait on between polls
  }
  return false;
}

module.exports = {
  schoolSettingsToggle: mgc.schoolSettingsToggle,
  manageGradingCategoriesLink: mgc.manageGradingCategoriesLink,
  createCategoryBtn: mgc.createCategoryBtn,
  backLink: mgc.backLink,
  categoryName: mgc.categoryName,
  // Selector TEMPLATES ({{n}} = the row's 0-based index) - resolved per row at call time.
  categoryNameByIndex: mgc.categoryNameByIndex,
  rowActionsToggleByIndex: mgc.rowActionsToggleByIndex,
  rowSeeDetailsByIndex: mgc.rowSeeDetailsByIndex,
  rowRemoveByIndex: mgc.rowRemoveByIndex,
  createModal: mgc.createModal,
  createModalTitle: mgc.createModalTitle,
  categoryNameInput: mgc.categoryNameInput,
  saveBtn: mgc.saveBtn,
  cancelBtn: mgc.cancelBtn,
  createModalCloseX: mgc.createModalCloseX,
  removeModal: mgc.removeModal,
  removeConfirmBtn: mgc.removeConfirmBtn,
  removeCancelBtn: mgc.removeCancelBtn,
  messageBanner: mgc.messageBanner,
  messageBannerText: mgc.messageBannerText,
  // Manage page chrome (Req #4). Scoped to <manage-grading-category> - see PAGE SCOPING above.
  pageHeading: mgc.pageHeading,
  pageDescription: mgc.pageDescription,
  listHeading: mgc.listHeading,
  categoryRow: mgc.categoryRow,
  rowMenuByIndex: mgc.rowMenuByIndex,
  rowMenuOpen: mgc.rowMenuOpen,
  // "See details" page (Req #6). Scoped to <grading-category-classes>.
  detailsPage: mgc.detailsPage,
  detailsHeading: mgc.detailsHeading,
  detailsActiveClassesHeading: mgc.detailsActiveClassesHeading,
  detailsNoClassesMessage: mgc.detailsNoClassesMessage,
  detailsBackLink: mgc.detailsBackLink,

  /**
   * Confirms the Manage grading categories page has loaded.
   * Anchors on "Create a grading category" [qid=manageGradingCategories-2], which is unique
   * to this view. The <h1> carries no id or class, so it is a weaker anchor and is not used.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.createCategoryBtn, SETTLE_TIMEOUT) };
  },

  /**
   * Navigates Classes tab -> School settings -> Manage grading categories (the real user
   * path, Req #4). Deliberately NOT a direct URL jump: the dropdown route is what a user
   * takes, so a break in it must fail the run rather than be routed around (Invariant 14).
   *
   * The menu lives in the DOM with display:none while closed, so the wait between the two
   * clicks is waitForDisplayed - an existence check would pass instantly and click a
   * hidden link.
   */
  navigate_fromClassesTab: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.toggleClicked = await action.click(this.schoolSettingsToggle);
    if (true != res.toggleClicked) return res;
    res.menuShown = await action.waitForDisplayed(this.manageGradingCategoriesLink, SETTLE_TIMEOUT);
    if (true != res.menuShown) return res;
    res.linkClicked = await action.click(this.manageGradingCategoriesLink);
    if (true != res.linkClicked) return res;
    var init = await this.isInitialized();
    res.pageStatus = init.pageStatus;
    return res;
  },

  /** True when the Manage grading categories page is currently on screen. */
  getData_onPage: async function () {
    await logger.logInto(await stackTrace.get());
    return { displayed: (await action.isDisplayed(this.createCategoryBtn)) === true, pageStatus: true };
  },

  /** All listed category names, in DOM order. */
  getData_categoryNames: async function () {
    await logger.logInto(await stackTrace.get());
    var names = await readCategoryNames();
    return { count: names.length, names: names, pageStatus: true };
  },

  /** True when `name` is listed. */
  getData_categoryListed: async function (name) {
    await logger.logInto(await stackTrace.get());
    var names = await readCategoryNames();
    return { listed: names.indexOf(name) !== -1, names: names, pageStatus: true };
  },

  /** Opens the "Create a new grading category" modal and waits for it to be VISIBLE. */
  click_createCategory: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.createCategoryBtn);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.createModal, SETTLE_TIMEOUT);
    return res;
  },

  /**
   * Types a category name. clearValue + addValue (pressSequentially) - Angular ignores
   * setValue/fill's value on this form (ADR-013 / Invariant 6).
   *
   * READ-BACK [2026-08-18]: the first run created a category called "AutoCat_remove_178"
   * when "AutoCat_remove_1787033009126" was typed - the stored name lost its last 10
   * characters. So this method no longer trusts addValue's own "true"; it polls the field
   * until it really holds `name`, and reports how long that took (settleMs).
   *
   * That makes the field's own value the wait signal instead of the typing call's return
   * value, and it separates the two possible causes: if the field never reaches the full
   * name, the truncation is ours; if it does and the app still stores a short name, the
   * truncation is the product's (Invariant 14 - report, do not work around).
   */
  set_categoryName: async function (name) {
    var res = { pageStatus: false, readBack: "", matches: false, settleMs: null };
    await logger.logInto(await stackTrace.get());
    res.cleared = await action.clearValue(this.categoryNameInput);
    if (true != res.cleared) return res;
    if (name !== "") {
      res.typed = await action.addValue(this.categoryNameInput, name);
      if (true != res.typed) return res;
    } else {
      res.typed = true;
    }
    // TOP-UP LOOP. pressSequentially types faster than this form can consume: the field's
    // async "does this name already exist" check runs between keystrokes and drops some of
    // them. Measured 2026-08-18: 10 characters lost from a 28-character name on one run,
    // 1 on the next, and the missing characters NEVER arrive (a 5 s poll never converged).
    //
    // The loss is variable, so a fixed pause would only paper over it. Instead: read what
    // the field really holds and append exactly what is missing, until it matches. The
    // field's own value stays the pass/fail signal, so this can still never succeed on a
    // corrupted name - it either ends up correct or it fails.
    var started = Date.now();
    var deadline = started + 15000;
    res.attempts = 0;
    while (Date.now() < deadline) {
      var v = await action.getValue(this.categoryNameInput);
      res.readBack = v && v.message ? "" : String(v);
      if (res.readBack === name) { res.matches = true; break; }
      res.attempts++;
      if (name.indexOf(res.readBack) === 0) {
        // Field holds a correct prefix - append only the tail that went missing.
        await action.addValue(this.categoryNameInput, name.slice(res.readBack.length));
      } else {
        // Field holds something unexpected (stale text, reordered keystrokes) - start over.
        await action.clearValue(this.categoryNameInput);
        if (name !== "") await action.addValue(this.categoryNameInput, name);
      }
      await browser.pause(100);
    }
    res.settleMs = Date.now() - started;
    res.pageStatus = res.matches;
    return res;
  },

  /** Whether Save is currently enabled (drives the empty-name check, Req #5). */
  getData_saveEnabled: async function () {
    await logger.logInto(await stackTrace.get());
    return { enabled: (await action.isEnabled(this.saveBtn)) === true, pageStatus: true };
  },

  /** Whether the create modal is currently VISIBLE (not merely present - see trap 1). */
  getData_createModalDisplayed: async function () {
    await logger.logInto(await stackTrace.get());
    return { displayed: (await action.isDisplayed(this.createModal)) === true, pageStatus: true };
  },

  /**
   * Clicks Save, then waits for BOTH signals the app gives: the success banner, and `name`
   * actually appearing in the list. Both are returned so the TC can assert each one - the
   * banner alone would be the app's own label, not proof the data changed (Invariant 13).
   */
  click_save: async function (name) {
    var res = { pageStatus: false, bannerShown: false, listed: false, bannerText: "", preSaveValue: "" };
    await logger.logInto(await stackTrace.get());
    // Diagnostic [2026-08-18]: capture what the field actually holds at the instant Save is
    // pressed. If this is the full name but the app stores a truncated one, the truncation
    // is a product defect, not an automation race - and must be reported, not worked around.
    var pre = await action.getValue(this.categoryNameInput);
    res.preSaveValue = pre && pre.message ? "" : String(pre);
    res.clicked = await action.click(this.saveBtn);
    if (true != res.clicked) return res;
    var banner = await waitForBannerText(BANNER_CREATED, SETTLE_TIMEOUT);
    res.bannerShown = banner.matched;
    res.bannerText = banner.text;
    res.listed = await waitForCategoryState(name, true, SETTLE_TIMEOUT);
    res.pageStatus = res.listed;
    return res;
  },

  /**
   * Cancels the create modal and waits for it to become INVISIBLE.
   *
   * waitForDisplayed(..., reverse=true) waits for Playwright state "hidden"; the modal
   * persists in the DOM (trap 1), so waitForExist would never resolve, and
   * assertPanelClosed is an instantaneous check that would fire mid close-animation.
   */
  click_cancelCreate: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.cancelBtn);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.createModal, SETTLE_TIMEOUT, true);
    return res;
  },

  /**
   * Opens the Remove confirmation for the category called `name`.
   * Looks the row index up by name every time (traps 2 and 3).
   */
  click_removeCategory: async function (name) {
    var res = { pageStatus: false, index: -1 };
    await logger.logInto(await stackTrace.get());
    var names = await readCategoryNames();
    res.index = names.indexOf(name);
    if (res.index === -1) return res;
    res.toggleClicked = await action.click(this.rowActionsToggleByIndex.replace("{{n}}", String(res.index)));
    if (true != res.toggleClicked) return res;
    var removeSel = this.rowRemoveByIndex.replace("{{n}}", String(res.index));
    res.menuShown = await action.waitForDisplayed(removeSel, SETTLE_TIMEOUT);
    if (true != res.menuShown) return res;
    res.removeClicked = await action.click(removeSel);
    if (true != res.removeClicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.removeModal, SETTLE_TIMEOUT);
    return res;
  },

  /** Whether the Remove confirmation modal is VISIBLE, plus its copy. */
  getData_removeModal: async function () {
    await logger.logInto(await stackTrace.get());
    var displayed = (await action.isDisplayed(this.removeModal)) === true;
    var res = { displayed: displayed, pageStatus: true, text: "" };
    if (displayed) {
      var txt = await action.getText(this.removeModal);
      res.text = txt && txt.message ? "" : String(txt).trim();
    }
    return res;
  },

  /**
   * Confirms removal ("Yes, remove"), then waits for BOTH the banner and `name` actually
   * leaving the list - same two-signal reasoning as click_save.
   */
  click_confirmRemove: async function (name) {
    var res = { pageStatus: false, bannerShown: false, removed: false, bannerText: "" };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.removeConfirmBtn);
    if (true != res.clicked) return res;
    var banner = await waitForBannerText(BANNER_REMOVED, SETTLE_TIMEOUT);
    res.bannerShown = banner.matched;
    res.bannerText = banner.text;
    res.removed = await waitForCategoryState(name, false, SETTLE_TIMEOUT);
    res.pageStatus = res.removed;
    return res;
  },

  /** Dismisses the Remove confirmation ("No, go back") and waits for it to close. */
  click_cancelRemove: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.removeCancelBtn);
    if (true != res.clicked) return res;
    res.pageStatus = await action.waitForDisplayed(this.removeModal, SETTLE_TIMEOUT, true);
    return res;
  },

  /**
   * Precondition helper: creates `name` and returns only once it is really listed.
   * Used by the remove TCs so each one owns its data and can run standalone.
   */
  create_category: async function (name) {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    var opened = await this.click_createCategory();
    if (true != opened.pageStatus) return res;
    var typed = await this.set_categoryName(name);
    if (true != typed.pageStatus) return res;
    var saved = await this.click_save(name);
    res.saved = saved;
    res.pageStatus = saved.listed;
    return res;
  },

  /**
   * Everything TST_GCAT_TC_1 (Req #4) asserts about the Manage page, read in one pass:
   * the heading, the description copy, the list heading, the Create button's VISIBILITY,
   * and how many category rows are rendered.
   *
   * createBtnDisplayed goes through isDisplayed rather than a count because
   * isInitialized already waited on the same element - a count here would re-prove
   * nothing and would pass on a hidden button (Invariant 1).
   */
  getData_pageComponents: async function () {
    await logger.logInto(await stackTrace.get());
    var rows = await action.getElementCount(this.categoryRow);
    return {
      heading: await readText(this.pageHeading),
      description: await readText(this.pageDescription),
      listHeading: await readText(this.listHeading),
      createBtnDisplayed: (await action.isDisplayed(this.createCategoryBtn)) === true,
      rowCount: typeof rows === "number" ? rows : -1,
      pageStatus: true
    };
  },

  /**
   * Opens the "Open grade options" menu for the category called `name` and reports whether
   * THAT row's items really became visible.
   *
   * Every row's See details / Remove links exist in the DOM permanently (trap 5), so the
   * only honest check is isDisplayed on the specific row's items after opening its menu.
   * The row index is looked up by name on every call (traps 2 and 3).
   */
  click_openRowMenu: async function (name) {
    var res = { pageStatus: false, index: -1, menuDisplayed: false, seeDetailsDisplayed: false, removeDisplayed: false };
    await logger.logInto(await stackTrace.get());
    var names = await readCategoryNames();
    res.index = names.indexOf(name);
    if (res.index === -1) return res;
    var i = String(res.index);
    res.toggleClicked = await action.click(this.rowActionsToggleByIndex.replace("{{n}}", i));
    if (true != res.toggleClicked) return res;
    res.menuDisplayed = (await action.waitForDisplayed(this.rowMenuByIndex.replace("{{n}}", i), SETTLE_TIMEOUT)) === true;
    if (!res.menuDisplayed) return res;
    res.seeDetailsDisplayed = (await action.isDisplayed(this.rowSeeDetailsByIndex.replace("{{n}}", i))) === true;
    res.removeDisplayed = (await action.isDisplayed(this.rowRemoveByIndex.replace("{{n}}", i))) === true;
    res.pageStatus = true;
    return res;
  },

  /**
   * Closes an open row dropdown with Escape (verified live 2026-08-19: the menu loses
   * .show and the toggle returns to aria-expanded="false").
   *
   * Housekeeping only. TST_GCAT_TC_1 deliberately ENDS with a menu open so its screenshot
   * shows the See details / Remove items, and an open menu is absolutely positioned over
   * the list - it does not cover the Create button, but it can sit over another row's
   * toggle, which the sweep clicks.
   */
  click_closeRowMenu: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.pressed = await action.keyPress("Escape");
    if (true != res.pressed) return res;
    res.pageStatus = await action.waitForDisplayed(this.rowMenuOpen, SETTLE_TIMEOUT, true);
    return res;
  },

  /** True when the "See details" page is currently on screen. */
  getData_onDetailsPage: async function () {
    await logger.logInto(await stackTrace.get());
    return { displayed: (await action.isDisplayed(this.detailsPage)) === true, pageStatus: true };
  },

  /**
   * Confirms the "See details" page has loaded. Anchors on its Back link, which is unique
   * to this view (the Manage page's Back carries a different qid).
   */
  isDetailsInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: await action.waitForDisplayed(this.detailsBackLink, SETTLE_TIMEOUT) };
  },

  /**
   * Opens `name`'s "See details" page (Req #6) by the real user route: row menu -> See details.
   *
   * Both signals the app gives are captured and returned - the URL change AND the page's own
   * anchor - because either one alone could be satisfied while the other is not (an SPA route
   * can change before the view renders).
   */
  click_seeDetails: async function (name) {
    var res = { pageStatus: false, index: -1, urlMatched: false };
    await logger.logInto(await stackTrace.get());
    var opened = await this.click_openRowMenu(name);
    res.index = opened.index;
    res.menuOpened = opened.pageStatus;
    if (true != opened.pageStatus) return res;
    res.clicked = await action.click(this.rowSeeDetailsByIndex.replace("{{n}}", String(opened.index)));
    if (true != res.clicked) return res;
    res.urlMatched = (await action.waitForUrl("**/manage-grading-categories/*/classes", SETTLE_TIMEOUT)) === true;
    var init = await this.isDetailsInitialized();
    res.pageStatus = init.pageStatus === true && res.urlMatched;
    return res;
  },

  /**
   * Everything TST_GCAT_TC_6 asserts about the details page. `noClassesDisplayed` is read
   * separately from its text because the empty-state paragraph only renders when the
   * category has no active classes - a freshly created category always has none.
   */
  getData_detailsPage: async function () {
    await logger.logInto(await stackTrace.get());
    return {
      heading: await readText(this.detailsHeading),
      activeClassesHeading: await readText(this.detailsActiveClassesHeading),
      noClassesDisplayed: (await action.isDisplayed(this.detailsNoClassesMessage)) === true,
      noClassesMessage: await readText(this.detailsNoClassesMessage),
      pageStatus: true
    };
  },

  /** Returns from the details page to the Manage page via its own Back link (trap 6). */
  click_backFromDetails: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.detailsBackLink);
    if (true != res.clicked) return res;
    var init = await this.isInitialized();
    res.pageStatus = init.pageStatus;
    return res;
  },

  /**
   * Housekeeping: leaves the page in a known state - on the categories page, no modal open,
   * and no category whose name starts with `prefix`.
   *
   * Sweeps at the START of each TC as well as the end, so a crashed run cannot bleed state
   * into the next one or silently eat into the school's maximum-categories headroom.
   * Every step reports its outcome; nothing is swallowed (Invariant 13).
   */
  reset_state: async function (prefix) {
    var res = { pageStatus: false, removed: [], failed: [] };
    await logger.logInto(await stackTrace.get());

    // A previous TC (TST_GCAT_TC_6) ends on the "See details" page on purpose, so its
    // screenshot proves the page opened (ADR-019). That page has no School settings toggle
    // (trap 6), so navigate_fromClassesTab below could not recover from it - step back via
    // the details page's own Back link first. Asserted, not fire-and-forget (Invariant 13).
    if ((await this.getData_onDetailsPage()).displayed) {
      res.leftDetailsPage = (await this.click_backFromDetails()).pageStatus;
      if (true != res.leftDetailsPage) return res;
    }

    // A row dropdown left open by TST_GCAT_TC_1 can sit over another row's toggle, which
    // the sweep below clicks.
    if ((await action.isDisplayed(this.rowMenuOpen)) === true) {
      res.closedRowMenu = (await this.click_closeRowMenu()).pageStatus;
      if (true != res.closedRowMenu) return res;
    }

    // A modal left open by a previous TC (TST_GCAT_TC_5 ends with one open on purpose)
    // would block every click that follows.
    if ((await action.isDisplayed(this.createModal)) === true) {
      res.closedCreateModal = (await this.click_cancelCreate()).pageStatus;
    }
    if ((await action.isDisplayed(this.removeModal)) === true) {
      res.closedRemoveModal = (await this.click_cancelRemove()).pageStatus;
    }

    if (!(await this.getData_onPage()).displayed) {
      var nav = await this.navigate_fromClassesTab();
      res.navigated = nav.pageStatus;
      if (true != nav.pageStatus) return res;
    }

    // Remove one at a time, re-reading names each pass: every removal re-indexes the rows.
    for (var guard = 0; guard < 25; guard++) {
      var names = await readCategoryNames();
      var stale = names.filter(function (n) { return n.indexOf(prefix) === 0; });
      if (stale.length === 0) break;
      var target = stale[0];
      var opened = await this.click_removeCategory(target);
      if (true != opened.pageStatus) { res.failed.push(target); break; }
      var confirmed = await this.click_confirmRemove(target);
      if (true == confirmed.removed) res.removed.push(target);
      else { res.failed.push(target); break; }
    }

    res.pageStatus = res.failed.length === 0;
    return res;
  }
};
