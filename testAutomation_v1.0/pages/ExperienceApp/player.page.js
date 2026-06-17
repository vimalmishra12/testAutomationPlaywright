"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
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
  activityGoodEffort:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.activityGoodEffort,
  startAgainActivity:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.startAgainActivity,
  exitActivity: selectorFile.css.ComproC1.hyperLinkAnswerWindow.exitActivity,
  activityIFrame:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.activityIFrame,
  activityScoreCheck:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.activityScoreCheck,
  activityAnsElement:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.activityAnsElement,

  HyperShowHideTranscript:
    selectorFile.css.ComproC1.hyperLinkAnswerWindow.HyperShowHideTranscript,
  hyperAudioPlay_pause:
    selectorFile.css.ComproC1.hyperlinkAudio.hyperAudioPlay_pause,
  hyperAudioClose: selectorFile.css.ComproC1.hyperlinkAudio.hyperAudioClose,

  //   click_hyperlinkActivity: async function () {
  //     await logger.logInto(await stackTrace.get());
  //     let res;

  //     // Click on the hyperlink activity button
  //     res = await action.click(this.hyperlinkActivity);
  //     if (res === true) {
  //         await logger.logInto(await stackTrace.get(), "hyperLinkActivity is clicked");
  //         await browser.pause(2000); // Small delay for UI stability
  //         console.log("hyperLinkActivity clicked successfully.");

  //         const draggableItems = $$('ul.elements.pool .draggable.drag_item');

  //         // Selector for drop areas (assuming they're empty initially and indexed)
  //         const dropAreas = $$('ul.elements.pool .drop_item_zone.ui-droppable');

  //         // Loop through each draggable item and drag it to its respective drop area
  //         for (let i = 0; i < draggableItems.length; i++) {
  //             const item = draggableItems[i];
  //             const targetDropArea = dropAreas[i];

  //             // Perform drag-and-drop
  //             await item.dragAndDrop(targetDropArea);

  //             // Optional: Add a slight pause for visual confirmation during execution
  //             await browser.pause(500);
  //         }

  //         await browser.pause(10000);

  //         // Close the activity answer modal
  //         try {
  //             await $(this.hyperAnswerClose).waitForDisplayed({ timeout: 3000 });
  //             await $(this.hyperAnswerClose).click();
  //             console.log("Closed activity answer modal.");
  //         } catch (error) {
  //             console.error("Error closing the activity answer modal:", error);
  //             await logger.logInto(await stackTrace.get(), error.message, "error");
  //         }

  //     } else {
  //         // Log the failure if the hyperlink activity is not clicked
  //         await logger.logInto(
  //             await stackTrace.get(),
  //             `${res} - hyperLinkActivity is NOT clicked`,
  //             "error"
  //         );
  //     }
  //     return res;
  // },

  click_hyperlinkActivity: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    await browser.waitUntil(async () => {
      return await action.isDisplayed(this.hyperlinkActivity);
    }, { timeout: 10000, timeoutMsg: 'Activity hyperlink not found within 10 seconds' });

    res = await action.click(this.hyperlinkActivity);

    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " hyperLinkActivity is clicked"
      );
      await browser.pause(4000);

      const frameElement = await action.findElement(this.activityIFrame);
      const boole = await action.switchToFrame(frameElement);
      //console.log(boole + "1008");

      for (let i = 1; i <= 12; i++) {
        // const selector = `li:nth-child(${i})`;
        await browser.pause(2000);
        //const selector =".draggable button[aria-labelledby^=\"content-\"]"
        await action.click(this.activityAnsElement);
        await browser.pause(2000);
      }
      //console.log("1008 ");

      await action.switchToParentFrame();

      await browser.pause(2000);

      // await action.waitForDisplayed(this.activityScoreCheck);
      // await action.click(this.activityScoreCheck);
      

      //await action.switchToParentFrame();

      // await browser.pause(300);

      // await action.waitForDisplayed(this.hyperActivityNext);
      // await action.click(this.hyperActivityNext);
      // await browser.pause(2000);

      //const pageText = await $(this.activityGoodEffort).getText();
      // const pageText = await action.getText(this.activityGoodEffort);
      // res = pageText;

      // await action.waitForDisplayed(this.startAgainActivity);
      // await action.click(this.startAgainActivity);
      // await browser.pause(2000);

      // await action.waitForDisplayed(this.hyperAnswerClose);
      // await action.click(this.hyperAnswerClose);
      // await browser.pause(2000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperLinkActivity is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_hyperlinkNewTab: async function () {
    await logger.logInto(await stackTrace.get());
    let res;
    
    // Store the initial number of pages to detect the new tab
    const context = global.page.context();
    const initialPagesCount = context.pages().length;
    
    res = await action.click(this.hyperlinkNewTab);
    console.log("val of res is hyperlinkNewTab: ", res);

    if (res === true) {
      await logger.logInto(
        await stackTrace.get(),
        "hyperlinkNewTab is clicked"
      );

      // Wait for the new tab to open
      await browser.waitUntil(
        async () => {
          return context.pages().length > initialPagesCount;
        },
        {
          timeout: 5000,
          timeoutMsg: "New tab did not open within the timeout period",
        }
      );

      // Get the newly opened page
      const pages = context.pages();
      const newPage = pages[pages.length - 1];

      // Perform actions on the new tab (if needed)
      console.log("Performing actions on the new tab");

      await newPage.waitForLoadState('load');

      // Close the new tab
      await newPage.close();

      // Switch back to the original tab
      await global.page.bringToFront();

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

      await action.waitForDisplayed(this.hyperAudioClose);
      await action.click(this.hyperAudioClose);
      await global.page.waitForTimeout(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperlinkAudioNoTranscript is NOT clicked",
        "error"
      );
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

      await global.page.waitForTimeout(3000);
      await action.waitForDisplayed(this.hyperAnswerClose);
      await action.click(this.hyperAnswerClose);

      await global.page.waitForTimeout(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperLinkGame is NOT clicked",
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

      await action.waitForDisplayed(this.hyperAnswerFullScreen);
      await action.click(this.hyperAnswerFullScreen);
      await global.page.waitForTimeout(3000);

      await action.waitForDisplayed(this.hyperAnswerReveal);
      await action.click(this.hyperAnswerReveal);
      await global.page.waitForTimeout(3000);

      await action.waitForDisplayed(this.hyperAnswerExitFullScreen);
      await action.click(this.hyperAnswerExitFullScreen);
      await global.page.waitForTimeout(3000);

      await action.waitForDisplayed(this.hyperAnswerClose);
      await action.click(this.hyperAnswerClose);
      await global.page.waitForTimeout(3000);
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
      await action.waitForDisplayed(this.hyperAudioPlay_pause);
      await action.click(this.hyperAudioPlay_pause);
      await global.page.waitForTimeout(1000);

      await action.waitForDisplayed(this.HyperShowHideTranscript);
      await action.click(this.HyperShowHideTranscript);
      await global.page.waitForTimeout(1000);

      await action.waitForDisplayed(this.HyperShowHideTranscript);
      await action.click(this.HyperShowHideTranscript);
      await global.page.waitForTimeout(1000);

      await action.waitForDisplayed(this.hyperAudioClose);
      await action.click(this.hyperAudioClose);
      await global.page.waitForTimeout(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperlinkAudio is NOT clicked",
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

      await global.page.waitForTimeout(3000);

      await action.waitForDisplayed(this.hyperVideoClose);
      await action.click(this.hyperVideoClose);
      await global.page.waitForTimeout(3000);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "hyperLinkAnswer is NOT clicked",
        "error"
      );
    }
    return res;
  },
};
