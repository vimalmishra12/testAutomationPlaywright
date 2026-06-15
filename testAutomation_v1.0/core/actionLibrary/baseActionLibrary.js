"use strict";
// [2026-06-11] Playwright migration (Prompt 4 / Phase 1) — confirmed by user.
// Every method re-implemented on Playwright page.locator() (decision D2).
// PRESERVED: method names, parameters, logger/stackTrace logging, and the
// true / Error return pattern (ADR-009). Page Objects are unchanged where they
// go through this library. Playwright auto-waits, but the explicit waitFor*
// methods are kept because Page Objects call them.

var res, res2;
var message;

// [2026-06-11] Playwright migration (Prompt 4 / Phase 2 / Category C) — confirmed by user.
// el()/els() now accept EITHER a CSS string OR an already-resolved Playwright Locator.
// Many page objects do `action.getKthElement(sel, k)` (which returns a Locator) and
// then pass that Locator back into action.click()/getText()/etc. Detecting a Locator
// here lets those methods work without rewriting every such page object.
function isLocator(x) {
    return x && typeof x === "object" && typeof x.click === "function" && typeof x.first === "function";
}
// [2026-06-11] Category C — iframe support. After switchToFrame(), element lookups
// must target the iframe, not the main page. root() returns the active FrameLocator
// (set by switchToFrame) or the page. String selectors resolve against root(); an
// already-resolved Locator is used as-is. global.__activeFrame is cleared per suite
// (playwright.setup.js createFreshContext) and by switchToParentFrame().
function root() {
    return global.__activeFrame || global.page;
}
// Single-element handle. WDIO's $() returned the FIRST match; Playwright locators
// are strict (throw on multi-match during actions). .first() restores WDIO semantics.
function el(selector) {
    return isLocator(selector) ? selector.first() : root().locator(selector).first();
}
// Multi-element locator (no .first()) — used for counts / lists.
function els(selector) {
    return isLocator(selector) ? selector : root().locator(selector);
}

// [2026-06-11] Reproduces WDIO's getCSSProperty `.parsed` object from a computed-style
// string. Colours -> { type:'color', rgba, hex }; lengths -> { type:'number', value, unit };
// otherwise { type:'string', value }. hex is lowercase 6-digit to match existing testdata
// (e.g. "#6019b5"); rgba is space-free to match rgba comparisons (e.g. "rgba(251,246,228,1)").
function toHex2(n) { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"); }
function parseCssValue(value) {
    const v = String(value || "").trim();
    const colour = v.match(/rgba?\(([^)]+)\)/i);
    if (colour) {
        const parts = colour[1].split(",").map((s) => parseFloat(s.trim()));
        const r = parts[0], g = parts[1], b = parts[2];
        const a = parts[3] !== undefined ? parts[3] : 1;
        return {
            type: "color",
            rgba: `rgba(${r},${g},${b},${a})`,
            hex: "#" + toHex2(r) + toHex2(g) + toHex2(b)
        };
    }
    const len = v.match(/^(-?[\d.]+)([a-z%]*)$/i);
    if (len) return { type: "number", value: parseFloat(len[1]), unit: len[2] || "", string: v };
    return { type: "string", value: v, string: v };
}

