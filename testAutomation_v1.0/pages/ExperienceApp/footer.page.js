"use strict";
var action = require('../../core/actionLibrary/baseActionLibrary.js')
var selectorFile = jsonParserUtil.jsonParser(selectorDir)
var appShellPage = require('./appShell.page.js')

module.exports = {
footerTermsOfUse: selectorFile.css.ComproC1.footer.footerTermsOfUse,
footerPrivacyNotice: selectorFile.css.ComproC1.footer.footerPrivacyNotice,
footerAccesibility: selectorFile.css.ComproC1.footer.footerAccesibility,
footerOurApproaches: selectorFile.css.ComproC1.footer.footerOurApproaches,
footerSiteFeedback: selectorFile.css.ComproC1.footer.footerSiteFeedback,
footerFAQs: selectorFile.css.ComproC1.footer.footerFAQs,
footerCambridgeOneSchool: selectorFile.css.ComproC1.footer.footerCambridgeOneSchool,
footerHelp: selectorFile.css.ComproC1.footer.footerHelp,
footerCambridgeUniversity: selectorFile.css.ComproC1.footer.footerCambridgeUniversity,


isInitialized: async function ()
{ 
var res;
await logger.logInto(await stackTrace.get());
await action.waitForDocumentLoad();
res = {
pageStatus: await action.waitForDisplayed(this.footerTermsOfUse),
};
return res; 
},

getData_footerPage: async function ()
{
await logger.logInto(await stackTrace.get());
var obj;
obj = {
footerTermsOfUse:(( await action.getElementCount(this.footerTermsOfUse)) > 0) ? await action.getText(this.footerTermsOfUse) : null,
footerPrivacyNotice:(( await action.getElementCount(this.footerPrivacyNotice)) > 0) ? await action.getText(this.footerPrivacyNotice) : null,
footerAccesibility:(( await action.getElementCount(this.footerAccesibility)) > 0) ? await action.getText(this.footerAccesibility) : null,
footerOurApproaches:(( await action.getElementCount(this.footerOurApproaches)) > 0) ? await action.getText(this.footerOurApproaches) : null,
footerSiteFeedback:(( await action.getElementCount(this.footerSiteFeedback)) > 0) ? await action.getText(this.footerSiteFeedback) : null,
footerFAQs:(( await action.getElementCount(this.footerFAQs)) > 0) ? await action.getText(this.footerFAQs) : null,
footerCambridgeOneSchool:(( await action.getElementCount(this.footerCambridgeOneSchool)) > 0) ? await action.getText(this.footerCambridgeOneSchool) : null,
footerHelp:(( await action.getElementCount(this.footerHelp)) > 0) ? await action.getText(this.footerHelp) : null,
footerCambridgeUniversity:(( await action.getElementCount(this.footerCambridgeUniversity)) > 0) ? await action.getText(this.footerCambridgeUniversity) : null,
}
 return obj; 
},


click_footerTermsOfUse: async function () {
await logger.logInto(await stackTrace.get());
var res;

 browser.pause(3000);
action.waitForDocumentLoad();
action.waitForDisplayed(this.footerTermsOfUse);

//await element.scrollIntoView(this.footerTermsOfUse);
//action.waitForElement(this.footerTermsOfUse);
//await browser.keys('PageDown');
//await element.scrollIntoView(this.footerTermsOfUse);
browser.pause();
//res =  await action.moveTo(this.footerTermsOfUse);

console.log(res)
res =await action.click(this.footerTermsOfUse);


console.log("RES VALUE", res);

if (true == res) {
 await logger.logInto(await stackTrace.get(), " footerTermsOfUse is clicked");
res =await require ('./terms.page.js').isInitialized();
}
else {
await logger.logInto(await stackTrace.get(), res +"footerTermsOfUse is NOT clicked", 'error');
}
return res;
},

click_footerPrivacy: async function () {
await logger.logInto(await stackTrace.get());
var res;


 await browser.pause(1000);
 await action.waitForDocumentLoad();
 await action.waitForDisplayed(this.footerPrivacyNotice);

//console.log (" prevacy page is loaded sucessfully :-");
//await browser.pause(500);

res =await action.click(this.footerPrivacyNotice);
await action.waitForDocumentLoad();

if (true == res) {
 await logger.logInto(await stackTrace.get(), " footerPrivacyNotice is clicked");
res =await require ('./privacy.page.js').isInitialized();
}
else {
await logger.logInto(await stackTrace.get(), res +"footerPrivacyNotice is NOT clicked", 'error');
}
console.log("res value is", res);
return res;
},

click_footerAccesibility: async function () {
await logger.logInto(await stackTrace.get());
var res;

 browser.pause(3000);
action.waitForDocumentLoad();
action.waitForDisplayed(this.footerAccesibility);

res =await action.click(this.footerAccesibility);

console.log("accessibility button clicked");

if (true == res) {
 await logger.logInto(await stackTrace.get(), " footerAccesibility is clicked");
res =await require ('./accesibility.page.js').isInitialized();
}
else {
await logger.logInto(await stackTrace.get(), res +"footerAccesibility is NOT clicked", 'error');
}
return res;
},

click_footerOurApproaches: async function () {
await logger.logInto(await stackTrace.get());

var res;

browser.pause(3000);
action.waitForDocumentLoad();
action.waitForDisplayed(this.footerOurApproaches);
res =await action.click(this.footerOurApproaches);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " footerOurApproaches is clicked");
res =await require ('./ourApproaches.page').isInitialized();
}
else {
await logger.logInto(await stackTrace.get(), res +"footerOurApproaches is NOT clicked", 'error');
}
return res;
},

