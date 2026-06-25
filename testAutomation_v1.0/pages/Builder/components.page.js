"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

var sel = selectorFile.css.Builder;

module.exports = {
  searchInput:      sel.components.searchInput,
  kebabBtn:         sel.components.kebabBtn,
  cloneMenuItem:    sel.components.cloneMenuItem,
  deleteMenuItem:   sel.components.deleteMenuItem,
  itemLink:         sel.components.itemLink,
  itemLinkByText:   sel.components.itemLinkByText,
  cardByText:       sel.components.cardByText,
  dialog:           sel.cloneModal.dialog,
  codeInput:        sel.cloneModal.uniqueCodeInput,
  titleInput:       sel.cloneModal.titleInput,
  visibleInputs:    sel.cloneModal.visibleInputs,
  okBtn:            sel.cloneModal.okBtn,
  cancelBtn:        sel.cloneModal.cancelBtn,
  closeBtn:         sel.cloneModal.closeBtn,
  errorMsg:         sel.cloneModal.errorMsg,
  delCommentInput:  sel.deleteModal.commentInput,
  delConfirmBtn:    sel.deleteModal.confirmBtn,

  // Builds a concrete selector from a JSON "{text}" template by injecting a dynamic value
  // (item code/title). Keeps all selector syntax in the selector file (Rule 2) while still
  // allowing per-item lookups. Pure string substitution — no DOM interaction.
  _byText: function (template, text) {
    return template.split("{text}").join(text);
  },

  // Best-effort cleanup run between tests (BeforeEach): if a previous test left a clone/delete
  // modal open (e.g. it failed mid-flow), dismiss it so it doesn't block the next test's
  // interactions. Safe to call when nothing is open (no-op) and before login (no dialog yet).
  dismissAnyModal: async function () {
    await logger.logInto(await stackTrace.get());
    try {
      var hasDialog = await action.isExisting(this.dialog);
      if (hasDialog === true) {
        await action.keyPress("Escape");
        await browser.pause(300);
        await action.keyPress("Escape");
        await browser.pause(300);
      }
    } catch (e) { /* best-effort — never fail a test on cleanup */ }
    return { resetStatus: true };
  },

  navigateTo: async function () {
    await logger.logInto(await stackTrace.get());
    await browser.url("/2024/components");
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

    // Hover the item to reveal its kebab (the action library scrolls into view + hovers centre).
    await action.hoverCenter(this.itemLink);
    await browser.pause(600);
    var res2 = await action.waitForDisplayed(this.kebabBtn, 5000);
    if (true !== res2) return { menuStatus: false };
    // Builder disables the kebab on a newly cloned/updated item while it finishes processing.
    // Wait for the app to re-enable it naturally (collaborative sync can take a while) rather than
    // forcing el.disabled=false — forcing defeats the intentional lock and risks clicking before
    // the item is actually ready, which is flaky and not a faithful user interaction.
    var enabled = await action.waitForEnabled(this.kebabBtn, 60000);
    if (true !== enabled) return { menuStatus: false };
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
    // CSS :nth-of-type(2) fails when inputs are in separate wrapper divs, so target the 2nd
    // visible <input> in the dialog by DOM order via the action library's kth-element helper.
    var titleLoc = await action.getKthElement(this.visibleInputs, 1);
    await action.clearValue(titleLoc);
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
    // Slow/collaborative backend: give the submit time to register before the caller evaluates
    // whether the modal closed (success) or an inline error appeared — don't rush the close.
    await browser.pause(3000);
    return { submitStatus: true === res };
  },

  waitForCloneSuccess: async function () {
    await logger.logInto(await stackTrace.get());
    // Builder is a slow, collaborative authoring app — cloning triggers heavy backend syncing,
    // so the dialog can stay open for a while before it closes on success. Allow up to 60s.
    var res = await action.waitForExist(this.dialog, 60000, true);
    if (true === res) {
      // After a successful clone the backend keeps syncing — wait, then refresh so the new
      // item is actually materialised in the listing before any follow-up check.
      await browser.pause(8000);
      await browser.refresh();
      await action.waitForDocumentLoad();
      return { cloneStatus: true };
    }
    // Dialog still open — wait for inline error (server response can take several seconds).
    // An inline error means the clone did NOT succeed: report failure (errorShown) so callers
    // are not given a false success. Negative-path TCs check errors via isErrorVisible directly.
    var errorVisible = await action.waitForDisplayed(this.errorMsg, 8000);
    if (errorVisible === true) {
      await this.cancelClone();
      return { cloneStatus: false, errorShown: true };
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
    // Returns { loaded, found }. `loaded` is false if the search box never rendered — a transient
    // page/search load failure must NOT be reported as "not found", otherwise an absence check
    // would falsely confirm a deletion that never happened.
    async function checkOnce() {
      await browser.url("/2024/components");
      await action.waitForDocumentLoad();
      var loaded = await action.waitForDisplayed(self.searchInput, 20000);
      if (true !== loaded) return { loaded: false, found: false };
      await action.click(self.searchInput);
      await action.setValue(self.searchInput, searchTerm);
      await action.keyPress("Enter");
      await browser.pause(2000);
      var found = await action.isExisting(self._byText(self.itemLinkByText, searchTerm));
      return { loaded: true, found: found === true };
    }

    var probe = await checkOnce();
    await logger.logInto(await stackTrace.get(), "isInListing found=" + probe.found + " loaded=" + probe.loaded + " searchTerm=" + searchTerm);

    // When verifying absence after deletion: poll to allow async server propagation.
    if (checkAbsence) {
      // Keep polling while the item is still present OR the listing was inconclusive (didn't load).
      // Builder's delete is async with heavy collaborative syncing — an item can linger in the
      // listing for a while after deletion, so poll generously (6 × 10s ≈ up to 90s with reloads).
      var attempts = 0;
      while ((probe.found || !probe.loaded) && attempts < 6) {
        await logger.logInto(await stackTrace.get(), "isInListing inconclusive/still-found, retrying in 10s (attempt " + (attempts + 1) + ")");
        await browser.pause(10000);
        probe = await checkOnce();
        attempts++;
      }
      await logger.logInto(await stackTrace.get(), "isInListing found=" + probe.found + " loaded=" + probe.loaded + " after absence polling for code=" + code);
      // Never confirm absence off a listing that failed to load — fail safe by reporting present.
      if (!probe.loaded) return { found: true };
    }

    return { found: probe.found };
  },

  // Probes the listing for an item by title and reports whether it is present AND whether the card
  // still shows a "Cloning" (in-progress) state. A freshly cloned item appears in the list while
  // still cloning, and its kebab → Delete is not usable until cloning COMPLETES.
  _probeListing: async function (searchTerm) {
    await browser.url("/2024/components");
    await action.waitForDocumentLoad();
    var loaded = await action.waitForDisplayed(this.searchInput, 20000);
    if (true !== loaded) return { present: false, cloning: false, loaded: false };
    await action.click(this.searchInput);
    await action.setValue(this.searchInput, searchTerm);
    await action.keyPress("Enter");
    await browser.pause(2000);
    var cardSel = this._byText(this.cardByText, searchTerm);
    var present = await action.isExisting(cardSel);
    if (present !== true) return { present: false, cloning: false, loaded: true };
    // The card status shows "Clone in Progress" while still cloning, then changes to
    // "Work In progress" once cloning completes. Match ONLY the clone-in-progress state —
    // "Work In progress" also contains "in progress", so a broad match would never go ready.
    var txt = await action.getText(cardSel);
    var cloning = typeof txt === "string" && /clone\s*in\s*progress/i.test(txt);
    return { present: true, cloning: cloning, loaded: true };
  },

  // Waits until a cloned item is present AND has finished cloning, BEFORE a delete is attempted.
  // Mirrors the manual flow: refresh every 10s until the item appears, then keep refreshing every
  // 10s (up to a few more times) until it leaves the "Cloning" state — otherwise the delete races
  // an item whose kebab/Delete action is not ready yet ("Delete modal did not open"). A couple of
  // settle refreshes are always done after it looks ready, since cloning completion lags the UI.
  waitForInListing: async function (code, searchHint) {
    await logger.logInto(await stackTrace.get(), "waitForInListing=" + code);
    var searchTerm = searchHint || code;
    var ready = false;
    for (var attempt = 1; attempt <= 12 && !ready; attempt++) {
      var p = await this._probeListing(searchTerm);
      ready = p.present === true && p.cloning === false;
      await logger.logInto(await stackTrace.get(), "waitForInListing present=" + p.present + " cloning=" + p.cloning + " (attempt " + attempt + ")");
      if (!ready) await browser.pause(10000);
    }
    if (!ready) return { found: false };
    // Settle: a couple more refreshes (10s apart) so cloning is genuinely complete before the delete.
    for (var s = 0; s < 2; s++) {
      await browser.pause(10000);
      await this._probeListing(searchTerm);
    }
    return { found: true };
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
    // Wait before evaluating the close — the slow backend needs a moment to accept the delete.
    await browser.pause(3000);
    res = await action.waitForExist(sel.deleteModal.dialog, 30000, true);
    if (true !== res) return { deleteStatus: false };
    // Deletion keeps syncing after the modal closes — wait, then refresh so the listing reflects it.
    await browser.pause(8000);
    await browser.refresh();
    await action.waitForDocumentLoad();
    return { deleteStatus: true };
  }
};
