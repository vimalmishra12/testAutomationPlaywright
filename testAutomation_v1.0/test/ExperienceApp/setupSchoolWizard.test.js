"use strict";
var wizard = require("../../pages/ExperienceApp/setupSchoolWizard.page.js");
var sts;

/**
 * "Set up a school account" wizard — each step blocks progress until valid (module SRQS) — 1 case.
 *
 * 🚨 NEVER SUBMITS. The case walks to the summary and proves it was reached; "Send Request" files a
 * real institution request into a human queue (TST_SRQS_TC_2 is Blocked for this reason). The page
 * object refuses to click any control that is not a wizard Next.
 *
 * Separate from schoolRequestSummary.test.js (TST_SRQS_TC_1) so this case gets its own TC-repository
 * module — testrunner.js takes the first module whose testFile matches.
 *
 * Every gate below was verified live on 2026-09-14 (admin-shared.md §A12). The "disabled" half is the
 * gap this case fills: the older wizard cases only ever asserted the enabling direction.
 *
 * Nothing typed here is submitted; the values are clearly marked test data.
 */

/** Asserts a step's Next is disabled, then does `unlock`, then asserts it is enabled. */
async function gate(nextKey, stepName, unlock) {
  var disabled = await wizard.waitForNextState(nextKey, false);
  await assertion.assertEqual(disabled, false, stepName + ": Next is enabled before the step is valid.");
  sts = await unlock();
  await assertion.assertEqual(sts, true, stepName + ": could not supply the required input.");
  var enabled = await wizard.waitForNextState(nextKey, true);
  await assertion.assertEqual(enabled, true, stepName + ": Next did not enable once the step was valid.");
}

module.exports = {
  /**
   * TC_3 — on every step Next stays disabled until the step's required input is valid.
   */
  TST_SRQS_TC_3: async function (testdata) {
    var d = testdata;

    sts = await wizard.open();
    await assertion.assertEqual(sts, true, "The wizard did not open at its intro step.");
    sts = await wizard.click_next("introNextBtn", "schoolTypeNextBtn");
    await assertion.assertEqual(sts, true, "Could not move past the intro step.");

    // School type — radio.
    await gate("schoolTypeNextBtn", "School type", function () { return wizard.select_firstRadio("schoolTypeRadioLabel"); });
    sts = await wizard.click_next("schoolTypeNextBtn", "teacherCountNextBtn");
    await assertion.assertEqual(sts, true, "Could not move past School type.");

    // Number of teachers — radio.
    await gate("teacherCountNextBtn", "Number of teachers", function () { return wizard.select_firstRadio("teacherCountRadioLabel"); });
    sts = await wizard.click_next("teacherCountNextBtn", "schoolNameNextBtn");
    await assertion.assertEqual(sts, true, "Could not move past Number of teachers.");

    // School name — whitespace must NOT count as valid (the form trims).
    sts = await wizard.set_field("schoolNameInput", "   ");
    await assertion.assertEqual(sts, true, "Could not type into School name.");
    await assertion.assertEqual(await wizard.waitForNextState("schoolNameNextBtn", false), false, "School name: whitespace enabled Next.");
    await gate("schoolNameNextBtn", "School name", function () { return wizard.set_field("schoolNameInput", d.schoolName); });
    sts = await wizard.click_next("schoolNameNextBtn", "locationNextBtn");
    await assertion.assertEqual(sts, true, "Could not move past School name.");

    // Location — arrives PRE-FILLED from the account; read it, clear it, then a partial value, then restore.
    var prefill = await wizard.getData_fieldValue("locationInput");
    await assertion.assert(typeof prefill == "string" && prefill.trim().length > 0, "Location did not arrive pre-filled.");
    sts = await wizard.set_field("locationInput", "");
    await assertion.assertEqual(sts, true, "Could not clear Location.");
    await assertion.assertEqual(await wizard.waitForNextState("locationNextBtn", false), false, "Location: an empty value enabled Next.");
    sts = await wizard.set_field("locationInput", d.partialLocation);
    await assertion.assertEqual(await wizard.waitForNextState("locationNextBtn", false), false, "Location: a partial value ('" + d.partialLocation + "') enabled Next.");
    await gate("locationNextBtn", "Location (restored)", function () { return wizard.set_field("locationInput", prefill); });
    sts = await wizard.click_next("locationNextBtn", "addressNextBtn");
    await assertion.assertEqual(sts, true, "Could not move past Location.");

    // Address — Street AND City both required; Region and Postal optional.
    sts = await wizard.set_field("streetAddressInput", d.street);
    await assertion.assertEqual(await wizard.waitForNextState("addressNextBtn", false), false, "Address: Street alone enabled Next.");
    sts = await wizard.set_field("streetAddressInput", "");
    sts = await wizard.set_field("cityInput", d.city);
    await assertion.assertEqual(await wizard.waitForNextState("addressNextBtn", false), false, "Address: City alone enabled Next.");
    await gate("addressNextBtn", "Address (Street + City)", function () { return wizard.set_field("streetAddressInput", d.street); });
    sts = await wizard.click_next("addressNextBtn", "contactNextBtn");
    await assertion.assertEqual(sts, true, "Could not move past Address.");

    // Telephone — code (pre-filled) + numeric number required; URL optional but validated.
    sts = await wizard.set_field("telephoneInput", d.nonNumericTelephone);
    await assertion.assertEqual(await wizard.waitForNextState("contactNextBtn", false), false, "Telephone: a non-numeric number enabled Next.");
    await gate("contactNextBtn", "Telephone", function () { return wizard.set_field("telephoneInput", d.telephone); });
    sts = await wizard.set_field("websiteUrlInput", d.malformedUrl);
    await assertion.assertEqual(await wizard.waitForNextState("contactNextBtn", false), false, "Telephone: a malformed URL ('" + d.malformedUrl + "') enabled Next.");
    await gate("contactNextBtn", "Telephone (URL cleared)", function () { return wizard.set_field("websiteUrlInput", ""); });
    sts = await wizard.click_next("contactNextBtn", "summarySendRequestBtn");
    await assertion.assertEqual(sts, true, "Could not reach the summary.");

    // Summary reached — and NOT submitted.
    var s = await wizard.getData_summaryReached();
    await assertion.assertEqual(s.reached, true, "The summary step was not reached.");
    await assertion.assertEqual(s.sendRequestLabel, d.sendRequestLabel, "The summary's primary action is not 'Send Request'.");
  }
};
