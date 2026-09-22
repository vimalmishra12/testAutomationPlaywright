'use strict';
var action = require('../../core/actionLibrary/baseActionLibrary.js');
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var appShellPage = require('./appShell.page.js');

module.exports = {
  enterClassDetails:
    selectorFile.css.ComproC1.createNewClass.enterClassDetails,
  back_btn: selectorFile.css.ComproC1.createNewClass.back_btn,
  enterClassName: selectorFile.css.ComproC1.createNewClass.enterClassName,
  startDate: selectorFile.css.ComproC1.createNewClass.startDate,
  endDate: selectorFile.css.ComproC1.createNewClass.endDate,
  enterYourSchool: selectorFile.css.ComproC1.createNewClass.enterYourSchool,
  cancel_btn: selectorFile.css.ComproC1.createNewClass.cancel_btn,
  next_btn: selectorFile.css.ComproC1.createNewClass.next_btn,
  addClassMaterials:
    selectorFile.css.ComproC1.createNewClass.addClassMaterials,
  cancel_btn_classMaterial:
    selectorFile.css.ComproC1.createNewClass.cancel_btn_classMaterial,
  addLater_Btn: selectorFile.css.ComproC1.createNewClass.addLater_Btn,
  classSuccessfullyCreated:
    selectorFile.css.ComproC1.createNewClass.classSuccessfullyCreated,
  dashboard_btn: selectorFile.css.ComproC1.createNewClass.dashboard_btn,
  cancelThisClass: selectorFile.css.ComproC1.createNewClass.cancelThisClass,
  yesCancel_btn: selectorFile.css.ComproC1.createNewClass.yesCancel_btn,
  noKeep_btn: selectorFile.css.ComproC1.createNewClass.noKeep_btn,
  addMaterial_btn: selectorFile.css.ComproC1.createNewClass.addMaterial_btn,
  addMaterial_input:
    selectorFile.css.ComproC1.createNewClass.addMaterial_input,
  dev_test_ebook_bundle_104_bundle:
    selectorFile.css.ComproC1.createNewClass
      .dev_test_ebook_bundle_104_bundle,
  addToClass_Btn: selectorFile.css.ComproC1.createNewClass.addToClass_Btn,
  finish_btn: selectorFile.css.ComproC1.createNewClass.finish_btn,
  dev_test_ebook_bundle_104_bundle_dropdown:
    selectorFile.css.ComproC1.createNewClass
      .dev_test_ebook_bundle_104_bundle_dropdown,
  classData: selectorFile.css.ComproC1.createNewClass.classData,
  addStudents: selectorFile.css.ComproC1.createNewClass.addStudents,
  adultsRadio: selectorFile.css.ComproC1.createNewClass.adultsRadio,
  confirmationNextBtn: selectorFile.css.ComproC1.createNewClass.confirmationNextBtn,
  studentEmail_input: selectorFile.css.ComproC1.createNewClass.studentEmail_input,
  inviteStudentBtn: selectorFile.css.ComproC1.createNewClass.inviteStudentBtn,
  pendingTitle: selectorFile.css.ComproC1.createNewClass.pendingTitle,    

  isInitialized: async function () {
    var res;
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    res = {
      pageStatus: await action.waitForDisplayed(this.enterClassDetails),
    };
    return res;
  },

  getData_classDetails: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      enterClassDetails:
        (await action.getElementCount(this.enterClassDetails)) > 0
          ? await action.getText(this.enterClassDetails)
          : null,
      back_btn:
        (await action.getElementCount(this.back_btn)) > 0
          ? await action.getText(this.back_btn)
          : null,
      enterClassName:
        (await action.getElementCount(this.enterClassName)) > 0
          ? await action.getAttribute(this.enterClassName, 'placeholder')
          : null,
      startDate:
        (await action.getElementCount(this.startDate)) > 0
          ? await action.getText(this.startDate)
          : null,
      endDate:
        (await action.getElementCount(this.endDate)) > 0
          ? await action.getText(this.endDate)
          : null,
      enterYourSchool:
        (await action.getElementCount(this.enterYourSchool)) > 0
          ? await action.getAttribute(this.enterYourSchool, 'placeholder')
          : null,
      cancel_btn:
        (await action.getElementCount(this.cancel_btn)) > 0
          ? await action.getText(this.cancel_btn)
          : null,
      next_btn:
        (await action.getElementCount(this.next_btn)) > 0
          ? await action.getText(this.next_btn)
          : null,
    };
    console.log(obj);
    return obj;
  },

  click_back_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    browser.pause(10000);
    res = await action.click(this.back_btn);
    console.log('back_btn', this.back_btn);
    console.log(res);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' back_btn is clicked');
      res = await require('./dashboard.page.js').isInitialized();
      console.log('After click', res);
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'back_btn is NOT clicked',
        'error'
      );
    }
    console.log('Before return', res);
    return res;
  },

  click_next_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    browser.pause(10000);
    res = await action.click(this.next_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' next_btn is clicked');
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'next_btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  getData_classMaterial: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      addClassMaterials:
        (await action.getElementCount(this.addClassMaterials)) > 0
          ? await action.getText(this.addClassMaterials)
          : null,
      cancel_btn_classMaterial:
        (await action.getElementCount(this.cancel_btn_classMaterial)) > 0
          ? await action.getText(this.cancel_btn_classMaterial)
          : null,
      addLater_Btn:
        (await action.getElementCount(this.addLater_Btn)) > 0
          ? await action.getText(this.addLater_Btn)
          : null,
      addMaterial_btn:
        (await action.getElementCount(this.addMaterial_btn)) > 0
          ? await action.getText(this.addMaterial_btn)
          : null,
      addMaterial_input:
        (await action.getElementCount(this.addMaterial_input)) > 0
          ? await action.getText(this.addMaterial_input)
          : null,
      dev_test_ebook_bundle_104_bundle:
        (await action.getElementCount(this.dev_test_ebook_bundle_104_bundle)) >
        0
          ? await action.getText(this.dev_test_ebook_bundle_104_bundle)
          : null,
      addToClass_Btn:
        (await action.getElementCount(this.addToClass_Btn)) > 0
          ? await action.getText(this.addToClass_Btn)
          : null,
      finish_btn:
        (await action.getElementCount(this.finish_btn)) > 0
          ? await action.getText(this.finish_btn)
          : null,
    };
    return obj;
  },

  getData_successfullyCreated: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      classSuccessfullyCreated:
        (await action.getElementCount(this.classSuccessfullyCreated)) > 0
          ? await action.getText(this.classSuccessfullyCreated)
          : null,
      dashboard_btn:
        (await action.getElementCount(this.dashboard_btn)) > 0
          ? await action.getText(this.dashboard_btn)
          : null,
    };
    return obj;
  },

  click_cancel_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.cancel_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' cancel_btn is clicked');
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'cancel_btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  getData_cancelModal: async function () {
    await logger.logInto(await stackTrace.get());
    var obj;
    obj = {
      cancelThisClass:
        (await action.getElementCount(this.cancelThisClass)) > 0
          ? await action.getText(this.cancelThisClass)
          : null,
      yesCancel_btn:
        (await action.getElementCount(this.yesCancel_btn)) > 0
          ? await action.getText(this.yesCancel_btn)
          : null,
      noKeep_btn:
        (await action.getElementCount(this.noKeep_btn)) > 0
          ? await action.getText(this.noKeep_btn)
          : null,
    };
    return obj;
  },

  set_enterClassName: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.setValue(this.enterClassName, value);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        'Value is entered in enterClassName'
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'Value is NOT entered in enterClassName',
        'error'
      );
    }
    return res;
  },

  set_startDate: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.setValue(this.startDate, value);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        'Value is entered in startDate'
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'Value is NOT entered in startDate',
        'error'
      );
    }
    return res;
  },

  set_endDate: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.setValue(this.endDate, value);
    browser.pause(5000);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        'Value is entered in endDate'
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'Value is NOT entered in endDate',
        'error'
      );
    }
    return res;
  },

  set_enterYourSchool: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.setValue(this.enterYourSchool, value);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        'Value is entered in enterYourSchool'
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'Value is NOT entered in enterYourSchool',
        'error'
      );
    }
    return res;
  },

  click_cancel_btn_classMaterial: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.cancel_btn_classMaterial);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        ' cancel_btn_classMaterial is clicked'
      );
      res = await require('./createNewClass.page.js').isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'cancel_btn_classMaterial is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_addLater_Btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.addLater_Btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' addLater_Btn is clicked');
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'addLater_Btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_dashboard_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    console.log('dashboard_btn',this.dashboard_btn);
    res = await action.click(this.dashboard_btn);
    console.log(res);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' dashboard_btn is clicked');
      res = await require('./dashboard.page.js').isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'dashboard_btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_noKeep_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.noKeep_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' noKeep_btn is clicked');
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'noKeep_btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_yesCancel_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.yesCancel_btn);
    if (true == res) {
      await logger.logInto(await stackTrace.get(), ' yesCancel_btn is clicked');
      res = await require('./dashboard.page.js').isInitialized();
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'yesCancel_btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_addMaterial_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.addMaterial_btn);
    await action.waitForDisplayed(this.addMaterial_input, undefined);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        ' addMaterial_btn is clicked'
      );
      
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'addMaterial_btn is NOT clicked',
        'error'
      );
      
    }
    return res;
  },

  click_dev_test_ebook_bundle_104_bundle: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.dev_test_ebook_bundle_104_bundle);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        ' dev_test_ebook_bundle_104_bundle is clicked'
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'dev_test_ebook_bundle_104_bundle is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_addToClass_Btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.addToClass_Btn);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        ' addToClass_Btn is clicked'
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'addToClass_Btn is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_finish_btn: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.finish_btn);
    if (true == res) {
      await browser.pause(5000);
      await logger.logInto(await stackTrace.get(), ' finish_btn is clicked');
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'finish_btn is NOT clicked',
        'error'
      );
    }
    console.log("Vimal",res);
    return res;
  },

  set_addMaterial_input: async function (value) {
    var res;
    await logger.logInto(await stackTrace.get());
    res = await action.setValue(this.addMaterial_input, value);

    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        'Value is entered in addMaterial_input'
      );
      
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'Value is NOT entered in addMaterial_input',
        'error'
      );
    }
    return res;
  },

  click_dev_test_ebook_bundle_104_bundle_dropdown: async function () {
    await logger.logInto(await stackTrace.get());
    var res;
    res = await action.click(this.dev_test_ebook_bundle_104_bundle_dropdown);
    if (true == res) {
      await logger.logInto(
        await stackTrace.get(),
        ' dev_test_ebook_bundle_104_bundle_dropdown is clicked'
      );
    } else {
      await logger.logInto(
        await stackTrace.get(),
        res + 'dev_test_ebook_bundle_104_bundle_dropdown is NOT clicked',
        'error'
      );
    }
    return res;
  },

  click_classData: async function () {
  await logger.logInto(await stackTrace.get());
  var res;
  res =await action.click(this.classData);
  if (true == res) {
   await logger.logInto(await stackTrace.get(), " classData is clicked");
  }
  else {
  await logger.logInto(await stackTrace.get(), res +"classData is NOT clicked", 'error');
  }
  return res;
  },
  
  click_addStudents: async function () {
  await logger.logInto(await stackTrace.get());
  var res;
  res =await action.click(this.addStudents);
  if (true == res) {
   await logger.logInto(await stackTrace.get(), " addStudents is clicked");
  }
  else {
  await logger.logInto(await stackTrace.get(), res +"addStudents is NOT clicked", 'error');
  }
  return res;
  },
  
  click_adultsRadio: async function () {
  await logger.logInto(await stackTrace.get());
  var res;
  res =await action.click(this.adultsRadio);
  if (true == res) {
   await logger.logInto(await stackTrace.get(), " adultsRadio is clicked");
  }
  else {
  await logger.logInto(await stackTrace.get(), res +"adultsRadio is NOT clicked", 'error');
  }
  return res;
  },
  
  click_confirmationNextBtn: async function () {
  await logger.logInto(await stackTrace.get());
  var res;
  res =await action.click(this.confirmationNextBtn);
  if (true == res) {
   await logger.logInto(await stackTrace.get(), " confirmationNextBtn is clicked");
  }
  else {
  await logger.logInto(await stackTrace.get(), res +"confirmationNextBtn is NOT clicked", 'error');
  }
  return res;
  },
  
  click_inviteStudentBtn: async function () {
  await logger.logInto(await stackTrace.get());
  var res;
  res =await action.click(this.inviteStudentBtn);
  await browser.pause(5000);

  if (true == res) {
   await logger.logInto(await stackTrace.get(), " inviteStudentBtn is clicked");
  res = await action.waitForDisplayed(this.pendingTitle, undefined, false);
  }
  else {
  await logger.logInto(await stackTrace.get(), res +"inviteStudentBtn is NOT clicked", 'error');
  }
  return res;
  },

  set_studentEmail_input:async  function (value){
  var res;
  await logger.logInto(await stackTrace.get());
  res =await action.setValue(this.studentEmail_input,value);
  await browser.pause(5000);
  if (true == res) {
  await logger.logInto(await stackTrace.get(), "Value is entered in studentEmail_input");
  }else {
  await logger.logInto(await stackTrace.get(), res + "Value is NOT entered in studentEmail_input", 'error');
  }
  return res;
  },

  /**
   * Picks the material whose name is EXACTLY `materialName` from the search results, ticks
   * it, and returns the name the modal shows as picked (material0).
   * [2026-09-22] Name-matched on purpose: click_dev_test_ebook_bundle_104_bundle(_dropdown)
   * click the FIRST result / first radio (positional, Invariant 2) and would silently build the
   * class with whatever the search ranked first. Mirrors SOURCE playwright-automation-c1
   * DashboardPage.createClass (exact text match over li.dropdown-item.p-0).
   */
  select_materialByName: async function (materialName) {
    await logger.logInto(await stackTrace.get(), "material:" + materialName);
    var cs = selectorFile.css.ComproC1.createNewClass;
    var escaped = materialName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    var item = action.getFilteredLocator(cs.materialResultItem, new RegExp("^\\s*" + escaped + "\\s*$"));
    // SOURCE saw the material search take minutes on a slow day; 60 s is the first-run budget.
    var res = await action.waitForDisplayed(item, 60000);
    if (true == res) res = await action.click(item);
    if (true == res) res = await action.waitForDisplayed(cs.selectedMaterialName, 15000);
    if (true != res) return { selected: false, selectedName: null };
    var selectedName = (await action.getText(cs.selectedMaterialName)).trim();
    res = await action.click(cs.selectedMaterialRadio);
    return { selected: true == res, selectedName: selectedName };
  },

  /**
   * Whether `email` is listed in the class's pending-invitations container after Invite.
   * [2026-09-22] click_inviteStudentBtn only waits for the "Pending" heading, which proves some
   * invite is pending, not THIS one — SOURCE asserts the address itself.
   */
  getData_pendingInvite: async function (email) {
    await logger.logInto(await stackTrace.get(), "email:" + email);
    var cs = selectorFile.css.ComproC1.createNewClass;
    var row = action.getFilteredLocator(cs.pendingStudentsContainer, email);
    return { emailPending: true == (await action.waitForDisplayed(row, 30000)) };
  },

  /**
   * Reads and closes the "This material is collaborative" dialog that follows Add to class.
   * [2026-09-22, prod trace] It opens over the wizard and swallows the Finish click
   * (#addMaterialInfoModal intercepts pointer events). Bootstrap fades it out, so the close is
   * confirmed by waiting until it is hidden, not by the click alone (Invariant 1).
   */
  close_collaborativeInfo: async function () {
    await logger.logInto(await stackTrace.get());
    var cs = selectorFile.css.ComproC1.createNewClass;
    var out = { shown: false, title: null, closed: false };
    out.shown = true == (await action.waitForDisplayed(cs.collaborativeInfoDialog, 15000));
    if (!out.shown) return out;
    out.title = (await action.getText(cs.collaborativeInfoTitle)).trim();
    var res = await action.click(cs.collaborativeInfoCloseLink);
    if (true == res) res = await action.waitForDisplayed(cs.collaborativeInfoDialog, 10000, true);
    out.closed = true == res;
    return out;
  },

  /**
   * After Finish: reads the success heading, goes to the dashboard, finds the new class BY NAME,
   * opens it and reads its class key. The key is stored as run value `lpClassKey` (ADR-022)
   * so later suites of the run can use {{run.lpClassKey}}.
   * [2026-09-22, SOURCE] Teacher-side creation is synchronous ("Class successfully created"),
   * but the dashboard list can lag behind it — SOURCE allowed 2 min for the class to appear.
   */
  getData_createdClass: async function (className) {
    await logger.logInto(await stackTrace.get(), "class:" + className);
    var cs = selectorFile.css.ComproC1.createNewClass;
    var out = { successText: null, classOnDashboard: false, classKey: null };
    if (true != (await action.waitForDisplayed(this.classSuccessfullyCreated, 120000))) return out;
    out.successText = (await action.getText(this.classSuccessfullyCreated)).trim();
    var res = await this.click_dashboard_btn();
    if (true != res.pageStatus) return out;
    var classLink = action.getFilteredLocator(cs.classTitleLink, className);
    out.classOnDashboard = true == (await action.waitForDisplayed(classLink, 120000));
    if (!out.classOnDashboard) return out;
    res = await action.click(classLink);
    if (true == res) res = await action.waitForDisplayed(cs.classKey, 30000);
    if (true == res) {
      out.classKey = (await action.getText(cs.classKey)).trim();
      require(path.join(process.cwd(), "core", "utils", "runContext.js")).set("lpClassKey", out.classKey);
    }
    return out;
  },

};