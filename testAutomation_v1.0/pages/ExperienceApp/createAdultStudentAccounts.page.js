"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Selectors resolved at load time from C1Selectors.json → createAdultStudentAccounts (root level)
// Note: this section lives at JSON root (not under css.ComproC1).
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // Resolves to C1Selectors.json → createAdultStudentAccounts.*
  pageHeading:      selectorFile.createAdultStudentAccounts.pageHeading,
  csvFileInput:     selectorFile.createAdultStudentAccounts.csvFileInput,
  uploadFileBtn:    selectorFile.createAdultStudentAccounts.uploadFileBtn,
  backBtn:          selectorFile.createAdultStudentAccounts.backBtn,
  getCsvTemplateLink: selectorFile.createAdultStudentAccounts.getCsvTemplateLink,
  // inline error element rendered per field after CSV upload
  inlineErrorText:  selectorFile.createAdultStudentAccounts.inlineErrorText,
  // Global-error modal — fires when the whole CSV is rejected (e.g. > 200 records)
  uploadErrorModalTitle: selectorFile.createAdultStudentAccounts.uploadErrorModalTitle,
  uploadErrorModalBody:  selectorFile.createAdultStudentAccounts.uploadErrorModalBody,

  /**
   * Confirms the "Create adult student accounts" CSV upload page has loaded.
   * Uses the Upload file button [qid="aBulkActions-2"] as the stable anchor element.
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
   * Navigates directly to the CSV upload page using the appUrl global + a relative path.
   * relPath example: "admin/admin/org_mqa-sierra-thor/username-adult/new_csv"
   * Bypasses multi-step UI navigation — this is a design-time navigation shortcut.
   * The user must already be authenticated (logged in as school admin) before calling this.
   */
  navigateTo: async function (relPath) {
    // Navigate via about:blank first to force Angular to fully teardown and re-mount
    // the upload component on each TC. Without this, navigating to the same URL twice
    // in the same suite causes Angular's router to reuse the existing component instance,
    // leaving stale form state from the previous TC. See NEMO-24306 TC_9 regression.
    await logger.logInto(await stackTrace.get(), "navigating to: " + relPath);
    await browser.url("about:blank");
    await browser.url(appUrl + relPath);
    return await this.isInitialized();
  },

  /**
   * Uploads a CSV file to the hidden file input [qid="aBulkActions-1"].
   * Uses browser.uploadFile() to transfer the local file to the WebDriver session,
   * then sets the returned remote path directly on the file input (bypassing
   * action.setValue/clearValue which is not safe on hidden file inputs).
   * Returns true on success, Error on failure.
   */
  upload_csvFile: async function (csvFilePath) {
    // [2026-06-11] Playwright migration (Prompt 4 / Phase 2) — page-object port.
    // Playwright's setInputFiles sets files DIRECTLY on a hidden <input type=file>
    // and fires the native change event, so the old WDIO dance (uploadFile →
    // browser.execute unhide → $(input).setValue → re-hide) is no longer needed.
    await logger.logInto(await stackTrace.get(), "uploading: " + csvFilePath);
    try {
      const res = await action.setInputFiles(this.csvFileInput, csvFilePath);
      if (res !== true) {
        await logger.logInto(await stackTrace.get(), "setInputFiles failed for: " + csvFilePath, "error");
        return res;
      }
      // Upload starts automatically on the change event.
      // Step 1: wait for the uploading modal to APPEAR (confirms upload started) — without
      //         this the reverse-wait below can return before the modal even renders.
      await action.waitForDisplayed(".uploading-file-modal");
      // Step 2: wait for the modal to DISAPPEAR (confirms upload completed).
      await action.waitForDisplayed(".uploading-file-modal", undefined, true);
      // Step 3: let Angular finish rendering inline validation error text.
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
   * Errors render in div.error-rectification-wrapper (one per invalid field per row).
   * Used to assert both presence (negative TCs) and absence (positive/edge TCs).
   * See NEMO-24306 for the empty-username defect context.
   */
  getData_uploadErrors: async function () {
    await logger.logInto(await stackTrace.get());
    var errors = [];
    try {
      // 1) Per-row inline errors (most negative TCs use this path).
      //    Scroll the first one into view so the assertion-step screenshot is clear.
      var inlineCount = await action.getElementCount(this.inlineErrorText);
      if (inlineCount > 0) {
        await action.scrollIntoView(this.inlineErrorText);
        // [2026-06-11] Playwright port: $$ no longer returns an array — use
        // action.findElements (locator.all()) and read each via innerText().
        var elements = await action.findElements(this.inlineErrorText);
        for (var i = 0; i < elements.length; i++) {
          var text = await elements[i].innerText();
          if (text && text.trim()) {
            errors.push(text.trim());
          }
        }
      }
      // 2) Global error modal (e.g. CSV > 200 records). The modal title + body together
      //    form the user-visible error. Only collected when the modal is actually shown
      //    (.show class) — for positive TCs this returns 0 hits and adds nothing.
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
