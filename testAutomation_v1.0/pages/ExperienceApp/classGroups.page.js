"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

/**
 * Module CGRP — teacher class groups (agreed with the user 2026-09-23), captured live on production 2026-09-25
 * (teacher _6fho, Class jyaf). Entry: class page → Class data → the Students/Groups switch → "Create groups" →
 * /class/…/group/create-group. See product-knowledge/ExperienceApp/new-learning-path.md §A11.
 *
 * ⚠️ MUTATES: creating a group changes the class. The NLP suite groups only its OWN run's two learners
 * (user decision 2026-09-25) under a run-generated, prefixed name (ADR-021: "NLPGroup <rand4>").
 */
module.exports = {
  groupSwitchLabel: selectorFile.css.ComproC1.classGroups.groupSwitchLabel,

  /** The class's Class data view, ready when the Students/Groups switch is shown. */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    return { pageStatus: true == (await action.waitForDisplayed(this.groupSwitchLabel, 60000)) };
  },

  /**
   * Switches Class data to its Groups view. The switch's input is visually hidden — its label is clicked; the
   * Groups view is recognised by its "Groups (n)" heading, which is read back.
   */
  open_groupsView: async function () {
    await logger.logInto(await stackTrace.get());
    var cg = selectorFile.css.ComproC1.classGroups;
    var res = await this.isInitialized();
    if (true != res.pageStatus) return { groupsShown: false, heading: null };
    if (true != (await action.isSelected(cg.groupSwitchInput))) await action.click(cg.groupSwitchLabel);
    var shown = true == (await action.waitForDisplayed(cg.groupsHeading, 15000));
    return { groupsShown: shown, heading: shown ? String(await action.getText(cg.groupsHeading)).replace(/\s+/g, " ").trim() : null };
  },

  /**
   * Creates a group named `name` with the students whose e-mails are given, from the Groups view.
   * - Students are matched by E-MAIL (display names repeat); their checkbox is ticked by clicking div.checkbox
   *   (the label is sr-only, 0 px wide; the input is opacity 0 on top of the div) and read back from the input.
   * - Create is CSS-disabled until the form is valid; the TOP Create is overlapped by the bottom container, so
   *   the bottom one is clicked. Measured 2026-09-25: back on Class data ~5 s after Create.
   */
  create_group: async function (name, emails) {
    await logger.logInto(await stackTrace.get(), "group:" + name + " students:" + emails.join(" | "));
    var cg = selectorFile.css.ComproC1.classGroups;
    var out = { formShown: false, ticked: [], createEnabled: false, created: false, banner: null, heading: null, groupListed: false, members: null };
    var res = await action.click(cg.createGroupsBtn);
    out.formShown = true == res && true == (await action.waitForDisplayed(cg.groupTitleInput, 30000));
    if (!out.formShown) return out;
    // Angular form: type, never fill() (Invariant 6).
    res = await action.click(cg.groupTitleInput);
    if (true == res) res = await action.addValue(cg.groupTitleInput, name);
    if (true != res) return out;
    for (var i = 0; i < emails.length; i++) {
      var box = cg.studentRowCheckbox.replace(/\{EMAIL\}/g, emails[i]);
      var input = cg.studentRowInput.replace(/\{EMAIL\}/g, emails[i]);
      if (true == (await action.click(box)) && true == (await action.isSelected(input))) out.ticked.push(emails[i]);
    }
    var deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      if (!/\bdisabled\b/.test((await action.getAttribute(cg.createBtn, "class")) || "")) { out.createEnabled = true; break; }
      await browser.pause(200);
    }
    if (!out.createEnabled || true != (await action.click(cg.createBtn))) return out;
    out.created = true == (await action.waitForUrl(/\/view\/classdata/, 60000));
    if (!out.created) return out;
    if (true == (await action.waitForDisplayed(cg.successBanner, 30000))) out.banner = String(await action.getText(cg.successBanner)).replace(/\s+/g, " ").trim();
    // After Create the class returns to its Groups view (verified live); read the heading and the new group's block.
    if (true == (await action.waitForDisplayed(cg.groupsHeading, 15000))) out.heading = String(await action.getText(cg.groupsHeading)).replace(/\s+/g, " ").trim();
    var block = action.getFilteredLocator(cg.groupBlock, name);
    out.groupListed = true == (await action.waitForDisplayed(block, 15000));
    if (out.groupListed) {
      var members = action.getNestedFilteredLocator(cg.groupBlock, name, cg.groupMemberToggle, "");
      out.members = String(await action.getText(members)).replace(/\s+/g, " ").trim();
    }
    return out;
  },
};
