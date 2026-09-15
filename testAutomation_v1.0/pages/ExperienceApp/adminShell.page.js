"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Resolves to C1Selectors.json → css.ComproC1.adminShell
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sh = selectorFile.css.ComproC1.adminShell;

/**
 * Admin App shell chrome — header Help menu and tutorials, profile menu, site language, the
 * Administrator/Teacher toggle, the admin footer, and school switching (modules ASHL, FOOT
 * extension, SADB extension).
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS HANDLED  (grounded live on Thor 2026-09-14 — admin-shared.md §A9, §A11, §A12)
 * ---------------------------------------------------------------------------------------
 *
 * 1. THE LOADING OVERLAY SWALLOWS CLICKS ON VISIBLE ELEMENTS. Every click waits for
 *    `#loader-container .loader` to be hidden first — the root cause of most of the Library suite's
 *    first-run failures.
 *
 * 2. THE LOGGED-IN LANGUAGE CONTROL IS `cFooter-7` / `cFooter-8-*`, NOT `sp-ldd-*` (§A12 corrects
 *    §A9). The active option carries class `active`.
 *
 * 3. LANGUAGE SWITCHING IS ASYMMETRIC. en→es re-renders in place; es→en RELOADS the page. So the
 *    switch waits on `html[lang]` reaching the target by polling, and tolerates the read failing
 *    mid-reload — a class-change wait would pass before the reload and then act on a dead page.
 *
 * 4. LANGUAGE PERSISTS PER BROWSER (localStorage), NOT PER ACCOUNT. A fresh context starts in
 *    English, so a failed restore cannot leak into another suite — but it CAN leak into later cases
 *    in the same suite, which is why tests restore English in their own flow.
 *
 * 5. THE TOGGLE'S SWITCH CLASS DIFFERS PER VIEW — `.can-toggle__switch` (admin) vs
 *    `.can-toggle-switch` (teacher). → the click targets both; state is read from the input's
 *    checked property and the switch's accessible name, never from a class.
 *
 * 6. TOGGLING BACK RETURNS TO THE ADMIN PAGE THE ROUND TRIP STARTED ON, and the document title is
 *    unstable (§A12). → nothing here reads the title.
 *
 * 7. LOGGED-IN INTERNAL FOOTER HREFS ARE `javascript:void(0)`. → destinations are read from the
 *    URL after clicking, never from the href.
 *
 * 8. ALL FIVE TUTORIAL TOPICS SHARE ONE QID (`cHeader-hlp-6`) and `cFooter-9` is shared by FAQs and
 *    "Cambridge One for schools". → topics by index; the two footer links disambiguated by class.
 */

/** Overlay and navigation budget — matches schoolLibrary.page.js (measured tab load 20.6 s x2). */
var NAV_TIMEOUT = 45000;

/** Menu open budget. BUDGET — unmeasured; menus are pre-rendered and appeared within one poll. */
var MENU_TIMEOUT = 5000;

/** Language switch budget — covers the es→en reload. BUDGET — unmeasured beyond "within ~40 s". */
var LANGUAGE_TIMEOUT = 45000;

var POLL_MS = 200;

/** Settle before clicking the role toggle. BUDGET — unmeasured; 3 s worked where 0 s failed (2026-09-14). */
var TOGGLE_SETTLE_MS = 3000;

