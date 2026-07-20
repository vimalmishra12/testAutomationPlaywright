"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");

/**
 * Builder — shared "Product Logo" image-control behaviour.
 *
 * Family (`/2024/families`) and Umbrella (`/2024/umbrellas`) are SEPARATE entities but embed the SAME
 * image component (hidden `#fileInput` local upload, `#imageUrl` external-URL field confirmed with
 * Enter/blur, `div.border-dashed img.object-cover` preview, placeholder icon, inline error, Remove).
 * These 8 methods were byte-for-byte identical in `families.page.js` and `umbrella.page.js`; they are
 * extracted here once and mixed into each page object via `Object.assign` (see the two page objects).
 * Captured live on Thor (2026-07-02).
 *
 * The host page object must expose these selector properties (each bound to its OWN `css.Builder`
 * namespace — Family vs Umbrella — so `this.*` resolves to the right selectors):
 *   imageFileInput, imageUrlInput, imagePreview, imagePlaceholderIcon, imageErrorText,
 *   imageRemoveBtn, and titleInput (the blur target for uploadImageFromUrlByBlur).
 *
 * No selectors are loaded here (no `jsonParserUtil.jsonParser(selectorDir)` call) — this module is
 * selector-agnostic, so it is safe to require from both page objects regardless of `selectorDir`
 * caching order.
 */
module.exports = {
  // Selects a cover image from a LOCAL file. Sets the hidden file input directly (no OS chooser);
  // Builder uploads it to S3 and renders the preview. Returns { previewStatus, src, alt }.
  uploadImageFromFile: async function (localPath) {
    await logger.logInto(await stackTrace.get(), "uploadImageFromFile=" + localPath);
    var res = await action.setInputFiles(this.imageFileInput, localPath);
    if (true !== res) return { previewStatus: res };
    // Staging → S3 upload → preview render is async; wait for the preview <img> to appear.
    res = await action.waitForDisplayed(this.imagePreview, 30000);
    if (true !== res) return { previewStatus: false };
    return {
      previewStatus: true,
      src: await action.getAttribute(this.imagePreview, "src"),
      alt: await action.getAttribute(this.imagePreview, "alt")
    };
  },

  // Selects a cover image from an EXTERNAL URL and CONFIRMS it with Enter. The product requires an
  // explicit confirm — the preview does NOT auto-load while typing (see typeImageUrlWithoutConfirm).
  // Returns { previewStatus, src, alt }. (For a URL that does NOT resolve to a valid image, use
  // uploadBrokenImageUrl — since the 2026-07-07 fix a broken URL renders an icon, not an <img>.)
  uploadImageFromUrl: async function (url) {
    await logger.logInto(await stackTrace.get(), "uploadImageFromUrl=" + url);
    await action.click(this.imageUrlInput);
    await action.clearValue(this.imageUrlInput);
    var res = await action.addValue(this.imageUrlInput, url);
    if (true !== res) return { previewStatus: res };
    res = await action.keyPress("Enter"); // Enter is the product's confirm action for the URL field.
    if (true !== res) return { previewStatus: res };
    res = await action.waitForDisplayed(this.imagePreview, 30000);
    if (true !== res) return { previewStatus: false };
    return {
      previewStatus: true,
      src: await action.getAttribute(this.imagePreview, "src"),
      alt: await action.getAttribute(this.imagePreview, "alt")
    };
  },

  // Types a broken/invalid external URL and confirms with Enter. Reports the resulting state so tests
  // can check it against RTM CF-IMG-004 (a broken URL MUST show a clear inline error). Actual on Thor:
  // no real <img>, a generic image-placeholder ICON (svg.lucide-image) with a Remove button, and NO
  // error text. Returns { placeholderIcon, realImg, errorShown }.
  uploadBrokenImageUrl: async function (url) {
    await logger.logInto(await stackTrace.get(), "uploadBrokenImageUrl=" + url);
    await action.click(this.imageUrlInput);
    await action.clearValue(this.imageUrlInput);
    var res = await action.addValue(this.imageUrlInput, url);
    // Explicit all-false shape on the early exit so callers' assertions fail with the real
    // reason (URL was never typed) instead of comparing against undefined fields.
    if (true !== res) return { placeholderIcon: false, realImg: false, errorShown: false };
    await action.keyPress("Enter");
    var icon = await action.waitForDisplayed(this.imagePlaceholderIcon, 15000);
    return {
      placeholderIcon: true === icon,
      realImg: (await action.isExisting(this.imagePreview)) === true,
      errorShown: (await action.isExisting(this.imageErrorText)) === true
    };
  },

  // Types the URL WITHOUT confirming (no Enter) to prove the preview does not auto-load while the
  // user is still typing (CF-IMG-003 / CF-UX-001). Returns { previewShown }. Settles briefly first —
  // if a preview were going to auto-load it would have by then.
  typeImageUrlWithoutConfirm: async function (url) {
    await logger.logInto(await stackTrace.get(), "typeImageUrlWithoutConfirm=" + url);
    await action.click(this.imageUrlInput);
    await action.clearValue(this.imageUrlInput);
    await action.addValue(this.imageUrlInput, url);
    await browser.pause(2500);
    return { previewShown: (await action.isExisting(this.imagePreview)) === true };
  },

  // Confirms the URL previously typed by typeImageUrlWithoutConfirm (presses Enter in the field)
  // and waits for the preview to render. Returns { previewStatus }.
  confirmTypedImageUrl: async function () {
    await logger.logInto(await stackTrace.get());
    await action.click(this.imageUrlInput);
    var res = await action.keyPress("Enter");
    if (true !== res) return { previewStatus: res };
    res = await action.waitForDisplayed(this.imagePreview, 30000);
    return { previewStatus: true === res };
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

  // Uploads a file expected to be REJECTED (e.g. a non-image). Confirms the inline error renders
  // and that NO preview appears. Returns { errorShown, message, previewShown }.
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

  // Removes the currently-previewed image (the "Remove" button shown once a preview renders).
  // Confirms the preview detaches and the URL/upload control returns. Returns
  // { removeStatus, uploadControlBack }.
  removeImage: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForDisplayed(this.imageRemoveBtn, 10000);
    if (true !== res) return { removeStatus: res };
    res = await action.click(this.imageRemoveBtn);
    if (true !== res) return { removeStatus: res };
    // Preview <img> should detach; reverse=true waits for it to be hidden/gone.
    res = await action.waitForDisplayed(this.imagePreview, 10000, true);
    if (true !== res) return { removeStatus: false };
    return { removeStatus: true, uploadControlBack: (await action.isExisting(this.imageUrlInput)) === true };
  }
};
