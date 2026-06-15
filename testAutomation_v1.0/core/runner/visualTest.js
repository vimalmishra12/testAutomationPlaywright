"use strict";
var rootDir = process.cwd();
var mergeImg = require(path.join(rootDir, "/core/utils/mergeImage.js"));
// Playwright-native visual diff engine (pixelmatch) — replaces WDIO's novus
// browser.checkDocument(). See core/utils/visualCompare.js.
var visualCompare = require(path.join(rootDir, "/core/utils/visualCompare.js"));
var hideSelectors = [
  // 'class="copyright mb-0"'
];
var excludeSelectors = [];

// Applitools (eyes-playwright) is loaded LAZILY — only when --visual=applitools is
// used — so the default pixelmatch path has no hard dependency on the SDK or an API
// key. lazyEyes() throws a clear, actionable error if the path is used without setup.
var Target = null;
var eyes = null;
function lazyEyes() {
  if (eyes) return eyes;
  let sdk;
  try {
    sdk = require("@applitools/eyes-playwright");
  } catch (_) {
    throw new Error(
      "--visual=applitools requires the eyes-playwright SDK. Install it with " +
      "`npm i -D @applitools/eyes-playwright` and set APPLITOOLS_API_KEY."
    );
  }
  Target = sdk.Target;
  eyes = new sdk.Eyes();
  return eyes;
}

var action = require(rootDir + "/core/actionLibrary/baseActionLibrary");
var labelsDir = "/screenshots/labels/" + global.view;

