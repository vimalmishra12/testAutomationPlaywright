"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require("./appShell.page.js");

module.exports = {
  page_header: selectorFile.css.ComproC1.login.page_header,
  brandLogo: selectorFile.css.ComproC1.login.brandLogo,
  userName_tbox: selectorFile.css.ComproC1.login.userName_tbox,
  password_tbox: selectorFile.css.ComproC1.login.password_tbox,
  loginPassword_eye: selectorFile.css.ComproC1.login.loginPassword_eye,
  forgotPassword: selectorFile.css.ComproC1.login.forgotPassword,
  login_btn: selectorFile.css.ComproC1.login.login_btn,
  signup_btn: selectorFile.css.ComproC1.login.signup_btn,

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.userName_tbox),
    };
    return res;
  },

  // [2026-06-11] Playwright migration (Prompt 4 / Phase 1) — page-object edit.
  // Previously used the raw `$()` locator's WDIO-only methods (.isDisplayed()/.click()),
  // which do not exist on a Playwright Locator. Routed through the action library
  // instead (action.isDisplayed → isVisible; action.click). Listed in the walkthrough.
  acceptCookies: async function() {
    const cookieButtonSelector = 'a[qid="cookies-2"]';
    // action.isDisplayed returns false (never throws) when the banner is absent,
    // so no upfront waitForDisplayed is needed — avoids a needless timeout when the
    // cookie banner does not appear.
    const isCookieBannerVisible = await action.isDisplayed(cookieButtonSelector);
    console.log("iscookie", isCookieBannerVisible);
    if (isCookieBannerVisible === true) {
      console.log("clicking");
      const res = await action.click(cookieButtonSelector);
      console.log("clickedd", res);
    }
},

  login_Data: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      page_header:
        (await action.getElementCount(this.page_header)) > 0
          ? await action.getText(this.page_header)
          : null,
      brandLogo:
        (await action.getElementCount(this.brandLogo)) > 0
          ? await action.waitForDisplayed(this.brandLogo)
          : false,
      userName_tbox:
        (await action.getElementCount(this.userName_tbox)) > 0
          ? await action.getAttribute(this.userName_tbox, "placeholder")
          : null,
      password_tbox:
        (await action.getElementCount(this.password_tbox)) > 0
          ? await action.getAttribute(this.password_tbox, "placeholder")
          : null,
      loginPassword_eye:
        (await action.getElementCount(this.loginPassword_eye)) > 0
          ? await action.getText(this.loginPassword_eye)
          : null,
      forgotPassword:
        (await action.getElementCount(this.forgotPassword)) > 0
          ? await action.getText(this.forgotPassword)
          : null,
      login_btn:
        (await action.getElementCount(this.login_btn)) > 0
          ? await action.getText(this.login_btn)
          : null,
      signup_btn:
        (await action.getElementCount(this.signup_btn)) > 0
          ? await action.getText(this.signup_btn)
          : null,
    };
    return obj;
  },

  click_loginPassword_eye: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.loginPassword_eye);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " loginPassword_eye is clicked"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "loginPassword_eye is NOT clicked",
        "error"
      );
    }
    return res;
  },

  // click_forgotPassword: async function () {
  // await logger.logInto(await stackTrace.get());
  // var res;
  // res =await action.click(this.forgotPassword);
  // if (true == res) {
  //  await logger.logInto(await stackTrace.get(), " forgotPassword is clicked");
  // }
  // else {
  // await logger.logInto(await stackTrace.get(), res +"forgotPassword is NOT clicked", 'error');
  // }
  // return res;
  // },
  click_forgotPassword: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.forgotPassword);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        " forgotPassword is clicked"
      );
      res = await require("./resetPassword.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "forgotPassword is NOT clicked",
        "error"
      );
    }
    return res;
  },

  click_login_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.login_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " login_btn is clicked");
      res = await require("./dashboard.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "login_btn is NOT clicked",
        "error"
      );
    }
    //console.log(res);
    return res;
  },

  click_signup_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    console.log(this.signup_btn);
    res = await action.click(this.signup_btn);
    console.log(res);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), " signup_btn is clicked");
      res = await require("./signup.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "signup_btn is NOT clicked",
        "error"
      );
    }
    return res;
  },

  /**
   * Clicks login and waits for the school admin dashboard ("My school accounts").
   * Used instead of click_login_btn when logging in as a school administrator —
   * school admins are redirected to /admin/admin/dashboard, not the student/teacher
   * dashboard, so the standard isInitialized() check would fail. See NEMO-24306.
   */
  click_login_btn_schoolAdmin: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.login_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), "login_btn clicked for school admin");
      res = await require("./schoolAdminDashboard.page").isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + " login_btn NOT clicked",
        "error"
      );
    }
    return res;
  },

  set_userName_tbox: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.setValue(this.userName_tbox, value);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        "Value is entered in userName_tbox"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "Value is NOT entered in userName_tbox",
        "error"
      );
    }
    return res;
  },

  set_password_tbox: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.setValue(this.password_tbox, value);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        "Value is entered in password_tbox"
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + "Value is NOT entered in password_tbox",
        "error"
      );
    }
    return res;
  },
};
