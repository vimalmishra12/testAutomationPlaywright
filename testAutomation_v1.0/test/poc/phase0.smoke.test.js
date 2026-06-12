"use strict";

/**
 * PHASE 0 smoke test — Prompt 4 migration scaffolding verification.
 *
 * Purpose: prove that standalone Mocha + the Playwright root hooks
 * (playwright.setup.js) work end-to-end:
 *   - Chromium launches (headed)
 *   - the global.page / global.$ shim is live
 *   - a real navigation + read works
 *
 * It touches NO framework files, NO selectors, NO execution JSON. It is the
 * "trivial root-hook test" required by Phase 0, step 5. It will be removed (or
 * kept as a health check) once Phase 1's real POC login flow is green.
 *
 * Uses standalone expect (decision D5) imported from @playwright/test — import
 * ONLY, the @playwright/test runner is NOT used (decision D1).
 */
const { expect } = require("@playwright/test");

describe("Phase 0 — Playwright-under-Mocha scaffolding smoke", function () {
  it("launches Chromium via root hooks and reads example.com", async function () {
    // global.page is published by playwright.setup.js beforeAll hook (D3).
    await page.goto("https://example.com", { waitUntil: "load" });

    // Read the title two ways to exercise both the page API and the $ shim.
    const title = await page.title();
    expect(title).toContain("Example Domain");

    // global.$ shim → page.locator (D3). Confirm the heading text.
    const heading = await global.$("h1").textContent();
    expect(heading).toBe("Example Domain");
  });
});
