"use strict";
var umbrella = require("../../pages/Builder/umbrella.page.js");
var sts;

// One run-unique suffix so the saved Umbrella's code/title never collide across re-runs; shared by
// TC_1 (create+verify) and TC_2 (cleanup) so both act on the SAME umbrella.
var RUN_ID = (function () { return Date.now().toString().slice(-6); }());

/**
 * Builder — Umbrella Products IMAGE SELECTION / persistence (module BUMB).
 *
 * Umbrella is a separate entity from Family; this suite mirrors the family save→edit verification.
 * NOTE: the Umbrella LISTING does not render a cover thumbnail (Family's does), so persistence is
 * verified in edit mode (Setup tab) only. Login TCs live in ./login.test.js (referenced by the exec).
 */
module.exports = {

  // ── TST_BUMB_TC_1 — create & save an Umbrella with a cover image, verify it PERSISTED ──
  TST_BUMB_TC_1: async function (testdata) {
    // Builder search is TITLE-based (you cannot search by code), so use the SAME value for code and
    // title — then searching that value effectively finds the umbrella "by code".
    var code = testdata.codeBase + RUN_ID;
    var title = code;
    sts = await umbrella.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Umbrella form did not open.");
    sts = await umbrella.selectType(testdata.type);
    await assertion.assertEqual(sts.selectStatus, true, "Umbrella Type could not be selected.");
    sts = await umbrella.fillCode(code);
    await assertion.assertEqual(sts.fillStatus, true, "Unique Code was not filled.");
    sts = await umbrella.fillTitle(title);
    await assertion.assertEqual(sts.fillStatus, true, "Title was not filled.");
    sts = await umbrella.uploadImageFromUrl(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "Cover image did not preview before save.");
    sts = await umbrella.save();
    await assertion.assertEqual(sts.saveStatus, true, "Umbrella did not save.");
    // Persisted in EDIT MODE: reopen the umbrella → Setup tab → the saved cover must be shown.
    sts = await umbrella.openDetailSetup(code);
    await assertion.assertEqual(sts.pageStatus, true, "Saved cover image not shown on the umbrella's edit (Setup) page.");
    await assertion.assertEqual(sts.src.indexOf(testdata.imageUrl) !== -1, true,
      "Edit-mode cover src ('" + sts.src + "') does not match the saved image URL.");
  },

  // ── TST_BUMB_TC_2 — cleanup: delete the umbrella created by TC_1 ───────────────────────
  TST_BUMB_TC_2: async function (testdata) {
    var title = testdata.codeBase + RUN_ID;
    sts = await umbrella.deleteUmbrella(title);
    await assertion.assertEqual(sts.deleteStatus, true, "Cleanup: umbrella could not be deleted.");
    sts = await umbrella.isInListing(title);
    await assertion.assertEqual(sts.found, false, "Cleanup: umbrella still present after delete.");
  },

  // ══ EDIT MODE — repeat the 5 image-selection cases on the umbrella's Setup (edit) page ═══
  // TC_3 creates a cover-less umbrella fixture (Setup opens in upload state); TC_4..8 re-run the 5
  // create-form cases on the Setup page (each opens it fresh); TC_9 deletes the fixture.

  // ── TST_BUMB_TC_3 — fixture: create a cover-less umbrella for the edit-mode cases ──────
  TST_BUMB_TC_3: async function (testdata) {
    var code = testdata.codeBase + RUN_ID;
    sts = await umbrella.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Umbrella form did not open.");
    sts = await umbrella.selectType(testdata.type);
    await assertion.assertEqual(sts.selectStatus, true, "Umbrella Type could not be selected.");
    sts = await umbrella.fillCode(code);
    await assertion.assertEqual(sts.fillStatus, true, "Unique Code was not filled.");
    sts = await umbrella.fillTitle(code);
    await assertion.assertEqual(sts.fillStatus, true, "Title was not filled.");
    sts = await umbrella.save();
    await assertion.assertEqual(sts.saveStatus, true, "Fixture umbrella did not save.");
  },

  // ── TST_BUMB_TC_4 [EDIT] (TC-CF-016) — local file upload on the Setup page ─────────────
  TST_BUMB_TC_4: async function (testdata) {
    sts = await umbrella.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Umbrella Setup (edit) image control not ready.");
    sts = await umbrella.uploadImageFromFile(testdata.localImage);
    await assertion.assertEqual(sts.previewStatus, true, "[edit] Preview did not render for the local image.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "[edit] Valid local image fell back to placeholder.");
  },

  // ── TST_BUMB_TC_5 [EDIT] (TC-CF-017) — external URL upload on the Setup page ───────────
  TST_BUMB_TC_5: async function (testdata) {
    sts = await umbrella.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Umbrella Setup (edit) image control not ready.");
    sts = await umbrella.uploadImageFromUrl(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "[edit] Preview did not render for the external URL.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "[edit] Valid external URL fell back to placeholder.");
  },

  // ── TST_BUMB_TC_6 [EDIT] (TC-CF-018) — no auto-preview while typing; Enter confirms ────
  TST_BUMB_TC_6: async function (testdata) {
    sts = await umbrella.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Umbrella Setup (edit) image control not ready.");
    sts = await umbrella.typeImageUrlWithoutConfirm(testdata.imageUrl);
    await assertion.assertEqual(sts.previewShown, false, "[edit] Preview auto-loaded while typing — must require confirmation.");
    sts = await umbrella.confirmTypedImageUrl();
    await assertion.assertEqual(sts.previewStatus, true, "[edit] Preview did not load after explicit confirm (Enter).");
  },

  // ── TST_BUMB_TC_7 [EDIT] (TC-CF-019 / CF-IMG-004) — broken external URL ────────────────
  // REPORTED ISSUE (to be fixed next iteration): a broken URL must show a CLEAR inline error; the app
  // instead shows a placeholder icon with no error. KNOWN-FAILING defect guard (matches family TC_14).
  TST_BUMB_TC_7: async function (testdata) {
    sts = await umbrella.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Umbrella Setup (edit) image control not ready.");
    sts = await umbrella.uploadBrokenImageUrl(testdata.brokenImageUrl);
    await assertion.assertEqual(sts.realImg, false, "[edit] Broken URL should NOT render a real image preview.");
    await assertion.assertEqual(sts.errorShown, true,
      "[edit] REPORTED ISSUE (CF-IMG-004): broken URL shows a placeholder icon with NO clear inline error (fix pending).");
  },

  // ── TST_BUMB_TC_8 [EDIT] (TC-CF-020) — non-image file is rejected ──────────────────────
  TST_BUMB_TC_8: async function (testdata) {
    sts = await umbrella.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Umbrella Setup (edit) image control not ready.");
    sts = await umbrella.uploadFileExpectingError(testdata.nonImageFile);
    await assertion.assertEqual(sts.errorShown, true, "[edit] No error shown when a non-image file was selected.");
    await assertion.assertEqual(sts.previewShown, false, "[edit] A preview rendered for a non-image file.");
  },

  // ── TST_BUMB_TC_9 — cleanup: delete the edit-mode fixture umbrella ─────────────────────
  TST_BUMB_TC_9: async function (testdata) {
    sts = await umbrella.deleteUmbrella(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.deleteStatus, true, "Cleanup: fixture umbrella could not be deleted.");
  }
};
