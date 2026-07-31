"use strict";

// [2026-07-28] Page object used for eBook keyboard focus accessibility assertions and navigation.
// Removed direct baseActionLibrary import to comply with Layer 3 -> Layer 1 architecture rules.
var focusPage = require("../../pages/ExperienceApp/ebookFocusA11y.page.js");
var sts;

module.exports = {
  // --- Suite 1: Page 22 (Notes only) ---

  TST_KBOA_TC_1: async function (testdata) {
    // 1. Go to page 22 and wait for Notes icon to be rendered
    sts = await focusPage.goToPage(22);
    await assertion.assertEqual(sts, true, "eBook failed to navigate to page 22");
    sts = await focusPage.waitForNoteOnPage();
    await assertion.assertEqual(sts, true, "Note icon on page 22 was not displayed");
    sts = await focusPage.resetFocusToReader();
    await assertion.assertEqual(sts, true, "Failed to reset focus to reader");
  },

  TST_KBOA_TC_2: async function (testdata) {
    // 2. Press Tab to focus on the Notes element
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnNote("Focus did not land on the Note element on page 22");
    await assertion.assertEqual(sts, true, "Note element focus assertion failed");
  },

  TST_KBOA_TC_3: async function (testdata) {
    // 3. Press Tab to focus on the Home button
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnHome("Focus did not land on the Home button after Note on page 22");
    await assertion.assertEqual(sts, true, "Home button focus assertion failed");
  },

  TST_KBOA_TC_4: async function (testdata) {
    // 4. Press Shift+Tab to move focus back to Notes element
    sts = await focusPage.pressShiftTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Shift+Tab key");
    sts = await focusPage.assertFocusOnNote("Focus did move back to the Note element on page 22");
    await assertion.assertEqual(sts, true, "Note element focus shift assertion failed");
  },

  TST_KBOA_TC_5: async function (testdata) {
    // 5. Keyboard click the Notes element to open notes panel
    await browser.pause(1500);
    sts = await focusPage.pressEnterOnNote(testdata);
    await assertion.assertEqual(sts, true, "Failed to keyboard click Note element");
    sts = await focusPage.assertNotesPanelVisible("Notes panel was not visible after keyboard click");
    await assertion.assertEqual(sts, true, "Notes panel visibility assertion failed");
  },

  TST_KBOA_TC_6: async function (testdata) {
    // 6. Keyboard click the close button on the Notes panel to close it
    await browser.pause(1500);
    sts = await focusPage.pressEnterOnNotesClose(testdata);
    await assertion.assertEqual(sts, true, "Failed to keyboard click Notes close button");
    sts = await focusPage.assertNotesPanelClosed("Notes panel was still visible after click close");
    await assertion.assertEqual(sts, true, "Notes panel closure assertion failed");
  },

  // --- Suite 2: Page 24 (Hotlink only) ---

  TST_KBOA_TC_7: async function (testdata) {
    // 1. Go to page 24 and wait for Hotlink icon to be rendered
    sts = await focusPage.goToPage(24);
    await assertion.assertEqual(sts, true, "eBook failed to navigate to page 24");
    sts = await focusPage.waitForHotlinkOnPage();
    await assertion.assertEqual(sts, true, "Hotlink icon on page 24 was not displayed");
    sts = await focusPage.resetFocusToReader();
    await assertion.assertEqual(sts, true, "Failed to reset focus to reader");
  },

  TST_KBOA_TC_8: async function (testdata) {
    // 2. Press Tab to focus on the Hotlink element
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnHotlink("Focus did not land on the Hotlink element on page 24");
    await assertion.assertEqual(sts, true, "Hotlink element focus assertion failed");
  },

  TST_KBOA_TC_9: async function (testdata) {
    // 3. Press Tab to focus on the Home button
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnHome("Focus did not land on the Home button after Hotlink on page 24");
    await assertion.assertEqual(sts, true, "Home button focus assertion failed");
  },

  TST_KBOA_TC_10: async function (testdata) {
    // 4. Press Shift+Tab to move focus back to Hotlink element
    sts = await focusPage.pressShiftTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Shift+Tab key");
    sts = await focusPage.assertFocusOnHotlink("Focus did not move back to the Hotlink element on page 24");
    await assertion.assertEqual(sts, true, "Hotlink element focus shift assertion failed");
  },

  TST_KBOA_TC_11: async function (testdata) {
    // 5. Keyboard click the Hotlink element to trigger page navigation jump
    await browser.pause(1500);
    sts = await focusPage.pressEnterOnHotlink(testdata);
    await assertion.assertEqual(sts, true, "Failed to keyboard click Hotlink element");
    sts = await focusPage.assertOnPage(28, "eBook did not navigate to page 28 after keyboard click");
    await assertion.assertEqual(sts, true, "Hotlink page jump assertion failed");
  },

  TST_KBOA_TC_12: async function (testdata) {
    // 6. Navigate back to page 24 to leave suite in clean state
    sts = await focusPage.goToPage(24);
    await assertion.assertEqual(sts, true, "Failed to navigate back to page 24");
  },

  // --- Suite 3: Page 26 (Neither Notes nor Hotlink) ---

  TST_KBOA_TC_13: async function (testdata) {
    // 1. Go to page 26
    sts = await focusPage.goToPage(26);
    await assertion.assertEqual(sts, true, "eBook failed to navigate to page 26");
    sts = await focusPage.resetFocusToReader();
    await assertion.assertEqual(sts, true, "Failed to reset focus to reader");
  },

  TST_KBOA_TC_14: async function (testdata) {
    // 2. Press Tab to focus directly on the Home button
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnHome("Focus did not land directly on the Home button on page 26");
    await assertion.assertEqual(sts, true, "Home button focus assertion failed");
  },

  // --- Suite 4: Page 28 (Both Notes and Hotlink) ---

  TST_KBOA_TC_15: async function (testdata) {
    // 1. Go to page 28 and wait for Note and Hotlink icons
    sts = await focusPage.goToPage(28);
    await assertion.assertEqual(sts, true, "eBook failed to navigate to page 28");
    sts = await focusPage.waitForNoteOnPage();
    await assertion.assertEqual(sts, true, "Note icon on page 28 was not displayed");
    sts = await focusPage.waitForHotlinkOnPage();
    await assertion.assertEqual(sts, true, "Hotlink icon on page 28 was not displayed");
    sts = await focusPage.resetFocusToReader();
    await assertion.assertEqual(sts, true, "Failed to reset focus to reader");
  },

  TST_KBOA_TC_16: async function (testdata) {
    // 2. Press Tab to focus on the Note element
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnNote("Focus did not land on the Note element first on page 28");
    await assertion.assertEqual(sts, true, "Note element focus assertion failed");
  },

  TST_KBOA_TC_17: async function (testdata) {
    // 3. Press Tab to focus on the Hotlink element
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnHotlink("Focus did not land on the Hotlink element second on page 28");
    await assertion.assertEqual(sts, true, "Hotlink element focus assertion failed");
  },

  TST_KBOA_TC_18: async function (testdata) {
    // 4. Press Tab to focus on the Home button
    sts = await focusPage.pressTab(testdata);
    await assertion.assertEqual(sts, true, "Failed to press Tab key");
    sts = await focusPage.assertFocusOnHome("Focus did not land on the Home button third on page 28");
    await assertion.assertEqual(sts, true, "Home button focus assertion failed");
  },

  TST_KBOA_TC_19: async function (testdata) {
    // 5. Navigate to page 20 before finishing Suite 4
    sts = await focusPage.goToPage(20);
    await assertion.assertEqual(sts, true, "Failed to navigate to page 20 at the end of Suite 4");
  }
};
