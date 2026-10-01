/**
 * NLP register — the group scenarios TC-NLP-021 (Collaborative Task) and TC-NLP-022 (Group PS). Appended to the
 * sheet by _generate.js (never renumbered). Grounded live on production 2026-09-25: Class jyaf, group "NLPGroup qt4c",
 * learners _sh6x (A) and _i25k (B), teacher _6fho — all created by this suite's own runs (user decision 2026-09-25).
 */
const { REQS } = require("./_tcdata.js");
const R21 = REQS[20], R22 = REQS[21];
const SEEN = 'Verified live 2026-09-25 (production) on the run\'s own class (Class jyaf, group "NLPGroup qt4c").';
const PRE_GROUP = 'Production. The run\'s class <NLP_CLASS_NAME> has TWO run-generated learners (A <NLP_LEARNER_EMAIL>, '
  + 'B <NLP_LEARNER_B_EMAIL>) who both accepted the invite; the teacher has put them in one group <NLP_GROUP_NAME> (TST_CGRP_TC_1).';

const TCS = [
  {
    id: 'TST_CGRP_TC_1', req: R21, type: 'Positive', priority: 'Medium',
    title: 'Verify the teacher can create a group of the class\'s two learners and it is listed with its students',
    pre: 'Production. The teacher\'s class <NLP_CLASS_NAME> has learners A and B (no groups yet). Class page open (Class data).',
    steps: '1. Switch Class data from Students to Groups.\n2. Click "Create groups".\n3. Type the group name; tick learners A and B (rows identified by e-mail).\n4. Click Create.',
    data: 'Group name "NLPGroup <rand4>" (maxlength 50) · learners A and B',
    expected: '"Groups (0)" + "Create groups"; the form "Create new group" lists both learners; Create becomes available; back on Class data: "2 students added to <group>", "Groups (1)", "All students in this class are now in groups", the group with "2 Students".',
    remarks: SEEN + ' Precondition for TC-NLP-021/022 (the sheet\'s "group CRUD setup"). Mutates the run\'s own class only. Student rows are chosen by e-mail — both learners are named "… User".',
  },
  {
    id: 'TST_NLPP_TC_15', req: R21, type: 'Positive', priority: 'Low',
    title: 'Verify a grouped learner can post a comment on the Collaborative Task, which is headed by their group\'s name',
    pre: PRE_GROUP + ' Learner A is on the Projects TOC.',
    steps: '1. Open "6. Collaborative Task".\n2. Type a comment and click Post.',
    data: 'Comment "Comment from learner A"',
    expected: 'The activity is headed by the group name ("No comments yet" at first); after Post the comment shows as "Learner User · Just now · Comment from learner A". A "Ready" button becomes available (not used).',
    remarks: SEEN + ' Before grouping the same activity reads "This is a collaborative activity. It can only be completed by students assigned to groups by a teacher".',
  },
  {
    id: 'TST_NLPP_TC_16', req: R21, type: 'Positive', priority: 'Low',
    title: 'Verify a group member sees the group\'s earlier comments with their authors and can add their own',
    pre: PRE_GROUP + ' Learner A has posted (TST_NLPP_TC_15).',
    steps: '1. As learner B open the Collaborative Task; read the comments.\n2. Post a comment.\n(Run again as learner A at the end: B\'s and the teacher\'s comments.)',
    data: 'Comment "Comment from learner B"',
    expected: 'B sees "Learner User … Comment from learner A"; after Post also "LearnerB User … Comment from learner B". Learner A later sees A\'s, B\'s and the teacher\'s comments.',
    remarks: SEEN,
  },
  {
    id: 'TST_NLPP_TC_17', req: R21, type: 'Positive', priority: 'Low',
    title: 'Verify the teacher can open the group\'s Collaborative Task from the preview, see the learners\' comments and add a comment',
    pre: PRE_GROUP + ' Both learners have posted. Teacher: class Materials → Projects open (TST_NLPP_TC_10).',
    steps: '1. Click "6. Collaborative Task".\n2. On "Select group", choose the group.\n3. Read the comments; post one.',
    data: 'Comment "Comment from the teacher"',
    expected: 'A "Select group" page lists the group; choosing it opens the Collaborative Task with both learners\' comments; the teacher\'s comment is added ("Teacher User" with a "Teacher" tag).',
    remarks: SEEN + ' The sheet\'s "teacher previews … and adds a comment" — the teacher view offers Post and NEXT ACTIVITY, no Ready.',
  },
  {
    id: 'TST_NLPP_TC_18', req: R22, type: 'Positive', priority: 'Low',
    title: 'Verify a learner can submit the Group PS on behalf of the group after confirming "Ready to submit your group\'s work?"',
    pre: PRE_GROUP + ' Nobody in the group has submitted the Group PS.',
    steps: '1. As learner A open "7. Group PS".\n2. Type a title and an answer.\n3. Submit → "Yes, submit".',
    data: 'Title "Group answer title" (maxlength 50) · answer "Group PS answer from learner A"',
    expected: 'Submit is disabled until there is an answer; the dialog reads "Ready to submit your group\'s work? You are acting for all group members…"; afterwards "Learner User on behalf of <group> · <date · time> · 6 words · Submitted" with the title and answer.',
    remarks: SEEN + ' ONE submission per group.',
  },
  {
    id: 'TST_NLPP_TC_19', req: R22, type: 'Positive', priority: 'Low',
    title: 'Verify the other group member sees the group\'s submitted Group PS read-only',
    pre: 'TST_NLPP_TC_18 done.',
    steps: '1. As learner B open "7. Group PS".',
    data: '—',
    expected: 'B sees the same "Learner User on behalf of <group> … Submitted", title and answer; no editor is offered.',
    remarks: SEEN,
  },
  {
    id: 'TST_MRKQ_TC_1', runKey: 'group', req: R22, type: 'Positive', priority: 'Low',
    title: 'Verify the teacher\'s marking queue lists the Group PS once, under the group\'s name',
    pre: 'The Group PS was submitted ≥ ~5 minutes ago.',
    steps: '1. Class → Marking → "Projects" → "Unit 1: Lesson 1 / Group PS".',
    data: 'Item "Unit 1: Lesson 1 / Group PS" · submitter = the GROUP name',
    expected: 'One submission, listed as "<group> · <date · time>" (not per learner); the marking screen opens, score pre-filled 70.',
    remarks: 'Existing TC, reused (group data). ' + SEEN + ' Reached the queue ~4 min after submitting.',
  },
  {
    id: 'TST_MRKQ_TC_2', runKey: 'group', req: R22, type: 'Positive', priority: 'Low',
    title: 'Verify the teacher marks the Group PS once for the whole group',
    pre: 'The Group PS marking screen is open.',
    steps: '1. Score 90, feedback "Well Done".\n2. Send → confirm "Ready to send?".',
    data: 'Score 90 · feedback "Well Done" (agreed with the user 2026-09-23)',
    expected: 'The submission shows "Score : 90 %" and the teacher block "Score: 90 % Feedback: Well Done"; "Unmarked (0)".',
    remarks: 'Existing TC, reused (group data). ' + SEEN + ' Run 4: right after the mark the counters read "Unmarked (2)" while the list showed "There are no student submissions to view"; they reached 0 within ~15 min (the count lags once both members have launched the product). The step re-reads the tab until it settles (≤ 20 min — user decision 2026-09-25).',
  },
  {
    id: 'TST_NLPP_TC_20', req: R22, type: 'Positive', priority: 'Low',
    title: 'Verify every group member sees the teacher\'s single mark and feedback on the group\'s Group PS',
    pre: 'The teacher has marked the Group PS (90, "Well Done").',
    steps: '1. As learner B, then as learner A, open "7. Group PS".',
    data: 'Score 90 · feedback "Well Done"',
    expected: 'Each member sees "Score : 90 %" on the group\'s submission and "Teacher User … Score: 90 % Feedback: Well Done". Learner B\'s bell: "New feedback · Group PS". The teacher\'s Class data credits B too (1/11 · 1/1 · 90%) — provided B launched the components before the group work (setup).',
    remarks: SEEN + ' Analytics for the group mark are checked by TST_PROG_TC_3 (learner B) and TST_PROG_TC_5 (learner B\'s feedback notification).',
  },
];

module.exports = { TCS };
