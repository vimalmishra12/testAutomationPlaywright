"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
  cqa_ebook_evolve: selectorFile.css.ComproC1.eBook.cqa_ebook_evolve,
  contentButton: selectorFile.css.ComproC1.eBook.contentButton,
  toolsButton: selectorFile.css.ComproC1.eBook.toolsButton,
  closeButton: selectorFile.css.ComproC1.eBook.closeButton,
  homeButton: selectorFile.css.ComproC1.eBook.homeButton,
  myNotes: selectorFile.css.ComproC1.eBook.myNotes,
  cqaEbookEvolveDropdown:
    selectorFile.css.ComproC1.eBook.cqaEbookEvolveDropdown,
    dropDownListTitle: selectorFile.css.ComproC1.eBook.dropDownListTitle,
    dropDownElementTitle: selectorFile.css.ComproC1.eBook.dropDownElementTitle,
  cqaTestEbookOnlyAssets:
    selectorFile.css.ComproC1.eBook.cqaTestEbookOnlyAssets,
  notes: selectorFile.css.ComproC1.eBook.notes,
  timer: selectorFile.css.ComproC1.eBook.timer,
  drawingTool: selectorFile.css.ComproC1.eBook.drawingTool,
  showAndHideSelection: selectorFile.css.ComproC1.eBook.showAndHideSelection,
  pageNumber: selectorFile.css.ComproC1.eBook.pageNumber,

  pageNoOneBtn: selectorFile.css.ComproC1.pageNoDialogBox.pageNoOneBtn,
  pageNoTwoBtn: selectorFile.css.ComproC1.pageNoDialogBox.pageNoTwoBtn,
  pageNoClearBtn: selectorFile.css.ComproC1.pageNoDialogBox.pageNoClearBtn,
  pageNoGoToPageBtn:
    selectorFile.css.ComproC1.pageNoDialogBox.pageNoGoToPageBtn,
  pageNOShow: selectorFile.css.ComproC1.pageNoDialogBox.pageNOShow,

  hyperLinkAnswer:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperLinkAnswer,
  hyperLinkVideo:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperLinkVideo,
  hyperlinkAudio:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperlinkAudio,
  hyperlinkActivity:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperlinkActivity,
  hyperlinkNewTab:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperlinkNewTab,
  hyperlinkAudioNoTranscript:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink
      .hyperlinkAudioNoTranscript,
  hyperlinkNewTab:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperlinkNewTab,
  hyperlinkGoToPage:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperlinkGoToPage,
  hyperLinkGame:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperLinkGame,
  hyperZoomHotspot:
    selectorFile.css.ComproC1.eBookLearningPageHyperlink.hyperZoomHotspot,

  hyperAnswerReveal:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperAnswerReveal,
  hyperAudioClose:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperAudioClose,
  hyperAnswerClose:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperAnswerClose,
  hyperVideoClose:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperVideoClose,
  hyperVideoPlay:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperVideoPlay,
  hyperAnswerFullScreen:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperAnswerFullScreen,
  hyperAnswerExitFullScreen:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperAnswerExitFullScreen,
  hyperActivityNext:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperActivityNext,
  hyperZoomHotspotClose:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperZoomHotspotClose,

  hyperAnswerQuestion:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.hyperAnswerQuestion,
  HyperShowHideTranscript:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.HyperShowHideTranscript,
  hyperAudioPlay_pause:
    selectorFile.css.ComproC1.hyperlinkAudio.hyperAudioPlay_pause,
  hyperAudioClose: selectorFile.css.ComproC1.hyperlinkAudio.hyperAudioClose,

  toggleLayoutBtn: selectorFile.css.ComproC1.eBook.toggleLayoutBtn,
  doublePage: selectorFile.css.ComproC1.eBook.doublePage,
  singlePage: selectorFile.css.ComproC1.eBook.singlePage,
  fitToScreenBtn: selectorFile.css.ComproC1.eBook.fitToScreenBtn,
  fitToWidthBtn: selectorFile.css.ComproC1.eBook.fitToWidthBtn,
  readerContainerWrapper:
    selectorFile.css.ComproC1.eBook.readerContainerWrapper,
  zoomInBtn: selectorFile.css.ComproC1.eBook.zoomInBtn,
  zoomOutBtn: selectorFile.css.ComproC1.eBook.zoomOutBtn,
  nextPage: selectorFile.css.ComproC1.eBook.nextPage,
  previousPage: selectorFile.css.ComproC1.eBook.previousPage,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    // [2026-06-11] Playwright migration: the eBook reader (heavy SPA) sometimes takes
    // longer than the 30s default to render the home button — give it 60s so the
    // launch is not flaky. See drawing/player TST_DASH_TC_5 timeouts.
    res = {
      pageStatus: await action.waitForDisplayed(this.homeButton, 60000),
    };
    return res;
  },

  getData_ebookEvolve: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      cqa_ebook_evolve:
        (await action.getElementCount(this.cqa_ebook_evolve)) > 0
          ? await action.getText(this.cqa_ebook_evolve)
          : null,
    };
    return obj;
  },

  getData_eTextToolBar: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      contentButton:
        (await action.getElementCount(this.contentButton)) > 0
          ? await action.getText(this.contentButton)
          : null,
      toolsButton:
        (await action.getElementCount(this.toolsButton)) > 0
          ? await action.getText(this.toolsButton)
          : null,
      homeButton:
        (await action.getElementCount(this.homeButton)) > 0
          ? await action.getText(this.homeButton)
          : null,
      pageNumber:
        (await action.getElementCount(this.pageNumber)) > 0
          ? await action.getText(this.pageNumber)
          : null,
    };
    return obj;
  },

  getData_ebookContents: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      closeButton:
        (await action.getElementCount(this.closeButton)) > 0
          ? await action.getText(this.closeButton)
          : null,
    };
    return obj;
  },

  getData_ebookToolsNotes: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      myNotes:
        (await action.getElementCount(this.myNotes)) > 0
          ? await action.getText(this.myNotes)
          : null,
    };
    return obj;
  },

  getData_ebookContent: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      cqaEbookEvolveDropdown:
        (await action.getElementCount(this.cqaEbookEvolveDropdown)) > 0
          ? await action.getText(this.cqaEbookEvolveDropdown)
          : null,
    };
    return obj;
  },

  getData_ebookContentDropdown: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      cqaTestEbookOnlyAssets:
        (await action.getElementCount(this.cqaTestEbookOnlyAssets)) > 0
          ? await action.getText(this.cqaTestEbookOnlyAssets)
          : null,
    };
    return obj;
  },

  getData_ebookTools: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      notes:
        (await action.getElementCount(this.notes)) > 0
          ? await action.getText(this.notes)
          : null,
    };
    return obj;
  },

  click_contentButton: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    await action.waitForDisplayed(this.contentButton);
    res = await action.click(this.contentButton);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " contentButton is clicked");
      res = await require("./eBookContents.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "contentButton is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_toolsButton: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.toolsButton);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " toolsButton is clicked");
      res = await require("./eBookTools.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "toolsButton is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_closeButton: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.closeButton);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " closeButton is clicked");
      res = await require("./eBook.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "closeButton is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_homeButton: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.homeButton);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " homeButton is clicked");
      res = await require("./dashboard.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "homeButton is NOT clicked",
        "error"
      );
    }
    return res;
  },


