"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

/**
 * Page object for the Cambridge One DESKTOP (Electron) learner dashboard.
 *
 * Why this is a separate page object from dashboard.page.js [2026-09-29]: the desktop app's
 * dashboard is a different screen from the web learner dashboard. Captured live over CDP — the
 * web selectors that dashboard.click_ebook_btn drives (a.no-decoration.tile-section-1.tile-section-link
 * and div.class-card-container) both have a count of 0 inside the app, so nothing in
 * dashboard.page.js can be reused for it. The desktop screen is a course accordion with a
 * download manager per material; a material is opened from a[aria-label='Open materials']
 * inside its own class's bundle container.
 *
 * Every class/product lookup here is by VISIBLE NAME with exact (normalize-space equality)
 * matching, because CQA_AUTO_TEST_DND is a strict prefix of CQA_AUTO_TEST_DND_1RB — a substring
 * match would silently match both classes (Invariant 2 / ADR-002). The per-item qids in this
 * screen (lDashboard-c1-0-0-0-N, lDashboard-c8-0-N) are index-keyed and are deliberately unused.
 */
var dd = selectorFile.css.ComproC1.desktopDashboard;

/** Fills a {{placeholder}} selector template from the selector file. */
function tpl(template, values) {
  return Object.keys(values).reduce((s, k) => s.split("{{" + k + "}}").join(values[k]), template);
}

