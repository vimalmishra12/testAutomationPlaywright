"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → createNewAccountsForChildren (root level)
// Note: this section lives at JSON root (not under css.ComproC1) — matches the vhlNotes pattern.
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // Resolves to C1Selectors.json → createNewAccountsForChildren.*
  pageHeading:      selectorFile.createNewAccountsForChildren.pageHeading,
  csvFileInput:     selectorFile.createNewAccountsForChildren.csvFileInput,
  uploadFileBtn:    selectorFile.createNewAccountsForChildren.uploadFileBtn,
  backBtn:          selectorFile.createNewAccountsForChildren.backBtn,
  getCsvTemplateLink: selectorFile.createNewAccountsForChildren.getCsvTemplateLink,
  // inline error element rendered per field after CSV upload
  inlineErrorText:  selectorFile.createNewAccountsForChildren.inlineErrorText,
  // Global-error modal — fires when the whole CSV is rejected (e.g. > 200 records)
  uploadErrorModalTitle: selectorFile.createNewAccountsForChildren.uploadErrorModalTitle,
  uploadErrorModalBody:  selectorFile.createNewAccountsForChildren.uploadErrorModalBody,

  /**
   * Confirms the "Create new accounts for children" CSV upload page has loaded.
   * Uses the Upload file button [qid="aBulkActions-2"] as the stable anchor element.
   * The children and adult pages share the same qid scheme — see decisions.md ADR-002.
   */
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.uploadFileBtn)
    };
    return res;
  },

  /**
   * Navigates directly to the children CSV upload page using the appUrl global + a relative path.
   * relPath example: "admin/admin/org_mqa-sierra-thor/children/new_csv"
   * The user must already be authenticated (logged in as school admin) before calling this.
   */
  navigateTo: async function (relPath) {
    // Navigate via about:blank first to force Angular to fully teardown and re-mount
    // the upload component — same reasoning as createAdultStudentAccounts.page.js. NEMO-24306.
    await logger.logInto(await stackTrace.get(), "navigating to: " + relPath);
    await browser.url("about:blank");
    await browser.url(appUrl + relPath);
    return await this.isInitialized();
  },

  /**
   * Uploads a CSV file to the hidden file input [qid="aBulkActions-1"].
   * Identical upload mechanism to createAdultStudentAccounts.page.js — see that file
   * for the rationale on bypassing action.setValue for hidden file inputs.
   */
  upload_csvFile: async function (csvFilePath) {
    // [2026-06-11] Playwright migration (Prompt 4 / Phase 2) — page-object port.
    // Same as createAdultStudentAccounts: Playwright setInputFiles handles the hidden
    // file input directly; the WDIO unhide + $(input).setValue dance is removed.
    await logger.logInto(await stackTrace.get(), "uploading: " + csvFilePath);
    try {
      const res = await action.setInputFiles(this.csvFileInput, csvFilePath);
      if (res !== true) {
        await logger.logInto(await stackTrace.get(), "setInputFiles failed for: " + csvFilePath, "error");
        return res;
      }
      await action.waitForDisplayed(".uploading-file-modal");
      await action.waitForDisplayed(".uploading-file-modal", undefined, true);
      await browser.pause(2000);
      await action.waitForDocumentLoad();
      await logger.logInto(await stackTrace.get(), "CSV uploaded successfully: " + csvFilePath);
      return true;
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      return err;
    }
  },

  /**
   * Returns an array of non-empty inline validation error texts after CSV upload.
   * See createAdultStudentAccounts.page.js getData_uploadErrors for full context.
   * Used to verify the NEMO-24306 empty-username error fix on the children page (TC_7).
   */
  getData_uploadErrors: async function () {
    await logger.logInto(await stackTrace.get());
    var errors = [];
    try {
      // 1) Per-row inline errors — same approach as createAdultStudentAccounts.page.js.
      var inlineCount = await action.getElementCount(this.inlineErrorText);
      if (inlineCount > 0) {
        await action.scrollIntoView(this.inlineErrorText, { block: "center" });
        // [2026-06-11] Playwright port: action.findElements (locator.all()) + innerText().
        var elements = await action.findElements(this.inlineErrorText);
        for (var i = 0; i < elements.length; i++) {
          var text = await elements[i].innerText();
          if (text && text.trim()) {
            errors.push(text.trim());
          }
        }
      }
      // 2) Global error modal (e.g. CSV > 200 records). Same approach as the adult page.
      var modalCount = await action.getElementCount(this.uploadErrorModalTitle);
      if (modalCount > 0) {
        var title = await action.getText(this.uploadErrorModalTitle);
        var body  = await action.getText(this.uploadErrorModalBody);
        if (title && title.trim()) errors.push(title.trim());
        if (body  && body.trim())  errors.push(body.trim().replace(/\s+/g, " "));
      }
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
    }
    return errors;
  }
};
