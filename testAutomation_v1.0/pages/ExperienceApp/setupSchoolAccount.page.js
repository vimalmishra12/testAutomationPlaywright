"use strict";
var action = require('../../core/actionLibrary/baseActionLibrary.js');
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
    // Resolves to C1Selectors.json → css.ComproC1.setupSchoolAccount.primaryBtn
    // button.btn-purple is confirmed present on every wizard step — used as the stable init signal
    pageHeading: selectorFile.css.ComproC1.setupSchoolAccount.primaryBtn,

    isInitialized: async function () {
        var res;
        await logger.logInto(await stackTrace.get());
        await action.waitForDocumentLoad();
        res = {
            pageStatus: await action.waitForDisplayed(this.pageHeading)
        };
        return res;
    },

    /**
     * Hovers the primary "Next" button and returns its background-color CSS property.
     * Used to verify the purple hover colour change per NEMO-24388.
     */
    getHoverColor_primaryButton: async function () {
        await logger.logInto(await stackTrace.get(), 'getHoverColor_primaryButton');
        var res;
        // Resolves to C1Selectors.json → css.ComproC1.setupSchoolAccount.primaryBtn
        let selector = selectorFile.css.ComproC1.setupSchoolAccount.primaryBtn;
        // This shared hover fn is reused across all 8 wizard steps (ADR-011). On the long Address
        // step the button sits below the fold and moveTo() does not auto-scroll, so we use
        // hoverCenter() which scrolls the button to viewport centre before the pointer move to
        // avoid "move target out of bounds". Harmless on steps where the button is already in view.
        res = await action.hoverCenter(selector);
        // true == res intentional loose equality per ADR-009
        if (true == res) {
            // The :hover state triggers a CSS colour TRANSITION (default #8723ff → hover #6019b5).
            // On steps 2-8 the prior "Next" CLICK leaves the pointer on the button, so it is
            // genuinely hovered. On the navigated-to intro step the pointer is not on the button
            // and the freshly-loaded page settles/shifts, so a single hover does not stick — the
            // colour was read mid-transition (#691bc6) or fell back to the default (#8723ff).
            //
            // Fix: poll until the colour SETTLES (two consecutive identical reads), RE-ASSERTING
            // the hover each iteration so :hover is held while the transition completes and through
            // any layout shift. This stabilises the read without guessing a fixed duration.
            const SETTLE_TIMEOUT_MS = 5000;
            const SETTLE_INTERVAL_MS = 150;
            let color = null;
            let last = null;
            let stableReads = 0;
            const deadline = Date.now() + SETTLE_TIMEOUT_MS;
            while (Date.now() < deadline) {
                await action.hoverCenter(selector); // hold the hover (recomputes centre after any shift)
                await browser.pause(SETTLE_INTERVAL_MS);
                color = await action.getCSSProperty(selector, 'background-color');
                const hex = color && color.parsed && color.parsed.hex;
                if (hex && hex === last) {
                    if (++stableReads >= 2) break; // colour has settled while hovered
                } else {
                    stableReads = 0;
                    last = hex;
                }
            }
            return { pageStatus: true, hoverColor: color };
        }
        return { pageStatus: res };
    },

    /**
     * Clicks the primary "Next" button and confirms navigation to step 2 (school type).
     * Lazy require to avoid circular dependency — ADR-004.
     */
    click_next: async function () {
        await logger.logInto(await stackTrace.get(), 'click_next');
        var res;
        res = await action.click(selectorFile.css.ComproC1.setupSchoolAccount.primaryBtn);
        // true == res intentional loose equality per ADR-009
        if (true == res) {
            await logger.logInto(await stackTrace.get(), 'next button clicked');
            res = await require('./schoolType.page.js').isInitialized();
        } else {
            await logger.logInto(await stackTrace.get(), res + 'next button NOT clicked', 'error');
        }
        return res;
    }
};
