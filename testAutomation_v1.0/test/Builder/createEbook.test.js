"use strict";
var ebookCreate = require("../../pages/Builder/ebookCreate.page.js");
var sts;

// One run-unique suffix so the created eBook's code + Product Build Title never collide across
// re-runs. Generated ONCE per run and reused, so every TC in the chain derives the SAME values
// (TC_1 creates them; TC_2..TC_6 search/open the same eBook). Same pattern as the clone suites.
var RUN_ID = (function () { return Date.now().toString().slice(-6); }());

// Derives the concrete per-run field values from the static data bases. Called identically in
// every TC so the code/title computed in TC_1 match what TC_2..TC_6 search for.
function book(testdata) {
  return {
    uniqueCode:               testdata.uniqueCode + "_" + RUN_ID,
    productBuildTitle:        testdata.productBuildTitle + "_" + RUN_ID,
    displayTitle:             testdata.displayTitle + "_" + RUN_ID,
    learningMaterialsSummary: testdata.learningMaterialsSummary + "_" + RUN_ID,
    classMaterialsSummary:    testdata.classMaterialsSummary + "_" + RUN_ID
  };
}

module.exports = {

  // Login TCs (TST_BLOGI_TC_1 / TST_BLOGI_TC_2) live in ./login.test.js — the execution file's
  // login steps reference that file directly (ADR-011: reuse, don't redefine).

  // ── TST_BECR_TC_1 — Create a new Student Book with the mandatory fields ────────────────
  TST_BECR_TC_1: async function (testdata) {
    var b = book(testdata);
    sts = await ebookCreate.navigateToEbooks();
    await assertion.assertEqual(sts.pageStatus, true, "eBooks listing did not load.");
    sts = await ebookCreate.openCreateForm();
    await assertion.assertEqual(sts.formStatus, true, "Create new Student Book form did not open.");
    sts = await ebookCreate.fillCreateForm(b);
    await assertion.assertEqual(sts.fillStatus, true, "Failed to fill the mandatory create-eBook fields.");
    sts = await ebookCreate.saveAndReturn();
    await assertion.assertEqual(sts.saveStatus, true, "Save and return did not complete / listing did not reload.");
    sts = await ebookCreate.isInListing(b.productBuildTitle);
    await assertion.assertEqual(sts.found, true, "Newly created eBook '" + b.productBuildTitle + "' not found in listing.");
  },

  // ── TST_BECR_TC_2 — Find the created eBook by Product Build Title and open it ───────────
  TST_BECR_TC_2: async function (testdata) {
    var b = book(testdata);
    sts = await ebookCreate.openBook(b.productBuildTitle);
    await assertion.assertEqual(sts.openStatus, true, "Created eBook '" + b.productBuildTitle + "' did not open.");
  },

  // ── TST_BECR_TC_3 — Import the cover PDF via Assets & Download ──────────────────────────
  TST_BECR_TC_3: async function (testdata) {
    sts = await ebookCreate.openAssetsSection();
    await assertion.assertEqual(sts.sectionStatus, true, "Assets & Download section did not open.");
    sts = await ebookCreate.importCover(testdata.coverFile);
    await assertion.assertEqual(sts.importStatus, true, "Cover PDF import failed.");
  },

  // ── TST_BECR_TC_4 — Import the pages PDF ───────────────────────────────────────────────
  TST_BECR_TC_4: async function (testdata) {
    sts = await ebookCreate.importPages(testdata.pagesFile);
    await assertion.assertEqual(sts.importStatus, true, "Pages PDF import failed.");
  },

  // ── TST_BECR_TC_5 — Upload the TOC ─────────────────────────────────────────────────────
  TST_BECR_TC_5: async function (testdata) {
    sts = await ebookCreate.uploadToc(testdata.tocFile);
    await assertion.assertEqual(sts.importStatus, true, "TOC upload failed.");
  },

  // ── TST_BECR_TC_6 — Import the hotlinks spreadsheet ────────────────────────────────────
  TST_BECR_TC_6: async function (testdata) {
    sts = await ebookCreate.importHotlinks(testdata.hotlinkFile);
    await assertion.assertEqual(sts.importStatus, true, "Hotlink import failed.");
  }
};