// click_playlistTitle: async function (playlistTitleName) {
//   console.log("[DEBUG] click_playlistTitle called with locator:", this.dropDownListTitle);

//   await logger.logInto(await stackTrace.get());

//   let list, foundElement;
//   try {
//     list = await action.findElements(this.dropDownListTitle);
//     console.log("[DEBUG] Found playlist items count:", list.length);

//     for (let i = 0; i < list.length; i++) {
//       // log the locator with index
      
//       // log the element object itself
//       console.log(`[DEBUG] Raw element at index ${i}:`, list[i]);

//       // get the text of this element
//       let text = await action.getText(list[i]);
//       console.log(`[DEBUG] Checking index ${i}, text: "${text}"`);

//       if (text === playlistTitleName) {
//         console.log(`[DEBUG] ✅ Match found at index ${i}, returning element (not clicking)...`);
//         foundElement = list[i];
//         break;
//       }
//     }

//     if (!foundElement) {
//       console.warn("[WARN] No match found for:", playlistTitleName);
//     }
//   } catch (err) {
//     console.error("[ERROR] click_playlistTitle failed:", err);
//   }

//   return foundElement; // return element instead of clicking
// },



click_playlistTitle: async function (playlistTitleName) {
    await logger.logInto(await stackTrace.get());
    let i, list, res;
    list = await action.findElements(this.dropDownListTitle);

    for (i = 1; i <= list.length; i++) {
        const selector = `${this.dropDownListTitle}${i}"]`;
        const text = await action.getText(selector);
        if (text === playlistTitleName) {
            res = selector;          
            break;
        }
    }
    return res; 
},




