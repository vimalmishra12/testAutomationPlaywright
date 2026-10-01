# Manage Reports Accessibility Test — Walkthrough

## Summary

Created an automated test to verify that the **Download button on the Manage Reports page** is semantically a `<button>` element (not a link `<a>`), ensuring screen readers announce it correctly.

## Architecture: Reuse + New

**7 existing test cases reused** for the login/navigation flow:

| Step | Reused TC | Action |
|---|---|---|
| 1 | `launchUrl` | Navigate to `https://micro-nemo.comprodls.com/` |
| 2 | `TST_LAND_TC_3` | Click "Login" on landing page |
| 3 | `TST_LOGI_TC_1` | Enter username |
| 4 | `TST_LOGI_TC_2` | Enter password |
| 5 | `TST_LOGI_TC_5` | Submit login |
| 6 | `TST_DASH_TC_11` | Click "NLP Class" card |
| 7 | `TST_ACTI_TC_1` | Click "Actions" dropdown |

**2 new test cases created** for the Manage Reports flow:

| TC ID | Action |
|---|---|
| `TST_MRPT_TC_1` | Click "Manage Reports" from Actions dropdown |
| `TST_MRPT_TC_2` | Assert Download element is a `<button>` tag or has `role="button"` |

## Files Created

### [NEW] [manageReports.page.js](file:///d:/testAutomation/QATestAutomation/testAutomation_v1.0/pages/ExperienceApp/manageReports.page.js)
Page Object with methods:
- `isInitialized()` — waits for Download button to be displayed
- `click_manageReports_link()` — clicks Manage Reports and initializes page
- `getDownloadBtnTagName()` — uses `browser.execute()` to get the HTML tag name
- `getDownloadBtnRole()` — uses `action.getAttribute()` to get the `role` attribute
- `verifyDownloadBtnIsButton()` — combines both checks, returns `{ tagName, role, isButton }`

### [NEW] [manageReports.test.js](file:///d:/testAutomation/QATestAutomation/testAutomation_v1.0/test/ExperienceApp/manageReports.test.js)
Test file with:
- `TST_MRPT_TC_1` — clicks Manage Reports, asserts page launched
- `TST_MRPT_TC_2` — verifies Download button accessibility, provides detailed failure message

### [NEW] [manageReportsTest.json](file:///d:/testAutomation/QATestAutomation/testAutomation_v1.0/testResources/testExecutionFiles/ExperienceApp/thor/manageReportsTest.json)
Execution file orchestrating the full flow with `Before` (7 reused TCs) + `Test` (2 new TCs)

### [NEW] [manageReportsData.json](file:///d:/testAutomation/QATestAutomation/testAutomation_v1.0/testResources/testcaseData/ExperienceApp/thor/manageReportsData.json)
Test data containing `className: "NLP Class"` for class navigation

## Files Modified

### [MODIFY] [C1Selectors.json](file:///d:/testAutomation/QATestAutomation/testAutomation_v1.0/testResources/selectors/ExperienceApp/C1Selectors.json)
Added `manageReports` section with selectors for `manageReports_link` and `downloadReport_btn`

