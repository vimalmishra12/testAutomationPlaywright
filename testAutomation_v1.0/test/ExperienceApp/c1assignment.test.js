"use strict";
var c1assignment = require('../../pages/ExperienceApp/c1assignment.page.js');
var sts;

module.exports = {
    TST_C1AS_TC_1: async function (testdata) {
        sts = await c1assignment.click_classheading();
        await assertion.assertEqual(sts, true, "classheading are not Clicked");
    },

    TST_C1AS_TC_2: async function (testdata) {
        sts = await c1assignment.click_Assignments();
        await assertion.assertEqual(sts, true, "Assignments are not Clicked");
    },

    TST_C1AS_TC_3: async function (testdata) {
        sts = await c1assignment.click_Createassignment();
        await assertion.assertEqual(sts, true, "Createassignment are not Clicked");
    },

    TST_C1AS_TC_4: async function (testdata) {
        sts = await c1assignment.click_PracticeExtracqa();
        await assertion.assertEqual(sts, true, "PracticeExtracqa are not Clicked");
    },

    TST_C1AS_TC_5: async function (testdata) {
        sts = await c1assignment.click_Unit1();
        await assertion.assertEqual(sts, true, "Unit1 are not Clicked");
    },

    TST_C1AS_TC_6: async function (testdata) {
        sts = await c1assignment.click_LessonA();
        await assertion.assertEqual(sts, true, "LessonA are not Clicked");
    },

    TST_C1AS_TC_7: async function (testdata) {
        sts = await c1assignment.click_Next();
        await assertion.assertEqual(sts, true, "Next are not Clicked");
    },

    //add here for the enterassign name and then make the nimerb ecrret
    TST_C1AS_TC_8: async function (testdata) {
        sts = await c1assignment.enter_AssignNameInput(testdata);
        await assertion.assertEqual(sts, true, "Assignment Name is not entered");
    },

    TST_C1AS_TC_9: async function (testdata) {
        sts = await c1assignment.click_inputTag();
        await assertion.assertEqual(sts, true, "inputTag is not Clicked");
    },

    TST_C1AS_TC_10: async function (testdata) {
        sts = await c1assignment.click_setDate();
        await assertion.assertEqual(sts, true, "setDate is not Clicked");
    },

    TST_C1AS_TC_11: async function (testdata) {
        sts = await c1assignment.click_selectStudent();
        await assertion.assertEqual(sts, true, "selectStudent are not Clicked");
    },

    TST_C1AS_TC_12: async function (testdata) {
        sts = await c1assignment.click_ViewSummary();
        await assertion.assertEqual(sts, true, "ViewSummary are not Clicked");
    },

    TST_C1AS_TC_13: async function (testdata) {
        sts = await c1assignment.click_Assign();
        await assertion.assertEqual(sts, true, "Assign are not Clicked");
    },

    TST_C1AS_TC_14: async function (testdata) {
        sts = await c1assignment.click_kebabIcon(testdata);
        await assertion.assertEqual(sts, true, "Kebab icon not clicked");
    },

    TST_C1AS_TC_15: async function (testdata) {
        sts = await c1assignment.click_deleteAssignment();
        await assertion.assertEqual(sts, true, "Delete assignment not clicked");
    },

    TST_C1AS_TC_17: async function (testdata) {
        sts = await c1assignment.click_viewAssignment();
        await assertion.assertEqual(sts, true, "Delete assignment not clicked");
    },

     TST_C1AS_TC_18: async function (testdata) {
        sts = await c1assignment.click_hamBurgerIcon();
        await assertion.assertEqual(sts, true, "Delete assignment not clicked");
    },
    TST_C1AS_TC_19: async function (testdata) {
        sts = await c1assignment.click_crossIcon();
        await assertion.assertEqual(sts, true, "Delete assignment not clicked");
    },
    TST_C1AS_TC_20: async function (testdata) {
        sts = await c1assignment.click_assignmentBackBtn();
        await assertion.assertEqual(sts, true, "Delete assignment not clicked");
    },

    TST_C1AS_TC_16: async function (testdata) {
        sts = await c1assignment.click_yesDelete();
        await assertion.assertEqual(sts, true, "Yes delete not clicked");
    },

    TST_C1AS_TC_21: async function (testdata) {
        var openModal = await c1assignment.click_createAssignmentBtnInTOC();
        await assertion.assertEqual(openModal, true, "Create Assignment button in TOC not clicked");
        sts = await c1assignment.click_cancelAssignmentModalBtn();
        await assertion.assertEqual(sts, true, "Cancel button on confirmation modal not clicked");
    },

    TST_C1AS_TC_22: async function (testdata) {
        var openModal = await c1assignment.click_createAssignmentBtnInTOC();
        await assertion.assertEqual(openModal, true, "Create Assignment button in TOC not clicked");
        sts = await c1assignment.click_takeMeToAssignmentsBtn();
        await assertion.assertEqual(sts, true, "Take me to assignments button not clicked or redirect failed");
    },

    TST_C1AS_TC_23: async function (testdata) {
        sts = await c1assignment.click_createNewAssignmentFromModal();
        await assertion.assertEqual(sts, true, "Create new assignment button not clicked or redirect failed");
    },

    TST_C1AS_TC_24: async function (testdata) {
        sts = await c1assignment.click_returnToPresentationPlusFromModal();
        await assertion.assertEqual(sts, true, "Return to Presentation Plus button not clicked or return failed");
    }

}