click_cqaEbookEvolveDropdown: async function (testdata) {
  
  var res;
  try {
    // [2026-06-12] Playwright port fix: this assertion compares the returned value to an
    // rgba colour string (testdata.expectedColor). Previously the method returned the click
    // boolean (undefined when the dropdown wasn't ready) or the raw getCSSProperty object,
    // so assertEqual saw `undefined`/`[object Object]` instead of the colour. Now we wait for
    // the dropdown, open the playlist card, and return the parsed rgba string for comparison.
    await action.waitForClickable(this.cqaEbookEvolveDropdown, 10000);
    await action.click(this.cqaEbookEvolveDropdown);
    let cardElement = await this.click_playlistTitle(testdata);
    if (cardElement) {
      let cssRes = await action.getCSSProperty(cardElement, "background-color");
      // Return the rgba string so assertEqual(sts, expectedColor) compares like-for-like.
      res = cssRes && cssRes.parsed ? cssRes.parsed.rgba : (cssRes && cssRes.value);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        "cqaEbookEvolveDropdown playlist card not found",
        "error"
      );
      res = false;
    }
  } catch (err) {
    await logger.logInto(await stackTrace.get(), "Error: " + err.message, "error");
    res = false;
  }
  return res;
},



  
// click_cqaEbookEvolveDropdown: async function (testdata) {
//   console.log("[DEBUG] click_cqaEbookEvolveDropdown called with:", testdata);
//   await logger.logInto(await stackTrace.get());

//   var res;
//   try {
//     console.log("[DEBUG] Attempting to click cqaEbookEvolveDropdown...");
//     res = await action.click(this.cqaEbookEvolveDropdown);

//     if (res === true) {
//       await logger.logInto(
//         await stackTrace.get(),
//         "cqaEbookEvolveDropdown is clicked"
//       );
//       console.log("[DEBUG] cqaEbookEvolveDropdown click SUCCESS");

//       console.log("[DEBUG] Pausing for 2s before fetching CSS...");
//       await browser.pause(2000);

//       const selector = "a[qid='ebook-list-item-5']";
//       console.log("[DEBUG] Fetching CSS property 'background-color' for selector:", selector);

//       res = await action.getCSSProperty(selector, "background-color");
//       console.log("[DEBUG] CSS 'background-color' value returned:", res);

//       await logger.logInto(
//         await stackTrace.get(),
//         "CSS Property fetched: background-color = " + JSON.stringify(res)
//       );
//     } else {
//       await logger.logInto(
//         await stackTrace.get(),
//         res + " cqaEbookEvolveDropdown is NOT clicked",
//         "error"
//       );
//       console.warn("[WARN] cqaEbookEvolveDropdown click FAILED, res =", res);
//     }
//   } catch (err) {
//     console.error("[ERROR] click_cqaEbookEvolveDropdown failed:", err);
//     await logger.logInto(await stackTrace.get(), "Error: " + err.message, "error");
//     res = false;
//   }