```diff:C1Selectors.json
{
  "css": {
    "ComproC1": {
      "c1assignment": {
        "classheading": ".class-title.mx-2",
        "Assignments": "a[qid=\"cView-44\"]",
        "Createassignment": "a[qid=\"rView-5\"]",
        "PracticeExtracqa": "a[qid=\"a-path-2-0\"]",
        "Unit1": "i[class='ml-auto fa fa-angle-right']",
        "LessonA": "div[class=\"custom-control-input-wrapper\"]",
        "Next": "button[qid=\"pAssignment-6\"]",
        "inputTag": "[qid=\"assignment-detail-4\"]",
        "timeIncrease": "button[class=\"owl-dt-control-button owl-dt-control-arrow-button\"]",
        "setDate": "//button[contains(@class,'owl-dt-control-button')]//span[text()=' Set ']",
        "selectStudent": "[qid=\"assignment-detail-6\"]",
        "ViewSummary": "[qid=\"assignment-detail-6\"]",
        "Assign": "[qid=\"assignment-detail-6\"]",
        "kebabIcon": "[qid=\"rView-1-",
        "assignmentDiv": "[qid^=\"rView-20-",
        "deleteAssignment": "a[qid=\"rView-2-0\"]",
        "viewAssignment": "[qid=\"rView-8-0\"]",
        "clickHamBurgerIcon": "a[qid=\"lo-renderer-toggle-btn-9\"]",
        "crossIcon": "a[qid=\"learningPath-1\"]",
        "assignmentBackBtn": "a[qid=\"lo-renderer-bck-btn\"]",
        "yesDelete": "button[qid=\"rView-4\"]",
        "assignNameInput": "[qid=\"assignment-detail-2\"]"
      },
      "c1student": {
        "bellIcon": "#tippyDropdownMenuButton",
        "assignmentNotification": "button[qid=\"ntf-30\"]",
        "routeToAssignment": "a[qid=\"aView-1-0\"]",
        "openHamburgerIcon": "#selectedActivitySidebarBtn",
        "assignmentBack": "#lessonViewBackBtn",
        "closeSideBar": "a[qid=\"learningPath-1\"]",
        "goBack": "a[qid=\"lo-renderer-bck-btn\"]",
        "greenBtn": "a[class='btn green-btn']",
        "nextBtn": "a[title='Next']"
      },
      "footer": {
        "footerTermsOfUse": "a[qid=\"cFooter-1\"]",
        "footerPrivacyNotice": "a[qid=\"cFooter-2\"]",
        "footerAccesibility": "a[qid=\"cFooter-3\"]",
        "footerOurApproaches": "a[qid=\"cFooter-5\"]",
        "footerSiteFeedback": "a[qid=\"cFooter-4\"]",
        "footerFAQs": "a[qid=\"cFooter-9\"][aria-label=\"FAQs\"]",
        "footerCambridgeOneSchool": "a[qid=\"cFooter-9\"][class*=\"insti-btn green-layout-insti-btn\"]",
        "footerHelp": "a[qid=\"cFooter-6\"]",
        "footerCambridgeUniversity": ".copyright.mb-0"
      },
      "footerCambridgeOneForSchool": {
        "footerCambridgeOneForSchools": ".heading-title",
        "footerBack": ".back-text"
      },
      "term": {
        "termsHealding": ".heading1.align-self-center",
        "termBack": "qid\".back-text\"undefined"
      },
      "privacy": {
        "privacyHealding": ".heading1.align-self-center",
        "privacyBack": ".back-text"
      },
      "footerHelp": {
        "footerHelpBack": "a[href=\"https://www.cambridgeone.org/login\"]",
        "footerHelpLang": ".current-language-label"
      },
      "siteFeedback": {
        "cambridgeCustomerSurvey": "img[alt=\"Cambridge Customer Survey\"]",
        "ifYouRequireSupportPlease": "span:nth-child(1)"
      },
      "accesibility": {
        "footerAccessibility": ".accessibility",
        "footerAccesibilityBack": ".back-text"
      },
      "landing": {
        "headingText": ".heading1.mt-2.mt-sm-4.mt-md-0",
        "subheadingText": "div[class=\"main-content text-center text-md-start\"] h2",
        "signupBtn": "a[qid=\"home-1\"]",
        "loginBtn": "a[qid=\"home-2\"]",
        "brandLogo_img": "img[class=\"bg-image\"]",
        "languageSelector_dropdown": "[qid=\"sp-ldd-cntr\"]",
        "languageSelector_dropdown_list": "[class*=\"lang-dropdown-item\"]"
      },
      "login": {
        "page_header": "h2[class=\"gigya-composite-control gigya-composite-control-header login-heading\"]",
        "brandLogo": "img[alt=\"Cambridge Logo\"]",
        "userName_tbox": "#gigya-loginID-56269462240752180",
        "password_tbox": "#gigya-password-56383998600152700",
        "loginPassword_eye": "a[aria-label=\"Show\"]",
        "forgotPassword": "a[title=\"Forgotten your password?\"]",
        "login_btn": "input[value=\"Log in\"]",
        "signup_btn": "a[title=\"Don't have an account yet?\"]"
      },
      "SignUpPage": {
        "signUpEmailPage_btn": "[data-tid=button-signup]"
      },
      "resetPassword": {
        "resetPassword": "form[id=\"gigya-reset-password-form\"] div h2",
        "resetPassword_Btn": "input[value=\"Reset password\"]",
        "enterEmailText": "input[placeholder='Enter your email address *']",
        "backToLogin": "a[title=\"Back to login\"]",
        "emailWarningText": "span[role='alert']"
      },
      "appShell": {
        "userDrop_down": "button[qid=\"cHeader-2\"]",
        "logout_btn": "button[qid=\"cHeader-7\"]",
        "headerbandDiv": "header > div",
        "toggleSidebarBtn": "[aria-label=toggle-sidebar]",
        "custLogo": "[data-tid=image-headerLogo]",
        "dashboardBtn": "[data-tid=button-dashboard]",
        "libraryBtn": "[data-tid=button-library]",
        "browseBtn": "[data-tid=button-browse]",
        "classesBtn": "[data-tid=button-classes]",
        "helpBtn": "[data-tid=button-help]",
        "settingsBtn": "[data-tid=button-settings]",
        "sidebarImg": "[data-tid=image-sidebar]",
        "poweredbyTxt": "[data-tid=text-poweredby]",
        "comproLogo": "[data-tid=image-comprodls]",
        "versionTxt": "[data-tid=text-versionInfo]",
        "notificationBtn": "[data-tid=button-notification], [role=presentation]  [data-tid=button-notification] svg",
        "notificationTxt": "[data-tid=text-drawerHeaderTitle], [role=presentation]  [data-tid=button-notification] div",
        "notificationCloseBtn": "[data-tid=button-close]",
        "noNotificationImg": "[data-tid=image-noNotifications]",
        "grayBackdrop": "[class*=MuiBackdrop]",
        "languageSwitcherBtn": "[data-tid=dropdown-languageselector]",
        "languageList": "[data-tid*=dropdownitem]",
        "selectedLanguage": "[data-tid=dropdown-languageselector] [class*=caption], [data-tid=dropdown-languageselector] p",
        "userProfileBtn": "[data-tid=button-user-profile]",
        "userName": "[data-tid=button-user-profile-info] span, [data-tid=text-username]",
        "emailID": "[data-tid=button-user-profile-info] p, [data-tid=text-useremail]",
        "userProfileOptionBtns": "[data-tid*=button-user-profile-option-",
        "userProfileHelpBtn": "[data-tid=button-user-profile-option-0], [data-tid=button-help]",
        "userProfileSettingsBtn": "[data-tid=button-user-profile-option-1], [data-tid=button-settings]",
        "userProfileLogoutBtn": "[data-tid=button-user-profile-option-2], [data-tid=button-logout]",
        "loaderIcon": "[data-tid=image-loader]",
        "snackbarInfo_txt": "[data-tid=text-error], [data-tid=text-info], [data-tid=text-success]",
        "snackbarClose_btn": "[data-tid=button-close]",
        "classPlusIcon": "[data-tid=button-classes] button",
        "breadcrumbbackbtn": "[data-tid*=breadcrumb-]",
        "indexBtn": "p[data-tid=text-chaptertitle]",
        "indexTOCPanel": "[id=indexToc-panel]",
        "chapterTitle": "h4[data-tid=text-chaptertitle]",
        "indexCloseBtn": "[data-tid=button-closeinfotoc]",
        "inviteBtnTxt": "[data-tid=text-invite]",
        "inviteStudentText": "/html/body/div[4]/div[3]/div/div[1]/div[1]/h6",
        "addToPlaylistBtn": "[data-tid=button-addToPlaylist]",
        "newPlaylistOption": "[data-tid=button-newPlaylistOption]",
        "component": "[data-tid*=button-product-",
        "assignBtn": "[data-tid=button-assign]",
        "shareBtn": "[data-tid=button-share]",
        "libraryDropdownBtn": "[data-tid=library-dropdown]",
        "myMaterialBtn": "[data-tid=button-materials]"
      },
      "dashboard": {
        "help_btn": "a.help-click-btn,button[qid=\"cHeader-hlp-2\"]",
        "progress_btn": "a.progress-link.d-flex.align-items-center",
        "praticeExtra_btn": "a.no-decoration.tile-section-1.tile-section-link",
        "ebook_btn": "a.no-decoration.tile-section-1.tile-section-link",
        "homework_btn": "button.btn.btn-lg.btn-main-1.homework-button",
        "myProgress_btn": "a.agg-progress-btn.btn-main-color-1-bordered",
        "createNewClass": ".btn.btn-main-color-1-bordered.add-button.d-flex.align-items-center.justify-content-center",
        "activeClassCard": "//h4[@class='class-title-heading' and normalize-space()='{CLASS_NAME}']"
      },
      "createNewClass": {
        "enterClassDetails": ".form-heading, .add-class-details-heading",
        "back_btn": "div[class='my-3 create-class-header'] span:nth-child(2)",
        "enterClassName": "input[placeholder=\"e.g. CS 2 English\"]",
        "startDate": "input[value=\"Thu, Oct 3, 2024\"]",
        "endDate": "input[value=\"Thu, Oct 2, 2025\"]",
        "enterYourSchool": "input[placeholder=\"Enter your school\"]",
        "cancel_btn": "button[qid=\"create-class-cancel-button\"]",
        "next_btn": "button[qid=\"create-class-next-button\"], button[qid=\"t-cc-cd-btn-2\"]",
        "addClassMaterials": ".materials-heading",
        "cancel_btn_classMaterial": "button[qid=\"create-class-cancel-button\"], button[qid='create-class-2'], button[qid=\"t-cc-cd-btn-1\"]",
        "addLater_Btn": "button[qid=\"create-class-finish-button\"]",
        "classSuccessfullyCreated": ".heading",
        "dashboard_btn": "a[qid=\"go-to-dashboard-btn-id\"] , button[qid='class-created-success-1'],a[qid=\"t-cc-sc-link-1\"]",
        "cancelThisClass": "div[role=\"document\"] div div h3",
        "yesCancel_btn": ".btn-text.btn-yes.p-3",
        "noKeep_btn": "button[data-bs-dismiss=\"modal\"], button[qid='cancel-modal-2']",
        "addMaterial_btn": "button[qid='add-class-materials-button-3'], button[qid=\"t-cc-cm-btn-1\"]",
        "addMaterial_input": "input[qid=\"material-modal-filter-input\"],input[qid=\"t-cc-mm-inpt-1\"]",
        "dev_test_ebook_bundle_104_bundle": "div[class=\"check\"]",
        "addToClass_Btn": "button[qid=\"material-modal-add-to-class-btn\"] , button[qid='add-material-save-7'],button[qid=\"t-cc-mm-btn-2\"]",
        "finish_btn": "button[qid=\"create-class-finish-button\"] , button[qid='create-class-4'],button[qid=\"t-cc-cm-btn-4\"]",
        "dev_test_ebook_bundle_104_bundle_dropdown": "a[qid=\"material-modal-component-0\"]",
        "classData": "a[qid=\"cView-43\"]",
        "addStudents": "a[qid=\"cView-73\"]",
        "adultsRadio": "label[for=\"adult-radio\"]",
        "confirmationNextBtn": "button[qid=\"typeSelect-4\"]",
        "studentEmail_input": "input[name=\"teacherEmail-0\"],input[qid=\"CBulkEnrollment-learner-0-1\"]",
        "inviteStudentBtn": "button[qid=\"CBulkEnrollment-4\"]",
        "pendingTitle": "#pending-students-container > h3"
      },
      "activeClass": {
        "actionButton": "a[qid=\"cView-70\"]",
        "deleteClass": "a[qid='cView-13']",
        "yesDelete_Btn": "button[qid=\"cView-48\"]"
      },
      "invitationNotification": {
        "notificationBtn": "#tippyDropdownMenuButton",
        "invitationNotify": "h3[class=\"title d-flex mb-1\"]",
        "selectCheckbox": "#select-all-checkbox",
        "acceptBtn": "button[qid=\"idsh-3\"]",
        "goToDashboard": "a[qid=\"iscs-3\"]"
      },

      "progress": {
        "progress": "h1[qid='clView-6']"
      },
      "eBook": {
        "cqa_ebook_evolve": ".eboook-selected.ng-tns-c606183087-2",
        "contentButton": "button[qid=\"72\"]",
        "toolsButton": "button[qid=\"73\"]",
        "closeButton": "button.close-button > em.nemo-close-new",
        "homeButton": "button[qid=\"71\"]",
        "myNotes": "div.notes-title",
        "cqaEbookEvolveDropdown": "button[qid=\"ebook-button-1\"]",
        "dropDownListTitle": "[qid^=\"ebook-list-item-",
        "cqaTestEbookOnlyAssets": "a[qid=\"ebook-list-item-3\"]",
        "cqaTestEbookOnlyAssetsText": "div.eboook-selected.ng-tns-c606183087-2",
        "notes": "div:nth-child(4) div:nth-child(2) button:nth-child(1)",
        "timer": "button[qid=\"94\"]",
        "showAndHideSelection": "button[qid=\"91\"]",
        "drawingTool": "button[qid=\"84\"]",
        "pageNumber": "button[qid=\"toc-6\"]",
        "toggleLayoutBtn": "button[qid=\"83\"]",
        "pagelayoutcontainer": "#readerpagedivB",
        "doublePage": "#readerpagedivB",
        "singlePage": ".reader-display-none",
        "fitToScreenBtn": "button[qid=\"97\"]",
        "fitToWidthBtn": "button[qid=\"98\"]",
        "readerContainerWrapper": "#reader-container-wrapper",
        "zoomInBtn": "button[qid=\"96\"]",
        "zoomOutBtn": "button[qid=\"95\"]",
        "nextPage": "button[qid=\"76\"]",
        "previousPage": "button[qid=\"75\"]"
      },
      "showHideSelection": {
        "hideSelection": "button[qid=\"93\"]",
        "showSelection": "button[qid=\"92\"]",
        "closeSelection": "i.nemo-close-new.nemo-font[aria-hidden=\"true\"]",
        "showSelectionBoxSelector": "[id^='spotlight-div-']",
        "hideSelectionBoxSelector": "[id^='mask-div-']"
      },
      "drawingTool": {
        "drawingToolScribble": "button[qid=\"85\"] img[alt=\"Scribble\"]",
        "drawingToolPenColour": "button[id=\"penColorDropdown\"]",
        "drawingToolPenWidth": "button[id=\"penStrokeDropdown\"]",
        "drawingToolHighlighter": "button[qid=\"86\"] img[alt=\"Highlighter\"]",
        "drawingToolEraser": "#deleteBtn",
        "drawingToolUndo": "button.undo-button[qid=\"88\"]",
        "drawingToolRedo": "button.redo-button[qid=\"89\"]",
        "drawingToolPresentation": "div[id=\"drawing-tools-container-B\"] canvas",
        "penColourGreen": ".pen-color-circle-container .pen-color-outer-circle .pen-color-inner-circle[style=\"background-color: rgb(0, 179, 46);\"]",
        "penColourBlue": ".pen-color-circle-container .pen-color-outer-circle .pen-color-inner-circle[style=style=\"background-color: rgb(0, 2, 255);\"]",
        "penColourRed": ".pen-color-circle-container .pen-color-outer-circle .pen-color-inner-circle[style=\"background-color: rgb(185, 0, 0);\"]",
        "penColourBlack": "div[class=\"pen-color-dropdown ng-tns-c606183087-2 dropright ng-star-inserted show\"] div:nth-child(4) button:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(1)",
        "penStroke4": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-4",
        "penStroke3": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-3",
        "penStroke2": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-2",
        "penStroke1": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-1"
      },
      "eBookLearningPageHyperlink": {
        "hyperLinkAnswer": "div[id=\"ee-overlays11-6\"] div[title=\"Answers\"] div img, div[id=\"ee-overlays27-6\"] div[title=\"Answers\"] div img",
        "hyperLinkVideo": "div[id=\"ee-overlays11-0\"] img, div[id=\"ee-overlays27-0\"] img",
        "hyperlinkAudio": "div[id=\"ee-overlays11-3\"] img, div[id=\"ee-overlays27-3\"] img",
        "hyperlinkAudioNoTranscript": "div[id=\"ee-overlays11-1\"] img, div[id=\"ee-overlays27-1\"] img",
        "hyperlinkNewTab": "div[id=\"ee-overlays11-5\"] img, div[id=\"ee-overlays27-5\"] img",
        "hyperlinkActivity": "div[id=\"ee-overlays11-9\"] div[title=\"Activity\"] div img, div[id=\"ee-overlays27-9\"] div[title=\"Activity\"] div img",
        "hyperLinkGame": "div[id='ee-overlays12-0'] img, div[id='ee-overlays28-0'] img",
        "hyperlinkGoToPage": "div[id='ee-overlays12-2'] img, div[id='ee-overlays28-1'] img",
        "hyperZoomHotspot": "div[id=\"ee-overlays11-8\"] div[title=\"Double tap to zoom\"] div, div[id=\"ee-overlays27-8\"] div[title=\"Double tap to zoom\"] div"
      },
      "hyperLinkAnswerWindow": {
        "hyperAnswerReveal": "a[title=\"Reveal\"]",
        "hyperAnswerClose": "button[class=\"close-button\"]",
        "hyperAnswerFullScreen": "i[title=\"Enter fullscreen\"]",
        "hyperAnswerExitFullScreen": "img[title=\"Exit fullscreen\"]",
        "hyperAnswerQuestion": "div[id=\"rubric-0\"] p",
        "hyperVideoPlay": "span[title=\"Play\"]",
        "hyperVideoClose": "button[qid=\"vid-0\"]",
        "hyperActivityNext": "a[title=\"Next\"]",
        "hyperAudioClose": "div[class=\"title-section dragger\"] i[class=\"nemo-font nemo-cross\"]",
        "HyperShowHideTranscript": "button[qid=\"aud-21\"]",
        "hyperZoomHotspotClose": "[id^=\"zoomHotspot-close-button-\"]",
        "exitActivity": "a[qid=\"resultScreen-1\"]",
        "activityGoodEffort": "div[class=\"feedback-msg\"] h2",
        "startAgainActivity": "a[qid=\"resultScreen-2\"]",
        "activityIFrame": "iframe#iframe_1669693911922-1669727257943-1669850648285,iframe#iframe_1756892185750-1756892187201-1756892198221,iframe#iframe_1762926483082-1762926487641-1762928088058,iframe#iframe_1763976511015-1763976515179-1763976537428",
        "activityScoreCheck": "a[title=\"Check\"]",
        "activityAnsElement": ".draggable button[aria-labelledby^=\"content-\"]"
      },
      "commonActivity": {
        "activityAnsCheck": "a[title=\"Check\"]",
        "activityNext": "a[title=\"Next\"]",
        "activityClose": "button[class=\"close-button\"]",
        "activityStartAgain": "a[qid=\"resultScreen-2\"]",
        "activityExit": "a[qid=\"resultScreen-1\"]"
      },
      "hyperlinkAudio": {
        "hyperAudioPlay_pause": "div[class=\"ctrls\"] div[class=\"icon--not-pressed\"] span[class=\"glyph\"]",
        "hyperAudioClose": "div[class=\"title-section dragger\"] i[class=\"nemo-font nemo-cross\"]"
      },
      "pageNoDialogBox": {
        "pageNoOneBtn": "a[qid=\"toc-7\"]",
        "pageNoTwoBtn": "a[qid=\"toc-8\"]",
        "pageNoClearBtn": "a[qid=\"toc-16\"]",
        "pageNoGoToPageBtn": "a[qid=\"toc-18\"]",
        "pageNOShow": "button[qid=\"toc-6\"]"
      },
      "timer": {
        "timerCountUp": "button[qid=\"toc-64\"]",
        "timerCountDownClear": "button[title=\"Clear\"]",
        "timerCountDownMute": "button[title=\"Mute\"]",
        "timerCountDownClose": "button[qid=\"toc-63\"]",
        "timerCountDownPlay": "button[qid=\"toc-78\"]",
        "timerBtnOne": "a[qid=\"toc-67\"]",
        "timerBtnTwo": "a[qid=\"toc-68\"]",
        "timerBtnthree": "a[qid=\"toc-69\"]",
        "timerCountDown": "button[qid=\"toc-65\"]",
        "timerCountUpClose": "button[qid=\"toc-63\"]",
        "timerCountUpPause": "button[qid=\"toc-83\"]",
        "timerCountUpPlay": ".fa.fa-play.play-button",
        "timerReset": "button[title=\"Reset\"]",
        "timerCountDownUnmute": "button[title=\"Unmute\"]",
        "timerCountDownPause": ".fa.fa-pause.pause-button"
      },
      "eBookContents": {
        "cqaTestProd": "div[title=\"cqa-test-prod-desktopfoc\"] h1",
        "homeButton": "button[qid=\"71\"]"
      },
      "eBookTools": {
        "notes": "div:nth-child(4) div:nth-child(2) button:nth-child(1)",
        "Timer": "button[qid=\"94\"]"
      },
      "practiceExtra": {
        "practice_extra": "h2[class='mb-0']"
      },
      "myProgress": {
        "my_progress": ".page-title.mt-3"
      },
      "myHomework": {
        "back_btn": "a[qid='aView-4']"
      },
      "notes": {
        "eBookNotesHeadingTxt": "div.notes-title",
        "eBookAddNotesBtn": "button.add-note-button",
        "eBookAddNotesTextarea": "textarea[placeholder='Type here...']",
        "eBookSaveNotesBtn": "button[class=\"save-note\"]",
        "eBookDeleteNotesBtn": "button[class=\"cancel-note-button ng-star-inserted\"]",
        "eBookNotesViewMoreBtn": ".nemo-font.menu-btn",
        "eBookViewMoreDeleteNotestBtn": ".dropdown-menu a.dropdown-item:last-of-type",
        "eBookNoteModalDeleteButton": "button.deleteSingleNoteModalDeleteButton"
      },
      "classDrawer": {
        "classDrawerHeader": "[data-tid=text-drawerHeaderTitle]",
        "classDrawerTitle": "[data-tid=text-ClassesTitle]",
        "classDrawerSubTitle": "[data-tid=text-ClassesSubtitle]",
        "classDrawerCloseBtn": "[data-tid=button-close]"
      },
      "Calender": {
        "calenderYear": "//button//h6[contains(@class,'MuiTypography-subtitle1')]",
        "calenderCurrentMonth": "//div[contains(@class,'MuiPickersCalendarHeader')]/p",
        "calenderLeftArrow": "//button[contains(@class,'MuiPickersCalendarHeader-iconButton')][1]",
        "calenderRightArrow": "//button[contains(@class,'MuiPickersCalendarHeader-iconButton')][2]",
        "calenderMonthHeader": "//div[contains(@class,'MuiPickersCalendarHeader-transitionContainer')]",
        "calenderSelectedDate": "//button[contains(@class,'MuiPickersDay-daySelected')]",
        "calenderDate": "//button[contains(@class,'MuiPickersDay-day')]",
        "calenderDisabledDate": "/button[contains(@class,'MuiPickersDay-day')]",
        "calenderSelectedYear": "//div[contains(@class,'MuiPickersYear-yearSelected-')]",
        "calenderYearList": "[contains(@class,'MuiPickersYear-')]",
        "calenderYearListCount": "//div[contains(@class,'MuiPickersYear-')]"
      },
      "browse": {
        "cardSkeleton": "[class*=MuiSkeleton]",
        "pageTitle": "[data-tid=text-pageTitle]",
        "pageSubTitle": "[data-tid=text-pageSubTitle]",
        "filtersBtn": "[data-tid=button-filter]",
        "previousPageArrow": "[data-tid=button-pagination-next]",
        "nextPageArrow": "[data-tid=button-pagination-previous]",
        "currentPage": "[data-tid*=button-pagination][aria-current=true]",
        "searchBox": "input[type=text]",
        "searchIcon": "[data-tid=icon-autocomplete-search]",
        "resourceCategory": "[data-tid*=text-seaction-heading-",
        "viewAllBtn": "[data-tid*=btn-viewAll-",
        "cardTitle": "[data-tid*='text-cardTitle-",
        "cardSubTitle": "[data-tid*='text-CardSubtile-",
        "cardImage": "[data-tid*='image-card-",
        "cardLockIcon": "[data-tid*='icon-locked-",
        "moreOptionsBtn": "[data-tid*='button-contextMenu-",
        "viewOption": "[data-tid*=menu-view]",
        "addToPlaylistOption": "[data-tid*=menu-add-to-playlist]",
        "shareOption": "[data-tid*=menu-share]",
        "bookTitle": "[data-tid*=text-bookTitle-",
        "bookSubTitle": "[data-tid*=text-bookSubtitle-",
        "bookImage": "[data-tid*=img-bookCover-",
        "viewBtn": "[data-tid*=button-view-",
        "addBookBtn": "[data-tid*=button-addBook-",
        "addedIcon": "[data-tid*=icon-added-",
        "bookMoreOptionsBtn": "[data-tid*=button-contextMenu-",
        "viewClassOption": "[data-tid*=button-viewClass]",
        "createNewClassOption": "[data-tid*=button-createClass]",
        "addToMyBooksOption": "[data-tid*=button-add]",
        "removeFromMyBooksOption": "[data-tid*=button-remove]",
        "openFlipbookOption": "[data-tid*=button-openFlipbook]",
        "listOfPlaylist": "[data-tid*=menu-addToNewPlaylist],[data-tid*=menu-addToPlaylist]",
        "searchList": "[data-tid*=list-item-]:not([data-tid=list-item-show-more-result]) > p",
        "showMoreResults": "[data-tid=list-item-show-more-result]",
        "noResultListItemTitle": "[data-tid=text-title-no-search-result-found]",
        "noResultListItemSubtitle": "[data-tid=text-subtitle-no-search-result-found]",
        "clearSearch": "[data-tid=icon-close-serach]",
        "searchCount": "[data-tid=label-search-result], [data-tid=label-result]",
        "search_NoResult_img": "[data-tid=icon-nostudent], [data-tid=icon-noResult]",
        "search_NoResult_title": "[data-tid=text-noResultFound]",
        "search_NoResult_subTitle": "[data-tid=text-noResultFoundBilinear]",
        "searchPill": "[data-tid=chip-search]",
        "closeSearchPill": "[class*=Chip-deleteIcon]",
        "goToPage": "[data-tid=button-pagination-",
        "filterMenuTitle": "[data-tid=filtermenu-title-filters]",
        "filterMenuCloseBtn": "[data-tid=filtermenu-button-cancel]",
        "filterMenuFilterCount": "[data-tid=filtermenu-text-applied-filter-count]",
        "filterMenuClearAllBtn": "[data-tid=btn-filtermenu-label-clearall]",
        "filterMenuApplyBtn": "[data-tid=button-apply-filter]",
        "bookFamily": "[data-tid*=text-familyTitle-",
        "partOfFamily": "[data-tid*=text-partOf-familyTitle-",
        "bookFamilySection": "[data-tid*=section-",
        "otherBooksSection": "[data-tid=section-OtherBooks]",
        "otherBooksTxt": "[data-tid=text-otherBooksTitle]",
        "showMoreBooksTxt": "[data-tid=text-showMoreBooks]",
        "showMoreBooksBtn": "[data-tid=button-showMoreBooks]"
      },
      "myClassPage": {
        "pageTitle": "main h1",
        "pageSubTitle": "main div>span",
        "pageIconNoClassArchived": "[data-tid=image-noClasses]",
        "pageTitleNoClassArchived": "[data-tid='text-title-noClasses']",
        "pageSubTitleNoClassArchived": "[data-tid='text-subtitle-noClasses']",
        "classHeading": "[data-tid='text-pageTitle']",
        "classSubHeading": "[data-tid='text-pageSubTitle']",
        "activeTab": "[data-tid='button-product-0']",
        "archivedTab": "[data-tid='button-product-1']",
        "archivedlbl": "[data-tid=text-pill-0-0]",
        "addClassBtn": "[data-tid='button-add'],[data-tid=button-joincourse]",
        "notStarted_btn": "[data-tid*=button-notStarted-",
        "menuOptionBtn": "[data-tid*=button-classSubmenu-",
        "noClassPageTitle": "[data-tid=text-title-noClasses]",
        "noClassPageSubTitle": "[data-tid='text-subtitle-noClasses']",
        "noClassPageSubImg": "main img",
        "className": "[data-tid*='text-classTitle-",
        "classDuration": "[data-tid='text-classDuration-",
        "bookTitle": "[data-tid*='text-classSubtitle-",
        "classInstructorName": "[data-tid=text-instructorName-",
        "classInstructorIcon": "[data-tid=icon-instructorName-",
        "bookIcon": "[data-tid*=image-book-",
        "inboxOption": "[data-tid*=button-inbox] p",
        "assignmentsOption": "li[data-tid*=button-assignment] p,[data-tid*=button-assignments] p",
        "studentsOption": "li[data-tid*=button-students] p",
        "gradeBookOption": "li[data-tid*=button-gradebook] p",
        "materialsOption": "li[data-tid*=button-material] p",
        "viewClassOption": "li[data-tid*=button-class] p",
        "progressOption": "li[data-tid*=button-progress] p",
        "msgBar": "[data-tid='text-success'] p",
        "msgBarClose": "[data-tid=button-close]",
        "classCard": "[data-tid=button-class-",
        "futureTab": "[aria-label*=\"class card ",
        "joinClassbtn": "[data-tid=button-plusAddClass]",
        "joinClassHeader": "[data-tid=text-joinaclass]",
        "joinClassSubHeader": "[data-tid=text-enterclasskeybyinstructor]",
        "enterClassCodeLabel": "[data-tid=text-enterclasskey]",
        "classCodeInput": "input[id=main-focus-area]",
        "classHelpText": "[id=main-focus-area-helper-text]>p",
        "classSubLable": "[data-tid=text-courseKeyHelperText]",
        "joinclassPopUpbtn": "[data-tid=button-joinClass]",
        "helpJoiningClass": "[data-tid=anchor-skip]",
        "closebtn": "[data-tid=button-joincourseclose]",
        "viewProgress_btn": "[data-tid=button-view-progress]",
        "archiveLblCrossButton": "[data-tid=button-close]"
      },
      "createClassPage": {
        "pageTitle": "[data-tid='text-pageTitle']",
        "pageSubTitle": "[data-tid='text-pageSubTitle']",
        "classHeader": "[data-tid='text-classheader']",
        "classSubHeader": "[data-tid='text-classSubheader']",
        "createBtn": "[data-tid='button-Create Class']",
        "cancelBtn": "[data-tid='button-cancel']",
        "title_txtbox": "[data-tid='input-title']",
        "desc_lbl": "label[for='input-description']",
        "desc_txtbox": "[data-tid='input-description']",
        "title_lbl": "[data-tid=text-titleLabel]",
        "startDate_txtbox": "#startDate",
        "startDate_lbl": "label[for='input-startDate']",
        "endDate_txtbox": "#endDate",
        "endDate_lbl": "label[for='input-endDate']",
        "selectBook_lbl": "[data-tid='text-selectBookLabel']",
        "selectBook_txt": "[data-tid=text-selectBookSubtext]",
        "bookTitle": "[data-tid='text-bookTitle']",
        "bookIcon": "[data-tid=image-bookCover]",
        "datePicker_okBtn": "/html/body/div[2]/div[3]/div/div[2]/button[2]",
        "titleErrorMsg": "[data-tid='text-titleError']",
        "descErrorMsg": "[data-tid='text-descriptionError']",
        "startDateErrorMsg": "[data-tid='text-startDateError']",
        "endDateErrorMsg": "[data-tid='text-endDateError']",
        "bookErrorMsg": "p[class*='MuiFormHelperText",
        "saveBtn": "[data-tid='button-Save']",
        "removeBookbtn": "[data-tid=button-removeBook]",
        "AddANewBook_btn": "[data-tid=button-assignBook]",
        "bookCard": "label[class*='MuiFormControlLabel']:nth-child(",
        "bookSkeleton": "span[class*='MuiSkeleton-text']:nth-child(1)"
      },
      "addBook": {
        "addBookPageTitle": "[data-tid='text-pageTitle']",
        "addBookPageSubtitle": "[data-tid='text-pageSubTitle']",
        "bookCoverImg": "[data-tid*=img-bookCover-",
        "bookTitle": "[data-tid*=text-bookTitle-",
        "bookSubtitle": "[data-tid*=text-bookSubtitle-",
        "addBookBtn": "[data-tid*=button-add-",
        "addToClassBtn": "[data-tid='button-Add to Class']",
        "cancelBtn": "[data-tid='button-cancel']",
        "noBookLabel": "[data-tid*=text-noBookLabel]",
        "bookLabel": "[data-tid='text-bookLabel']",
        "bookValue": "[data-tid='text-bookValue']",
        "removeBookBtn": "[data-tid='icon-close']"
      },
      "successClassPage": {
        "viewClass": "[data-tid='button-View Class']",
        "backToHomeBtn": "[data-tid='button-backtohome']",
        "success_img": "[alt='Success page']",
        "className_txt": "[data-tid='text-courseName']",
        "successCaption_txt": "[data-tid='text-successfulCaption']",
        "classKey_value": "[data-tid='text-courseCode']",
        "copy_txt": "[data-tid='text-copy']",
        "copy_btn": "[data-tid='button-copy'] span"
      },
      "classDetailsStudent": {
        "bookCoverIcon": "[data-tid=image-bookCover]",
        "className": "[data-tid=text-bandTitle]",
        "BookName": "[data-tid=text-bandSubtitle]",
        "classDurationIcon": "[data-tid=icon-meta-0]",
        "classDuration": "[data-tid=text-metaValue-0]",
        "classDatesLabel": "p[data-tid='text-metaLabel-0']",
        "instructorIcon": "[data-tid=icon-meta-1]",
        "instrutorName": "p[data-tid='text-metaValue-1']",
        "instructorLabel": "p[data-tid='text-metaLabel-1']",
        "openFlipbookBtn": "[data-tid='button-openFlipbook']",
        "otherDetailsBtn": "[data-tid='button-otherDetails']",
        "assignmentsLbl": "[data-tid='text-heading-assignments']",
        "overviewBtn": "[data-tid='button-view-assignments']",
        "dueBtn": "[data-tid='text-Due']",
        "dueNumberChip": "[data-tid='chip-Due']",
        "upcomingBtn": "[data-tid='text-Upcoming']",
        "completeBtn": "[data-tid='text-Completed']",
        "assignmentTitle": "[data-tid*=text-assignmentTitle-",
        "assignmentActivities": "[data-tid*=text-assignmentActivities-",
        "dueDaysChip": "[data-tid*=chip-dueDaysPill-",
        "blankAssignment_img": "[data-tid=image-noAssignments]",
        "blankAssignment_title": "[data-tid=text-title-noAssignments]",
        "blankAssignment_subtitle": "[data-tid=text-subtitle-noAssignments]",
        "progress_lbl": "[data-tid=text-heading-progress]",
        "noUpcoming_title": "[data-tid=text-noAssignments]",
        "noUpcoming_subtitle": "[data-tid=text-noAssignments-description]",
        "noCompleted_title": "[data-tid=text-noAssignments]",
        "noCompleted_subtitle": "[data-tid=text-noAssignments-description]",
        "bookMaterial_lbl": "[data-tid=text-bookMaterial-label-",
        "completionValue": "[data-tid=text-progress-completion-",
        "progressbar": "[data-tid=progressbar-",
        "archiveTagLbl": "[data-tid=tag-archived]"
      },
      "teacherViewClassPage": {
        "pageTitle": "[data-tid=text-pageTitle]",
        "pageSubTitle": "[data-tid=text-pageSubtitle]",
        "gradebookBtn": "[data-tid=button-gradebook]",
        "classOptionsBtn": "[data-tid=button-classOptions]",
        "editClassBtn": "[data-tid=button-editClass]",
        "addBooksBtn": "[data-tid=button-addBooks]",
        "dataSubtitle": "[data-tid=text-pageSubtitle]",
        "productTabBtns": "[data-tid*=button-product-",
        "bookCoverImg": "[data-tid=image-classBookCover]",
        "bookTitleTxt": "[data-tid=text-classBookTitle]",
        "bookSubtitleTxt": "[data-tid=text-classBookSubtitle]",
        "viewBookBtn": "[data-tid=button-classViewBook]",
        "bookComponentNamesBtns": "[data-tid*=text-title-",
        "bookComponentUnits": "[data-tid*=text-item0-",
        "bookComponentActivities": "[data-tid*=text-item1-",
        "usingClasses_lbl": "[data-tid=text-cardSliderTitle]",
        "usingClassesByline_lbl": "[data-tid=text-cardSliderSubtitle]",
        "inviteStudentsdropDown_btn": "[data-tid=text-invite]",
        "inviteStudents_btn": "[data-tid=button-actionCardBtn-0]",
        "inviteStudents_lbl": "[data-tid=text-actionCardTitle-0]",
        "inviteStudentsByline_lbl": "[data-tid=text-actionCardSubtitle-0]",
        "createAssignments_btn": "[data-tid=button-actionCardBtn-1]",
        "createAssignment_lbl": "[data-tid=text-actionCardTitle-1]",
        "createAssignmentByline_lbl": "[data-tid=text-actionCardSubtitle-1]",
        "noInboxActivity_lbl": "[data-tid=text-title-noInbox]",
        "noInboxActivityByline_lbl": "[data-tid=text-subtitle-noInbox]",
        "noStudentIcon": "[data-tid=icon-nostudent]",
        "noStudentTitle": "[data-tid=text-noStudentEnrolled]",
        "noStudentSubTitle": "[data-tid=text-noStudentEnrolledBilinear]",
        "nameHeading": "[data-tid=value-text-heading-name]",
        "statusHeading": "[data-tid=value-text-heading-status]",
        "studentName": "[data-tid*=text-name-",
        "studentStatus": "[data-tid*=text-status-",
        "studentMoreOption": "[data-tid*=button-contextMenu-",
        "studentAvgScorelbl": "[data-tid=value-text-heading-avgScore]",
        "studentCompletionScorelbl": "[data-tid=value-text-heading-completion]",
        "studentAvgScore": "[data-tid=text-avgScore-",
        "studentCompletionScore": "[data-tid*=text-progress-",
        "viewProgressbtn": "[data-tid*=button-viewProgress-",
        "viewMessagebtn": "[data-tid*=button-message-",
        "studentList": "[data-tid*=text-name-",
        "assignmentsTab": "[data-tid=button-product-1]",
        "reviewBox_Title": "[data-tid=text-title-reviewBox]",
        "reviewBox_SubTitle": "[data-tid=text-subtitle-reviewBox]",
        "reviewBox_Cancelbtn": "[data-tid=icon-cancelBtn-reviewBox]",
        "reviewBox_icon": "[data-tid=icon-reviewBox]",
        "assignmentCardStudentName": "[data-tid*=text-userName-",
        "assignmentCardActivityText": "[data-tid*=text-submitActivity-",
        "assignmentCardActivityDate": "[data-tid*=text-submitDate-",
        "assignmentCardActivityName": "[data-tid*=text-activityName-",
        "assignmentCardUnitName": "[data-tid*=text-unitPath-",
        "archivedlbl": "[data-tid=chip-pill]",
        "archivedMsg": "[data-tid=text-archiveMessage]"
      },
      "itemPlayer": {
        "activeQues": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) ",
        "correctIcon": " [data-tid=icon-correct]",
        "incorrectIcon": " [data-tid=icon-incorrect]",
        "questionTitle": "[data-tid=text-headerTitle]",
        "instructionText": "[data-tid=text-instruction]",
        "promptText": "[data-tid=text-prompt]",
        "instructionHeading": "[data-tid=text-instructionHeading]",
        "selectOneLabel": "[data-tid=text-selectOne]",
        "selectOneOrMoreLabel": "[data-tid=text-selectOneOrMore]",
        "selectFromDropdownLabel": "[data-tid=text-selectFromDropdown]",
        "matchingLeftLabel": "[data-tid=text-selectFromThisColumn]",
        "matchingRightLabel": "[data-tid=text-matchWithThisColumn]",
        "itemPlayerContainer": "[id='itemContainer']",
        "videoMedia": "[aria-label=Prompt] [data-tid=container-video]",
        "imageMedia": "[aria-label=Prompt] [data-tid=container-imageWrapper]",
        "audioMedia": "[aria-label=Prompt] [data-tid=container-audio]",
        "promptImageLoaded": "[aria-label=Prompt] [data-tid=container-imageWrapper] img[data-tid=image-loaded]",
        "plyrLoading": "[aria-label=Prompt] [class*=plyr--loading]",
        "plyrPlaying": "[aria-label=Prompt] [class*=plyr--playing]",
        "plyrPlayBtn": "[aria-label=Prompt] [class=plyr__controls] button[data-plyr=play]"
      },
      "testPlayer": {
        "checkMyWork_btn": "[class=buttons-container] [class=defaultBtn-check-mywork-icon] , [data-tid=button-checkAnswers],[data-tid=button-checkanswers], [data-tid=button-check]",
        "next_btn": "[id=next], [data-tid=button-next], [data-tid=button-goNext]",
        "previous_btn": "[id=previous], [data-tid=button-previous], [data-tid=button-goPrev]",
        "tryAgain_btn": "[id=tryAgain], [data-tid=button-tryagain]",
        "reset_btn": "[id=reset], [data-tid=button-reset]",
        "showAnswer_btn": "[data-tid=button-showcorrectanswers], [data-tid=button-showAnswers]",
        "yourResponse_btn": "[data-tid=button-showuserresponse], [data-tid=button-showResponses]",
        "showingCorrectAnswer_txt": "p[data-tid=text-showingcorrectanswer]",
        "hint_btn": "[data-tid=button-hint]"
      },
      "multiMcq": {
        "choices": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-click-option-sub-question-",
        "selectedChoice": "] [aria-checked=true]",
        "subquesText": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=text-sub-question-",
        "subquesMediaCont1": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=mediaContainer-sub-question-",
        "qMediaContainer": "[data-tid*=container-]",
        "qImageLoaded": "] img[data-tid=image-loaded]",
        "qPlyrLoading": "] [class*=plyr--loading]",
        "qPlyrPlaying": "] [class*=plyr--playing]",
        "qPlyrPlayBtn": "] [class=plyr__controls] button[data-plyr=play]"
      },
      "fibtext": {
        "responses": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-response-",
        "textPlaceholder": "] [data-tid=text-placeholder]"
      },
      "fibselect": {
        "response": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-response-",
        "responseOption": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [class*=mdc-menu-surface--open] [data-tid*=select-responseoption][data-value="
      },
      "dnd": {
        "source": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=dragsource-option-",
        "target": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=droptarget-option-",
        "tapToZoom": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid='button-taptozoom']",
        "zoomOverlay": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [class*='zoom-overlay']",
        "zoomDialogClose_btn": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid='button-zoomdialogclose']"
      },
      "matching": {
        "left": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-left-item-",
        "right": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-right-item-"
      },
      "classify": {
        "droppedOption": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=dropped-option-",
        "textPlaceholder": "] [data-tid=text-placeholder]"
      },
      "orderList": {
        "option": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) li[data-tid*=input-drag-option-",
        "listIndex": "li[data-tid]:nth-child("
      },
      "writing": {
        "textbox": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-input-id*=ta-"
      },
      "activityPlayer": {
        "infoBtn": "[data-tid='button-openinfotoc']",
        "showDetailsBtn": "[data-tid=button-activityinfopanelswitcher]",
        "quesNumber": "[data-tid=text-currentquestion]",
        "prevPageBtn": "[data-tid='button-goPrev']",
        "nextPageBtn": "[data-tid='button-goNext']",
        "prevActivityBtn": "[data-tid='button-previousActivity']",
        "nextActivityBtn": "[data-tid='button-nextActivity']",
        "showAnswerBtn": "[data-tid='button-showAnswers']",
        "showResponseBtn": "[data-tid='button-showResponses']",
        "checkAnswerBtn": "[data-tid='button-checkAnswers']",
        "submitActivityBtn": "[data-tid='button-submitActivity']",
        "markCompleteBtn": "[data-tid='button-markAsComplete']",
        "retakeActivityBtn": "[data-tid='button-retakeActivity']",
        "closeBtn": "[data-tid=button-close]",
        "completedTxt": "[data-tid='button-completed']",
        "yourScoreLabel": "[data-tid=text-activityScoreInfo] p",
        "yourScoreValue": "[data-tid=text-activityScoreInfo] h4",
        "detailsPanel": "[data-tid=container-leftPanel]",
        "panelHeading": "[data-tid=panel-heading]",
        "activityTitle": "[data-tid='text-title']",
        "activitySubtitle": "[data-tid='text-subTitle']",
        "activityTypeIcon": "[data-tid='icon-activitytype']",
        "activityType": "[data-tid='text-activitytype']",
        "pageNumber": "[data-tid='text-pagenumberinfo']",
        "expandCollapseBtn": "[data-tid=icon-togglegroupexpansion]",
        "analyticsInfoContainer": "[data-tid=container-analyticsinfo] > div > div:nth-child(2)",
        "closeInfoBtn": "[data-tid=button-closeinfotoc]",
        "infoTocHeading": "[data-tid=text-infotocheading]",
        "feedbackText": "[data-tid=text-feedbackmessage]",
        "closeAssignmentBtn": "[data-tid=button-closeAssignment]",
        "kidsFeedbackTitle": "[data-tid=title-feedback]",
        "kidsFeedbackSubtitle": "[data-tid=subtitle-feedback]"
      },
      "activitiyPlayer": {
        "feedback_txt": "[data-tid=text-feedbackmessage]",
        "showingCorrectAnswer_txt": "[data-tid=text-showingcorrectanswer]",
        "restart_btn": "[data-tid=button-resetActivity],[data-tid=button-retakeActivity]"
      },
      "viewBook": {
        "bookCover": "[data-tid=image-bookCover]",
        "bookTitle": "[data-tid=text-bookTitle]",
        "bookSubTitle": "[data-tid=text-bookSubtitle]",
        "viewClass": "button[data-tid=button-bookClasses]",
        "openFlipbook_btn": "[data-tid=button-openFlipbook]",
        "moreOptions_btn": "[data-tid=band-moreOptions]",
        "myBooks_lbl": "[data-tid=pill-myBooks]",
        "unit_lbl": "[data-tid=text-contents]",
        "viewBookDetails_option": "[data-tid=button-viewBookDetails]",
        "addBook_option": "[data-tid=button-addToMyBook]",
        "removeBook_option": "[data-tid=button-removeBook]",
        "removeBook_title": "[data-tid=text-title-removeBook]",
        "removeBook_subtitle": "[data-tid=text-subTitle-removeBook]",
        "removeBookDialogCancel": "[data-tid=button-secondary-removeBook]",
        "removeBookDialogRemove": "[data-tid=button-primary-removeBook]",
        "unitSkeleton": "[class*=MuiSkeleton]",
        "unit": "[data-tid*=button-chapter-] , [data-tid*=text-folderName-]",
        "unitTitle": "[data-tid*=text-chapterTitle-",
        "unitNumber": "[data-tid*=text-chapterNumber-",
        "unitPage": "[data-tid*=text-chapterPage-",
        "unitCoverImg": "[data-tid*=image-chapter-",
        "unitMoreOptions": "[data-tid*=button-moreOption-",
        "activityIcon": "[data-tid*=icon-activityCount-",
        "activityCount": "[data-tid*=text-activityCount-",
        "folderIcon": "[data-tid*=icon-folderCount-",
        "folderCount": "[data-tid*=text-folderCount-",
        "unitOpenFlipbook_option": "[data-tid*=button-flipbook-",
        "unitViewActivity_option": "[data-tid*=button-open-",
        "lastActivity_icon": "[data-tid=icon-lastActivity]",
        "lastActivity_lbl": "[data-tid=text-lastActivityLabel]",
        "lastActivity_name": "[data-tid=text-lastActivityName]",
        "lastActivity_Dismiss": "[data-tid=button-lastActivityDismiss]",
        "lastActivity_Continue": "[data-tid=button-lastActivityContinue]",
        "flipbookList": "[data-tid*=button-flipbookProduct-"
      },
      "viewUnit": {
        "unitThumbnail": "[data-tid*=image-unit-thumbnail]",
        "unitName": "[data-tid=text-chaptername]",
        "unitNumber": "[data-tid=text-productname]",
        "openInFlipbook_btn": "[data-tid=btn-open-in-flipbook]",
        "nextUnit_btn": "[data-tid=button-next-unit]",
        "previousUnit_btn": "[data-tid=button-previous-unit]",
        "activity_label": "[data-tid=text-unitselection]",
        "activity_label_byline": "[data-tid=text-unitselectionbilinear]",
        "folderTitle": "[data-tid*=button-folder-",
        "activityTitle": "[data-tid*=text-title],[data-tid*=text-itemName]",
        "activityPageInfo": "[data-tid*=text-metaInfo]",
        "activityCompletionCircle": "[data-tid*=chart]",
        "activityType_icon": "[data-tid*=icon-itemType]",
        "activityType_txt": "[data-tid*=text-itemType]",
        "activityMoreOptions": "[data-tid*=button-contextMenu-",
        "openFlipbook_moreOptions": "[data-tid=*menu-open-in-flipbook-",
        "viewActivity_moreOptions": "[data-tid=*menu-view-activity-"
      },
      "settings": {
        "pageTitle": "[data-tid=text-pageTitle]",
        "pageSubTitle": "[data-tid=text-pageSubTitle]",
        "pageHeading": "[data-tid=text-myDetailsHeading]",
        "currentPassword_label": "[data-tid=label-currentPassword]",
        "currentPassword_input": "[data-tid=input-currentPassword] input",
        "togglePassword_currentPassword": "[data-tid=input-currentPassword] [data-tid=button-togglepasswordvisibility]  svg",
        "togglePassword_newPassword": "[data-tid=input-password] [data-tid=button-togglepasswordvisibility]  svg",
        "togglePassword_confirmPassword": "[data-tid=input-confirmPassword] [data-tid=button-togglepasswordvisibility]  svg",
        "password_label": "[data-tid=label-password]",
        "password_input": "[data-tid=input-password] input",
        "confirmPassword_label": "[data-tid=label-confirmPassword]",
        "confirmPassword_input": "[data-tid=input-confirmPassword] input",
        "newPasswordRules_text": "[data-tid=text-sublabelpassword]",
        "currentPasswordError_text": "[data-tid=text-errorcurrentPassword]",
        "newPasswordError_text": "[data-tid=text-errorpassword]",
        "confirmPasswordError_text": "[data-tid=text-errorconfirmPassword]",
        "changePassword_button": "[data-tid=button-changePassword]",
        "email_label": "[data-tid=label-email]",
        "email_input": "[data-tid=input-email] input",
        "firstName_label": "[data-tid=label-firstName]",
        "firstName_input": "[data-tid=input-firstName] input",
        "lastName_label": "[data-tid=label-input-lastName]",
        "lastName_input": "[data-tid=input-input-lastName] input",
        "country_label": "[data-tid=textfield-label]",
        "country_input": "[data-tid=country] input",
        "clearIcon": "[title=Clear]",
        "countryListItem": "[data-option-index='0']",
        "firstNameError_text": "[data-tid=text-errorfirstName]",
        "lastNameError_text": "[data-tid=text-errorinput-lastName]",
        "changeProfile_button": "[data-tid=button-changeProfile]",
        "fontSizeText": "[data-tid=settings-accessibilty-fontsize]",
        "fontSizeValue": "[data-tid=text-fontSizeType]",
        "fontSizeDec": "[data-tid=settings-accessibilty-fontsize-previous] ",
        "fontSizeInc": "[data-tid=settings-accessibilty-fontsize-next] ",
        "lineSpaceText": "[data-tid=settings-accessibilty-linespace]",
        "lineSpaceValue": "[data-tid=text-lineSpaceType]",
        "lineSpaceDec": "[data-tid=settings-accessibilty-lineSpace-previous]",
        "lineSpaceInc": "[data-tid=settings-accessibilty-lineSpace-next]",
        "highContrastText": "[data-tid=high_contrast]",
        "highContrastToggleBtn": "[data-tid=input-high_contrast]",
        "dylexicFontText": "[data-tid=dylexic-font]",
        "dylexicFontToggleBtn": "[data-tid=input-dylexic-font]",
        "underlinelinksText": "[data-tid=underline_links]",
        "underlinelinksToggleBtn": "[data-tid=input-underline_links]",
        "previewTextHeading": "[data-tid=text-previewHeading]",
        "previewTextPara": "[data-tid=text-previewPara]",
        "previewLinkText": "[data-tid=setting-preview-link]",
        "button1": "[data-tid=setting-preview-button]",
        "button2": "[data-tid=button-accessbility]",
        "moreDetailsBtn": "[data-tid=accessibilty-link]",
        "resetButton": "[data-tid=reset-button]",
        "applySettingsBtn": "[type=submit]",
        "resetSettingsTitle": "[data-tid=text-title-reset-user-settings]",
        "resetSettingsSubTitle": "[data-tid=text-subTitle-reset-user-settings]",
        "resetSettingsCancelBtn": "[data-tid=button-secondary-reset-user-settings]",
        "resetSettingsConfirmBtn": "[data-tid=button-primary-reset-user-settings]",
        "subscription_text": "//h6[contains(text(),'Subscription')]",
        "subscriptionSubtitle_text": "//*[contains(text(),'Billing and license')]",
        "free_text": "//*[contains(text(),'Free')]",
        "getPremiumAccess_text": "//*[contains(text(),'Get Premium Access')]",
        "getPremiumAccessSubtitle_text": "//*[contains(text(),'You will get access')]",
        "price_text": "//*[contains(text(),'Subscription for $24.99/year')]",
        "upgradePlan_btn": "[data-tid=button-updateBillingAddress]",
        "paymentMethod_text": "//*[contains(text(),'Payment Method')]",
        "noPaymentMethod_text": "//*[contains(text(),'No payment method added yet')]",
        "noPaymentMethodSubtitle_text": "//*[contains(text(),'When you add a payment method')]",
        "billingMethod": "//*[contains(text(),'Billing Information')]",
        "noBillingInfo_text": "//*[contains(text(),'No billing information')]",
        "noBillingInfoSubtitle_text": "//*[contains(text(),'When you add your billing information')]",
        "premiumPlan_text": "//*[contains(text(),'Premium Plan')]",
        "active_text": "//*[contains(text(),'Active')]",
        "premiumPrice_text": "//*[contains(text(),'$')]",
        "autoRenewal_text": "//*[contains(text(),'Auto Renewal On')]",
        "licensePeriod_text": "//*[contains(text(),'License Period')]",
        "licensePeriod_date": "//*[contains(text(),'License Period')]/following-sibling::p",
        "managePlan_btn": "[data-tid=button-managePlan]",
        "changeCard_btn": "[data-tid=button-changeCard]",
        "updateBillingAddress_btn": "[data-tid=button-updateBillingAddress]"
      },
      "billing": {
        "upgradetoPremium_btn": "[data-tid=button-updateToPremium]",
        "close_btn": "[data-tid=button-close]"
      },
      "planOptions": {
        "cardNumber_text": "[data-tid=label-cardNumber]"
      },
      "flipbook": {
        "readerContainerWrapper": "[id='reader-container-wrapper']",
        "pageLayoutSingle": "[id=readerpagedivA][style='width: 100%;']",
        "pageLayoutDouble": "[id=readerpagedivB]:not([class*=display-none])",
        "penBtn": "[data-tid='button-toolbar-item-0-0'][aria-disabled='false']",
        "highlighterBtn": "[data-tid='button-toolbar-item-0-1'][aria-disabled='false']",
        "eraserBtn": "[data-tid='button-toolbar-item-0-2'][aria-disabled='false']",
        "undoBtn": "[data-tid='button-toolbar-item-0-3'][aria-disabled='false']",
        "redoBtn": "[data-tid='button-toolbar-item-0-4'][aria-disabled='false']",
        "notesDockContainer": "[id=dock-container] > [id=dialog-notes]",
        "notesBtn": "[data-tid='button-toolbar-item-0-0']",
        "zoomInBtn": "[data-tid='button-toolbar-item-1-0'][aria-disabled='false']",
        "zoomOutBtn": "[data-tid='button-toolbar-item-1-1'][aria-disabled='false']",
        "fitToScreenBtn": "[data-tid='button-toolbar-item-1-2'][aria-disabled='false']",
        "doublePageBtn": "[data-tid='button-toolbar-item-1-3'][aria-disabled='false']",
        "singlePageBtn": "[data-tid='button-toolbar-item-1-4']",
        "fullScreenBtn": "[data-tid='button-toolbar-item-1-5'][aria-disabled='false']",
        "bookmarkBtn": "[data-tid='button-toolbar-item-2-0']",
        "TOCBtn": "[data-tid='button-toolbar-item-2-1']",
        "previousBtn": "[data-tid='button-toolbar-item-2-2']",
        "nextBtn": "[data-tid='button-toolbar-item-2-3']",
        "myNotesTitle": "[data-tid=label-text-notes-header]",
        "notesDockBtn": "[data-tid=notebox-button-dock]",
        "notesUndockBtn": "[data-tid=notebox-button-undock]",
        "notesCloseBtn": "[data-tid='notebox-button-cancel']",
        "addNoteBtn": "button[data-tid='button-add-note']",
        "noNoteIcon": "img[data-tid='icon-no-note']",
        "noNoteText": "[data-tid='text-no-note']",
        "noteListItemLabel": "[data-tid*='note-list-item-label-",
        "noteListItemText": "[data-tid*='text-note-list-",
        "noteListDeleteBtn": "button[data-tid*='btn-delete-",
        "noteListEditBtn": "button[data-tid*='btn-edit-",
        "addNotesTitle": "[data-tid=label-text-notes-add-header],[data-tid=label-text-notes-edit-header]",
        "notesPageLabel": "[data-tid=label-text-page-number]",
        "notesPageValueSingle": "[data-tid=label-text-page-number-value]",
        "notesPageValueLeft": "[data-tid=text-option-0]",
        "notesPageValueRight": "[data-tid=text-option-1]",
        "notesTextArea": "[id=input-edit-note]",
        "notesCancelBtn": "button[data-tid='button-cancel']",
        "notesSaveBtn": "button[data-tid='button-save']",
        "deleteNoteTitle": "[data-tid='text-title-deleteNote']",
        "deleteNoteSubTitle": "[data-tid='text-subTitle-deleteNote']",
        "deleteNoteCancelBtn": "button[data-tid='button-secondary-deleteNote']",
        "deleteNoteDeleteBtn": "button[data-tid='button-primary-deleteNote']",
        "myBookmarksTitle": "[data-tid=label-text-bookmark-header]",
        "bookmarkCloseBtn": "button[data-tid='bookmarkbox-button-cancel']",
        "noBookmarkIcon": "img[data-tid='icon-no-bookmark']",
        "noBookmarkText": "[data-tid='text-no-bookmark']",
        "addBookmarkBtn": "button[data-tid='button-bookmark-this-page']",
        "bookmarkListItemLabel": "[data-tid*='bookmark-list-item-label-",
        "bookmarkListItemName": "[data-tid*='bookmark-list-item-name-",
        "bookmarkListDeleteBtn": "button[data-tid*='btn-delete-",
        "bookmarkListEditBtn": "button[data-tid*='btn-edit-",
        "bookmarkNameLabel": "[data-tid='text-label-edit-bookmark']",
        "bookmarkPageLabel": "[data-tid='label-text-page-number']",
        "bookmarkPageValueSingle": "[data-tid=label-text-page-number-value]",
        "bookmarkPageValueLeft": "[data-tid=text-option-0]",
        "bookmarkPageValueRight": "[data-tid=text-option-1]",
        "bookmarkTextArea": "[id=input-edit-bookmark]",
        "bookmarkCancelBtn": "button[data-tid='button-cancel']",
        "bookmarkSaveBtn": "button[data-tid='button-save']",
        "flipbookTitle": "[data-tid=flipbook-title]",
        "tableOfContentTitle": "[data-tid=flipbook-toc-label]",
        "jumpToPageInput": "[data-tid=input-searchtextbox] input",
        "jumpToPageBtnTOC": "[data-tid=button-closeicon]",
        "resourceTitle": "[data-tid*=text-resourcetitle-]",
        "hotlinks": "[class*=ee-overlay]",
        "hotlinkToBeClicked": "[id=ee-overlays4-2]",
        "activeHotlink": "[class*=hotlink-active]",
        "hotlinkPlayer": "[class=plyr__controls]"
      },
      "signUp": {
        "createAccountTitleTxt": "#teacher-radio > .r-container > .checkmark"
      }
    }
  },
  "vhlLoginTest": {
    "welcome": "h1[class='u-txt-ctr']",
    "userName": "input[id='user_session_username']",
    "password": "input[id='user_session_password']",
    "commit": "input[value='Login']"
  },
  "vhl_landingtest": {
    "usernameLabel": "div.MuiBox-root.css-mv4q7",
    "notes": "button[data-tid=\"button-toolbar-item-1-3\"]",
    "closeNoteBox": "button[data-tid=\"notebox-button-cancel\"]",
    "tableOfContentsPage1": "button[data-tid=\"button-toolbar-item-3-1\"]",
    "closeTOC": "button[data-tid=\"TOC-button-close\"]"
  },
  "vhlhighlighter": {
    "highlighterIcon": "div.MuiBox-root.css-k008qs",
    "eraserButton": "button[data-tid=\"annotation-toolbar-item-1\"]",
    "highlighterBtn": "button[data-tid=\"annotation-toolbar-item-0\"]",
    "colorPicker": "div#color-picker-button[data-tid=\"annotation-toolbar-color-picker\"]",
    "closeIcon": "svg.StyledCloseIcon-sc-1wz11ot",
    "drawingToolPresentation": "div.konvajs-content canvas",
    "removeAllButton": "button[data-tid=\"annotation-toolbar-item-2\"]"
  },
  "vhlNotes": {
    "notesButton": "button[data-tid=\"button-toolbar-item-1-3\"]",
    "dockButton": "button[data-tid=\"notebox-button-dock\"]",
    "allPagesTab": "button[data-tid=\"button-product-1\"]",
    "pageCoverTab": "button[data-tid=\"button-product-0\"]",
    "addNoteBtn": "[data-tid=\"button-add-note\"]",
    "addNotesTextarea": "#input-add-note",
    "saveNoteBtn": "[data-tid=\"button-save\"]",
    "notePreviewText": "span:contains(\"Sample VHL Automation Note#1\")",
    "deleteNoteSvg": "[data-tid=\"btn-delete-2\"]",
    "deleteNoteBtn": "[data-tid=\"button-primary-deleteNote\"]",
    "closeButton": "button[data-tid=\"notebox-button-cancel\"]",
    "addNotesCanvas": "div.konvajs-content canvas"
  }
}
===
{
  "css": {
    "ComproC1": {
      "c1assignment": {
        "classheading": ".class-title.mx-2",
        "Assignments": "a[qid=\"cView-44\"]",
        "Createassignment": "a[qid=\"rView-5\"]",
        "PracticeExtracqa": "a[qid=\"a-path-2-0\"]",
        "Unit1": "i[class='ml-auto fa fa-angle-right']",
        "LessonA": "div[class=\"custom-control-input-wrapper\"]",
        "Next": "button[qid=\"pAssignment-6\"]",
        "inputTag": "[qid=\"assignment-detail-4\"]",
        "timeIncrease": "button[class=\"owl-dt-control-button owl-dt-control-arrow-button\"]",
        "setDate": "//button[contains(@class,'owl-dt-control-button')]//span[text()=' Set ']",
        "selectStudent": "[qid=\"assignment-detail-6\"]",
        "ViewSummary": "[qid=\"assignment-detail-6\"]",
        "Assign": "[qid=\"assignment-detail-6\"]",
        "kebabIcon": "[qid=\"rView-1-",
        "assignmentDiv": "[qid^=\"rView-20-",
        "deleteAssignment": "a[qid=\"rView-2-0\"]",
        "viewAssignment": "[qid=\"rView-8-0\"]",
        "clickHamBurgerIcon": "a[qid=\"lo-renderer-toggle-btn-9\"]",
        "crossIcon": "a[qid=\"learningPath-1\"]",
        "assignmentBackBtn": "a[qid=\"lo-renderer-bck-btn\"]",
        "yesDelete": "button[qid=\"rView-4\"]",
        "assignNameInput": "[qid=\"assignment-detail-2\"]"
      },
      "c1student": {
        "bellIcon": "#tippyDropdownMenuButton",
        "assignmentNotification": "button[qid=\"ntf-30\"]",
        "routeToAssignment": "a[qid=\"aView-1-0\"]",
        "openHamburgerIcon": "#selectedActivitySidebarBtn",
        "assignmentBack": "#lessonViewBackBtn",
        "closeSideBar": "a[qid=\"learningPath-1\"]",
        "goBack": "a[qid=\"lo-renderer-bck-btn\"]",
        "greenBtn": "a[class='btn green-btn']",
        "nextBtn": "a[title='Next']"
      },
      "footer": {
        "footerTermsOfUse": "a[qid=\"cFooter-1\"]",
        "footerPrivacyNotice": "a[qid=\"cFooter-2\"]",
        "footerAccesibility": "a[qid=\"cFooter-3\"]",
        "footerOurApproaches": "a[qid=\"cFooter-5\"]",
        "footerSiteFeedback": "a[qid=\"cFooter-4\"]",
        "footerFAQs": "a[qid=\"cFooter-9\"][aria-label=\"FAQs\"]",
        "footerCambridgeOneSchool": "a[qid=\"cFooter-9\"][class*=\"insti-btn green-layout-insti-btn\"]",
        "footerHelp": "a[qid=\"cFooter-6\"]",
        "footerCambridgeUniversity": ".copyright.mb-0"
      },
      "footerCambridgeOneForSchool": {
        "footerCambridgeOneForSchools": ".heading-title",
        "footerBack": ".back-text"
      },
      "term": {
        "termsHealding": ".heading1.align-self-center",
        "termBack": "qid\".back-text\"undefined"
      },
      "privacy": {
        "privacyHealding": ".heading1.align-self-center",
        "privacyBack": ".back-text"
      },
      "footerHelp": {
        "footerHelpBack": "a[href=\"https://www.cambridgeone.org/login\"]",
        "footerHelpLang": ".current-language-label"
      },
      "siteFeedback": {
        "cambridgeCustomerSurvey": "img[alt=\"Cambridge Customer Survey\"]",
        "ifYouRequireSupportPlease": "span:nth-child(1)"
      },
      "accesibility": {
        "footerAccessibility": ".accessibility",
        "footerAccesibilityBack": ".back-text"
      },
      "landing": {
        "headingText": ".heading1.mt-2.mt-sm-4.mt-md-0",
        "subheadingText": "div[class=\"main-content text-center text-md-start\"] h2",
        "signupBtn": "a[qid=\"home-1\"]",
        "loginBtn": "a[qid=\"home-2\"]",
        "brandLogo_img": "img[class=\"bg-image\"]",
        "languageSelector_dropdown": "[qid=\"sp-ldd-cntr\"]",
        "languageSelector_dropdown_list": "[class*=\"lang-dropdown-item\"]"
      },
      "login": {
        "page_header": "h2[class=\"gigya-composite-control gigya-composite-control-header login-heading\"]",
        "brandLogo": "img[alt=\"Cambridge Logo\"]",
        "userName_tbox": "#gigya-loginID-56269462240752180",
        "password_tbox": "#gigya-password-56383998600152700",
        "loginPassword_eye": "a[aria-label=\"Show\"]",
        "forgotPassword": "a[title=\"Forgotten your password?\"]",
        "login_btn": "input[value=\"Log in\"]",
        "signup_btn": "a[title=\"Don't have an account yet?\"]"
      },
      "SignUpPage": {
        "signUpEmailPage_btn": "[data-tid=button-signup]"
      },
      "resetPassword": {
        "resetPassword": "form[id=\"gigya-reset-password-form\"] div h2",
        "resetPassword_Btn": "input[value=\"Reset password\"]",
        "enterEmailText": "input[placeholder='Enter your email address *']",
        "backToLogin": "a[title=\"Back to login\"]",
        "emailWarningText": "span[role='alert']"
      },
      "appShell": {
        "userDrop_down": "button[qid=\"cHeader-2\"]",
        "logout_btn": "button[qid=\"cHeader-7\"]",
        "headerbandDiv": "header > div",
        "toggleSidebarBtn": "[aria-label=toggle-sidebar]",
        "custLogo": "[data-tid=image-headerLogo]",
        "dashboardBtn": "[data-tid=button-dashboard]",
        "libraryBtn": "[data-tid=button-library]",
        "browseBtn": "[data-tid=button-browse]",
        "classesBtn": "[data-tid=button-classes]",
        "helpBtn": "[data-tid=button-help]",
        "settingsBtn": "[data-tid=button-settings]",
        "sidebarImg": "[data-tid=image-sidebar]",
        "poweredbyTxt": "[data-tid=text-poweredby]",
        "comproLogo": "[data-tid=image-comprodls]",
        "versionTxt": "[data-tid=text-versionInfo]",
        "notificationBtn": "[data-tid=button-notification], [role=presentation]  [data-tid=button-notification] svg",
        "notificationTxt": "[data-tid=text-drawerHeaderTitle], [role=presentation]  [data-tid=button-notification] div",
        "notificationCloseBtn": "[data-tid=button-close]",
        "noNotificationImg": "[data-tid=image-noNotifications]",
        "grayBackdrop": "[class*=MuiBackdrop]",
        "languageSwitcherBtn": "[data-tid=dropdown-languageselector]",
        "languageList": "[data-tid*=dropdownitem]",
        "selectedLanguage": "[data-tid=dropdown-languageselector] [class*=caption], [data-tid=dropdown-languageselector] p",
        "userProfileBtn": "[data-tid=button-user-profile]",
        "userName": "[data-tid=button-user-profile-info] span, [data-tid=text-username]",
        "emailID": "[data-tid=button-user-profile-info] p, [data-tid=text-useremail]",
        "userProfileOptionBtns": "[data-tid*=button-user-profile-option-",
        "userProfileHelpBtn": "[data-tid=button-user-profile-option-0], [data-tid=button-help]",
        "userProfileSettingsBtn": "[data-tid=button-user-profile-option-1], [data-tid=button-settings]",
        "userProfileLogoutBtn": "[data-tid=button-user-profile-option-2], [data-tid=button-logout]",
        "loaderIcon": "[data-tid=image-loader]",
        "snackbarInfo_txt": "[data-tid=text-error], [data-tid=text-info], [data-tid=text-success]",
        "snackbarClose_btn": "[data-tid=button-close]",
        "classPlusIcon": "[data-tid=button-classes] button",
        "breadcrumbbackbtn": "[data-tid*=breadcrumb-]",
        "indexBtn": "p[data-tid=text-chaptertitle]",
        "indexTOCPanel": "[id=indexToc-panel]",
        "chapterTitle": "h4[data-tid=text-chaptertitle]",
        "indexCloseBtn": "[data-tid=button-closeinfotoc]",
        "inviteBtnTxt": "[data-tid=text-invite]",
        "inviteStudentText": "/html/body/div[4]/div[3]/div/div[1]/div[1]/h6",
        "addToPlaylistBtn": "[data-tid=button-addToPlaylist]",
        "newPlaylistOption": "[data-tid=button-newPlaylistOption]",
        "component": "[data-tid*=button-product-",
        "assignBtn": "[data-tid=button-assign]",
        "shareBtn": "[data-tid=button-share]",
        "libraryDropdownBtn": "[data-tid=library-dropdown]",
        "myMaterialBtn": "[data-tid=button-materials]"
      },
      "dashboard": {
        "help_btn": "a.help-click-btn,button[qid=\"cHeader-hlp-2\"]",
        "progress_btn": "a.progress-link.d-flex.align-items-center",
        "praticeExtra_btn": "a.no-decoration.tile-section-1.tile-section-link",
        "ebook_btn": "a.no-decoration.tile-section-1.tile-section-link",
        "homework_btn": "button.btn.btn-lg.btn-main-1.homework-button",
        "myProgress_btn": "a.agg-progress-btn.btn-main-color-1-bordered",
        "createNewClass": ".btn.btn-main-color-1-bordered.add-button.d-flex.align-items-center.justify-content-center",
        "activeClassCard": "//h4[@class='class-title-heading' and normalize-space()='{CLASS_NAME}']"
      },
      "createNewClass": {
        "enterClassDetails": ".form-heading, .add-class-details-heading",
        "back_btn": "div[class='my-3 create-class-header'] span:nth-child(2)",
        "enterClassName": "input[placeholder=\"e.g. CS 2 English\"]",
        "startDate": "input[value=\"Thu, Oct 3, 2024\"]",
        "endDate": "input[value=\"Thu, Oct 2, 2025\"]",
        "enterYourSchool": "input[placeholder=\"Enter your school\"]",
        "cancel_btn": "button[qid=\"create-class-cancel-button\"]",
        "next_btn": "button[qid=\"create-class-next-button\"], button[qid=\"t-cc-cd-btn-2\"]",
        "addClassMaterials": ".materials-heading",
        "cancel_btn_classMaterial": "button[qid=\"create-class-cancel-button\"], button[qid='create-class-2'], button[qid=\"t-cc-cd-btn-1\"]",
        "addLater_Btn": "button[qid=\"create-class-finish-button\"]",
        "classSuccessfullyCreated": ".heading",
        "dashboard_btn": "a[qid=\"go-to-dashboard-btn-id\"] , button[qid='class-created-success-1'],a[qid=\"t-cc-sc-link-1\"]",
        "cancelThisClass": "div[role=\"document\"] div div h3",
        "yesCancel_btn": ".btn-text.btn-yes.p-3",
        "noKeep_btn": "button[data-bs-dismiss=\"modal\"], button[qid='cancel-modal-2']",
        "addMaterial_btn": "button[qid='add-class-materials-button-3'], button[qid=\"t-cc-cm-btn-1\"]",
        "addMaterial_input": "input[qid=\"material-modal-filter-input\"],input[qid=\"t-cc-mm-inpt-1\"]",
        "dev_test_ebook_bundle_104_bundle": "div[class=\"check\"]",
        "addToClass_Btn": "button[qid=\"material-modal-add-to-class-btn\"] , button[qid='add-material-save-7'],button[qid=\"t-cc-mm-btn-2\"]",
        "finish_btn": "button[qid=\"create-class-finish-button\"] , button[qid='create-class-4'],button[qid=\"t-cc-cm-btn-4\"]",
        "dev_test_ebook_bundle_104_bundle_dropdown": "a[qid=\"material-modal-component-0\"]",
        "classData": "a[qid=\"cView-43\"]",
        "addStudents": "a[qid=\"cView-73\"]",
        "adultsRadio": "label[for=\"adult-radio\"]",
        "confirmationNextBtn": "button[qid=\"typeSelect-4\"]",
        "studentEmail_input": "input[name=\"teacherEmail-0\"],input[qid=\"CBulkEnrollment-learner-0-1\"]",
        "inviteStudentBtn": "button[qid=\"CBulkEnrollment-4\"]",
        "pendingTitle": "#pending-students-container > h3"
      },
      "activeClass": {
        "actionButton": "a[qid=\"cView-70\"]",
        "deleteClass": "a[qid='cView-13']",
        "yesDelete_Btn": "button[qid=\"cView-48\"]"
      },
      "manageReports": {
        "manageReports_link": "a[qid=\"cView-14\"]",
        "downloadReport_btn": "button.download-btn, button[qid*=\"download\"], a[qid*=\"download\"]"
      },
      "invitationNotification": {
        "notificationBtn": "#tippyDropdownMenuButton",
        "invitationNotify": "h3[class=\"title d-flex mb-1\"]",
        "selectCheckbox": "#select-all-checkbox",
        "acceptBtn": "button[qid=\"idsh-3\"]",
        "goToDashboard": "a[qid=\"iscs-3\"]"
      },

      "progress": {
        "progress": "h1[qid='clView-6']"
      },
      "eBook": {
        "cqa_ebook_evolve": ".eboook-selected.ng-tns-c606183087-2",
        "contentButton": "button[qid=\"72\"]",
        "toolsButton": "button[qid=\"73\"]",
        "closeButton": "button.close-button > em.nemo-close-new",
        "homeButton": "button[qid=\"71\"]",
        "myNotes": "div.notes-title",
        "cqaEbookEvolveDropdown": "button[qid=\"ebook-button-1\"]",
        "dropDownListTitle": "[qid^=\"ebook-list-item-",
        "cqaTestEbookOnlyAssets": "a[qid=\"ebook-list-item-3\"]",
        "cqaTestEbookOnlyAssetsText": "div.eboook-selected.ng-tns-c606183087-2",
        "notes": "div:nth-child(4) div:nth-child(2) button:nth-child(1)",
        "timer": "button[qid=\"94\"]",
        "showAndHideSelection": "button[qid=\"91\"]",
        "drawingTool": "button[qid=\"84\"]",
        "pageNumber": "button[qid=\"toc-6\"]",
        "toggleLayoutBtn": "button[qid=\"83\"]",
        "pagelayoutcontainer": "#readerpagedivB",
        "doublePage": "#readerpagedivB",
        "singlePage": ".reader-display-none",
        "fitToScreenBtn": "button[qid=\"97\"]",
        "fitToWidthBtn": "button[qid=\"98\"]",
        "readerContainerWrapper": "#reader-container-wrapper",
        "zoomInBtn": "button[qid=\"96\"]",
        "zoomOutBtn": "button[qid=\"95\"]",
        "nextPage": "button[qid=\"76\"]",
        "previousPage": "button[qid=\"75\"]"
      },
      "showHideSelection": {
        "hideSelection": "button[qid=\"93\"]",
        "showSelection": "button[qid=\"92\"]",
        "closeSelection": "i.nemo-close-new.nemo-font[aria-hidden=\"true\"]",
        "showSelectionBoxSelector": "[id^='spotlight-div-']",
        "hideSelectionBoxSelector": "[id^='mask-div-']"
      },
      "drawingTool": {
        "drawingToolScribble": "button[qid=\"85\"] img[alt=\"Scribble\"]",
        "drawingToolPenColour": "button[id=\"penColorDropdown\"]",
        "drawingToolPenWidth": "button[id=\"penStrokeDropdown\"]",
        "drawingToolHighlighter": "button[qid=\"86\"] img[alt=\"Highlighter\"]",
        "drawingToolEraser": "#deleteBtn",
        "drawingToolUndo": "button.undo-button[qid=\"88\"]",
        "drawingToolRedo": "button.redo-button[qid=\"89\"]",
        "drawingToolPresentation": "div[id=\"drawing-tools-container-B\"] canvas",
        "penColourGreen": ".pen-color-circle-container .pen-color-outer-circle .pen-color-inner-circle[style=\"background-color: rgb(0, 179, 46);\"]",
        "penColourBlue": ".pen-color-circle-container .pen-color-outer-circle .pen-color-inner-circle[style=style=\"background-color: rgb(0, 2, 255);\"]",
        "penColourRed": ".pen-color-circle-container .pen-color-outer-circle .pen-color-inner-circle[style=\"background-color: rgb(185, 0, 0);\"]",
        "penColourBlack": "div[class=\"pen-color-dropdown ng-tns-c606183087-2 dropright ng-star-inserted show\"] div:nth-child(4) button:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(1)",
        "penStroke4": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-4",
        "penStroke3": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-3",
        "penStroke2": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-2",
        "penStroke1": "button.custom-stroke-container > div.pen-stroke-circle-container > div.pen-stroke-outer-circle.line-weight-4 > div.pen-stroke-inner-circle.line-weight-1"
      },
      "eBookLearningPageHyperlink": {
        "hyperLinkAnswer": "div[id=\"ee-overlays11-6\"] div[title=\"Answers\"] div img, div[id=\"ee-overlays27-6\"] div[title=\"Answers\"] div img",
        "hyperLinkVideo": "div[id=\"ee-overlays11-0\"] img, div[id=\"ee-overlays27-0\"] img",
        "hyperlinkAudio": "div[id=\"ee-overlays11-3\"] img, div[id=\"ee-overlays27-3\"] img",
        "hyperlinkAudioNoTranscript": "div[id=\"ee-overlays11-1\"] img, div[id=\"ee-overlays27-1\"] img",
        "hyperlinkNewTab": "div[id=\"ee-overlays11-5\"] img, div[id=\"ee-overlays27-5\"] img",
        "hyperlinkActivity": "div[id=\"ee-overlays11-9\"] div[title=\"Activity\"] div img, div[id=\"ee-overlays27-9\"] div[title=\"Activity\"] div img",
        "hyperLinkGame": "div[id='ee-overlays12-0'] img, div[id='ee-overlays28-0'] img",
        "hyperlinkGoToPage": "div[id='ee-overlays12-2'] img, div[id='ee-overlays28-1'] img",
        "hyperZoomHotspot": "div[id=\"ee-overlays11-8\"] div[title=\"Double tap to zoom\"] div, div[id=\"ee-overlays27-8\"] div[title=\"Double tap to zoom\"] div"
      },
      "hyperLinkAnswerWindow": {
        "hyperAnswerReveal": "a[title=\"Reveal\"]",
        "hyperAnswerClose": "button[class=\"close-button\"]",
        "hyperAnswerFullScreen": "i[title=\"Enter fullscreen\"]",
        "hyperAnswerExitFullScreen": "img[title=\"Exit fullscreen\"]",
        "hyperAnswerQuestion": "div[id=\"rubric-0\"] p",
        "hyperVideoPlay": "span[title=\"Play\"]",
        "hyperVideoClose": "button[qid=\"vid-0\"]",
        "hyperActivityNext": "a[title=\"Next\"]",
        "hyperAudioClose": "div[class=\"title-section dragger\"] i[class=\"nemo-font nemo-cross\"]",
        "HyperShowHideTranscript": "button[qid=\"aud-21\"]",
        "hyperZoomHotspotClose": "[id^=\"zoomHotspot-close-button-\"]",
        "exitActivity": "a[qid=\"resultScreen-1\"]",
        "activityGoodEffort": "div[class=\"feedback-msg\"] h2",
        "startAgainActivity": "a[qid=\"resultScreen-2\"]",
        "activityIFrame": "iframe#iframe_1669693911922-1669727257943-1669850648285,iframe#iframe_1756892185750-1756892187201-1756892198221,iframe#iframe_1762926483082-1762926487641-1762928088058,iframe#iframe_1763976511015-1763976515179-1763976537428",
        "activityScoreCheck": "a[title=\"Check\"]",
        "activityAnsElement": ".draggable button[aria-labelledby^=\"content-\"]"
      },
      "commonActivity": {
        "activityAnsCheck": "a[title=\"Check\"]",
        "activityNext": "a[title=\"Next\"]",
        "activityClose": "button[class=\"close-button\"]",
        "activityStartAgain": "a[qid=\"resultScreen-2\"]",
        "activityExit": "a[qid=\"resultScreen-1\"]"
      },
      "hyperlinkAudio": {
        "hyperAudioPlay_pause": "div[class=\"ctrls\"] div[class=\"icon--not-pressed\"] span[class=\"glyph\"]",
        "hyperAudioClose": "div[class=\"title-section dragger\"] i[class=\"nemo-font nemo-cross\"]"
      },
      "pageNoDialogBox": {
        "pageNoOneBtn": "a[qid=\"toc-7\"]",
        "pageNoTwoBtn": "a[qid=\"toc-8\"]",
        "pageNoClearBtn": "a[qid=\"toc-16\"]",
        "pageNoGoToPageBtn": "a[qid=\"toc-18\"]",
        "pageNOShow": "button[qid=\"toc-6\"]"
      },
      "timer": {
        "timerCountUp": "button[qid=\"toc-64\"]",
        "timerCountDownClear": "button[title=\"Clear\"]",
        "timerCountDownMute": "button[title=\"Mute\"]",
        "timerCountDownClose": "button[qid=\"toc-63\"]",
        "timerCountDownPlay": "button[qid=\"toc-78\"]",
        "timerBtnOne": "a[qid=\"toc-67\"]",
        "timerBtnTwo": "a[qid=\"toc-68\"]",
        "timerBtnthree": "a[qid=\"toc-69\"]",
        "timerCountDown": "button[qid=\"toc-65\"]",
        "timerCountUpClose": "button[qid=\"toc-63\"]",
        "timerCountUpPause": "button[qid=\"toc-83\"]",
        "timerCountUpPlay": ".fa.fa-play.play-button",
        "timerReset": "button[title=\"Reset\"]",
        "timerCountDownUnmute": "button[title=\"Unmute\"]",
        "timerCountDownPause": ".fa.fa-pause.pause-button"
      },
      "eBookContents": {
        "cqaTestProd": "div[title=\"cqa-test-prod-desktopfoc\"] h1",
        "homeButton": "button[qid=\"71\"]"
      },
      "eBookTools": {
        "notes": "div:nth-child(4) div:nth-child(2) button:nth-child(1)",
        "Timer": "button[qid=\"94\"]"
      },
      "practiceExtra": {
        "practice_extra": "h2[class='mb-0']"
      },
      "myProgress": {
        "my_progress": ".page-title.mt-3"
      },
      "myHomework": {
        "back_btn": "a[qid='aView-4']"
      },
      "notes": {
        "eBookNotesHeadingTxt": "div.notes-title",
        "eBookAddNotesBtn": "button.add-note-button",
        "eBookAddNotesTextarea": "textarea[placeholder='Type here...']",
        "eBookSaveNotesBtn": "button[class=\"save-note\"]",
        "eBookDeleteNotesBtn": "button[class=\"cancel-note-button ng-star-inserted\"]",
        "eBookNotesViewMoreBtn": ".nemo-font.menu-btn",
        "eBookViewMoreDeleteNotestBtn": ".dropdown-menu a.dropdown-item:last-of-type",
        "eBookNoteModalDeleteButton": "button.deleteSingleNoteModalDeleteButton"
      },
      "classDrawer": {
        "classDrawerHeader": "[data-tid=text-drawerHeaderTitle]",
        "classDrawerTitle": "[data-tid=text-ClassesTitle]",
        "classDrawerSubTitle": "[data-tid=text-ClassesSubtitle]",
        "classDrawerCloseBtn": "[data-tid=button-close]"
      },
      "Calender": {
        "calenderYear": "//button//h6[contains(@class,'MuiTypography-subtitle1')]",
        "calenderCurrentMonth": "//div[contains(@class,'MuiPickersCalendarHeader')]/p",
        "calenderLeftArrow": "//button[contains(@class,'MuiPickersCalendarHeader-iconButton')][1]",
        "calenderRightArrow": "//button[contains(@class,'MuiPickersCalendarHeader-iconButton')][2]",
        "calenderMonthHeader": "//div[contains(@class,'MuiPickersCalendarHeader-transitionContainer')]",
        "calenderSelectedDate": "//button[contains(@class,'MuiPickersDay-daySelected')]",
        "calenderDate": "//button[contains(@class,'MuiPickersDay-day')]",
        "calenderDisabledDate": "/button[contains(@class,'MuiPickersDay-day')]",
        "calenderSelectedYear": "//div[contains(@class,'MuiPickersYear-yearSelected-')]",
        "calenderYearList": "[contains(@class,'MuiPickersYear-')]",
        "calenderYearListCount": "//div[contains(@class,'MuiPickersYear-')]"
      },
      "browse": {
        "cardSkeleton": "[class*=MuiSkeleton]",
        "pageTitle": "[data-tid=text-pageTitle]",
        "pageSubTitle": "[data-tid=text-pageSubTitle]",
        "filtersBtn": "[data-tid=button-filter]",
        "previousPageArrow": "[data-tid=button-pagination-next]",
        "nextPageArrow": "[data-tid=button-pagination-previous]",
        "currentPage": "[data-tid*=button-pagination][aria-current=true]",
        "searchBox": "input[type=text]",
        "searchIcon": "[data-tid=icon-autocomplete-search]",
        "resourceCategory": "[data-tid*=text-seaction-heading-",
        "viewAllBtn": "[data-tid*=btn-viewAll-",
        "cardTitle": "[data-tid*='text-cardTitle-",
        "cardSubTitle": "[data-tid*='text-CardSubtile-",
        "cardImage": "[data-tid*='image-card-",
        "cardLockIcon": "[data-tid*='icon-locked-",
        "moreOptionsBtn": "[data-tid*='button-contextMenu-",
        "viewOption": "[data-tid*=menu-view]",
        "addToPlaylistOption": "[data-tid*=menu-add-to-playlist]",
        "shareOption": "[data-tid*=menu-share]",
        "bookTitle": "[data-tid*=text-bookTitle-",
        "bookSubTitle": "[data-tid*=text-bookSubtitle-",
        "bookImage": "[data-tid*=img-bookCover-",
        "viewBtn": "[data-tid*=button-view-",
        "addBookBtn": "[data-tid*=button-addBook-",
        "addedIcon": "[data-tid*=icon-added-",
        "bookMoreOptionsBtn": "[data-tid*=button-contextMenu-",
        "viewClassOption": "[data-tid*=button-viewClass]",
        "createNewClassOption": "[data-tid*=button-createClass]",
        "addToMyBooksOption": "[data-tid*=button-add]",
        "removeFromMyBooksOption": "[data-tid*=button-remove]",
        "openFlipbookOption": "[data-tid*=button-openFlipbook]",
        "listOfPlaylist": "[data-tid*=menu-addToNewPlaylist],[data-tid*=menu-addToPlaylist]",
        "searchList": "[data-tid*=list-item-]:not([data-tid=list-item-show-more-result]) > p",
        "showMoreResults": "[data-tid=list-item-show-more-result]",
        "noResultListItemTitle": "[data-tid=text-title-no-search-result-found]",
        "noResultListItemSubtitle": "[data-tid=text-subtitle-no-search-result-found]",
        "clearSearch": "[data-tid=icon-close-serach]",
        "searchCount": "[data-tid=label-search-result], [data-tid=label-result]",
        "search_NoResult_img": "[data-tid=icon-nostudent], [data-tid=icon-noResult]",
        "search_NoResult_title": "[data-tid=text-noResultFound]",
        "search_NoResult_subTitle": "[data-tid=text-noResultFoundBilinear]",
        "searchPill": "[data-tid=chip-search]",
        "closeSearchPill": "[class*=Chip-deleteIcon]",
        "goToPage": "[data-tid=button-pagination-",
        "filterMenuTitle": "[data-tid=filtermenu-title-filters]",
        "filterMenuCloseBtn": "[data-tid=filtermenu-button-cancel]",
        "filterMenuFilterCount": "[data-tid=filtermenu-text-applied-filter-count]",
        "filterMenuClearAllBtn": "[data-tid=btn-filtermenu-label-clearall]",
        "filterMenuApplyBtn": "[data-tid=button-apply-filter]",
        "bookFamily": "[data-tid*=text-familyTitle-",
        "partOfFamily": "[data-tid*=text-partOf-familyTitle-",
        "bookFamilySection": "[data-tid*=section-",
        "otherBooksSection": "[data-tid=section-OtherBooks]",
        "otherBooksTxt": "[data-tid=text-otherBooksTitle]",
        "showMoreBooksTxt": "[data-tid=text-showMoreBooks]",
        "showMoreBooksBtn": "[data-tid=button-showMoreBooks]"
      },
      "myClassPage": {
        "pageTitle": "main h1",
        "pageSubTitle": "main div>span",
        "pageIconNoClassArchived": "[data-tid=image-noClasses]",
        "pageTitleNoClassArchived": "[data-tid='text-title-noClasses']",
        "pageSubTitleNoClassArchived": "[data-tid='text-subtitle-noClasses']",
        "classHeading": "[data-tid='text-pageTitle']",
        "classSubHeading": "[data-tid='text-pageSubTitle']",
        "activeTab": "[data-tid='button-product-0']",
        "archivedTab": "[data-tid='button-product-1']",
        "archivedlbl": "[data-tid=text-pill-0-0]",
        "addClassBtn": "[data-tid='button-add'],[data-tid=button-joincourse]",
        "notStarted_btn": "[data-tid*=button-notStarted-",
        "menuOptionBtn": "[data-tid*=button-classSubmenu-",
        "noClassPageTitle": "[data-tid=text-title-noClasses]",
        "noClassPageSubTitle": "[data-tid='text-subtitle-noClasses']",
        "noClassPageSubImg": "main img",
        "className": "[data-tid*='text-classTitle-",
        "classDuration": "[data-tid='text-classDuration-",
        "bookTitle": "[data-tid*='text-classSubtitle-",
        "classInstructorName": "[data-tid=text-instructorName-",
        "classInstructorIcon": "[data-tid=icon-instructorName-",
        "bookIcon": "[data-tid*=image-book-",
        "inboxOption": "[data-tid*=button-inbox] p",
        "assignmentsOption": "li[data-tid*=button-assignment] p,[data-tid*=button-assignments] p",
        "studentsOption": "li[data-tid*=button-students] p",
        "gradeBookOption": "li[data-tid*=button-gradebook] p",
        "materialsOption": "li[data-tid*=button-material] p",
        "viewClassOption": "li[data-tid*=button-class] p",
        "progressOption": "li[data-tid*=button-progress] p",
        "msgBar": "[data-tid='text-success'] p",
        "msgBarClose": "[data-tid=button-close]",
        "classCard": "[data-tid=button-class-",
        "futureTab": "[aria-label*=\"class card ",
        "joinClassbtn": "[data-tid=button-plusAddClass]",
        "joinClassHeader": "[data-tid=text-joinaclass]",
        "joinClassSubHeader": "[data-tid=text-enterclasskeybyinstructor]",
        "enterClassCodeLabel": "[data-tid=text-enterclasskey]",
        "classCodeInput": "input[id=main-focus-area]",
        "classHelpText": "[id=main-focus-area-helper-text]>p",
        "classSubLable": "[data-tid=text-courseKeyHelperText]",
        "joinclassPopUpbtn": "[data-tid=button-joinClass]",
        "helpJoiningClass": "[data-tid=anchor-skip]",
        "closebtn": "[data-tid=button-joincourseclose]",
        "viewProgress_btn": "[data-tid=button-view-progress]",
        "archiveLblCrossButton": "[data-tid=button-close]"
      },
      "createClassPage": {
        "pageTitle": "[data-tid='text-pageTitle']",
        "pageSubTitle": "[data-tid='text-pageSubTitle']",
        "classHeader": "[data-tid='text-classheader']",
        "classSubHeader": "[data-tid='text-classSubheader']",
        "createBtn": "[data-tid='button-Create Class']",
        "cancelBtn": "[data-tid='button-cancel']",
        "title_txtbox": "[data-tid='input-title']",
        "desc_lbl": "label[for='input-description']",
        "desc_txtbox": "[data-tid='input-description']",
        "title_lbl": "[data-tid=text-titleLabel]",
        "startDate_txtbox": "#startDate",
        "startDate_lbl": "label[for='input-startDate']",
        "endDate_txtbox": "#endDate",
        "endDate_lbl": "label[for='input-endDate']",
        "selectBook_lbl": "[data-tid='text-selectBookLabel']",
        "selectBook_txt": "[data-tid=text-selectBookSubtext]",
        "bookTitle": "[data-tid='text-bookTitle']",
        "bookIcon": "[data-tid=image-bookCover]",
        "datePicker_okBtn": "/html/body/div[2]/div[3]/div/div[2]/button[2]",
        "titleErrorMsg": "[data-tid='text-titleError']",
        "descErrorMsg": "[data-tid='text-descriptionError']",
        "startDateErrorMsg": "[data-tid='text-startDateError']",
        "endDateErrorMsg": "[data-tid='text-endDateError']",
        "bookErrorMsg": "p[class*='MuiFormHelperText",
        "saveBtn": "[data-tid='button-Save']",
        "removeBookbtn": "[data-tid=button-removeBook]",
        "AddANewBook_btn": "[data-tid=button-assignBook]",
        "bookCard": "label[class*='MuiFormControlLabel']:nth-child(",
        "bookSkeleton": "span[class*='MuiSkeleton-text']:nth-child(1)"
      },
      "addBook": {
        "addBookPageTitle": "[data-tid='text-pageTitle']",
        "addBookPageSubtitle": "[data-tid='text-pageSubTitle']",
        "bookCoverImg": "[data-tid*=img-bookCover-",
        "bookTitle": "[data-tid*=text-bookTitle-",
        "bookSubtitle": "[data-tid*=text-bookSubtitle-",
        "addBookBtn": "[data-tid*=button-add-",
        "addToClassBtn": "[data-tid='button-Add to Class']",
        "cancelBtn": "[data-tid='button-cancel']",
        "noBookLabel": "[data-tid*=text-noBookLabel]",
        "bookLabel": "[data-tid='text-bookLabel']",
        "bookValue": "[data-tid='text-bookValue']",
        "removeBookBtn": "[data-tid='icon-close']"
      },
      "successClassPage": {
        "viewClass": "[data-tid='button-View Class']",
        "backToHomeBtn": "[data-tid='button-backtohome']",
        "success_img": "[alt='Success page']",
        "className_txt": "[data-tid='text-courseName']",
        "successCaption_txt": "[data-tid='text-successfulCaption']",
        "classKey_value": "[data-tid='text-courseCode']",
        "copy_txt": "[data-tid='text-copy']",
        "copy_btn": "[data-tid='button-copy'] span"
      },
      "classDetailsStudent": {
        "bookCoverIcon": "[data-tid=image-bookCover]",
        "className": "[data-tid=text-bandTitle]",
        "BookName": "[data-tid=text-bandSubtitle]",
        "classDurationIcon": "[data-tid=icon-meta-0]",
        "classDuration": "[data-tid=text-metaValue-0]",
        "classDatesLabel": "p[data-tid='text-metaLabel-0']",
        "instructorIcon": "[data-tid=icon-meta-1]",
        "instrutorName": "p[data-tid='text-metaValue-1']",
        "instructorLabel": "p[data-tid='text-metaLabel-1']",
        "openFlipbookBtn": "[data-tid='button-openFlipbook']",
        "otherDetailsBtn": "[data-tid='button-otherDetails']",
        "assignmentsLbl": "[data-tid='text-heading-assignments']",
        "overviewBtn": "[data-tid='button-view-assignments']",
        "dueBtn": "[data-tid='text-Due']",
        "dueNumberChip": "[data-tid='chip-Due']",
        "upcomingBtn": "[data-tid='text-Upcoming']",
        "completeBtn": "[data-tid='text-Completed']",
        "assignmentTitle": "[data-tid*=text-assignmentTitle-",
        "assignmentActivities": "[data-tid*=text-assignmentActivities-",
        "dueDaysChip": "[data-tid*=chip-dueDaysPill-",
        "blankAssignment_img": "[data-tid=image-noAssignments]",
        "blankAssignment_title": "[data-tid=text-title-noAssignments]",
        "blankAssignment_subtitle": "[data-tid=text-subtitle-noAssignments]",
        "progress_lbl": "[data-tid=text-heading-progress]",
        "noUpcoming_title": "[data-tid=text-noAssignments]",
        "noUpcoming_subtitle": "[data-tid=text-noAssignments-description]",
        "noCompleted_title": "[data-tid=text-noAssignments]",
        "noCompleted_subtitle": "[data-tid=text-noAssignments-description]",
        "bookMaterial_lbl": "[data-tid=text-bookMaterial-label-",
        "completionValue": "[data-tid=text-progress-completion-",
        "progressbar": "[data-tid=progressbar-",
        "archiveTagLbl": "[data-tid=tag-archived]"
      },
      "teacherViewClassPage": {
        "pageTitle": "[data-tid=text-pageTitle]",
        "pageSubTitle": "[data-tid=text-pageSubtitle]",
        "gradebookBtn": "[data-tid=button-gradebook]",
        "classOptionsBtn": "[data-tid=button-classOptions]",
        "editClassBtn": "[data-tid=button-editClass]",
        "addBooksBtn": "[data-tid=button-addBooks]",
        "dataSubtitle": "[data-tid=text-pageSubtitle]",
        "productTabBtns": "[data-tid*=button-product-",
        "bookCoverImg": "[data-tid=image-classBookCover]",
        "bookTitleTxt": "[data-tid=text-classBookTitle]",
        "bookSubtitleTxt": "[data-tid=text-classBookSubtitle]",
        "viewBookBtn": "[data-tid=button-classViewBook]",
        "bookComponentNamesBtns": "[data-tid*=text-title-",
        "bookComponentUnits": "[data-tid*=text-item0-",
        "bookComponentActivities": "[data-tid*=text-item1-",
        "usingClasses_lbl": "[data-tid=text-cardSliderTitle]",
        "usingClassesByline_lbl": "[data-tid=text-cardSliderSubtitle]",
        "inviteStudentsdropDown_btn": "[data-tid=text-invite]",
        "inviteStudents_btn": "[data-tid=button-actionCardBtn-0]",
        "inviteStudents_lbl": "[data-tid=text-actionCardTitle-0]",
        "inviteStudentsByline_lbl": "[data-tid=text-actionCardSubtitle-0]",
        "createAssignments_btn": "[data-tid=button-actionCardBtn-1]",
        "createAssignment_lbl": "[data-tid=text-actionCardTitle-1]",
        "createAssignmentByline_lbl": "[data-tid=text-actionCardSubtitle-1]",
        "noInboxActivity_lbl": "[data-tid=text-title-noInbox]",
        "noInboxActivityByline_lbl": "[data-tid=text-subtitle-noInbox]",
        "noStudentIcon": "[data-tid=icon-nostudent]",
        "noStudentTitle": "[data-tid=text-noStudentEnrolled]",
        "noStudentSubTitle": "[data-tid=text-noStudentEnrolledBilinear]",
        "nameHeading": "[data-tid=value-text-heading-name]",
        "statusHeading": "[data-tid=value-text-heading-status]",
        "studentName": "[data-tid*=text-name-",
        "studentStatus": "[data-tid*=text-status-",
        "studentMoreOption": "[data-tid*=button-contextMenu-",
        "studentAvgScorelbl": "[data-tid=value-text-heading-avgScore]",
        "studentCompletionScorelbl": "[data-tid=value-text-heading-completion]",
        "studentAvgScore": "[data-tid=text-avgScore-",
        "studentCompletionScore": "[data-tid*=text-progress-",
        "viewProgressbtn": "[data-tid*=button-viewProgress-",
        "viewMessagebtn": "[data-tid*=button-message-",
        "studentList": "[data-tid*=text-name-",
        "assignmentsTab": "[data-tid=button-product-1]",
        "reviewBox_Title": "[data-tid=text-title-reviewBox]",
        "reviewBox_SubTitle": "[data-tid=text-subtitle-reviewBox]",
        "reviewBox_Cancelbtn": "[data-tid=icon-cancelBtn-reviewBox]",
        "reviewBox_icon": "[data-tid=icon-reviewBox]",
        "assignmentCardStudentName": "[data-tid*=text-userName-",
        "assignmentCardActivityText": "[data-tid*=text-submitActivity-",
        "assignmentCardActivityDate": "[data-tid*=text-submitDate-",
        "assignmentCardActivityName": "[data-tid*=text-activityName-",
        "assignmentCardUnitName": "[data-tid*=text-unitPath-",
        "archivedlbl": "[data-tid=chip-pill]",
        "archivedMsg": "[data-tid=text-archiveMessage]"
      },
      "itemPlayer": {
        "activeQues": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) ",
        "correctIcon": " [data-tid=icon-correct]",
        "incorrectIcon": " [data-tid=icon-incorrect]",
        "questionTitle": "[data-tid=text-headerTitle]",
        "instructionText": "[data-tid=text-instruction]",
        "promptText": "[data-tid=text-prompt]",
        "instructionHeading": "[data-tid=text-instructionHeading]",
        "selectOneLabel": "[data-tid=text-selectOne]",
        "selectOneOrMoreLabel": "[data-tid=text-selectOneOrMore]",
        "selectFromDropdownLabel": "[data-tid=text-selectFromDropdown]",
        "matchingLeftLabel": "[data-tid=text-selectFromThisColumn]",
        "matchingRightLabel": "[data-tid=text-matchWithThisColumn]",
        "itemPlayerContainer": "[id='itemContainer']",
        "videoMedia": "[aria-label=Prompt] [data-tid=container-video]",
        "imageMedia": "[aria-label=Prompt] [data-tid=container-imageWrapper]",
        "audioMedia": "[aria-label=Prompt] [data-tid=container-audio]",
        "promptImageLoaded": "[aria-label=Prompt] [data-tid=container-imageWrapper] img[data-tid=image-loaded]",
        "plyrLoading": "[aria-label=Prompt] [class*=plyr--loading]",
        "plyrPlaying": "[aria-label=Prompt] [class*=plyr--playing]",
        "plyrPlayBtn": "[aria-label=Prompt] [class=plyr__controls] button[data-plyr=play]"
      },
      "testPlayer": {
        "checkMyWork_btn": "[class=buttons-container] [class=defaultBtn-check-mywork-icon] , [data-tid=button-checkAnswers],[data-tid=button-checkanswers], [data-tid=button-check]",
        "next_btn": "[id=next], [data-tid=button-next], [data-tid=button-goNext]",
        "previous_btn": "[id=previous], [data-tid=button-previous], [data-tid=button-goPrev]",
        "tryAgain_btn": "[id=tryAgain], [data-tid=button-tryagain]",
        "reset_btn": "[id=reset], [data-tid=button-reset]",
        "showAnswer_btn": "[data-tid=button-showcorrectanswers], [data-tid=button-showAnswers]",
        "yourResponse_btn": "[data-tid=button-showuserresponse], [data-tid=button-showResponses]",
        "showingCorrectAnswer_txt": "p[data-tid=text-showingcorrectanswer]",
        "hint_btn": "[data-tid=button-hint]"
      },
      "multiMcq": {
        "choices": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-click-option-sub-question-",
        "selectedChoice": "] [aria-checked=true]",
        "subquesText": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=text-sub-question-",
        "subquesMediaCont1": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=mediaContainer-sub-question-",
        "qMediaContainer": "[data-tid*=container-]",
        "qImageLoaded": "] img[data-tid=image-loaded]",
        "qPlyrLoading": "] [class*=plyr--loading]",
        "qPlyrPlaying": "] [class*=plyr--playing]",
        "qPlyrPlayBtn": "] [class=plyr__controls] button[data-plyr=play]"
      },
      "fibtext": {
        "responses": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-response-",
        "textPlaceholder": "] [data-tid=text-placeholder]"
      },
      "fibselect": {
        "response": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-response-",
        "responseOption": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [class*=mdc-menu-surface--open] [data-tid*=select-responseoption][data-value="
      },
      "dnd": {
        "source": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=dragsource-option-",
        "target": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=droptarget-option-",
        "tapToZoom": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid='button-taptozoom']",
        "zoomOverlay": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [class*='zoom-overlay']",
        "zoomDialogClose_btn": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid='button-zoomdialogclose']"
      },
      "matching": {
        "left": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-left-item-",
        "right": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=input-right-item-"
      },
      "classify": {
        "droppedOption": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-tid*=dropped-option-",
        "textPlaceholder": "] [data-tid=text-placeholder]"
      },
      "orderList": {
        "option": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) li[data-tid*=input-drag-option-",
        "listIndex": "li[data-tid]:nth-child("
      },
      "writing": {
        "textbox": "div[class*=item-player-container] > div:not([style='height: 100%; display: none;']) [data-input-id*=ta-"
      },
      "activityPlayer": {
        "infoBtn": "[data-tid='button-openinfotoc']",
        "showDetailsBtn": "[data-tid=button-activityinfopanelswitcher]",
        "quesNumber": "[data-tid=text-currentquestion]",
        "prevPageBtn": "[data-tid='button-goPrev']",
        "nextPageBtn": "[data-tid='button-goNext']",
        "prevActivityBtn": "[data-tid='button-previousActivity']",
        "nextActivityBtn": "[data-tid='button-nextActivity']",
        "showAnswerBtn": "[data-tid='button-showAnswers']",
        "showResponseBtn": "[data-tid='button-showResponses']",
        "checkAnswerBtn": "[data-tid='button-checkAnswers']",
        "submitActivityBtn": "[data-tid='button-submitActivity']",
        "markCompleteBtn": "[data-tid='button-markAsComplete']",
        "retakeActivityBtn": "[data-tid='button-retakeActivity']",
        "closeBtn": "[data-tid=button-close]",
        "completedTxt": "[data-tid='button-completed']",
        "yourScoreLabel": "[data-tid=text-activityScoreInfo] p",
        "yourScoreValue": "[data-tid=text-activityScoreInfo] h4",
        "detailsPanel": "[data-tid=container-leftPanel]",
        "panelHeading": "[data-tid=panel-heading]",
        "activityTitle": "[data-tid='text-title']",
        "activitySubtitle": "[data-tid='text-subTitle']",
        "activityTypeIcon": "[data-tid='icon-activitytype']",
        "activityType": "[data-tid='text-activitytype']",
        "pageNumber": "[data-tid='text-pagenumberinfo']",
        "expandCollapseBtn": "[data-tid=icon-togglegroupexpansion]",
        "analyticsInfoContainer": "[data-tid=container-analyticsinfo] > div > div:nth-child(2)",
        "closeInfoBtn": "[data-tid=button-closeinfotoc]",
        "infoTocHeading": "[data-tid=text-infotocheading]",
        "feedbackText": "[data-tid=text-feedbackmessage]",
        "closeAssignmentBtn": "[data-tid=button-closeAssignment]",
        "kidsFeedbackTitle": "[data-tid=title-feedback]",
        "kidsFeedbackSubtitle": "[data-tid=subtitle-feedback]"
      },
      "activitiyPlayer": {
        "feedback_txt": "[data-tid=text-feedbackmessage]",
        "showingCorrectAnswer_txt": "[data-tid=text-showingcorrectanswer]",
        "restart_btn": "[data-tid=button-resetActivity],[data-tid=button-retakeActivity]"
      },
      "viewBook": {
        "bookCover": "[data-tid=image-bookCover]",
        "bookTitle": "[data-tid=text-bookTitle]",
        "bookSubTitle": "[data-tid=text-bookSubtitle]",
        "viewClass": "button[data-tid=button-bookClasses]",
        "openFlipbook_btn": "[data-tid=button-openFlipbook]",
        "moreOptions_btn": "[data-tid=band-moreOptions]",
        "myBooks_lbl": "[data-tid=pill-myBooks]",
        "unit_lbl": "[data-tid=text-contents]",
        "viewBookDetails_option": "[data-tid=button-viewBookDetails]",
        "addBook_option": "[data-tid=button-addToMyBook]",
        "removeBook_option": "[data-tid=button-removeBook]",
        "removeBook_title": "[data-tid=text-title-removeBook]",
        "removeBook_subtitle": "[data-tid=text-subTitle-removeBook]",
        "removeBookDialogCancel": "[data-tid=button-secondary-removeBook]",
        "removeBookDialogRemove": "[data-tid=button-primary-removeBook]",
        "unitSkeleton": "[class*=MuiSkeleton]",
        "unit": "[data-tid*=button-chapter-] , [data-tid*=text-folderName-]",
        "unitTitle": "[data-tid*=text-chapterTitle-",
        "unitNumber": "[data-tid*=text-chapterNumber-",
        "unitPage": "[data-tid*=text-chapterPage-",
        "unitCoverImg": "[data-tid*=image-chapter-",
        "unitMoreOptions": "[data-tid*=button-moreOption-",
        "activityIcon": "[data-tid*=icon-activityCount-",
        "activityCount": "[data-tid*=text-activityCount-",
        "folderIcon": "[data-tid*=icon-folderCount-",
        "folderCount": "[data-tid*=text-folderCount-",
        "unitOpenFlipbook_option": "[data-tid*=button-flipbook-",
        "unitViewActivity_option": "[data-tid*=button-open-",
        "lastActivity_icon": "[data-tid=icon-lastActivity]",
        "lastActivity_lbl": "[data-tid=text-lastActivityLabel]",
        "lastActivity_name": "[data-tid=text-lastActivityName]",
        "lastActivity_Dismiss": "[data-tid=button-lastActivityDismiss]",
        "lastActivity_Continue": "[data-tid=button-lastActivityContinue]",
        "flipbookList": "[data-tid*=button-flipbookProduct-"
      },
      "viewUnit": {
        "unitThumbnail": "[data-tid*=image-unit-thumbnail]",
        "unitName": "[data-tid=text-chaptername]",
        "unitNumber": "[data-tid=text-productname]",
        "openInFlipbook_btn": "[data-tid=btn-open-in-flipbook]",
        "nextUnit_btn": "[data-tid=button-next-unit]",
        "previousUnit_btn": "[data-tid=button-previous-unit]",
        "activity_label": "[data-tid=text-unitselection]",
        "activity_label_byline": "[data-tid=text-unitselectionbilinear]",
        "folderTitle": "[data-tid*=button-folder-",
        "activityTitle": "[data-tid*=text-title],[data-tid*=text-itemName]",
        "activityPageInfo": "[data-tid*=text-metaInfo]",
        "activityCompletionCircle": "[data-tid*=chart]",
        "activityType_icon": "[data-tid*=icon-itemType]",
        "activityType_txt": "[data-tid*=text-itemType]",
        "activityMoreOptions": "[data-tid*=button-contextMenu-",
        "openFlipbook_moreOptions": "[data-tid=*menu-open-in-flipbook-",
        "viewActivity_moreOptions": "[data-tid=*menu-view-activity-"
      },
      "settings": {
        "pageTitle": "[data-tid=text-pageTitle]",
        "pageSubTitle": "[data-tid=text-pageSubTitle]",
        "pageHeading": "[data-tid=text-myDetailsHeading]",
        "currentPassword_label": "[data-tid=label-currentPassword]",
        "currentPassword_input": "[data-tid=input-currentPassword] input",
        "togglePassword_currentPassword": "[data-tid=input-currentPassword] [data-tid=button-togglepasswordvisibility]  svg",
        "togglePassword_newPassword": "[data-tid=input-password] [data-tid=button-togglepasswordvisibility]  svg",
        "togglePassword_confirmPassword": "[data-tid=input-confirmPassword] [data-tid=button-togglepasswordvisibility]  svg",
        "password_label": "[data-tid=label-password]",
        "password_input": "[data-tid=input-password] input",
        "confirmPassword_label": "[data-tid=label-confirmPassword]",
        "confirmPassword_input": "[data-tid=input-confirmPassword] input",
        "newPasswordRules_text": "[data-tid=text-sublabelpassword]",
        "currentPasswordError_text": "[data-tid=text-errorcurrentPassword]",
        "newPasswordError_text": "[data-tid=text-errorpassword]",
        "confirmPasswordError_text": "[data-tid=text-errorconfirmPassword]",
        "changePassword_button": "[data-tid=button-changePassword]",
        "email_label": "[data-tid=label-email]",
        "email_input": "[data-tid=input-email] input",
        "firstName_label": "[data-tid=label-firstName]",
        "firstName_input": "[data-tid=input-firstName] input",
        "lastName_label": "[data-tid=label-input-lastName]",
        "lastName_input": "[data-tid=input-input-lastName] input",
        "country_label": "[data-tid=textfield-label]",
        "country_input": "[data-tid=country] input",
        "clearIcon": "[title=Clear]",
        "countryListItem": "[data-option-index='0']",
        "firstNameError_text": "[data-tid=text-errorfirstName]",
        "lastNameError_text": "[data-tid=text-errorinput-lastName]",
        "changeProfile_button": "[data-tid=button-changeProfile]",
        "fontSizeText": "[data-tid=settings-accessibilty-fontsize]",
        "fontSizeValue": "[data-tid=text-fontSizeType]",
        "fontSizeDec": "[data-tid=settings-accessibilty-fontsize-previous] ",
        "fontSizeInc": "[data-tid=settings-accessibilty-fontsize-next] ",
        "lineSpaceText": "[data-tid=settings-accessibilty-linespace]",
        "lineSpaceValue": "[data-tid=text-lineSpaceType]",
        "lineSpaceDec": "[data-tid=settings-accessibilty-lineSpace-previous]",
        "lineSpaceInc": "[data-tid=settings-accessibilty-lineSpace-next]",
        "highContrastText": "[data-tid=high_contrast]",
        "highContrastToggleBtn": "[data-tid=input-high_contrast]",
        "dylexicFontText": "[data-tid=dylexic-font]",
        "dylexicFontToggleBtn": "[data-tid=input-dylexic-font]",
        "underlinelinksText": "[data-tid=underline_links]",
        "underlinelinksToggleBtn": "[data-tid=input-underline_links]",
        "previewTextHeading": "[data-tid=text-previewHeading]",
        "previewTextPara": "[data-tid=text-previewPara]",
        "previewLinkText": "[data-tid=setting-preview-link]",
        "button1": "[data-tid=setting-preview-button]",
        "button2": "[data-tid=button-accessbility]",
        "moreDetailsBtn": "[data-tid=accessibilty-link]",
        "resetButton": "[data-tid=reset-button]",
        "applySettingsBtn": "[type=submit]",
        "resetSettingsTitle": "[data-tid=text-title-reset-user-settings]",
        "resetSettingsSubTitle": "[data-tid=text-subTitle-reset-user-settings]",
        "resetSettingsCancelBtn": "[data-tid=button-secondary-reset-user-settings]",
        "resetSettingsConfirmBtn": "[data-tid=button-primary-reset-user-settings]",
        "subscription_text": "//h6[contains(text(),'Subscription')]",
        "subscriptionSubtitle_text": "//*[contains(text(),'Billing and license')]",
        "free_text": "//*[contains(text(),'Free')]",
        "getPremiumAccess_text": "//*[contains(text(),'Get Premium Access')]",
        "getPremiumAccessSubtitle_text": "//*[contains(text(),'You will get access')]",
        "price_text": "//*[contains(text(),'Subscription for $24.99/year')]",
        "upgradePlan_btn": "[data-tid=button-updateBillingAddress]",
        "paymentMethod_text": "//*[contains(text(),'Payment Method')]",
        "noPaymentMethod_text": "//*[contains(text(),'No payment method added yet')]",
        "noPaymentMethodSubtitle_text": "//*[contains(text(),'When you add a payment method')]",
        "billingMethod": "//*[contains(text(),'Billing Information')]",
        "noBillingInfo_text": "//*[contains(text(),'No billing information')]",
        "noBillingInfoSubtitle_text": "//*[contains(text(),'When you add your billing information')]",
        "premiumPlan_text": "//*[contains(text(),'Premium Plan')]",
        "active_text": "//*[contains(text(),'Active')]",
        "premiumPrice_text": "//*[contains(text(),'$')]",
        "autoRenewal_text": "//*[contains(text(),'Auto Renewal On')]",
        "licensePeriod_text": "//*[contains(text(),'License Period')]",
        "licensePeriod_date": "//*[contains(text(),'License Period')]/following-sibling::p",
        "managePlan_btn": "[data-tid=button-managePlan]",
        "changeCard_btn": "[data-tid=button-changeCard]",
        "updateBillingAddress_btn": "[data-tid=button-updateBillingAddress]"
      },
      "billing": {
        "upgradetoPremium_btn": "[data-tid=button-updateToPremium]",
        "close_btn": "[data-tid=button-close]"
      },
      "planOptions": {
        "cardNumber_text": "[data-tid=label-cardNumber]"
      },
      "flipbook": {
        "readerContainerWrapper": "[id='reader-container-wrapper']",
        "pageLayoutSingle": "[id=readerpagedivA][style='width: 100%;']",
        "pageLayoutDouble": "[id=readerpagedivB]:not([class*=display-none])",
        "penBtn": "[data-tid='button-toolbar-item-0-0'][aria-disabled='false']",
        "highlighterBtn": "[data-tid='button-toolbar-item-0-1'][aria-disabled='false']",
        "eraserBtn": "[data-tid='button-toolbar-item-0-2'][aria-disabled='false']",
        "undoBtn": "[data-tid='button-toolbar-item-0-3'][aria-disabled='false']",
        "redoBtn": "[data-tid='button-toolbar-item-0-4'][aria-disabled='false']",
        "notesDockContainer": "[id=dock-container] > [id=dialog-notes]",
        "notesBtn": "[data-tid='button-toolbar-item-0-0']",
        "zoomInBtn": "[data-tid='button-toolbar-item-1-0'][aria-disabled='false']",
        "zoomOutBtn": "[data-tid='button-toolbar-item-1-1'][aria-disabled='false']",
        "fitToScreenBtn": "[data-tid='button-toolbar-item-1-2'][aria-disabled='false']",
        "doublePageBtn": "[data-tid='button-toolbar-item-1-3'][aria-disabled='false']",
        "singlePageBtn": "[data-tid='button-toolbar-item-1-4']",
        "fullScreenBtn": "[data-tid='button-toolbar-item-1-5'][aria-disabled='false']",
        "bookmarkBtn": "[data-tid='button-toolbar-item-2-0']",
        "TOCBtn": "[data-tid='button-toolbar-item-2-1']",
        "previousBtn": "[data-tid='button-toolbar-item-2-2']",
        "nextBtn": "[data-tid='button-toolbar-item-2-3']",
        "myNotesTitle": "[data-tid=label-text-notes-header]",
        "notesDockBtn": "[data-tid=notebox-button-dock]",
        "notesUndockBtn": "[data-tid=notebox-button-undock]",
        "notesCloseBtn": "[data-tid='notebox-button-cancel']",
        "addNoteBtn": "button[data-tid='button-add-note']",
        "noNoteIcon": "img[data-tid='icon-no-note']",
        "noNoteText": "[data-tid='text-no-note']",
        "noteListItemLabel": "[data-tid*='note-list-item-label-",
        "noteListItemText": "[data-tid*='text-note-list-",
        "noteListDeleteBtn": "button[data-tid*='btn-delete-",
        "noteListEditBtn": "button[data-tid*='btn-edit-",
        "addNotesTitle": "[data-tid=label-text-notes-add-header],[data-tid=label-text-notes-edit-header]",
        "notesPageLabel": "[data-tid=label-text-page-number]",
        "notesPageValueSingle": "[data-tid=label-text-page-number-value]",
        "notesPageValueLeft": "[data-tid=text-option-0]",
        "notesPageValueRight": "[data-tid=text-option-1]",
        "notesTextArea": "[id=input-edit-note]",
        "notesCancelBtn": "button[data-tid='button-cancel']",
        "notesSaveBtn": "button[data-tid='button-save']",
        "deleteNoteTitle": "[data-tid='text-title-deleteNote']",
        "deleteNoteSubTitle": "[data-tid='text-subTitle-deleteNote']",
        "deleteNoteCancelBtn": "button[data-tid='button-secondary-deleteNote']",
        "deleteNoteDeleteBtn": "button[data-tid='button-primary-deleteNote']",
        "myBookmarksTitle": "[data-tid=label-text-bookmark-header]",
        "bookmarkCloseBtn": "button[data-tid='bookmarkbox-button-cancel']",
        "noBookmarkIcon": "img[data-tid='icon-no-bookmark']",
        "noBookmarkText": "[data-tid='text-no-bookmark']",
        "addBookmarkBtn": "button[data-tid='button-bookmark-this-page']",
        "bookmarkListItemLabel": "[data-tid*='bookmark-list-item-label-",
        "bookmarkListItemName": "[data-tid*='bookmark-list-item-name-",
        "bookmarkListDeleteBtn": "button[data-tid*='btn-delete-",
        "bookmarkListEditBtn": "button[data-tid*='btn-edit-",
        "bookmarkNameLabel": "[data-tid='text-label-edit-bookmark']",
        "bookmarkPageLabel": "[data-tid='label-text-page-number']",
        "bookmarkPageValueSingle": "[data-tid=label-text-page-number-value]",
        "bookmarkPageValueLeft": "[data-tid=text-option-0]",
        "bookmarkPageValueRight": "[data-tid=text-option-1]",
        "bookmarkTextArea": "[id=input-edit-bookmark]",
        "bookmarkCancelBtn": "button[data-tid='button-cancel']",
        "bookmarkSaveBtn": "button[data-tid='button-save']",
        "flipbookTitle": "[data-tid=flipbook-title]",
        "tableOfContentTitle": "[data-tid=flipbook-toc-label]",
        "jumpToPageInput": "[data-tid=input-searchtextbox] input",
        "jumpToPageBtnTOC": "[data-tid=button-closeicon]",
        "resourceTitle": "[data-tid*=text-resourcetitle-]",
        "hotlinks": "[class*=ee-overlay]",
        "hotlinkToBeClicked": "[id=ee-overlays4-2]",
        "activeHotlink": "[class*=hotlink-active]",
        "hotlinkPlayer": "[class=plyr__controls]"
      },
      "signUp": {
        "createAccountTitleTxt": "#teacher-radio > .r-container > .checkmark"
      }
    }
  },
  "vhlLoginTest": {
    "welcome": "h1[class='u-txt-ctr']",
    "userName": "input[id='user_session_username']",
    "password": "input[id='user_session_password']",
    "commit": "input[value='Login']"
  },
  "vhl_landingtest": {
    "usernameLabel": "div.MuiBox-root.css-mv4q7",
    "notes": "button[data-tid=\"button-toolbar-item-1-3\"]",
    "closeNoteBox": "button[data-tid=\"notebox-button-cancel\"]",
    "tableOfContentsPage1": "button[data-tid=\"button-toolbar-item-3-1\"]",
    "closeTOC": "button[data-tid=\"TOC-button-close\"]"
  },
  "vhlhighlighter": {
    "highlighterIcon": "div.MuiBox-root.css-k008qs",
    "eraserButton": "button[data-tid=\"annotation-toolbar-item-1\"]",
    "highlighterBtn": "button[data-tid=\"annotation-toolbar-item-0\"]",
    "colorPicker": "div#color-picker-button[data-tid=\"annotation-toolbar-color-picker\"]",
    "closeIcon": "svg.StyledCloseIcon-sc-1wz11ot",
    "drawingToolPresentation": "div.konvajs-content canvas",
    "removeAllButton": "button[data-tid=\"annotation-toolbar-item-2\"]"
  },
  "vhlNotes": {
    "notesButton": "button[data-tid=\"button-toolbar-item-1-3\"]",
    "dockButton": "button[data-tid=\"notebox-button-dock\"]",
    "allPagesTab": "button[data-tid=\"button-product-1\"]",
    "pageCoverTab": "button[data-tid=\"button-product-0\"]",
    "addNoteBtn": "[data-tid=\"button-add-note\"]",
    "addNotesTextarea": "#input-add-note",
    "saveNoteBtn": "[data-tid=\"button-save\"]",
    "notePreviewText": "span:contains(\"Sample VHL Automation Note#1\")",
    "deleteNoteSvg": "[data-tid=\"btn-delete-2\"]",
    "deleteNoteBtn": "[data-tid=\"button-primary-deleteNote\"]",
    "closeButton": "button[data-tid=\"notebox-button-cancel\"]",
    "addNotesCanvas": "div.konvajs-content canvas"
  }
}
```

