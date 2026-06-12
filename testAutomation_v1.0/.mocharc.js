"use strict";

/**
 * Mocha configuration — Playwright-as-library migration (Prompt 4 / Phase 0).
 *
 * This is the NEW entry point that replaces the WDIO runner. In Phase 0 it only
 * drives the POC smoke spec; from Phase 1 the JSON execution engine
 * (testrunner.js / specGenerator.js) is wired in behind the same Mocha process.
 *
 * `require` loads the Playwright root hooks (playwright.setup.js) which launch
 * the browser ONCE per run and publish global.page / global.$ / global.$$
 * (compatibility shim per agreed decision D3). Nothing here removes or replaces
 * any WDIO config yet — wdio.conf.js retirement is a Phase 2 step.
 */
module.exports = {
  // Root hooks file — launches Playwright and sets all globals before any test.
  require: ["./core/runner/playwright.setup.js"],

  // Phase 0: only the POC smoke spec is in scope. Phase 1+ will add the
  // generated spec under test/tempRunner (same location WDIO used).
  spec: ["./test/poc/**/*.test.js"],

  // CSV-upload / login flows can be slow on Thor — keep a generous timeout.
  timeout: 120000,

  // Spec reporter is Mocha built-in (decision D6). Allure (allure-mocha) is
  // added as a second reporter from Phase 1; Timeline reporter is retired.
  reporter: "spec",

  // Allow CLI args like --appType/--testEnv/--testExecFile/--trace to pass
  // through to the process without Mocha rejecting them as unknown.
  // (argv is parsed by yargs inside playwright.setup.js, mirroring env.conf.js.)
  "allow-uncaught": false
};
