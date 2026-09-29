"use strict";

/**
 * Test case definitions for Electron Dashboard operations (Walkthrough, Logout).
 */

const electronDashboardPage = require("../../pages/ExperienceApp/electronDashboard.page.js");

module.exports = {
  PROTO_CLOSE_WALKTHROUGH: async function () {
    console.log("Executing Electron Dashboard: Close Walkthrough Popup");
    await electronDashboardPage.closeWalkthrough();
  },

  PROTO_ELECTRON_LOGOUT: async function () {
    console.log("Executing Electron Dashboard: Logout user");
    const result = await electronDashboardPage.logoutUser();
    await assertion.assertEqual(result, true, "User logout validation failed");
    console.log("User logged out successfully in Electron ✅");
  }
};
