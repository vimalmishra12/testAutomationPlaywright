"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

// Post-login Builder landing. We assert by URL (we have navigated away from the
// pre-login / confirm / IdP pages back onto the Builder app) — this is resilient to
// the exact landing DOM, which can be refined with a concrete element selector later.
module.exports = {
  appHeader: selectorFile.css.Builder.landing.appHeader,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    var landed = false;
    // Derive the app host from the env's appUrl (env.json) so the landing check is env-agnostic —
    // thor: asgard-thor-builder.comprodls.com, qa: qa-builder.cambridgeone.org. Never hardcode a host.
    var appHost = "";
    try { appHost = new URL(appUrl).host; } catch (e) { appHost = ""; }
    try {
      // 1) The SSO bounces through /redirect ("Logging you in...") before the app; wait until
      //    the URL settles on the Builder app host (off every login/identity route).
      landed = await browser.waitUntil(
        async () => {
          const url = await browser.getUrl();
          return (
            (appHost ? url.indexOf(appHost) !== -1 : true) &&
            !/pre-login|\/login|builder-identity|\/redirect/.test(url)
          );
        },
        { timeout: 45000, interval: 500, timeoutMsg: "Builder landing URL did not settle after login" }
      );
      // 2) Confirm the app shell rendered (sticky dashboard header).
      await action.waitForDocumentLoad();
      const headerVisible = await action.waitForDisplayed(this.appHeader, 20000);
      landed = landed && headerVisible === true;
    } catch (err) {
      await logger.logInto(await stackTrace.get(), err.message, "error");
      landed = false;
    }
    return { pageStatus: landed };
  },
};
