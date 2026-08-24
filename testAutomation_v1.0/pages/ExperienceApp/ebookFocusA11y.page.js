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

  pressTab: async function (keyName) {
    await logger.logInto(await stackTrace.get());
    // Delegating to baseActionLibrary.pressKeyboardKey to avoid hardcoded Tab keys
    return await action.pressKeyboardKey(keyName);
  },

  pressShiftTab: async function (keyName) {
    await logger.logInto(await stackTrace.get());
    // Delegating to baseActionLibrary.pressKeyboardKey to avoid hardcoded Shift+Tab keys
    return await action.pressKeyboardKey(keyName);
  },

  pressEnterOnNote: async function (keyName) {
    // Wrapper to perform dynamic Enter press on note icon avoiding selector leaking to test case
    try {
      const focusRes = await action.focus(this.noteIconOnPage);
      if (focusRes instanceof Error) throw focusRes;
      await browser.pause(500);
      const res = await action.pressKeyboardKey(keyName);
      if (res instanceof Error) throw res;
      return true;
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      return err;
    }
  },

  pressEnterOnNotesClose: async function (keyName) {
    // Wrapper to perform dynamic Enter press on note close button avoiding selector leaking to test case
    try {
      const focusRes = await action.focus(this.notesCloseBtn);
      if (focusRes instanceof Error) throw focusRes;
      await browser.pause(500);
      const res = await action.pressKeyboardKey(keyName);
      if (res instanceof Error) throw res;
      return true;
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      return err;
    }
  },

  pressEnterOnHotlink: async function (keyName) {
    // Wrapper to perform dynamic Enter press on hotlink icon avoiding selector leaking to test case
    try {
      const focusRes = await action.focus(this.hotlinkIconOnPage);
      if (focusRes instanceof Error) throw focusRes;
      await browser.pause(500);
      const res = await action.pressKeyboardKey(keyName);
      if (res instanceof Error) throw res;
      return true;
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      return err;
    }
  },

  assertFocusOnNote: async function (message) {
    // Assert focus on noteIconOnPage imported from c1selector
    return await action.assertFocusOn(this.noteIconOnPage, message);
  },

  assertFocusOnHome: async function (message) {
    // Assert focus on homeButton imported from c1selector
    return await action.assertFocusOn(this.homeButton, message);
  },

  assertFocusOnHotlink: async function (message) {
    // Assert focus on hotlinkIconOnPage imported from c1selector
    return await action.assertFocusOn(this.hotlinkIconOnPage, message);
  },

  assertNotesPanelVisible: async function (message) {
    // Assert notes panel is visible by checking eBookNotesHeadingTxt from c1selector
    return await action.assertPanelVisible(this.eBookNotesHeadingTxt, message);
  },

  assertNotesPanelClosed: async function (message) {
    // Assert notes panel is closed by checking eBookNotesHeadingTxt from c1selector
    return await action.assertPanelClosed(this.eBookNotesHeadingTxt, message);
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