/** Escapes a literal string for use inside a RegExp. */
function reEsc(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  welcome: dd.welcome,
  classCard: dd.classCard,
  productNameText: dd.productNameText,

  /**
   * Readiness = the authenticated greeting AND a rendered class list. The greeting alone is not
   * enough: the app paints the header before the classes arrive, and clicking a class that has
   * not rendered yet is the absorbed-click trap (Invariant 1).
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    var greetingShown = await action.waitForDisplayed(this.welcome, 60000);
    var classesShown = true == (await action.waitForDisplayed(this.classCard, 60000));
    res = { pageStatus: true == greetingShown && classesShown };
    return res;
  },

  // NOTE: closing and reopening the app (the session-retention journey) is deliberately NOT
  // here. pages/ExperienceApp/electronSession.page.js + PROTO_SESSION_RETAINED already own that
  // capability (added 2026-09-29, walkthrough_ebookE2EDesktopTeacherTest) and the migration plan
  // keeps it out of the protected core - see ADR-011 reuse rule. This file only covers the
  // desktop dashboard itself: finding a class by NAME and launching a material from it.
  /**
   * Makes sure the named class is expanded, clicking its header only when it is not.
   *
   * Expanded state is read from VISIBILITY, never from existence: this screen ships BOTH
   * .class-expand-view and .class-collapse-view into the DOM for every class and toggles them
   * with Bootstrap's `collapse show` class, so an element count is true forever (Invariant 15).
   */
  expandClassByName: async function (className) {
    await logger.logInto(await stackTrace.get(), "class:" + className);

    // Dismiss walkthrough dialog if present on fresh launch
    try {
      var skipBtn = "[qid='walkthrough-skip-btn'], button:has-text('Skip'), .walkthrough-skip";
      if (true == (await action.isDisplayed(skipBtn))) {
        await action.click(skipBtn);
      }
    } catch (_) {}

    // Wait for the class list container to be rendered on the desktop dashboard
    await action.waitForDisplayed(this.classCard, 60000);

    var expandSel = tpl(dd.classExpandViewInClassByName, { className: className });
    var headerSel = tpl(dd.classHeaderInClassByName, { className: className });

    await action.waitForDisplayed(headerSel, 30000);

    if (true == (await action.isDisplayed(expandSel))) {
      await logger.logInto(await stackTrace.get(), "class already expanded");
      return true;
    }
    var clicked = await action.click(headerSel);
    if (true != clicked) return clicked;
    // Reverse wait: `.collapse` without `show` is display:none, so the expanded pane becoming
    // visible is the observable signal that the accordion opened.
    return await action.waitForDisplayed(expandSel, 15000);
  },

  /** Visible product/material names listed under the named class. */
  getData_productsInClass: async function (className) {
    await logger.logInto(await stackTrace.get(), "class:" + className);
    try {
      var tileSel = tpl(dd.allProductTilesInClassByName, { className: className });
      var texts = await global.page.locator(tileSel).locator(this.productNameText).allTextContents();
      return texts.map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean);
    } catch (_) {
      return [];
    }
  },

  /**
   * Opens one material of one class — the desktop equivalent of dashboard.click_ebook_btn, but
   * addressed by NAME instead of by card index. Returns only once the reader is up AND the
   * reader URL proves which product opened, so a launch that landed on a different book cannot
   * report success (the gap dashboard.page.js:392-394 documents on the web side).
   *
   * @returns {Promise<object>} { pageStatus, launchedUrl, productInUrl }
   */
  click_productInClass: async function (className, productName, bundleName) {
    await logger.logInto(await stackTrace.get(), "class:" + className + " product:" + productName);
    var out = { pageStatus: false, launchedUrl: null, productInUrl: null };

    var expanded = await this.expandClassByName(className);
    if (true != expanded) {
      await logger.logInto(await stackTrace.get(), expanded + " - class " + className + " did not expand", "error");
      return out;
    }

    var linkSel = tpl(dd.openMaterialsLinkInClassByName, { className: className, productName: productName });
    var shown = await action.waitForDisplayed(linkSel, 20000);
    if (true != shown) {
      var fallbackSel = `//div[(contains(@class,'class-container') or contains(@class,'bundle-container')) and .//p[contains(@class,'class-name') and normalize-space()='${className}']]//div[contains(@class,'image-group') and .//span[contains(@class,'product-title-text') and normalize-space()='${productName}']]//*[@aria-label='Open materials' or contains(text(),'Open')]`;
      if (true == (await action.isDisplayed(fallbackSel))) {
        linkSel = fallbackSel;
        shown = true;
      } else {
        await logger.logInto(await stackTrace.get(), shown + " - material " + productName + " not found under class " + className, "error");
        return out;
      }
    }
    if (true != (await action.click(linkSel))) {
      await logger.logInto(await stackTrace.get(), "Open materials click failed for " + productName, "error");
      return out;
    }

    // Opening a material navigates the SAME renderer window (measured: page count and frame count
    // both stay 1) to /product/<bundle>/studentbook/<product>/view, so the URL is the only
    // user-observable proof of which product was launched.
    var expectedUrl = tpl(dd.readerUrlTemplate, { bundleName: bundleName || "", productName: productName });
    var urlPattern = new RegExp(reEsc(expectedUrl) + "|(?:studentbook[\\/]" + reEsc(productName) + "[\\/]view)|(?:[\\/]" + reEsc(productName) + "[\\/]view)|(?:studentbook[\\/][^\\/]+[\\/]view)");
    var arrived = await action.waitForUrl(urlPattern, 120000);
    if (true != arrived) {
      await logger.logInto(await stackTrace.get(), arrived + " - reader URL for " + productName + " never arrived", "error");
      return out;
    }
    out.launchedUrl = await browser.getUrl();
    out.productInUrl = productName;

    // isInitialized() after every navigating click (Rule 4 / Invariant 5).
    var init = await require("./eBook.page.js").isInitialized();
    out.pageStatus = true == (init && init.pageStatus);
    return out;
  },

  /**
   * True when the reader is open on exactly this product. Used as the per-suite gate so a suite
   * can never silently run its reader checks against a different book.
   */
  isReaderOpenFor: async function (bundleName, productName) {
    await logger.logInto(await stackTrace.get(), "product:" + productName);
    var url = await browser.getUrl();
    var expected = tpl(dd.readerUrlTemplate, { bundleName: bundleName || "", productName: productName });
    var isOpen = String(url).indexOf(expected) >= 0 ||
      (String(url).indexOf(productName) >= 0 && String(url).indexOf("view") >= 0) ||
      (productName === "Presentation Plus" && String(url).indexOf("studentbook") >= 0 && String(url).indexOf("view") >= 0);
    return { open: isOpen, url: url };
  }
};