### [MODIFY] [C1TCRepository.json](file:///d:/testAutomation/QATestAutomation/testAutomation_v1.0/testResources/testcaseRepository/ExperienceApp/C1TCRepository.json)
Added two new modules:
- **Active Class** — registered `TST_ACTI_TC_1` through `TC_5` (were missing from repository)
- **Manage Reports Accessibility** — registered `TST_MRPT_TC_1` and `TC_2`

```diff:C1TCRepository.json
{
  "appname": "comproDLS Engage",
  "appdetails": "",
  "selectorFile": "./testResources/selectors/ExperienceApp/C1Selectors.json",
  "modules": [
    {
      "modulename": "Validation of Notes VHL Functionality",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/notesVhlTest.test.js",
      "testCaseRepo": "./testResources/testcaseRepository/ExperienceApp/C1TCRepository.json",
      "testcase": [
        {
          "id": "TST_VHLN_TC_1",
          "description": "Click Note Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_2",
          "description": "Click Dock Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_3",
          "description": "Click All Pages Tab",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_4",
          "description": "Click Page Cover Tab",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_5",
          "description": "Click on Add Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_6",
          "description": "Set Notes Text",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_7",
          "description": "Click on Save Notes",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_8",
          "description": "Check Notes text",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_9",
          "description": "Click on Delete Notes Btn",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_10",
          "description": "Click on Delete Notes Btn Confirmation",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_11",
          "description": "Click Close Button",
          "tags": "P1",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Validation of VLOGle File Page",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/vhlLoginTest.test.js",
      "testCaseRepo": "./testResources/testcaseRepository/ExperienceApp/C1TCRepository.json",
      "testcase": [
        {
          "id": "TST_VLOG_TC_1",
          "description": "Check vhl Login Test is Initialized",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_2",
          "description": "Enter Username",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_3",
          "description": "Enter Password",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_4",
          "description": "Click on Login Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_5",
          "description": "Validate Data fetched from Login Page",
          "tags": "P1",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Validation of VHL Highlighter Functionality",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/vhlhighlighter.test.js",
      "testCaseRepo": "./testResources/testcaseRepository/ExperienceApp/C1TCRepository.json",
      "testcase": [
        {
          "id": "TST_VHLH_TC_1",
          "description": "Click iconSvg1",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_2",
          "description": "Click eraserButton",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_3",
          "description": "Click highlighterBtn",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_4",
          "description": "Click closeIcon",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_5",
          "description": "Click RemoveAllBtn",
          "tags": "P1",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Footer",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/footer.test.js",
      "testcase": [
        {
          "id": "TST_FOOT_TC_1",
          "description": "Validate Terms of Use page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_2",
          "description": "Validate Privacy Notice page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_3",
          "description": "Validate Accessibility page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_4",
          "description": "Validate Our Approaches page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_5",
          "description": "Validate Site Feedback page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_6",
          "description": "Validate FAQs page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_7",
          "description": "Validate Cambridge One School page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_8",
          "description": "Validate Help page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_9",
          "description": "Validate footer data is displayed correctly",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "commonActivity",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/commonActivity.test.js",
      "testcase": [
        {
          "id": "TST_COMM_TC_1",
          "description": "Validate that the activityAnsCheck button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_2",
          "description": "Validate that the activityNext button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_3",
          "description": "Validate that the activityClose button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_4",
          "description": "Validate that the activityStartAgain button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_5",
          "description": "Validate that the activityExit button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_6",
          "description": "Validate the data for commonActivity buttons",
          "tags": "P3",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Landing",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/landing.test.js",
      "testcase": [
        {
          "id": "TST_LAND_TC_1",
          "description": "Validate that the landing page appears on launching the URL",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_2",
          "description": "Validate that the sign up page is launched on clicking the 'Sign Up & Start Learning Today' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_3",
          "description": "Valid in' butate that the sign in page is launched on clicking the 'Logton",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_4",
          "description": "Validate that user is able to change the language of the page from the language drop down",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_5",
          "description": "Validate the content of the landing page (in English)",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Login",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/login.test.js",
      "testcase": [
        {
          "id": "TST_IDEN_TC_2",
          "description": "Validate the content of Login page in English Language",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_1",
          "description": "Set User name value",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_4",
          "description": "Click on Forget Password",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_2",
          "description": "Set Password value ",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_5",
          "description": "Click Login button",
          "tags": "P1"
        },
        {
          "id": "TST_LOGI_TC_6",
          "description": "Click Sign Up button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_APPS_TC_1",
          "description": "Click Sign Up button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_APPS_TC_2",
          "description": "Click Sign Up button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "ResetPassword",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/resetPassword.test.js",
      "testcase": [
        {
          "id": "TST_RESE_TC_1",
          "description": "Reset Password Page initialized or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_2",
          "description": "Reset Password Button clicked or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_3",
          "description": "Enter Email Text clicked or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_4",
          "description": "Login Page is launched or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_5",
          "description": "Get Data Reset Password",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "dashboard",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/dashboard.test.js",
      "testcase": [
        {
          "id": "TST_DASH_TC_1",
          "description": "Validate Dashboard page is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_2",
          "description": "Validate that the Help button is clickable on the Dashboard",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_3",
          "description": "Validate that the Progress button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_4",
          "description": "Validate that the Practice Extra button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_5",
          "description": "Validate that the selected eBook is launched",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DASH_TC_6",
          "description": "Validate that the Homework button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_7",
          "description": "Validate that the My Progress button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_8",
          "description": "Validate that the Dashboard data is retrieved correctly, including Help button status",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_9",
          "description": "Validate that active class buttons (Progress, Practice Extra, eBook, Homework, My Progress) are retrieved correctly",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_10",
          "description": "Validate that the Create New Class page is launched correctly",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_11",
          "description": "Validate if Active class page is launched correctly",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Create New  Class",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/createNewClass.test.js",
      "testcase": [
        {
          "id": "TST_ENTE_TC_1",
          "description": "Validate that the Create new class page is launched and initialized correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_2",
          "description": "Validate that the back button is clickable and the page is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_3",
          "description": "Validate that the class name is entered correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_4",
          "description": "Validate that the start date is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_5",
          "description": "Validate that the end date is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_6",
          "description": "Validate that the school name is entered correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_7",
          "description": "Validate that the cancel button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_8",
          "description": "Validate that the class details are fetched and match the expected data",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_9",
          "description": "Validate that the next button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_10",
          "description": "Validate that the cancel button in class materials is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_11",
          "description": "Validate that the add later button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_12",
          "description": "Validate that the dashboard button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_13",
          "description": "Validate that the no keep button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_17",
          "description": "Validate that the yes cancel button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_18",
          "description": "Validate that the finish button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_19",
          "description": "Validate that the add to class button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_20",
          "description": "Validate that the eBook bundle button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_21",
          "description": "Validate that the add material input field is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_22",
          "description": "Validate that the add material button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_23",
          "description": "Validate that the eBook bundle dropdown is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },

        {
          "id": "TST_CREA_TC_19",
          "description": "Validate that class data button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_20",
          "description": "Validate that Add students button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_21",
          "description": "Validate that adults radio button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_22",
          "description": "Validate that confirmation next button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_23",
          "description": "Validate that student email input field is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_24",
          "description": "Validate that invite student button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_29",
          "description": "Validate newly added scenario for Create module - 29",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
   {
  "modulename": "C1 Assignment Page",
  "moduleId": "",
  "testFile": "./test/ExperienceApp/c1assignment.test.js",
  "testcase": [
    {
      "id": "TST_C1AS_TC_1",
      "description": "Click Class Heading",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_2",
      "description": "Click Assignments",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_3",
      "description": "Click Create Assignment",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_4",
      "description": "Click Practice Extra CQA",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_5",
      "description": "Click Unit 1",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_6",
      "description": "Click Lesson A",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_7",
      "description": "Click Next Button",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_8",
      "description": "Enter Assignment Name",
      "tags": "P2",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_9",
      "description": "Click Input Tag",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_10",
      "description": "Click Set Date",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_11",
      "description": "Click Select Student",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_12",
      "description": "Click View Summary",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_13",
      "description": "Click Assign",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_14",
      "description": "Click Kebab Icon",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_15",
      "description": "Click Delete Assignment",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_16",
      "description": "Click Yes on Delete Confirmation",
      "tags": "P3",
      "visualTest": true
    }
    ,{
      "id": "TST_C1AS_TC_17",
      "description": "Click view assignment",
      "tags": "P3",
      "visualTest": true
    }
    ,{
      "id": "TST_C1AS_TC_18",
      "description": "Click hamburger icon assignment",
      "tags": "P3",
      "visualTest": true
    }
     ,{
      "id": "TST_C1AS_TC_19",
      "description": "Click cross icon assignment",
      "tags": "P3",
      "visualTest": true
    }
     ,{
      "id": "TST_C1AS_TC_20",
      "description": "Click back icon assignment",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_14",
      "description": "Click Kebab Icon",
      "tags": "P3",
      "visualTest": true
    }
  ]
}
,
{
      "modulename": "C1 Student Assignment Page",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/c1student.test.js",
      "testcase": [
        {
          "id": "TST_C1ST_TC_1",
          "description": "Click Bell Icon",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_2",
          "description": "Click Assignment Notification",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_3",
          "description": "Click Route To Assignment",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_4",
          "description": "Click Open Hamburger Icon",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_5",
          "description": "Click Assignment Back",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_6",
          "description": "Click Close Sidebar",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_7",
          "description": "Click Go Back",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_8",
          "description": "Validate Assignment Student Data",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },

    {
      "modulename": "Delete Class",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/activeClass.test.js",
      "testcase": [
        {
          "id": "TST_ACTI_TC_1",
          "description": "Validate that the action button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_2",
          "description": "Validate that the delete class button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_3",
          "description": "Validate that the yes delete button is clickable and the page status is updated correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_4",
          "description": "Validate that the dropdown data matches the expected action button and delete class values",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_5",
          "description": "Validate that the delete modal data matches the expected yes delete button values",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },

    {
      "modulename": "invitationNotification",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/invitationNotification.test.js",
      "testcase": [
        {
          "id": "TST_INVI_TC_1",
          "description": "Validate that the Notification button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_2",
          "description": "Validate that the Invitation Notification is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_3",
          "description": "Validate that the Select Checkbox is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_4",
          "description": "Validate that the Accept button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_5",
          "description": "Validate that the Go To Dashboard button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_6",
          "description": "Validate that invitation notification data (Notification, Invitation, Checkbox, Accept, Go To Dashboard) is retrieved correctly",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },

    {
      "modulename": "timer",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/timer.test.js",
      "testcase": [
        {
          "id": "TST_TIME_TC_1",
          "description": "Validate that user is able to select timer Count up button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_2",
          "description": "Validate Under the Count down, user is able to clear the previously entered time",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_3",
          "description": "Validate Under the Count down, user is able to select Mute button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_4",
          "description": "Click the timer count down Close button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_5",
          "description": "Validate Under the Count down, user is able to Start count down",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_6",
          "description": "Validate Under the Count down, user is able to slecte timer button One",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_7",
          "description": "Validate Under the Count down, user is able to select timer button Two",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_8",
          "description": "Validate Under the Count down, user is able to select timer button Three",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_9",
          "description": "Validate that user is able to select timer Count down option",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_10",
          "description": "Click the timer count up close button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_11",
          "description": "Click the timer count up play button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_12",
          "description": "Validate that user is able to reset button the timer",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_13",
          "description": "Validate Under the Count down, user is able to select Unmute button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_14",
          "description": "Validate that user is able to pause timer count down ",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_15",
          "description": "Get and validate timer count down data",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_16",
          "description": "Get and validate timer count up data",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/player.test.js",
      "testcase": [
        {
          "id": "TST_PLAY_TC_1",
          "description": "Validate that the hyper link activity hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_2",
          "description": "Validate that the hyperlinkNewTab hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_3",
          "description": "Validate that the  hyper linkAudio without Transcript hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_4",
          "description": "Validate that the  hyperLinkGame  hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_5",
          "description": "Validate that the hyper link Go To Page is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_6",
          "description": "Validate that the hyper Zoom Hotspot is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_7",
          "description": "Validate that the hyper Zoom Hotspot Close is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_8",
          "description": "Validate that HyperLinkAnswer is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_9",
          "description": "Validate that HyperLink Audio is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_10",
          "description": "Validate that HyperLinkVideo is clickable",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "eBook",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/eBook.test.js",
      "testcase": [
        {
          "id": "TST_EBOO_TC_1",
          "description": "Validate eBook page is initialized correctly",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_2",
          "description": "Validate that the Table of Content is clickable and the page is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_3",
          "description": "Validate that the Tools button is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_4",
          "description": "Validate that the Close button is clickable and the page is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_5",
          "description": "Validate that clicking the Home button navigates to dashboard page ",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_6",
          "description": "Validate that Change Course material Dropdown is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_7",
          "description": "Validate that ebook cqaTestEbookOnlyAssets is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_8",
          "description": "Validate that the Notes pane opens correctly",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_9",
          "description": "Validate that the user is able to launch 'Go to page option'",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_10",
          "description": "Validate that eBook evolve data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_11",
          "description": "Validate that eText toolbar data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_12",
          "description": "Validate that eBook contents data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_13",
          "description": "Validate that blank Tools Notes pane content is as expected",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_14",
          "description": "Validate that eBook Content Dropdown matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_15",
          "description": "Validate that cqaTestEbookOnlyAssets matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_16",
          "description": "Validate that eBook Tools data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_17",
          "description": "Validate that the eBook Toggle Layout button is clickable & returns single page",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_22",
          "description": "Validate that the eBook Toggle Layout button is clickable & returns double page",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_18",
          "description": "Validate that the eBook Fit to Screen button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_19",
          "description": "Validate that the eBook Fit to Width button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_20",
          "description": "Validate that the eBook Zoom In button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_21",
          "description": "Validate that the eBook Zoom Out button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_52",
          "description": "Validate that the Timer panel opens correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_51",
          "description": "Validate that the drawing tool is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_53",
          "description": "Validate that next page button  is clicked and next  page launched  correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_54",
          "description": "Validate that previous page button  is clicked and  previous page launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_23",
          "description": "Validate that the show-Hide Selection tool  launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_1",
          "description": "Validate that user is able click Page No One button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_2",
          "description": "Validate that pageNoTwoBtn  is  Clicked ",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_3",
          "description": "page No Clear Btn is  Clicked",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_4",
          "description": "page No go to Btn is  Clicked",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_5",
          "description": "page No verify btn click ",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "notes",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/notes.test.js",
      "testcase": [
        {
          "id": "TST_NOTE_TC_1",
          "description": "Validate the 'Add Notes' button is working as expected",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_2",
          "description": "Validate the 'Add Notes' text area is clicked on the eBook page",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_3",
          "description": "Validate values are set in the 'Add Notes' text area on the eBook page",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_4",
          "description": " Validate the Added notes is saved after clicking Save note button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_5",
          "description": "Validate the 'Delete Notes' button is clicked on the eBook page",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_6",
          "description": "Validate that clicking the notes menu works correctly",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_NOTE_TC_7",
          "description": "Validate the clicking 'Delete Notes' button opens the confirmation modal",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_8",
          "description": "Validate that clicking 'yes' button in conformation dialog box, notes are deleted",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_9",
          "description": "Validate the user Added Notes content matches the expected data",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "showHideSelection",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/showHideSelection.test.js",
      "testcase": [
        {
          "id": "TST_SHOW_TC_1",
          "description": "Validate that the hide Selection tool is clicked and hide the selected area .",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_SHOW_TC_2",
          "description": "Validate that the show Selection tool is clicked and show only the selected area",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_SHOW_TC_3",
          "description": "Validate that the show or hode Selected area is closed (click on croxx button for remove trhe selected area .)",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_SHOW_TC_4",
          "description": "Validate that show and hide selection values match the expected values",
          "tags": "P3",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "drawingTool",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/drawingTool.test.js",
      "testcase": [
        {
          "id": "TST_DRAW_TC_1",
          "description": "Validate that drawing tool (pen) draw line based on selected pen color & width",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_2",
          "description": "Validate clicking on the Pen color opens pen color options",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_3",
          "description": "Validate that clicking on the Pen width opens the pen width options",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_4",
          "description": "Validate that Eraser tool clicked and erased expected line ",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_5",
          "description": "Validate that Undo function works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_6",
          "description": "Validate that Redo function works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_7",
          "description": "Validate that Presentation mode is clickable and active",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_8",
          "description": "Validate that all drawing tool data matches expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_9",
          "description": "Validate that the highlighter tool clicked and highlight the expected area ",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_10",
          "description": "Validate that the user is able to select Green color from available pen colors",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_11",
          "description": "Validate that blue pen color is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_12",
          "description": "Validate that red pen color is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_13",
          "description": "Validate that black pen color is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_14",
          "description": "Validate that the user is able to select pen stroke width 4 from available width options",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_15",
          "description": "Validate that pen stroke width 3 is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_16",
          "description": "Validate that pen stroke width 2 is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_17",
          "description": "Validate that pen stroke width 1 is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_18",
          "description": "Validate that highlighter draw data is captured in localStorage",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_19",
          "description": "Validate that Pen draw data is captured in localStorage",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_20",
          "description": "Validate that drawing data is cleared from localStorage after erasing all items",
          "tags": "P3",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "appShell",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/appShell.test.js",
      "testcase": [
        {
          "id": "TST_APPS_TC_1",
          "description": "Click on prod drop down",
          "tags": "P1"
        },
        {
          "id": "TST_APPS_TC_2",
          "description": "Click Log out button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Settings",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/settings.test.js",
      "testcase": [
        {
          "id": "TST_SETT_TC_1",
          "description": "Validate that Profile tab is selected by default when settings page is launched",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_2",
          "description": "Validate that clicking on Profile tab launches Profile page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_3",
          "description": "Validate that clicking on Password tab launches Password page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_4",
          "description": "Validate that clicking on Accessibility tab launches Accessibility page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_5",
          "description": "Validate the content of Profile tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_6",
          "description": "Validate the content of Password tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_7",
          "description": "Validate the content of Accessibility tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_8",
          "description": "Validate that email ID textbox is not editable",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_9",
          "description": "Validate that user can modify the First name.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_10",
          "description": "Validate that user can modify the Last name",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_11",
          "description": "Validate that user can select country from the drop down suggestions",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_12",
          "description": "Validate that clicking on cross button clears the country name from the text box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_13",
          "description": "Validate the error message if First name is left blank",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_14",
          "description": "Validate the error message if Last name is left blank",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_15",
          "description": "Validate that user can update the Password",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_16",
          "description": "Validate the error messages if all Password textboxes are left blank",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_17",
          "description": "Validate the message if Current Password is incorrect",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_18",
          "description": "Validate the error message if New Password and Confirm Passwords do not match",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_19",
          "description": "Validate clicking on toggle password eye button displays the Password",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_23",
          "description": "Validate that font size of the application is updated when the Font Size is increased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_24",
          "description": "Validate that font size of the application is updated when the Font Size decreased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_25",
          "description": "Validate that Line Spacing of the application is updated when the Line Spacing is increased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_26",
          "description": "Validate that Line Spacing of the application is updated when the Line Spacing is decreased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_27",
          "description": "Validate that High contrast theme is applied in the application when High Contrast is toggled ON.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_28",
          "description": "Validate that OpenDyslexic Font is applied in the application when OpenDyslexic Font is toggled ON.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_29",
          "description": "Validate that Underline Links are applied in the application when Underline Links is toggled ON.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_37",
          "description": "Validate that clicking on Apply Settings updates the application on the basis of settings modified.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_40",
          "description": "Validate that clicking on Confirm button on Reset Default Settings Modal resets the applied settings to default behavior.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_54",
          "description": "Validate that clicking on Reset Default Settings button Reset Default Settings pop up is launched.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_55",
          "description": "Validate that clicking on Billing tab launches Billing page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_56",
          "description": "Validate the content of Billing tab for a free user.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_57",
          "description": "Validate the content of Billing tab for a Premium user.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_58",
          "description": "Validate clicking on Upgrade plan button for a free user launches Select a plan page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_59",
          "description": "Validate clicking on Manage plan button launches Plan options page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_60",
          "description": "Validate clicking on Change card button launches Plan options page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_61",
          "description": "Validate clicking on Update button on Billing Information card launches Plan options page.",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Flipbook",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/flipbook.test.js",
      "testcase": [
        {
          "id": "TST_FLIP_TC_1",
          "description": "Validate that flipbook is launched (Desktop)",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_2",
          "description": "Validate Clicking on single page launches the book in single page layout",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_3",
          "description": "Validate clicking on the Notes button for a new flipbook launches Notes pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_4",
          "description": "Validate that clicking on 'Add Note' button launches Add Note Text Area",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_5",
          "description": "Validate on clicking Save button, notes set by the user are saved",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_6",
          "description": "Click Close button in notes pane closes the pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_7",
          "description": "Validate clicking on the Bookmark button for a new flipbook launches Bookmark pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_8",
          "description": "Validate that clicking on 'Bookmark This Page' button launches bookmark text area",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_9",
          "description": "Validate on clicking Save button, bookmarks set by the user are saved",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_10",
          "description": "Click Close button in Bookmark pane closes the pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_11",
          "description": "Validate clicking on the Notes button with already notes added launches the notes list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_12",
          "description": "Validate clicking on the Edit button, launches the edit notes textarea",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_13",
          "description": "Notes - Validate clicking on the Delete button, launches the delete notes modal",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_14",
          "description": "Validate clicking on the Bookmarks button with already Bookmarks added launches the Bookmarks list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_15",
          "description": "Validate clicking on the Edit button, launches the edit Bookmarks textarea",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_16",
          "description": "Validate clicking on the Delete button, launches the delete Bookmarks modal",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_17",
          "description": "Bookmark - Validate clicking on the Delete button, directly deletes the bookmark and launches list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_18",
          "description": "Validate that clicking on the Zoom in button increases the width and height of the image",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_19",
          "description": "Validate that clicking on the Zoom Out button decreases the width and height of the image",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_20",
          "description": "Validate that clicking on TOC button, launches the TOC layover",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_21",
          "description": "Validate entering the page number in input label after clicking the input field in TOC",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_22",
          "description": "Validate clicking on Jump to page button lauches the entered page in flipbook",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_23",
          "description": "Validate if the page contains any hotlink or not",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_24",
          "description": "Validate that clicking on a hotlink activates it",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Browse",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/browse.test.js",
      "testcase": [
        {
          "id": "TST_GLOB_TC_10",
          "description": "Validate that the resources are displayed on clicking the Interactive Activities tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_11",
          "description": "Validate that the resources are displayed on clicking the Videos tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_12",
          "description": "Validate that the resources are displayed on clicking the Online Classes tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_13",
          "description": "Validate that the resources are displayed on clicking the Teacher Training tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_14",
          "description": "Validate that the resources are displayed on clicking the Today in Class tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_15",
          "description": "Validate that the resources are displayed on clicking the Projectable tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_16",
          "description": "Validate content in Browse page",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_19",
          "description": "Validate that clicking on a page number in a non categorized view displays the next list of resources.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_20",
          "description": "Validate that clicking on next arrows in a non categorized view displays the list of resources.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_21",
          "description": "Validate that clicking on previous arrows in a non categorized view displays the list of resources.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_22",
          "description": "Validate that clicking on 3 dot options for a resource displays a list of options available for the resource.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_23",
          "description": "Validate clicking on View on 3 dot options launches the resource.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_24",
          "description": "Validate that clicking on Add to playlist on 3 dot options lists the existing playlists and option to create a new playlist.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_25",
          "description": "Validate that clicking on the playlist name adds the resource to the playlist.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_26",
          "description": "Validate that clicking on the resource image launches the resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_28",
          "description": "Validate that searching can be done on basis of resource name",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_36",
          "description": "Validate that No Result Found is displayed in the drop down suggestion and in the screen when no resource matching the search criteria is fulfilled",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_37",
          "description": "Validate that clicking on a resource from the search suggestion drop down list launches the resource.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_37",
          "description": "Validate that clicking on a resource from the search suggestion drop down list launches the resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_38",
          "description": "Validate that clicking on 'More search results for ..xyz' lists the resources based on search text.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_41",
          "description": "Validate that clicking on close serach button removes the search criteria",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_42",
          "description": "Validate clicking on Filters displays the list of filter categories.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_53",
          "description": "Validate that clicking on cross icon on Filters screen closes the filter pop up.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_57",
          "description": "Validate the content of add book page launched from Dashboard",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_58",
          "description": "Validate that clicking on '+' button adds the book to My Books",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_59",
          "description": "Validate that clicking on the book image launches the book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_60",
          "description": "Validate that clicking on the View button launches the book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_61",
          "description": "Validate the content of books page launched from Browse",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_62",
          "description": "Validate that clicking on more options button displays a list of options available for a book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_63",
          "description": "Validate that clicking on View Classes option launches Class Drawer",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_64",
          "description": "Validate that clicking on Add to My Books adds the book to My Books and display a snackbar message",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_65",
          "description": "Validate that clicking on Open flipbook launches the flipbook associated with the book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_66",
          "description": "Validate that clicking on Remove from My Books launches a pop up with label 'Remove from My Books?'",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_67",
          "description": "Validate that clicking on 'Cancel' in dialog box retains the book in 'My Books'",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_68",
          "description": "Validate that clicking on 'Remove' in dialog box removes the book from 'My Books'",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_69",
          "description": "Validate that clicking on Create New Class launches create class workflow where book is added to Class Books",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_70",
          "description": "Validate that searching a text lists maximum 5 suggestions matching the search text",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_71",
          "description": "Validate Book added in the Family is available in correct Family on browse page",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_72",
          "description": "Validate the book which is not added in Family in available in Other Books",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_73",
          "description": "Validate that clicking on View All button shows all books of a family",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_75",
          "description": "Validate on Book tab, user is able to search book family name and clicking on it launch the book family page",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_76",
          "description": "Validate that on Book tab, in search results, Family name is displayed below book name and description",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_77",
          "description": "Validate that on Book tab, Clicking Show More Books button loads the more books in 'Other book' section",
          "tags": "",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Playlist",
      "moduleId": "TST_PLIS",
      "testFile": "./test/ExperienceApp/playlist.test.js",
      "testcase": [
        {
          "id": "TST_PLIS_TC_1",
          "description": "Validate the content of the playlist page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_2",
          "description": "Validate that clicking on the three dots launches a dropdown list of options",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_3",
          "description": "Validate that clicking on 'Edit' button launches the Playlist pop up",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_4",
          "description": "Validate that clicking on 'Delete' button launches the Delete confirmation pop up",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_5",
          "description": "Validate that playlist name is updated on clicking 'Save' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_6",
          "description": "Validate that playlist name is not updated on clicking 'Cancel' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_7",
          "description": "Validate that clicking 'Delete' button on pop up deletes the playlist",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_8",
          "description": "Validate that playlist is not deleted on clicking 'Cancel' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_9",
          "description": "Validate that clicking on 'Browse All Resources' navigates to the 'Interactive Activities' in Browse Tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_10",
          "description": "Validate clicking on 3 dots on any resource on the playlist page launches a dropdown list of options",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_11",
          "description": "Validate clicking on Remove from playlist option launches the remove resource popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_12",
          "description": "Validate that clicking 'Remove' button on pop up removes the resource from the playlist",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_13",
          "description": "Validate that clicking 'Cancel' button on pop up does not remove the resource from the playlist",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Writing Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/writingPlayer.test.js",
      "testcase": [
        {
          "id": "TST_ITEM_WRITING_TC_1",
          "description": "Validate that user is able to add text in the editable text area",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_2",
          "description": "Validate that attach file dialog opens on selecting Browse from Computer option in attach dropdown",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_3",
          "description": "Validate that user is able to attach the file less than 100 mb",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_4",
          "description": "Validate that remove dialog appears when user tries to remove the attachment",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_5",
          "description": "Validate that file is removed on clicking yes in the remove dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_6",
          "description": "Validate that file is not removed on clicking no in the remove dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_7",
          "description": "Validate that max. file size dialog is displayed if user tries to attach file greater than 100 mb",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Voice Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/voicePlayer.test.js",
      "testcase": [
        {
          "id": "TST_ITEM_VOICE_TC_1",
          "description": "Validate clicking on Record button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_2",
          "description": "Validate clicking on Pause button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_3",
          "description": "Validate clicking on Continue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_4",
          "description": "Validate the countdown starts for the last 15 seconds",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_5",
          "description": "Validate the scenario when recording time limit is reached",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_7",
          "description": "Validate clicking on Done button after time limit is reached",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_10",
          "description": "Validate clicking on Re-record button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_11",
          "description": "Validate clicking on Re-record dialog 'No' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_12",
          "description": "Validate clicking on Re-record dialog 'Yes' button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Download Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/downloadPlayer.test.js",
      "testcase": [
        {
          "id": "TST_DOWN_TC_1",
          "description": "Validate that clicking on the download button downloads the resource file",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_2",
          "description": "Validate the content of download player for Word resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_3",
          "description": "Validate the content of download player for ZIP resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_4",
          "description": "Validate the content of download player for PDF resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_5",
          "description": "Validate the content of download player for Spreadsheet resource",
          "tags": "P1, Desktop",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Content Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/contentPlayer.test.js",
      "testcase": [
        {
          "id": "TST_CONT_TC_1",
          "description": "Validate that video player is launched on clicking the video activity",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_2",
          "description": "Validate that audio player is launched on clicking the audio activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_3",
          "description": "Validate that etext is launched on clicking the etext activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_4",
          "description": "Validate that html webbook is launched on clicking the html webbook activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_5",
          "description": "Validate that page is scrolled to top on clicking the scroll to top button",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_6",
          "description": "Validate that video player with transcript is launched on clicking the video with subtitles activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_7",
          "description": "Validate that audio player with transcript is launched on clicking the audio with subtitles activity",
          "tags": "P1, Desktop",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentListTeacher.test.js",
      "testcase": [
        {
          "id": "TST_ASSLIST_TC_1",
          "description": "Validate the content of Blank create assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_2",
          "description": "Validate the Click on Add new Button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_3",
          "description": "Validate the Click on Component Name",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_4",
          "description": "Validate the click on create assignment page on inbox tab",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_5",
          "description": "Validate the data of assignment card on assignment details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_6",
          "description": "Validate the click on assignment card",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_7",
          "description": "Validate the Data of assignment List Page when assignment is added",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_8",
          "description": "Validate the Click on the more option of assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_9",
          "description": "Validate the Click on the Delete Lable of assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_10",
          "description": "Validate the Click on in progress Arrow",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_11",
          "description": "Validate the click on cancel button of delete dialogue",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_12",
          "description": "Validate the click on dev's Material btn from the component list",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/selectActivity.test.js",
      "testcase": [
        {
          "id": "TST_SLCTACTIVITY_TC_1",
          "description": "Validate the data on select activity Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_SLCTACTIVITY_TC_2",
          "description": "Validate the click on checkbox of parent folder of component",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_SLCTACTIVITY_TC_3",
          "description": "Validate the click on continue button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_SLCTACTIVITY_TC_4",
          "description": "Validate the click on checkbox of  activity of a component",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/createAssignment.test.js",
      "testcase": [
        {
          "id": "TST_CREATEASS_TC_1",
          "description": "Validate the update of assignment name in alpha numeric character",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_2",
          "description": "Validate the click of assign button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_3",
          "description": "Validate the click on confirm assignmeent on submit assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_4",
          "description": "Validate the content of create assignment Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_5",
          "description": "Validate the click on cancel button create assignment Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_6",
          "description": "Validate the click of show advanced option",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentDetails.test.js",
      "testcase": [
        {
          "id": "TST_ASSDETAILS_TC_1",
          "description": "Validate the content of assignment details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_2",
          "description": "Validate the click on more option of assignment details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_3",
          "description": "Validate the click on delete assignment from the list",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_4",
          "description": "Validate the click on delete button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_5",
          "description": "Validate the click on Edit Assignment Label",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_6",
          "description": "Validate the Assignment Title Update",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_7",
          "description": "Validate the click on save and close button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_8",
          "description": "Validate the click on Clone Label button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_9",
          "description": "Validate the update on the name textbox",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_10",
          "description": "Validate the select on class name",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_11",
          "description": "Validate the Click on View As student button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_12",
          "description": "Validate the View as Student Page Data",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_13",
          "description": "Validate the close on student View Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_14",
          "description": "Validate the clck of cancel button on edit assignment page",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentListDetails.test.js",
      "testcase": [
        {
          "id": "TST_ASSLISTDETAILS_TC_1",
          "description": "Validate the click on upcoming assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_2",
          "description": "Validate the click on past assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_3",
          "description": "Validate the click on in-progress assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_4",
          "description": "Validate the blank inprogress assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_5",
          "description": "Validate the blank upcoming assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_6",
          "description": "Validate the blank past assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_7",
          "description": "Validate the content of assignment list details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_8",
          "description": "validate the details of assignment card",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_9",
          "description": "validate the click on edit assignment button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_10",
          "description": "validate the click on clone assignment button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_11",
          "description": "validate the click on delete assignment button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_12",
          "description": "validate the click on view progress assignment button",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Student",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentStudentList.test.js",
      "testcase": [
        {
          "id": "TST_ASSLIST_STU_TC_1",
          "description": "Validate the content on blank Due assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_2",
          "description": "Validate the content on blank Upcoming assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_3",
          "description": "Validate the content on blank Completed assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_4",
          "description": "Validate the click on Due assignment tab on assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_5",
          "description": "Validate the click on Upcoming assignment tab on assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_6",
          "description": "Validate the click on Completed assignment tab on assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_7",
          "description": "Validate the content of student assignment list details page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_8",
          "description": "Validate the details of assignment list",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_9",
          "description": "Validate the click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_10",
          "description": "Validate the click on any activity",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_13",
          "description": "Validate the data after click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "GradeBook",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/gradeBook.test.js",
      "testcase": [
        {
          "id": "TST_GRADEBOOK_TC_1",
          "description": "Validate the GradeBook Page is launched",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_2",
          "description": "Validate the content on Blank GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_3",
          "description": "Validate the content on GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_4",
          "description": "Validate the Product List in GradeBook",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_5",
          "description": "Click on student gradebook is launched after clicking on gradebook button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_6",
          "description": "Validate the Student List in GradeBook",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_7",
          "description": "Validate that clicking on 'Download' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_8",
          "description": "Validate that clicking on 'Send to email' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_9",
          "description": "Validate the content on Student View GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_10",
          "description": "Validate the Unit Details of a book (Scorable)",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_11",
          "description": "Validate the click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_12",
          "description": "Validate the click on 'More options' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_13",
          "description": "Validate the click on Product button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_14",
          "description": "Validate the click on View Attempt button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_15",
          "description": "Validate the click on Cancel button on  View Attempt Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_16",
          "description": "Validate the click on 'Class Copy Code' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_17",
          "description": "Validate the click on 'Invie Email' button",
          "tags": "P2",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "GradeBook-student",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/gradeBookStudent.test.js",
      "testcase": [
        {
          "id": "TST_STU_GRADEBOOK_TC_1",
          "description": "Validate the GradeBook Page is launched",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_2",
          "description": "Validate the Product List in GradeBook",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_3",
          "description": "Validate that clicking on 'Download' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_4",
          "description": "Validate that clicking on 'Send to email' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_5",
          "description": "Validate the content on Student View GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_6",
          "description": "Validate the Unit Details of a book (Scorable)",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_7",
          "description": "Validate the click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_8",
          "description": "Validate the click on Product button",
          "tags": "P2",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "Open Activity Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/openActivityPlayer.test.js",
      "testcase": [
        {
          "id": "TST_OPEN_TC_1",
          "description": "Validate the writing question in unattempted state for student",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_2",
          "description": "Validate the writing question in attempted state (not graded) for student",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_3",
          "description": "Validate the writing question in graded state for student",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_4",
          "description": "Validate that clicking on Submit Answers displays Submit dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_6",
          "description": "Validate that clicking on Cancel button does not submit the student response",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_11",
          "description": "Validate the writing question in grading state for teacher",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_12",
          "description": "Validate that clicking on submit grade button without entering the score shows error message",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_13",
          "description": "Validate that confirmation dialog appears on clicking submit button after entering score, feedback and reattempt request as no",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_14",
          "description": "Validate that confirmation dialog appears on clicking submit button after entering score, feedback and reattempt request as yes",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_16",
          "description": "Validate that clicking on cancel button does not complete the grading of the activity",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_23",
          "description": "Validate that snackbar message appears on clicking Save Answers button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_24",
          "description": "Validate the writing question in unattempted state for Assignment",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Library",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/libraryEditor.test.js",
      "testcase": [
        {
          "id": "TST_ICCE_TC_1",
          "description": "Validate the click on Quiz Header",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_2",
          "description": "Validate the click on Multiple Choice button on the Question selection page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_3",
          "description": "Validate the click on text button on the Question selection page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_4",
          "description": "Validate clicking on Finish button in Quiz",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_5",
          "description": "Validate clicking on Duplicate Question button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_6",
          "description": "Validate clicking on Delete  button on the delete question dialogue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_7",
          "description": "Validate clicking on Cancel  button on the delete question dialogue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_8",
          "description": "Validate clicking on Delete Question button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_9",
          "description": "Validate the add the text in question title",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_11",
          "description": "Validate user is able to add In this Activity text",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_12",
          "description": "Validate the click on Add Media button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_13",
          "description": "Validate the click on add prompt text button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_14",
          "description": "Validate clicking on Image button in Prompt media",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_17",
          "description": "Validate user is able to add image in Prompt image using Browse button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_18",
          "description": "Validate enter textarea in the image on browser popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_19",
          "description": "Validate enter alternative text in the image on browser popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_21",
          "description": "Validate the add the text in prompt text box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_31",
          "description": "Validate the click on Sub question skeleton",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_32",
          "description": "Validate user is able to add subquestion title text",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_33",
          "description": "Validate user is able to update option text",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_34",
          "description": "Validate the click on Sub Question button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_35",
          "description": "Validate the click on add option",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_36",
          "description": "Validate user is able to make any answer option correct using Mark Correct button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_37",
          "description": "Validate user is able to click on Left Arrow button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_40",
          "description": "Validate the click on New Questioon button in Footer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_41",
          "description": "Validate the click on Multiple Question button in Footer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_42",
          "description": "Validate the click on text Question button in Footer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_45",
          "description": "Validate the click student will answer here sceleton",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_46",
          "description": "Validate the click on Long Answer button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_47",
          "description": "Validate the click on File Upload button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_48",
          "description": "Validate clicking on Done button on \"close\"  icon in Add to Class dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_49",
          "description": "Validate clicking on I agree checkbox in Finish quiz dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_50",
          "description": "Validate the click on confirm Finish Button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_52",
          "description": "Validate the Editor Quiz Selection Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_54",
          "description": "Validate the Content of delete question dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_60",
          "description": "Validate user is able to edit Quiz name on New Question Get Started page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_61",
          "description": "Validate the Add to Class button when class is available",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_62",
          "description": "Validate the Page Header when click on Edit button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_63",
          "description": "Validate the Click on Add to Class button after Finish Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_64",
          "description": "Validate the Content of new Access Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_65",
          "description": "Validate the Content of Sub menu data",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_66",
          "description": "Validate the Header on Preview Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_67",
          "description": "Validate the Click on Preview Option",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_68",
          "description": "Validate the Click on Submenu Option",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_69",
          "description": "Validate the Click on duplicate Option in submenu list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_70",
          "description": "Validate the Click on delete Option in submenu list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_71",
          "description": "Validate the Click on Preview Close button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_72",
          "description": "Validate the Click on close left drawer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_73",
          "description": "Validate the Click on Bread Crumb Back button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_74",
          "description": "Validate the Click on Editor Dismiss button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_75",
          "description": "Validate the Click on delete button on the quiz delete dialogue box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_75",
          "description": "Validate the Click on delete button on the quiz delete dialogue box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_76",
          "description": "Validate the Click on Cancel button on the quiz delete dialogue box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_77",
          "description": "Validate the Add to Class button when no class is available",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_78",
          "description": "Validate the Click on Edit button on the Published Quiz Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_79",
          "description": "Validate the Click on View As Student button on the Published Quiz Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_80",
          "description": "Validate the Click on close Icon on View As Student Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_81",
          "description": "Validate the Click on close Icon on Edit Material Dialogue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_82",
          "description": "Validate the Click on close Icon on New Access Dialogue  button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_83",
          "description": "Validate the Click on Continue to Edit button Edit Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_84",
          "description": "Validate the Content of Edit Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_85",
          "description": "Validate the Click on Cancel button Edit Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_86",
          "description": "Validate the Selection of Class on New Access Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_87",
          "description": "Validate the Click on Add Now button on New Access Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_88",
          "description": "Validate the Content of Quiz Added Successfully Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_89",
          "description": "Validate the Content of new Access Page when Class is avialable",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_90",
          "description": "Validate the Content of new Access Page when Class is avialable",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_91",
          "description": "Validate the Header of Published Quiz Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_92",
          "description": "Validate the Edit Dialogue box when activity is already added in class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_93",
          "description": "Validate the Edit Dialogue box when activity is not  added in class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_94",
          "description": "Validate the Click on Remove Access of a class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_95",
          "description": "Validate the Content of Remove Access Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_96",
          "description": "Validate the Content of Removed Successfully Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_97",
          "description": "Validate the click on Remove anyway button on the Remove Access Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_98",
          "description": "Validate the click on Done button on the Remove Access Successfully Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_99",
          "description": "Validate the content of Add to Class Page after adding the quiz in a class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_100",
          "description": "Validate the click on help icon on editor Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_101",
          "description": "Validate the click on take editor option in help submenu list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_102",
          "description": "Validate the click on show details button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_103",
          "description": "Validate the content of the show details page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_104",
          "description": "Validate the click on hide details button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "SignUp",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/signUp.test.js",
      "testcase": [
        {
          "id": "TST_SNUP_TC_1",
          "description": "Validate the content of signup page, where user enter the email details",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_2",
          "description": "Validate the error message when no email is entered",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_3",
          "description": "Validate the error message when wrong email format is added",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_4",
          "description": "Validate the error message when existing user email id is entered",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_5",
          "description": "Validate clicking on 'Signup with Email' button",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_6",
          "description": "Validate clicking on 'Google' button for signup",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_7",
          "description": "Validate clicking on 'facebook' button for signup",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_9",
          "description": "On signup page, Validate clicking on 'logIn' button",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_10",
          "description": "Validate the  selecting 'I'm teacher' on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_11",
          "description": "Validate the selecting 'I'm Student' on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_12",
          "description": "Validate the click of continue button after selecting teacher on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_13",
          "description": "Validate the click of continue button after selecting student on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_14",
          "description": "Validate the error message without selecting any teacher/student",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_16",
          "description": "Validate the Click on 'Back to Sign in' on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_17",
          "description": "Validate the application content of 'Account Details' page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_19",
          "description": "Validate the email id on 'Account Details' page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_20",
          "description": "Validate the error message of password, When Password have less than 8 character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_21",
          "description": "Validate the error message of password, When Password have all upper case character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_22",
          "description": "Validate the error message of password, When Password have all lower case character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_23",
          "description": "Validate the error message of password, When Password have not any special character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_24",
          "description": "Validate the error message of each textbox on Account details page when each textbox is blank",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_25",
          "description": "Validate the error message when password  is not same with confirm passord",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_31",
          "description": "Validate the click on eye button of password after entering the password",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_32",
          "description": "Validate the click on eye button of Confirm password before entering the password",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_37",
          "description": "Validate the country is selected from dropdown",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_39",
          "description": "Validate the click on 'back Role Selection' on Account Details Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_54",
          "description": "Validate the content of Role selection page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_55",
          "description": "Validate clicking on Privacy Policy link launch the pop up with Privacy Policy tab selected",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_56",
          "description": "Validate clicking on Terms of use link launch the pop up with Privacy Policy tab selected",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_57",
          "description": "Validate clicking on I Agree button on policy page select the policy checkbox on Account Details page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_58",
          "description": "Validate clicking on Cancel button on policy page do not select the policy checkbox on Account Details page",
          "tags": "",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "Library",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/library.test.js",
      "testcase": [
        {
          "id": "TST_ICCL_TC_1",
          "description": "Validate clicking on Blank Quiz button on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_2",
          "description": "Validate clicking on Blank survey button",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_3",
          "description": "Validate clicking on New Resource button",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_4",
          "description": "Validate the scenario when no material is added in the Library for new user",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_5",
          "description": "Validate the content for No material when recent material time has elapsed",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_6",
          "description": "Validate clicking on View All Materials launch the My Materials page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCL_TC_7",
          "description": "Validate Material card are displayed based on Modified date on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_8",
          "description": "Validate the lazy loading on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_9",
          "description": "Validate Modified time is displayed on every Material card of present day on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_10",
          "description": "Validate Modified date is displayed on Material card of old date",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_11",
          "description": "Validate the card for Draft Material",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_12",
          "description": "Validate the Card for Finalized Material",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_13",
          "description": "Validate clicking on Draft Material Card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_14",
          "description": "Validate clicking on \"Edit Draft\" button",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_15",
          "description": "Validate clicking on Finalized Material Card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_16",
          "description": "Validate clicking on Ellipses on Draft Material card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_17",
          "description": "Validate clicking on Ellipses on Finalized Material card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_18",
          "description": "Validate clicking on Preview button in Ellipses for Draft quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_19",
          "description": "Validate clicking on Preview button in Ellipses for Blank Quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_20",
          "description": "Validate clicking on Delete button in Ellipses on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_21",
          "description": "Validate clicking on Cancel button in Delete Materials Dialog on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_22",
          "description": "Validate clicking on Delete button in Delete Materials Dialog on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_23",
          "description": "Validate items are removed from Library page list after recent days count are elapsed",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_24",
          "description": "Validate clicking on Add to Class button on Material card from Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_25",
          "description": "Validate the scenario of selecting a class and clicking on Add Now button in Add to Class dialog from Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_26",
          "description": "Validate clicking on Edit button in Ellipses for Published quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_27",
          "description": "Validate clicking on Duplicate button in Ellipses for Published quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_28",
          "description": "Validate clicking on Duplicate button in Ellipses for Draft quiz on Library page",
          "tags": "",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Experience App > ICC > My Materials",
      "moduledetails": "",
      "testFile": "./test/ExperienceApp/myMaterials.test.js",
      "testcase": [
        {
          "id": "TST_ICCM_TC_2",
          "description": "Validate the All tabs when no material is present on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_3",
          "description": "Validate the Draft tabs when no material is present on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_4",
          "description": "Validate the Published tabs when no material is present on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_5",
          "description": "Validate clicking on \"Blank Quiz\" button when no item is present on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_6",
          "description": "Validate clicking on \"Add New Material\" button on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_7",
          "description": "Validate clicking on \"Blank Quiz\" button from dropdown menu on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_8",
          "description": "Validate clicking on \"Blank Survey\" button from dropdown menu on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_9",
          "description": "Validate clicking on \"New Resource\" button from dropdown menu on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_10",
          "description": "Validate the tabs on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_11",
          "description": "Validate clicking on Drafts tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_12",
          "description": "Validate clicking on Published tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_13",
          "description": "Validate the lazy loading on My materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_14",
          "description": "Validate the default sorting on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_15",
          "description": "Validate clicking on Materials sort arrow",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_16",
          "description": "Validate the scenario if user sort 10 visible result and then load other Materials",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_17",
          "description": "Validate clicking on Last Modified sort arrow",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_18",
          "description": "Validate clicking on ellipses with Draft Material on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_19",
          "description": "Validate clicking on ellipses with Published Material on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_20",
          "description": "Validate clicking on Preview button in Ellipses for Draft quiz on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_21",
          "description": "Validate clicking on Preview button in Ellipses for Blank Quiz on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_22",
          "description": "Validate clicking on Edit button in Ellipses for published quiz on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_23",
          "description": "Validate clicking on Delete button in Ellipses on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_24",
          "description": "Validate clicking on Cancel button in Delete Materials Dialog",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_25",
          "description": "Validate clicking on Delete button in Delete Materials Dialog",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_26",
          "description": "Validate the search scenario when no result is found",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_27",
          "description": "Validate the partial search on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_28",
          "description": "Validate the exact search on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_29",
          "description": "Validate search for special character - all keyboard characters",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_30",
          "description": "Validate search for spanish characters",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_31",
          "description": "Validate if search data is retained if user switch tabs",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_32",
          "description": "Validate search scenarios in Draft tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_33",
          "description": "Validate search scenarios in Published tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_34",
          "description": "Validate the scenario if user delete a material and then search it",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_35",
          "description": "Validate clicking on cross icon clears the search results",
          "tags": "",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "ICC Assignment and Class data",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/iccAssignment.test.js",
      "testcase": [
        {
          "id": "TST_ICCA_TC_3",
          "description": "Validate the click on more option of activity name",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_4",
          "description": "Validate the click on the Edit button of activity more option list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_5",
          "description": "Validate the click on the restricted/public button of activity more option list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_6",
          "description": "Validate the click on the Assign button of activity more option list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_17",
          "description": "Validate the click on the Material checkbox value.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_22",
          "description": "Validate the continue details page on the select activity page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_24",
          "description": "Validate the Activities data on dev Material page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_25",
          "description": "Validate the Activities data on dev Material page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_31",
          "description": "Validate the click on yes button on make restricted/public popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_33",
          "description": "Validate the content on make restricted popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_34",
          "description": "Validate the content on make public popup",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Editor Tour",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/editorTour.test.js",
      "testcase": [
        {
          "id": "TST_ICCT_TC_1",
          "description": "Validate that editor tour is launched when user creates first question in a quiz in a login session",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_2",
          "description": "Validate that editor tour is closed on clicking dismiss button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_3",
          "description": "Validate that editor tour does not launch when user add another question of same type",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_4",
          "description": "Validate that editor tour does not launch when user creates first question in another quiz in a login session",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_5",
          "description": "Validate that first prompt appears on clicking Start Tour button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_6",
          "description": "Validate that tour exits on clicking exit button in the first prompt",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_7",
          "description": "Validate that next prompt appears on clicking next button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_8",
          "description": "Validate that previous prompt appears on clicking back button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_9",
          "description": "Validate that tour exits on clicking exit button in the last prompt",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_10",
          "description": "Validate that dont show again checkbox is selected on clicking the checkbox",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_11",
          "description": "Validate that editor tour does not launch when user creates first question in a quiz in a new login session if dont show checkbox is checked",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_12",
          "description": "Validate the content of the start tour dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_13",
          "description": "Validate the content of the mcq editor tour",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_14",
          "description": "Validate the content of the text editor tour",
          "tags": "P1",
          "visualTest": true
        }
      ]
    }
  ]
}
===
{
  "appname": "comproDLS Engage",
  "appdetails": "",
  "selectorFile": "./testResources/selectors/ExperienceApp/C1Selectors.json",
  "modules": [
    {
      "modulename": "Validation of Notes VHL Functionality",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/notesVhlTest.test.js",
      "testCaseRepo": "./testResources/testcaseRepository/ExperienceApp/C1TCRepository.json",
      "testcase": [
        {
          "id": "TST_VHLN_TC_1",
          "description": "Click Note Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_2",
          "description": "Click Dock Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_3",
          "description": "Click All Pages Tab",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_4",
          "description": "Click Page Cover Tab",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_5",
          "description": "Click on Add Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_6",
          "description": "Set Notes Text",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_7",
          "description": "Click on Save Notes",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_8",
          "description": "Check Notes text",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_9",
          "description": "Click on Delete Notes Btn",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_10",
          "description": "Click on Delete Notes Btn Confirmation",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLN_TC_11",
          "description": "Click Close Button",
          "tags": "P1",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Validation of VLOGle File Page",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/vhlLoginTest.test.js",
      "testCaseRepo": "./testResources/testcaseRepository/ExperienceApp/C1TCRepository.json",
      "testcase": [
        {
          "id": "TST_VLOG_TC_1",
          "description": "Check vhl Login Test is Initialized",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_2",
          "description": "Enter Username",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_3",
          "description": "Enter Password",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_4",
          "description": "Click on Login Button",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VLOG_TC_5",
          "description": "Validate Data fetched from Login Page",
          "tags": "P1",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Validation of VHL Highlighter Functionality",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/vhlhighlighter.test.js",
      "testCaseRepo": "./testResources/testcaseRepository/ExperienceApp/C1TCRepository.json",
      "testcase": [
        {
          "id": "TST_VHLH_TC_1",
          "description": "Click iconSvg1",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_2",
          "description": "Click eraserButton",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_3",
          "description": "Click highlighterBtn",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_4",
          "description": "Click closeIcon",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_VHLH_TC_5",
          "description": "Click RemoveAllBtn",
          "tags": "P1",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Footer",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/footer.test.js",
      "testcase": [
        {
          "id": "TST_FOOT_TC_1",
          "description": "Validate Terms of Use page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_2",
          "description": "Validate Privacy Notice page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_3",
          "description": "Validate Accessibility page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_4",
          "description": "Validate Our Approaches page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_5",
          "description": "Validate Site Feedback page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_6",
          "description": "Validate FAQs page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_7",
          "description": "Validate Cambridge One School page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_8",
          "description": "Validate Help page is launched correctly",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FOOT_TC_9",
          "description": "Validate footer data is displayed correctly",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "commonActivity",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/commonActivity.test.js",
      "testcase": [
        {
          "id": "TST_COMM_TC_1",
          "description": "Validate that the activityAnsCheck button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_2",
          "description": "Validate that the activityNext button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_3",
          "description": "Validate that the activityClose button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_4",
          "description": "Validate that the activityStartAgain button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_5",
          "description": "Validate that the activityExit button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_COMM_TC_6",
          "description": "Validate the data for commonActivity buttons",
          "tags": "P3",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Landing",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/landing.test.js",
      "testcase": [
        {
          "id": "TST_LAND_TC_1",
          "description": "Validate that the landing page appears on launching the URL",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_2",
          "description": "Validate that the sign up page is launched on clicking the 'Sign Up & Start Learning Today' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_3",
          "description": "Valid in' butate that the sign in page is launched on clicking the 'Logton",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_4",
          "description": "Validate that user is able to change the language of the page from the language drop down",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_LAND_TC_5",
          "description": "Validate the content of the landing page (in English)",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Login",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/login.test.js",
      "testcase": [
        {
          "id": "TST_IDEN_TC_2",
          "description": "Validate the content of Login page in English Language",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_1",
          "description": "Set User name value",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_4",
          "description": "Click on Forget Password",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_2",
          "description": "Set Password value ",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_LOGI_TC_5",
          "description": "Click Login button",
          "tags": "P1"
        },
        {
          "id": "TST_LOGI_TC_6",
          "description": "Click Sign Up button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_APPS_TC_1",
          "description": "Click Sign Up button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_APPS_TC_2",
          "description": "Click Sign Up button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "ResetPassword",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/resetPassword.test.js",
      "testcase": [
        {
          "id": "TST_RESE_TC_1",
          "description": "Reset Password Page initialized or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_2",
          "description": "Reset Password Button clicked or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_3",
          "description": "Enter Email Text clicked or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_4",
          "description": "Login Page is launched or not",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_RESE_TC_5",
          "description": "Get Data Reset Password",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "dashboard",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/dashboard.test.js",
      "testcase": [
        {
          "id": "TST_DASH_TC_1",
          "description": "Validate Dashboard page is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_2",
          "description": "Validate that the Help button is clickable on the Dashboard",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_3",
          "description": "Validate that the Progress button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_4",
          "description": "Validate that the Practice Extra button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_5",
          "description": "Validate that the selected eBook is launched",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DASH_TC_6",
          "description": "Validate that the Homework button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_7",
          "description": "Validate that the My Progress button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_8",
          "description": "Validate that the Dashboard data is retrieved correctly, including Help button status",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_9",
          "description": "Validate that active class buttons (Progress, Practice Extra, eBook, Homework, My Progress) are retrieved correctly",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_10",
          "description": "Validate that the Create New Class page is launched correctly",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DASH_TC_11",
          "description": "Validate if Active class page is launched correctly",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Create New  Class",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/createNewClass.test.js",
      "testcase": [
        {
          "id": "TST_ENTE_TC_1",
          "description": "Validate that the Create new class page is launched and initialized correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_2",
          "description": "Validate that the back button is clickable and the page is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_3",
          "description": "Validate that the class name is entered correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_4",
          "description": "Validate that the start date is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_5",
          "description": "Validate that the end date is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_6",
          "description": "Validate that the school name is entered correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_7",
          "description": "Validate that the cancel button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_8",
          "description": "Validate that the class details are fetched and match the expected data",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_9",
          "description": "Validate that the next button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_10",
          "description": "Validate that the cancel button in class materials is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_11",
          "description": "Validate that the add later button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_12",
          "description": "Validate that the dashboard button is clickable and navigates correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_13",
          "description": "Validate that the no keep button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_17",
          "description": "Validate that the yes cancel button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_18",
          "description": "Validate that the finish button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_19",
          "description": "Validate that the add to class button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_20",
          "description": "Validate that the eBook bundle button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_21",
          "description": "Validate that the add material input field is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_22",
          "description": "Validate that the add material button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ENTE_TC_23",
          "description": "Validate that the eBook bundle dropdown is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },

        {
          "id": "TST_CREA_TC_19",
          "description": "Validate that class data button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_20",
          "description": "Validate that Add students button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_21",
          "description": "Validate that adults radio button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_22",
          "description": "Validate that confirmation next button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_23",
          "description": "Validate that student email input field is set correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_24",
          "description": "Validate that invite student button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_CREA_TC_29",
          "description": "Validate newly added scenario for Create module - 29",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
   {
  "modulename": "C1 Assignment Page",
  "moduleId": "",
  "testFile": "./test/ExperienceApp/c1assignment.test.js",
  "testcase": [
    {
      "id": "TST_C1AS_TC_1",
      "description": "Click Class Heading",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_2",
      "description": "Click Assignments",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_3",
      "description": "Click Create Assignment",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_4",
      "description": "Click Practice Extra CQA",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_5",
      "description": "Click Unit 1",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_6",
      "description": "Click Lesson A",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_7",
      "description": "Click Next Button",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_8",
      "description": "Enter Assignment Name",
      "tags": "P2",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_9",
      "description": "Click Input Tag",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_10",
      "description": "Click Set Date",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_11",
      "description": "Click Select Student",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_12",
      "description": "Click View Summary",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_13",
      "description": "Click Assign",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_14",
      "description": "Click Kebab Icon",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_15",
      "description": "Click Delete Assignment",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_16",
      "description": "Click Yes on Delete Confirmation",
      "tags": "P3",
      "visualTest": true
    }
    ,{
      "id": "TST_C1AS_TC_17",
      "description": "Click view assignment",
      "tags": "P3",
      "visualTest": true
    }
    ,{
      "id": "TST_C1AS_TC_18",
      "description": "Click hamburger icon assignment",
      "tags": "P3",
      "visualTest": true
    }
     ,{
      "id": "TST_C1AS_TC_19",
      "description": "Click cross icon assignment",
      "tags": "P3",
      "visualTest": true
    }
     ,{
      "id": "TST_C1AS_TC_20",
      "description": "Click back icon assignment",
      "tags": "P3",
      "visualTest": true
    },
    {
      "id": "TST_C1AS_TC_14",
      "description": "Click Kebab Icon",
      "tags": "P3",
      "visualTest": true
    }
  ]
}
,
{
      "modulename": "C1 Student Assignment Page",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/c1student.test.js",
      "testcase": [
        {
          "id": "TST_C1ST_TC_1",
          "description": "Click Bell Icon",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_2",
          "description": "Click Assignment Notification",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_3",
          "description": "Click Route To Assignment",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_4",
          "description": "Click Open Hamburger Icon",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_5",
          "description": "Click Assignment Back",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_6",
          "description": "Click Close Sidebar",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_7",
          "description": "Click Go Back",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_C1ST_TC_8",
          "description": "Validate Assignment Student Data",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },

    {
      "modulename": "Delete Class",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/activeClass.test.js",
      "testcase": [
        {
          "id": "TST_ACTI_TC_1",
          "description": "Validate that the action button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_2",
          "description": "Validate that the delete class button is clickable and works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_3",
          "description": "Validate that the yes delete button is clickable and the page status is updated correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_4",
          "description": "Validate that the dropdown data matches the expected action button and delete class values",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_ACTI_TC_5",
          "description": "Validate that the delete modal data matches the expected yes delete button values",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },

    {
      "modulename": "invitationNotification",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/invitationNotification.test.js",
      "testcase": [
        {
          "id": "TST_INVI_TC_1",
          "description": "Validate that the Notification button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_2",
          "description": "Validate that the Invitation Notification is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_3",
          "description": "Validate that the Select Checkbox is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_4",
          "description": "Validate that the Accept button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_5",
          "description": "Validate that the Go To Dashboard button is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_INVI_TC_6",
          "description": "Validate that invitation notification data (Notification, Invitation, Checkbox, Accept, Go To Dashboard) is retrieved correctly",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },

    {
      "modulename": "timer",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/timer.test.js",
      "testcase": [
        {
          "id": "TST_TIME_TC_1",
          "description": "Validate that user is able to select timer Count up button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_2",
          "description": "Validate Under the Count down, user is able to clear the previously entered time",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_3",
          "description": "Validate Under the Count down, user is able to select Mute button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_4",
          "description": "Click the timer count down Close button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_5",
          "description": "Validate Under the Count down, user is able to Start count down",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_6",
          "description": "Validate Under the Count down, user is able to slecte timer button One",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_7",
          "description": "Validate Under the Count down, user is able to select timer button Two",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_8",
          "description": "Validate Under the Count down, user is able to select timer button Three",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_9",
          "description": "Validate that user is able to select timer Count down option",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_10",
          "description": "Click the timer count up close button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_11",
          "description": "Click the timer count up play button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_12",
          "description": "Validate that user is able to reset button the timer",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_13",
          "description": "Validate Under the Count down, user is able to select Unmute button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_14",
          "description": "Validate that user is able to pause timer count down ",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_15",
          "description": "Get and validate timer count down data",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_TIME_TC_16",
          "description": "Get and validate timer count up data",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/player.test.js",
      "testcase": [
        {
          "id": "TST_PLAY_TC_1",
          "description": "Validate that the hyper link activity hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_2",
          "description": "Validate that the hyperlinkNewTab hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_3",
          "description": "Validate that the  hyper linkAudio without Transcript hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_4",
          "description": "Validate that the  hyperLinkGame  hotlink is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_5",
          "description": "Validate that the hyper link Go To Page is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_6",
          "description": "Validate that the hyper Zoom Hotspot is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_7",
          "description": "Validate that the hyper Zoom Hotspot Close is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_8",
          "description": "Validate that HyperLinkAnswer is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_9",
          "description": "Validate that HyperLink Audio is clickable",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PLAY_TC_10",
          "description": "Validate that HyperLinkVideo is clickable",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "eBook",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/eBook.test.js",
      "testcase": [
        {
          "id": "TST_EBOO_TC_1",
          "description": "Validate eBook page is initialized correctly",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_2",
          "description": "Validate that the Table of Content is clickable and the page is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_3",
          "description": "Validate that the Tools button is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_4",
          "description": "Validate that the Close button is clickable and the page is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_5",
          "description": "Validate that clicking the Home button navigates to dashboard page ",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_6",
          "description": "Validate that Change Course material Dropdown is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_7",
          "description": "Validate that ebook cqaTestEbookOnlyAssets is launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_8",
          "description": "Validate that the Notes pane opens correctly",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_9",
          "description": "Validate that the user is able to launch 'Go to page option'",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_10",
          "description": "Validate that eBook evolve data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_11",
          "description": "Validate that eText toolbar data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_12",
          "description": "Validate that eBook contents data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_13",
          "description": "Validate that blank Tools Notes pane content is as expected",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_14",
          "description": "Validate that eBook Content Dropdown matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_15",
          "description": "Validate that cqaTestEbookOnlyAssets matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_16",
          "description": "Validate that eBook Tools data matches the expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_17",
          "description": "Validate that the eBook Toggle Layout button is clickable & returns single page",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_22",
          "description": "Validate that the eBook Toggle Layout button is clickable & returns double page",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_18",
          "description": "Validate that the eBook Fit to Screen button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_19",
          "description": "Validate that the eBook Fit to Width button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_20",
          "description": "Validate that the eBook Zoom In button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_21",
          "description": "Validate that the eBook Zoom Out button is clickable",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_EBOO_TC_52",
          "description": "Validate that the Timer panel opens correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_51",
          "description": "Validate that the drawing tool is launched",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_53",
          "description": "Validate that next page button  is clicked and next  page launched  correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_54",
          "description": "Validate that previous page button  is clicked and  previous page launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_EBOO_TC_23",
          "description": "Validate that the show-Hide Selection tool  launched correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_1",
          "description": "Validate that user is able click Page No One button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_2",
          "description": "Validate that pageNoTwoBtn  is  Clicked ",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_3",
          "description": "page No Clear Btn is  Clicked",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_4",
          "description": "page No go to Btn is  Clicked",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_PAGE_TC_5",
          "description": "page No verify btn click ",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "notes",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/notes.test.js",
      "testcase": [
        {
          "id": "TST_NOTE_TC_1",
          "description": "Validate the 'Add Notes' button is working as expected",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_2",
          "description": "Validate the 'Add Notes' text area is clicked on the eBook page",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_3",
          "description": "Validate values are set in the 'Add Notes' text area on the eBook page",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_4",
          "description": " Validate the Added notes is saved after clicking Save note button",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_5",
          "description": "Validate the 'Delete Notes' button is clicked on the eBook page",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_6",
          "description": "Validate that clicking the notes menu works correctly",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_NOTE_TC_7",
          "description": "Validate the clicking 'Delete Notes' button opens the confirmation modal",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_8",
          "description": "Validate that clicking 'yes' button in conformation dialog box, notes are deleted",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_NOTE_TC_9",
          "description": "Validate the user Added Notes content matches the expected data",
          "tags": "P3",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "showHideSelection",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/showHideSelection.test.js",
      "testcase": [
        {
          "id": "TST_SHOW_TC_1",
          "description": "Validate that the hide Selection tool is clicked and hide the selected area .",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_SHOW_TC_2",
          "description": "Validate that the show Selection tool is clicked and show only the selected area",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_SHOW_TC_3",
          "description": "Validate that the show or hode Selected area is closed (click on croxx button for remove trhe selected area .)",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_SHOW_TC_4",
          "description": "Validate that show and hide selection values match the expected values",
          "tags": "P3",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "drawingTool",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/drawingTool.test.js",
      "testcase": [
        {
          "id": "TST_DRAW_TC_1",
          "description": "Validate that drawing tool (pen) draw line based on selected pen color & width",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_2",
          "description": "Validate clicking on the Pen color opens pen color options",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_3",
          "description": "Validate that clicking on the Pen width opens the pen width options",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_4",
          "description": "Validate that Eraser tool clicked and erased expected line ",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_5",
          "description": "Validate that Undo function works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_6",
          "description": "Validate that Redo function works correctly",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_7",
          "description": "Validate that Presentation mode is clickable and active",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_8",
          "description": "Validate that all drawing tool data matches expected values",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_9",
          "description": "Validate that the highlighter tool clicked and highlight the expected area ",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_10",
          "description": "Validate that the user is able to select Green color from available pen colors",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_11",
          "description": "Validate that blue pen color is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_12",
          "description": "Validate that red pen color is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_13",
          "description": "Validate that black pen color is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_14",
          "description": "Validate that the user is able to select pen stroke width 4 from available width options",
          "tags": "P3",
          "visualTest": true
        },
        {
          "id": "TST_DRAW_TC_15",
          "description": "Validate that pen stroke width 3 is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_16",
          "description": "Validate that pen stroke width 2 is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_17",
          "description": "Validate that pen stroke width 1 is clickable and selected",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_18",
          "description": "Validate that highlighter draw data is captured in localStorage",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_19",
          "description": "Validate that Pen draw data is captured in localStorage",
          "tags": "P3",
          "visualTest": false
        },
        {
          "id": "TST_DRAW_TC_20",
          "description": "Validate that drawing data is cleared from localStorage after erasing all items",
          "tags": "P3",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "appShell",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/appShell.test.js",
      "testcase": [
        {
          "id": "TST_APPS_TC_1",
          "description": "Click on prod drop down",
          "tags": "P1"
        },
        {
          "id": "TST_APPS_TC_2",
          "description": "Click Log out button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Settings",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/settings.test.js",
      "testcase": [
        {
          "id": "TST_SETT_TC_1",
          "description": "Validate that Profile tab is selected by default when settings page is launched",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_2",
          "description": "Validate that clicking on Profile tab launches Profile page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_3",
          "description": "Validate that clicking on Password tab launches Password page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_4",
          "description": "Validate that clicking on Accessibility tab launches Accessibility page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_5",
          "description": "Validate the content of Profile tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_6",
          "description": "Validate the content of Password tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_7",
          "description": "Validate the content of Accessibility tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_8",
          "description": "Validate that email ID textbox is not editable",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_9",
          "description": "Validate that user can modify the First name.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_10",
          "description": "Validate that user can modify the Last name",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_11",
          "description": "Validate that user can select country from the drop down suggestions",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_12",
          "description": "Validate that clicking on cross button clears the country name from the text box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_13",
          "description": "Validate the error message if First name is left blank",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_14",
          "description": "Validate the error message if Last name is left blank",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_15",
          "description": "Validate that user can update the Password",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_16",
          "description": "Validate the error messages if all Password textboxes are left blank",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_17",
          "description": "Validate the message if Current Password is incorrect",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_18",
          "description": "Validate the error message if New Password and Confirm Passwords do not match",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_19",
          "description": "Validate clicking on toggle password eye button displays the Password",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_23",
          "description": "Validate that font size of the application is updated when the Font Size is increased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_24",
          "description": "Validate that font size of the application is updated when the Font Size decreased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_25",
          "description": "Validate that Line Spacing of the application is updated when the Line Spacing is increased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_26",
          "description": "Validate that Line Spacing of the application is updated when the Line Spacing is decreased.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_27",
          "description": "Validate that High contrast theme is applied in the application when High Contrast is toggled ON.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_28",
          "description": "Validate that OpenDyslexic Font is applied in the application when OpenDyslexic Font is toggled ON.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_29",
          "description": "Validate that Underline Links are applied in the application when Underline Links is toggled ON.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_37",
          "description": "Validate that clicking on Apply Settings updates the application on the basis of settings modified.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_40",
          "description": "Validate that clicking on Confirm button on Reset Default Settings Modal resets the applied settings to default behavior.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_54",
          "description": "Validate that clicking on Reset Default Settings button Reset Default Settings pop up is launched.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_55",
          "description": "Validate that clicking on Billing tab launches Billing page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_56",
          "description": "Validate the content of Billing tab for a free user.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_57",
          "description": "Validate the content of Billing tab for a Premium user.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_58",
          "description": "Validate clicking on Upgrade plan button for a free user launches Select a plan page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_59",
          "description": "Validate clicking on Manage plan button launches Plan options page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_60",
          "description": "Validate clicking on Change card button launches Plan options page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_SETT_TC_61",
          "description": "Validate clicking on Update button on Billing Information card launches Plan options page.",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Flipbook",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/flipbook.test.js",
      "testcase": [
        {
          "id": "TST_FLIP_TC_1",
          "description": "Validate that flipbook is launched (Desktop)",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_2",
          "description": "Validate Clicking on single page launches the book in single page layout",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_3",
          "description": "Validate clicking on the Notes button for a new flipbook launches Notes pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_4",
          "description": "Validate that clicking on 'Add Note' button launches Add Note Text Area",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_5",
          "description": "Validate on clicking Save button, notes set by the user are saved",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_6",
          "description": "Click Close button in notes pane closes the pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_7",
          "description": "Validate clicking on the Bookmark button for a new flipbook launches Bookmark pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_8",
          "description": "Validate that clicking on 'Bookmark This Page' button launches bookmark text area",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_9",
          "description": "Validate on clicking Save button, bookmarks set by the user are saved",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_10",
          "description": "Click Close button in Bookmark pane closes the pane",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_11",
          "description": "Validate clicking on the Notes button with already notes added launches the notes list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_12",
          "description": "Validate clicking on the Edit button, launches the edit notes textarea",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_13",
          "description": "Notes - Validate clicking on the Delete button, launches the delete notes modal",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_14",
          "description": "Validate clicking on the Bookmarks button with already Bookmarks added launches the Bookmarks list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_15",
          "description": "Validate clicking on the Edit button, launches the edit Bookmarks textarea",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_16",
          "description": "Validate clicking on the Delete button, launches the delete Bookmarks modal",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_17",
          "description": "Bookmark - Validate clicking on the Delete button, directly deletes the bookmark and launches list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_18",
          "description": "Validate that clicking on the Zoom in button increases the width and height of the image",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_19",
          "description": "Validate that clicking on the Zoom Out button decreases the width and height of the image",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_20",
          "description": "Validate that clicking on TOC button, launches the TOC layover",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_21",
          "description": "Validate entering the page number in input label after clicking the input field in TOC",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_22",
          "description": "Validate clicking on Jump to page button lauches the entered page in flipbook",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_23",
          "description": "Validate if the page contains any hotlink or not",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_FLIP_TC_24",
          "description": "Validate that clicking on a hotlink activates it",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Browse",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/browse.test.js",
      "testcase": [
        {
          "id": "TST_GLOB_TC_10",
          "description": "Validate that the resources are displayed on clicking the Interactive Activities tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_11",
          "description": "Validate that the resources are displayed on clicking the Videos tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_12",
          "description": "Validate that the resources are displayed on clicking the Online Classes tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_13",
          "description": "Validate that the resources are displayed on clicking the Teacher Training tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_14",
          "description": "Validate that the resources are displayed on clicking the Today in Class tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_15",
          "description": "Validate that the resources are displayed on clicking the Projectable tab",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_16",
          "description": "Validate content in Browse page",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_19",
          "description": "Validate that clicking on a page number in a non categorized view displays the next list of resources.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_20",
          "description": "Validate that clicking on next arrows in a non categorized view displays the list of resources.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_21",
          "description": "Validate that clicking on previous arrows in a non categorized view displays the list of resources.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_22",
          "description": "Validate that clicking on 3 dot options for a resource displays a list of options available for the resource.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_23",
          "description": "Validate clicking on View on 3 dot options launches the resource.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_24",
          "description": "Validate that clicking on Add to playlist on 3 dot options lists the existing playlists and option to create a new playlist.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_25",
          "description": "Validate that clicking on the playlist name adds the resource to the playlist.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_26",
          "description": "Validate that clicking on the resource image launches the resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_28",
          "description": "Validate that searching can be done on basis of resource name",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_36",
          "description": "Validate that No Result Found is displayed in the drop down suggestion and in the screen when no resource matching the search criteria is fulfilled",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_37",
          "description": "Validate that clicking on a resource from the search suggestion drop down list launches the resource.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_37",
          "description": "Validate that clicking on a resource from the search suggestion drop down list launches the resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_38",
          "description": "Validate that clicking on 'More search results for ..xyz' lists the resources based on search text.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_41",
          "description": "Validate that clicking on close serach button removes the search criteria",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_42",
          "description": "Validate clicking on Filters displays the list of filter categories.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_53",
          "description": "Validate that clicking on cross icon on Filters screen closes the filter pop up.",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_57",
          "description": "Validate the content of add book page launched from Dashboard",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_58",
          "description": "Validate that clicking on '+' button adds the book to My Books",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_59",
          "description": "Validate that clicking on the book image launches the book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_60",
          "description": "Validate that clicking on the View button launches the book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_61",
          "description": "Validate the content of books page launched from Browse",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_62",
          "description": "Validate that clicking on more options button displays a list of options available for a book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_63",
          "description": "Validate that clicking on View Classes option launches Class Drawer",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_64",
          "description": "Validate that clicking on Add to My Books adds the book to My Books and display a snackbar message",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_65",
          "description": "Validate that clicking on Open flipbook launches the flipbook associated with the book",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_66",
          "description": "Validate that clicking on Remove from My Books launches a pop up with label 'Remove from My Books?'",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_67",
          "description": "Validate that clicking on 'Cancel' in dialog box retains the book in 'My Books'",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_68",
          "description": "Validate that clicking on 'Remove' in dialog box removes the book from 'My Books'",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_69",
          "description": "Validate that clicking on Create New Class launches create class workflow where book is added to Class Books",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_70",
          "description": "Validate that searching a text lists maximum 5 suggestions matching the search text",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_71",
          "description": "Validate Book added in the Family is available in correct Family on browse page",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_72",
          "description": "Validate the book which is not added in Family in available in Other Books",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_73",
          "description": "Validate that clicking on View All button shows all books of a family",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_75",
          "description": "Validate on Book tab, user is able to search book family name and clicking on it launch the book family page",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_76",
          "description": "Validate that on Book tab, in search results, Family name is displayed below book name and description",
          "tags": "",
          "visualTest": true
        },
        {
          "id": "TST_GLOB_TC_77",
          "description": "Validate that on Book tab, Clicking Show More Books button loads the more books in 'Other book' section",
          "tags": "",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Playlist",
      "moduleId": "TST_PLIS",
      "testFile": "./test/ExperienceApp/playlist.test.js",
      "testcase": [
        {
          "id": "TST_PLIS_TC_1",
          "description": "Validate the content of the playlist page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_2",
          "description": "Validate that clicking on the three dots launches a dropdown list of options",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_3",
          "description": "Validate that clicking on 'Edit' button launches the Playlist pop up",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_4",
          "description": "Validate that clicking on 'Delete' button launches the Delete confirmation pop up",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_5",
          "description": "Validate that playlist name is updated on clicking 'Save' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_6",
          "description": "Validate that playlist name is not updated on clicking 'Cancel' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_7",
          "description": "Validate that clicking 'Delete' button on pop up deletes the playlist",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_8",
          "description": "Validate that playlist is not deleted on clicking 'Cancel' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_9",
          "description": "Validate that clicking on 'Browse All Resources' navigates to the 'Interactive Activities' in Browse Tab",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_10",
          "description": "Validate clicking on 3 dots on any resource on the playlist page launches a dropdown list of options",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_11",
          "description": "Validate clicking on Remove from playlist option launches the remove resource popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_12",
          "description": "Validate that clicking 'Remove' button on pop up removes the resource from the playlist",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_PLIS_TC_13",
          "description": "Validate that clicking 'Cancel' button on pop up does not remove the resource from the playlist",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Writing Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/writingPlayer.test.js",
      "testcase": [
        {
          "id": "TST_ITEM_WRITING_TC_1",
          "description": "Validate that user is able to add text in the editable text area",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_2",
          "description": "Validate that attach file dialog opens on selecting Browse from Computer option in attach dropdown",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_3",
          "description": "Validate that user is able to attach the file less than 100 mb",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_4",
          "description": "Validate that remove dialog appears when user tries to remove the attachment",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_5",
          "description": "Validate that file is removed on clicking yes in the remove dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_6",
          "description": "Validate that file is not removed on clicking no in the remove dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_WRITING_TC_7",
          "description": "Validate that max. file size dialog is displayed if user tries to attach file greater than 100 mb",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Voice Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/voicePlayer.test.js",
      "testcase": [
        {
          "id": "TST_ITEM_VOICE_TC_1",
          "description": "Validate clicking on Record button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_2",
          "description": "Validate clicking on Pause button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_3",
          "description": "Validate clicking on Continue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_4",
          "description": "Validate the countdown starts for the last 15 seconds",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_5",
          "description": "Validate the scenario when recording time limit is reached",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_7",
          "description": "Validate clicking on Done button after time limit is reached",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_10",
          "description": "Validate clicking on Re-record button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_11",
          "description": "Validate clicking on Re-record dialog 'No' button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ITEM_VOICE_TC_12",
          "description": "Validate clicking on Re-record dialog 'Yes' button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Download Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/downloadPlayer.test.js",
      "testcase": [
        {
          "id": "TST_DOWN_TC_1",
          "description": "Validate that clicking on the download button downloads the resource file",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_2",
          "description": "Validate the content of download player for Word resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_3",
          "description": "Validate the content of download player for ZIP resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_4",
          "description": "Validate the content of download player for PDF resource",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_DOWN_TC_5",
          "description": "Validate the content of download player for Spreadsheet resource",
          "tags": "P1, Desktop",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Content Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/contentPlayer.test.js",
      "testcase": [
        {
          "id": "TST_CONT_TC_1",
          "description": "Validate that video player is launched on clicking the video activity",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_2",
          "description": "Validate that audio player is launched on clicking the audio activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_3",
          "description": "Validate that etext is launched on clicking the etext activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_4",
          "description": "Validate that html webbook is launched on clicking the html webbook activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_5",
          "description": "Validate that page is scrolled to top on clicking the scroll to top button",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_6",
          "description": "Validate that video player with transcript is launched on clicking the video with subtitles activity",
          "tags": "P1, Desktop",
          "visualTest": true
        },
        {
          "id": "TST_CONT_TC_7",
          "description": "Validate that audio player with transcript is launched on clicking the audio with subtitles activity",
          "tags": "P1, Desktop",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentListTeacher.test.js",
      "testcase": [
        {
          "id": "TST_ASSLIST_TC_1",
          "description": "Validate the content of Blank create assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_2",
          "description": "Validate the Click on Add new Button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_3",
          "description": "Validate the Click on Component Name",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_4",
          "description": "Validate the click on create assignment page on inbox tab",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_5",
          "description": "Validate the data of assignment card on assignment details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_6",
          "description": "Validate the click on assignment card",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_7",
          "description": "Validate the Data of assignment List Page when assignment is added",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_8",
          "description": "Validate the Click on the more option of assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_9",
          "description": "Validate the Click on the Delete Lable of assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_10",
          "description": "Validate the Click on in progress Arrow",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_11",
          "description": "Validate the click on cancel button of delete dialogue",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLIST_TC_12",
          "description": "Validate the click on dev's Material btn from the component list",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/selectActivity.test.js",
      "testcase": [
        {
          "id": "TST_SLCTACTIVITY_TC_1",
          "description": "Validate the data on select activity Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_SLCTACTIVITY_TC_2",
          "description": "Validate the click on checkbox of parent folder of component",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_SLCTACTIVITY_TC_3",
          "description": "Validate the click on continue button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_SLCTACTIVITY_TC_4",
          "description": "Validate the click on checkbox of  activity of a component",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/createAssignment.test.js",
      "testcase": [
        {
          "id": "TST_CREATEASS_TC_1",
          "description": "Validate the update of assignment name in alpha numeric character",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_2",
          "description": "Validate the click of assign button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_3",
          "description": "Validate the click on confirm assignmeent on submit assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_4",
          "description": "Validate the content of create assignment Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_5",
          "description": "Validate the click on cancel button create assignment Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_CREATEASS_TC_6",
          "description": "Validate the click of show advanced option",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentDetails.test.js",
      "testcase": [
        {
          "id": "TST_ASSDETAILS_TC_1",
          "description": "Validate the content of assignment details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_2",
          "description": "Validate the click on more option of assignment details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_3",
          "description": "Validate the click on delete assignment from the list",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_4",
          "description": "Validate the click on delete button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_5",
          "description": "Validate the click on Edit Assignment Label",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_6",
          "description": "Validate the Assignment Title Update",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_7",
          "description": "Validate the click on save and close button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_8",
          "description": "Validate the click on Clone Label button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_9",
          "description": "Validate the update on the name textbox",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_10",
          "description": "Validate the select on class name",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_11",
          "description": "Validate the Click on View As student button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_12",
          "description": "Validate the View as Student Page Data",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_13",
          "description": "Validate the close on student View Page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSDETAILS_TC_14",
          "description": "Validate the clck of cancel button on edit assignment page",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Teacher",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentListDetails.test.js",
      "testcase": [
        {
          "id": "TST_ASSLISTDETAILS_TC_1",
          "description": "Validate the click on upcoming assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_2",
          "description": "Validate the click on past assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_3",
          "description": "Validate the click on in-progress assignment",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_4",
          "description": "Validate the blank inprogress assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_5",
          "description": "Validate the blank upcoming assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_6",
          "description": "Validate the blank past assignment page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_7",
          "description": "Validate the content of assignment list details page",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_8",
          "description": "validate the details of assignment card",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_9",
          "description": "validate the click on edit assignment button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_10",
          "description": "validate the click on clone assignment button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_11",
          "description": "validate the click on delete assignment button",
          "tags": "P2",
          "visualTest": true
        },
        {
          "id": "TST_ASSLISTDETAILS_TC_12",
          "description": "validate the click on view progress assignment button",
          "tags": "P2",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Assignment - Student",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/assignmentStudentList.test.js",
      "testcase": [
        {
          "id": "TST_ASSLIST_STU_TC_1",
          "description": "Validate the content on blank Due assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_2",
          "description": "Validate the content on blank Upcoming assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_3",
          "description": "Validate the content on blank Completed assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_4",
          "description": "Validate the click on Due assignment tab on assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_5",
          "description": "Validate the click on Upcoming assignment tab on assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_6",
          "description": "Validate the click on Completed assignment tab on assignment page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_7",
          "description": "Validate the content of student assignment list details page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_8",
          "description": "Validate the details of assignment list",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_9",
          "description": "Validate the click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_10",
          "description": "Validate the click on any activity",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_ASSLIST_STU_TC_13",
          "description": "Validate the data after click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "GradeBook",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/gradeBook.test.js",
      "testcase": [
        {
          "id": "TST_GRADEBOOK_TC_1",
          "description": "Validate the GradeBook Page is launched",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_2",
          "description": "Validate the content on Blank GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_3",
          "description": "Validate the content on GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_4",
          "description": "Validate the Product List in GradeBook",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_5",
          "description": "Click on student gradebook is launched after clicking on gradebook button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_6",
          "description": "Validate the Student List in GradeBook",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_7",
          "description": "Validate that clicking on 'Download' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_8",
          "description": "Validate that clicking on 'Send to email' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_9",
          "description": "Validate the content on Student View GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_10",
          "description": "Validate the Unit Details of a book (Scorable)",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_11",
          "description": "Validate the click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_12",
          "description": "Validate the click on 'More options' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_13",
          "description": "Validate the click on Product button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_14",
          "description": "Validate the click on View Attempt button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_15",
          "description": "Validate the click on Cancel button on  View Attempt Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_16",
          "description": "Validate the click on 'Class Copy Code' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_GRADEBOOK_TC_17",
          "description": "Validate the click on 'Invie Email' button",
          "tags": "P2",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "GradeBook-student",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/gradeBookStudent.test.js",
      "testcase": [
        {
          "id": "TST_STU_GRADEBOOK_TC_1",
          "description": "Validate the GradeBook Page is launched",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_2",
          "description": "Validate the Product List in GradeBook",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_3",
          "description": "Validate that clicking on 'Download' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_4",
          "description": "Validate that clicking on 'Send to email' button displays a snackbar message",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_5",
          "description": "Validate the content on Student View GradeBook Page",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_6",
          "description": "Validate the Unit Details of a book (Scorable)",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_7",
          "description": "Validate the click on 'Show Activities' button",
          "tags": "P2",
          "visualTest": "-"
        },
        {
          "id": "TST_STU_GRADEBOOK_TC_8",
          "description": "Validate the click on Product button",
          "tags": "P2",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "Open Activity Player",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/openActivityPlayer.test.js",
      "testcase": [
        {
          "id": "TST_OPEN_TC_1",
          "description": "Validate the writing question in unattempted state for student",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_2",
          "description": "Validate the writing question in attempted state (not graded) for student",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_3",
          "description": "Validate the writing question in graded state for student",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_4",
          "description": "Validate that clicking on Submit Answers displays Submit dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_6",
          "description": "Validate that clicking on Cancel button does not submit the student response",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_11",
          "description": "Validate the writing question in grading state for teacher",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_12",
          "description": "Validate that clicking on submit grade button without entering the score shows error message",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_13",
          "description": "Validate that confirmation dialog appears on clicking submit button after entering score, feedback and reattempt request as no",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_14",
          "description": "Validate that confirmation dialog appears on clicking submit button after entering score, feedback and reattempt request as yes",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_16",
          "description": "Validate that clicking on cancel button does not complete the grading of the activity",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_23",
          "description": "Validate that snackbar message appears on clicking Save Answers button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_OPEN_TC_24",
          "description": "Validate the writing question in unattempted state for Assignment",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Library",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/libraryEditor.test.js",
      "testcase": [
        {
          "id": "TST_ICCE_TC_1",
          "description": "Validate the click on Quiz Header",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_2",
          "description": "Validate the click on Multiple Choice button on the Question selection page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_3",
          "description": "Validate the click on text button on the Question selection page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_4",
          "description": "Validate clicking on Finish button in Quiz",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_5",
          "description": "Validate clicking on Duplicate Question button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_6",
          "description": "Validate clicking on Delete  button on the delete question dialogue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_7",
          "description": "Validate clicking on Cancel  button on the delete question dialogue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_8",
          "description": "Validate clicking on Delete Question button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_9",
          "description": "Validate the add the text in question title",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_11",
          "description": "Validate user is able to add In this Activity text",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_12",
          "description": "Validate the click on Add Media button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_13",
          "description": "Validate the click on add prompt text button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_14",
          "description": "Validate clicking on Image button in Prompt media",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_17",
          "description": "Validate user is able to add image in Prompt image using Browse button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_18",
          "description": "Validate enter textarea in the image on browser popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_19",
          "description": "Validate enter alternative text in the image on browser popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_21",
          "description": "Validate the add the text in prompt text box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_31",
          "description": "Validate the click on Sub question skeleton",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_32",
          "description": "Validate user is able to add subquestion title text",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_33",
          "description": "Validate user is able to update option text",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_34",
          "description": "Validate the click on Sub Question button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_35",
          "description": "Validate the click on add option",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_36",
          "description": "Validate user is able to make any answer option correct using Mark Correct button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_37",
          "description": "Validate user is able to click on Left Arrow button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_40",
          "description": "Validate the click on New Questioon button in Footer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_41",
          "description": "Validate the click on Multiple Question button in Footer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_42",
          "description": "Validate the click on text Question button in Footer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_45",
          "description": "Validate the click student will answer here sceleton",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_46",
          "description": "Validate the click on Long Answer button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_47",
          "description": "Validate the click on File Upload button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_48",
          "description": "Validate clicking on Done button on \"close\"  icon in Add to Class dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_49",
          "description": "Validate clicking on I agree checkbox in Finish quiz dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_50",
          "description": "Validate the click on confirm Finish Button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_52",
          "description": "Validate the Editor Quiz Selection Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_54",
          "description": "Validate the Content of delete question dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_60",
          "description": "Validate user is able to edit Quiz name on New Question Get Started page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_61",
          "description": "Validate the Add to Class button when class is available",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_62",
          "description": "Validate the Page Header when click on Edit button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_63",
          "description": "Validate the Click on Add to Class button after Finish Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_64",
          "description": "Validate the Content of new Access Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_65",
          "description": "Validate the Content of Sub menu data",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_66",
          "description": "Validate the Header on Preview Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_67",
          "description": "Validate the Click on Preview Option",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_68",
          "description": "Validate the Click on Submenu Option",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_69",
          "description": "Validate the Click on duplicate Option in submenu list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_70",
          "description": "Validate the Click on delete Option in submenu list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_71",
          "description": "Validate the Click on Preview Close button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_72",
          "description": "Validate the Click on close left drawer",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_73",
          "description": "Validate the Click on Bread Crumb Back button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_74",
          "description": "Validate the Click on Editor Dismiss button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_75",
          "description": "Validate the Click on delete button on the quiz delete dialogue box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_75",
          "description": "Validate the Click on delete button on the quiz delete dialogue box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_76",
          "description": "Validate the Click on Cancel button on the quiz delete dialogue box",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_77",
          "description": "Validate the Add to Class button when no class is available",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_78",
          "description": "Validate the Click on Edit button on the Published Quiz Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_79",
          "description": "Validate the Click on View As Student button on the Published Quiz Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_80",
          "description": "Validate the Click on close Icon on View As Student Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_81",
          "description": "Validate the Click on close Icon on Edit Material Dialogue button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_82",
          "description": "Validate the Click on close Icon on New Access Dialogue  button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_83",
          "description": "Validate the Click on Continue to Edit button Edit Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_84",
          "description": "Validate the Content of Edit Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_85",
          "description": "Validate the Click on Cancel button Edit Quiz Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_86",
          "description": "Validate the Selection of Class on New Access Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_87",
          "description": "Validate the Click on Add Now button on New Access Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_88",
          "description": "Validate the Content of Quiz Added Successfully Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_89",
          "description": "Validate the Content of new Access Page when Class is avialable",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_90",
          "description": "Validate the Content of new Access Page when Class is avialable",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_91",
          "description": "Validate the Header of Published Quiz Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_92",
          "description": "Validate the Edit Dialogue box when activity is already added in class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_93",
          "description": "Validate the Edit Dialogue box when activity is not  added in class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_94",
          "description": "Validate the Click on Remove Access of a class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_95",
          "description": "Validate the Content of Remove Access Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_96",
          "description": "Validate the Content of Removed Successfully Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_97",
          "description": "Validate the click on Remove anyway button on the Remove Access Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_98",
          "description": "Validate the click on Done button on the Remove Access Successfully Dialogue",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_99",
          "description": "Validate the content of Add to Class Page after adding the quiz in a class",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_100",
          "description": "Validate the click on help icon on editor Page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_101",
          "description": "Validate the click on take editor option in help submenu list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_102",
          "description": "Validate the click on show details button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_103",
          "description": "Validate the content of the show details page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCE_TC_104",
          "description": "Validate the click on hide details button",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "SignUp",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/signUp.test.js",
      "testcase": [
        {
          "id": "TST_SNUP_TC_1",
          "description": "Validate the content of signup page, where user enter the email details",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_2",
          "description": "Validate the error message when no email is entered",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_3",
          "description": "Validate the error message when wrong email format is added",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_4",
          "description": "Validate the error message when existing user email id is entered",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_5",
          "description": "Validate clicking on 'Signup with Email' button",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_6",
          "description": "Validate clicking on 'Google' button for signup",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_7",
          "description": "Validate clicking on 'facebook' button for signup",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_9",
          "description": "On signup page, Validate clicking on 'logIn' button",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_10",
          "description": "Validate the  selecting 'I'm teacher' on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_11",
          "description": "Validate the selecting 'I'm Student' on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_12",
          "description": "Validate the click of continue button after selecting teacher on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_13",
          "description": "Validate the click of continue button after selecting student on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_14",
          "description": "Validate the error message without selecting any teacher/student",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_16",
          "description": "Validate the Click on 'Back to Sign in' on Role Selection Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_17",
          "description": "Validate the application content of 'Account Details' page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_19",
          "description": "Validate the email id on 'Account Details' page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_20",
          "description": "Validate the error message of password, When Password have less than 8 character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_21",
          "description": "Validate the error message of password, When Password have all upper case character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_22",
          "description": "Validate the error message of password, When Password have all lower case character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_23",
          "description": "Validate the error message of password, When Password have not any special character (other condition fulfill)",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_24",
          "description": "Validate the error message of each textbox on Account details page when each textbox is blank",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_25",
          "description": "Validate the error message when password  is not same with confirm passord",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_31",
          "description": "Validate the click on eye button of password after entering the password",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_32",
          "description": "Validate the click on eye button of Confirm password before entering the password",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_37",
          "description": "Validate the country is selected from dropdown",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_39",
          "description": "Validate the click on 'back Role Selection' on Account Details Page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_54",
          "description": "Validate the content of Role selection page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_55",
          "description": "Validate clicking on Privacy Policy link launch the pop up with Privacy Policy tab selected",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_56",
          "description": "Validate clicking on Terms of use link launch the pop up with Privacy Policy tab selected",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_57",
          "description": "Validate clicking on I Agree button on policy page select the policy checkbox on Account Details page",
          "tags": "",
          "visualTest": "-"
        },
        {
          "id": "TST_SNUP_TC_58",
          "description": "Validate clicking on Cancel button on policy page do not select the policy checkbox on Account Details page",
          "tags": "",
          "visualTest": "-"
        }
      ]
    },
    {
      "modulename": "Library",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/library.test.js",
      "testcase": [
        {
          "id": "TST_ICCL_TC_1",
          "description": "Validate clicking on Blank Quiz button on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_2",
          "description": "Validate clicking on Blank survey button",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_3",
          "description": "Validate clicking on New Resource button",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_4",
          "description": "Validate the scenario when no material is added in the Library for new user",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_5",
          "description": "Validate the content for No material when recent material time has elapsed",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_6",
          "description": "Validate clicking on View All Materials launch the My Materials page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCL_TC_7",
          "description": "Validate Material card are displayed based on Modified date on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_8",
          "description": "Validate the lazy loading on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_9",
          "description": "Validate Modified time is displayed on every Material card of present day on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_10",
          "description": "Validate Modified date is displayed on Material card of old date",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_11",
          "description": "Validate the card for Draft Material",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_12",
          "description": "Validate the Card for Finalized Material",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_13",
          "description": "Validate clicking on Draft Material Card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_14",
          "description": "Validate clicking on \"Edit Draft\" button",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_15",
          "description": "Validate clicking on Finalized Material Card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_16",
          "description": "Validate clicking on Ellipses on Draft Material card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_17",
          "description": "Validate clicking on Ellipses on Finalized Material card",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_18",
          "description": "Validate clicking on Preview button in Ellipses for Draft quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_19",
          "description": "Validate clicking on Preview button in Ellipses for Blank Quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_20",
          "description": "Validate clicking on Delete button in Ellipses on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_21",
          "description": "Validate clicking on Cancel button in Delete Materials Dialog on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_22",
          "description": "Validate clicking on Delete button in Delete Materials Dialog on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_23",
          "description": "Validate items are removed from Library page list after recent days count are elapsed",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_24",
          "description": "Validate clicking on Add to Class button on Material card from Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_25",
          "description": "Validate the scenario of selecting a class and clicking on Add Now button in Add to Class dialog from Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_26",
          "description": "Validate clicking on Edit button in Ellipses for Published quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_27",
          "description": "Validate clicking on Duplicate button in Ellipses for Published quiz on Library page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCL_TC_28",
          "description": "Validate clicking on Duplicate button in Ellipses for Draft quiz on Library page",
          "tags": "",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Experience App > ICC > My Materials",
      "moduledetails": "",
      "testFile": "./test/ExperienceApp/myMaterials.test.js",
      "testcase": [
        {
          "id": "TST_ICCM_TC_2",
          "description": "Validate the All tabs when no material is present on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_3",
          "description": "Validate the Draft tabs when no material is present on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_4",
          "description": "Validate the Published tabs when no material is present on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_5",
          "description": "Validate clicking on \"Blank Quiz\" button when no item is present on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_6",
          "description": "Validate clicking on \"Add New Material\" button on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_7",
          "description": "Validate clicking on \"Blank Quiz\" button from dropdown menu on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_8",
          "description": "Validate clicking on \"Blank Survey\" button from dropdown menu on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_9",
          "description": "Validate clicking on \"New Resource\" button from dropdown menu on My Material page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_10",
          "description": "Validate the tabs on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_11",
          "description": "Validate clicking on Drafts tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_12",
          "description": "Validate clicking on Published tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_13",
          "description": "Validate the lazy loading on My materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_14",
          "description": "Validate the default sorting on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_15",
          "description": "Validate clicking on Materials sort arrow",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_16",
          "description": "Validate the scenario if user sort 10 visible result and then load other Materials",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_17",
          "description": "Validate clicking on Last Modified sort arrow",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_18",
          "description": "Validate clicking on ellipses with Draft Material on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_19",
          "description": "Validate clicking on ellipses with Published Material on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_20",
          "description": "Validate clicking on Preview button in Ellipses for Draft quiz on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_21",
          "description": "Validate clicking on Preview button in Ellipses for Blank Quiz on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_22",
          "description": "Validate clicking on Edit button in Ellipses for published quiz on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_23",
          "description": "Validate clicking on Delete button in Ellipses on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_24",
          "description": "Validate clicking on Cancel button in Delete Materials Dialog",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_25",
          "description": "Validate clicking on Delete button in Delete Materials Dialog",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_26",
          "description": "Validate the search scenario when no result is found",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_27",
          "description": "Validate the partial search on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_28",
          "description": "Validate the exact search on My Materials page",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_29",
          "description": "Validate search for special character - all keyboard characters",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_30",
          "description": "Validate search for spanish characters",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_31",
          "description": "Validate if search data is retained if user switch tabs",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_32",
          "description": "Validate search scenarios in Draft tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_33",
          "description": "Validate search scenarios in Published tab",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_34",
          "description": "Validate the scenario if user delete a material and then search it",
          "tags": "",
          "visualTest": false
        },
        {
          "id": "TST_ICCM_TC_35",
          "description": "Validate clicking on cross icon clears the search results",
          "tags": "",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "ICC Assignment and Class data",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/iccAssignment.test.js",
      "testcase": [
        {
          "id": "TST_ICCA_TC_3",
          "description": "Validate the click on more option of activity name",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_4",
          "description": "Validate the click on the Edit button of activity more option list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_5",
          "description": "Validate the click on the restricted/public button of activity more option list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_6",
          "description": "Validate the click on the Assign button of activity more option list",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_17",
          "description": "Validate the click on the Material checkbox value.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_22",
          "description": "Validate the continue details page on the select activity page.",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_24",
          "description": "Validate the Activities data on dev Material page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_25",
          "description": "Validate the Activities data on dev Material page",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_31",
          "description": "Validate the click on yes button on make restricted/public popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_33",
          "description": "Validate the content on make restricted popup",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCA_TC_34",
          "description": "Validate the content on make public popup",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Editor Tour",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/editorTour.test.js",
      "testcase": [
        {
          "id": "TST_ICCT_TC_1",
          "description": "Validate that editor tour is launched when user creates first question in a quiz in a login session",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_2",
          "description": "Validate that editor tour is closed on clicking dismiss button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_3",
          "description": "Validate that editor tour does not launch when user add another question of same type",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_4",
          "description": "Validate that editor tour does not launch when user creates first question in another quiz in a login session",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_5",
          "description": "Validate that first prompt appears on clicking Start Tour button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_6",
          "description": "Validate that tour exits on clicking exit button in the first prompt",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_7",
          "description": "Validate that next prompt appears on clicking next button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_8",
          "description": "Validate that previous prompt appears on clicking back button",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_9",
          "description": "Validate that tour exits on clicking exit button in the last prompt",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_10",
          "description": "Validate that dont show again checkbox is selected on clicking the checkbox",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_11",
          "description": "Validate that editor tour does not launch when user creates first question in a quiz in a new login session if dont show checkbox is checked",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_12",
          "description": "Validate the content of the start tour dialog",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_13",
          "description": "Validate the content of the mcq editor tour",
          "tags": "P1",
          "visualTest": true
        },
        {
          "id": "TST_ICCT_TC_14",
          "description": "Validate the content of the text editor tour",
          "tags": "P1",
          "visualTest": true
        }
      ]
    },
    {
      "modulename": "Active Class",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/activeClass.test.js",
      "testcase": [
        {
          "id": "TST_ACTI_TC_1",
          "description": "Click Actions dropdown button inside a Class",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_ACTI_TC_2",
          "description": "Click Delete Class option from Actions dropdown",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_ACTI_TC_3",
          "description": "Click Yes Delete button on delete confirmation modal",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_ACTI_TC_4",
          "description": "Validate Actions dropdown data",
          "tags": "P2",
          "visualTest": false
        },
        {
          "id": "TST_ACTI_TC_5",
          "description": "Validate delete modal data",
          "tags": "P2",
          "visualTest": false
        }
      ]
    },
    {
      "modulename": "Manage Reports Accessibility",
      "moduleId": "",
      "testFile": "./test/ExperienceApp/manageReports.test.js",
      "testcase": [
        {
          "id": "TST_MRPT_TC_1",
          "description": "Click Manage Reports from Actions dropdown",
          "tags": "P1",
          "visualTest": false
        },
        {
          "id": "TST_MRPT_TC_2",
          "description": "Verify Download button has correct button role for accessibility",
          "tags": "P1",
          "visualTest": false
        }
      ]
    }
  ]
}
```

