'use strict';
const { log } = require('winston');
var action = require('../../core/actionLibrary/baseActionLibrary.js');
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require('./appShell.page.js');

module.exports = {
  actionButton: selectorFile.css.ComproC1.activeClass.actionButton,
  deleteClass: selectorFile.css.ComproC1.activeClass.deleteClass,
  yesDelete_Btn: selectorFile.css.ComproC1.activeClass.yesDelete_Btn,
  // [2026-08-20] Added for module CGST (Req #22). "Class grade settings" sits in the SAME
  // Actions menu as "Delete class", so one click_actionButton() serves both.
  classGradeSettingsLink: selectorFile.css.ComproC1.activeClass.classGradeSettingsLink,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.actionButton),
    };
    return res;
  },

  getData_dropdown: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      actionButton:
        (await action.getElementCount(this.actionButton)) > 0
          ? await action.getText(this.actionButton)
          : null,
      deleteClass:
        (await action.getElementCount(this.deleteClass)) > 0
          ? await action.getText(this.deleteClass)
          : null,
    };
    console.log(obj);
    return obj;
  },

  getData_deleteModal: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      yesDelete_Btn:
        (await action.getElementCount(this.yesDelete_Btn)) > 0
          ? await action.getText(this.yesDelete_Btn)
          : null,
    };
    return obj;
  },

  click_actionButton: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.actionButton);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' actionButton is clicked');
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'actionButton is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_deleteClass: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.deleteClass);
    await browser.pause(4000);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' deleteClass is clicked');
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'deleteClass is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_yesDelete_Btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;

    res = await action.click(this.yesDelete_Btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' yesDelete_Btn is clicked');
      res = await require('./dashboard.page').isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'yesDelete_Btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  /**
   * [2026-08-20] Added for module CGST (Req #22).
   * Opens "Class grade settings" from the already-open Actions menu.
   * The caller must have clicked click_actionButton() first.
   */
  click_classGradeSettings: async function () {
    var res = { pageStatus: false };
    await logger.logInto(await stackTrace.get());
    res.displayed = await action.waitForDisplayed(this.classGradeSettingsLink, 15000);
    if (true != res.displayed) return res;
    res.clicked = await action.click(this.classGradeSettingsLink);
    if (true != res.clicked) return res;
    var dest = await require('./classGradeSettings.page.js').isInitialized();
    res.pageStatus = dest.pageStatus;
    return res;
  },

  /**
   * [2026-08-20] Added for module CGST (Req #22) — deletes the open class and returns to the
   * school Classes tab. The caller must have clicked click_actionButton() first.
   *
   * WHY THIS EXISTS ALONGSIDE click_deleteClass + click_yesDelete_Btn: those two assume the
   * confirmation dialog ALWAYS appears. Verified live 2026-08-20 that deleting a freshly
   * created class with no students raised NO confirmation at all — the click deleted
   * immediately and redirected to the Classes tab. Driving the old pair in that case would
   * hang on a yesDelete_Btn that never renders.
   *
   * So the confirm step is treated as OPTIONAL and probed for briefly. That is not a
   * swallowed failure (Invariant 13): the real assertion is that we land back on the Classes
   * tab, which only happens if the delete actually went through. `confirmShown` is returned
   * so a caller can see which path ran.
   *
   * The existing methods are left untouched — other suites depend on them.
   */
  delete_class: async function () {
    var res = { pageStatus: false, confirmShown: false };
    await logger.logInto(await stackTrace.get());
    res.clicked = await action.click(this.deleteClass);
    if (true != res.clicked) return res;

    // Short probe: the dialog renders immediately when it renders at all.
    res.confirmShown = (await action.waitForDisplayed(this.yesDelete_Btn, 3000)) === true;
    if (res.confirmShown) {
      res.confirmClicked = await action.click(this.yesDelete_Btn);
      if (true != res.confirmClicked) return res;
    } else {
      await logger.logInto(
        await stackTrace.get(),
        'delete confirmation did not appear - treating as the no-confirm path (see method comment)'
      );
    }

    // The authoritative check: the school Classes tab is where a successful delete lands.
    var dest = await require('./schoolClasses.page.js').isInitialized();
    res.pageStatus = dest.pageStatus;
    return res;
  },
};