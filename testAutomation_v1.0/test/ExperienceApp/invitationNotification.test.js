"use strict";

var invitationNotification= require('../../pages/ExperienceApp/invitationNotification.page.js');
var sts;

module.exports = {
// [2026-09-22] Housekeeping (TC_100+): wait until the class invite reaches the learner's bell —
// it lags the teacher's invite by up to ~2 min (SOURCE). Retry lives here, never in TC_1..5.
TST_INVI_TC_101 :   async function (testdata) {
sts = await invitationNotification.wait_forInvitationNotification(testdata.timeoutMs);
await assertion.assertEqual(sts.found, true, "Class invitation did not reach the learner's notifications in time");
},

// [2026-09-22] LP migration: the invitation page lists the invited class by name; ticking it enables Accept.
TST_INVI_TC_13 :   async function (testdata) {
sts = await invitationNotification.select_invitationByClass(testdata);
await assertion.assertEqual(sts.classListed, true, "Invitation for '" + testdata + "' not listed");
await assertion.assertEqual(sts.selected, true, "Invitation for '" + testdata + "' could not be ticked");
await assertion.assertEqual(sts.acceptEnabled, true, "Accept stayed disabled after ticking the invitation");
},

TST_INVI_TC_1 :   async function (testdata) {
sts = await invitationNotification.click_notificationBtn();
await assertion.assertEqual(sts, true,"notificationBtn are not Clicked");
},

TST_INVI_TC_2 :   async function (testdata) { 
sts = await invitationNotification.click_invitationNotify();
await assertion.assertEqual(sts, true,"invitationNotify are not Clicked");
},

TST_INVI_TC_3 :   async function (testdata) { 
//For now, We are clicking on selectAll checkbox, In future if we have to select specific checkbox then we have to modify the function(in page file) accordingly.   
sts = await invitationNotification.click_selectCheckbox(testdata);
await assertion.assertEqual(sts, true,"selectCheckbox are not Clicked");
},

TST_INVI_TC_4 :   async function (testdata) { 
sts = await invitationNotification.click_acceptBtn();
await assertion.assertEqual(sts, true,"acceptBtn are not Clicked");
},

TST_INVI_TC_5 :   async function (testdata) { 
sts = await invitationNotification.click_goToDashboard();
await assertion.assertEqual(sts, true,"goToDashboard are not Clicked");
},

TST_INVI_TC_6 :   async function (testdata) { 
sts = await invitationNotification.getData_invitationAccept(testdata);
await assertion.assertEqual(sts.notificationBtn, testdata.notificationBtn,"notificationBtn Values is not as expected.");
await assertion.assertEqual(sts.invitationNotify, testdata.invitationNotify,"invitationNotify Values is not as expected.");
await assertion.assertEqual(sts.selectCheckbox, testdata.selectCheckbox,"selectCheckbox Values is not as expected.");
await assertion.assertEqual(sts.acceptBtn, testdata.acceptBtn,"acceptBtn Values is not as expected.");
await assertion.assertEqual(sts.goToDashboard, testdata.goToDashboard,"goToDashboard Values is not as expected.");
},

}