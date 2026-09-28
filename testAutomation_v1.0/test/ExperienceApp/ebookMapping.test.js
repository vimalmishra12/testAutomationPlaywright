"use strict";
// EMAP — Presentation Plus book-to-book page mapping (module code agreed with the user 2026-09-25).
// Manual register: test/Manual/C1App/FOC/ebookMapping_test_cases.md (sheet cases TC_FOCMap_web1 / web2).
var ebookMapping = require("../../pages/ExperienceApp/ebookMapping.page.js");
var sts;

module.exports = {
  // TC_FOCMap_web1: Book 1 page ii is mapped to Book 2 page ii — switching forward lands on Book 2 page ii and
  // switching back opens the Book 1 Cover.
  TST_EMAP_TC_1: async function (testdata) {
    sts = await ebookMapping.isInitialized();
    await assertion.assertEqual(sts.pageStatus, true, "The Presentation Plus reader did not open");

    // Book 1 opens on its Cover by default; Next page then reaches page ii (the mapped page)
    sts = await ebookMapping.getData_readerState(testdata.coverPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book1.title, "Precondition: the reader is not on Book 1");
    await assertion.assertEqual(sts.pageParam, testdata.coverPage, "Book 1 did not open on its Cover");
    sts = await ebookMapping.click_nextPage();
    await assertion.assertEqual(sts.pageStatus, true, "Next page did not move Book 1 on from the Cover");
    sts = await ebookMapping.getData_readerState(testdata.mappedPageLabel);
    await assertion.assertEqual(sts.pageParam, testdata.mappedPage, "Next page from the Cover did not reach page ii");

    sts = await ebookMapping.switch_book(testdata.book2);
    await assertion.assertEqual(sts.dropdownOpened, true, "The course material dropdown did not list '" + testdata.book2.title + "'");
    await assertion.assertEqual(sts.itemClicked, true, "'" + testdata.book2.title + "' could not be selected");
    await assertion.assertEqual(sts.switched, true, "The reader did not switch to Book 2");
    sts = await ebookMapping.getData_readerState(testdata.mappedPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book2.title, "The toolbar does not show Book 2 after switching");
    await assertion.assertEqual(sts.pageParam, testdata.mappedPage, "Book 2 did not open on the mapped page ii");
    await assertion.assertEqual(sts.pageLabel.indexOf(testdata.mappedPageLabel), 0, "Book 2 page label is not page ii — got: " + sts.pageLabel);

    sts = await ebookMapping.switch_book(testdata.book1);
    await assertion.assertEqual(sts.switched, true, "The reader did not switch back to Book 1");
    sts = await ebookMapping.getData_readerState(testdata.coverPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book1.title, "The toolbar does not show Book 1 after switching back");
    await assertion.assertEqual(sts.pageParam, testdata.coverPage, "Book 1 did not open on its Cover after switching back");
  },

  // TC_FOCMap_web2: Book 2 -> Book 3 lands on Book 3 page ii, and Book 3 page ii -> Book 2 opens the Book 2 Cover.
  TST_EMAP_TC_2: async function (testdata) {
    sts = await ebookMapping.isInitialized();
    await assertion.assertEqual(sts.pageStatus, true, "The Presentation Plus reader did not open");
    sts = await ebookMapping.getData_readerState();
    await assertion.assertEqual(sts.bookTitle, testdata.book1.title, "Precondition: the reader did not open on Book 1");
    await assertion.assertEqual(sts.pageParam, testdata.coverPage, "Book 1 did not open on its Cover");

    sts = await ebookMapping.switch_book(testdata.book2);
    await assertion.assertEqual(sts.switched, true, "The reader did not switch to Book 2");
    sts = await ebookMapping.getData_readerState(testdata.coverPageLabel);
    await assertion.assertEqual(sts.pageParam, testdata.coverPage, "Book 2 did not open on its Cover");
    sts = await ebookMapping.click_nextPage();
    await assertion.assertEqual(sts.pageStatus, true, "Next page did not move Book 2 on (still on '" + sts.pageBefore + "')");
    sts = await ebookMapping.getData_readerState(testdata.mappedPageLabel);
    await assertion.assertEqual(sts.pageParam, testdata.mappedPage, "Next page in Book 2 did not reach page ii");

    sts = await ebookMapping.switch_book(testdata.book3);
    await assertion.assertEqual(sts.dropdownOpened, true, "The course material dropdown did not list '" + testdata.book3.title + "'");
    await assertion.assertEqual(sts.switched, true, "The reader did not switch to Book 3");
    sts = await ebookMapping.getData_readerState(testdata.mappedPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book3.title, "The toolbar does not show Book 3 after switching");
    await assertion.assertEqual(sts.pageParam, testdata.mappedPage, "Book 3 did not open on the mapped page ii");
    await assertion.assertEqual(sts.pageLabel.indexOf(testdata.mappedPageLabel), 0, "Book 3 page label is not page ii — got: " + sts.pageLabel);

    sts = await ebookMapping.switch_book(testdata.book2);
    await assertion.assertEqual(sts.switched, true, "The reader did not switch back to Book 2");
    sts = await ebookMapping.getData_readerState(testdata.coverPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book2.title, "The toolbar does not show Book 2 after switching back");
    await assertion.assertEqual(sts.pageParam, testdata.coverPage, "Book 2 did not open on its Cover after switching back from Book 3");
  },

  // Owner-stated mapping (2026-09-25): Book 3 page ii is mapped to Book 1 page ii (and to the Book 2 Cover, see TC_2).
  TST_EMAP_TC_6: async function (testdata) {
    sts = await ebookMapping.isInitialized();
    await assertion.assertEqual(sts.pageStatus, true, "The Presentation Plus reader did not open");
    sts = await ebookMapping.getData_readerState(testdata.coverPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book1.title, "Precondition: the reader did not open on Book 1");
    await assertion.assertEqual(sts.pageParam, testdata.coverPage, "Book 1 did not open on its Cover");

    sts = await ebookMapping.switch_book(testdata.book2);
    await assertion.assertEqual(sts.switched, true, "The reader did not switch to Book 2");
    sts = await ebookMapping.click_nextPage();
    await assertion.assertEqual(sts.pageStatus, true, "Next page did not move Book 2 on from the Cover");
    sts = await ebookMapping.switch_book(testdata.book3);
    await assertion.assertEqual(sts.switched, true, "The reader did not switch to Book 3");
    sts = await ebookMapping.getData_readerState(testdata.mappedPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book3.title, "The toolbar does not show Book 3 after switching");
    await assertion.assertEqual(sts.pageParam, testdata.mappedPage, "Book 3 did not open on the mapped page ii");

    sts = await ebookMapping.switch_book(testdata.book1);
    await assertion.assertEqual(sts.switched, true, "The reader did not switch to Book 1 from Book 3");
    sts = await ebookMapping.getData_readerState(testdata.mappedPageLabel);
    await assertion.assertEqual(sts.bookTitle, testdata.book1.title, "The toolbar does not show Book 1 after switching from Book 3");
    await assertion.assertEqual(sts.pageParam, testdata.mappedPage, "Book 1 did not open on the mapped page ii from Book 3 page ii");
    await assertion.assertEqual(sts.pageLabel.indexOf(testdata.mappedPageLabel), 0, "Book 1 page label is not page ii — got: " + sts.pageLabel);
  },

  // Setup (before the scenario) and teardown (After block): Book 1 remembers its last-visited page, so the reader can reopen it
  // on a later page. Conditional — Previous page is clicked only while Book 1 is not on its Cover.
  TST_EMAP_TC_5: async function (testdata) {
    sts = await ebookMapping.reset_bookToCover(testdata.book1, testdata.coverPage, testdata.maxPreviousClicks);
    await assertion.assertEqual(sts.onBook, true, "Could not get back to Book 1");
    await assertion.assertEqual(sts.onCover, true, "Book 1 is not on its Cover after " + sts.previousClicks + " Previous clicks");
  },
};
