"use strict";

// [2026-07-15] Core action library used for all DOM interactions.
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
// Lazy require or standard require for eBook page object navigation helper
var eBookPage = require("./eBook.page.js");

module.exports = {
  // Focus targets on pages
  noteIconOnPage: selectorFile.css.ComproC1.eBook.noteIconOnPage,
  hotlinkIconOnPage: selectorFile.css.ComproC1.eBook.hotlinkIconOnPage,
  notesCloseBtn: selectorFile.css.ComproC1.notes.notesCloseBtn,
  eBookNotesHeadingTxt: selectorFile.css.ComproC1.notes.eBookNotesHeadingTxt,
  homeButton: selectorFile.css.ComproC1.eBook.homeButton,
  pageNOShow: selectorFile.css.ComproC1.pageNoDialogBox.pageNOShow,
  readerOuterContainer: selectorFile.css.ComproC1.eBook.readerOuterContainer,


  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.homeButton, 60000),
    };
    return res;
  },

  /**
   * [2026-07-28] Navigates to a specific page number by delegating to eBook.page.js.
   * Enables test cases to trigger page navigation without importing baseActionLibrary.
   */
  goToPage: async function (pageNumber) {
    await logger.logInto(await stackTrace.get(), "goToPage called for page: " + pageNumber);
    return await eBookPage.goToPage(pageNumber);
  },

  resetFocusToReader: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.focus(this.readerOuterContainer);
  },

  pressTab: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.pressTab();
  },

  pressShiftTab: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.pressShiftTab();
  },

  pressEnter: async function (selectorName) {
    await logger.logInto(await stackTrace.get(), "press Enter on selector: " + selectorName);
    const sel = this[selectorName];
    return await action.pressEnter(sel);
  },

  assertFocusOn: async function (selectorName, message) {
    await logger.logInto(await stackTrace.get(), "assert focus on: " + selectorName);
    const sel = this[selectorName];
    return await action.assertFocusOn(sel, message);
  },

  assertPanelVisible: async function (selectorName, message) {
    await logger.logInto(await stackTrace.get(), "assert panel visible: " + selectorName);
    const sel = this[selectorName];
    return await action.assertPanelVisible(sel, message);
  },

  assertPanelClosed: async function (selectorName, message) {
    await logger.logInto(await stackTrace.get(), "assert panel closed: " + selectorName);
    const sel = this[selectorName];
    return await action.assertPanelClosed(sel, message);
  },

  assertOnPage: async function (expectedPage, message) {
    await logger.logInto(await stackTrace.get(), "assert current page is: " + expectedPage);
    return await action.assertOnPage(this.pageNOShow, expectedPage, message);
  },

  waitForNoteOnPage: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.waitForDisplayed(this.noteIconOnPage, 10000);
  },

  waitForHotlinkOnPage: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.waitForDisplayed(this.hotlinkIconOnPage, 10000);
  },

};
