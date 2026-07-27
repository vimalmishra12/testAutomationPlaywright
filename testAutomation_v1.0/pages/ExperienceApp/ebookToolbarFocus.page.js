"use strict";

// [2026-07-27] Core action library used for eBook Toolbar Keyboard Focus accessibility.
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

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

  click: async function (selectorName) {
    await logger.logInto(await stackTrace.get(), "click selector: " + selectorName);
    const sel = this[selectorName];
    return await action.click(sel);
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

  assertOnPage: async function (expectedPage, message) {
    await logger.logInto(await stackTrace.get(), "assert current page is: " + expectedPage);
    return await action.assertOnPage(this.pageNOShow, expectedPage, message);
  }
};
