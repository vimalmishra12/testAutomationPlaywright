"use strict";
var desktopDashboard = require("../../pages/ExperienceApp/desktopDashboard.page.js");
var sts;

/**
 * Test cases for the Cambridge One DESKTOP (Electron) learner dashboard - module code DASHD
 * (pages/ExperienceApp/desktopDashboard.page.js; the naming rule derives MODULE from the page object).
 *
 * These replace, for the desktop app, the two web steps that surround the reader in the web eBook
 * E2E run: TST_LOGI_TC_1/2/5 (log in through a web browser) and TST_DASH_TC_5 (open the eBook by
 * card INDEX, asserting nothing about which class opened). The reader checks themselves are the
 * existing TST_EBOO_* / feature TCs, reused unchanged from the web execution file (ADR-011) - only
 * the way the reader is reached differs here.
 *
 * The close / reopen / session-retained step is NOT duplicated here: PROTO_SESSION_RETAINED
 * (test/ExperienceApp/electronSession.test.js) already owns it and is reused as-is.
 */
function resolveParams(testdata) {
  if (!testdata) return { className: "", productName: "", bundleName: "" };
  if (typeof testdata === "string") return { className: testdata, productName: testdata, bundleName: "" };
  const className = testdata.className || (testdata.class && testdata.class.name) || "";
  const productName = testdata.productName || (testdata.ebook && testdata.ebook.componentName) || testdata.selectedEbookTitle || "";
  const bundleName = testdata.bundleName || (testdata.bundle && testdata.bundle.name) || (testdata.ebook && testdata.ebook.bundleName) || "";
  return { className, productName, bundleName };
}

module.exports = {
  /**
   * Locates the required class by its visible NAME and makes sure it is expanded. The desktop
   * dashboard is an accordion and a collapsed class renders its materials hidden, so this is the
   * "open the dropdown if required" step of the requirement.
   */
  TST_DASHD_TC_1: async function (testdata) {
    const { className } = resolveParams(testdata);
    sts = await desktopDashboard.expandClassByName(className);
    await assertion.assertEqual(
      sts,
      true,
      "Class '" + className + "' was not found or could not be expanded on the desktop dashboard"
    );
  },

  /** The located class must actually offer the product every suite then launches. */
  TST_DASHD_TC_2: async function (testdata) {
    const { className, productName } = resolveParams(testdata);
    sts = await desktopDashboard.getData_productsInClass(className);
    await assertion.assert(
      Array.isArray(sts) && sts.indexOf(productName) >= 0,
      "Product '" + productName + "' is not listed under class '" + className +
        "' (found: " + JSON.stringify(sts) + ")"
    );
  },

  /** Opens the named material of the named class and waits for the reader to come up. */
  TST_DASHD_TC_3: async function (testdata) {
    const { className, productName, bundleName } = resolveParams(testdata);
    sts = await desktopDashboard.click_productInClass(className, productName, bundleName);
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      "Reader did not open for '" + productName + "' (url: " + sts.launchedUrl + ")"
    );
  },

  /**
   * Per-suite gate: prove the reader is open on exactly the intended product. Every suite repeats
   * it, so a suite that landed on a different book fails here rather than quietly running forty
   * reader checks against the wrong product.
   */
  TST_DASHD_TC_4: async function (testdata) {
    const { productName, bundleName } = resolveParams(testdata);
    sts = await desktopDashboard.isReaderOpenFor(bundleName, productName);
    await assertion.assertEqual(
      sts.open,
      true,
      "Reader is not open on '" + productName + "' - current url: " + sts.url
    );
  }
};
