"use strict";
var adminShell = require("../../pages/ExperienceApp/adminShell.page.js");
var sts;

/**
 * Admin App shell chrome (module ASHL) — 4 cases: TC_1 (language options), TC_2 (Spanish),
 * TC_3 (Help menu), TC_4 (tutorial topics).
 *
 * ⚠️ TC_2 CHANGES THE SITE LANGUAGE and must leave it in English. The choice persists per BROWSER
 * (localStorage), not per account, so a failed restore cannot leak into another suite — but it would
 * leak into later cases in THIS suite. That is why the restore is asserted inside TC_2 itself, and why
 * BeforeEach also re-asserts English before every case.
 *
 * Evidence: admin-shared.md §A9 and §A12 (qids and Spanish copy verified live 2026-09-14);
 * manual register test/Manual/C1App/AdminApp-Generic/.
 */
module.exports = {
  /**
   * BeforeEach — start on My school accounts, in English. If a previous case left Spanish behind,
   * restore it here (housekeeping, where resilience is allowed — Invariant 14) and say so.
   */
  TST_ASHL_TC_100: async function (testdata) {
    await browser.url("/admin/admin/dashboard");
    sts = await adminShell.isInitialized();
    await assertion.assertEqual(sts, true, "My school accounts did not render with the admin shell.");
    var lang = await adminShell.getData_languageControl();
    if (lang.htmlLang !== "en") {
      await logger.logInto(await stackTrace.get(), "BeforeEach found language '" + lang.htmlLang + "' — restoring English", "error");
      sts = await adminShell.select_language("en");
      await assertion.assertEqual(sts, true, "BeforeEach could not restore English.");
    }
  },

  /**
   * TC_1 — two language options, English then Español, with English marked active.
   * Uses the logged-in control (cFooter-7 / cFooter-8-*); §A9's sp-ldd-* qids do not exist here.
   */
  TST_ASHL_TC_1: async function (testdata) {
    var lang = await adminShell.getData_languageControl();
    await assertion.assertEqual(JSON.stringify(lang.options), JSON.stringify(testdata.languageOptions), "The language options differ from English, Español.");
    await assertion.assertEqual(lang.englishActive, true, "English is not marked active.");
    await assertion.assertEqual(lang.spanishActive, false, "Español is marked active while the site is in English.");
    await assertion.assertEqual(lang.activeOptionCount, 1, "Exactly one language option should be marked active.");
    await assertion.assertEqual(lang.triggerAriaLabel, testdata.english.languageTriggerAriaLabel, "The language control's accessible name is wrong.");
  },

  /**
   * TC_2 — Español re-renders the shell in Spanish, persists across a reload, and English restores it.
   *
   * Asserts only strings verified live (2026-09-14). Known-untranslated elements — "Our approach" and
   * the bell's accessible name — are deliberately NOT asserted as Spanish; they are i18n defects recorded
   * in §A12, not expected behaviour.
   */
  TST_ASHL_TC_2: async function (testdata) {
    var es = testdata.spanish;

    sts = await adminShell.select_language("es");
    await assertion.assertEqual(sts, true, "The site did not switch to Spanish.");
    var lang = await adminShell.getData_languageControl();
    await assertion.assertEqual(lang.spanishActive, true, "Español is not marked active after selecting it.");

    var copy = await adminShell.getData_shellCopy();
    await assertion.assertEqual(copy.htmlLang, "es", "html lang is not 'es'.");
    await assertion.assertEqual(copy.help, es.help, "Help is not translated.");
    await assertion.assertEqual(copy.footerTermsOfUse, es.footerTermsOfUse, "Terms of use is not translated.");
    await assertion.assertEqual(copy.footerPrivacyNotice, es.footerPrivacyNotice, "Privacy notice is not translated.");
    await assertion.assertEqual(copy.footerAccessibility, es.footerAccessibility, "Accessibility is not translated.");
    await assertion.assertEqual(copy.footerHelp, es.footerHelp, "Footer Help is not translated.");
    await assertion.assertEqual(copy.footerCambridgeOneForSchools, es.footerCambridgeOneForSchools, "Cambridge One for schools is not translated.");
    await assertion.assertEqual(copy.languageTriggerAriaLabel, es.languageTriggerAriaLabel, "The language control's accessible name is not translated.");
    await assertion.assertEqual(copy.roleToggleAriaLabel, es.roleToggleAriaLabel, "The role toggle's accessible name is not translated.");

    // Persistence across a reload in the same browser (localStorage) — verified 2026-09-14.
    sts = await adminShell.reload();
    await assertion.assertEqual(sts, true, "The page did not re-render after reloading.");
    var afterReload = await adminShell.getData_shellCopy();
    await assertion.assertEqual(afterReload.htmlLang, "es", "Spanish did not persist across a reload.");

    // Restore — es→en RELOADS the page; select_language waits for html[lang], not a class change.
    sts = await adminShell.select_language("en");
    await assertion.assertEqual(sts, true, "The site did not switch back to English.");
    var restored = await adminShell.getData_shellCopy();
    await assertion.assertEqual(restored.htmlLang, "en", "English was not restored.");
    await assertion.assertEqual(restored.help, testdata.english.help, "Help did not return to English.");
  },

  /** TC_3 — Help opens with exactly Help centre then Tutorials. */
  TST_ASHL_TC_3: async function (testdata) {
    var menu = await adminShell.getData_helpMenu();
    await assertion.assertEqual(menu.opened, true, "The Help menu did not open.");
    await assertion.assertEqual(JSON.stringify(menu.items), JSON.stringify(testdata.helpMenuItems), "The Help menu items differ from Help centre, Tutorials.");
  },

  /**
   * TC_4 — Tutorials lists the five topics verbatim, in order.
   * All five share qid cHeader-hlp-6, so they are read by index (§A9).
   */
  TST_ASHL_TC_4: async function (testdata) {
    var t = await adminShell.getData_tutorialTopics();
    await assertion.assertEqual(t.opened, true, "The Tutorials submenu did not open.");
    await assertion.assertEqual(JSON.stringify(t.topics), JSON.stringify(testdata.tutorialTopics), "The tutorial topics differ from the expected five, in order.");
  }
};
