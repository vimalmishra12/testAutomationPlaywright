"use strict";

// [2026-07-27] Dedicated test file for eBook toolbar keyboard focus accessibility testing on Page 26.
var toolbarFocusPage = require("../../pages/ExperienceApp/ebookToolbarFocus.page.js");
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var sts;

module.exports = {
  // --- Suite 1: Page 26 Continuous eBook Toolbar Focus Traversal ---

  TST_EBTF_TC_1: async function (testdata) {
    // 1. Go to page 26 and reset focus to eBook reader container
    sts = await action.goToPage(26);
    await assertion.assertEqual(sts, true, "eBook failed to navigate to page 26");
    sts = await toolbarFocusPage.resetFocusToReader();
    await assertion.assertEqual(sts, true, "Failed to reset focus to reader on page 26");
  },

  TST_EBTF_TC_2: async function (testdata) {
    // 2. Press Tab to focus on Home button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key for Home button");
    sts = await toolbarFocusPage.assertFocusOn("homeButton", "Focus did not land on Home button on page 26");
    await assertion.assertEqual(sts, true, "Home button focus assertion failed on page 26");
  },

  TST_EBTF_TC_3: async function (testdata) {
    // 3. Press Tab to focus on Content button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key for Content button");
    sts = await toolbarFocusPage.assertFocusOn("contentButton", "Focus did not land on Content button on page 26");
    await assertion.assertEqual(sts, true, "Content button focus assertion failed on page 26");
  },

  TST_EBTF_TC_4: async function (testdata) {
    // 4. Press Tab to focus on Tools button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key for Tools button");
    sts = await toolbarFocusPage.assertFocusOn("toolsButton", "Focus did not land on Tools button on page 26");
    await assertion.assertEqual(sts, true, "Tools button focus assertion failed on page 26");
  },

  TST_EBTF_TC_5: async function (testdata) {
    // 5. Press Tab to focus on Zoom Out button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key for Zoom Out button");
    sts = await toolbarFocusPage.assertFocusOn("zoomOutBtn", "Focus did not land on Zoom Out button on page 26");
    await assertion.assertEqual(sts, true, "Zoom Out button focus assertion failed on page 26");
  },

  TST_EBTF_TC_6: async function (testdata) {
    // 6. Press Tab to focus on Zoom In button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key for Zoom In button");
    sts = await toolbarFocusPage.assertFocusOn("zoomInBtn", "Focus did not land on Zoom In button on page 26");
    await assertion.assertEqual(sts, true, "Zoom In button focus assertion failed on page 26");
  },

  TST_EBTF_TC_7: async function (testdata) {
    // 7. Press Tab to focus on Fit To Height button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key for Fit To Height button");
    sts = await toolbarFocusPage.assertFocusOn("fitToHeightBtn", "Focus did not land on Fit To Height button on page 26");
    await assertion.assertEqual(sts, true, "Fit To Height button focus assertion failed on page 26");
  },

  TST_EBTF_TC_8: async function (testdata) {
    // 8. Press Tab to move focus forward to Jump to Page button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to Jump to Page button");
    sts = await toolbarFocusPage.assertFocusOn("pageNumber", "Focus did not land on Jump to Page button on page 26");
    await assertion.assertEqual(sts, true, "Jump to Page button focus assertion failed on page 26");
  },

  TST_EBTF_TC_9: async function (testdata) {
    // 9. Close page number popover and press Tab to move focus to Previous button
    await global.page.evaluate(() => {
      const popovers = document.querySelectorAll(".page-number-dropdown, .popover, .dropdown-menu");
      popovers.forEach(el => el.classList.remove("show"));
    });
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to Previous button");
    sts = await toolbarFocusPage.assertFocusOn("previousPage", "Focus did not land on Previous button on page 26");
    await assertion.assertEqual(sts, true, "Previous button focus assertion failed on page 26");
  },

  TST_EBTF_TC_10: async function (testdata) {
    // 10. Press Tab to move focus forward to TOC button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to TOC button");
    sts = await toolbarFocusPage.assertFocusOn("pageNavigateButton", "Focus did not land on TOC button on page 26");
    await assertion.assertEqual(sts, true, "TOC button focus assertion failed on page 26");
  },

  TST_EBTF_TC_11: async function (testdata) {
    // 11. Press Tab to move focus forward to Next button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to Next button");
    sts = await toolbarFocusPage.assertFocusOn("nextPage", "Focus did not land on Next button on page 26");
    await assertion.assertEqual(sts, true, "Next button focus assertion failed on page 26");
  },

  TST_EBTF_TC_12: async function (testdata) {
    // 12. Press Tab to move focus forward to Single Page View button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to Single Page View button");
    sts = await toolbarFocusPage.assertFocusOn("toggleLayoutBtn", "Focus did not land on Single Page View button on page 26");
    await assertion.assertEqual(sts, true, "Single Page View button focus assertion failed on page 26");
  },

  TST_EBTF_TC_13: async function (testdata) {
    // 13. Press Tab to move focus forward to Change Course Material button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to Change Course Material button");
    sts = await toolbarFocusPage.assertFocusOn("changeCourseMaterialBtn", "Focus did not land on Change Course Material button on page 26");
    await assertion.assertEqual(sts, true, "Change Course Material button focus assertion failed on page 26");
  },

  TST_EBTF_TC_14: async function (testdata) {
    // 14. Press Tab to move focus forward to Move Toolbar button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to Move Toolbar button");
    sts = await toolbarFocusPage.assertFocusOn("moveToolbarBtn", "Focus did not land on Move Toolbar button on page 26");
    await assertion.assertEqual(sts, true, "Move Toolbar button focus assertion failed on page 26");
  },

  TST_EBTF_TC_15: async function (testdata) {
    // 15. Press Tab to move focus forward to Toolbar Status Container button
    sts = await toolbarFocusPage.pressTab();
    await assertion.assertEqual(sts, true, "Failed to press Tab key forward to Toolbar Status Container button");
    sts = await toolbarFocusPage.assertFocusOn("toolbarStatusBtn", "Focus did not land on Toolbar Status Container button on page 26");
    await assertion.assertEqual(sts, true, "Toolbar Status Container button focus assertion failed on page 26");
  },

  TST_EBTF_TC_16: async function (testdata) {
    // 16. Navigate back to page 20 before completing suite
    // await global.page.evaluate(() => {
    //   if (document.activeElement) document.activeElement.blur();
    //   const popovers = document.querySelectorAll(".dropdown-menu.show, .popover.show, .page-number-dropdown.show");
    //   popovers.forEach(el => el.classList.remove("show"));
    // });
    await toolbarFocusPage.resetFocusToReader();
    await global.page.waitForTimeout(500);
    sts = await action.goToPage(20);
    await assertion.assertEqual(sts, true, "Failed to navigate back to page 20 at end of toolbar focus suite");
  }
};