//   return res;
// },



  click_cqaTestEbookOnlyAssets: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var res;

    let cardElement = await this.click_playlistTitle(testdata);
    

    res = await action.click(cardElement);

    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " cqaTestEbookOnlyAssets is clicked"
      );
      await browser.pause(4000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "cqaTestEbookOnlyAssets is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_notes: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    await action.waitForDocumentLoad();

    res = await action.click(this.notes);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " notes is clicked");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "notes is NOT clicked",
        "error"
      );
    }
    return res;
  },
  click_timer: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    await action.waitForDocumentLoad();

    res = await action.click(this.timer);

    // console.log("this is notes res", res);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " timer is clicked");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "timer is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_drawingTool: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    await action.waitForDocumentLoad();

    res = await action.click(this.drawingTool);
    console.log("clicked 322", res);

    if (true == res) {
      await logger.logInto(await stackTrace.get(), " drawing  tool is clicked");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "drawing tool is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_showAndHideSelection: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    await action.waitForDocumentLoad();

    res = await action.click(this.showAndHideSelection);

    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " showAndHideSelection  tool is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "showAndHideSelection tool is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_pageNumber: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    await browser.pause(500);
    await action.waitForDisplayed(this.pageNumber);
    res = await action.click(this.pageNumber);
    //console.log("res val is :-- :- "+res)

    if (true == res) {
      await logger.logInto(await stackTrace.get(), " pageNumber is clicked");
      // console.log("pagee status in page no 1:- ")
      var pageStatus = await action.waitForDisplayed(this.pageNoOneBtn);

      //console.log("pagee status in page no 2 :- "+pageStatus)
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "pageNumber is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_pageNoOneBtn: async function () {
    await logger.logInto(await stackTrace.get());
    action.waitForDocumentLoad();
    browser.pause(500);
    var res;
    res = await action.click(this.pageNoOneBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " pageNoOneBtn is clicked");
      console.log("one is clicked fron dialogboc.page ");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "pageNoOneBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },
  click_pageNoTwoBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.pageNoTwoBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " pageNoTwoBtn is clicked");
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "pageNoTwoBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },
  click_pageNoGoToPageBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.pageNoGoToPageBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " pageNoGoToPageBtn is clicked"
      );

      var pageStatus = await action.waitForDisplayed(this.pageNOShow);
      await browser.pause(1000);

      //console.log("page no stauus ",pageStatus);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "pageNoGoToPageBtn is NOT clicked",
        "error"
      );
    }
    //console.log("check:- ",res)
    return res;
  },

  // isInitialized: async function ()
  // {
  // var res;
  // await logger.logInto(await stackTrace.get());
  // await action.waitForDocumentLoad();
  // res = {
  // pageStatus: await action.waitForDisplayed(this.hyperLinkAnswer),
  // };
  // return res;
  // },

  // getData_ebookLearningHyperlink: async function ()
  // {
  // await logger.logInto(await stackTrace.get());
  // var obj;
  // obj = {
  // hyperLinkAnswer:(( await action.getElementCount(this.hyperLinkAnswer)) > 0) ? await action.getText(this.hyperLinkAnswer) : null,
  // hyperlinkAudio:(( await action.getElementCount(this.hyperlinkAudio)) > 0) ? await action.getText(this.hyperlinkAudio) : null,
  // }
  // return obj;
  // },

  acceptCookies: async function () {
    const cookieButtonSelector = "cookies-2"; // Replace with the actual selector
    const isCookieBannerVisible = await $(cookieButtonSelector).isDisplayed();

    if (isCookieBannerVisible) {
      await $(cookieButtonSelector).click();
    }
  },

  click_hyperLinkAnswer: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperLinkAnswer);
    console.log("val of res is hyperLinkAnswer: ", res);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperLinkAnswer is clicked"
      );

      await $(this.hyperAnswerFullScreen).waitForDisplayed();
      await $(this.hyperAnswerFullScreen).click();
      await browser.pause(3000);

      await $(this.hyperAnswerReveal).waitForDisplayed();
      await $(this.hyperAnswerReveal).click();
      await browser.pause(3000);

      await $(this.hyperAnswerExitFullScreen).waitForDisplayed();
      await $(this.hyperAnswerExitFullScreen).click();
      await browser.pause(3000);

      await $(this.hyperAnswerClose).waitForDisplayed();
      await $(this.hyperAnswerClose).click();
      await browser.pause(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperLinkAnswer is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_hyperlinkActivity: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperlinkActivity);
    console.log("val of res is hyperLinkActivity: ", res);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperLinkActivity is clicked"
      );

      await browser.pause(3000);

      // await $(this.hyperActivityNext).waitForDisplayed();
      // await $(this.hyperActivityNext).click();
      // await browser.pause(3000);

      await $(this.hyperAnswerClose).waitForDisplayed();
      await $(this.hyperAnswerClose).click();
      await browser.pause(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperLinkActivity is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_hyperlinkGoToPage: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperlinkGoToPage);
    console.log("val of res is hyperlinkGoToPage: ", res);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperlinkGoToPage is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperlinkGoToPage is NOT clicked",
        "error"
      );
    }
    return res;
  },
  click_hyperZoomHotspot: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.doubleClick(this.hyperZoomHotspot);
    console.log("val of res is hyperZoomHotspot: ", res);
    if (true == res) {
      await browser.pause(1000);
      await logger.logInto(
        await stackTrace.get(),
        " hyperZoomHotspot is clicked"
      );
      res = true;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperZoomHotspot is NOT clicked",
        "error"
      );
      res = false;
    }
    return res;
  },

  click_hyperZoomHotspotClose: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    console.log(
      "Selector for hyperZoomHotspotClose 1011: ",
      this.hyperZoomHotspotClose
    );

    res = await action.click(this.hyperZoomHotspotClose);
    console.log("val of res is hyperZoomHotspotClose1012: ", res);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperZoomHotspotClose is clicked"
      );
      //res= true;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperZoomHotspotClose is NOT clicked",
        "error"
      );
      //res=false;
    }
    return res;
  },

  click_hyperLinkGame: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperLinkGame);
    console.log("val of res is hyperLinkGame: ", res);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " hyperLinkGame is clicked");

      await browser.pause(3000);
      await $(this.hyperAnswerClose).waitForDisplayed();
      await $(this.hyperAnswerClose).click();

      await browser.pause(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperLinkGame is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_hyperlinkAudioNoTranscript: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperlinkAudioNoTranscript);
    console.log("val of res is hyperlinkAudioNoTranscript: ", res);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperlinkAudioNoTranscript is clicked"
      );

      await $(this.hyperAudioClose).waitForDisplayed();
      await $(this.hyperAudioClose).click();
      await browser.pause(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperlinkAudioNoTranscript is NOT clicked",
        "error"
      );
    }
    return res;
  },
  // click_hyperlinkNewTab: async function () {
  //   await logger.logInto(await stackTrace.get());
  //   var res;
  //   res = await action.click(this.hyperlinkNewTab);
  //   console.log("val of res is hyperlinkNewTab: ", res);
  //   if (true == res) {
  //     await logger.logInto(
  //       await stackTrace.get(),
  //       " hyperlinkNewTab is clicked"
  //     );

  //     await $(this.hyperAnswerClose).waitForDisplayed();
  //     await $(this.hyperAnswerClose).click();
  //     await browser.pause(3000);

  //   } else {
  //     await logger.logInto(
  //       await stackTrace.get(),
  //       res + "hyperlinkNewTab is NOT clicked",
  //       "error"
  //     );
  //   }
  //   return res;
  // },

  click_hyperlinkNewTab: async function () {
    await logger.logInto(await stackTrace.get());
    let res;
    res = await action.click(this.hyperlinkNewTab);
    console.log("val of res is hyperlinkNewTab: ", res);

    if (res === true) {
      await logger.logInto(
        await stackTrace.get(),
        "hyperlinkNewTab is clicked"
      );

      // Store the original tab handle
      const originalWindow = await browser.getWindowHandle();

      // Wait for the new tab to open
      await browser.waitUntil(
        async () => {
          const handles = await browser.getWindowHandles();
          return handles.length > 1;
        },
        {
          timeout: 5000,
          timeoutMsg: "New tab did not open within the timeout period",
        }
      );

      // Automatically switched to the new tab
      const windowHandles = await browser.getWindowHandles();
      const newTab = windowHandles.find((handle) => handle !== originalWindow);

      // Ensure we're on the new tab
      await browser.switchToWindow(newTab);

      // Perform actions on the new tab (if needed)
      console.log("Performing actions on the new tab");

      // Return to the original tab
      await browser.switchToWindow(originalWindow);

      // Close the new tab
      await browser.switchToWindow(newTab);
      await browser.pause(3000);
      await browser.closeWindow();

      // Switch back to the original tab after closing the new one
      await browser.switchToWindow(originalWindow);
      await logger.logInto(
        await stackTrace.get(),
        "Switched back to the original tab and closed the new tab"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " hyperlinkNewTab is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_hyperLinkVideo: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperLinkVideo);
    console.log("val of res is hyperLinkVideo 2: ", res);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperLinkVideo 2 is clicked"
      );

      // await $(this.hyperVideoPlay).waitForDisplayed();
      // await $(this.hyperVideoPlay).click();
      // await browser.pause(3000)

      // await $(this.hyperAnswerReveal).waitForDisplayed();
      // await $(this.hyperAnswerReveal).click();
      // await browser.pause(3000)

      // await $(this.hyperAnswerExitFullScreen).waitForDisplayed();
      // await $(this.hyperAnswerExitFullScreen).click();
      // await browser.pause(3000)
      await browser.pause(3000);

      await $(this.hyperVideoClose).waitForDisplayed();
      await $(this.hyperVideoClose).click();
      await browser.pause(3000);

      //     // After your assertion, you can close the new window and switch back to the original window if needed
      //     await browser.closeWindow();  // Close the new window
      //     await browser.switchToWindow(currentWindow);  // Switch back to the original window
      // } else {
      //   console.log("after pause   old  window ")
      //     await logger.logInto(await stackTrace.get(), "No new window detected", 'error');
      // }
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperLinkAnswer is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_hyperlinkAudio: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperlinkAudio);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperlinkAudio is clicked"
      );

      // for play the audio
      await $(this.hyperAudioPlay_pause).waitForDisplayed();
      await $(this.hyperAudioPlay_pause).click();
      await browser.pause(1000);

      await $(this.HyperShowHideTranscript).waitForDisplayed();
      await $(this.HyperShowHideTranscript).click();
      await browser.pause(1000);

      // await $(this.hyperAudioPlay_pause).waitForDisplayed();
      // await $(this.hyperAudioPlay_pause).click();
      // await browser.pause(1000);

      await $(this.HyperShowHideTranscript).waitForDisplayed();
      await $(this.HyperShowHideTranscript).click();
      await browser.pause(1000);

      // // for pause the audio
      //            await $("button[class='plyr__control playpause plyr__control--pressed plyr__tab-focus'] div[class='icon--pressed'] span[class='glyph']").waitForDisplayed();
      //            await $("button[class='plyr__control playpause plyr__control--pressed plyr__tab-focus'] div[class='icon--pressed'] span[class='glyph']").click();
      //            //await $("div[class='ctrls'] div[class='icon--not-pressed'] span[class='glyph']").click();
      //            await browser.pause(5000)

      await $(this.hyperAudioClose).waitForDisplayed();
      await $(this.hyperAudioClose).click();
      await browser.pause(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperlinkAudio is NOT clicked",
        "error"
      );
    }
    return res;
  },

  // hyper link clicked answer new window
  // isInitialized: async function ()
  // {
  // var res;
  // await logger.logInto(await stackTrace.get());
  // await action.waitForDocumentLoad();
  // res = {
  // pageStatus: await action.waitForDisplayed(this.hyperAnswerReveal),
  // };
  // return res;
  // },

  // getData_ebookHyperlinkAnswer: async function ()
  // {
  // await logger.logInto(await stackTrace.get());
  // var obj;
  // obj = {
  // hyperAnswerReveal:(( await action.getElementCount(this.hyperAnswerReveal)) > 0) ? await action.getText(this.hyperAnswerReveal) : null,
  // hyperAnswerClose:(( await action.getElementCount(this.hyperAnswerClose)) > 0) ? await action.getText(this.hyperAnswerClose) : null,
  // hyperAnswerFullScreen:(( await action.getElementCount(this.hyperAnswerFullScreen)) > 0) ? await action.getText(this.hyperAnswerFullScreen) : null,
  // hyperAnswerQuestion:(( await action.getElementCount(this.hyperAnswerQuestion)) > 0) ? await action.getText(this.hyperAnswerQuestion) : null,
  // }
  // return obj;
  // },

  // click_hyperAnswerReveal: async function () {
  // await logger.logInto(await stackTrace.get());
  // var res;
  // res =await action.click(this.hyperAnswerReveal);
  // if (true == res) {
  // await logger.logInto(await stackTrace.get(), " hyperAnswerReveal is clicked");
  // }
  // else {
  // await logger.logInto(await stackTrace.get(), res +"hyperAnswerReveal is NOT clicked", 'error');
  // }
  // return res;
  // },

  // click_hyperAnswerClose: async function () {
  // await logger.logInto(await stackTrace.get());
  // var res;
  // res =await action.click(this.hyperAnswerClose);
  // if (true == res) {
  // await logger.logInto(await stackTrace.get(), " hyperAnswerClose is clicked");
  // }
  // else {
  // await logger.logInto(await stackTrace.get(), res +"hyperAnswerClose is NOT clicked", 'error');
  // }
  // return res;
  // },

  // click_hyperAnswerFullScreen: async function () {
  // await logger.logInto(await stackTrace.get());
  // var res;
  // res =await action.click(this.hyperAnswerFullScreen);
  // if (true == res) {
  // await logger.logInto(await stackTrace.get(), " hyperAnswerFullScreen is clicked");
  // }
  // else {
  // await logger.logInto(await stackTrace.get(), res +"hyperAnswerFullScreen is NOT clicked", 'error');
  // }
  // return res;
  // },

  click_hyperAudioPlay_pause: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperAudioPlay_pause);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperAudioPlay_pause is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperAudioPlay_pause is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_hyperAudioClose: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.hyperAudioClose);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperAudioClose is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperAudioClose is NOT clicked",
        "error"
      );
    }
    return res;
  },

