"use strict";

/**
 * Playwright-native visual comparison — the replacement for the retired WDIO
 * `wdio-novus-visual-regression-service` (`browser.checkDocument`). Phase 3 / D7.
 *
 * Captures a full-page screenshot via Playwright, compares it to a baseline with
 * pixelmatch/pngjs, bootstraps the baseline on first run, writes a diff on mismatch,
 * and returns the SAME resemble-style result array the rest of visualTest.js and the
 * custom timeline report already consume:
 *   [{ misMatchPercentage, isWithinMisMatchTolerance, isSameDimensions, isExactSameImage }]
 *
 * Screenshot naming is reproduced exactly from the novus `getScreenshotName`
 * (recovered from the deleted wdio.conf.js):
 *   testFileName   = running spec name (we use the exec-file basename — stable across runs)
 *   screenshotName = `${global.suiteKey}-${pad2(global.tcNumber)}-${global.tcId}.png`
 *   reference  -> global.baseScreenshotDir/testFileName/screenshotName
 *   screenshot -> global.testScreenshotDir/testFileName/screenshotName
 *   diff       -> global.diffScreenshotDir/testFileName/screenshotName
 */

const fs = require("fs");
const nodePath = require("path");
const { PNG } = require("pngjs");
// pixelmatch v7 is ESM-only — require() returns the module namespace, so the
// callable lives on `.default`. Fall back to the module itself for older CJS builds.
const _pixelmatchMod = require("pixelmatch");
const pixelmatch = _pixelmatchMod.default || _pixelmatchMod;

function pad2(n) {
    return String(n).length === 1 ? "0" + n : String(n);
}

function ensureParent(filePath) {
    fs.mkdirSync(nodePath.dirname(filePath), { recursive: true });
}

// Sets global.testFileName + global.screenshotName the way the novus service did.
function buildNames() {
    if (!global.testFileName) {
        const exec = (global.argv && global.argv.testExecFile) || "visual";
        global.testFileName = String(exec).replace(/\.[^.]+$/, "");
    }
    global.screenshotName =
        global.suiteKey + "-" + pad2(global.tcNumber) + "-" + global.tcId + ".png";
    return global.screenshotName;
}

/**
 * pixelmatch-based equivalent of the WDIO novus `browser.checkDocument()`.
 * @param {Object} opts { misMatchTolerance, fuzzLevel }  (tolerance is a PERCENTAGE; default 15)
 * @returns {Promise<Array>} single-element resemble-style result array
 */
async function checkDocument(opts) {
    opts = opts || {};
    const tolerance = Number(opts.misMatchTolerance != null ? opts.misMatchTolerance : 15);

    buildNames();
    const baselinePath = nodePath.join(process.cwd(), global.baseScreenshotDir, global.testFileName, global.screenshotName);
    const testPath = nodePath.join(process.cwd(), global.testScreenshotDir, global.testFileName, global.screenshotName);
    const diffPath = nodePath.join(process.cwd(), global.diffScreenshotDir, global.testFileName, global.screenshotName);

    // 1) Capture the current full-page screenshot.
    ensureParent(testPath);
    const buf = await global.page.screenshot({ fullPage: true });
    fs.writeFileSync(testPath, buf);
    const testPng = PNG.sync.read(buf);

    // 2) First run for this screenshot → bootstrap the baseline and pass.
    if (!fs.existsSync(baselinePath)) {
        ensureParent(baselinePath);
        fs.writeFileSync(baselinePath, buf);
        return [{
            misMatchPercentage: 0,
            isWithinMisMatchTolerance: true,
            isSameDimensions: true,
            isExactSameImage: true,
            isNewBaseline: true,
        }];
    }

    // 3) Compare against the existing baseline.
    const basePng = PNG.sync.read(fs.readFileSync(baselinePath));
    const sameDimensions = basePng.width === testPng.width && basePng.height === testPng.height;

    let mismatchPct;
    if (sameDimensions) {
        const { width, height } = basePng;
        const diff = new PNG({ width, height });
        const diffPixels = pixelmatch(basePng.data, testPng.data, diff.data, width, height, { threshold: 0.1 });
        mismatchPct = (diffPixels / (width * height)) * 100;
        ensureParent(diffPath);
        fs.writeFileSync(diffPath, PNG.sync.write(diff));
    } else {
        // Different dimensions can't be pixel-diffed — treat as a full mismatch and
        // surface the current capture as the "diff" so the report still shows something.
        mismatchPct = 100;
        ensureParent(diffPath);
        fs.writeFileSync(diffPath, buf);
    }

    const pct = Number(mismatchPct.toFixed(2));
    return [{
        misMatchPercentage: pct,
        isWithinMisMatchTolerance: pct <= tolerance,
        isSameDimensions: sameDimensions,
        isExactSameImage: pct === 0,
    }];
}

module.exports = { checkDocument, buildNames };
