"use strict";
var login      = require("../../pages/Builder/login.page.js");
var ebooks     = require("../../pages/Builder/ebooks.page.js");
var components = require("../../pages/Builder/components.page.js");
var families   = require("../../pages/Builder/families.page.js");
var sts;

// Unique suffix generated once per run so every clone code is collision-free across reruns.
var RUN_ID = (function () { return Date.now().toString().slice(-6); }());
function dynCode(base) { return base + "_" + RUN_ID; }

module.exports = {

  // ── Login ────────────────────────────────────────────────────────────────
  TST_BLOGI_TC_1: async function (testdata) {
    sts = await login.isInitialized();
    await assertion.assertEqual(sts.pageStatus, true, "Builder pre-login page is not launched.");
  },

  TST_BLOGI_TC_2: async function (testdata) {
    sts = await login.login(testdata);
    await assertion.assertEqual(sts.pageStatus, true, "Builder landing did not load after login.");
  },

  // ── NEMO-24402 Clone eBook ────────────────────────────────────────────────

  // TC_1: Clone with a simple lowercase code — verify clone appears in listing.
  TST_NEMO24402_TC_1: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open for " + testdata.sourceCode);
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Clone modal did not close after success.");
    sts = await ebooks.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned eBook '" + testdata.cloneCode + "' not found in listing.");
  },

  // TC_2: Clone with a code containing numbers.
  TST_NEMO24402_TC_2: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Clone modal did not close after success.");
    sts = await ebooks.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned eBook '" + testdata.cloneCode + "' not found in listing.");
  },

  // TC_3: Clone with a mixed alphanumeric code containing underscores.
  TST_NEMO24402_TC_3: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Clone modal did not close after success.");
    sts = await ebooks.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned eBook '" + testdata.cloneCode + "' not found in listing.");
  },

  // TC_4: Duplicate code → click OK → inline error shown → cancel → re-open → valid code → success.
  TST_NEMO24402_TC_4: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.errorCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill error code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK with duplicate code.");
    sts = await ebooks.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible after submitting duplicate code.");
    await ebooks.cancelClone();
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not re-open for retry.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill valid code on retry.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title on retry.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK with valid code on retry.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Clone did not succeed after re-opening modal with valid code.");
    sts = await ebooks.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned eBook '" + testdata.cloneCode + "' not found after close-and-retry flow.");
  },

  // TC_5: Clone eBook → verify Author Name and Creation Time not empty in listing card.
  TST_NEMO24402_TC_5: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Clone modal did not close after success.");
    sts = await ebooks.getCardMeta(testdata.cloneCode);
    await assertion.assertNotEqual(sts.metaText, "", "Author Name and/or Creation Time are empty for the cloned eBook card.");
  },

  // TC_6: Clone → verify in listing → delete → verify removed.
  TST_NEMO24402_TC_6: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Clone modal did not close after success.");
    sts = await ebooks.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned eBook not found before deletion.");
    sts = await ebooks.openDeleteModal(testdata.cloneCode);
    await assertion.assertEqual(sts.modalStatus, true, "Delete modal did not open.");
    sts = await ebooks.fillDeleteComment(testdata.deleteComment);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill delete comment.");
    sts = await ebooks.confirmDelete();
    await assertion.assertEqual(sts.deleteStatus, true, "Delete confirmation did not complete.");
    sts = await ebooks.isInListing(testdata.cloneCode, null, true);
    await assertion.assertEqual(sts.found, false, "Deleted eBook still appears in listing.");
  },

  // TC_7: Clone → delete → clone again with same code → success.
  TST_NEMO24402_TC_7: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open (first clone).");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK (first clone).");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "First clone did not succeed.");
    sts = await ebooks.openDeleteModal(testdata.cloneCode);
    await assertion.assertEqual(sts.modalStatus, true, "Delete modal did not open.");
    sts = await ebooks.fillDeleteComment(testdata.deleteComment);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill delete comment.");
    sts = await ebooks.confirmDelete();
    await assertion.assertEqual(sts.deleteStatus, true, "Delete did not complete.");
    // eBook deletion is async on the backend — wait for the code to be fully freed before re-cloning.
    await browser.pause(20000);
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open (second clone).");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code for second clone.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title for second clone.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK (second clone).");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Second clone did not succeed after code was freed by deletion.");
    sts = await ebooks.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Re-cloned eBook not found after delete-and-reclone.");
  },

  // TC_8: Clone a Component → delete it → clone an eBook with the freed code.
  TST_NEMO24402_TC_8: async function (testdata) {
    testdata.crossCode  = dynCode(testdata.crossCode);
    testdata.crossTitle = testdata.crossCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.componentSourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open for Component.");
    sts = await components.fillCloneCode(testdata.crossCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill cross-entity code in Component modal.");
    sts = await components.fillCloneTitle(testdata.crossTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill title in Component modal.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to submit Component clone.");
    sts = await components.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Component clone did not succeed.");
    sts = await components.openDeleteModal(testdata.crossCode);
    await assertion.assertEqual(sts.modalStatus, true, "Delete modal did not open for Component.");
    sts = await components.fillDeleteComment(testdata.deleteComment);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill delete comment for Component.");
    sts = await components.confirmDelete();
    await assertion.assertEqual(sts.deleteStatus, true, "Component deletion did not complete.");
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load after Component deletion.");
    sts = await ebooks.openCloneModal(testdata.ebookSourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open for eBook.");
    sts = await ebooks.fillCloneCode(testdata.crossCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill freed code in eBook modal.");
    sts = await ebooks.fillCloneTitle(testdata.crossTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill title in eBook modal.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to submit eBook clone with freed code.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "eBook clone with freed Component code did not succeed.");
    sts = await ebooks.isInListing(testdata.crossCode);
    await assertion.assertEqual(sts.found, true, "eBook with cross-entity freed code not found in listing.");
  },

  // TC_9: Whitespace-only code → OK disabled by frontend validation.
  TST_NEMO24402_TC_9: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill whitespace code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await ebooks.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled for whitespace-only code.");
    await ebooks.cancelClone();
  },

  // TC_10: Duplicate code → click OK → inline error shown (not a browser native alert).
  TST_NEMO24402_TC_10: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill duplicate code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible — error may have appeared as a browser alert instead.");
    sts = await ebooks.getCloneError();
    await assertion.assertNotEqual(sts.errorText, "", "Error message text is empty.");
    await ebooks.cancelClone();
  },

  // TC_11: Source eBook's own code is a duplicate → click OK → inline error shown.
  TST_NEMO24402_TC_11: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for duplicate own code.");
    await ebooks.cancelClone();
  },

  // TC_12: Code belonging to a non-ingested Component → inline error.
  TST_NEMO24402_TC_12: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill Component code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for Component code conflict.");
    await ebooks.cancelClone();
  },

  // TC_13: Code belonging to an Umbrella product → inline error.
  TST_NEMO24402_TC_13: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill Umbrella code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for Umbrella code conflict.");
    await ebooks.cancelClone();
  },

  // TC_14: Empty code field → OK button remains disabled (required-field validation).
  TST_NEMO24402_TC_14: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to handle empty code field.");
    sts = await ebooks.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled when code field is empty.");
    await ebooks.cancelClone();
  },

  // TC_15: Uppercase characters in code → OK disabled by frontend validation.
  TST_NEMO24402_TC_15: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill uppercase code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await ebooks.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled for uppercase code.");
    await ebooks.cancelClone();
  },

  // TC_16: Special characters in code → OK disabled by frontend validation.
  TST_NEMO24402_TC_16: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill special-chars code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await ebooks.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled for special-characters code.");
    await ebooks.cancelClone();
  },

  // TC_21: Code starting with a digit → OK disabled by frontend validation (first char must be a lowercase letter).
  TST_NEMO24402_TC_21: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill code starting with digit.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await ebooks.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled when unique code starts with a digit (first character must be a lowercase letter).");
    await ebooks.cancelClone();
  },

  // TC_17: Ingested eBook → Delete option IS present in kebab menu (deletion is allowed; only cloning to its code is blocked).
  TST_NEMO24402_TC_17: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.hasDeleteOption(testdata.ingestedCode);
    await assertion.assertEqual(sts.hasDelete, true, "Delete option should appear for an ingested eBook (deletion is allowed; only cloning to its code is blocked).");
  },

  // TC_18: Code of an ingested eBook → inline error on clone attempt.
  TST_NEMO24402_TC_18: async function (testdata) {
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill ingested eBook code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for ingested eBook code.");
    await ebooks.cancelClone();
  },

  // TC_19: Create a Family with a code → clone eBook with same code → error.
  TST_NEMO24402_TC_19: async function (testdata) {
    testdata.familyCode  = dynCode(testdata.familyCode);
    testdata.familyTitle = testdata.familyCode;
    testdata.cloneCode   = dynCode(testdata.cloneCode);
    testdata.cloneTitle  = testdata.cloneCode;
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Families create page did not load.");
    sts = await families.fillFamilyCode(testdata.familyCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill family code.");
    sts = await families.fillFamilyTitle(testdata.familyTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill family title.");
    sts = await families.saveFamily();
    await assertion.assertEqual(sts.saveStatus, true, "Family was not saved.");
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load after family creation.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill family code in clone modal.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible — family code should block eBook clone.");
    await ebooks.cancelClone();
  },

  // CLEANUP: Delete all eBooks created during this suite (safe to call even if a code was never cloned).
  TST_NEMO24402_CLEANUP: async function (testdata) {
    for (var i = 0; i < testdata.codes.length; i++) {
      var code = dynCode(testdata.codes[i]);
      sts = await ebooks.navigateTo();
      if (sts.pageStatus !== true) continue;
      sts = await ebooks.isInListing(code);
      if (!sts.found) continue;
      sts = await ebooks.openDeleteModal(code);
      if (sts.modalStatus !== true) continue;
      await ebooks.fillDeleteComment(testdata.deleteComment);
      await ebooks.confirmDelete();
    }
  },

  // TC_20: Delete the Family from TC_19 → clone eBook with freed code → success.
  TST_NEMO24402_TC_20: async function (testdata) {
    testdata.familyCode = dynCode(testdata.familyCode);
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await families.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Families page did not load.");
    sts = await families.deleteFamily(testdata.familyCode);
    await assertion.assertEqual(sts.deleteStatus, true, "Failed to delete the family.");
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load after family deletion.");
    sts = await ebooks.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await ebooks.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill freed family code.");
    sts = await ebooks.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "Clone did not succeed with freed family code.");
    sts = await ebooks.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "eBook with freed family code not found in listing.");
  }
};
