"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
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

module.exports = {
  searchInput:  sel.families.searchInput,
  codeInput:    sel.families.codeInput,
  titleInput:   sel.families.titleInput,
  saveBtn:      sel.families.saveBtn,
  deleteBtn:    sel.families.deleteBtn,
  itemLink:     sel.families.itemLink,

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
    await action.click(this.codeInput);
    var res = await action.setValue(this.codeInput, code);
    return { fillStatus: true === res };
  },

  fillFamilyTitle: async function (title) {
    await logger.logInto(await stackTrace.get());
    await action.click(this.titleInput);
    var res = await action.setValue(this.titleInput, title);
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
    var res = await action.waitForEnabled(this.saveBtn, 15000);
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
    if (!code) {
      await browser.url("/2024/families");
      await action.waitForDocumentLoad();
      return { saveStatus: true };
    }
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
    var hasTextarea = await action.isExisting("[role='dialog'] textarea");
    if (hasTextarea === true) {
      await action.addValue("[role='dialog'] textarea", "Deleting family to free code for component clone.");
      await browser.pause(300);
    }
    var confirmExists = await action.isExisting("[role='dialog'] button:has-text('Confirm')");
    if (confirmExists === true) {
      await action.waitForEnabled("[role='dialog'] button:has-text('Confirm')", 10000);
      await action.click("[role='dialog'] button:has-text('Confirm')");
      // Wait before evaluating the close — the slow backend needs a moment to accept the delete.
      await browser.pause(3000);
      await action.waitForExist("[role='dialog']", 30000, true);
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
    var exists = await action.isExisting("a[href='javascript:void(0)']:has-text('" + title + "')");
    return { found: exists === true };
  }
};
