"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var cm = selectorFile.css.ComproC1.classMaterials;

module.exports = {
  materialsTab: cm.materialsTab,
  materialsContainer: cm.materialsContainer,
  bundleContainer: cm.bundleContainer,
  bundleCollapseLink: cm.bundleCollapseLink,
  bundleTitle: cm.bundleTitle,
  componentLink: cm.componentLink,
  componentName: cm.componentName,
  componentByNameInBundle: cm.componentByNameInBundle,
  componentByName: cm.componentByName,
  bundleCollapseByName: cm.bundleCollapseByName,
  bundleToggleByName: cm.bundleToggleByName,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var res = {
      pageStatus: (await action.waitForDisplayed(this.materialsContainer, 15000)) === true
    };
    return res;
  },

  click_materialsTab: async function () {
    await logger.logInto(await stackTrace.get());
    var res = { pageStatus: false };
    var displayed = (await action.waitForDisplayed(this.materialsTab, 15000)) === true;
    if (!displayed) {
      await logger.logInto(await stackTrace.get(), "Materials tab is not displayed", "error");
      return res;
    }
    var clicked = await action.click(this.materialsTab);
    if (!clicked) {
      await logger.logInto(await stackTrace.get(), "Materials tab click failed", "error");
      return res;
    }
    await action.waitForDocumentLoad();
    res.pageStatus = (await action.waitForDisplayed(this.materialsContainer, 20000)) === true;
    return res;
  },

  isBundleDisplayed: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var bundleName = typeof testdata === "object" ? (testdata.name || testdata.bundleName) : testdata;
    var bundleHeaderSel = this.bundleCollapseByName.replace("{{bundleName}}", bundleName);
    var displayed = (await action.waitForDisplayed(bundleHeaderSel, 15000)) === true;
    return {
      bundleDisplayed: displayed,
      pageStatus: displayed
    };
  },

  click_component: async function (testdata) {
    await logger.logInto(await stackTrace.get());
    var res = { pageStatus: false };
    var bundleName = testdata.bundleName || testdata.bundle;
    var componentName = testdata.componentName || testdata.name || testdata;

    // Resolve component locator dynamically (order-independent)
    var componentSel = bundleName
      ? this.componentByNameInBundle.replace("{{bundleName}}", bundleName).replace("{{componentName}}", componentName)
      : this.componentByName.replace("{{componentName}}", componentName);

    // Check if the component is already visible
    var isCompDisplayed = (await action.isDisplayed(componentSel)) === true;

    if (!isCompDisplayed && bundleName) {
      // Bundle might be collapsed. Toggle it open via toggle-icon or collapse link
      var toggleSel = this.bundleToggleByName.replace("{{bundleName}}", bundleName);
      var collapseSel = this.bundleCollapseByName.replace("{{bundleName}}", bundleName);

      await logger.logInto(await stackTrace.get(), "Component not visible yet, clicking bundle toggle for: " + bundleName);

      if ((await action.isDisplayed(toggleSel)) === true) {
        await action.click(toggleSel);
      } else if ((await action.isDisplayed(collapseSel)) === true) {
        await action.click(collapseSel);
      }
      await browser.pause(1500);

      // Now wait for the component to be displayed inside the expanded bundle
      isCompDisplayed = (await action.waitForDisplayed(componentSel, 15000)) === true;
    }

    if (!isCompDisplayed) {
      // Fallback: try matching component by text across all containers
      componentSel = this.componentByName.replace("{{componentName}}", componentName);
      isCompDisplayed = (await action.waitForDisplayed(componentSel, 10000)) === true;
    }

    if (!isCompDisplayed) {
      await logger.logInto(await stackTrace.get(), "Component not found or not displayed: " + componentName, "error");
      return res;
    }

    // Capture tab count in case component opens in a new tab
    var initialPageCount = action.getPageCount();

    await logger.logInto(await stackTrace.get(), "Clicking component: " + componentName);
    var clicked = await action.click(componentSel);
    if (!clicked) {
      await logger.logInto(await stackTrace.get(), "Failed to click component: " + componentName, "error");
      return res;
    }

    await browser.pause(3000);

    // Switch to new tab if one was opened
    if (action.getPageCount() > initialPageCount) {
      await logger.logInto(await stackTrace.get(), "New tab detected (" + action.getPageCount() + " pages), switching to it");
      await action.switchToNewTab(initialPageCount, 20000);
    } else {
      await action.waitForDocumentLoad();
    }

    res.pageStatus = true;
    return res;
  }
};
