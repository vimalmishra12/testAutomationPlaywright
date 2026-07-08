"use strict";
var families = require("../../pages/Builder/families.page.js");
var sts;

// One run-unique suffix so the SAVED family's code/title never collide across re-runs. Generated
// once and reused, so TC_8 (create+verify) and TC_9 (cleanup) act on the SAME family.
var RUN_ID = (function () { return Date.now().toString().slice(-6); }());

/**
 * Builder — Create Family "Product Logo" IMAGE SELECTION cases.
 *
 * Module code BFAM (families.page.js). Maps to the Create-New-Family RTM (Image Upload category):
 *   TST_BFAM_TC_1 → TC-CF-016  Cover image uploadable via LOCAL file selection
 *   TST_BFAM_TC_2 → TC-CF-017  Cover image uploadable via valid EXTERNAL URL
 *   TST_BFAM_TC_3 → TC-CF-018  External URL preview requires CONFIRMATION (no auto-load on typing)
 *   TST_BFAM_TC_4 → TC-CF-019  Broken/invalid external image URL
 *   TST_BFAM_TC_5 → TC-CF-020  Non-image file is rejected
 *   TST_BFAM_TC_6 → TC-CF-021  Previously selected image is removable and replaceable
 *
 * Each TC opens a fresh Create-Family form (navigateToCreate) so the tests are independent and
 * create NO family records — they only exercise the image control. Login TCs (TST_BLOGI_TC_1/2)
 * live in ./login.test.js and are referenced from the execution file (ADR-011: reuse, don't redefine).
 */
