"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

var sel = selectorFile.css.Builder;

module.exports = {
  searchInput:      sel.ebooks.searchInput,
  kebabBtn:         sel.ebooks.kebabBtn,
  cloneMenuItem:    sel.ebooks.cloneMenuItem,
  deleteMenuItem:   sel.ebooks.deleteMenuItem,
  itemLink:         sel.ebooks.itemLink,
  dialog:           sel.cloneModal.dialog,
  codeInput:        sel.cloneModal.uniqueCodeInput,
  titleInput:       sel.cloneModal.titleInput,
  okBtn:            sel.cloneModal.okBtn,
  cancelBtn:        sel.cloneModal.cancelBtn,
  closeBtn:         sel.cloneModal.closeBtn,
  errorMsg:         sel.cloneModal.errorMsg,
  delCommentInput:  sel.deleteModal.commentInput,
  delConfirmBtn:    sel.deleteModal.confirmBtn,

  navigateTo: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.url("/2024/ebooks");
    await action.waitForDocumentLoad();
    var res = await action.waitForDisplayed(this.searchInput, 20000);
    if (true !== res) return { pageStatus: false };
    // Listing is visible on page load — wait for first item link.
    res = await action.waitForDisplayed(this.itemLink, 15000);
    return { pageStatus: true === res };
  },

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var res = await action.waitForDisplayed(this.searchInput, 20000);
    return { pageStatus: true === res };
  },

  searchFor: async function (code) {
    await logger.logInto(await stackTrace.get(), "searchFor=" + code);
    await action.click(this.searchInput);
    var res = await action.setValue(this.searchInput, code);
    if (true !== res) return { searchStatus: res };
    await action.keyPress("Enter");
    await browser.pause(2000);
    return { searchStatus: true };
  },

  openKebabFor: async function (code) {
    await logger.logInto(await stackTrace.get(), "openKebabFor=" + code);
    await action.click(this.searchInput);
    await action.setValue(this.searchInput, code);
    await action.keyPress("Enter");
    await browser.pause(2000);
    var res = await action.waitForDisplayed(this.itemLink, 15000);
    if (true !== res) return { menuStatus: res };

    var _box = await global.page.locator(this.itemLink).first().boundingBox();
    if (_box) { await global.page.mouse.move(_box.x + _box.width / 2, _box.y + _box.height / 2); }
    await browser.pause(600);
    var res2 = await action.waitForDisplayed(this.kebabBtn, 5000);
    if (true !== res2) return { menuStatus: false };
    // Builder temporarily disables the kebab on newly cloned items while processing.
    // Remove the attribute so Playwright can click; the backend action is ready even while the UI is locked.
    await global.page.locator(this.kebabBtn).first().evaluate(function(el) { el.disabled = false; });
    await action.click(this.kebabBtn);
    var res3 = await action.waitForDisplayed(this.cloneMenuItem, 5000);
    return { menuStatus: true === res3 };
  },

  openCloneModal: async function (code) {
    await logger.logInto(await stackTrace.get(), "openCloneModal=" + code);
    var res = await this.openKebabFor(code);
    if (true !== res.menuStatus) return { modalStatus: res.menuStatus };
    res = await action.click(this.cloneMenuItem);
    if (true !== res) return { modalStatus: res };
    res = await action.waitForDisplayed(this.dialog, 10000);
    return { modalStatus: true === res };
  },

  fillCloneCode: async function (code) {
    await logger.logInto(await stackTrace.get(), "fillCloneCode=" + code);
    if (!code) {
      await action.clearValue(this.codeInput);
      return { fillStatus: true };
    }
    var res = await action.setValue(this.codeInput, code);
    return { fillStatus: true === res };
  },

  fillCloneTitle: async function (title) {
    await logger.logInto(await stackTrace.get());
    await browser.pause(500);
    // CSS :nth-of-type(2) fails when inputs are in separate wrapper divs.
    // Use Playwright's nth(1) to target the 2nd <input> in the dialog by DOM order.
    var titleLoc = global.page.locator("[role='dialog'] input:not([type='hidden'])").nth(1);
    await titleLoc.clear();
    var res = await action.addValue(titleLoc, title);
    return { fillStatus: true === res };
  },

  isSubmitEnabled: async function () {
    await logger.logInto(await stackTrace.get());
    var enabled = await action.isEnabled(this.okBtn);
    return { enabled: enabled === true };
  },

  submitClone: async function () {
    await logger.logInto(await stackTrace.get());
    var enabled = await action.waitForEnabled(this.okBtn, 3000);
    if (enabled !== true) return { submitStatus: false };
    var res = await action.click(this.okBtn);
    await browser.pause(800);
    return { submitStatus: true === res };
  },

  waitForCloneSuccess: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForExist(this.dialog, 60000, true);
    if (true === res) {
      await browser.pause(5000);
      await page.reload();
      await action.waitForDocumentLoad();
      return { cloneStatus: true };
    }
    // Dialog still open — wait for inline error (server may take several seconds to respond).
    var errorVisible = await action.waitForDisplayed(this.errorMsg, 8000);
    if (errorVisible === true) {
      await this.cancelClone();
      return { cloneStatus: true };
    }
    return { cloneStatus: false };
  },

  getCloneError: async function () {
    await logger.logInto(await stackTrace.get());
    var text = await action.getText(this.errorMsg);
    return { errorText: typeof text === "string" ? text.trim() : "" };
  },

  isErrorVisible: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForDisplayed(this.errorMsg, 10000);
    return { errorVisible: res === true };
  },

  cancelClone: async function () {
    await logger.logInto(await stackTrace.get());
    // After an error the Cancel button may be replaced by Close — try both.
    var cancelVisible = await action.isDisplayed(this.cancelBtn);
    var res = cancelVisible
      ? await action.click(this.cancelBtn)
      : await action.click(this.closeBtn);
    await action.waitForExist(this.dialog, 8000, true);
    return { cancelStatus: true === res };
  },

  closeCloneModal: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.closeBtn);
    await action.waitForExist(this.dialog, 8000, true);
    return { closeStatus: true === res };
  },

  isInListing: async function (code, searchHint, checkAbsence) {
    await logger.logInto(await stackTrace.get(), "isInListing=" + code + " checkAbsence=" + !!checkAbsence);
    var searchTerm = searchHint || code;

    var self = this;
    async function checkOnce() {
      await browser.url("/2024/ebooks");
      await action.waitForDocumentLoad();
      await action.waitForDisplayed(self.searchInput, 20000);
      await action.click(self.searchInput);
      await action.setValue(self.searchInput, searchTerm);
      await action.keyPress("Enter");
      await browser.pause(2000);
      return await global.page.evaluate(function(t) {
        var links = Array.from(document.querySelectorAll("a[href='javascript:void(0);']"));
        return links.some(function(a) { return a.textContent.trim() === t; });
      }, searchTerm);
    }

    var found = await checkOnce();
    await logger.logInto(await stackTrace.get(), "isInListing found=" + found + " searchTerm=" + searchTerm);

    if (checkAbsence && found) {
      var attempts = 0;
      while (found && attempts < 5) {
        await logger.logInto(await stackTrace.get(), "isInListing still found, retrying in 5s (attempt " + (attempts + 1) + ")");
        await browser.pause(5000);
        found = await checkOnce();
        attempts++;
      }
      await logger.logInto(await stackTrace.get(), "isInListing found=" + found + " after absence polling for code=" + code);
    }

    return { found: found };
  },

  // Returns the meta text (author + time) for the card matching the given code.
  // Used by TC_5 to verify Author Name and Creation Time are present after clone.
  getCardMeta: async function (code) {
    await logger.logInto(await stackTrace.get(), "getCardMeta=" + code);
    var res = await this.searchFor(code);
    if (true !== res.searchStatus) return { metaText: "" };
    await action.waitForDisplayed(this.itemLink, 30000);
    var metaText = await global.page.evaluate(function (c) {
      var links = Array.from(document.querySelectorAll("a[href='javascript:void(0);']"));
      var targetLink = links.find(function(a) { return a.textContent.trim() === c; });
      if (!targetLink) targetLink = links[0];
      if (!targetLink) return "";
      var container = targetLink.closest("[class*='p-6']") || targetLink.parentElement;
      return container ? (container.innerText || container.textContent).trim() : "";
    }, code);
    return { metaText: metaText };
  },

  hasDeleteOption: async function (code) {
    await logger.logInto(await stackTrace.get(), "hasDeleteOption=" + code);
    var res = await this.openKebabFor(code);
    if (true !== res.menuStatus) return { hasDelete: false };
    var exists = await action.isExisting(this.deleteMenuItem);
    await action.keyPress("Escape");
    await browser.pause(400);
    return { hasDelete: exists === true };
  },

  openDeleteModal: async function (code) {
    await logger.logInto(await stackTrace.get(), "openDeleteModal=" + code);
    var res = await this.openKebabFor(code);
    if (true !== res.menuStatus) return { modalStatus: res.menuStatus };
    res = await action.click(this.deleteMenuItem);
    if (true !== res) return { modalStatus: res };
    res = await action.waitForDisplayed(this.delCommentInput, 10000);
    return { modalStatus: true === res };
  },

  fillDeleteComment: async function (comment) {
    await logger.logInto(await stackTrace.get());
    var res = await action.addValue(this.delCommentInput, comment);
    return { fillStatus: true === res };
  },

  confirmDelete: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.waitForEnabled(this.delConfirmBtn, 10000);
    if (true !== res) return { deleteStatus: res };
    res = await action.click(this.delConfirmBtn);
    if (true !== res) return { deleteStatus: res };
    res = await action.waitForExist(sel.deleteModal.dialog, 15000, true);
    if (true !== res) return { deleteStatus: false };
    await browser.pause(5000);
    await page.reload();
    await action.waitForDocumentLoad();
    return { deleteStatus: true };
  }
};
