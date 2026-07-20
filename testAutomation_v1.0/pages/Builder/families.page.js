"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var imageControl = require("./imageControl.js"); // shared "Product Logo" image-control methods (see below)
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

var sel = selectorFile.css.Builder;

// Fallback only: derive a display title from a code when the caller does not pass the
// actual title used at creation (e.g. "family_comp_01" → "Family Comp 01"). Callers that
// know the real title (the tests do) should pass it so search matches what was saved.
function deriveTitle(code) {
  return code.split("_").map(function (w) {
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(" ");
}

module.exports = Object.assign({
  searchInput:     sel.families.searchInput,
  codeInput:       sel.families.codeInput,
  titleInput:      sel.families.titleInput,
  saveBtn:         sel.families.saveBtn,
  deleteBtn:       sel.families.deleteBtn,
  itemLink:        sel.families.itemLink,
  itemLinkByText:  sel.families.itemLinkByText,
  dialog:          sel.deleteModal.dialog,
  delCommentInput: sel.deleteModal.commentInput,
  delConfirmBtn:   sel.deleteModal.confirmBtn,

  // Create-Family "Product Logo" image section (captured live on Thor 2026-07-02).
  imageFileInput:  sel.families.imageFileInput,
  imageUrlInput:   sel.families.imageUrlInput,
  imagePreview:    sel.families.imagePreview,
  imagePlaceholderIcon: sel.families.imagePlaceholderIcon,
  imageRemoveBtn:  sel.families.imageRemoveBtn,
  imageErrorText:  sel.families.imageErrorText,
  detailSetupTab:  sel.families.detailSetupTab,
  listImageByText: sel.families.listItemImageByText,

  // Builds a concrete selector from a JSON "{text}" template by injecting a dynamic value
  // (family title). Keeps all selector syntax in the selector file (Rule 2). Pure string
  // substitution — no DOM interaction.
  _byText: function (template, text) {
    return template.split("{text}").join(text);
  },

  navigateTo: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.url("/2024/families");
    await action.waitForDocumentLoad();
    var res = await action.waitForDisplayed(this.searchInput, 20000);
    return { pageStatus: true === res };
  },

  navigateToCreate: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.url("/2024/families/create");
    await action.waitForDocumentLoad();
    var res = await action.waitForDisplayed(this.codeInput, 15000);
    return { pageStatus: true === res };
  },

  fillFamilyCode: async function (code) {
    await logger.logInto(await stackTrace.get(), "fillFamilyCode=" + code);
    // Target the VISIBLE code field (qa can render a hidden duplicate #uniqueCode that a plain
    // first()-match would type into, leaving the real field empty + Save disabled). Type char-by-char
    // (Angular ignores fill()) and VERIFY the value actually stuck, retrying — on qa the form is
    // sometimes not bound on first interaction so the first attempt silently fails.
    var loc = this.codeInput + ":visible";
    for (var attempt = 0; attempt < 3; attempt++) {
      await action.click(loc);
      await action.clearValue(loc);
      await action.addValue(loc, code);
      // Blur (Tab) so the form model COMMITS the code — manual entry tabs between fields; without it
      // the value shows in the DOM but the validation/Save-enable still treats the code as empty.
      await action.keyPress("Tab");
      await browser.pause(300);
      if ((await action.getValue(loc)) === code) return { fillStatus: true };
      await browser.pause(1000);
    }
    return { fillStatus: false };
  },

  fillFamilyTitle: async function (title) {
    await logger.logInto(await stackTrace.get());
    await action.click(this.titleInput);
    await action.clearValue(this.titleInput);
    var res = await action.addValue(this.titleInput, title);
    // Tab away from the title field to fire the blur/change events that enable the Save button.
    await action.keyPress("Tab");
    return { fillStatus: true === res };
  },

  // Saves the family. The required precondition for TC_19/TC_20 is that the family EXISTS
  // afterwards — whether it was newly created or already existed from a prior run. So the
  // "Save never enabled" and "no redirect" fallbacks confirm existence via isFamilyInListing
  // before reporting success, instead of blindly returning true (which masked real failures).
  // Pass the code+title actually used so the existence check searches for the right family.
  saveFamily: async function (code, title) {
    await logger.logInto(await stackTrace.get());
    // 30s (was 15s): qa is markedly slower to validate the form + enable Save after the fields fill.
    var res = await action.waitForEnabled(this.saveBtn, 30000);
    if (true !== res) {
      // Save button never enabled — code may already exist (inline validation error).
      await logger.logInto(await stackTrace.get(), "saveBtn not enabled — verifying family already exists");
      return await this._confirmSaved(code, title);
    }
    res = await action.click(this.saveBtn);
    if (true !== res) return { saveStatus: res };
    // Wait for URL to leave the create page. If it doesn't change (duplicate code),
    // fall through to the existence check — the family may already exist.
    try {
      await browser.waitUntil(
        async function () {
          return !(await browser.getUrl()).includes("/families/create");
        },
        { timeout: 15000, timeoutMsg: "family-create-no-redirect" }
      );
    } catch (e) {
      await logger.logInto(await stackTrace.get(), "no redirect after save — verifying family exists");
      return await this._confirmSaved(code, title);
    }
    await action.waitForDocumentLoad();
    return { saveStatus: true };
  },

  // Confirms a family exists in the listing; used by saveFamily's fallback branches so a
  // genuine creation failure is reported as saveStatus:false instead of a false success.
  // When no code is supplied (legacy call), preserve the old optimistic behaviour.
  _confirmSaved: async function (code, title) {
    // Always land on the families listing before searching — this fallback can be reached while
    // still on the create page (where #search does not exist), which would time out the search.
    await browser.url("/2024/families");
    await action.waitForDocumentLoad();
    if (!code) return { saveStatus: true };
    var res = await this.isFamilyInListing(code, title);
    return { saveStatus: res.found === true };
  },

  searchFor: async function (term) {
    await logger.logInto(await stackTrace.get(), "searchFor=" + term);
    await action.clearValue(this.searchInput);
    var res = await action.addValue(this.searchInput, term);
    if (true !== res) return { searchStatus: res };
    res = await action.keyPress("Enter");
    if (true !== res) return { searchStatus: res };
    // Families search re-queries the backend; give the slow/collaborative app time to render results.
    await browser.pause(2500);
    return { searchStatus: true };
  },

  // Deletes the family. Families search is title-based, so the caller must pass the SAME
  // title the family was created with (the tests set familyTitle = familyCode). If omitted,
  // we fall back to deriving a title from the code — but that only matches families whose
  // title happens to be the capitalized form of the code.
  // The delete dialog requires a comment before the Confirm button becomes enabled.
  deleteFamily: async function (code, title) {
    await logger.logInto(await stackTrace.get(), "deleteFamily=" + code);
    title = title || deriveTitle(code);
    var res = await this.searchFor(title);
    if (true !== res.searchStatus) return { deleteStatus: res.searchStatus };
    res = await action.waitForDisplayed(sel.families.deleteBtn, 10000);
    if (true !== res) return { deleteStatus: res };
    res = await action.click(sel.families.deleteBtn);
    if (true !== res) return { deleteStatus: res };
    await browser.pause(800);
    // Delete dialog requires a comment to enable the Confirm button.
    var hasTextarea = await action.isExisting(this.delCommentInput);
    if (hasTextarea === true) {
      await action.addValue(this.delCommentInput, "Deleting family to free code for component clone.");
      await browser.pause(300);
    }
    var confirmExists = await action.isExisting(this.delConfirmBtn);
    if (confirmExists === true) {
      await action.waitForEnabled(this.delConfirmBtn, 10000);
      await action.click(this.delConfirmBtn);
      // Wait before evaluating the close — the slow backend needs a moment to accept the delete.
      await browser.pause(3000);
      await action.waitForExist(this.dialog, 30000, true);
    }
    // Deletion keeps syncing after the modal closes — wait, then refresh so the listing reflects it.
    await browser.pause(8000);
    await browser.url("/2024/families");
    await action.waitForDocumentLoad();
    return { deleteStatus: true };
  },

  isFamilyInListing: async function (code, title) {
    await logger.logInto(await stackTrace.get(), "isFamilyInListing=" + code);
    title = title || deriveTitle(code);
    var res = await this.searchFor(title);
    if (true !== res.searchStatus) return { found: false };
    // Families listing uses void links (no semicolon) with link text = family title.
    var exists = await action.isExisting(this._byText(this.itemLinkByText, title));
    return { found: exists === true };
  },

  // ── "Product Logo" image selection (SHARED with Umbrella) ──────────────────────────────
  // The 8 image-control methods — uploadImageFromFile / uploadImageFromUrl / uploadBrokenImageUrl /
  // typeImageUrlWithoutConfirm / confirmTypedImageUrl / uploadImageFromUrlByBlur /
  // uploadFileExpectingError / removeImage — are IDENTICAL for Family and Umbrella (same #fileInput /
  // #imageUrl / preview / placeholder-icon / error / Remove component), so they live once in
  // ./imageControl.js and are mixed into this module via the Object.assign at the bottom of the file.
  // They operate on the imageFileInput / imageUrlInput / imagePreview / imagePlaceholderIcon /
  // imageErrorText / imageRemoveBtn / titleInput selectors declared above (Family's own namespace).
  // All captured live on Thor (2026-07-02).

  // ── Persisted-image verification (after Save) ──────────────────────────────────────────
  // Save redirects to the Families listing; these open the saved family and read the cover the
  // product actually stored — proving the image persisted, not just previewed in the form.

  // Opens the saved family's detail page, switches to the Setup tab (where the cover lives) and
  // returns the persisted cover image src. Returns { pageStatus, src }.
  openDetailSetup: async function (code) {
    await logger.logInto(await stackTrace.get(), "openDetailSetup=" + code);
    await browser.url("/2024/families/" + code);
    await action.waitForDocumentLoad();
    var tab = await action.waitForDisplayed(this.detailSetupTab, 20000);
    if (true !== tab) return { pageStatus: false };
    await action.click(this.detailSetupTab);
    var res = await action.waitForDisplayed(this.imagePreview, 20000);
    if (true !== res) return { pageStatus: false };
    return { pageStatus: true, src: await action.getAttribute(this.imagePreview, "src") };
  },

  // Opens the family's detail → Setup tab in EDIT mode and waits for the image control to be in the
  // upload state (the #imageUrl field present = no cover yet). Used to re-run the image-control cases
  // on the edit page. Returns { pageStatus }.
  openEditSetup: async function (code) {
    await logger.logInto(await stackTrace.get(), "openEditSetup=" + code);
    await browser.url("/2024/families/" + code);
    await action.waitForDocumentLoad();
    var tab = await action.waitForDisplayed(this.detailSetupTab, 20000);
    if (true !== tab) return { pageStatus: false };
    await action.click(this.detailSetupTab);
    var res = await action.waitForDisplayed(this.imageUrlInput, 20000);
    return { pageStatus: true === res };
  },

  // Reads the cover thumbnail the Families listing shows for a family (searches by title first).
  // Returns { found, src }. (Families list DOES render a per-item cover thumbnail — unlike Umbrella.)
  getListImage: async function (title) {
    await logger.logInto(await stackTrace.get(), "getListImage=" + title);
    // May be called from the family detail page (no #search there) — land on the listing first.
    await this.navigateTo();
    var res = await this.searchFor(title);
    if (true !== res.searchStatus) return { found: false };
    var selr = this._byText(this.listImageByText, title);
    var shown = await action.waitForDisplayed(selr, 15000);
    if (true !== shown) return { found: false };
    return { found: true, src: await action.getAttribute(selr, "src") };
  },

  // Confirms a family's listing thumbnail has actually left the listing after a delete. Builder's
  // delete is async with heavy collaborative syncing — an item can linger in the listing for a while
  // after the delete modal closes (product-knowledge.md: it "only leaves the listing after 2-3 page
  // refreshes"), so a single check can race the sync and false-fail cleanup. Re-navigate + search up
  // to `maxAttempts` times, 10s apart (mirrors the clone-suite absence poll), reporting gone:true only
  // once the thumbnail no longer renders.
  waitForListImageGone: async function (title, maxAttempts) {
    await logger.logInto(await stackTrace.get(), "waitForListImageGone=" + title);
    maxAttempts = maxAttempts || 6;
    for (var attempt = 1; attempt <= maxAttempts; attempt++) {
      if ((await this.getListImage(title)).found !== true) return { gone: true };
      await logger.logInto(await stackTrace.get(),
        "waitForListImageGone still present, retrying in 10s (attempt " + attempt + ")");
      if (attempt < maxAttempts) await browser.pause(10000);
    }
    return { gone: false };
  }
}, imageControl);