click_toggleLayoutBtn: async function () {
  await logger.logInto(await stackTrace.get());
  

  var res;
  try {
    
    res = await action.click(this.toggleLayoutBtn);
    

    if (true == res) {
      await logger.logInto(await stackTrace.get(), "toggleLayoutBtn is clicked");
      

      let classList = await action.getAttribute("#readerpagedivB", "class");
      

      if (classList && classList.includes("reader-display-none")) {
        await logger.logInto(await stackTrace.get(), "Single page layout is active");
        
        res = "single-page";
      } else {
        
        res = "double-page";
      }
    } else {
      await logger.logInto(await stackTrace.get(), res + " toggleLayoutBtn is NOT clicked", "error");
      
    }
  } catch (error) {
    
    res = false;
  }

  
  return res;
},


  click_fitToScreenBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.fitToScreenBtn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " fitToScreenBtn is clicked"
      );

      let classList = await action.getAttribute(this.fitToScreenBtn, "class");
      const isDisabled = classList.includes("disabled");
      return isDisabled;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "fitToScreenBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_fitToWidthBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.fitToWidthBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " fitToWidthBtn is clicked");

      let classList = await action.getAttribute(this.fitToWidthBtn, "class");
      const isDisabled = classList.includes("disabled");
      return isDisabled;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "fitToWidthBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_zoomInBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    const initialWidth = await action.getCSSProperty(
      this.readerContainerWrapper,
      "width"
    );
    const initialHeight = await action.getCSSProperty(
      this.readerContainerWrapper,
      "height"
    );

    res = await action.click(this.zoomInBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " zoomInBtn is clicked");
      const newWidth = await action.getCSSProperty(
        this.readerContainerWrapper,
        "width"
      );
      const newHeight = await action.getCSSProperty(
        this.readerContainerWrapper,
        "height"
      );

      // Check if width and height have increased
      const isZoomedIn =
        parseFloat(newWidth.value) > parseFloat(initialWidth.value) &&
        parseFloat(newHeight.value) > parseFloat(initialHeight.value);
      return isZoomedIn;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "zoomInBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_previousPage: async function () {
    await logger.logInto(await stackTrace.get());
    var res;

    res = await action.click(this.previousPage);
    //res = await action.click("button[qid='75']");
    await browser.pause(9000);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " previous page button is clicked"
      );

      const pageText = await $(this.pageNOShow).getText();
      res = pageText;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "previous page button is NOT clicked",
        "error"
      );
    }
    return res;
  },
  click_nextPage: async function () {
    await logger.logInto(await stackTrace.get());
    var res;

    res = await action.click(this.nextPage);

    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " next page button is clicked"
      );
      await action.waitForDisplayed(this.pageNOShow);
      await browser.pause(9000);
      const pageText = await $(this.pageNOShow).getText(); // or getProperty('innerText') if getText() doesn't work as expected

      res = pageText;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "next page button is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_zoomOutBtn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    const initialWidth = await action.getCSSProperty(
      this.readerContainerWrapper,
      "width"
    );
    const initialHeight = await action.getCSSProperty(
      this.readerContainerWrapper,
      "height"
    );
    res = await action.click(this.zoomOutBtn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " zoomOutBtn is clicked");
      const newWidth = await action.getCSSProperty(
        this.readerContainerWrapper,
        "width"
      );
      const newHeight = await action.getCSSProperty(
        this.readerContainerWrapper,
        "height"
      );
      const isZoomedOut =
        parseFloat(newWidth.value) < parseFloat(initialWidth.value) &&
        parseFloat(newHeight.value) < parseFloat(initialHeight.value);
      return isZoomedOut;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "zoomOutBtn is NOT clicked",
        "error"
      );
    }
    return res;
  },
};