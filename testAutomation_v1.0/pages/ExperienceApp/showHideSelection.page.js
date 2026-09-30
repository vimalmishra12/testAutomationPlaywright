"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
  hideSelection: selectorFile.css.ComproC1.showHideSelection.hideSelection,
  showSelection: selectorFile.css.ComproC1.showHideSelection.showSelection,
  closeSelection: selectorFile.css.ComproC1.showHideSelection.closeSelection,
  showSelectionBoxSelector: selectorFile.css.ComproC1.showHideSelection.showSelectionBoxSelector,
  hideSelectionBoxSelector: selectorFile.css.ComproC1.showHideSelection.hideSelectionBoxSelector,
  drawingToolPresentation:
    selectorFile.css.ComproC1.drawingTool.drawingToolPresentation,


  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.hideSelection),
    };
    return res;
  },

  getData_showAndHideSelection: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      hideSelection:
        (await action.getElementCount(this.hideSelection)) > 0
          ? await action.getText(this.hideSelection)
          : null,
      showSelection:
        (await action.getElementCount(this.showSelection)) > 0
          ? await action.getText(this.showSelection)
          : null,
      closeSelection:
        (await action.getElementCount(this.closeSelection)) > 0
          ? await action.getText(this.closeSelection)
          : null,
    };
    return obj;
  },

  click_hideSelection: async function () {
    await logger.logInto(await stackTrace.get());
    let res;

    // [2026-06-11] Playwright port: was hideSelectionElement.waitForClickable() — a WDIO
    // element method that doesn't exist on a Playwright Locator. Route through the action
    // library (action.click auto-waits anyway, so this is just an explicit readiness check).
    await action.waitForClickable(this.hideSelection, 5000);

    res = await action.click(this.hideSelection);

    if (res === true) {
        await logger.logInto(await stackTrace.get(), "hideSelection is clicked");

        // Perform drag-and-drop action
        await action.dragAndDropWithPath(
            this.drawingToolPresentation,
            100,
            100,
            300,
            300
        );
        const isHideBoxPresent = await action.isExisting(this.hideSelectionBoxSelector);
        await browser.pause(2000); // Wait for the effect to appear

        if (isHideBoxPresent) {
            await logger.logInto(
                await stackTrace.get(),
                "Hide selection box is displayed correctly."
            );
        } else {
            await logger.logInto(
                await stackTrace.get(),
                "Hide selection box is NOT displayed.",
                "error"
            );
            res = false; // Update the result to indicate failure
        }
    } else {
        await logger.logInto(
            await stackTrace.get(),
            res + " hideSelection is NOT clicked",
            "error"
        );
    }
    return res; // Return the result
  },

  click_showSelection: async function () {
    await logger.logInto(await stackTrace.get());
    let res = true;
    try {
      await logger.logInto(await stackTrace.get(), "ShowSelection is clicked");
      await action.waitForDisplayed(this.drawingToolPresentation, 5000);
      await action.dragAndDropWithPath(this.drawingToolPresentation, 100, 100, 300, 300);
      const isShowBoxPresent = await browser.waitUntil(
        async () => await action.isExisting(this.showSelectionBoxSelector),
        {
          timeout: 10000,
          timeoutMsg: "Selection box never appeared after drag.",
        }
      );
      if (isShowBoxPresent) {
        await logger.logInto(await stackTrace.get(), "Show selection box is displayed correctly.");
      } else {
        await logger.logInto(await stackTrace.get(), "Show selection box is NOT displayed.", "error");
        res = false;
      }
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      res = false;
    }
    return res;
  },

  click_closeSelection: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    var closeSel = "i.nemo-close-new, .nemo-close-new, [id^='spotlight-div-'] i, [id^='mask-div-'] i, button.close";
    if (await action.isDisplayed(closeSel)) {
      res = await action.click(closeSel);
    } else {
      res = await action.click(this.closeSelection);
    }
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " closeSelection is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "closeSelection is NOT clicked",
        "error"
      );
    }
    return res;
  },
};