module.exports = {
  //function for writing visual test's logs
  setVisualReportData(testExecFile, visualTotalTc, startTime, endTime, suites) {
    let visualPassedTc = 0;
    let visualFailedTc = 0;
    for (var suiteindex = 0; suiteindex < suites.length; ) {
      for (var testindex = 0; testindex < suites[suiteindex].tests.length; ) {
        if (suites[suiteindex].tests[testindex].visual == "no") {
          suites[suiteindex].tests.splice(testindex, 1);
        } else {
          if (suites[suiteindex].tests[testindex].state === "failed")
            visualFailedTc = visualFailedTc + 1;

          if (suites[suiteindex].tests[testindex].state === "passed")
            visualPassedTc = visualPassedTc + 1;
          testindex++;
        }
      }
      //visualTotalTc = visualTotalTc + suites[suiteindex].tests.length;
      if (suites[suiteindex].tests.length == 0) suites.splice(suiteindex, 1);
      else suiteindex++;
    }

    let logDataobj = {};
    (logDataobj.start = startTime),
      (logDataobj.end = endTime),
      (logDataobj.duration = endTime - startTime);
    // WDIO exposed browser.capabilities / browser.sessionId; under Playwright we
    // synthesise an equivalent block. The timeline report's getBrowserNameAndCombo()
    // reads capabilities.browserName / .browserVersion at the TOP level, but the
    // capability profile nests those under capabilities[0]. Flatten them (and pull the
    // REAL running browser version from Playwright) so the report shows e.g.
    // "chromium 126.0.x" instead of "unknown browser name unknown browser version".
    var profile =
      (global.capabilitiesFile && global.argv && global.capabilitiesFile[global.argv.browserCapability]) || {};
    var innerCap = (profile.capabilities && profile.capabilities[0]) || {};
    var browserVersion = "";
    try {
      if (global.browser && typeof global.browser.version === "function") {
        browserVersion = global.browser.version();
      }
    } catch (_) { /* best-effort */ }
    logDataobj.capabilities = {
      browserName:
        innerCap.browserName || profile.browserName || (global.argv && global.argv.browserCapability) || "chromium",
      browserVersion:
        browserVersion || innerCap.browserVersion || profile.browserVersion || "",
      platformName: (innerCap["LT:Options"] && innerCap["LT:Options"].platformName) || process.platform,
    };
    logDataobj.capabilities.sessionId = (global.__pwContext && global.__pwContext._guid) || "playwright";
    logDataobj.capabilities.screenResolution = {
      width: global.resolution.width,
      height: global.resolution.height,
    };
    logDataobj.specs = [testExecFile];
    logDataobj.suites = suites;
    logDataobj.state = {
      skipped: visualTotalTc - (visualPassedTc + visualFailedTc),
      passed: visualPassedTc,
      failed: visualFailedTc,
    };
    logDataobj.appVersion = global.appVersion;
    let filePath =
      rootDir +
      "/" +
      global.reportOutputDir +
      "/visual/" +
      testExecFile.split(".")[0] +
      "-visualReport-" +
      startTime +
      ".log";
    fs.openSync(filePath, "w");
    fs.writeFileSync(filePath, JSON.stringify(logDataobj));
  },

  //generate Screenshots and logs for Visual test for Novus
  generateScreenshotsAndLogs: async function (
    testObj,
    suiteIndex,
    testIndex,
    Arr,
    count
  ) {
    await this.enableFullPageScrolling();

    global.suiteKey = suiteIndex;
    global.tcNumber = parseInt(testIndex) + 1;
    global.tcId = testObj.id;
    var hideElements = [];

    // find all the elements to be hide while taking screenshots
    let codemod_placeholder_6971 = Object.keys(hideSelectors);
    /*for (const selector of codemod_placeholder_6971) {
            hideElements[selector] = await action.findElements(hideSelectors[selector]);
            console.log(hideSelectors[selector])
            console.log(hideElements[selector].length)
        };*/

    await Promise.all(
      codemod_placeholder_6971.map(async (selector) => {
        hideElements[selector] = await action.findElements(
          hideSelectors[selector]
        );
        //console.log(hideSelectors[selector])
        //console.log(hideElements[selector].length)
      })
    );

    var excludeElements = [];
    // find all the elements to be hide while taking screenshots
    let codemod_placeholder_2646 = Object.keys(excludeSelectors);

    for (const selector of codemod_placeholder_2646) {
      excludeElements[selector] = await action.findElements(
        await excludeSelectors[selector]
      );
    }
    //console.log(" Mismatch Percentage for " + execJsonData[suiteIndex].Test[testIndex].id + " = " + result[0].misMatchPercentage);
    var result = await visualCompare.checkDocument({
      exclude: excludeElements,
      hide: hideElements,
      misMatchTolerance: testObj.visualTolerance,
      fuzzLevel: testObj.visualTolerance,
    });

    //await this.disableFullPageScrolling();

    await mergeImg.combineImages(
      [
        path.join(rootDir, labelsDir, "/baselineLbl.png"),
        path.join(
          rootDir,
          global.baseScreenshotDir,
          global.testFileName,
          global.screenshotName
        ),
      ],
      path.join(
        rootDir,
        global.reportOutputDir,
        "/visual/baseline-" + global.screenshotName
      ),
      "row"
    );

    await mergeImg.combineImages(
      [
        path.join(rootDir, labelsDir, "/testLbl.png"),
        path.join(
          rootDir,
          global.testScreenshotDir,
          global.testFileName,
          global.screenshotName
        ),
      ],
      path.join(
        rootDir,
        global.reportOutputDir,
        "/visual/test-" + global.screenshotName
      ),
      "row"
    );

    Arr[count].tests[testIndex] = Object.assign(
      Arr[count].tests[testIndex],
      result[0]
    );
    console.log(
      " Mismatch Percentage for " +
        global.screenshotName +
        " in " +
        global.testFileName +
        " = " +
        result[0].misMatchPercentage
    );

    if (result[0].isWithinMisMatchTolerance == true) {
      Arr[count].tests[testIndex].state = "passed";
      Arr[count].tests[testIndex].screenshots = [
        path.join(rootDir, global.reportOutputDir, "/visual/baseline-" + global.screenshotName),
        path.join(rootDir, global.reportOutputDir, "/visual/test-" + global.screenshotName),
      ];
    } else {
      Arr[count].tests[testIndex].state = "failed";
      Arr[count].tests[testIndex].screenshots = [
        path.join(rootDir, global.reportOutputDir, "/visual/baseline-" + global.screenshotName),
        path.join(rootDir, global.reportOutputDir, "/visual/test-" + global.screenshotName),
        path.join(rootDir, global.reportOutputDir, "/visual/diff-" + global.screenshotName),
      ];
      await mergeImg.combineImages(
        [
          path.join(rootDir, labelsDir, "/diffLbl.png"),
          path.join(
            rootDir,
            global.diffScreenshotDir,
            global.testFileName,
            global.screenshotName
          ),
        ],
        path.join(
          rootDir,
          global.reportOutputDir,
          "/visual/diff-" + global.screenshotName
        ),
        "row"
      );
    }

    // merge condition for mobile mode
    if (
      result[0].isWithinMisMatchTolerance == true &&
      global.view == "mobile"
    ) {
      await mergeImg.combineImages(
        [
          path.join(
            rootDir,
            global.reportOutputDir,
            "/visual/baseline-" + global.screenshotName
          ),
          path.join(
            rootDir,
            global.reportOutputDir,
            "/visual/test-" + global.screenshotName
          ),
        ],
        path.join(
          rootDir,
          global.reportOutputDir,
          "/visual/merge-" + global.screenshotName
        ),
        "col"
      );
      Arr[count].tests[testIndex].screenshots = [
        path.join(rootDir, global.reportOutputDir, "/visual/merge-" + global.screenshotName),
      ];
    } else if (
      result[0].isWithinMisMatchTolerance == false &&
      global.view == "mobile"
    ) {
      await mergeImg.combineImages(
        [
          path.join(
            rootDir,
            global.reportOutputDir,
            "/visual/baseline-" + global.screenshotName
          ),
          path.join(
            rootDir,
            global.reportOutputDir,
            "/visual/test-" + global.screenshotName
          ),
          path.join(
            rootDir,
            global.reportOutputDir,
            "/visual/diff-" + global.screenshotName
          ),
        ],
        path.join(
          rootDir,
          global.reportOutputDir,
          "/visual/merge-" + global.screenshotName
        ),
        "col"
      );
      Arr[count].tests[testIndex].screenshots = [
        path.join(rootDir, global.reportOutputDir, "/visual/merge-" + global.screenshotName),
      ];
    }
    return Arr[count];
  },

  //take screenshot for Applitools (eyes-playwright — operates on global.page)
  generateScreenshotsApplitools: async function (testObj) {
    const e = lazyEyes();
    //Ignore Region Capability — Applitools
    if (testObj.visualTolerance) {
      await e.check(
        testObj.id,
        Target.window().fully().ignoreRegions(testObj.visualTolerance)
      );
    }
    //Default screenshot capture — Applitools
    else {
      await e.check(testObj.id, Target.window().fully());
    }
  },

  //setting params to initiate Applitools. Config comes from global.eyesConfig
  //(optional) and APPLITOOLS_API_KEY; the eyes-playwright SDK reads the env var
  //automatically, so an explicit apiKey is only set when provided.
  initiateApplitools: async function () {
    console.log("applitools Initiated..");
    const e = lazyEyes();
    const cfg = global.eyesConfig || {};
    if (cfg.matchLevel) e.setMatchLevel(cfg.matchLevel);
    if (cfg.batch) e.setBatch(cfg.batch);
    const apiKey = process.env.APPLITOOLS_API_KEY || cfg.apiKey;
    if (apiKey) e.setApiKey(apiKey);
  },

  //open Applitools eyes against the current Playwright page
  openApplitoolsEyes: async function (suiteIndex, suiteName) {
    const e = lazyEyes();
    await e.open(global.page, "Engage", suiteIndex + " - " + suiteName, {
      width: global.resolution.width,
      height: global.resolution.height,
    });
  },

  //closing Applitools Eyes
  closeApplitoolsEyes: async function () {
    if (eyes) await eyes.close();
  },

  //change scroolbarDiv property
  enableFullPageScrolling: async function () {
    await browser.execute(() => {
      var elem = document.getElementById("data-js-focus-visible");
      // var elem = document.getElementById("container p-0 m-0 container-fluid d-flex flex-column c1-onboarding-home-container");
      console.log(elem);
      // elem.setAttribute("style", "overflow-y: visible !important")
      //elem.classList.add("overflow-y-visible");
      //console.log(elem.getAttribute("class"));
    });
  },

  //change scroolbarDiv property
  disableFullPageScrolling: async function () {
    await browser.execute(() => {
      var elem = document.getElementById("scroolbarDiv");
      elem.classList.remove("overflow-y-visible");
      //console.log(elem.getAttribute("class"));
    });
  },
};
