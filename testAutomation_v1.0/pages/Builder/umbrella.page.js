"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

var sel = selectorFile.css.Builder;

/**
 * Builder — Umbrella Products page object (module code BUMB).
 *
 * Umbrella is a SEPARATE entity from Family (own listing `/2024/umbrellas`, own create form) but the
 * "Product Logo" image control is the SAME component as Family (`#fileInput` / `#imageUrl` /
 * `div.border-dashed img.object-cover` / Remove). Captured live on Thor (2026-07-02). Two differences
 * from Family: (1) create requires an "Umbrella Type" <select>; (2) the submit button reads "Submit"
 * (not "Save"). NOTE: the Umbrella LISTING does NOT render a cover thumbnail (Family's does), so image
 * persistence is verified only in edit mode (Setup tab), not in the listing.
 */
module.exports = {
  typeSelect:      sel.umbrella.typeSelect,
  codeInput:       sel.umbrella.codeInput,
  titleInput:      sel.umbrella.titleInput,
  submitBtn:       sel.umbrella.submitBtn,
  deleteBtn:       sel.umbrella.deleteBtn,
  detailSetupTab:  sel.umbrella.detailSetupTab,
  searchInput:     sel.umbrella.searchInput,
  itemLinkByText:  sel.umbrella.itemLinkByText,
  imageFileInput:  sel.umbrella.imageFileInput,
  imageUrlInput:   sel.umbrella.imageUrlInput,
  imagePreview:    sel.umbrella.imagePreview,
  imagePlaceholderIcon: sel.umbrella.imagePlaceholderIcon,
  imageRemoveBtn:  sel.umbrella.imageRemoveBtn,
  imageErrorText:  sel.umbrella.imageErrorText,
  dialog:          sel.deleteModal.dialog,
  delCommentInput: sel.deleteModal.commentInput,
  delConfirmBtn:   sel.deleteModal.confirmBtn,

  _byText: function (template, text) {
    return template.split("{text}").join(text);
  },

  navigateToCreate: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.url("/2024/umbrellas/create");
    await action.waitForDocumentLoad();
    var res = await action.waitForDisplayed(this.codeInput, 15000);
    return { pageStatus: true === res };
  },

  // Selects the required "Umbrella Type" (e.g. "Generic Umbrella Product") by its visible label.
  selectType: async function (label) {
    await logger.logInto(await stackTrace.get(), "type=" + label);
    var res = await action.selectByAttribute(this.typeSelect, "label", label);
    return { selectStatus: true === res };
  },

  // Umbrella code is a Vue-form field (dynamic id, targeted by name). Type char-by-char (fill() is
  // ignored) + Tab to commit, and verify the value stuck.
  fillCode: async function (code) {
    await logger.logInto(await stackTrace.get(), "fillCode=" + code);
    await action.click(this.codeInput);
    await action.clearValue(this.codeInput);
    await action.addValue(this.codeInput, code);
    await action.keyPress("Tab");
    await browser.pause(300);
    return { fillStatus: (await action.getValue(this.codeInput)) === code };
  },

  fillTitle: async function (title) {
    await logger.logInto(await stackTrace.get(), "fillTitle=" + title);
    await action.click(this.titleInput);
    await action.clearValue(this.titleInput);
    var res = await action.addValue(this.titleInput, title);
    await action.keyPress("Tab");
    return { fillStatus: true === res };
  },

  // Selects a cover image from an external URL and confirms it with Enter (same control as Family).
  uploadImageFromUrl: async function (url) {
    await logger.logInto(await stackTrace.get(), "uploadImageFromUrl=" + url);
    await action.click(this.imageUrlInput);
    await action.clearValue(this.imageUrlInput);
    var res = await action.addValue(this.imageUrlInput, url);
    if (true !== res) return { previewStatus: res };
    res = await action.keyPress("Enter");
    if (true !== res) return { previewStatus: res };
    res = await action.waitForDisplayed(this.imagePreview, 30000);
    if (true !== res) return { previewStatus: false };
    return { previewStatus: true, src: await action.getAttribute(this.imagePreview, "src"), alt: await action.getAttribute(this.imagePreview, "alt") };
  },

  // Types a broken/invalid external URL and confirms with Enter. Reports the resulting state for RTM
  // CF-IMG-004 (a broken URL MUST show a clear inline error). Actual on Thor: no real <img>, a generic
  // image-placeholder ICON (svg.lucide-image), and NO error text. Returns { placeholderIcon, realImg,
  // errorShown }.
  uploadBrokenImageUrl: async function (url) {
    await logger.logInto(await stackTrace.get(), "uploadBrokenImageUrl=" + url);
    await action.click(this.imageUrlInput);
    await action.clearValue(this.imageUrlInput);
    var res = await action.addValue(this.imageUrlInput, url);
    if (true !== res) return { placeholderIcon: res };
    await action.keyPress("Enter");
    var icon = await action.waitForDisplayed(this.imagePlaceholderIcon, 15000);
    return {
      placeholderIcon: true === icon,
      realImg: (await action.isExisting(this.imagePreview)) === true,
      errorShown: (await action.isExisting(this.imageErrorText)) === true
    };
  },

  // Selects a cover image from a local file (hidden #fileInput → S3 → preview).
  uploadImageFromFile: async function (localPath) {
    await logger.logInto(await stackTrace.get(), "uploadImageFromFile=" + localPath);
    var res = await action.setInputFiles(this.imageFileInput, localPath);
    if (true !== res) return { previewStatus: res };
    res = await action.waitForDisplayed(this.imagePreview, 30000);
    if (true !== res) return { previewStatus: false };
    return { previewStatus: true, src: await action.getAttribute(this.imagePreview, "src"), alt: await action.getAttribute(this.imagePreview, "alt") };
  },

  // Types an external URL and confirms it by BLURRING the field (clicking OUTSIDE, onto the Title
  // field) instead of pressing Enter — the product loads the preview on blur too. Returns
  // { previewStatus, src, alt }.
  uploadImageFromUrlByBlur: async function (url) {
    await logger.logInto(await stackTrace.get(), "uploadImageFromUrlByBlur=" + url);
    await action.click(this.imageUrlInput);
    await action.clearValue(this.imageUrlInput);
    var res = await action.addValue(this.imageUrlInput, url);
    if (true !== res) return { previewStatus: res };
    await action.click(this.titleInput); // click outside the URL box → blur triggers the preview
    res = await action.waitForDisplayed(this.imagePreview, 30000);
    if (true !== res) return { previewStatus: false };
    return {
      previewStatus: true,
      src: await action.getAttribute(this.imagePreview, "src"),
      alt: await action.getAttribute(this.imagePreview, "alt")
    };
  },

  // Clicks Submit and confirms the create form left (redirects to the /umbrellas listing).
  save: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForEnabled(this.submitBtn, 30000);
    if (true !== res) return { saveStatus: false };
    res = await action.click(this.submitBtn);
    if (true !== res) return { saveStatus: res };
    try {
      await browser.waitUntil(
        async function () { return !(await browser.getUrl()).includes("/umbrellas/create"); },
        { timeout: 20000, timeoutMsg: "umbrella-create-no-redirect" }
      );
    } catch (e) {
      return { saveStatus: false };
    }
    await action.waitForDocumentLoad();
    return { saveStatus: true };
  },

  // Types the URL WITHOUT confirming (no Enter) to prove the preview does not auto-load while typing.
  typeImageUrlWithoutConfirm: async function (url) {
    await logger.logInto(await stackTrace.get(), "typeImageUrlWithoutConfirm=" + url);
    await action.click(this.imageUrlInput);
    await action.clearValue(this.imageUrlInput);
    await action.addValue(this.imageUrlInput, url);
    await browser.pause(2500);
    return { previewShown: (await action.isExisting(this.imagePreview)) === true };
  },

  // Confirms the URL previously typed (Enter) and waits for the preview.
  confirmTypedImageUrl: async function () {
    await logger.logInto(await stackTrace.get());
    await action.click(this.imageUrlInput);
    var res = await action.keyPress("Enter");
    if (true !== res) return { previewStatus: res };
    res = await action.waitForDisplayed(this.imagePreview, 30000);
    return { previewStatus: true === res };
  },

  // Uploads a file expected to be REJECTED (non-image / disallowed) — confirms the inline error and
  // that no preview appears. Returns { errorShown, message, previewShown }.
  uploadFileExpectingError: async function (localPath) {
    await logger.logInto(await stackTrace.get(), "uploadFileExpectingError=" + localPath);
    var res = await action.setInputFiles(this.imageFileInput, localPath);
    if (true !== res) return { errorShown: res };
    res = await action.waitForDisplayed(this.imageErrorText, 20000);
    if (true !== res) return { errorShown: false };
    return {
      errorShown: true,
      message: await action.getText(this.imageErrorText),
      previewShown: (await action.isExisting(this.imagePreview)) === true
    };
  },

  // Removes the currently-previewed image; confirms the preview detaches and the URL control returns.
  removeImage: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForDisplayed(this.imageRemoveBtn, 10000);
    if (true !== res) return { removeStatus: res };
    res = await action.click(this.imageRemoveBtn);
    if (true !== res) return { removeStatus: res };
    res = await action.waitForDisplayed(this.imagePreview, 10000, true);
    if (true !== res) return { removeStatus: false };
    return { removeStatus: true, uploadControlBack: (await action.isExisting(this.imageUrlInput)) === true };
  },

  // Opens the umbrella's detail → Setup tab in EDIT mode and waits for the image control to be in the
  // upload state (#imageUrl present = no cover yet). Returns { pageStatus }.
  openEditSetup: async function (code) {
    await logger.logInto(await stackTrace.get(), "openEditSetup=" + code);
    await browser.url("/2024/umbrellas/" + code);
    await action.waitForDocumentLoad();
    var tab = await action.waitForDisplayed(this.detailSetupTab, 20000);
    if (true !== tab) return { pageStatus: false };
    await action.click(this.detailSetupTab);
    var res = await action.waitForDisplayed(this.imageUrlInput, 20000);
    return { pageStatus: true === res };
  },

  // Opens the saved umbrella's detail page, switches to Setup, returns the persisted cover src.
  openDetailSetup: async function (code) {
    await logger.logInto(await stackTrace.get(), "openDetailSetup=" + code);
    await browser.url("/2024/umbrellas/" + code);
    await action.waitForDocumentLoad();
    var tab = await action.waitForDisplayed(this.detailSetupTab, 20000);
    if (true !== tab) return { pageStatus: false };
    await action.click(this.detailSetupTab);
    var res = await action.waitForDisplayed(this.imagePreview, 20000);
    if (true !== res) return { pageStatus: false };
    return { pageStatus: true, src: await action.getAttribute(this.imagePreview, "src") };
  },

  // Lands on the umbrellas listing (where #search lives) — callers may arrive from a detail page.
  navigateToListing: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.url("/2024/umbrellas");
    await action.waitForDocumentLoad();
    return { pageStatus: (await action.waitForDisplayed(this.searchInput, 20000)) === true };
  },

  searchFor: async function (term) {
    await logger.logInto(await stackTrace.get(), "searchFor=" + term);
    await action.clearValue(this.searchInput);
    var res = await action.addValue(this.searchInput, term);
    if (true !== res) return { searchStatus: res };
    res = await action.keyPress("Enter");
    if (true !== res) return { searchStatus: res };
    await browser.pause(2500);
    return { searchStatus: true };
  },

  isInListing: async function (title) {
    await logger.logInto(await stackTrace.get(), "isInListing=" + title);
    await this.navigateToListing();
    var res = await this.searchFor(title);
    if (true !== res.searchStatus) return { found: false };
    var exists = await action.isExisting(this._byText(this.itemLinkByText, title));
    return { found: exists === true };
  },

  // Deletes the umbrella from the listing card (search → Delete → comment → Confirm — same modal as
  // Family). Used for post-test cleanup.
  deleteUmbrella: async function (title) {
    await logger.logInto(await stackTrace.get(), "deleteUmbrella=" + title);
    await this.navigateToListing();
    var res = await this.searchFor(title);
    if (true !== res.searchStatus) return { deleteStatus: res.searchStatus };
    res = await action.waitForDisplayed(this.deleteBtn, 10000);
    if (true !== res) return { deleteStatus: res };
    res = await action.click(this.deleteBtn);
    if (true !== res) return { deleteStatus: res };
    await browser.pause(800);
    if ((await action.isExisting(this.delCommentInput)) === true) {
      await action.addValue(this.delCommentInput, "Automated cleanup of test umbrella.");
      await browser.pause(300);
    }
    if ((await action.isExisting(this.delConfirmBtn)) === true) {
      await action.waitForEnabled(this.delConfirmBtn, 10000);
      await action.click(this.delConfirmBtn);
      await browser.pause(3000);
      await action.waitForExist(this.dialog, 30000, true);
    }
    await browser.pause(6000);
    await browser.url("/2024/umbrellas");
    await action.waitForDocumentLoad();
    return { deleteStatus: true };
  }
};
