"use strict";
var components = require("../../pages/Builder/components.page.js");
var ebooks     = require("../../pages/Builder/ebooks.page.js");
var families   = require("../../pages/Builder/families.page.js");
var sts;

// Unique suffix generated once per run so every clone code is collision-free across reruns.
var RUN_ID = (function () { return Date.now().toString().slice(-6); }());
function dynCode(base) { return base + "_" + RUN_ID; }

// Helper: attempt clone; if OK is disabled (real-time validation failed), cancel and return.
async function cloneOrSkipIfExists(page, testdata) {
  sts = await page.isSubmitEnabled();
  if (!sts.enabled) {
    await page.cancelClone();
    return;
  }
  sts = await page.submitClone();
  await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
  sts = await page.waitForCloneSuccess();
  await assertion.assertEqual(sts.cloneStatus, true, "Clone modal did not close after success.");
}

module.exports = {

  // Login TCs (TST_BLOGI_TC_1 / TST_BLOGI_TC_2) live in ./login.test.js — the execution
  // file's login steps reference that file directly (ADR-011: reuse, don't redefine).

  // ── BeforeEach reset ──────────────────────────────────────────────────────
  // Dismiss any modal a previous test may have left open, so one failed test does not
  // cascade into the next. Best-effort and safe before login (no dialog open yet).
  TST_NEMO24401_RESET: async function (testdata) {
    await components.dismissAnyModal();
  },

  // ── NEMO-24401 Clone Component ───────────────────────────────────────────

  // TC_1: Clone with a simple lowercase code — verify clone appears in listing.
  TST_NEMO24401_TC_1: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open for " + testdata.sourceCode);
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await cloneOrSkipIfExists(components, testdata);
    sts = await components.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned component '" + testdata.cloneCode + "' not found in listing.");
  },

  // TC_2: Clone with a code containing numbers.
  TST_NEMO24401_TC_2: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await cloneOrSkipIfExists(components, testdata);
    sts = await components.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned component '" + testdata.cloneCode + "' not found in listing.");
  },

  // TC_3: Clone with a mixed alphanumeric code containing underscores.
  TST_NEMO24401_TC_3: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await cloneOrSkipIfExists(components, testdata);
    sts = await components.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned component '" + testdata.cloneCode + "' not found in listing.");
  },

  // TC_4: Duplicate code → click OK → inline error shown → cancel → re-open → valid code → success.
  TST_NEMO24401_TC_4: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.errorCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill error code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK with duplicate code.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible after submitting duplicate code.");
    await components.cancelClone();
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not re-open for retry.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill valid code on retry.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title on retry.");
    await cloneOrSkipIfExists(components, testdata);
    sts = await components.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned component '" + testdata.cloneCode + "' not found after close-and-retry flow.");
  },

  // TC_5: Ingested component code → server rejects with inline error → close modal → re-open → valid code → success.
  // Builder does NOT disable OK for ingested codes (server-side validation only).
  TST_NEMO24401_TC_5: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.errorCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill ingested code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK with ingested code.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible after submitting ingested-component code.");
    await components.cancelClone();
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not re-open for retry.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill valid code on retry.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title on retry.");
    await cloneOrSkipIfExists(components, testdata);
    sts = await components.isInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned component '" + testdata.cloneCode + "' not found after close-and-retry flow.");
  },

  // TC_6: Clone → verify in listing → delete → verify removed.
  TST_NEMO24401_TC_6: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await cloneOrSkipIfExists(components, testdata);
    // Ensure the clone has fully materialised (refresh every 10s) before deleting it.
    sts = await components.waitForInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "Cloned component not found before deletion.");
    sts = await components.openDeleteModal(testdata.cloneCode);
    await assertion.assertEqual(sts.modalStatus, true, "Delete modal did not open.");
    sts = await components.fillDeleteComment(testdata.deleteComment);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill delete comment.");
    sts = await components.confirmDelete();
    await assertion.assertEqual(sts.deleteStatus, true, "Delete confirmation did not complete.");
    sts = await components.isInListing(testdata.cloneCode, null, true);
    await assertion.assertEqual(sts.found, false, "Deleted component still appears in listing.");
  },

  // TC_7: Clone → delete → clone again with the same code → success.
  TST_NEMO24401_TC_7: async function (testdata) {
    testdata.cloneCode  = dynCode(testdata.cloneCode);
    testdata.cloneTitle = testdata.cloneCode;
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open (first clone).");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await cloneOrSkipIfExists(components, testdata);
    // Ensure the first clone has fully materialised (refresh every 10s) before deleting it.
    sts = await components.waitForInListing(testdata.cloneCode);
    await assertion.assertEqual(sts.found, true, "First clone not found before deletion.");
    sts = await components.openDeleteModal(testdata.cloneCode);
    await assertion.assertEqual(sts.modalStatus, true, "Delete modal did not open.");
    sts = await components.fillDeleteComment(testdata.deleteComment);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill delete comment.");
    sts = await components.confirmDelete();
    await assertion.assertEqual(sts.deleteStatus, true, "Delete did not complete.");
    // Poll until the deleted component is gone from the listing (backend deletion is async).
    sts = await components.isInListing(testdata.cloneCode, null, true);
    await assertion.assertEqual(sts.found, false, "Deleted component still in listing after polling — code not freed.");
    // Builder is a collaborative authoring app with heavy backend syncing: a code disappears from
    // the listing well BEFORE it is actually freed for re-use, and that lag is variable. So retry the
    // whole re-clone until it lands, instead of betting on any single fixed wait being long enough.
    var recloned = false;
    for (var attempt = 1; attempt <= 5 && !recloned; attempt++) {
      sts = await components.navigateTo();
      await assertion.assertEqual(sts.pageStatus, true, "Components page did not reload before second clone (attempt " + attempt + ").");
      sts = await components.openCloneModal(testdata.sourceCode);
      await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open (second clone, attempt " + attempt + ").");
      sts = await components.fillCloneCode(testdata.cloneCode);
      await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code for second clone.");
      sts = await components.fillCloneTitle(testdata.cloneTitle);
      await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title for second clone.");
      sts = await components.submitClone();
      await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK (second clone).");
      // The code may not be freed yet (async delete), so the re-clone can fail with an inline
      // error. waitForCloneSuccess now reports that, but we confirm via the listing either way.
      await components.waitForCloneSuccess();
      sts = await components.isInListing(testdata.cloneCode);
      recloned = sts.found === true;
      // Code not yet freed by the async delete — wait for the sync to catch up, then re-attempt.
      if (!recloned) await browser.pause(30000);
    }
    await assertion.assertEqual(recloned, true, "Re-cloned component not found after delete-and-reclone (code never freed within retry window).");
  },

  // TC_8: Clone an eBook → delete it → clone a Component with the freed code.
  // Pre-cleanup: delete any stale component with crossCode left by a previous TC_8 run.
  TST_NEMO24401_TC_8: async function (testdata) {
    testdata.crossCode  = dynCode(testdata.crossCode);
    testdata.crossTitle = testdata.crossCode;
    sts = await components.isInListing(testdata.crossCode);
    if (sts.found) {
      sts = await components.openDeleteModal(testdata.crossCode);
      if (sts.modalStatus === true) {
        await components.fillDeleteComment("TC_8 pre-cleanup");
        await components.confirmDelete();
      }
    }
    sts = await ebooks.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks page did not load.");
    sts = await ebooks.openCloneModal(testdata.ebookSourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open for eBook.");
    sts = await ebooks.fillCloneCode(testdata.crossCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill cross-entity code in eBook modal.");
    sts = await ebooks.fillCloneTitle(testdata.crossTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill title in eBook modal.");
    sts = await ebooks.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to submit eBook clone.");
    sts = await ebooks.waitForCloneSuccess();
    await assertion.assertEqual(sts.cloneStatus, true, "eBook clone did not succeed.");
    // Ensure the eBook clone has fully materialised (refresh every 10s) before deleting it.
    sts = await ebooks.waitForInListing(testdata.crossCode);
    await assertion.assertEqual(sts.found, true, "eBook clone not found before deletion.");
    sts = await ebooks.openDeleteModal(testdata.crossCode);
    await assertion.assertEqual(sts.modalStatus, true, "Delete modal did not open for eBook.");
    sts = await ebooks.fillDeleteComment(testdata.deleteComment);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill delete comment for eBook.");
    sts = await ebooks.confirmDelete();
    await assertion.assertEqual(sts.deleteStatus, true, "eBook deletion did not complete.");
    // Wait for the eBook to actually disappear (refresh-poll) — the code is not freed for the
    // cross-entity clone until the deletion finishes propagating ("Deleting" → removed).
    sts = await ebooks.isInListing(testdata.crossCode, null, true);
    await assertion.assertEqual(sts.found, false, "Deleted eBook still in listing — cross-entity code not freed.");
    // Code-free lags listing-removal, so retry the Component clone until the freed code lands.
    var recloned = false;
    for (var attempt = 1; attempt <= 5 && !recloned; attempt++) {
      sts = await components.navigateTo();
      await assertion.assertEqual(sts.pageStatus, true, "Components page did not load after eBook deletion (attempt " + attempt + ").");
      sts = await components.openCloneModal(testdata.componentSourceCode);
      await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open for Component (attempt " + attempt + ").");
      sts = await components.fillCloneCode(testdata.crossCode);
      await assertion.assertEqual(sts.fillStatus, true, "Failed to fill freed code in Component modal.");
      sts = await components.fillCloneTitle(testdata.crossTitle);
      await assertion.assertEqual(sts.fillStatus, true, "Failed to fill title in Component modal.");
      sts = await components.submitClone();
      await assertion.assertEqual(sts.submitStatus, true, "Failed to submit Component clone with freed code.");
      await components.waitForCloneSuccess();
      sts = await components.isInListing(testdata.crossCode);
      recloned = sts.found === true;
      if (!recloned) await browser.pause(30000);
    }
    await assertion.assertEqual(recloned, true, "Component with cross-entity freed code not found (code never freed within retry window).");
  },

  // TC_9: Whitespace-only code → OK disabled by frontend validation (not a valid code format).
  TST_NEMO24401_TC_9: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill whitespace code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await components.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled for whitespace-only code.");
    await components.cancelClone();
  },

  // TC_10: Duplicate code → click OK → inline error shown (not a browser native alert).
  TST_NEMO24401_TC_10: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill duplicate code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible — error may have appeared as a browser alert instead.");
    sts = await components.getCloneError();
    await assertion.assertNotEqual(sts.errorText, "", "Error message text is empty.");
    await components.cancelClone();
  },

  // TC_11: Source component's own code is a duplicate → click OK → inline error shown.
  TST_NEMO24401_TC_11: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for duplicate own code.");
    await components.cancelClone();
  },

  // TC_12: Code belonging to an Umbrella product → inline error.
  TST_NEMO24401_TC_12: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill Umbrella code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for Umbrella code conflict.");
    await components.cancelClone();
  },

  // TC_13: Code belonging to an eBook → inline error.
  TST_NEMO24401_TC_13: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill eBook code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for eBook code conflict.");
    await components.cancelClone();
  },

  // TC_14: Empty code field → OK button remains disabled (required-field validation).
  TST_NEMO24401_TC_14: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to handle empty code field.");
    sts = await components.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled when code field is empty.");
    await components.cancelClone();
  },

  // TC_15: Uppercase characters in code → inline error (codes must be lowercase).
  TST_NEMO24401_TC_15: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill uppercase code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await components.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled for uppercase code.");
    await components.cancelClone();
  },

  // TC_16: Special characters in code → OK disabled by frontend validation.
  TST_NEMO24401_TC_16: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill special-chars code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await components.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled for special-characters code.");
    await components.cancelClone();
  },

  // TC_21: Code starting with a digit → Builder disables OK (client-side validation, same pattern as TC_9 whitespace).
  TST_NEMO24401_TC_21: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill code starting with digit.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await browser.pause(1000);
    sts = await components.isSubmitEnabled();
    await assertion.assertEqual(sts.enabled, false, "OK button should be disabled for digit-first code.");
    await components.cancelClone();
  },

  // TC_17: Ingested component — Delete option IS present in kebab menu.
  // Note: the ingested-code restriction applies to clone targets (server rejects), not to deletion.
  TST_NEMO24401_TC_17: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.hasDeleteOption(testdata.ingestedCode);
    await assertion.assertEqual(sts.hasDelete, true, "Delete option should appear for an ingested component (deletion is allowed; only cloning to its code is blocked).");
  },

  // TC_18: Code of an ingested component → inline error on clone attempt.
  TST_NEMO24401_TC_18: async function (testdata) {
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill ingested component code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible for ingested component code.");
    await components.cancelClone();
  },

  // TC_19: Create a Family with a code → clone Component with same code → error.
  // Pre-cleanup: delete any stale component or family with the same code from previous runs.
  TST_NEMO24401_TC_19: async function (testdata) {
    testdata.familyCode  = dynCode(testdata.familyCode);
    testdata.familyTitle = testdata.familyCode;
    testdata.cloneCode   = dynCode(testdata.cloneCode);
    testdata.cloneTitle  = testdata.cloneCode;
    sts = await components.isInListing(testdata.cloneCode);
    if (sts.found) {
      sts = await components.openDeleteModal(testdata.cloneCode);
      if (sts.modalStatus === true) {
        await components.fillDeleteComment("TC_19 pre-cleanup");
        await components.confirmDelete();
      }
    }
    // Soft-delete stale family (safe to call even if family doesn't exist)
    await families.navigateTo();
    await families.deleteFamily(testdata.familyCode, testdata.familyTitle);
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Families create page did not load.");
    sts = await families.fillFamilyCode(testdata.familyCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill family code.");
    sts = await families.fillFamilyTitle(testdata.familyTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill family title.");
    sts = await families.saveFamily(testdata.familyCode, testdata.familyTitle);
    await assertion.assertEqual(sts.saveStatus, true, "Family was not saved.");
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load after family creation.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill family code in clone modal.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    sts = await components.submitClone();
    await assertion.assertEqual(sts.submitStatus, true, "Failed to click OK.");
    sts = await components.isErrorVisible();
    await assertion.assertEqual(sts.errorVisible, true, "Inline error not visible — family code should block component clone.");
    await components.cancelClone();
  },

  // CLEANUP: Delete all components created during this suite (safe to call even if a code was never cloned).
  TST_NEMO24401_CLEANUP: async function (testdata) {
    for (var i = 0; i < testdata.codes.length; i++) {
      var code = dynCode(testdata.codes[i]);
      sts = await components.navigateTo();
      if (sts.pageStatus !== true) continue;
      sts = await components.isInListing(code);
      if (!sts.found) continue;
      sts = await components.openDeleteModal(code);
      if (sts.modalStatus !== true) continue;
      await components.fillDeleteComment(testdata.deleteComment);
      await components.confirmDelete();
    }
  },

  // TC_20: Delete the Family from TC_19 → clone Component with freed code → success.
  TST_NEMO24401_TC_20: async function (testdata) {
    testdata.familyCode  = dynCode(testdata.familyCode);
    testdata.familyTitle = testdata.familyCode;
    testdata.cloneCode   = dynCode(testdata.cloneCode);
    testdata.cloneTitle  = testdata.cloneCode;
    sts = await families.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Families page did not load.");
    sts = await families.deleteFamily(testdata.familyCode, testdata.familyTitle);
    await assertion.assertEqual(sts.deleteStatus, true, "Failed to delete the family.");
    sts = await components.navigateTo();
    await assertion.assertEqual(sts.pageStatus, true, "Components page did not load after family deletion.");
    sts = await components.openCloneModal(testdata.sourceCode);
    await assertion.assertEqual(sts.modalStatus, true, "Clone modal did not open.");
    sts = await components.fillCloneCode(testdata.cloneCode);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill freed family code.");
    sts = await components.fillCloneTitle(testdata.cloneTitle);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill clone title.");
    await cloneOrSkipIfExists(components, testdata);
    sts = await components.isInListing(testdata.cloneCode, testdata.cloneTitle);
    await assertion.assertEqual(sts.found, true, "Component with freed family code not found in listing.");
  }
};
