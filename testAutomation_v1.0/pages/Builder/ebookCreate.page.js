"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

var sel = selectorFile.css.Builder;

/**
 * Builder — Create eBook (test-data creation) page object.
 *
 * Drives: create a Student Book (mandatory fields) → Save and Return → open it → import the
 * cover PDF, pages PDF, TOC, and hotlinks from the legacy editor's "ASSETS & UPLOADS" panel.
 * Listing search/open is delegated to ebooks.page.js (lazy require) to avoid duplicating helpers.
 *
 * Selectors were captured live on Thor (2026-06-26). Two notable product facts:
 *  - The create trigger is a tile in the "Create New" carousel; the "Student Book" tile is not
 *    the first slide, so the carousel right-arrow ("Next Slide") is advanced until it is clickable.
 *  - The create form is the legacy AngularJS form (form[name=addEbookForm]) reached at a hash
 *    route; the asset imports live on the legacy eBook editor's "ASSETS & UPLOADS" panel, each an
 *    "Import" link that reveals an ng-file-upload <input type=file> (per-asset onXxxSelect handler).
 */
module.exports = {
  createNewHeader:  sel.ebookCreate.createNewHeader,
  carouselNext:     sel.ebookCreate.carouselNext,
  studentBookCard:  sel.ebookCreate.studentBookCard,
  formDialog:       sel.ebookCreate.formDialog,
  codeInput:        sel.ebookCreate.uniqueCodeInput,
  pbTitleInput:     sel.ebookCreate.productBuildTitleInput,
  displayTitleInput:sel.ebookCreate.displayTitleInput,
  lmsInput:         sel.ebookCreate.learningMaterialsSummaryInput,
  cmsInput:         sel.ebookCreate.classMaterialsSummaryInput,
  saveReturnBtn:    sel.ebookCreate.saveReturnBtn,

  detailReady:      sel.ebookAssets.detailReady,
  processAllBtn:    sel.ebookAssets.processAllBtn,
  processConfirmOk: sel.ebookAssets.processConfirmOk,
  coverRow:         sel.ebookAssets.coverRow,
  coverImportLink:  sel.ebookAssets.coverImportLink,
  coverFileInput:   sel.ebookAssets.coverFileInput,
  pagesRow:         sel.ebookAssets.pagesRow,
  pagesImportLink:  sel.ebookAssets.pagesImportLink,
  pagesFileInput:   sel.ebookAssets.pagesFileInput,
  tocRow:           sel.ebookAssets.tocRow,
  tocImportLink:    sel.ebookAssets.tocImportLink,
  tocFileInput:     sel.ebookAssets.tocFileInput,
  hotlinkRow:       sel.ebookAssets.hotlinkRow,
  hotlinkImportLink:sel.ebookAssets.hotlinkImportLink,
  hotlinkFileInput: sel.ebookAssets.hotlinkFileInput,

  itemLinkByText:   sel.ebooks.itemLinkByText,

  // Builds a concrete selector from a JSON "{text}" template by injecting a runtime title.
  _byText: function (template, text) {
    return template.split("{text}").join(text);
  },

  // Builder is a slow, sync-heavy app — settle ~1.5s before EVERY button/control click so the target
  // is fully rendered/enabled and we don't race the app's async re-renders. Thin wrapper over
  // action.click that all clicks in this page object go through (options pass through unchanged).
  _click: async function (selector, options) {
    await browser.pause(1500);
    return await action.click(selector, options);
  },

  // Navigates to the eBooks listing (reuses ebooks.page.js so listing waits stay in one place).
  navigateToEbooks: async function () {
    await logger.logInto(await stackTrace.get());
    return await require("./ebooks.page.js").navigateTo();
  },

  // TC_1 — opens the "Create New" carousel's Student Book tile. The tile is not the first slide,
  // so advance the carousel (right-arrow) until the tile is clickable, then click it. A short
  // per-click timeout keeps the advance loop responsive instead of blocking on an off-track tile.
  openCreateForm: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForDisplayed(this.createNewHeader, 20000);
    if (true !== res) return { formStatus: false };
    var opened = false;
    for (var i = 0; i < 10 && !opened; i++) {
      if (await action.isExisting(this.studentBookCard) === true) {
        var r = await this._click(this.studentBookCard, { timeout: 4000 });
        if (true === r) { opened = true; break; }
      }
      // Tile not present/clickable on this slide — advance one slide and retry.
      await this._click(this.carouselNext, { timeout: 4000 });
      await browser.pause(700);
    }
    if (!opened) return { formStatus: false };
    // The legacy AngularJS new-eBook form has opened once the Unique Code field is present.
    res = await action.waitForDisplayed(this.codeInput, 20000);
    return { formStatus: true === res };
  },

  // TC_1 — fills the mandatory fields. NOTE: "Class Materials Summary" is mandatory too (captured
  // live). Product Build Year / Program are pre-defaulted by the program context. Non-mandatory
  // fields are left blank. addValue (pressSequentially) is used — Builder's Angular inputs are the
  // same family that ignores fill() on the SSO login (see product-knowledge.md).
  fillCreateForm: async function (testdata) {
    await logger.logInto(await stackTrace.get(), "code=" + testdata.uniqueCode + " title=" + testdata.productBuildTitle);
    var r1 = await action.addValue(this.codeInput, testdata.uniqueCode);
    var r2 = await action.addValue(this.pbTitleInput, testdata.productBuildTitle);
    var r3 = await action.addValue(this.displayTitleInput, testdata.displayTitle);
    var r4 = await action.addValue(this.lmsInput, testdata.learningMaterialsSummary);
    var r5 = await action.addValue(this.cmsInput, testdata.classMaterialsSummary);
    return { fillStatus: r1 === true && r2 === true && r3 === true && r4 === true && r5 === true };
  },

  // TC_1 — clicks Save and Return; confirms the form closed (Unique Code field detaches).
  saveAndReturn: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForEnabled(this.saveReturnBtn, 15000);
    if (true !== res) return { saveStatus: false };
    res = await this._click(this.saveReturnBtn);
    if (true !== res) return { saveStatus: res };
    // Slow collaborative backend: wait for the create form to detach (save committed + navigated away).
    res = await action.waitForExist(this.codeInput, 60000, true);
    await action.waitForDocumentLoad();
    return { saveStatus: true === res };
  },

  // TC_1 verify / TC_2 — is the eBook present in the listing? Delegates to ebooks.isInListing
  // (search + slow-sync refresh polling).
  isInListing: async function (title) {
    await logger.logInto(await stackTrace.get(), "title=" + title);
    return await require("./ebooks.page.js").isInListing(title);
  },

  // TC_2 — searches by Product Build Title, opens the eBook, waits for the legacy editor's
  // "ASSETS & UPLOADS" panel to confirm the detail page is ready.
  openBook: async function (title) {
    await logger.logInto(await stackTrace.get(), "open=" + title);
    var ebooks = require("./ebooks.page.js");
    var res = await ebooks.searchFor(title);
    if (true !== res.searchStatus) return { openStatus: false };
    var link = this._byText(this.itemLinkByText, title);
    res = await action.waitForDisplayed(link, 20000);
    if (true !== res) return { openStatus: false };
    res = await this._click(link);
    if (true !== res) return { openStatus: res };
    await action.waitForDocumentLoad();
    res = await action.waitForDisplayed(this.detailReady, 60000);
    return { openStatus: true === res };
  },

  // TC_3..TC_6 — ensures the ASSETS & UPLOADS panel is ready (it is part of the open eBook page,
  // not a separate tab — confirm it is present before importing).
  openAssetsSection: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForDisplayed(this.detailReady, 30000);
    return { sectionStatus: true === res };
  },

  // Reads the asset row's count badge (the circled number in the row's right corner) — the first
  // integer in the row text. Builder shows this count once an import COMPLETES (e.g. "PDF, Cover 1");
  // it is the reliable completion signal. Returns the integer, or 0 if no badge yet.
  _rowCount: async function (rowSel) {
    var t = await action.getText(rowSel);
    if (typeof t !== "string") return 0;
    var m = t.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  },

  // Shared import helper. Mirrors the manual flow captured on Thor:
  //   1. click the asset row's "Import" link (reveals the ng-file-upload input),
  //   2. set the file directly on that input (no native OS chooser) — this only STAGES it,
  //   3. click "Process all changes" and confirm "Ok" in the dialog — this starts ingestion,
  //   4. poll the row's count badge until it increments above its pre-import value — the circled
  //      number appearing is the product's completion signal.
  // Polls generously because Builder's backend ingest is slow and variable (a large pages PDF can
  // take minutes). Returns { importStatus, count }.
  _importFile: async function (importLinkSel, fileInputSel, rowSel, localPath, timeoutMs) {
    var before = await this._rowCount(rowSel);
    var r = await this._click(importLinkSel);
    if (true !== r) return { importStatus: r };
    await browser.pause(1500); // let the dropzone/input render before staging the file
    r = await action.setInputFiles(fileInputSel, localPath);
    if (true !== r) return { importStatus: r };
    // Staging alone does nothing — "Process all changes" + confirm "Ok" kicks off ingestion.
    // Normal click first (the _click delay lets the button settle/enable); works for cover/pages/TOC.
    r = await this._click(this.processAllBtn);
    if (true !== r) {
      // Only the HOTLINK Process button sits under a tooltip-wrapper that intercepts pointer events,
      // so the normal click times out. By now the button is enabled, so a forced REAL click lands
      // and drives the actual processing (a dispatched/untrusted event does NOT). Never reached by
      // the other assets, so their proven path is untouched.
      r = await this._click(this.processAllBtn, { force: true });
    }
    if (true !== r) return { importStatus: r };
    r = await action.waitForDisplayed(this.processConfirmOk, 15000);
    if (true !== r) return { importStatus: false };
    r = await this._click(this.processConfirmOk);
    if (true !== r) return { importStatus: r };
    // Wait for the row count badge to tick up (processing complete).
    var deadline = Date.now() + (timeoutMs || 180000);
    while (Date.now() < deadline) {
      await browser.pause(5000);
      var now = await this._rowCount(rowSel);
      if (now > before) {
        await logger.logInto(await stackTrace.get(), "import complete: count " + before + " -> " + now);
        await action.waitForDocumentLoad();
        return { importStatus: true, count: now };
      }
    }
    await logger.logInto(await stackTrace.get(), "import did NOT complete within timeout (count stayed " + before + ")", "error");
    return { importStatus: false };
  },

  // TC_3 — import the cover PDF.
  importCover: async function (localPath) {
    await logger.logInto(await stackTrace.get(), "cover=" + localPath);
    return await this._importFile(this.coverImportLink, this.coverFileInput, this.coverRow, localPath, 180000);
  },

  // TC_4 — import the pages PDF (large file — allow extended processing).
  importPages: async function (localPath) {
    await logger.logInto(await stackTrace.get(), "pages=" + localPath);
    return await this._importFile(this.pagesImportLink, this.pagesFileInput, this.pagesRow, localPath, 600000);
  },

  // TC_5 — upload the TOC spreadsheet.
  uploadToc: async function (localPath) {
    await logger.logInto(await stackTrace.get(), "toc=" + localPath);
    return await this._importFile(this.tocImportLink, this.tocFileInput, this.tocRow, localPath, 180000);
  },

  // TC_6 — import the hotlinks spreadsheet.
  importHotlinks: async function (localPath) {
    await logger.logInto(await stackTrace.get(), "hotlinks=" + localPath);
    return await this._importFile(this.hotlinkImportLink, this.hotlinkFileInput, this.hotlinkRow, localPath, 180000);
  }
};