click_footerSiteFeedback: async function () {
await logger.logInto(await stackTrace.get());
var res;
res =await action.click(this.footerSiteFeedback);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " footerSiteFeedback is clicked");
res =await require ('./siteFeedback.page').isInitialized();
}
else {
await logger.logInto(await stackTrace.get(), res +"footerSiteFeedback is NOT clicked", 'error');
}
return res;
},

click_footerFAQs: async function () {
await logger.logInto(await stackTrace.get());
var res;
res =await action.click(this.footerFAQs);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " footerFAQs is clicked");
res =await require ('./faqs.page').isInitialized();
}
else {
await logger.logInto(await stackTrace.get(), res +"footerFAQs is NOT clicked", 'error');
}
return res;
},

click_footerCambridgeOneSchool: async function () {
await logger.logInto(await stackTrace.get());
var res;
var target = require('./footerCambridgeOneForSchool.page');

// [2026-06-15] SPA-navigation flake hardening (NEMO-24388 before-hook, ~20% repro).
// The footer "Cambridge One for schools" link is an Angular route. Playwright's click
// auto-wait only checks DOM actionability (visible/stable/enabled) — NOT whether Angular
// has bound the routerLink handler yet. So an early click can be a NO-OP: no navigation
// fires, the target page's .heading-title never renders, and the 30s waitFor times out,
// aborting the whole before-hook. Fix: let the page settle, click, verify the target page
// initialised, and if it did not AND we are still on the dashboard (link still present =>
// the click was a no-op), re-click once.
await action.waitForDisplayed(this.footerCambridgeOneSchool, 10000);
await action.waitForDocumentLoad();

res = await action.click(this.footerCambridgeOneSchool);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " footerCambridgeOneSchool is clicked");
res = await target.isInitialized();
if (!(res && res.pageStatus === true)) {
  // Did the click actually navigate? If the footer link is still present we never left the
  // dashboard (no-op click) — re-click once. If it is gone, navigation happened but the
  // heading was slow; the isInitialized() above already waited, so fall through with its result.
  var stillOnDashboard = (await action.getElementCount(this.footerCambridgeOneSchool)) > 0;
  if (stillOnDashboard) {
    await logger.logInto(await stackTrace.get(), "schools page did not load (no-op click); retrying footer click once", 'error');
    res = await action.click(this.footerCambridgeOneSchool);
    if (true == res) res = await target.isInitialized();
  }
}
}
else {
await logger.logInto(await stackTrace.get(), res +"footerCambridgeOneSchool is NOT clicked", 'error');
}
return res;
},

click_footerHelp: async function () {
await logger.logInto(await stackTrace.get());

console.log("debugger 0");
var res;

 browser.pause(3000);
action.waitForDocumentLoad();
action.waitForDisplayed(this.footerHelp);

console.log(" debug purpose 1");


res =await action.click(this.footerHelp);
console.log(" debug purpose 2");
if (true == res) {
    console.log(" debug purpose 3");
 await logger.logInto(await stackTrace.get(), " footerHelp is clicked");
res =await require ('./footerHelp.page.js').isInitialized();
}
else {
await logger.logInto(await stackTrace.get(), res +"footerHelp is NOT clicked", 'error');
}
return res;
},

}

