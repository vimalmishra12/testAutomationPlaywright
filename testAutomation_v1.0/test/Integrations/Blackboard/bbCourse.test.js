"use strict";
var bbCourse = require("../../../pages/Integrations/Blackboard/bbCourse.page.js");
var sts;

module.exports = {
  TST_BBCN_TC_1: async function (testdata) {
    sts = await bbCourse.open_course(testdata);
    await assertion.assertEqual(sts.pageStatus, true, "Course page did not load after opening the course");
  },
};
