"use strict";
// CGRP — teacher class groups (module code agreed with the user 2026-09-23). TC-NLP-021/022 precondition: the teacher
// puts the run's two learners in one group. ⚠️ MUTATES the run's own class only (user decision 2026-09-25).
var classGroups = require("../../pages/ExperienceApp/classGroups.page.js");
var sts;

module.exports = {
  // TC-NLP-021/022 setup: Class data → Groups → Create groups → name + both learners (by e-mail) → Create; the group is
  // listed with its two students and the success banner names it.
  TST_CGRP_TC_1: async function (testdata) {
    sts = await classGroups.open_groupsView();
    await assertion.assertEqual(sts.groupsShown, true, "The class's Groups view did not open");
    sts = await classGroups.create_group(testdata.groupName, testdata.studentEmails);
    await assertion.assertEqual(sts.formShown, true, "'Create groups' did not open the new-group form");
    await assertion.assertEqual(sts.ticked.join(" | "), testdata.studentEmails.join(" | "), "Not every learner could be selected for the group");
    await assertion.assertEqual(sts.createEnabled, true, "Create did not become available with a name and students");
    await assertion.assertEqual(sts.created, true, "Create did not return to Class data");
    await assertion.assertEqual(sts.banner, testdata.studentEmails.length + " students added to " + testdata.groupName, "The success message is not shown");
    await assertion.assertEqual(sts.groupListed, true, "Group '" + testdata.groupName + "' is not listed");
    await assertion.assertEqual(sts.members, testdata.studentEmails.length + " Students", "The group does not hold both learners");
  },
};
