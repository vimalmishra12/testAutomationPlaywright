"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

/**
 * Presentation Plus (FOC reader) — book-to-book PAGE MAPPING (module EMAP, agreed with the user 2026-09-25).
 * Source: "FOC-_Web_Mapping Cases.xlsx" (TC_FOCMap_web1 / web2). Captured live on thor 2026-09-25 — see
 * product-knowledge/ExperienceApp/foc-presentation-plus.md Part D.
 *
 * When the teacher changes book from the reader toolbar's "Change course material" dropdown, the reader opens the
 * target book on the page the mapping (defined in Builder) points to, or on its Cover when none is defined.
 * The reader keeps the current book and page in the address bar (.../studentbook/<bookId>/view?page=<page>), which
 * is the signal this page object waits on and reads back.
 */
module.exports = {
  // Resolves to C1Selectors.json → css.ComproC1.ebookMapping.*
  bookDropdownBtn: selectorFile.css.ComproC1.ebookMapping.bookDropdownBtn,
  selectedBookTitle: selectorFile.css.ComproC1.ebookMapping.selectedBookTitle,
  bookItemByTitle: selectorFile.css.ComproC1.ebookMapping.bookItemByTitle,
  pageLabel: selectorFile.css.ComproC1.ebookMapping.pageLabel,
  nextPageBtn: selectorFile.css.ComproC1.ebookMapping.nextPageBtn,
  previousPageBtn: selectorFile.css.ComproC1.ebookMapping.previousPageBtn,

  // Polling step for the bounded waits below — the reader exposes no event to wait on between a click and its URL/label update
  POLL_MS: 500,
  // A reader update after a click is seen within ~3 s on thor (measured 2026-09-25); 20 s leaves room without hiding a stuck page
  READER_UPDATE_TIMEOUT: 20000,
  PRE_CLICK_PAUSE: 2000,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    // The reader is a heavy SPA — same 60 s budget as eBook.page.isInitialized
    var toolbar = (await action.waitForDisplayed(this.bookDropdownBtn, 60000)) === true;
    var label = (await action.waitForDisplayed(this.pageLabel, 60000)) === true;
    return { pageStatus: toolbar && label };
  },

  /**
   * Reads the reader's current book and page. When expectedLabelStart is given, polls (bounded) until the page
   * label starts with it, so the caller reads the label AFTER the reader has rendered the new page — the URL
   * changes before the label does (measured: label lagged the URL by up to ~3 s).
   */
  getData_readerState: async function (expectedLabelStart) {
    await logger.logInto(await stackTrace.get(), "expectedLabelStart:" + expectedLabelStart);
    var label = "";
    var waited = 0;
    do {
      label = String(await action.getText(this.pageLabel)).replace(/\s+/g, " ").trim();
      if (!expectedLabelStart || label.indexOf(expectedLabelStart) === 0) break;
      await browser.pause(this.POLL_MS);
      waited += this.POLL_MS;
    } while (waited < this.READER_UPDATE_TIMEOUT);
    var url = await browser.getUrl();
    var bookMatch = /\/studentbook\/([^/?#]+)/.exec(url);
    var pageMatch = /[?&]page=([^&#]*)/.exec(url);
    return {
      bookTitle: String(await action.getText(this.selectedBookTitle)).trim(),
      bookId: bookMatch ? bookMatch[1] : null,
      pageParam: pageMatch ? decodeURIComponent(pageMatch[1]) : null,
      pageLabel: label,
    };
  },

  /**
   * Turns the page with the given toolbar button and waits until the page in the address bar changes.
   * Returns pageStatus false if the click failed or the page never changed.
   */
  _turnPage: async function (buttonSelector) {
    await logger.logInto(await stackTrace.get());
    var before = (await this.getData_readerState()).pageParam;
    // Deliberate pause before the click — the reader is still settling after a book/page change
    await browser.pause(this.PRE_CLICK_PAUSE);
    var res = await action.click(buttonSelector);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), res + " page button is NOT clicked", "error");
      return { pageStatus: false, pageBefore: before, pageAfter: before };
    }
    var after = before;
    var waited = 0;
    while (after === before && waited < this.READER_UPDATE_TIMEOUT) {
      await browser.pause(this.POLL_MS);
      waited += this.POLL_MS;
      after = (await this.getData_readerState()).pageParam;
    }
    return { pageStatus: after !== before, pageBefore: before, pageAfter: after };
  },

  click_nextPage: async function () {
    return await this._turnPage(this.nextPageBtn);
  },

  click_previousPage: async function () {
    return await this._turnPage(this.previousPageBtn);
  },

  /**
   * Teardown: the reader saves the last page visited in Book 1 and reopens there next session, so put Book 1
   * back on its Cover using Previous page. Switches to Book 1 first if the test ended in another book.
   * book = { title, id, switchTimeoutMs }; bounded by maxPreviousClicks.
   */
  reset_bookToCover: async function (book, coverPage, maxPreviousClicks) {
    await logger.logInto(await stackTrace.get(), "book:" + book.title);
    var out = { onBook: false, onCover: false, previousClicks: 0 };
    var state = await this.getData_readerState();
    if (state.bookId !== book.id) {
      var sw = await this.switch_book(book);
      if (!sw.switched) return out;
      state = await this.getData_readerState();
    }
    out.onBook = state.bookId === book.id;
    while (state.pageParam !== coverPage && out.previousClicks < maxPreviousClicks) {
      var turned = await this.click_previousPage();
      out.previousClicks++;
      if (!turned.pageStatus) break;
      state = await this.getData_readerState();
    }
    out.onCover = state.pageParam === coverPage;
    return out;
  },

  /**
   * Opens the "Change course material" dropdown, picks the book by title, then waits for the address bar to show
   * that book. Book titles/ids come from test data — the dropdown order is positional and must not be relied on.
   * book = { title, id, switchTimeoutMs }
   */
  switch_book: async function (book) {
    await logger.logInto(await stackTrace.get(), "book:" + book.title);
    var out = { dropdownOpened: false, itemClicked: false, switched: false };
    var item = this.bookItemByTitle.replace("{{bookTitle}}", book.title);
    var res = await action.click(this.bookDropdownBtn);
    if (true != res) return out;
    out.dropdownOpened = true == (await action.waitForDisplayed(item, 10000));
    if (!out.dropdownOpened) return out;
    res = await action.click(item);
    out.itemClicked = true == res;
    if (!out.itemClicked) return out;
    // Book ids are matched case-insensitively — the title carries "Third" but the id in the URL is lower case
    var idPattern = new RegExp("/studentbook/" + book.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "/", "i");
    out.switched = true == (await action.waitForUrl(idPattern, book.switchTimeoutMs || 60000));
    return out;
  },
};
