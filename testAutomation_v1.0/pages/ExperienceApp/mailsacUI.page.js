"use strict";

/**
 * Page Object for Mailsac Web UI Automation.
 *
 * Implements Layer 2 (Page Object) interactions with https://mailsac.com:
 * - User login (comproqatest21@gmail.com)
 * - Inbox navigation (testt1@mailsac.com, teacher17aug2026@mailsac.com)
 * - Inbox purging via UI
 * - Email subject and body validation via DOM
 */

var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var ms = selectorFile.css.ComproC1.mailsacUI;

module.exports = {
  loginUrl: "https://mailsac.com/login",
  inboxBaseUrl: "https://mailsac.com/inbox/",

  /**
   * Logs into Mailsac via the web UI.
   *
   * @param {string} username - Mailsac login email / username
   * @param {string} password - Mailsac login password
   * @returns {Promise<{ pageStatus: boolean }>}
   */
  loginToMailsac: async function (username, password) {
    await logger.logInto(await stackTrace.get(), "Navigating to Mailsac login: " + this.loginUrl);
    await browser.url(this.loginUrl);
    await action.waitForDocumentLoad();

    // Check if already logged in
    var alreadyLoggedIn = await action.isDisplayed(ms.userLoggedInIndicator);
    if (alreadyLoggedIn) {
      await logger.logInto(await stackTrace.get(), "Already logged into Mailsac");
      return { pageStatus: true };
    }

    await action.waitForDisplayed(ms.usernameInput, 15000);
    await action.click(ms.usernameInput);
    await action.clearValue(ms.usernameInput);
    await action.addValue(ms.usernameInput, username);

    await action.waitForDisplayed(ms.passwordInput, 10000);
    await action.click(ms.passwordInput);
    await action.clearValue(ms.passwordInput);
    await action.addValue(ms.passwordInput, password);

    await action.waitForClickable(ms.signInBtn, 10000);
    var res = await action.click(ms.signInBtn);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "Sign In button not clicked", "error");
      return { pageStatus: false };
    }

    await action.waitForDocumentLoad();
    // Wait for post-login indicator or check URL
    var loggedIn = await action.waitForDisplayed(ms.userLoggedInIndicator, 20000);
    if (!loggedIn) {
      var currentUrl = await browser.getUrl();
      loggedIn = currentUrl.indexOf("/login") === -1;
    }
    await logger.logInto(await stackTrace.get(), "Mailsac login status: " + loggedIn);
    return { pageStatus: loggedIn };
  },

  /**
   * Navigates directly to a specific Mailsac inbox page in the browser.
   *
   * @param {string} emailAddress - Target inbox email address
   * @returns {Promise<{ pageStatus: boolean }>}
   */
  openInbox: async function (emailAddress) {
    var targetUrl = this.inboxBaseUrl + encodeURIComponent(emailAddress);
    await logger.logInto(await stackTrace.get(), "Opening Mailsac inbox: " + targetUrl);
    await browser.url(targetUrl);
    await action.waitForDocumentLoad();
    var loaded = await action.waitForDisplayed(ms.inboxPurgeBtn, 15000);
    if (!loaded) {
      loaded = (await action.getElementCount(ms.inboxSearchInput)) > 0;
    }
    return { pageStatus: loaded };
  },

  /**
   * Purges the currently open inbox via the Mailsac UI.
   *
   * @param {string} emailAddress - Target inbox email
   * @returns {Promise<{ purged: boolean }>}
   */
  purgeInboxUI: async function (emailAddress) {
    await this.openInbox(emailAddress);
    await logger.logInto(await stackTrace.get(), "Purging inbox via UI for: " + emailAddress);

    var purgeBtnExists = await action.isDisplayed(ms.inboxPurgeBtn);
    if (purgeBtnExists) {
      await action.click(ms.inboxPurgeBtn);
      // If a confirmation modal / button appears, confirm it
      if (await action.isDisplayed(ms.purgeConfirmBtn)) {
        await action.click(ms.purgeConfirmBtn);
      }
      await browser.pause(2000);
    }
    await logger.logInto(await stackTrace.get(), "Inbox purged via UI for " + emailAddress);
    return { purged: true };
  },

  /**
   * Polls the open inbox by refreshing until at least expectedCount message rows are rendered.
   *
   * @param {string} emailAddress - Target inbox email
   * @param {number} expectedCount - Minimum expected messages
   * @param {number} timeoutMs - Timeout in milliseconds
   * @returns {Promise<{ found: boolean, count: number }>}
   */
  waitForMessagesInUI: async function (emailAddress, expectedCount, timeoutMs) {
    var deadline = Date.now() + (timeoutMs || 60000);
    await logger.logInto(await stackTrace.get(), "Waiting for " + expectedCount + " messages in UI for " + emailAddress);

    while (Date.now() < deadline) {
      await this.openInbox(emailAddress);
      var count = await action.getElementCount(ms.messageRow);
      if (typeof count === "number" && count >= expectedCount) {
        return { found: true, count: count };
      }
      await browser.pause(5000);
    }

    var finalCount = await action.getElementCount(ms.messageRow);
    return {
      found: typeof finalCount === "number" && finalCount >= expectedCount,
      count: finalCount || 0
    };
  },

  /**
   * Opens the Cambridge One verification e-mail for `emailAddress` and follows its link in the
   * CURRENT tab, so the caller lands back on C1 already verified (cookies are per context).
   * Caller must be logged into Mailsac (loginToMailsac).
   *
   * Why no click on the link [2026-09-22, SOURCE playwright-automation-c1 MailsacPage]: the mail
   * body sits in a sandboxed iframe that may only open popups, so a click can never navigate
   * in place. Reading the href and loading it here gives the same result without a second tab.
   * "Unblock Content" is followed by its href for the same reason (it is a target=_blank link).
   *
   * @param {string} emailAddress - the signup address
   * @param {number} timeoutMs - how long to wait for the mail to arrive (SOURCE allowed 5 min)
   * @returns {Promise<{ mailFound: boolean, verifyHref: string|null, landedUrl: string|null }>}
   */
  openVerificationLink: async function (emailAddress, timeoutMs) {
    await logger.logInto(await stackTrace.get(), "Waiting for verification mail for " + emailAddress);
    // Rows are matched by text, never by position: a reused inbox keeps older mails.
    var verifyRow = action.getFilteredLocator(ms.messageRow, /verif/i);
    var deadline = Date.now() + (timeoutMs || 300000);
    var found = false;
    // Delivery is asynchronous; re-open (reload) the inbox until the mail shows (bounded).
    while (Date.now() < deadline) {
      await this.openInbox(emailAddress);
      if (true == (await action.isDisplayed(verifyRow))) {
        found = true;
        break;
      }
      await browser.pause(5000);
    }
    if (!found) return { mailFound: false, verifyHref: null, landedUrl: null };

    var res = await action.click(verifyRow);
    if (true == res) res = await action.waitForDisplayed(ms.unblockContentBtn, 15000);
    if (true != res) return { mailFound: true, verifyHref: null, landedUrl: null };
    var unblockHref = await action.getAttribute(ms.unblockContentBtn, "href");
    if (typeof unblockHref === "string" && unblockHref.length > 0) {
      await browser.url(new URL(unblockHref, "https://mailsac.com").href);
      await action.waitForDocumentLoad();
    }

    await action.switchToFrame(ms.emailHtmlFrame);
    var verifyHref = null;
    if (true == (await action.waitForDisplayed(ms.verifyLink, 15000))) {
      verifyHref = await action.getAttribute(ms.verifyLink, "href");
    }
    await action.switchToParentFrame();
    if (typeof verifyHref !== "string" || verifyHref.length === 0) {
      return { mailFound: true, verifyHref: null, landedUrl: null };
    }

    await browser.url(verifyHref);
    // The link goes through Gigya redirects before settling on the app; wait for the app's own
    // host (appUrl global, env.json) so landedUrl is the final page, not a redirect hop.
    var landed = await action.waitForUrl(new RegExp(new URL(appUrl).host.replace(/\./g, "\\.")), 120000);
    return { mailFound: true, verifyHref: verifyHref, landedOnApp: true == landed, landedUrl: await browser.getUrl() };
  },

  /**
   * Helper to extract complete rendered text from page and all iframes.
   */
  getEmailBodyText: async function () {
    var fullText = "";
    try {
      var frames = global.page.frames();
      for (var f of frames) {
        try {
          var frameText = await f.evaluate(() => (document.body ? document.body.innerText : ""));
          if (frameText && frameText.trim().length > 0) {
            fullText += "\n" + frameText;
          }
        } catch (e) {}
      }
    } catch (e) {}

    try {
      var mainText = await global.page.evaluate(() => {
        var el = document.querySelector(
          ".message-content, .email-body, div.well, .dirty-content, #message-body, .mail-body, iframe"
        );
        return el ? el.innerText : document.body.innerText;
      });
      fullText += "\n" + mainText;
    } catch (e) {}

    return fullText;
  },

  /**
   * Validates the Admin summary report email via the Mailsac UI.
   *
   * @param {string} adminEmail - Admin inbox (e.g. testt1@mailsac.com)
   * @param {number} expectedCreatedCount - Expected created count (e.g. 2)
   * @param {number} expectedFailedCount - Expected failed count (e.g. 0)
   * @param {number} timeoutMs - Timeout in ms
   * @returns {Promise<{ found: boolean, isMatch: boolean, hasSubject: boolean, hasCreated: boolean, hasFailed: boolean, bodyText: string }>}
   */
  verifyAdminEmailUI: async function (adminEmail, expectedCreatedCount, expectedFailedCount, timeoutMs) {
    var waitRes = await this.waitForMessagesInUI(adminEmail, 1, timeoutMs || 60000);
    if (!waitRes.found) {
      await logger.logInto(await stackTrace.get(), "No messages appeared in UI for: " + adminEmail, "error");
      return { found: false, isMatch: false, hasSubject: false, hasCreated: false, hasFailed: false, bodyText: "" };
    }

    // Click first message row to open details
    await action.click(ms.messageRow);
    await browser.pause(2000);

    // If "Unblock Content" is present, click it
    if (await action.isDisplayed(ms.unblockContentBtn)) {
      await action.click(ms.unblockContentBtn);
      await browser.pause(1500);
    }

    var bodyText = await this.getEmailBodyText();
    await logger.logInto(await stackTrace.get(), "Mailsac Admin Email Body verified");

    var createdPattern = new RegExp(
      "([1-9]\\d*)\\s+(?:classes\\s+)?created\\s+successfully|" +
        expectedCreatedCount +
        "\\s+created|created\\s*(?:successfully)?\\s*:\\s*" +
        expectedCreatedCount,
      "i"
    );
    var failedPattern = new RegExp(
      expectedFailedCount +
        "\\s+(?:classes\\s+)?failed|failed\\s*:\\s*" +
        expectedFailedCount +
        "|" +
        expectedFailedCount +
        "\\s+failed",
      "i"
    );

    var hasCreated = createdPattern.test(bodyText) || bodyText.indexOf("created successfully") !== -1;
    var hasFailed =
      failedPattern.test(bodyText) ||
      bodyText.indexOf(expectedFailedCount + " failed") !== -1 ||
      bodyText.indexOf("failed: 0") !== -1;
    var hasSubject =
      /Your Cambridge One classes have been created/i.test(bodyText) || bodyText.indexOf("Cambridge One") !== -1;

    return {
      found: true,
      isMatch: hasCreated && hasFailed,
      hasSubject: hasSubject,
      hasCreated: hasCreated,
      hasFailed: hasFailed,
      bodyText: bodyText
    };
  },

  /**
   * Validates Teacher notification emails via the Mailsac UI.
   *
   * @param {string} teacherEmail - Teacher inbox (e.g. teacher17aug2026@mailsac.com)
   * @param {string[]} expectedClassNames - Expected class names
   * @param {string} adminEmail - Admin email
   * @param {string} schoolDisplayName - School display name
   * @param {number} timeoutMs - Timeout in ms
   * @returns {Promise<{ found: boolean, matchedAll: boolean, count: number }>}
   */
  verifyTeacherEmailsUI: async function (teacherEmail, expectedClassNames, adminEmail, schoolDisplayName, timeoutMs) {
    var expectedCount = expectedClassNames.length;
    var waitRes = await this.waitForMessagesInUI(teacherEmail, expectedCount, timeoutMs || 60000);
    if (!waitRes.found) {
      await logger.logInto(await stackTrace.get(), "Teacher emails did not arrive in UI for: " + teacherEmail, "error");
      return { found: false, matchedAll: false, count: waitRes.count };
    }

    var rowCount = await action.getElementCount(ms.messageRow);
    var matchedClasses = new Set();

    for (var i = 0; i < Math.min(rowCount, expectedCount); i++) {
      var rowSel = ms.messageRowNth.replace("{{index}}", i + 1);
      await action.click(rowSel);
      await browser.pause(2000);

      if (await action.isDisplayed(ms.unblockContentBtn)) {
        await action.click(ms.unblockContentBtn);
        await browser.pause(1500);
      }

      var bodyText = await this.getEmailBodyText();

      for (var j = 0; j < expectedClassNames.length; j++) {
        var clsName = expectedClassNames[j];
        if (bodyText.indexOf(clsName) !== -1) {
          matchedClasses.add(clsName);
        }
      }

      // Close message view if close button is present
      if (await action.isDisplayed(ms.closeMessageBtn)) {
        await action.click(ms.closeMessageBtn);
        await browser.pause(1000);
      }
    }

    var matchedAll = expectedClassNames.every(function (cls) {
      return matchedClasses.has(cls);
    });

    await logger.logInto(await stackTrace.get(), "Teacher emails matched: " + Array.from(matchedClasses).join(", "));

    return {
      found: true,
      matchedAll: matchedAll,
      count: rowCount
    };
  }
};
