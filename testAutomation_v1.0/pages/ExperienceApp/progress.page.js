"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
  progress: selectorFile.css.ComproC1.progress.progress,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.progress),
    };
    return res;
  },

  // ---------------------------------------------------------------------------------------------
  // Module PROG (2026-09-23, prod) — the progress views for a learner's SUBMITTED activities (LP-034).
  // Learner: class card "My progress" → /class/learner/…/aggregated-progress (summary + one block per
  // component) → product card → /bundle/<id> → component → Unit/Lesson → one row per activity.
  // Teacher: class "Class data" (class metrics + one card per student) → the student's product card →
  // /learner/<id>/bundle/<id> → the SAME component / activity rows as the learner.
  // Blocks are returned as whitespace-normalised TEXT; the test compares expected phrases.
  // ---------------------------------------------------------------------------------------------

  /** Whitespace-normalised text of the first element matching `sel`, or null when it never shows. */
  _text: async function (sel, timeout) {
    if (true != (await action.waitForDisplayed(sel, timeout || 30000))) return null;
    return String(await action.getText(sel)).replace(/\s+/g, " ").trim();
  },

  /** Learner "My progress" (aggregated): the summary and each named component's block. */
  getData_aggregatedProgress: async function (componentNames) {
    await logger.logInto(await stackTrace.get(), "components:" + componentNames.join(" | "));
    var pr = selectorFile.css.ComproC1.progress;
    var out = { title: null, summary: null, components: {} };
    out.title = await this._text(pr.aggPageTitle, 60000);
    if (out.title === null) return out;
    out.summary = await this._text(pr.aggSummary);
    for (var i = 0; i < componentNames.length; i++) {
      out.components[componentNames[i]] = await this._text(pr.aggComponentBlock.replace(/\{NAME\}/g, componentNames[i]));
    }
    return out;
  },

  /** From "My progress": the product card → the product's progress page (same page as "See Progress"). */
  click_aggregatedBundle: async function (productTitle) {
    await logger.logInto(await stackTrace.get(), "product:" + productTitle);
    var pr = selectorFile.css.ComproC1.progress;
    var card = pr.aggBundleCard.replace(/\{PRODUCT\}/g, productTitle);
    var res = await action.waitForDisplayed(card, 30000);
    if (true == res) res = await action.click(card);
    return { opened: true == res && true == (await action.waitForUrl(/\/bundle\//, 30000)) };
  },

  /**
   * On a product's progress page (learner or teacher): opens the named component and reads one row per
   * activity — its text (e.g. "BASE04_… First score 100% Best score 100% Attempts 1") and its status icon's
   * aria-label (e.g. "Completed above target", "Activity status: viewed", "Activity status: evaluation pending").
   */
  getData_componentActivities: async function (componentName, activityNames) {
    await logger.logInto(await stackTrace.get(), "component:" + componentName);
    var pr = selectorFile.css.ComproC1.progress;
    var out = { opened: false, rows: {} };
    var link = action.getFilteredLocator(pr.bundleComponentLink, componentName);
    var res = await action.waitForDisplayed(link, 30000);
    if (true == res) res = await action.click(link);
    out.opened = true == res && true == (await action.waitForDisplayed(pr.lessonTable, 30000));
    if (!out.opened) return out;
    for (var i = 0; i < activityNames.length; i++) {
      var name = activityNames[i];
      var rowSel = pr.activityRow.replace(/\{NAME\}/g, name);
      var text = await this._text(rowSel, 10000);
      var statusSel = pr.activityRowStatus.replace(/\{NAME\}/g, name);
      var status = (await action.getElementCount(statusSel)) > 0 ? await action.getAttribute(statusSel, "aria-label") : null;
      out.rows[name] = { text: text, status: status };
    }
    return out;
  },

  /** Teacher "Class data": the class metrics block and the named student's metrics card. */
  getData_teacherClassProgress: async function (learnerName) {
    await logger.logInto(await stackTrace.get(), "learner:" + learnerName);
    var pr = selectorFile.css.ComproC1.progress;
    return {
      classMetrics: await this._text(pr.teacherClassMetrics),
      studentMetrics: await this._text(pr.teacherStudentMetrics.replace(/\{LEARNER\}/g, learnerName)),
    };
  },

  /** Teacher "Class data": the named student's product card → that student's product progress page. */
  click_teacherStudentBundle: async function (learnerName, productTitle) {
    await logger.logInto(await stackTrace.get(), "learner:" + learnerName + " product:" + productTitle);
    var pr = selectorFile.css.ComproC1.progress;
    var card = pr.teacherStudentBundleCard.replace(/\{LEARNER\}/g, learnerName).replace(/\{PRODUCT\}/g, productTitle);
    var res = await action.waitForDisplayed(card, 30000);
    if (true == res) res = await action.click(card);
    return { opened: true == res && true == (await action.waitForUrl(/\/learner\/[^/]+\/bundle\//, 30000)) };
  },

  getData_progress: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      progress:
        (await action.getElementCount(this.progress)) > 0
          ? await action.getText(this.progress)
          : null,
      my_homework:
        (await action.getElementCount(this.my_homework)) > 0
          ? await action.getText(this.my_homework)
          : null,
    };
    return obj;
  },
};
