'use strict';
var createNewClass = require('../../pages/ExperienceApp/createNewClass.page.js');
var sts;

module.exports = {
  TST_ENTE_TC_1: async function () {
    sts = await createNewClass.isInitialized();
    await assertion.assertEqual(
      sts.pageStatus,
      true,
      'enterClassDetails page status mismatch'
    );
  },

  TST_ENTE_TC_2: async function () {
    sts = await createNewClass.click_back_btn();
    await assertion.assertEqual(sts.pageStatus, true, 'Page is not launched. ');
  },

  TST_ENTE_TC_3: async function (testData) {
    sts = await createNewClass.set_enterClassName(testData);
    await assertion.assertEqual(sts, true, 'enterClassName values are not set');
  },

  TST_ENTE_TC_4: async function (testdata) {
    sts = await createNewClass.set_startDate();
    await assertion.assertEqual(sts, true, 'startDate values are not set');
  },

  TST_ENTE_TC_5: async function (testdata) {
    sts = await createNewClass.set_endDate();
    await assertion.assertEqual(sts, true, 'endDate values are not set');
  },

  TST_ENTE_TC_6: async function (testdata) {
    sts = await createNewClass.set_enterYourSchool();
    await assertion.assertEqual(
      sts,
      true,
      'enterYourSchool values are not set'
    );
  },

  TST_ENTE_TC_7: async function (testdata) {
    sts = await createNewClass.click_cancel_btn();
    await assertion.assertEqual(sts, true, 'cancel_btn are not Clicked');
  },

  TST_ENTE_TC_8: async function (testdata) {
    sts = await createNewClass.getData_classDetails(testdata);
    await assertion.assertEqual(
      sts.enterClassDetails,
      testdata.enterClassDetails,
      'enterClassDetails Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.back_btn,
      testdata.back_btn,
      'back_btn Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.enterClassName,
      testdata.enterClassName,
      'enterClassName Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.startDate,
      testdata.startDate,
      'startDate Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.endDate,
      testdata.endDate,
      'endDate Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.enterYourSchool,
      testdata.enterYourSchool,
      'enterYourSchool Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.cancel_btn,
      testdata.cancel_btn,
      'cancel_btn Values is not as expected.'
    );
  },

  TST_ENTE_TC_9: async function (testdata) {
    sts = await createNewClass.click_next_btn();
    await assertion.assertEqual(sts, true, 'next_btn are not Clicked');
  },

  TST_ENTE_TC_10: async function (testdata) {
    sts = await createNewClass.click_cancel_btn_classMaterial();
    await assertion.assertEqual(sts.pageStatus, true, 'Page is not launched. ');
  },

  TST_ENTE_TC_11: async function (testdata) {
    sts = await createNewClass.click_addLater_Btn();
    await assertion.assertEqual(sts, true, 'addLater_Btn are not Clicked');
  },

  TST_ENTE_TC_12: async function (testdata) {
    sts = await createNewClass.click_dashboard_btn();
    await assertion.assertEqual(sts.pageStatus, true, 'Page is not launched. ');
  },

  TST_ENTE_TC_13: async function (testdata) {
    sts = await createNewClass.click_noKeep_btn();
    await assertion.assertEqual(sts, true, 'noKeep_btn are not Clicked');
  },

  TST_ENTE_TC_14: async function (testdata) {
    sts = await createNewClass.getData_classMaterial(testdata);
    await assertion.assertEqual(
      sts.addClassMaterials,
      testdata.addClassMaterials,
      'addClassMaterials Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.cancel_btn_classMaterial,
      testdata.cancel_btn_classMaterial,
      'cancel_btn_classMaterial Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.addLater_Btn,
      testdata.addLater_Btn,
      'addLater_Btn Values is not as expected.'
    );

    await assertion.assertEqual(
      sts.addMaterial_btn,
      testdata.addMaterial_btn,
      'addMaterial_btn Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.addMaterial_input,
      testdata.addMaterial_input,
      'addMaterial_input Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.dev_test_ebook_bundle_104_bundle,
      testdata.dev_test_ebook_bundle_104_bundle,
      'dev_test_ebook_bundle_104_bundle Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.addToClass_Btn,
      testdata.addToClass_Btn,
      'addToClass_Btn Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.finish_btn,
      testdata.finish_btn,
      'finish_btn Values is not as expected.'
    );
  },

  TST_ENTE_TC_15: async function (testdata) {
    sts = await createNewClass.getData_successfullyCreated(testdata);
    await assertion.assertEqual(
      sts.classSuccessfullyCreated,
      testdata.classSuccessfullyCreated,
      'classSuccessfullyCreated Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.dashboard_btn,
      testdata.dashboard_btn,
      'dashboard_btn Values is not as expected.'
    );
  },

  TST_ENTE_TC_16: async function (testdata) {
    sts = await createNewClass.getData_cancelModal(testdata);
    await assertion.assertEqual(
      sts.cancelThisClass,
      testdata.cancelThisClass,
      'cancelThisClass Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.yesCancel_btn,
      testdata.yesCancel_btn,
      'yesCancel_btn Values is not as expected.'
    );
    await assertion.assertEqual(
      sts.noKeep_btn,
      testdata.noKeep_btn,
      'noKeep_btn Values is not as expected.'
    );
  },

  TST_ENTE_TC_17: async function (testdata) {
    sts = await createNewClass.click_yesCancel_btn();
    await assertion.assertEqual(sts.pageStatus, true, 'Page is not launched. ');
  },

  TST_ENTE_TC_18: async function (testdata) {
    sts = await createNewClass.click_finish_btn();
    await assertion.assertEqual(sts, true, 'finish_btn are not Clicked');
  },

  TST_ENTE_TC_19: async function (testdata) {
    sts = await createNewClass.click_addToClass_Btn();
    await assertion.assertEqual(sts, true, 'addToClass_Btn are not Clicked');
  },

  TST_ENTE_TC_20: async function (testdata) {
    sts = await createNewClass.click_dev_test_ebook_bundle_104_bundle();
    await assertion.assertEqual(
      sts,
      true,
      'dev_test_ebook_bundle_104_bundle are not Clicked'
    );
  },

  TST_ENTE_TC_21: async function (testdata) {
    sts = await createNewClass.set_addMaterial_input(testdata);
    await assertion.assertEqual(
      sts,
      true,
      'addMaterial_input values are not set'
    );
  },

  TST_ENTE_TC_22: async function (testdata) {
    sts = await createNewClass.click_addMaterial_btn();
    await assertion.assertEqual(sts, true, 'addMaterial_btn are not Clicked');
  },

  TST_ENTE_TC_23: async function (testdata) {
    sts =
      await createNewClass.click_dev_test_ebook_bundle_104_bundle_dropdown();
    await assertion.assertEqual(
      sts,
      true,
      'dev_test_ebook_bundle_104_bundle_dropdown are not Clicked'
    );
  },

  TST_CREA_TC_19 :   async function (testdata) { 
  sts = await createNewClass.click_classData();
  await assertion.assertEqual(sts, true,"classData are not Clicked");
  },
  
  TST_CREA_TC_20 :   async function (testdata) { 
  sts = await createNewClass.click_addStudents();
  await assertion.assertEqual(sts, true,"addStudents are not Clicked");
  },
  
  TST_CREA_TC_21 :   async function (testdata) { 
  sts = await createNewClass.click_adultsRadio();
  await assertion.assertEqual(sts, true,"adultsRadio are not Clicked");
  },
  
  TST_CREA_TC_22 :   async function (testdata) { 
  sts = await createNewClass.click_confirmationNextBtn();
  await assertion.assertEqual(sts, true,"confirmationNextBtn are not Clicked");
  },
  
  TST_CREA_TC_23 :   async function (testdata) { 
  sts = await createNewClass.set_studentEmail_input(testdata);
  await assertion.assertEqual(sts, true ,"studentEmail_input values are not set");
  
  },
  
  TST_CREA_TC_24 :   async function (testdata) { 
  sts = await createNewClass.click_inviteStudentBtn();
  await assertion.assertEqual(sts, true,"inviteStudentBtn are not Clicked");
  },

  TST_CREA_TC_29 :   async function (testdata) { 
  sts = await createNewClass.getData_inviteStudent(testdata);
  await assertion.assertEqual(sts.classData, testdata.classData,"classData Values is not as expected.");
  await assertion.assertEqual(sts.addStudents, testdata.addStudents,"addStudents Values is not as expected.");
  await assertion.assertEqual(sts.adultsRadio, testdata.adultsRadio,"adultsRadio Values is not as expected.");
  await assertion.assertEqual(sts.confirmationNextBtn, testdata.confirmationNextBtn,"confirmationNextBtn Values is not as expected.");
  await assertion.assertEqual(sts.studentEmail_input, testdata.studentEmail_input,"studentEmail_input Values is not as expected.");
  await assertion.assertEqual(sts.inviteStudentBtn, testdata.inviteStudentBtn,"inviteStudentBtn Values is not as expected.");
  await assertion.assertEqual(sts.pendingTitle, testdata.pendingTitle,"pendingTitle Values is not as expected.");
  },

  // [2026-09-22] LP migration: pick the material by EXACT name (not the first search result).
  TST_ENTE_TC_24: async function (testdata) {
    sts = await createNewClass.select_materialByName(testdata);
    await assertion.assertEqual(sts.selected, true, "Material '" + testdata + "' not found in the search results / not ticked");
    await assertion.assertEqual(sts.selectedName, testdata, "A different material was picked");
  },

  // [2026-09-22] LP migration: the invited learner's own e-mail is listed as pending.
  TST_CREA_TC_30: async function (testdata) {
    sts = await createNewClass.getData_pendingInvite(testdata);
    await assertion.assertEqual(sts.emailPending, true, "Invited e-mail '" + testdata + "' not listed in the pending invitations");
  },

  // [2026-09-22] LP migration: a collaborative material raises an info dialog that must be closed.
  TST_ENTE_TC_26: async function (testdata) {
    sts = await createNewClass.close_collaborativeInfo();
    await assertion.assertEqual(sts.shown, true, "Collaborative-material info dialog not shown after Add to class");
    await assertion.assertEqual(sts.title, testdata.title, "Unexpected info dialog title");
    await assertion.assertEqual(sts.closed, true, "Collaborative-material info dialog did not close");
  },

  // [2026-09-22] LP migration: class created → shown on the dashboard by name → has a class key.
  TST_ENTE_TC_25: async function (testdata) {
    sts = await createNewClass.getData_createdClass(testdata.className);
    await assertion.assertEqual(sts.successText, testdata.successText, "Class-created confirmation not shown");
    await assertion.assertEqual(sts.classOnDashboard, true, "Class '" + testdata.className + "' not listed on the teacher dashboard");
    await assertion.assert(typeof sts.classKey === "string" && sts.classKey.length > 0, "Class key not shown on the class page");
  },
};