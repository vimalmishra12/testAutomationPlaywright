"use strict";

/**
 * Test case for the Thor Desktop "session retained across close & reopen" check.
 *
 * Runs after the reused login POC (PROTO_ELEC_LOGIN) has signed the teacher in, in the SAME
 * Electron session — no logout in between. It quits the app, relaunches it, and asserts the
 * user is still signed in from the UI, without the automation authenticating again.
 *
 * Rule: a test file only drives page-object methods and asserts — no DOM, no baseActionLibrary.
 */

const electronSession = require("../../pages/ExperienceApp/electronSession.page.js");

module.exports = {
  PROTO_SESSION_RETAINED: async function () {
    console.log("════════════════════════════════════════════════════");
    console.log("  START: Close & reopen the Desktop App, expect session retained");
    console.log("════════════════════════════════════════════════════");

    const closed = await electronSession.closeApp();
    await assertion.assertEqual(closed, true, "Electron app did not close (no run-owned process was terminated)");

    const reattached = await electronSession.relaunchAndReattach();
    await assertion.assertEqual(reattached, true, "Could not re-attach Playwright to the relaunched Electron app");

    const result = await electronSession.verifySessionRetained();
    await assertion.assertEqual(
      result.sessionRetained,
      true,
      "Login session was NOT retained after close & reopen (" + result.reason + ")"
    );

    console.log("════ SESSION RETAINED after close & reopen ✓ ════");
  }
};
