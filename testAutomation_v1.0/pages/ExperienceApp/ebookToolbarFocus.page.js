"use strict";

// [2026-07-27] Core action library used for eBook Toolbar Keyboard Focus accessibility.
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var eBookPage = require("./eBook.page.js");

module.exports = {
  // Toolbar focus target selectors
  homeButton: selectorFile.css.ComproC1.eBook.homeButton,
  contentButton: selectorFile.css.ComproC1.eBook.contentButton,
  toolsButton: selectorFile.css.ComproC1.eBook.toolsButton,
  previousPage: selectorFile.css.ComproC1.eBook.previousPage,
  nextPage: selectorFile.css.ComproC1.eBook.nextPage,
  toggleLayoutBtn: selectorFile.css.ComproC1.eBook.toggleLayoutBtnFocus,
  changeCourseMaterialBtn: selectorFile.css.ComproC1.eBook.changeCourseMaterialBtn,
  moveToolbarBtn: selectorFile.css.ComproC1.eBook.moveToolbarBtn,
  drawingTool: selectorFile.css.ComproC1.eBook.drawingTool,
  showAndHideSelection: selectorFile.css.ComproC1.eBook.showAndHideSelection,
  timer: selectorFile.css.ComproC1.eBook.timer,
  zoomOutBtn: selectorFile.css.ComproC1.eBook.zoomOutBtn,
  zoomInBtn: selectorFile.css.ComproC1.eBook.zoomInBtn,
  fitToScreenBtn: selectorFile.css.ComproC1.eBook.fitToScreenBtn,
  fitToWidthBtn: selectorFile.css.ComproC1.eBook.fitToWidthBtnFocus,
  fitToHeightBtn: selectorFile.css.ComproC1.eBook.fitToHeightBtnFocus,
  pageNumber: selectorFile.css.ComproC1.eBook.pageLabelBtn,
  pageNavigateButton: selectorFile.css.ComproC1.eBook.pageNavigateBtn,
  toolbarStatusBtn: selectorFile.css.ComproC1.eBook.toolbarStatusBtn,
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

  click: async function (selectorName) {
    await logger.logInto(await stackTrace.get(), "click selector: " + selectorName);
    const sel = this[selectorName];
    return await action.click(sel);
  },

  pressEnter: async function (selectorName, keyName) {
    await logger.logInto(await stackTrace.get(), "press Enter on selector: " + selectorName);
    const sel = this[selectorName];
    try {
      const focusRes = await action.focus(sel);
      if (focusRes instanceof Error) throw focusRes;
      await browser.pause(500);
      // Delegating the enter keyboard press to pressKeyboardKey after focus and wait
      const res = await action.pressKeyboardKey(keyName);
      if (res instanceof Error) throw res;
      return true;
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      return err;
    }
  },

  closePageNumberPopover: async function () {
    // Encapsulates page evaluate popover-closure logic so class selectors are kept out of test files
    await logger.logInto(await stackTrace.get());
    return await global.page.evaluate(() => {
      const popovers = document.querySelectorAll(".page-number-dropdown, .popover, .dropdown-menu");
      popovers.forEach(el => el.classList.remove("show"));
    });
  },

  assertFocusOnHome: async function (message) {
    // Assert focus on homeButton imported from c1selector
    return await action.assertFocusOn(this.homeButton, message);
  },

  assertFocusOnContent: async function (message) {
    // Assert focus on contentButton imported from c1selector
    return await action.assertFocusOn(this.contentButton, message);
  },

  assertFocusOnTools: async function (message) {
    // Assert focus on toolsButton imported from c1selector
    return await action.assertFocusOn(this.toolsButton, message);
  },

  assertFocusOnZoomOut: async function (message) {
    // Assert focus on zoomOutBtn imported from c1selector
    return await action.assertFocusOn(this.zoomOutBtn, message);
  },

  assertFocusOnZoomIn: async function (message) {
    // Assert focus on zoomInBtn imported from c1selector
    return await action.assertFocusOn(this.zoomInBtn, message);
  },

  assertFocusOnFitToHeight: async function (message) {
    // Assert focus on fitToHeightBtn imported from c1selector
    return await action.assertFocusOn(this.fitToHeightBtn, message);
  },

  assertFocusOnPageNumber: async function (message) {
    // Assert focus on pageNumber button imported from c1selector
    return await action.assertFocusOn(this.pageNumber, message);
  },

  assertFocusOnPreviousPage: async function (message) {
    // Assert focus on previousPage button imported from c1selector
    return await action.assertFocusOn(this.previousPage, message);
  },

  assertFocusOnTOCButton: async function (message) {
    // Assert focus on pageNavigateButton imported from c1selector
    return await action.assertFocusOn(this.pageNavigateButton, message);
  },

  assertFocusOnNextPage: async function (message) {
    // Assert focus on nextPage button imported from c1selector
    return await action.assertFocusOn(this.nextPage, message);
  },

  assertFocusOnSinglePageView: async function (message) {
    // Assert focus on toggleLayoutBtn imported from c1selector
    return await action.assertFocusOn(this.toggleLayoutBtn, message);
  },

  assertFocusOnChangeCourseMaterial: async function (message) {
    // Assert focus on changeCourseMaterialBtn imported from c1selector
    return await action.assertFocusOn(this.changeCourseMaterialBtn, message);
  },

  assertFocusOnMoveToolbar: async function (message) {
    // Assert focus on moveToolbarBtn imported from c1selector
    return await action.assertFocusOn(this.moveToolbarBtn, message);
  },

  assertFocusOnToolbarStatus: async function (message) {
    // Assert focus on toolbarStatusBtn imported from c1selector
    return await action.assertFocusOn(this.toolbarStatusBtn, message);
  },

  assertOnPage: async function (expectedPage, message) {
    await logger.logInto(await stackTrace.get(), "assert current page is: " + expectedPage);
    return await action.assertOnPage(this.pageNOShow, expectedPage, message);
  }
};