//base action
module.exports = {

    click: async function (selector, options) {
        message = "element:" + selector;
        try {
            await el(selector).scrollIntoViewIfNeeded().catch(() => {}); // best-effort; click auto-scrolls anyway
            await el(selector).click(options);
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    doubleClick: async function (selector) {
        message = "element:" + selector;
        try {
            await el(selector).dblclick();
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    isEnabled: async function (selector) {
        message = "element:" + selector;
        try {
            let result = await el(selector).isEnabled();
            await logger.logInto(await stackTrace.get(), message);
            return result;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    isClickable: async function (selector) {
        message = "element:" + selector;
        try {
            // Playwright has no direct "isClickable"; visible + enabled is the
            // closest equivalent to WDIO's isClickable.
            let result = (await el(selector).isVisible()) && (await el(selector).isEnabled());
            await logger.logInto(await stackTrace.get(), message);
            return result;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    isDisplayed: async function (selector) {
        message = "element:" + selector;
        try {
            // isVisible() returns false (does not throw) when the element is absent.
            let result = await el(selector).isVisible();
            await logger.logInto(await stackTrace.get(), message);
            return result;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    isSelected: async function (selector) {
        message = "element:" + selector;
        try {
            let result = await el(selector).isChecked();
            await logger.logInto(await stackTrace.get(), message);
            return result;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    setValue: async function (selector, value) {
        message = "element:" + selector + " value:" + value;
        try {
            // locator.fill() clears then types — replaces WDIO clearValue+setValue.
            await el(selector).fill(String(value));
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    addValue: async function (selector, value) {
        message = "element:" + selector + "value:" + value;
        try {
            // WDIO addValue appended without clearing → Playwright pressSequentially.
            await el(selector).pressSequentially(String(value));
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    getValue: async function (selector) {
        message = "element:" + selector;
        try {
            let result = await el(selector).inputValue();
            return result;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    clearValueDefault: async function (selector) {
        message = "element:" + selector;
        try {
            await el(selector).clear();
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    clearValue: async function (selector) {
        message = "element:" + selector;
        try {
            await el(selector).clear();
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    moveTo: async function (selector) {
        message = "element:" + selector;
        try {
            await el(selector).hover();
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    hoverCenter: async function (selector) {
        // Scrolls into view + hovers the element centre (Playwright hover does both).
        message = "element:" + selector;
        try {
            await el(selector).scrollIntoViewIfNeeded().catch(() => {});
            await el(selector).hover();
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    dragAndDrop: async function (draggable, droppable) {
        await logger.logInto(await stackTrace.get());
        message = "draggable:" + draggable + " droppable:" + droppable;
        try {
            await el(draggable).dragTo(el(droppable));
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    dragAndDrop2: async function (draggable, droppable) {
        // Manual pointer drag (some DnD libs ignore the synthetic dragTo events).
        await logger.logInto(await stackTrace.get());
        message = "draggable:" + draggable + " droppable:" + droppable;
        try {
            const src = await el(draggable).boundingBox();
            const dst = await el(droppable).boundingBox();
            if (!src || !dst) throw new Error("drag source/target not visible");
            await global.page.mouse.move(src.x + src.width / 2, src.y + src.height / 2);
            await global.page.mouse.down();
            await global.page.mouse.move(dst.x + dst.width / 2, dst.y + dst.height / 2, { steps: 10 });
            await global.page.mouse.up();
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    // waitFor* — reverse=true waits for the element to be HIDDEN/absent (WDIO reverse).
    waitForDisplayed: async function (selector, ms, reverse) {
        message = "element:" + selector;
        try {
            await el(selector).waitFor({ state: reverse ? "hidden" : "visible", timeout: ms });
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    waitForExist: async function (selector, ms, reverse) {
        message = "element:" + selector;
        try {
            await el(selector).waitFor({ state: reverse ? "detached" : "attached", timeout: ms });
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    waitForEnabled: async function (selector, ms) {
        message = "element:" + selector;
        try {
            // Playwright has no waitFor enabled state; poll via expect-style loop.
            await el(selector).waitFor({ state: "visible", timeout: ms });
            const deadline = Date.now() + (ms || 30000);
            while (!(await el(selector).isEnabled())) {
                if (Date.now() > deadline) throw new Error("element not enabled within timeout");
                await global.page.waitForTimeout(100);
            }
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    waitForClickable: async function (selector, ms) {
        message = "element:" + selector;
        try {
            await el(selector).waitFor({ state: "visible", timeout: ms });
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    getText: async function (selector) {
        message = "element:" + selector;
        try {
            // innerText matches WDIO getText (visible text) better than textContent.
            res = await el(selector).innerText();
            await logger.logInto(await stackTrace.get(), message + ":" + res);
            return res;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    getAttribute: async function (selector, attributeValue) {
        try {
            res = await el(selector).getAttribute(attributeValue);
            message = "element:" + selector + " attributeValue:" + attributeValue + " value:" + res;
            await logger.logInto(await stackTrace.get(), message);
            return res;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    getElementCount: async function (selector) {
        message = "element:" + selector;
        try {
            await logger.logInto(await stackTrace.get(), message);
            res = await els(selector).count();
            return res;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    getCSSProperty: async function (selector, propertyname) {
        try {
            // [2026-06-11] Playwright migration: WDIO's getCSSProperty returned a RICH
            // object — `{ property, value, parsed: { hex, rgba, ... } }`. Page objects read
            // `.parsed.hex` (hover-colour checks, NEMO-24388) and `.value`. Rebuild that
            // shape from the computed style so those call sites keep working.
            let value = await el(selector).evaluate(
                (node, prop) => window.getComputedStyle(node).getPropertyValue(prop),
                propertyname
            );
            value = (value || "").trim();
            const parsed = parseCssValue(value);
            // WDIO's getCSSProperty normalised colours to `rgba(r,g,b,a)` (no spaces) in `.value`.
            // Chromium's computed style returns opaque colours as `rgb(r, g, b)` (with spaces),
            // so normalise colour values to match the WDIO shape page objects assert against
            // (e.g. eBook TST_EBOO_TC_6 compares sts.value to "rgba(251,246,228,1)"). Non-colour
            // values (width/height/etc.) are left raw.
            const normalisedValue = parsed.type === "color" ? parsed.rgba : value;
            message = "element:" + selector + " propertyname:" + propertyname + " value:" + normalisedValue;
            await logger.logInto(await stackTrace.get(), message);
            return { property: propertyname, value: normalisedValue, parsed: parsed };
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    findElements: async function (selector) {
        message = "element:" + selector;
        try {
            await logger.logInto(await stackTrace.get(), message);
            res = await els(selector).all(); // array of Locators (decision D3 — .all())
            return res;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    findElement: async function (selector) {
        message = "element:" + selector;
        try {
            await logger.logInto(await stackTrace.get(), message);
            res = el(selector);
            return res;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    getKthElement: async function (selector, k) {
        // [2026-06-11] Category C: return a LAZY nth() locator instead of an eager
        // .all()[k] snapshot. Playwright re-resolves nth() at action time, so a click
        // targets the CURRENT kth element even if the list (e.g. dashboard eBook cards)
        // was still rendering when getKthElement was called — fixes flaky launch clicks.
        const count = await els(selector).count();
        if (k < 0 || k >= count) {
            console.warn("Invalid k: index out of range (k=" + k + ", count=" + count + ")");
            return null;
        }
        return els(selector).nth(k);
    },

    scrollIntoView: async function (selector) {
        message = "element:" + selector;
        try {
            await el(selector).scrollIntoViewIfNeeded();
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    switchToFrame: async function (id) {
        // [2026-06-11] Category C — iframe support. Playwright doesn't "switch" frames;
        // it scopes locators to a FrameLocator. We stash that on global.__activeFrame so
        // subsequent el()/els() lookups target the iframe (see root()). Accepts either a
        // CSS selector for the <iframe>, or an already-resolved Locator pointing at the
        // <iframe> (e.g. action.findElement(...)) — the latter via locator.contentFrame().
        message = "frame:" + id;
        try {
            if (isLocator(id)) {
                global.__activeFrame = id.contentFrame();
            } else {
                global.__activeFrame = global.page.frameLocator(id);
            }
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    switchToParentFrame: async function () {
        try {
            global.__activeFrame = null;
            await logger.logInto(await stackTrace.get(), "switchToParentFrame");
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    hideKeyboard: async function () {
        // No-op on desktop Playwright (was an Appium/mobile concern).
        return true;
    },

    waitForDocumentLoad: async function () {
        await logger.logInto(await stackTrace.get());
        try {
            // Wait for the document to finish loading, then best-effort wait for the
            // app's loading indicators to disappear. Each loader wait is guarded so a
            // missing loader (the common case) resolves instantly and never hangs.
            await global.page.waitForLoadState("load");
            const loaders = [
                "[data-tid=image-loader]",
                "[class*=rogress][class*=indeterminate]",
                "[class*=MuiSkeleton]"
            ];
            for (const sel of loaders) {
                await global.page.locator(sel).first()
                    .waitFor({ state: "hidden", timeout: 15000 })
                    .catch(() => { /* loader absent or still settling — non-fatal */ });
            }
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    selectByAttribute: async function (selector, attribute, value) {
        message = "element:" + selector;
        try {
            // WDIO selectByAttribute targeted <select>; map the common value/label cases.
            if (attribute === "value") await el(selector).selectOption({ value: String(value) });
            else if (attribute === "label") await el(selector).selectOption({ label: String(value) });
            else await el(selector).selectOption(String(value));
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    uploadFile: async function (localPath) {
        // WDIO returned a remote path string consumed by a later setValue on the
        // file input. Under Playwright there is no upload-then-setValue round trip;
        // callers should prefer setInputFiles(selector, localPath). We keep this
        // method returning the resolved absolute path so existing call sites that
        // do `setInputFiles`/`fill` with the result still receive a usable value.
        try {
            const abs = path.resolve(localPath);
            await logger.logInto(await stackTrace.get(), "uploadFile:" + abs);
            return abs;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    // Native Playwright file upload — sets files directly on an <input type=file>.
    setInputFiles: async function (selector, localPath) {
        message = "element:" + selector + " file:" + localPath;
        try {
            await els(selector).first().setInputFiles(path.resolve(localPath));
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    parentElement: async function (selector) {
        message = "element:" + selector;
        try {
            let result = el(selector).locator("xpath=..");
            await logger.logInto(await stackTrace.get(), message);
            return result;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    keyPress: async function (value) {
        message = "key:" + value;
        try {
            // WDIO browser.keys(value) accepted a string or array of keys.
            const keys = Array.isArray(value) ? value.join("") : value;
            await global.page.keyboard.press(keys);
            await logger.logInto(await stackTrace.get(), message);
            return true;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), err.message, "error");
            return err;
        }
    },

    getDrawingDataFromLocalStorage: async function (storageKey) {
        try {
            return await global.page.evaluate((key) => window.localStorage.getItem(key), storageKey);
        } catch (err) {
            await logger.logInto(await stackTrace.get(),
                `Unable to read drawing data from localStorage: ${err.message}`, "error");
            return null;
        }
    },

    parseDrawingLocalStorageData: async function (rawDrawingData) {
        if (!rawDrawingData) return null;
        try {
            const parsedDrawingData = JSON.parse(rawDrawingData);
            const pageIds = Object.keys(parsedDrawingData || {});
            if (pageIds.length === 0) return null;
            const latestPageId = pageIds[pageIds.length - 1];
            const latestEntry = parsedDrawingData[latestPageId];
            if (latestEntry?.payload) {
                try {
                    latestEntry.payload = JSON.parse(latestEntry.payload);
                } catch (payloadErr) {
                    await logger.logInto(await stackTrace.get(),
                        `Unable to parse drawing payload: ${payloadErr.message}`, "error");
                }
            }
            return { pageId: latestPageId, entry: latestEntry, allEntries: parsedDrawingData };
        } catch (err) {
            await logger.logInto(await stackTrace.get(),
                `Unable to parse drawing localStorage data: ${err.message}`, "error");
            return null;
        }
    },

    waitForDrawingLocalStorageData: async function (storageKey, validationOptions = {}) {
        const {
            timeout = 5000, expectedAction, expectedType = "annotation",
            expectedMarker, expectedPageId, allowMissing = false
        } = validationOptions;
        let latestRawData = null;
        try {
            // Replaces WDIO browser.waitUntil with Playwright's page.waitForFunction-free
            // poll loop (kept simple; this path is drawing-tool specific, not POC).
            const deadline = Date.now() + timeout;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                latestRawData = await this.getDrawingDataFromLocalStorage(storageKey);
                let ok = false;
                if (!latestRawData) {
                    ok = allowMissing;
                } else {
                    const parsedData = await this.parseDrawingLocalStorageData(latestRawData);
                    if (parsedData?.entry) {
                        const { pageId, entry } = parsedData;
                        const payloadData = entry?.payload?.data || "";
                        ok = true;
                        if (expectedPageId && pageId !== String(expectedPageId)) ok = false;
                        if (expectedAction && entry.action !== expectedAction) ok = false;
                        if (expectedType && entry.type !== expectedType) ok = false;
                        if (expectedMarker && !payloadData.includes(`"${expectedMarker}"`)) ok = false;
                    }
                }
                if (ok) break;
                if (Date.now() > deadline) {
                    if (!allowMissing) throw new Error("Expected drawing data was not found in localStorage");
                    break;
                }
                await global.page.waitForTimeout(100);
            }
        } catch (err) {
            if (!allowMissing) throw err;
        }
        return { raw: latestRawData, parsed: await this.parseDrawingLocalStorageData(latestRawData) };
    },

    validateDrawStored: async function (storageKey, validationOptions = {}, expectedType) {
        const storageState = await this.waitForDrawingLocalStorageData(storageKey, validationOptions);
        console.log(`Expected ${expectedType} data found in localStorage.`);
        return Boolean(storageState?.parsed?.entry);
    },

    validateEraserClearedAllDrawings: async function (storageKey, validationOptions = {}) {
        const { settleTime = 300, sampleCount = 3, sampleInterval = 200 } = validationOptions;
        await global.page.waitForTimeout(settleTime);
        for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
            const latestRawData = await this.getDrawingDataFromLocalStorage(storageKey);
            if (latestRawData !== null) {
                console.log("Remaining drawing data after eraser:", latestRawData);
                return false;
            }
            if (sampleIndex < sampleCount - 1) await global.page.waitForTimeout(sampleInterval);
        }
        console.log("No drawing data found after eraser.");
        return true;
    },

    isExisting: async function (selector) {
        message = "Checking if element exists" + selector;
        try {
            const result = (await els(selector).count()) > 0;
            await logger.logInto(await stackTrace.get(), `${message}: ${result}`);
            return result;
        } catch (err) {
            await logger.logInto(await stackTrace.get(), `Error in isExisting: ${err.message}`, "error");
            return false;
        }
    },

    dragAndDropWithPath: async function (
        canvasElementSelector,
        startPoint_x1, startPoint_y1,
        endPoint_x2, endPoint_y2,
        intermediatePoints = []
    ) {
        // Canvas freehand drag via Playwright mouse API (replaces WDIO performActions).
        const box = await el(canvasElementSelector).boundingBox();
        if (!box) throw new Error("canvas element not visible");
        const within = (x, y) => x >= 0 && x <= box.width && y >= 0 && y <= box.height;
        if (!within(startPoint_x1, startPoint_y1) || !within(endPoint_x2, endPoint_y2)) {
            throw new Error("❌ Starting or ending coordinates are out of canvas bounds.");
        }
        await global.page.mouse.move(box.x + startPoint_x1, box.y + startPoint_y1);
        await global.page.mouse.down();
        for (const p of intermediatePoints) {
            await global.page.mouse.move(box.x + p.x, box.y + p.y, { steps: 5 });
        }
        await global.page.mouse.move(box.x + endPoint_x2, box.y + endPoint_y2, { steps: 10 });
        await global.page.mouse.up();
    }
};
