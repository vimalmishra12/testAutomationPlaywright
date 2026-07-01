"use strict";
var action = require("../../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

module.exports = {
  // PE deeplink pages reuse the standard PE viewer selectors (css.LTI.ltiPEPage);
  // there is no separate deeplink PE selector block.
  peIframe:       selectorFile.css.LTI.ltiPEPage.activityIframe,
  peBackBtn:      selectorFile.css.LTI.ltiPEPage.backBtn,
  peTocScore:     selectorFile.css.LTI.ltiPEPage.tocActivityScore,
  peTocHamburger: selectorFile.css.LTI.ltiPEPage.tocHamburger,
  peTocItems:     selectorFile.css.LTI.ltiPEPage.tocItems,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    // lti-onboarding may redirect the content tab; wait for the URL to leave onboarding
    // before checking elements (best-effort — if already on content, resolves at once).
    await action.waitForUrl(url => !url.includes('/lti-onboarding/'), 30000);
    await action.waitForDocumentLoad();
    // Use the activity iframe as the page-ready guard — PE deeplink pages have no h1.
    var res = await action.waitForDisplayed(this.peIframe, 60000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + ' isInitialized FAILED — URL: ' + (await browser.getUrl()), 'error');
    }
    return { pageStatus: res === true };
  },

  getData_peDeeplinkState: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    // Activity launches directly into the iframe; the left TOC is present but collapsed
    // by default (see expand_peToc), so we guard on the iframe rather than the TOC here.
    var iframeStatus = await action.waitForDisplayed(this.peIframe, 30000);
    // Back button is absent on deeplink pages (no LMS context frame to return to).
    // Short timeout: the page is already loaded (iframe up) so absence is decided fast.
    // Normalize to boolean: waitForDisplayed returns TimeoutError string when not found.
    var backBtnStatus = (await action.waitForDisplayed(this.peBackBtn, 1500)) === true;
    var urlStatus = !(await browser.getUrl()).includes('/lti-onboarding/');
    return { iframeStatus, backBtnStatus, urlStatus };
  },

  // Expands the left TOC, which is collapsed by default on the deeplink PE page — the
  // accordion (and its .activity-score badges) is not in the DOM until expanded. Kept
  // separate from getData_peTocScores so the reader stays side-effect-free (ADR-003);
  // the test orchestrates this first.
  expand_peToc: async function () {
    await logger.logInto(await stackTrace.get());
    // Toggle guard: if the accordion is already showing, the TOC is expanded — clicking
    // the hamburger again would collapse it. isDisplayed is an immediate (no-wait) check,
    // so this adds no cost on the normal collapsed path.
    if (true === await action.isDisplayed(this.peTocItems)) {
      await logger.logInto(await stackTrace.get(), "TOC already expanded — skipping hamburger");
      return true;
    }
    var res = await action.waitForDisplayed(this.peTocHamburger, 15000);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " TOC hamburger not visible — cannot expand TOC", "error");
      return res;
    }
    res = await action.click(this.peTocHamburger);
    if (true !== res) {
      await logger.logInto(await stackTrace.get(), res + " TOC hamburger NOT clicked", "error");
      return res;
    }
    await logger.logInto(await stackTrace.get(), "TOC expanded via hamburger");
    return true;
  },

  // Reads the per-activity score badges in the left TOC (call expand_peToc first). A
  // STUDENT's PE deeplink retains prior progress, so the TOC renders .activity-score
  // badges (e.g. "88%"); a TEACHER sees none. `timeout` gates the wait for the first score
  // to attach: pass the default for the student (present) case; a teacher asserting ABSENCE
  // can pass a short timeout since no score will ever appear (avoids a full 10s stall).
  getData_peTocScores: async function (timeout) {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    var scorePresent = (await action.waitForExist(this.peTocScore, timeout || 10000)) === true;
    var scoreCount = scorePresent ? await action.getElementCount(this.peTocScore) : 0;
    var scoreText  = scorePresent ? await action.getText(this.peTocScore) : "";
    await logger.logInto(await stackTrace.get(), "scorePresent:" + scorePresent + " scoreCount:" + scoreCount + " firstScore:" + scoreText);
    return { scorePresent, scoreCount, scoreText };
  },
};
