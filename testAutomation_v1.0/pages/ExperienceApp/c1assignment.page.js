"use strict";
var action = require('../../core/actionLibrary/baseActionLibrary.js')
var selectorFile = jsonParserUtil.jsonParser(selectorDir)
var appShellPage = require('./appShell.page.js')

module.exports = {
    classheading: selectorFile.css.ComproC1.c1assignment.classheading,
    Assignments: selectorFile.css.ComproC1.c1assignment.Assignments,
    Createassignment: selectorFile.css.ComproC1.c1assignment.Createassignment,
    PracticeExtracqa: selectorFile.css.ComproC1.c1assignment.PracticeExtracqa,
    Unit1: selectorFile.css.ComproC1.c1assignment.Unit1,
    LessonA: selectorFile.css.ComproC1.c1assignment.LessonA,
    Next: selectorFile.css.ComproC1.c1assignment.Next,
    assignNameInput: selectorFile.css.ComproC1.c1assignment.assignNameInput,
    inputTag: selectorFile.css.ComproC1.c1assignment.inputTag,
    setDate: selectorFile.css.ComproC1.c1assignment.setDate,
    selectStudent: selectorFile.css.ComproC1.c1assignment.selectStudent,
    ViewSummary: selectorFile.css.ComproC1.c1assignment.ViewSummary,
    Assign: selectorFile.css.ComproC1.c1assignment.Assign,
    assignmentDiv: selectorFile.css.ComproC1.c1assignment.assignmentDiv,
    kebabIcon: selectorFile.css.ComproC1.c1assignment.kebabIcon,
    deleteAssignment: selectorFile.css.ComproC1.c1assignment.deleteAssignment,
    viewAssignment: selectorFile.css.ComproC1.c1assignment.viewAssignment,
    yesDelete: selectorFile.css.ComproC1.c1assignment.yesDelete,
    clickHamBurgerIcon: selectorFile.css.ComproC1.c1assignment.clickHamBurgerIcon,
    assignmentBackBtn: selectorFile.css.ComproC1.c1assignment.assignmentBackBtn,
    crossIcon: selectorFile.css.ComproC1.c1assignment.crossIcon,
    timeIncrease: selectorFile.css.ComproC1.c1assignment.timeIncrease,
    createAssignmentBtnInTOC: selectorFile.css.ComproC1.c1assignment.createAssignmentBtnInTOC,
    assignmentModalCancelBtn: selectorFile.css.ComproC1.c1assignment.assignmentModalCancelBtn,
    assignmentModalActionBtn: selectorFile.css.ComproC1.c1assignment.assignmentModalActionBtn,
    createNewAssignmentBtn: selectorFile.css.ComproC1.c1assignment.createNewAssignmentBtn,
    returnToPresentationPlusBtn: selectorFile.css.ComproC1.c1assignment.returnToPresentationPlusBtn,

    isInitialized: async function () {
        var res;
        await logger.logInto(await stackTrace.get());
        await action.waitForDocumentLoad();
        res = {
            pageStatus: await action.waitForDisplayed(this.classheading),
        };
        return res;
    },

    getData_c1assignment: async function () {
        await logger.logInto(await stackTrace.get());
        var obj;
        obj = {
            classheading: ((await action.getElementCount(this.classheading)) > 0) ? await action.getText(this.classheading) : null,
            Assignments: ((await action.getElementCount(this.Assignments)) > 0) ? await action.getText(this.Assignments) : null,
            Createassignment: ((await action.getElementCount(this.Createassignment)) > 0) ? await action.getText(this.Createassignment) : null,
            PracticeExtracqa: ((await action.getElementCount(this.PracticeExtracqa)) > 0) ? await action.getText(this.PracticeExtracqa) : null,
            Unit1: ((await action.getElementCount(this.Unit1)) > 0) ? await action.getText(this.Unit1) : null,
            LessonA: ((await action.getElementCount(this.LessonA)) > 0) ? await action.getText(this.LessonA) : null,
            Next: ((await action.getElementCount(this.Next)) > 0) ? await action.getText(this.Next) : null,
            inputTag: ((await action.getElementCount(this.inputTag)) > 0) ? await action.getText(this.inputTag) : null,
            setDate: ((await action.getElementCount(this.setDate)) > 0) ? await action.getText(this.setDate) : null,
            selectStudent: ((await action.getElementCount(this.selectStudent)) > 0) ? await action.getText(this.selectStudent) : null,
            ViewSummary: ((await action.getElementCount(this.ViewSummary)) > 0) ? await action.getText(this.ViewSummary) : null,
            Assign: ((await action.getElementCount(this.Assign)) > 0) ? await action.getText(this.Assign) : null,
        }
        return obj;
    },

    click_classheading: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.classheading);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " classheading is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " classheading is NOT clicked", 'error');
        }
        return res;
    },

    click_Assignments: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.Assignments);
        await browser.pause(3000);

        if (true == res) {
            await logger.logInto(await stackTrace.get(), " Assignments is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " Assignments is NOT clicked", 'error');
        }
        return res;
    },

    click_Createassignment: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.Createassignment);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " Createassignment is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " Createassignment is NOT clicked", 'error');
        }
        return res;
    },

    click_PracticeExtracqa: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.PracticeExtracqa);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " PracticeExtracqa is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " PracticeExtracqa is NOT clicked", 'error');
        }
        return res;
    },

    click_Unit1: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.Unit1);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " Unit1 is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " Unit1 is NOT clicked", 'error');
        }
        return res;
    },

    click_LessonA: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.LessonA);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " LessonA is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " LessonA is NOT clicked", 'error');
        }
        return res;
    },

    click_Next: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.Next);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " Next is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " Next is NOT clicked", 'error');
        }
        return res;
    },

    enter_AssignNameInput: async function (text) {
        await logger.logInto(await stackTrace.get());


        await action.clearValue(this.assignNameInput);

        var setRes = await action.setValue(this.assignNameInput, text);
        if (setRes === true) {
            await logger.logInto(await stackTrace.get(), "Assign Name Input is set with: " + text);
        } else {
            await logger.logInto(await stackTrace.get(), setRes + " - Failed to set Assign Name Input", 'error');
        }

        return setRes;
    },


    click_inputTag: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.inputTag);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " inputTag is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " inputTag is NOT clicked", 'error');
        }
        await browser.pause(5000);
        return res;
    },

    click_setDate: async function () {
        await browser.pause(5000);
        await action.click(this.timeIncrease);
        await browser.pause(5000);
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.setDate);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " setDate is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " setDate is NOT clicked", 'error');
        }
        return res;
    },

    click_selectStudent: async function () {
        await browser.pause(3000);
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.selectStudent);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " selectStudent is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " selectStudent is NOT clicked", 'error');
        }
        return res;
    },

    click_ViewSummary: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.ViewSummary);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " ViewSummary is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " ViewSummary is NOT clicked", 'error');
        }
        return res;
    },

    click_Assign: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.Assign);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " Assign is clicked");
        }
        else {
            await logger.logInto(await stackTrace.get(), res + " Assign is NOT clicked", 'error');
        }
        return res;
    },

    check_StringMatch: function (text) {
        const match = text.match(/^(.*?)(Ended|Active)/);

        if (match && match[1]) {
            return match[1].trim();
        }
        return null;
    },

    click_playlistTitle: async function (playlistName) {
        await browser.pause(3000);
        await logger.logInto(await stackTrace.get());
        let list = await action.findElements(this.assignmentDiv);

        let matchedIndex = -1;
        for (let i = 0; i < list.length; i++) {
            let text = await action.getText(list[i]);  // FIXED
            if (this.check_StringMatch(text) == playlistName) {
                matchedIndex = i;
                break;
            }
        }
        if (matchedIndex === -1) {
            console.error(`Playlist "${playlistName}" not found`);
            return false;
        }
        let kab_icon = `${this.kebabIcon}${matchedIndex}"]`;
        let res = await action.click(kab_icon);
        return res;
    },


    click_kebabIcon: async function (text) {
        await browser.pause(10000);
        console.log("code is pausong")
        await logger.logInto(await stackTrace.get());
        var res = await this.click_playlistTitle(text)
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " kebabIcon is clicked");
        } else {
            await logger.logInto(await stackTrace.get(), res + " kebabIcon is NOT clicked", 'error');
        }
        return res;
    },

    click_deleteAssignment: async function () {
        await browser.pause(3000);
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.deleteAssignment);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " deleteAssignment is clicked");
        } else {
            await logger.logInto(await stackTrace.get(), res + " deleteAssignment is NOT clicked", 'error');
        }
        return res;
    },

    click_viewAssignment: async function () {
        await browser.pause(3000);
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.viewAssignment);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " deleteAssignment is clicked");
        } else {
            await logger.logInto(await stackTrace.get(), res + " deleteAssignment is NOT clicked", 'error');
        }
        return res;
    },

    click_hamBurgerIcon: async function () {
        await browser.pause(3000);
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.clickHamBurgerIcon);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " deleteAssignment is clicked");
        } else {
            await logger.logInto(await stackTrace.get(), res + " deleteAssignment is NOT clicked", 'error');
        }
        return res;
    },
    click_crossIcon: async function () {
        await browser.pause(3000);
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.crossIcon);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " deleteAssignment is clicked");
        } else {
            await logger.logInto(await stackTrace.get(), res + " deleteAssignment is NOT clicked", 'error');
        }
        return res;
    },

    click_assignmentBackBtn: async function () {
        await browser.pause(3000);
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.assignmentBackBtn);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " deleteAssignment is clicked");
        } else {
            await logger.logInto(await stackTrace.get(), res + " deleteAssignment is NOT clicked", 'error');
        }
        return res;
    },






    click_yesDelete: async function () {
        await logger.logInto(await stackTrace.get());
        var res = await action.click(this.yesDelete);
        if (true == res) {
            await logger.logInto(await stackTrace.get(), " yesDelete is clicked");
        } else {
            await logger.logInto(await stackTrace.get(), res + " yesDelete is NOT clicked", 'error');
        }
        return res;
    },

    click_createAssignmentBtnInTOC: async function () {
        await logger.logInto(await stackTrace.get());
        var displayed = await action.waitForDisplayed(this.createAssignmentBtnInTOC, 15000);
        if (!displayed) {
            await logger.logInto(await stackTrace.get(), "createAssignmentBtnInTOC is not displayed", "error");
            return false;
        }
        var res = await action.click(this.createAssignmentBtnInTOC);
        await browser.pause(1500);
        return res === true;
    },

    click_cancelAssignmentModalBtn: async function () {
        await logger.logInto(await stackTrace.get());
        var displayed = await action.waitForDisplayed(this.assignmentModalCancelBtn, 10000);
        if (!displayed) {
            await logger.logInto(await stackTrace.get(), "assignmentModalCancelBtn is not displayed", "error");
            return false;
        }
        var res = await action.click(this.assignmentModalCancelBtn);
        await browser.pause(1500);
        return res === true;
    },

    click_takeMeToAssignmentsBtn: async function () {
        await logger.logInto(await stackTrace.get());
        var displayed = await action.waitForDisplayed(this.assignmentModalActionBtn, 10000);
        if (!displayed) {
            await logger.logInto(await stackTrace.get(), "assignmentModalActionBtn is not displayed", "error");
            return false;
        }
        var res = await action.click(this.assignmentModalActionBtn);
        await browser.pause(3000);
        var unitDisplayed = await action.waitForDisplayed(this.Unit1, 20000);
        return res === true && unitDisplayed === true;
    },

    click_createNewAssignmentFromModal: async function () {
        await logger.logInto(await stackTrace.get());
        var displayed = await action.waitForDisplayed(this.createNewAssignmentBtn, 15000);
        if (!displayed) {
            await logger.logInto(await stackTrace.get(), "createNewAssignmentBtn is not displayed", "error");
            return false;
        }
        var res = await action.click(this.createNewAssignmentBtn);
        await browser.pause(3000);
        var unitDisplayed = await action.waitForDisplayed(this.Unit1, 20000);
        return res === true && unitDisplayed === true;
    },

    click_returnToPresentationPlusFromModal: async function () {
        await logger.logInto(await stackTrace.get());
        await browser.pause(2000);
        var displayed = await action.waitForDisplayed(this.returnToPresentationPlusBtn, 20000);
        if (!displayed) {
            await logger.logInto(await stackTrace.get(), "returnToPresentationPlusBtn is not displayed", "error");
            return false;
        }
        var res = await action.click(this.returnToPresentationPlusBtn);
        await browser.pause(3000);
        await action.waitForDocumentLoad();
        var eBookPage = require("./eBook.page.js");
        var readerInit = await eBookPage.isInitialized();
        return res === true && readerInit && readerInit.pageStatus === true;
    }
}
