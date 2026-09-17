"use strict";
var notes = require("../../pages/ExperienceApp/notes.page.js");
var eBook = require("../../pages/ExperienceApp/eBook.page.js");
var sts;

module.exports = {
  // Click on the Add Note Button
  TST_NOTE_TC_1: async function (testdata) {
    sts = await notes.click_eBookAddNotesBtn();
    await assertion.assertEqual(sts, true, "Notes Pane not open");
  },

  // Click on the Add Notes Text Area
  TST_NOTE_TC_2: async function (testdata) {
    sts = await notes.click_eBookAddNotesTextarea();
    await assertion.assertEqual(
      sts,
      true,
      "eBookAddNotesTextarea is not clicked"
    );
  },

  // Set the value in the Add Notes Text Area and verify it
  TST_NOTE_TC_3: async function (testdata) {

    await browser.pause(2000); // pause added to avoid element not interactable issue, we will see it later

    var noteVal =
      (testdata &&
        (testdata.eBookSaveNotesBtn ||
          testdata.text ||
          testdata.hyperlink ||
          testdata.noteText)) ||
      testdata;
    sts = await notes.set_eBookAddNotesTextarea(noteVal);

    await assertion.assertEqual(
      sts,
      true,
      "eBookAddNotesTextarea values are not set"
    );
  },

  // Click on the Save Notes Button and verify the saved notes
  TST_NOTE_TC_4: async function (testdata) {
    sts = await notes.click_eBookSaveNotesBtn();
    if (testdata && testdata.notes) {
      await assertion.assertEqual(sts, testdata.notes, "status mismatch");
    } else {
      await assertion.assertNotEqual(sts, null, "status mismatch");
    }
  },

  // Click on the Delete Notes Button
  TST_NOTE_TC_5: async function (testdata) {
    sts = await notes.click_eBookDeleteNotesBtn();
    await assertion.assertEqual(
      sts,
      null,
      "eBookDeleteNotesBtn is not clicked"
    );
  },

  // Click on the 'View More' Button in Notes
  TST_NOTE_TC_6: async function (testdata) {
    sts = await notes.click_eBookNotesViewMoreBtn();
    await assertion.assertEqual(
      sts,
      true,
      "eBookNotesViewMoreBtn is not clicked"
    );
  },

  // Click on the 'View More' Delete Notes Button
  TST_NOTE_TC_7: async function (testdata) {
    sts = await notes.click_eBookViewMoreDeleteNotestBtn();
    await assertion.assertEqual(
      sts,
      true,
      "eBookViewMoreDeleteNotestBtn is not clicked"
    );
  },

  // Click on the Delete Button inside the Notes Modal
  TST_NOTE_TC_8: async function (testdata) {
    sts = await notes.click_eBookNoteModalDeleteButton();
    await assertion.assertEqual(
      sts,
      null,
      "eBookNoteModalDeleteButton is not clicked"
    );
  },

  // Get the Notes Content and verify its values
  TST_NOTE_TC_9: async function (testdata) {
    sts = await notes.getData_notesContent(testdata);
    await assertion.assertEqual(
      sts.eBookNotesHeadingTxt,
      testdata.eBookNotesHeadingTxt,
      "eBookNotesHeadingTxt values are not as expected."
    );
    await assertion.assertEqual(
      sts.eBookAddNotesTextarea,
      testdata.eBookSaveNotesBtn,
      "eBookAddNotesTextarea values are not as expected."
    );
  },

  // Pin note to page, click hyperlink, verify new tab URL matches expected domain, and close new tab
  TST_NOTE_TC_10: async function (testdata) {
    var expectedUrlPart = (testdata && testdata.hyperlinkExpectedPart) || "google";
    await notes.click_pinNoteToPage();
    await browser.pause(1000);
    sts = await notes.click_noteHyperlink(expectedUrlPart);
    await assertion.assertEqual(
      sts,
      true,
      "Hyperlink in note did not open expected URL or failed to refocus"
    );
  },

  // Navigate to next page, verify original note persists, and return to original page
  TST_NOTE_TC_11: async function (testdata) {
    await eBook.click_nextPage();
    await browser.pause(2000);
    await eBook.click_previousPage();
    await browser.pause(2000);
    sts = await notes.get_savedNotesCount();
    await assertion.assertNotEqual(
      sts,
      0,
      "Note did not persist after navigating between pages"
    );
  },

  // Delete note and verify it does not reappear after navigating away and returning
  TST_NOTE_TC_12: async function (testdata) {
    sts = await notes.delete_allNotes();
    await eBook.click_nextPage();
    await browser.pause(2000);
    await eBook.click_previousPage();
    await browser.pause(2000);
    var count = await notes.get_savedNotesCount();
    await assertion.assertEqual(
      count,
      0,
      "Deleted note reappeared after navigating between pages"
    );
  },

  // Verify multiple notes are displayed on the same page
  TST_NOTE_TC_13: async function (testdata) {
    var expectedCount = (testdata && testdata.expectedNotesCount) || 2;
    var count = await notes.get_savedNotesCount(expectedCount);
    await assertion.assertEqual(
      count,
      expectedCount,
      "Multiple notes count mismatch on current page"
    );
  },

  // Clean up all notes on the page and verify clean state
  TST_NOTE_TC_14: async function (testdata) {
    sts = await notes.delete_allNotes();
    await assertion.assertEqual(
      sts,
      true,
      "Failed to clean up all notes on the page"
    );
    var count = await notes.get_savedNotesCount();
    await assertion.assertEqual(
      count,
      0,
      "Notes remain after delete_allNotes cleanup"
    );
    await browser.pause(1500);
  },

  // Add note with special characters and numbers and verify persistence
  TST_NOTE_TC_15: async function (testdata) {
    var specialText = (testdata && testdata.specialChars) || "Notes #123 @ Test & Cambridge! [2026] $50% (A+B)=C";
    await notes.click_eBookAddNotesBtn();
    await browser.pause(1000);
    await notes.set_eBookAddNotesTextarea(specialText);
    await notes.click_eBookSaveNotesBtn();
    await browser.pause(1000);
    var count = await notes.get_savedNotesCount();
    await assertion.assertNotEqual(
      count,
      0,
      "Note with special characters was not saved"
    );
  },

  // Edit existing note and verify updated persistence
  TST_NOTE_TC_18: async function (testdata) {
    var initialCount = await notes.get_savedNotesCount();
    if (initialCount === 0) {
      await notes.click_eBookAddNotesBtn();
      await browser.pause(1000);
      await notes.set_eBookAddNotesTextarea("Initial Note to Edit");
      await notes.click_eBookSaveNotesBtn();
      await notes.get_savedNotesCount(1);
    }
    var updatedText = (testdata && testdata.editUpdated) || "Updated Note Content";
    sts = await notes.click_eBookViewMoreEditNoteBtn();
    await assertion.assertEqual(
      sts,
      true,
      "Edit note button was not clicked or edit textarea not displayed"
    );
    await browser.pause(1000);
    await notes.set_eBookAddNotesTextarea(updatedText);
    await notes.click_eBookSaveNotesBtn();
    var count = await notes.get_savedNotesCount(1);
    await assertion.assertNotEqual(
      count,
      0,
      "Updated note was not saved"
    );
  },
};