### [MODIFY] [package.json](file:///d:/testAutomation/QATestAutomation/testAutomation_v1.0/package.json)
Added npm script: `manageReportsTest_thor`

```diff:package.json
{
  "name": "testAutomation",
  "version": "0.9.4",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "./node_modules/.bin/wdio wdio.conf.js",
    "landingFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "completeAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1completeAssignment.json' --browserCapability=desktop-chrome-1920",
    "createAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1createAssignment.json' --browserCapability=desktop-chrome-1920",
    "deleteAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1deleteAssignment.json' --browserCapability=desktop-chrome-1920",
    "studentAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1student.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTestTeacher_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest_Teacher.json' --browserCapability=desktop-chrome-1920",
    "resetPasswordTest_prod": " npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='resetPassword.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_prod": " npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "createNewClassTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='createNewClassWithStudent.json' --browserCapability=desktop-chrome-1920",
    "deleteClassTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='activeClass.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "landingFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='landingTest.json' --browserCapability=lambdatest-chrome-1920",
    "FooterFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='footerTest.json' --browserCapability=lambdatest-chrome-1920",
    "loginFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='loginTest.json' --browserCapability=lambdatest-chrome-1920",
    "completeAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1completeAssignment.json' --browserCapability=lambdatest-chrome-1920",
    "createAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1createAssignment.json' --browserCapability=lambdatest-chrome-1920",
    "deleteAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1deleteAssignment.json' --browserCapability=lambdatest-chrome-1920",
    "studentAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1student.json' --browserCapability=lambdatest-chrome-1920",
    "dashboardFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest.json' --browserCapability=lambdatest-chrome-1920",
    "dashboardFeatureTestTeacher_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest_Teacher.json' --browserCapability=lambdatest-chrome-1920",
    "resetPasswordTest_LT": " npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='resetPassword.json' --browserCapability=lambdatest-chrome-1920",
    "eBookFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='eBookTestMaster_v.0.json' --browserCapability=lambdatest-chrome-1920",
    "notesFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='notesTest.json' --browserCapability=lambdatest-chrome-1920",
    "highlighterFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='highlighterTest.json' --browserCapability=lambdatest-chrome-1920",
    "timerFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='timerTest_VC.json' --browserCapability=lambdatest-chrome-1920",
    "nextPreviousPageTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=lambdatest-chrome-1920",
    "toolsFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='toolsFeatureTest.json' --browserCapability=lambdatest-chrome-1920",
    "drawingFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='drawingTool.json' --browserCapability=lambdatest-chrome-1920",
    "createNewClassTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='createNewClassWithStudent.json' --browserCapability=lambdatest-chrome-1920",
    "deleteClassTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='activeClass.json' --browserCapability=lambdatest-chrome-1920",
    "eBookHotLinkTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='player.json' --browserCapability=lambdatest-chrome-1920",
    "landingFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "completeAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1completeAssignment.json' --browserCapability=desktop-chrome-1920",
    "createAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1createAssignment.json' --browserCapability=desktop-chrome-1920",
    "deleteAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1deleteAssignment.json' --browserCapability=desktop-chrome-1920",
    "studentAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1student.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTestTeacher_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='dashboardTest_Teacher.json' --browserCapability=desktop-chrome-1920",
    "resetPasswordTest_thor": " npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='resetPassword.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_thor": " npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "createNewClassTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='createNewClassWithStudent.json' --browserCapability=desktop-chrome-1920",
    "deleteClassTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='activeClass.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "landingFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "completeAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1completeAssignment.json' --browserCapability=desktop-chrome-1920",
    "createAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1createAssignment.json' --browserCapability=desktop-chrome-1920",
    "deleteAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1deleteAssignment.json' --browserCapability=desktop-chrome-1920",
    "studentAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1student.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTestTeacher_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='dashboardTest_Teacher.json' --browserCapability=desktop-chrome-1920",
    "resetPasswordTest_rel": " npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='resetPassword.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_rel": " npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "createNewClassTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='createNewClassWithStudent.json' --browserCapability=desktop-chrome-1920",
    "deleteClassTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='activeClass.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "landingFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_qa": " npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_LTmobile": "npx wdio  --appType=ExperienceApp --testEnv=production --testExecFile='loginTest.json' --browserCapability=lambdatest-android-samsungS24"
  },
  "keywords": [],
  "author": "",
  "capabilities": {},
  "license": "ISC",
  "dependencies": {
    "@applitools/eyes-webdriverio": "^5.35.7",
    "@wdio/allure-reporter": "^7.26.0",
    "@wdio/appium-service": "^7.26.0",
    "@wdio/cli": "^7.26.0",
    "@wdio/codemod": "^0.11.0",
    "@wdio/local-runner": "^7.26.0",
    "@wdio/mocha-framework": "^7.26.0",
    "@wdio/spec-reporter": "^7.26.0",
    "allure-commandline": "^2.13.0",
    "appium": "^1.16.0",
    "browserstack-local": "^1.4.8",
    "chai": "^4.3.6",
    "combine-image": "1.0.3",
    "create-wdio": "^7.1.1",
    "css-selector-parser": "^1.4.1",
    "css-selector-tools": "^1.0.9",
    "csv-parse": "^4.16.2",
    "csv-parser": "^3.0.0",
    "csvtojson": "2.0.10",
    "ejs": "^3.1.6",
    "express": "^4.17.1",
    "express-fileupload": "^1.2.1",
    "glob": "^7.1.6",
    "jscodeshift": "^0.13.1",
    "json-format": "1.0.1",
    "jsonexport": "^3.0.1",
    "lodash.get": "4.4.2",
    "mem-fs": "^1.2.0",
    "mem-fs-editor": "^8.0.0",
    "nodemailer": "^6.6.2",
    "path": "^0.12.7",
    "rimraf": "^3.0.2",
    "selenium-webdriver": "^4.0.0",
    "tesults": "^1.1.1",
    "wdio-chromedriver-service": "8.0.1",
    "wdio-novus-visual-regression-service": "^1.2.5",
    "wdio-timeline-reporter": "^5.1.4",
    "winston": "^3.2.1",
    "winston-loggly-bulk": "^3.1.0",
    "xmlhttprequest": "^1.8.0",
    "yargs": "^15.4.1"
  },
  "devDependencies": {
    "chromedriver": "^147.0.4",
    "wdio-lambdatest-service": "^4.0.0"
  }
}
===
{
  "name": "testAutomation",
  "version": "0.9.4",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "./node_modules/.bin/wdio wdio.conf.js",
    "landingFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "completeAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1completeAssignment.json' --browserCapability=desktop-chrome-1920",
    "createAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1createAssignment.json' --browserCapability=desktop-chrome-1920",
    "deleteAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1deleteAssignment.json' --browserCapability=desktop-chrome-1920",
    "studentAssignmentFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1student.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTestTeacher_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest_Teacher.json' --browserCapability=desktop-chrome-1920",
    "resetPasswordTest_prod": " npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='resetPassword.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_prod": " npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "createNewClassTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='createNewClassWithStudent.json' --browserCapability=desktop-chrome-1920",
    "deleteClassTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='activeClass.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_prod": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "landingFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='landingTest.json' --browserCapability=lambdatest-chrome-1920",
    "FooterFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='footerTest.json' --browserCapability=lambdatest-chrome-1920",
    "loginFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='loginTest.json' --browserCapability=lambdatest-chrome-1920",
    "completeAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1completeAssignment.json' --browserCapability=lambdatest-chrome-1920",
    "createAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1createAssignment.json' --browserCapability=lambdatest-chrome-1920",
    "deleteAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1deleteAssignment.json' --browserCapability=lambdatest-chrome-1920",
    "studentAssignmentFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='c1student.json' --browserCapability=lambdatest-chrome-1920",
    "dashboardFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest.json' --browserCapability=lambdatest-chrome-1920",
    "dashboardFeatureTestTeacher_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='dashboardTest_Teacher.json' --browserCapability=lambdatest-chrome-1920",
    "resetPasswordTest_LT": " npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='resetPassword.json' --browserCapability=lambdatest-chrome-1920",
    "eBookFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='eBookTestMaster_v.0.json' --browserCapability=lambdatest-chrome-1920",
    "notesFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='notesTest.json' --browserCapability=lambdatest-chrome-1920",
    "highlighterFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='highlighterTest.json' --browserCapability=lambdatest-chrome-1920",
    "timerFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='timerTest_VC.json' --browserCapability=lambdatest-chrome-1920",
    "nextPreviousPageTest_LT": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=lambdatest-chrome-1920",
    "toolsFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='toolsFeatureTest.json' --browserCapability=lambdatest-chrome-1920",
    "drawingFeatureTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='drawingTool.json' --browserCapability=lambdatest-chrome-1920",
    "createNewClassTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='createNewClassWithStudent.json' --browserCapability=lambdatest-chrome-1920",
    "deleteClassTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='activeClass.json' --browserCapability=lambdatest-chrome-1920",
    "eBookHotLinkTest_LT": "npx wdio --appType=ExperienceApp --testEnv=production --testExecFile='player.json' --browserCapability=lambdatest-chrome-1920",
    "landingFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "completeAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1completeAssignment.json' --browserCapability=desktop-chrome-1920",
    "createAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1createAssignment.json' --browserCapability=desktop-chrome-1920",
    "deleteAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1deleteAssignment.json' --browserCapability=desktop-chrome-1920",
    "studentAssignmentFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='c1student.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTestTeacher_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='dashboardTest_Teacher.json' --browserCapability=desktop-chrome-1920",
    "resetPasswordTest_thor": " npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='resetPassword.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_thor": " npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "createNewClassTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='createNewClassWithStudent.json' --browserCapability=desktop-chrome-1920",
    "deleteClassTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='activeClass.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "landingFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "completeAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1completeAssignment.json' --browserCapability=desktop-chrome-1920",
    "createAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1createAssignment.json' --browserCapability=desktop-chrome-1920",
    "deleteAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1deleteAssignment.json' --browserCapability=desktop-chrome-1920",
    "studentAssignmentFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='c1student.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTestTeacher_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='dashboardTest_Teacher.json' --browserCapability=desktop-chrome-1920",
    "resetPasswordTest_rel": " npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='resetPassword.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_rel": " npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "createNewClassTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='createNewClassWithStudent.json' --browserCapability=desktop-chrome-1920",
    "deleteClassTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='activeClass.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_rel": "npx wdio --appType=ExperienceApp --testEnv=rel --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "dashboardFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='dashboardTest.json' --browserCapability=desktop-chrome-1920",
    "landingFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='landingTest.json' --browserCapability=desktop-chrome-1920",
    "FooterFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='footerTest.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='loginTest.json' --browserCapability=desktop-chrome-1920",
    "visualAcceptance_qa": " npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920 --visual=novus --skipAssertion=true",
    "eBookFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='eBookTestMaster_v.0.json' --browserCapability=desktop-chrome-1920",
    "notesFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='notesTest.json' --browserCapability=desktop-chrome-1920",
    "highlighterFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='highlighterTest.json' --browserCapability=desktop-chrome-1920",
    "timerFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='timerTest_VC.json' --browserCapability=desktop-chrome-1920",
    "nextPreviousPageTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='nextPreviousPageButtonTest.json' --browserCapability=desktop-chrome-1920",
    "toolsFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='toolsFeatureTest.json' --browserCapability=desktop-chrome-1920",
    "drawingFeatureTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='drawingTool.json' --browserCapability=desktop-chrome-1920",
    "eBookHotLinkTest_qa": "npx wdio --appType=ExperienceApp --testEnv=qa --testExecFile='player.json' --browserCapability=desktop-chrome-1920",
    "loginFeatureTest_LTmobile": "npx wdio  --appType=ExperienceApp --testEnv=production --testExecFile='loginTest.json' --browserCapability=lambdatest-android-samsungS24",
    "manageReportsTest_thor": "npx wdio --appType=ExperienceApp --testEnv=thor --testExecFile='manageReportsTest.json' --browserCapability=desktop-chrome-1920"
  },
  "keywords": [],
  "author": "",
  "capabilities": {},
  "license": "ISC",
  "dependencies": {
    "@applitools/eyes-webdriverio": "^5.35.7",
    "@wdio/allure-reporter": "^7.26.0",
    "@wdio/appium-service": "^7.26.0",
    "@wdio/cli": "^7.26.0",
    "@wdio/codemod": "^0.11.0",
    "@wdio/local-runner": "^7.26.0",
    "@wdio/mocha-framework": "^7.26.0",
    "@wdio/spec-reporter": "^7.26.0",
    "allure-commandline": "^2.13.0",
    "appium": "^1.16.0",
    "browserstack-local": "^1.4.8",
    "chai": "^4.3.6",
    "combine-image": "1.0.3",
    "create-wdio": "^7.1.1",
    "css-selector-parser": "^1.4.1",
    "css-selector-tools": "^1.0.9",
    "csv-parse": "^4.16.2",
    "csv-parser": "^3.0.0",
    "csvtojson": "2.0.10",
    "ejs": "^3.1.6",
    "express": "^4.17.1",
    "express-fileupload": "^1.2.1",
    "glob": "^7.1.6",
    "jscodeshift": "^0.13.1",
    "json-format": "1.0.1",
    "jsonexport": "^3.0.1",
    "lodash.get": "4.4.2",
    "mem-fs": "^1.2.0",
    "mem-fs-editor": "^8.0.0",
    "nodemailer": "^6.6.2",
    "path": "^0.12.7",
    "rimraf": "^3.0.2",
    "selenium-webdriver": "^4.0.0",
    "tesults": "^1.1.1",
    "wdio-chromedriver-service": "8.0.1",
    "wdio-novus-visual-regression-service": "^1.2.5",
    "wdio-timeline-reporter": "^5.1.4",
    "winston": "^3.2.1",
    "winston-loggly-bulk": "^3.1.0",
    "xmlhttprequest": "^1.8.0",
    "yargs": "^15.4.1"
  },
  "devDependencies": {
    "chromedriver": "^147.0.4",
    "wdio-lambdatest-service": "^4.0.0"
  }
}
```

## How to Run

```bash
npm run manageReportsTest_thor
```

## Important Notes

> [!WARNING]
> **Selectors may need adjustment**: The CSS selectors for `manageReports_link` (`a[qid="cView-14"]`) and `downloadReport_btn` are placeholder values based on the pattern used in `activeClass`. After running the test, if selectors don't match, inspect the live DOM and update the selectors in `C1Selectors.json`.

> [!NOTE]
> **Login credentials**: The test uses `successfulInstructorUser` (`thorteacherda@mailsac.com`) — a teacher role. Update the `jsonPath` in the execution file if a different user is needed.

> [!NOTE]
> **activeClass TC registration**: The existing `TST_ACTI_TC_1`–`TC_5` test cases were not registered in `C1TCRepository.json`. Added them to prevent `getTCPropertiesFromTCRepo` errors.
