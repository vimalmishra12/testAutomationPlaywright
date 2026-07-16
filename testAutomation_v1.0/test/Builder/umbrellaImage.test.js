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
    // Poll for absence — Builder's delete is async, so the item can linger through the first refresh.
    sts = await umbrella.waitForNotInListing(title);
    await assertion.assertEqual(sts.gone, true, "Cleanup: umbrella still present after delete (persisted through delete-sync polling).");
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

  // ── TST_BUMB_TC_7 [EDIT] (TC-CF-019) — broken external URL → placeholder icon ──────────
  // A broken URL shows the image-placeholder icon (accepted behaviour for now) and no real preview —
  // same as family TC_14.
  TST_BUMB_TC_7: async function (testdata) {
    sts = await umbrella.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Umbrella Setup (edit) image control not ready.");
    sts = await umbrella.uploadBrokenImageUrl(testdata.brokenImageUrl);
    await assertion.assertEqual(sts.realImg, false, "[edit] Broken URL should NOT render a real image preview.");
    await assertion.assertEqual(sts.placeholderIcon, true,
      "[edit] Broken URL did not show the expected image-placeholder icon.");
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
  },

  // ── TST_BUMB_TC_10 — image file with a special-character filename is accepted ──────────
  // Parity with family TST_BFAM_TC_17: a valid png whose name has special characters
  // ("sp3cial @#&()!+ name.png") must upload and preview on the umbrella create form.
  TST_BUMB_TC_10: async function (testdata) {
    sts = await umbrella.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Umbrella form did not open.");
    sts = await umbrella.uploadImageFromFile(testdata.specialCharImage);
    await assertion.assertEqual(sts.previewStatus, true, "Image with a special-character filename was not accepted / did not preview.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "Special-character-filename image fell back to the placeholder preview.");
  },

  // ── TST_BUMB_TC_11 (TC-CF-017) — external URL preview loads on BLUR (click outside) ────
  // Parity with family TST_BFAM_TC_18: typing an external URL and clicking OUTSIDE the text box
  // (blur) must render the preview — Enter is not the only confirm trigger.
  TST_BUMB_TC_11: async function (testdata) {
    sts = await umbrella.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Umbrella form did not open.");
    sts = await umbrella.uploadImageFromUrlByBlur(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "Preview did not render after clicking outside the URL box (blur).");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "External URL (blur) fell back to the placeholder preview.");
  }
};
