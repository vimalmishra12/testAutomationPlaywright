"use strict";
var action = require('../../core/actionLibrary/baseActionLibrary.js')
var selectorFile = jsonParserUtil.jsonParser(selectorDir)
var appShellPage = require('./appShell.page.js')

module.exports = {
notificationBtn: selectorFile.css.ComproC1.invitationNotification.notificationBtn,
invitationNotify: selectorFile.css.ComproC1.invitationNotification.invitationNotify,
selectCheckbox: selectorFile.css.ComproC1.invitationNotification.selectCheckbox,
acceptBtn: selectorFile.css.ComproC1.invitationNotification.acceptBtn,
goToDashboard: selectorFile.css.ComproC1.invitationNotification.goToDashboard,




isInitialized: async function ()
{ 
var res;
await logger.logInto(await stackTrace.get());
await action.waitForDocumentLoad();
res = {
pageStatus: await action.waitForDisplayed(this.notificationBtn),
};
return res; 
},

getData_invitationAccept: async function ()
{
await logger.logInto(await stackTrace.get());
var obj;
obj = {
notificationBtn:(( await action.getElementCount(this.notificationBtn)) > 0) ? await action.getText(this.notificationBtn) : null,
invitationNotify:(( await action.getElementCount(this.invitationNotify)) > 0) ? await action.getText(this.invitationNotify) : null,
selectCheckbox:(( await action.getElementCount(this.selectCheckbox)) > 0) ? await action.getText(this.selectCheckbox) : null,
acceptBtn:(( await action.getElementCount(this.acceptBtn)) > 0) ? await action.getText(this.acceptBtn) : null,
goToDashboard:(( await action.getElementCount(this.goToDashboard)) > 0) ? await action.getText(this.goToDashboard) : null,
}
 return obj; 
},


/**
 * HOUSEKEEPING (Invariant 14 — resilience belongs in setup, never in the path under test).
 * Waits until the learner's bell holds a notification, reloading between checks, then reloads
 * once more so the bell is CLOSED again for TST_INVI_TC_1 (which opens it).
 * Why [2026-09-22, SOURCE playwright-automation-c1 ClassDashboardPage.learnerAcceptInvite]: the
 * class-invite notification reaches the learner up to ~2 min after the teacher sends it.
 * Note: invitationNotify is the FIRST notification title (positional) — sound here only because
 * the learner is brand new and the invite is its only notification.
 */
wait_forInvitationNotification: async function (timeoutMs) {
await logger.logInto(await stackTrace.get());
var deadline = Date.now() + (timeoutMs || 120000);
var found = false;
while (Date.now() < deadline) {
  await action.waitForDisplayed(this.notificationBtn, 30000);
  await action.click(this.notificationBtn);
  if (true == (await action.waitForDisplayed(this.invitationNotify, 10000))) { found = true; break; }
  await browser.pause(15000);
  await browser.refresh();
}
await browser.refresh();
await action.waitForDisplayed(this.notificationBtn, 30000);
return { found: found };
},

/**
 * Ticks the invitation for `className` (matched by the checkbox's aria-label "Select <class>")
 * and reports whether it is ticked and Accept became enabled.
 * [2026-09-22, prod trace] The invitation page renders its header and "Select all" before the
 * invitation list loads; a click on "Select all" in that window is lost and Accept stays
 * disabled. Waiting for the NAMED class row is the real "list loaded" signal (Invariant 5), and
 * picks this run's invitation even if the learner had others.
 */
select_invitationByClass: async function (className) {
await logger.logInto(await stackTrace.get(), "class:" + className);
var sel = selectorFile.css.ComproC1.invitationNotification.invitedClassCheckbox.replace("{CLASS_NAME}", className);
// [2026-09-22, prod trace] Opening the invitation first renders the list, THEN the app routes to
// /dashboard/invitation/main and re-renders it — a tick made before that route is wiped (the
// click "worked", isChecked read false). Settle on the final route before touching the list.
await action.waitForUrl(/\/dashboard\/invitation\/main/, 30000);
await action.waitForDocumentLoad();
var listed = true == (await action.waitForDisplayed(sel, 30000));
if (!listed) return { classListed: false, selected: false, acceptEnabled: false };
var res = await action.click(sel);
var selected = true == res && true == (await action.isSelected(sel));
return { classListed: true, selected: selected, acceptEnabled: true == (await action.waitForEnabled(this.acceptBtn, 10000)) };
},

click_notificationBtn: async function () {
await logger.logInto(await stackTrace.get());
var res;
await browser.pause(5000);
await action.waitForDocumentLoad();
await action.waitForDisplayed(this.notificationBtn,undefined);
res =await action.click(this.notificationBtn);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " notificationBtn is clicked");
}
else {
await logger.logInto(await stackTrace.get(), res +"notificationBtn is NOT clicked", 'error');
}
return res;
},

click_invitationNotify: async function () {
await logger.logInto(await stackTrace.get());
var res;
res =await action.click(this.invitationNotify);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " invitationNotify is clicked");
}
else {
await logger.logInto(await stackTrace.get(), res +"invitationNotify is NOT clicked", 'error');
}
return res;
},



click_selectCheckbox: async function () {
await logger.logInto(await stackTrace.get());
var res;
res =await action.click(this.selectCheckbox);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " selectCheckbox is clicked");
}
else {
await logger.logInto(await stackTrace.get(), res +"selectCheckbox is NOT clicked", 'error');
}
return res;
},

click_acceptBtn: async function () {
await logger.logInto(await stackTrace.get());
var res;
res =await action.click(this.acceptBtn);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " acceptBtn is clicked");
}
else {
await logger.logInto(await stackTrace.get(), res +"acceptBtn is NOT clicked", 'error');
}
return res;
},

click_goToDashboard: async function () {
await logger.logInto(await stackTrace.get());
var res;
res =await action.click(this.goToDashboard);
if (true == res) {
 await logger.logInto(await stackTrace.get(), " goToDashboard is clicked");
}
else {
await logger.logInto(await stackTrace.get(), res +"goToDashboard is NOT clicked", 'error');
}
return res;
},

}

