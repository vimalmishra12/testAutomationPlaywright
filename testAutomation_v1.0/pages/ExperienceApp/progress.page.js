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

  /** True when every phrase of `phrases` is contained in `text`. */
  _hasAll: function (text, phrases) {
    if (typeof text !== "string") return false;
    for (var i = 0; i < phrases.length; i++) if (text.indexOf(phrases[i]) === -1) return false;
    return true;
  },

  /**
   * Re-reads the current page (reload every `reloadEveryMs`) until `read()` returns data for which `settled(data)`
   * is true, or `timeoutMs` passes. Returns the LAST data read plus settled / attempts / waitedMs.
   * [2026-09-24, prod — user-confirmed expected] The progress SUMMARY totals (learner "My progress", teacher
   * Class data) are updated by a batch analytics job and lag the submissions by SEVERAL MINUTES (read at once:
   * 1/10 and 10%; ~2 min after the run: 3/10 and 30%). The per-activity rows are immediate and need no wait.
   */
  _pollUntilSettled: async function (read, settled, timeoutMs, reloadEveryMs) {
    var url = await browser.getUrl();
    var start = Date.now();
    var attempts = 0;
    var data = await read();
    attempts++;
    while (!settled(data) && Date.now() - start < timeoutMs) {
      await browser.pause(reloadEveryMs); // sanctioned: nothing on the page signals the batch job (Invariant 1)
      await browser.url(url);
      await action.waitForDocumentLoad();
      data = await read();
      attempts++;
    }
    return { data: data, settled: settled(data), attempts: attempts, waitedMs: Date.now() - start };
  },

  /** Learner "My progress" read repeatedly until the summary and every component block show the expected phrases. */
  getData_aggregatedProgressSettled: async function (expectedSummary, expectedComponents, timeoutMs, reloadEveryMs) {
    await logger.logInto(await stackTrace.get(), "timeout:" + timeoutMs + " reloadEvery:" + reloadEveryMs);
    var self = this;
    var names = Object.keys(expectedComponents);
    var r = await this._pollUntilSettled(
      function () { return self.getData_aggregatedProgress(names); },
      function (d) {
        if (!self._hasAll(d.summary, expectedSummary)) return false;
        for (var i = 0; i < names.length; i++) if (!self._hasAll(d.components[names[i]], expectedComponents[names[i]])) return false;
        return true;
      }, timeoutMs, reloadEveryMs);
    return Object.assign({ settled: r.settled, attempts: r.attempts, waitedMs: r.waitedMs }, r.data);
  },

  /** Teacher Class data read repeatedly until the class metrics and the student's card show the expected phrases. */
  getData_teacherClassProgressSettled: async function (learnerName, expectedClass, expectedStudent, timeoutMs, reloadEveryMs) {
    await logger.logInto(await stackTrace.get(), "learner:" + learnerName + " timeout:" + timeoutMs);
    var self = this;
    var r = await this._pollUntilSettled(
      function () { return self.getData_teacherClassProgress(learnerName); },
      function (d) { return self._hasAll(d.classMetrics, expectedClass) && self._hasAll(d.studentMetrics, expectedStudent); },
      timeoutMs, reloadEveryMs);
    return Object.assign({ settled: r.settled, attempts: r.attempts, waitedMs: r.waitedMs }, r.data);
  },

  /**
   * [2026-09-24] LP-035 (learner): the bell's "New feedback" notification (matched by TEXT — the ntf-<n> qids are
   * positional) opens the marked PS in the player: the learner's score and the teacher's score + feedback.
   */
  getData_feedbackNotification: async function (itemText) {
    await logger.logInto(await stackTrace.get(), "item:" + itemText);
    var pr = selectorFile.css.ComproC1.progress;
    var out = { itemShown: false, itemLabel: null, score: null, teacherScore: null, teacherFeedback: null };
    var res = await action.waitForDisplayed(pr.notificationBtn, 60000);
    if (true == res) res = await action.click(pr.notificationBtn);
    var item = action.getFilteredLocator(pr.notificationItem, itemText);
    out.itemShown = true == res && true == (await action.waitForDisplayed(item, 30000));
    if (!out.itemShown) return out;
    out.itemLabel = String(await action.getText(item)).replace(/\s+/g, " ").trim();
    if (true != (await action.click(item))) return out;
    if (true != (await action.waitForDisplayed(pr.feedbackScore, 60000))) return out;
    out.score = String(await action.getText(pr.feedbackScore)).trim();
    if (true == (await action.waitForDisplayed(pr.feedbackTeacherScore, 15000))) {
      out.teacherScore = String(await action.getText(pr.feedbackTeacherScore)).trim();
      out.teacherFeedback = String(await action.getText(pr.feedbackTeacherText)).trim();
    }
    return out;
  },

  /**
   * [2026-09-24] LP-035 (teacher): Class data → "Show progress details" → the named learner's per-component blocks.
   * The switch's checkbox is visually hidden, so its label.switch is clicked; the state is read from the checkbox.
   */
  getData_teacherProgressDetails: async function (learnerName, componentNames) {
    await logger.logInto(await stackTrace.get(), "learner:" + learnerName);
    var pr = selectorFile.css.ComproC1.progress;
    var out = { switchedOn: false, components: {} };
    var res = await action.waitForDisplayed(pr.progressDetailsSwitch, 30000);
    if (true == res && true != (await action.isSelected(pr.progressDetailsCheckbox))) res = await action.click(pr.progressDetailsSwitch);
    out.switchedOn = true == res && true == (await action.isSelected(pr.progressDetailsCheckbox));
    if (!out.switchedOn) return out;
    for (var i = 0; i < componentNames.length; i++) {
      var sel = pr.teacherStudentComponentBlock.replace(/\{LEARNER\}/g, learnerName).replace(/\{NAME\}/g, componentNames[i]);
      out.components[componentNames[i]] = await this._text(sel, 30000);
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
