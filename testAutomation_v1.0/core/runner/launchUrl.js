"use strict";
// [2026-06-11] Playwright migration (Prompt 4 / Phase 1) — confirmed by user.
// Navigation now uses the Playwright page (decision D2) instead of browser.url().

module.exports = {

	launchUrl: async function () {
		// global.page is published by playwright.setup.js (decision D3).
		await global.page.goto(appUrl, { waitUntil: "load" });
		await logger.logInto(stackTrace.get(), "appURL:" + appUrl);
	}
}
