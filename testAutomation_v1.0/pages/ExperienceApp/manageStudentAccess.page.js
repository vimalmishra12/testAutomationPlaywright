"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

/**
 * Teacher class > Materials > "Manage student access" (module MSAC — agreed with the user 2026-09-23).
 * Captured live on production 2026-09-23 — see learning-path-player.md §A9.
 *
 * ⚠️ READ-ONLY BY DESIGN. Creating an access rule changes the class for its learners. The LP suite opens
 * the rule-creation flow and launches the Learning Path component inside it, and STOPS: "Continue"
 * (create-rules-btn-2) is never clicked, so no rule is created (user decision 2026-09-23). The suite's
 * browser context is closed at the end of the suite, which discards the unfinished rule.
 */
module.exports = {
  heading: selectorFile.css.ComproC1.manageStudentAccess.heading,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: true == (await action.waitForDisplayed(this.heading, 30000)) };
  },

  /**
   * LP-031: from the class Materials tab — the product's "Manage student access" → "Create access rule" →
   * the component BY NAME → the Learning Path opens in /create-access mode: TOC with "Select all units"
   * and Cancel / Continue.
   */
  launch_componentInCreateRule: async function (bundleName, componentName) {
    await logger.logInto(await stackTrace.get(), "bundle:" + bundleName + " component:" + componentName);
    var ms = selectorFile.css.ComproC1.manageStudentAccess;
    var link = ms.manageAccessLinkInBundle.replace("{{bundleName}}", bundleName);
    var comp = ms.componentByName.replace(/\{NAME\}/g, componentName);
    var out = { pageShown: false, pickerShown: false, onRoute: false, tocShown: false, selectAllShown: false, cancelShown: false, continueShown: false };
    var res = await action.waitForDisplayed(link, 30000);
    if (true == res) res = await action.click(link);
    out.pageShown = true == res && (await this.isInitialized()).pageStatus;
    if (!out.pageShown) return out;
    res = await action.click(ms.createRuleBtn);
    out.pickerShown = true == res && true == (await action.waitForDisplayed(comp, 30000));
    if (!out.pickerShown || true != (await action.click(comp))) return out;
    out.onRoute = true == (await action.waitForUrl(/\/learning-path\/teacher\/.*\/create-access/, 60000));
    out.tocShown = out.onRoute && true == (await action.waitForDisplayed(ms.tocSidebar, 30000));
    out.selectAllShown = out.tocShown && true == (await action.waitForDisplayed(ms.selectAllUnits, 10000));
    out.cancelShown = true == (await action.isDisplayed(ms.cancelBtn));
    out.continueShown = true == (await action.isDisplayed(ms.continueBtn));
    return out;
  },
};
