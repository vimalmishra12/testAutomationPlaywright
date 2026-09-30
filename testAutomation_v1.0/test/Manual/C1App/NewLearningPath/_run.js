/**
 * Execution record for the NLP register (Tester columns). Updated after each full run of newLearningPath.json.
 * Keyed by Test Case ID ("<id>#<runKey>" for a reused TC that has a second row, e.g. the Group PS marking).
 */
const RUN2 = "Automated — npm run newLearningPathTest_prod (production). Full run 5, 2026-09-25: 135/135 "
  + "(teacher _5srg, Class brvp, learners _3jsj / B _6bu5, group NLPGroup akq2).";
const pass = { status: "Pass", actual: "As expected (run 2).", comments: RUN2 };

const results = {};
["TST_NLPP_TC_1", "TST_DASH_TC_17", "TST_NLPP_TC_3", "TST_NLPP_TC_5", "TST_NLPP_TC_6", "TST_NLPP_TC_7", "TST_NLPP_TC_8",
  "TST_NLPP_TC_9", "TST_MRKQ_TC_1", "TST_MRKQ_TC_2", "TST_PROG_TC_1", "TST_PROG_TC_6", "TST_PROG_TC_5", "TST_PROG_TC_7",
  "TST_PROG_TC_4", "TST_DASH_TC_13", "TST_NLPP_TC_10", "TST_MSAC_TC_1", "TST_NLPP_TC_11", "TST_NLPP_TC_12", "TST_NLPP_TC_2",
  "TST_NLPP_TC_4", "TST_CGRP_TC_1", "TST_NLPP_TC_15", "TST_NLPP_TC_16", "TST_NLPP_TC_17", "TST_NLPP_TC_18", "TST_NLPP_TC_19",
  "TST_MRKQ_TC_1#group", "TST_MRKQ_TC_2#group", "TST_NLPP_TC_20", "TST_NLPP_TC_13", "TST_NLPP_TC_14", "TST_PROG_TC_3"].forEach((id) => { results[id] = pass; });
results.TST_NLPP_TC_14 = pass;
results.TST_PROG_TC_3 = pass;

module.exports = {
  designed: "2026-09-25",
  generated: "2026-09-25",
  summary: "full run 5 on production 2026-09-25: 135/135 — clean (learner B launches both components in setup; the group-mark queue counter is waited for)",
  attribution: RUN2,
  results: results,
  openItems: [
    "None open. History: learner B's group credit (fixed in setup, user 2026-09-25); the marking counter lag after the Group PS mark (waited for, ≤ 20 min); the PDF follows the LP-022 rule.",
  ],
};
