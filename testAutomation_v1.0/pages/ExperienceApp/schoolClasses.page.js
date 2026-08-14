"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → css.ComproC1.schoolClasses
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.schoolClasses.*
  addClassBtn: selectorFile.css.ComproC1.schoolClasses.addClassBtn,
  activeClassesHeading: selectorFile.css.ComproC1.schoolClasses.activeClassesHeading,

  /**
   * Confirms a school's Classes page (…/org_<slug>/class) has loaded.
   * Anchors on the "Add class" button [qid="aClass-10"], which is unique to this view.
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.addClassBtn)
    };
    return res;
  },

  /**
   * Reads the current active-class count from the "Active classes (N)" heading.
   * The count is captured as a BASELINE only — class creation on this app is
   * asynchronous (the success dialog states it "can take up to 12 hours"), so the
   * newly created class does NOT appear in this count immediately after creation.
   * Returns { count: <int>, raw: <heading text> }; count is null if it can't be parsed.
   */
  getData_activeClassCount: async function () {
    await logger.logInto(await stackTrace.get());
    var obj = { count: null, raw: null };
    if ((await action.getElementCount(this.activeClassesHeading)) > 0) {
      var text = await action.getText(this.activeClassesHeading); // e.g. "Active classes  (8)"
      obj.raw = text;
      var match = /\((\d+)\)/.exec(text || ""); // pull the integer inside the parentheses
      obj.count = match ? parseInt(match[1], 10) : null;
    }
    console.log("activeClassCount", obj);
    return obj;
  },

  /**
   * Clicks "Add class" and confirms the "Create new classes" form loaded.
   * Uses lazy require to avoid a circular dependency with createClasses.page.js (ADR-004).
   */
  click_addClass: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.addClassBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " addClassBtn is clicked");
      res = await require("./createClasses.page.js").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "addClassBtn is NOT clicked",
        "error"
      );
    }
    return res;
  }
};
