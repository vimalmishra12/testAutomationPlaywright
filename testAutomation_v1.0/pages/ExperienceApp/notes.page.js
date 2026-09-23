"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
  eBookNotesHeadingTxt: selectorFile.css.ComproC1.notes.eBookNotesHeadingTxt,
  eBookAddNotesBtn: selectorFile.css.ComproC1.notes.eBookAddNotesBtn,
  eBookAddNotesTextarea: selectorFile.css.ComproC1.notes.eBookAddNotesTextarea,
  eBookSaveNotesBtn: selectorFile.css.ComproC1.notes.eBookSaveNotesBtn,
  eBookDeleteNotesBtn: selectorFile.css.ComproC1.notes.eBookDeleteNotesBtn,
  eBookNotesViewMoreBtn: selectorFile.css.ComproC1.notes.eBookNotesViewMoreBtn,
  eBookViewMoreDeleteNotestBtn:
    selectorFile.css.ComproC1.notes.eBookViewMoreDeleteNotestBtn,
  eBookNoteModalDeleteButton:
    selectorFile.css.ComproC1.notes.eBookNoteModalDeleteButton,
  eBookViewMoreEditNoteBtn:
    selectorFile.css.ComproC1.notes.eBookViewMoreEditNoteBtn,
  noteHyperlink: selectorFile.css.ComproC1.notes.noteHyperlink,
  savedNoteText: selectorFile.css.ComproC1.notes.savedNoteText,
  savedNoteCards: selectorFile.css.ComproC1.notes.savedNoteCards,
  saveNotesBtnDisabled: selectorFile.css.ComproC1.notes.saveNotesBtnDisabled,
  notesCloseBtn: selectorFile.css.ComproC1.notes.notesCloseBtn,
  savedNoteTextarea: selectorFile.css.ComproC1.notes.savedNoteTextarea,
  eBookPinNoteBtn: selectorFile.css.ComproC1.notes.eBookPinNoteBtn,
  readerPageSurface: selectorFile.css.ComproC1.notes.readerPageSurface,
  pinnedNoteIcon: selectorFile.css.ComproC1.notes.pinnedNoteIcon,
  pinnedNotePopover: selectorFile.css.ComproC1.notes.pinnedNotePopover,
  pinnedNoteLink: selectorFile.css.ComproC1.notes.pinnedNoteLink,
    
  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.eBookNotesHeadingTxt),
    };
    return res;
  },

  getData_notesContent: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      eBookNotesHeadingTxt:
        (await action.getElementCount(this.eBookNotesHeadingTxt)) > 0
          ? await action.getText(this.eBookNotesHeadingTxt)
          : null,
      eBookAddNotesBtn:
        (await action.getElementCount(this.eBookAddNotesBtn)) > 0
          ? await action.getText(this.eBookAddNotesBtn)
          : null,
      eBookAddNotesTextarea:
        (await action.getElementCount(this.savedNoteTextarea)) > 0
          ? await action.getValue(this.savedNoteTextarea)
          : (await action.getElementCount(this.eBookAddNotesTextarea)) > 0
          ? await action.getValue(this.eBookAddNotesTextarea)
          : null,
      eBookSaveNotesBtn:
        (await action.getElementCount(this.eBookSaveNotesBtn)) > 0
          ? await action.getText(this.eBookSaveNotesBtn)
          : null,
      eBookDeleteNotesBtn:
        (await action.getElementCount(this.eBookDeleteNotesBtn)) > 0
          ? await action.getText(this.eBookDeleteNotesBtn)
          : null,
      eBookNotesViewMoreBtn:
        (await action.getElementCount(this.eBookNotesViewMoreBtn)) > 0
          ? await action.getText(this.eBookNotesViewMoreBtn)
          : null,
      eBookViewMoreDeleteNotestBtn:
        (await action.getElementCount(this.eBookViewMoreDeleteNotestBtn)) > 0
          ? await action.getText(this.eBookViewMoreDeleteNotestBtn)
          : null,
      eBookNoteModalDeleteButton:
        (await action.getElementCount(this.eBookNoteModalDeleteButton)) > 0
          ? await action.getText(this.eBookNoteModalDeleteButton)
          : null,
    };
    return obj;
  },

  click_eBookAddNotesBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.eBookAddNotesBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " eBookAddNotesBtn is clicked"
      );
      res = await action.waitForDisplayed(this.eBookDeleteNotesBtn);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookAddNotesBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_eBookAddNotesTextarea: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.eBookAddNotesTextarea);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " eBookAddNotesTextarea is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookAddNotesTextarea is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_eBookSaveNotesBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.eBookSaveNotesBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " eBookSaveNotesBtn is clicked"
      );
      await browser.pause(500);
      var val = await action.getValue(this.savedNoteTextarea);
      if (!val || val instanceof Error) {
        val = await action.getValue(this.eBookAddNotesTextarea);
      }
      res = val;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookSaveNotesBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_pinNoteToPage: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.eBookPinNoteBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        "eBookPinNoteBtn is clicked, clicking reader page canvas to place pin"
      );
      await browser.pause(1000);
      res = await action.click(this.readerPageSurface);
      await browser.pause(1500);
      var isPinned = (await action.getElementCount(this.pinnedNoteIcon)) > 0;
      await logger.logInto(
        await stackTrace.get(),
        "Note pinned on canvas: " + isPinned
      );
      return isPinned || res;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookPinNoteBtn is NOT clicked",
        "error"
      );
      return res;
    }
  },

  click_pinnedNoteIcon: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.pinnedNoteIcon);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        "pinnedNoteIcon clicked, waiting for popover"
      );
      await browser.pause(1000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "pinnedNoteIcon is NOT clicked",
        "error"
      );
    }
    return res;
  },

  /**
   * Clicks the hyperlink inside a note, switches to the tab it opens, reports whether that tab
   * reached `expectedUrlPart`, and closes the tab again so the caller is left on the reader tab.
   *
   * The link element is resolved by trying three selectors in order because a note's link markup
   * varies by note type: the plain note link, the pinned-note link, then a text-matched anchor.
   * The third one interpolates `expectedUrlPart` into `a:has-text(...)` at runtime — a text
   * predicate cannot be a static entry in C1Selectors.json, so it is built here under the
   * system.md Layer 2 "Escape hatch". `[2026-09-23]`
   */
  click_noteHyperlink: async function (expectedUrlPart) {
    await logger.logInto(await stackTrace.get());
    var initialCount = action.getPageCount();
    var targetSelector = this.noteHyperlink;
    var count = await action.getElementCount(targetSelector);
    if (count === 0) {
      targetSelector = this.pinnedNoteLink;
      count = await action.getElementCount(targetSelector);
    }
    if (count === 0 && expectedUrlPart) {
      targetSelector = `a:has-text("${expectedUrlPart}")`;
      count = await action.getElementCount(targetSelector);
    }
    if (count === 0) {
      await logger.logInto(
        await stackTrace.get(),
        "No hyperlink element found to click",
        "error"
      );
      return false;
    }
    var res = await action.click(targetSelector);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        "note link clicked, awaiting tab transition"
      );
      var tabRes = await action.switchToNewTab(initialCount);
      if (tabRes === true) {
        var currentUrl = "";
        var isMatched = false;
        try {
          // switchToNewTab() returns as soon as the tab EXISTS, so global.page.url() can still
          // read "about:blank" here. Wait for the target URL to commit before asserting on it.
          // "commit" is load-bearing: the default waitUntil ("load") never resolves for this
          // tab, which is the exact trap schoolLibrary.page.js documents at waitForUrlFragment.
          // action.waitForUrl() is unusable here — it takes only a string glob/RegExp, uses the
          // default waitUntil, and swallows the error into a return value, so it can neither
          // express a case-insensitive substring match nor avoid the "load" trap. `[2026-09-23]`
          if (expectedUrlPart) {
            await global.page.waitForURL(
              (url) =>
                url.href
                  .toLowerCase()
                  .includes((expectedUrlPart || "").toLowerCase()),
              { timeout: 15000, waitUntil: "commit" }
            );
          } else {
            // No expected fragment to match against — settle for "left about:blank" so the
            // caller still gets a meaningful URL to log rather than racing the blank document.
            await global.page.waitForURL(
              (url) =>
                url.href &&
                !url.href.startsWith("about:") &&
                url.href !== "",
              { timeout: 15000, waitUntil: "commit" }
            );
          }
          currentUrl = global.page.url();
          isMatched = currentUrl
            .toLowerCase()
            .includes((expectedUrlPart || "").toLowerCase());
        } catch (waitErr) {
          // waitForURL rejected (never matched, or it raced a page object that had already
          // moved on). Do not fail here — fall back to a substring poll, which names the URL the
          // tab is actually on and so keeps "the link did nothing" distinguishable from "the
          // matcher was wrong". Same technique as schoolLibrary.page.js waitForUrlFragment.
          await logger.logInto(
            await stackTrace.get(),
            "waitForURL caught: " + (waitErr && waitErr.message) + ", polling URL...",
            "warn"
          );
          for (var i = 0; i < 5; i++) {
            await browser.pause(1000);
            currentUrl = global.page.url();
            if (
              currentUrl &&
              currentUrl
                .toLowerCase()
                .includes((expectedUrlPart || "").toLowerCase())
            ) {
              isMatched = true;
              break;
            }
          }
        }
        await logger.logInto(
          await stackTrace.get(),
          "New tab URL is: " + currentUrl
        );
        await action.closeCurrentTabAndRefocus();
        return isMatched;
      }
      return tabRes;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "note link is NOT clicked",
        "error"
      );
      return res;
    }
  },

  click_eBookDeleteNotesBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.eBookDeleteNotesBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " eBookDeleteNotesBtn is clicked"
      );
      if ((await action.getElementCount(this.eBookAddNotesTextarea)) > 0) {
        res = await action.getValue(this.eBookAddNotesTextarea);
      } else {
        res = "";
      }
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookDeleteNotesBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_eBookNotesViewMoreBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.eBookNotesViewMoreBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " eBookNotesViewMoreBtn is clicked"
      );
      // res = await this.getData_eBookViewMoreDeleteNotestBtn();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookNotesViewMoreBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_eBookViewMoreDeleteNotestBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.eBookViewMoreDeleteNotestBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " eBookViewMoreDeleteNotestBtn is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookViewMoreDeleteNotestBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_eBookNoteModalDeleteButton: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.eBookNoteModalDeleteButton);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " eBookNoteModalDeleteButton is clicked"
      );
      res = await this.getData_notesContent().eBookAddNotesTextarea;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "eBookNoteModalDeleteButton is NOT clicked",
        "error"
      );
    }
    return res;
  },

  set_eBookAddNotesTextarea: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.clearValue(this.eBookAddNotesTextarea);
    if (value && value.length > 50) {
      await action.setValue(this.eBookAddNotesTextarea, value.slice(0, -1));
      res = await action.addValue(this.eBookAddNotesTextarea, value.slice(-1));
    } else {
      res = await action.addValue(this.eBookAddNotesTextarea, value);
    }

    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        "Value is entered in eBookAddNotesTextarea"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "Value is NOT entered in eBookAddNotesTextarea",
        "error"
      );
    }
    return res;
  },

  click_eBookViewMoreEditNoteBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res = await action.click(this.eBookNotesViewMoreBtn);
    if (true == res) {
      await browser.pause(500);
      res = await action.click(this.eBookViewMoreEditNoteBtn);
      if (true == res) {
        await logger.logInto(
          await stackTrace.get(),
          "eBookViewMoreEditNoteBtn is clicked"
        );
        res = await action.waitForDisplayed(this.eBookSaveNotesBtn);
      }
    }
    return res;
  },

  isSaveNotesBtnDisabled: async function () {
    await logger.logInto(await stackTrace.get());
    var disabledAttr = await action.getAttribute(
      this.eBookSaveNotesBtn,
      "disabled"
    );
    if (
      disabledAttr !== null &&
      disabledAttr !== false &&
      disabledAttr !== undefined
    ) {
      return true;
    }
    var classAttr = await action.getAttribute(this.eBookSaveNotesBtn, "class");
    if (classAttr && classAttr.includes("disabled")) {
      return true;
    }
    var disabledCount = await action.getElementCount(this.saveNotesBtnDisabled);
    return disabledCount > 0;
  },

  get_savedNotesCount: async function (expectedCount, timeout) {
    await logger.logInto(await stackTrace.get());
    if (expectedCount !== undefined) {
      try {
        await browser.waitUntil(
          async () =>
            (await action.getElementCount(this.eBookNotesViewMoreBtn)) ===
            expectedCount,
          {
            timeout: timeout || 10000,
            timeoutMsg: "Saved notes count did not reach " + expectedCount,
          }
        );
      } catch (e) {}
    }
    return await action.getElementCount(this.eBookNotesViewMoreBtn);
  },

  get_savedNotesText: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await action.getElementCount(this.savedNoteText);
    if (count > 0) {
      return await action.getText(this.savedNoteText);
    }
    return null;
  },

  get_textareaValue: async function () {
    await logger.logInto(await stackTrace.get());
    return await action.getValue(this.eBookAddNotesTextarea);
  },

  delete_allNotes: async function () {
    await logger.logInto(await stackTrace.get());
    var count = await action.getElementCount(this.eBookNotesViewMoreBtn);
    var attempts = 0;
    while (count > 0 && attempts < 10) {
      attempts++;
      await action.click(this.eBookNotesViewMoreBtn);
      await browser.pause(500);
      await action.click(this.eBookViewMoreDeleteNotestBtn);
      await browser.pause(500);
      await action.click(this.eBookNoteModalDeleteButton);
      await browser.pause(1500);
      count = await action.getElementCount(this.eBookNotesViewMoreBtn);
    }
    await browser.pause(1000);
    return count === 0;
  },
};