module.exports = {

  // ── TST_BFAM_TC_1 (TC-CF-016) — upload a cover image from a local file ─────────────────
  TST_BFAM_TC_1: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadImageFromFile(testdata.localImage);
    await assertion.assertEqual(sts.previewStatus, true, "Preview did not render for the uploaded local image.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "Valid local image fell back to the placeholder preview.");
  },

  // ── TST_BFAM_TC_2 (TC-CF-017) — upload a cover image from a valid external URL ─────────
  TST_BFAM_TC_2: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadImageFromUrl(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "Preview did not render for the external image URL.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "Valid external URL fell back to the placeholder preview.");
  },

  // ── TST_BFAM_TC_3 (TC-CF-018) — external URL must NOT auto-preview while typing ────────
  TST_BFAM_TC_3: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.typeImageUrlWithoutConfirm(testdata.imageUrl);
    await assertion.assertEqual(sts.previewShown, false, "Preview auto-loaded while typing — it must require explicit confirmation.");
    sts = await families.confirmTypedImageUrl();
    await assertion.assertEqual(sts.previewStatus, true, "Preview did not load after explicit confirmation (Enter).");
  },

  // ── TST_BFAM_TC_4 (TC-CF-019) — broken/invalid external image URL ──────────────────────
  // A broken/invalid external URL does not load a real image; the control shows a generic
  // image-placeholder ICON (svg.lucide-image) with no real preview. Per product decision (2026-07-08)
  // this placeholder is the ACCEPTED behaviour for now (a clearer inline error may come in a future
  // iteration). Asserts the broken URL is not accepted as a valid cover.
  TST_BFAM_TC_4: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadBrokenImageUrl(testdata.brokenImageUrl);
    await assertion.assertEqual(sts.realImg, false, "Broken URL should NOT render a real image preview.");
    await assertion.assertEqual(sts.placeholderIcon, true,
      "Broken URL did not show the expected image-placeholder icon.");
  },

  // ── TST_BFAM_TC_5 (TC-CF-020) — non-image file is rejected with an error ───────────────
  TST_BFAM_TC_5: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadFileExpectingError(testdata.nonImageFile);
    await assertion.assertEqual(sts.errorShown, true, "No error was shown when a non-image file was selected.");
    await assertion.assertEqual(sts.previewShown, false, "A preview rendered for a non-image file — it must be rejected.");
  },

  // ── TST_BFAM_TC_6 (TC-CF-021) — selected image is removable and replaceable ────────────
  TST_BFAM_TC_6: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadImageFromUrl(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "Initial image did not preview.");
    sts = await families.removeImage();
    await assertion.assertEqual(sts.removeStatus, true, "Image could not be removed.");
    await assertion.assertEqual(sts.uploadControlBack, true, "Upload control did not return after removing the image.");
    // Replace: select a different source (local file) and confirm a new preview renders.
    sts = await families.uploadImageFromFile(testdata.localImage);
    await assertion.assertEqual(sts.previewStatus, true, "Replacement image did not preview after removal.");
  },

  // ── TST_BFAM_TC_7 (RTM CF-IMG-005) — disallowed image format (.webp) is rejected ───────
  // The Product Logo control accepts ONLY png/jpeg/jpg. A .webp (fed via setInputFiles, which mirrors
  // the drag path — it bypasses the click dialog's `accept` filter) must be rejected with a CLEAR,
  // format-specific message and NO preview. Verified on Thor (2026-07-07, after the app fix): the
  // control shows the red "You are uploading a file with an unsupported format. Please upload a file
  // with a supported format (png, jpeg, jpg)." message. (Earlier the app showed a generic "Something
  // went wrong"; this TC was a defect guard for that gap and now passes.)
  TST_BFAM_TC_7: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadFileExpectingError(testdata.webpImage);
    await assertion.assertEqual(sts.previewShown, false, "Disallowed .webp was accepted/previewed — only png/jpeg/jpg are allowed.");
    await assertion.assertEqual(sts.errorShown, true, "No rejection message shown for the .webp upload.");
    // The rejection must be format-specific (name the supported formats), not a generic error.
    var msg = (sts.message || "").toLowerCase();
    var formatSpecific = /unsupported|supported format|png|jpe?g/.test(msg);
    await assertion.assertEqual(formatSpecific, true,
      "Expected a format-specific 'unsupported format' message naming png/jpeg/jpg, got: '" + sts.message + "'.");
  },

  // ── TST_BFAM_TC_8 — SAVE a family with a cover image, then verify it PERSISTED ─────────
  // Covers the "save + check in edit mode" and "check on Families list" requirements: create+save a
  // family with an image URL, reopen it (Setup tab) to confirm the saved cover, and confirm the same
  // cover renders as the listing thumbnail. Creates a real family (cleaned up by TC_9).
  TST_BFAM_TC_8: async function (testdata) {
    // Builder search is TITLE-based (you cannot search by code), so use the SAME value for code and
    // title — then searching that value effectively finds the family "by code" (clone-suite convention).
    var code = testdata.codeBase + RUN_ID;
    var title = code;
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.fillFamilyCode(code);
    await assertion.assertEqual(sts.fillStatus, true, "Unique Code was not filled.");
    sts = await families.fillFamilyTitle(title);
    await assertion.assertEqual(sts.fillStatus, true, "Title was not filled.");
    sts = await families.uploadImageFromUrl(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "Cover image did not preview before save.");
    sts = await families.saveFamily(code, title);
    await assertion.assertEqual(sts.saveStatus, true, "Family did not save.");
    // Persisted in EDIT MODE: reopen the family → Setup tab → the saved cover must be shown.
    sts = await families.openDetailSetup(code);
    await assertion.assertEqual(sts.pageStatus, true, "Saved cover image not shown on the family's edit (Setup) page.");
    await assertion.assertEqual(sts.src.indexOf(testdata.imageUrl) !== -1, true,
      "Edit-mode cover src ('" + sts.src + "') does not match the saved image URL.");
    // Persisted in the LISTING: the Families list must show the same cover thumbnail.
    sts = await families.getListImage(title);
    await assertion.assertEqual(sts.found, true, "Saved family's cover thumbnail is not shown in the Families listing.");
    await assertion.assertEqual(sts.src.indexOf(testdata.imageUrl) !== -1, true,
      "Families-list thumbnail src ('" + sts.src + "') does not match the saved image URL.");
  },

  // ── TST_BFAM_TC_9 — cleanup: delete the family created by TC_8 ─────────────────────────
  TST_BFAM_TC_9: async function (testdata) {
    var code = testdata.codeBase + RUN_ID;
    var title = code;
    sts = await families.deleteFamily(code, title);
    await assertion.assertEqual(sts.deleteStatus, true, "Cleanup: family could not be deleted.");
    // Confirm removal via the cover-thumbnail lookup (a working selector): no card → no thumbnail.
    sts = await families.getListImage(title);
    await assertion.assertEqual(sts.found, false, "Cleanup: family still present in listing after delete.");
  },

  // ══ EDIT MODE — repeat the 5 image-selection cases on the family's Setup (edit) page ══════
  // The same image control lives on the family detail → Setup tab. TC_10 creates a fixture family
  // (no cover) so its Setup opens in the upload state; TC_11..15 re-run the 5 create-form cases there
  // (each opens the Setup page fresh, discarding unsaved changes); TC_16 deletes the fixture.

  // ── TST_BFAM_TC_10 — fixture: create a cover-less family for the edit-mode cases ───────
  TST_BFAM_TC_10: async function (testdata) {
    var code = testdata.codeBase + RUN_ID;
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.fillFamilyCode(code);
    await assertion.assertEqual(sts.fillStatus, true, "Unique Code was not filled.");
    sts = await families.fillFamilyTitle(code);
    await assertion.assertEqual(sts.fillStatus, true, "Title was not filled.");
    sts = await families.saveFamily(code, code);
    await assertion.assertEqual(sts.saveStatus, true, "Fixture family did not save.");
  },

  // ── TST_BFAM_TC_11 [EDIT] (TC-CF-016) — local file upload on the Setup page ────────────
  TST_BFAM_TC_11: async function (testdata) {
    sts = await families.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Family Setup (edit) image control not ready.");
    sts = await families.uploadImageFromFile(testdata.localImage);
    await assertion.assertEqual(sts.previewStatus, true, "[edit] Preview did not render for the local image.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "[edit] Valid local image fell back to placeholder.");
  },

  // ── TST_BFAM_TC_12 [EDIT] (TC-CF-017) — external URL upload on the Setup page ──────────
  TST_BFAM_TC_12: async function (testdata) {
    sts = await families.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Family Setup (edit) image control not ready.");
    sts = await families.uploadImageFromUrl(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "[edit] Preview did not render for the external URL.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "[edit] Valid external URL fell back to placeholder.");
  },

  // ── TST_BFAM_TC_13 [EDIT] (TC-CF-018) — no auto-preview while typing; Enter confirms ───
  TST_BFAM_TC_13: async function (testdata) {
    sts = await families.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Family Setup (edit) image control not ready.");
    sts = await families.typeImageUrlWithoutConfirm(testdata.imageUrl);
    await assertion.assertEqual(sts.previewShown, false, "[edit] Preview auto-loaded while typing — must require confirmation.");
    sts = await families.confirmTypedImageUrl();
    await assertion.assertEqual(sts.previewStatus, true, "[edit] Preview did not load after explicit confirm (Enter).");
  },

  // ── TST_BFAM_TC_14 [EDIT] (TC-CF-019) — broken external URL → placeholder icon ─────────
  // Same as TC_4 on the Setup (edit) page: a broken URL shows the image-placeholder icon (accepted
  // behaviour for now) and no real preview.
  TST_BFAM_TC_14: async function (testdata) {
    sts = await families.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Family Setup (edit) image control not ready.");
    sts = await families.uploadBrokenImageUrl(testdata.brokenImageUrl);
    await assertion.assertEqual(sts.realImg, false, "[edit] Broken URL should NOT render a real image preview.");
    await assertion.assertEqual(sts.placeholderIcon, true,
      "[edit] Broken URL did not show the expected image-placeholder icon.");
  },

  // ── TST_BFAM_TC_15 [EDIT] (TC-CF-020) — non-image file is rejected ─────────────────────
  TST_BFAM_TC_15: async function (testdata) {
    sts = await families.openEditSetup(testdata.codeBase + RUN_ID);
    await assertion.assertEqual(sts.pageStatus, true, "Family Setup (edit) image control not ready.");
    sts = await families.uploadFileExpectingError(testdata.nonImageFile);
    await assertion.assertEqual(sts.errorShown, true, "[edit] No error shown when a non-image file was selected.");
    await assertion.assertEqual(sts.previewShown, false, "[edit] A preview rendered for a non-image file.");
  },

  // ── TST_BFAM_TC_16 — cleanup: delete the edit-mode fixture family ──────────────────────
  TST_BFAM_TC_16: async function (testdata) {
    var code = testdata.codeBase + RUN_ID;
    // TC_15 leaves us on the Setup (detail) page — land on the listing first (that's where #search is).
    await families.navigateTo();
    sts = await families.deleteFamily(code, code);
    await assertion.assertEqual(sts.deleteStatus, true, "Cleanup: fixture family could not be deleted.");
  },

  // ── TST_BFAM_TC_17 — image file whose FILENAME has special characters is accepted ──────
  // A valid png whose name contains special characters (e.g. "sp3cial @#&()!+ name.png") must upload
  // and preview normally — the filename must not block acceptance. Uses the local-file upload path.
  TST_BFAM_TC_17: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadImageFromFile(testdata.specialCharImage);
    await assertion.assertEqual(sts.previewStatus, true, "Image with a special-character filename was not accepted / did not preview.");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "Special-character-filename image fell back to the placeholder preview.");
  },

  // ── TST_BFAM_TC_18 (TC-CF-017) — external URL preview loads on BLUR (click outside) ────
  // Typing an external URL and clicking OUTSIDE the text box (blur) must render the preview — Enter is
  // not the only confirm trigger.
  TST_BFAM_TC_18: async function (testdata) {
    sts = await families.navigateToCreate();
    await assertion.assertEqual(sts.pageStatus, true, "Create Family form did not open.");
    sts = await families.uploadImageFromUrlByBlur(testdata.imageUrl);
    await assertion.assertEqual(sts.previewStatus, true, "Preview did not render after clicking outside the URL box (blur).");
    await assertion.assertEqual(sts.alt !== "placeholder", true, "External URL (blur) fell back to the placeholder preview.");
  }
};