module.exports = {
  pageLoader: sh.pageLoader,
  htmlRoot: sh.htmlRoot,
  helpTrigger: sh.helpTrigger,
  helpCentreItem: sh.helpCentreItem,
  tutorialsItem: sh.tutorialsItem,
  tutorialTopic: sh.tutorialTopic,
  profileMenuTrigger: sh.profileMenuTrigger,
  myProfileItem: sh.myProfileItem,
  logoutItem: sh.logoutItem,
  languageTrigger: sh.languageTrigger,
  languageOptionEnglish: sh.languageOptionEnglish,
  languageOptionSpanish: sh.languageOptionSpanish,
  languageOptionActive: sh.languageOptionActive,
  footerTermsOfUse: sh.footerTermsOfUse,
  footerPrivacyNotice: sh.footerPrivacyNotice,
  footerAccessibility: sh.footerAccessibility,
  footerSiteFeedback: sh.footerSiteFeedback,
  footerOurApproach: sh.footerOurApproach,
  footerHelp: sh.footerHelp,
  footerFAQs: sh.footerFAQs,
  footerCambridgeOneForSchools: sh.footerCambridgeOneForSchools,
  footerDestinationLinks: sh.footerDestinationLinks,
  footerCopyright: sh.footerCopyright,
  roleToggleInput: sh.roleToggleInput,
  roleToggleSwitchAdmin: sh.roleToggleSwitchAdmin,
  roleToggleSwitchTeacher: sh.roleToggleSwitchTeacher,
  roleToggleSwitchAny: sh.roleToggleSwitchAny,
  teacherDashboardGreeting: sh.teacherDashboardGreeting,
  teacherCreateClassBtn: sh.teacherCreateClassBtn,

  /** Confirms the admin shell is rendered and the loading overlay has cleared. */
  isInitialized: async function () {
    var res = await action.waitForDisplayed(this.helpTrigger, NAV_TIMEOUT);
    if (true != res) return res;
    return await this.waitForLoaderGone();
  },

  /** Waits for the full-page loading overlay to be hidden (trap 1). */
  waitForLoaderGone: async function () {
    var res = await action.waitForDisplayed(this.pageLoader, NAV_TIMEOUT, true);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the page loading overlay never cleared", "error");
    }
    return res;
  },

  /** Polls the current URL until it contains `fragment`; returns true or an Error naming the URL. */
  waitForUrlFragment: async function (fragment, timeout) {
    var deadline = Date.now() + (timeout || NAV_TIMEOUT);
    var url = "";
    while (Date.now() < deadline) {
      url = await browser.getUrl();
      if (typeof url == "string" && url.indexOf(fragment) > -1) return true;
      await browser.pause(POLL_MS);
    }
    var err = new Error("the URL never contained '" + fragment + "'. The browser is on: " + url);
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  // ------------------------------------------------------------------ Help menu (ASHL_TC_3/4)

  /** Opens Help and returns its two items. */
  getData_helpMenu: async function () {
    var clear = await this.waitForLoaderGone();
    if (true != clear) return { opened: clear, items: [] };
    var res = await action.click(this.helpTrigger);
    if (true != res) return { opened: res, items: [] };
    var opened = await action.waitForDisplayed(this.helpCentreItem, MENU_TIMEOUT);
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    return {
      opened: opened,
      items: [squash(await action.getText(this.helpCentreItem)), squash(await action.getText(this.tutorialsItem))]
    };
  },

  /** Opens Help → Tutorials and returns every topic title, by index (trap 8). */
  getData_tutorialTopics: async function () {
    var menu = await this.getData_helpMenu();
    if (true != menu.opened) return { opened: menu.opened, topics: [] };
    var res = await action.click(this.tutorialsItem);
    if (true != res) return { opened: res, topics: [] };
    var opened = await action.waitForDisplayed(this.tutorialTopic, MENU_TIMEOUT);
    var count = await action.getElementCount(this.tutorialTopic);
    var topics = [];
    for (var i = 0; typeof count == "number" && i < count; i++) {
      var el = await action.getKthElement(this.tutorialTopic, i);
      var t = el ? await action.getText(el) : null;
      topics.push(typeof t == "string" ? t.replace(/\s+/g, " ").trim() : null);
    }
    return { opened: opened, topics: topics };
  },

  // ------------------------------------------------------------------ Profile menu (MYPR_TC_1)

  /** Opens the profile menu and returns its item labels. */
  getData_profileMenu: async function () {
    var clear = await this.waitForLoaderGone();
    if (true != clear) return { opened: clear };
    var res = await action.click(this.profileMenuTrigger);
    if (true != res) return { opened: res };
    var opened = await action.waitForDisplayed(this.myProfileItem, MENU_TIMEOUT);
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    return {
      opened: opened,
      accountName: squash(await action.getText(this.profileMenuTrigger)),
      myProfile: squash(await action.getText(this.myProfileItem)),
      logout: squash(await action.getText(this.logoutItem))
    };
  },

  /** Opens My profile from the header menu and confirms Manage profile rendered. */
  click_myProfile: async function () {
    // Open the menu only if it is not already open: a second click on the trigger is intercepted by
    // the open dropdown (Playwright: "dropdown-menu … show subtree intercepts pointer events") —
    // TST_MYPR_TC_1 reads the menu first, then calls this (first run 2026-09-14).
    if (true != (await action.isDisplayed(this.myProfileItem))) {
      var menu = await this.getData_profileMenu();
      if (true != menu.opened) return menu.opened;
    }
    var res = await action.click(this.myProfileItem);
    if (true != res) return res;
    var onUrl = await this.waitForUrlFragment("/dashboard/my-profile");
    if (true != onUrl) return onUrl;
    // Lazy require — the profile page and the shell navigate to each other (ADR-004).
    return await require("./myProfile.page.js").isInitialized();
  },

  // ------------------------------------------------------------------ Language (ASHL_TC_1/2)

  /** Reads the language control: the trigger's name, both options, and which one is active. */
  getData_languageControl: async function () {
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    var enActive = await action.getAttribute(this.languageOptionEnglish, "class");
    var esActive = await action.getAttribute(this.languageOptionSpanish, "class");
    return {
      triggerAriaLabel: await action.getAttribute(this.languageTrigger, "aria-label"),
      options: [squash(await action.getText(this.languageOptionEnglish)), squash(await action.getText(this.languageOptionSpanish))],
      englishActive: typeof enActive == "string" && /\bactive\b/.test(enActive),
      spanishActive: typeof esActive == "string" && /\bactive\b/.test(esActive),
      activeOptionCount: await action.getElementCount(this.languageOptionActive),
      htmlLang: await action.getAttribute(this.htmlRoot, "lang")
    };
  },

  /**
   * Switches the site language and waits for html[lang] to reach the target (trap 3).
   * @param {"en"|"es"} lang
   */
  select_language: async function (lang) {
    var option = lang === "es" ? this.languageOptionSpanish : this.languageOptionEnglish;
    var clear = await this.waitForLoaderGone();
    if (true != clear) return clear;
    var res = await action.click(this.languageTrigger);
    if (true != res) return res;
    var shown = await action.waitForDisplayed(option, MENU_TIMEOUT);
    if (true != shown) return shown;
    res = await action.click(option);
    if (true != res) return res;

    var deadline = Date.now() + LANGUAGE_TIMEOUT;
    while (Date.now() < deadline) {
      // getAttribute returns an Error (never throws) while the es→en reload tears the page down.
      var current = await action.getAttribute(this.htmlRoot, "lang");
      if (current === lang) {
        var ready = await this.waitForLoaderGone();
        if (true != ready) return ready;
        await logger.logInto(await stackTrace.get(), "site language is now " + lang);
        return true;
      }
      await browser.pause(POLL_MS);
    }
    var err = new Error("the site language did not become '" + lang + "' within " + LANGUAGE_TIMEOUT + "ms");
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /** Reads the shell strings ASHL_TC_2 compares across languages — none embed live data. */
  getData_shellCopy: async function () {
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    return {
      htmlLang: await action.getAttribute(this.htmlRoot, "lang"),
      help: squash(await action.getText(this.helpTrigger)),
      footerTermsOfUse: squash(await action.getText(this.footerTermsOfUse)),
      footerPrivacyNotice: squash(await action.getText(this.footerPrivacyNotice)),
      footerAccessibility: squash(await action.getText(this.footerAccessibility)),
      footerHelp: squash(await action.getText(this.footerHelp)),
      footerOurApproach: squash(await action.getText(this.footerOurApproach)),
      footerCambridgeOneForSchools: squash(await action.getText(this.footerCambridgeOneForSchools)),
      languageTriggerAriaLabel: await action.getAttribute(this.languageTrigger, "aria-label"),
      roleToggleAriaLabel: await action.getAttribute(this.roleToggleSwitchAny, "aria-label")
    };
  },

  /** Reloads the current page and waits for the shell (ASHL_TC_2 persistence check). */
  reload: async function () {
    var url = await browser.getUrl();
    await browser.url(url);
    return await this.isInitialized();
  },

  // ------------------------------------------------------------------ Footer (FOOT_TC_10/11)

  /** Reads every admin footer link, the absent Site Feedback link, and the copyright line. */
  getData_footer: async function () {
    var squash = function (v) { return typeof v == "string" ? v.replace(/\s+/g, " ").trim() : null; };
    return {
      destinationLinkCount: await action.getElementCount(this.footerDestinationLinks),
      links: [
        squash(await action.getText(this.footerTermsOfUse)),
        squash(await action.getText(this.footerPrivacyNotice)),
        squash(await action.getText(this.footerAccessibility)),
        squash(await action.getText(this.footerOurApproach)),
        squash(await action.getText(this.footerFAQs)),
        squash(await action.getText(this.footerCambridgeOneForSchools)),
        squash(await action.getText(this.footerHelp))
      ],
      // Site Feedback is genuinely NOT rendered in the admin app, so a count is truthful here.
      siteFeedbackCount: await action.getElementCount(this.footerSiteFeedback),
      copyright: squash(await action.getText(this.footerCopyright)),
      ourApproachHref: await action.getAttribute(this.footerOurApproach, "href"),
      ourApproachTarget: await action.getAttribute(this.footerOurApproach, "target"),
      ourApproachRel: await action.getAttribute(this.footerOurApproach, "rel")
    };
  },

  /**
   * Clicks an INTERNAL footer link and returns the URL it lands on (trap 7). The destination pages
   * leave the admin app, so the caller must re-open the school afterwards.
   * @param {"footerTermsOfUse"|"footerPrivacyNotice"|"footerAccessibility"|"footerCambridgeOneForSchools"} key
   */
  click_footerLink: async function (key) {
    var sel = this[key];
    if (!sel) return { clicked: new Error("unknown footer link key: " + key) };
    var clear = await this.waitForLoaderGone();
    if (true != clear) return { clicked: clear };
    var before = await browser.getUrl();
    var res = await action.click(sel);
    if (true != res) return { clicked: res };
    var deadline = Date.now() + NAV_TIMEOUT;
    var url = before;
    while (Date.now() < deadline) {
      url = await browser.getUrl();
      if (url !== before) break;
      await browser.pause(POLL_MS);
    }
    return { clicked: true, urlBefore: before, urlAfter: url };
  },

  // ------------------------------------------------------------------ Role toggle (SADB_TC_5)

  /** Reads the toggle: the input's checked state, the switch's name, and which switch class exists. */
  getData_roleToggle: async function () {
    return {
      checked: true == (await action.isSelected(this.roleToggleInput)),
      ariaLabel: await action.getAttribute(this.roleToggleSwitchAny, "aria-label"),
      adminSwitchCount: await action.getElementCount(this.roleToggleSwitchAdmin),
      teacherSwitchCount: await action.getElementCount(this.roleToggleSwitchTeacher),
      url: await browser.getUrl()
    };
  },

  /**
   * Activates the toggle and waits for the other view's URL (trap 5/6).
   * @param {"teacher"|"admin"} to
   */
  click_roleToggle: async function (to) {
    var clear = await this.waitForLoaderGone();
    if (true != clear) return clear;
    // The switch renders (and the loader clears) before its click handler is bound: on the first run
    // a click in the teacher view returned true and changed nothing; with a settle the same click
    // navigated (diagnostic run 2026-09-14 — one element, visible, correct aria-label both times).
    // Handler binding is not observable (admin-shared §B6, cf. the Filter panel X close), so a settle
    // precedes the SINGLE click — never a retry-click, which would toggle twice.
    await browser.pause(TOGGLE_SETTLE_MS);
    var res = await action.click(this.roleToggleSwitchAny);
    if (true != res) return res;
    var onUrl = await this.waitForUrlFragment(to === "teacher" ? "/dashboard/teacher" : "/admin/admin/");
    if (true != onUrl) return onUrl;
    return await this.waitForLoaderGone();
  },

  // ------------------------------------------------------------------ School switching (SADB_TC_3)

  /**
   * Goes to My school accounts and opens a school BY KEY (never by name — two schools share one).
   * Reuses the dashboard page object's key-based selection rather than duplicating its selector.
   */
  open_schoolByKey: async function (schoolKey) {
    await browser.url("/admin/admin/dashboard");
    var clear = await this.waitForLoaderGone();
    if (true != clear) return clear;
    var dashboard = require("./schoolAdminDashboard.page.js");
    var ready = await dashboard.isInitialized();
    if (!(ready === true || (ready && ready.pageStatus === true))) return ready;
    clear = await this.waitForLoaderGone();
    if (true != clear) return clear;
    var opened = await dashboard.click_schoolByKey(schoolKey);
    if (!(opened === true || (opened && opened.pageStatus === true))) return opened;
    return await this.waitForLoaderGone();
  },

  /**
   * Returns the whole page's visible text in ONE read, for "this string must NOT appear" checks
   * (TST_SADB_TC_3's no-carry-over assertion). One getText on the root replaces a per-row walk and
   * cannot stall on an absent element — the root always exists.
   */
  getData_pageText: async function () {
    return await action.getText(this.htmlRoot);
  },

  /** Returns the open school's org slug (captured from the URL, never constructed) and heading. */
  getData_schoolContext: async function () {
    var url = await browser.getUrl();
    var slug = typeof url == "string" ? (url.match(/\/(org_[A-Za-z0-9_-]+)\//) || [])[1] : null;
    var heading = await action.getText(this.teacherDashboardGreeting);
    return { url: url, orgSlug: slug || null, heading: typeof heading == "string" ? heading.trim() : null };
  }
};
