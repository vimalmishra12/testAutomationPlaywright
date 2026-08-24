# TC -> suite map (GENERATED - do not edit by hand)

> Regenerate: `node tooling/tcMap.js` . Verify: `node tooling/tcMap.js --check`.
> Derived from the execution files, which remain the single source of truth. A test case
> lives in three places (test file, TC repository, execution file) and nothing else
> connects them; the relationship is MANY-TO-MANY, so this is derived rather than
> hand-maintained. See the header of `tooling/tcMap.js` for why.

## Summary

| | Count |
|---|---|
| Execution files scanned | 120 |
| Distinct TCs seen | 919 |
| Defined in a test file | 467 |
| Registered in a TC repository | 898 |
| Referenced by at least one execution file | 409 |

## Findings

### UNREGISTERED (BLOCKING) - 13

An execution file runs this TC, but **no TC repository registers it** under the test file the exec entry names. `testrunner.js` throws _"Cannot find &lt;id&gt; or &lt;testFile&gt; in the test case repository."_ (two-change rule, Invariant 7).

- `TST_EBOOK_TC_1 - ebookLearningHyperlinkVC.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOOK_TC_1 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOOK_TC_2 - ebookLearningHyperlinkVC.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOOK_TC_2 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOOK_TC_4 - ebookLearningHyperlinkVC.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOOK_TC_4 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOO_TC_55 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOO_TC_56 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOO_TC_57 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOO_TC_58 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOO_TC_59 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOO_TC_60 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`
- `TST_EBOO_TC_61 - ebookLearningHyperlinkVC_V.1.0.json [Test] expects ./test/ExperienceApp/eBook.test.js`

### MISFILED (BLOCKING) - 0

Registered somewhere, but **under a different `testFile`** than the execution entry declares. The runner matches the PAIR, so this throws exactly like an unregistered TC - and is far more confusing, because a grep for the id finds it.

_None._

### GHOST references (BLOCKING) - 0

An execution file names a TC that **no test file defines**. The suite fails when it reaches one.

_None._

### ORPHAN TCs - 47

Registered and defined, but **run by no execution file**. Dead weight, or a suite someone forgot to wire up - exactly the rot that hides for months.

- `TST_ACTI_TC_4` - test/ExperienceApp/activeClass.test.js
- `TST_ACTI_TC_5` - test/ExperienceApp/activeClass.test.js
- `TST_C1AS_TC_1` - test/ExperienceApp/c1assignment.test.js
- `TST_C1ST_TC_8` - test/ExperienceApp/c1student.test.js
- `TST_COMM_TC_5` - test/ExperienceApp/commonActivity.test.js
- `TST_COMM_TC_6` - test/ExperienceApp/commonActivity.test.js
- `TST_CREA_TC_29` - test/ExperienceApp/createNewClass.test.js
- `TST_DASH_TC_2` - test/ExperienceApp/dashboard.test.js
- `TST_DRAW_TC_11` - test/ExperienceApp/drawingTool.test.js
- `TST_DRAW_TC_12` - test/ExperienceApp/drawingTool.test.js
- `TST_DRAW_TC_13` - test/ExperienceApp/drawingTool.test.js
- `TST_DRAW_TC_15` - test/ExperienceApp/drawingTool.test.js
- `TST_DRAW_TC_16` - test/ExperienceApp/drawingTool.test.js
- `TST_DRAW_TC_17` - test/ExperienceApp/drawingTool.test.js
- `TST_DRAW_TC_7` - test/ExperienceApp/drawingTool.test.js
- `TST_DRAW_TC_8` - test/ExperienceApp/drawingTool.test.js
- `TST_EBOO_TC_10` - test/ExperienceApp/eBook.test.js
- `TST_EBOO_TC_11` - test/ExperienceApp/eBook.test.js
- `TST_EBOO_TC_12` - test/ExperienceApp/eBook.test.js
- `TST_EBOO_TC_14` - test/ExperienceApp/eBook.test.js
- `TST_EBOO_TC_15` - test/ExperienceApp/eBook.test.js
- `TST_EBOO_TC_16` - test/ExperienceApp/eBook.test.js
- `TST_ENTE_TC_1` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_11` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_4` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_5` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_6` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_7` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_8` - test/ExperienceApp/createNewClass.test.js
- `TST_INVI_TC_6` - test/ExperienceApp/invitationNotification.test.js
- `TST_LAND_TC_1` - test/ExperienceApp/landing.test.js
- `TST_NOTE_TC_2` - test/ExperienceApp/notes.test.js
- `TST_NOTE_TC_5` - test/ExperienceApp/notes.test.js
- `TST_NTCH_TC_1` - test/ExperienceApp/numberOfTeachers.test.js
- `TST_PAGE_TC_3` - test/ExperienceApp/eBook.test.js
- `TST_PAGE_TC_5` - test/ExperienceApp/eBook.test.js
- `TST_SADR_TC_1` - test/ExperienceApp/schoolAddress.test.js
- `TST_SCON_TC_1` - test/ExperienceApp/schoolContactDetails.test.js
- `TST_SCTY_TC_1` - test/ExperienceApp/schoolType.test.js
- `TST_SHOW_TC_4` - test/ExperienceApp/showHideSelection.test.js
- `TST_SLOC_TC_1` - test/ExperienceApp/schoolLocation.test.js
- `TST_SNAM_TC_1` - test/ExperienceApp/schoolName.test.js
- `TST_SRQS_TC_1` - test/ExperienceApp/schoolRequestSummary.test.js
- `TST_TIME_TC_10` - test/ExperienceApp/timer.test.js
- `TST_TIME_TC_15` - test/ExperienceApp/timer.test.js
- `TST_TIME_TC_16` - test/ExperienceApp/timer.test.js
- `TST_TIME_TC_8` - test/ExperienceApp/timer.test.js

### DORMANT - 11

Defined in a test file but neither registered nor run. Harmless today; throws the moment someone adds it to an execution file.

- `TST_EBOOK_TC_3` - test/ExperienceApp/eBook.test.js
- `TST_ENTE_TC_14` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_15` - test/ExperienceApp/createNewClass.test.js
- `TST_ENTE_TC_16` - test/ExperienceApp/createNewClass.test.js
- `TST_HYPE_TC_1` - test/ExperienceApp/eBook.test.js
- `TST_HYPE_TC_2` - test/ExperienceApp/eBook.test.js
- `TST_HYPE_TC_3` - test/ExperienceApp/eBook.test.js
- `TST_HYPE_TC_4` - test/ExperienceApp/eBook.test.js
- `TST_LOGI_TC_3` - test/ExperienceApp/login.test.js
- `TST_PAGE_TC_6` - test/ExperienceApp/eBook.test.js
- `TST_PLAY_TC_11` - test/ExperienceApp/player.test.js

### REGISTERED but undefined - 452

In a TC repository with no function behind it. Usually a leftover registration.

- `TST_ASSDETAILS_TC_1`
- `TST_ASSDETAILS_TC_10`
- `TST_ASSDETAILS_TC_11`
- `TST_ASSDETAILS_TC_12`
- `TST_ASSDETAILS_TC_13`
- `TST_ASSDETAILS_TC_14`
- `TST_ASSDETAILS_TC_2`
- `TST_ASSDETAILS_TC_3`
- `TST_ASSDETAILS_TC_4`
- `TST_ASSDETAILS_TC_5`
- `TST_ASSDETAILS_TC_6`
- `TST_ASSDETAILS_TC_7`
- `TST_ASSDETAILS_TC_8`
- `TST_ASSDETAILS_TC_9`
- `TST_ASSLISTDETAILS_TC_1`
- `TST_ASSLISTDETAILS_TC_10`
- `TST_ASSLISTDETAILS_TC_11`
- `TST_ASSLISTDETAILS_TC_12`
- `TST_ASSLISTDETAILS_TC_2`
- `TST_ASSLISTDETAILS_TC_3`
- `TST_ASSLISTDETAILS_TC_4`
- `TST_ASSLISTDETAILS_TC_5`
- `TST_ASSLISTDETAILS_TC_6`
- `TST_ASSLISTDETAILS_TC_7`
- `TST_ASSLISTDETAILS_TC_8`
- `TST_ASSLISTDETAILS_TC_9`
- `TST_ASSLIST_STU_TC_1`
- `TST_ASSLIST_STU_TC_10`
- `TST_ASSLIST_STU_TC_13`
- `TST_ASSLIST_STU_TC_2`
- `TST_ASSLIST_STU_TC_3`
- `TST_ASSLIST_STU_TC_4`
- `TST_ASSLIST_STU_TC_5`
- `TST_ASSLIST_STU_TC_6`
- `TST_ASSLIST_STU_TC_7`
- `TST_ASSLIST_STU_TC_8`
- `TST_ASSLIST_STU_TC_9`
- `TST_ASSLIST_TC_1`
- `TST_ASSLIST_TC_10`
- `TST_ASSLIST_TC_11`
- `TST_ASSLIST_TC_12`
- `TST_ASSLIST_TC_2`
- `TST_ASSLIST_TC_3`
- `TST_ASSLIST_TC_4`
- `TST_ASSLIST_TC_5`
- `TST_ASSLIST_TC_6`
- `TST_ASSLIST_TC_7`
- `TST_ASSLIST_TC_8`
- `TST_ASSLIST_TC_9`
- `TST_CONT_TC_1`
- `TST_CONT_TC_2`
- `TST_CONT_TC_3`
- `TST_CONT_TC_4`
- `TST_CONT_TC_5`
- `TST_CONT_TC_6`
- `TST_CONT_TC_7`
- `TST_CREATEASS_TC_1`
- `TST_CREATEASS_TC_2`
- `TST_CREATEASS_TC_3`
- `TST_CREATEASS_TC_4`
- `TST_CREATEASS_TC_5`
- `TST_CREATEASS_TC_6`
- `TST_DOWN_TC_1`
- `TST_DOWN_TC_2`
- `TST_DOWN_TC_3`
- `TST_DOWN_TC_4`
- `TST_DOWN_TC_5`
- `TST_FLIP_TC_1`
- `TST_FLIP_TC_10`
- `TST_FLIP_TC_11`
- `TST_FLIP_TC_12`
- `TST_FLIP_TC_13`
- `TST_FLIP_TC_14`
- `TST_FLIP_TC_15`
- `TST_FLIP_TC_16`
- `TST_FLIP_TC_17`
- `TST_FLIP_TC_18`
- `TST_FLIP_TC_19`
- `TST_FLIP_TC_2`
- `TST_FLIP_TC_20`
- `TST_FLIP_TC_21`
- `TST_FLIP_TC_22`
- `TST_FLIP_TC_23`
- `TST_FLIP_TC_24`
- `TST_FLIP_TC_3`
- `TST_FLIP_TC_4`
- `TST_FLIP_TC_5`
- `TST_FLIP_TC_6`
- `TST_FLIP_TC_7`
- `TST_FLIP_TC_8`
- `TST_FLIP_TC_9`
- `TST_FOOT_TC_4`
- `TST_FOOT_TC_5`
- `TST_FOOT_TC_6`
- `TST_FOOT_TC_8`
- `TST_FOOT_TC_9`
- `TST_GLOB_TC_10`
- `TST_GLOB_TC_11`
- `TST_GLOB_TC_12`
- `TST_GLOB_TC_13`
- `TST_GLOB_TC_14`
- `TST_GLOB_TC_15`
- `TST_GLOB_TC_16`
- `TST_GLOB_TC_19`
- `TST_GLOB_TC_20`
- `TST_GLOB_TC_21`
- `TST_GLOB_TC_22`
- `TST_GLOB_TC_23`
- `TST_GLOB_TC_24`
- `TST_GLOB_TC_25`
- `TST_GLOB_TC_26`
- `TST_GLOB_TC_28`
- `TST_GLOB_TC_36`
- `TST_GLOB_TC_37`
- `TST_GLOB_TC_38`
- `TST_GLOB_TC_41`
- `TST_GLOB_TC_42`
- `TST_GLOB_TC_53`
- `TST_GLOB_TC_57`
- `TST_GLOB_TC_58`
- `TST_GLOB_TC_59`
- `TST_GLOB_TC_60`
- `TST_GLOB_TC_61`
- `TST_GLOB_TC_62`
- `TST_GLOB_TC_63`
- `TST_GLOB_TC_64`
- `TST_GLOB_TC_65`
- `TST_GLOB_TC_66`
- `TST_GLOB_TC_67`
- `TST_GLOB_TC_68`
- `TST_GLOB_TC_69`
- `TST_GLOB_TC_70`
- `TST_GLOB_TC_71`
- `TST_GLOB_TC_72`
- `TST_GLOB_TC_73`
- `TST_GLOB_TC_75`
- `TST_GLOB_TC_76`
- `TST_GLOB_TC_77`
- `TST_GRADEBOOK_TC_1`
- `TST_GRADEBOOK_TC_10`
- `TST_GRADEBOOK_TC_11`
- `TST_GRADEBOOK_TC_12`
- `TST_GRADEBOOK_TC_13`
- `TST_GRADEBOOK_TC_14`
- `TST_GRADEBOOK_TC_15`
- `TST_GRADEBOOK_TC_16`
- `TST_GRADEBOOK_TC_17`
- `TST_GRADEBOOK_TC_2`
- `TST_GRADEBOOK_TC_3`
- `TST_GRADEBOOK_TC_4`
- `TST_GRADEBOOK_TC_5`
- `TST_GRADEBOOK_TC_6`
- `TST_GRADEBOOK_TC_7`
- `TST_GRADEBOOK_TC_8`
- `TST_GRADEBOOK_TC_9`
- `TST_ICCA_TC_17`
- `TST_ICCA_TC_22`
- `TST_ICCA_TC_24`
- `TST_ICCA_TC_25`
- `TST_ICCA_TC_3`
- `TST_ICCA_TC_31`
- `TST_ICCA_TC_33`
- `TST_ICCA_TC_34`
- `TST_ICCA_TC_4`
- `TST_ICCA_TC_5`
- `TST_ICCA_TC_6`
- `TST_ICCE_TC_1`
- `TST_ICCE_TC_100`
- `TST_ICCE_TC_101`
- `TST_ICCE_TC_102`
- `TST_ICCE_TC_103`
- `TST_ICCE_TC_104`
- `TST_ICCE_TC_11`
- `TST_ICCE_TC_12`
- `TST_ICCE_TC_13`
- `TST_ICCE_TC_14`
- `TST_ICCE_TC_17`
- `TST_ICCE_TC_18`
- `TST_ICCE_TC_19`
- `TST_ICCE_TC_2`
- `TST_ICCE_TC_21`
- `TST_ICCE_TC_3`
- `TST_ICCE_TC_31`
- `TST_ICCE_TC_32`
- `TST_ICCE_TC_33`
- `TST_ICCE_TC_34`
- `TST_ICCE_TC_35`
- `TST_ICCE_TC_36`
- `TST_ICCE_TC_37`
- `TST_ICCE_TC_4`
- `TST_ICCE_TC_40`
- `TST_ICCE_TC_41`
- `TST_ICCE_TC_42`
- `TST_ICCE_TC_45`
- `TST_ICCE_TC_46`
- `TST_ICCE_TC_47`
- `TST_ICCE_TC_48`
- `TST_ICCE_TC_49`
- `TST_ICCE_TC_5`
- `TST_ICCE_TC_50`
- `TST_ICCE_TC_52`
- `TST_ICCE_TC_54`
- `TST_ICCE_TC_6`
- `TST_ICCE_TC_60`
- `TST_ICCE_TC_61`
- `TST_ICCE_TC_62`
- `TST_ICCE_TC_63`
- `TST_ICCE_TC_64`
- `TST_ICCE_TC_65`
- `TST_ICCE_TC_66`
- `TST_ICCE_TC_67`
- `TST_ICCE_TC_68`
- `TST_ICCE_TC_69`
- `TST_ICCE_TC_7`
- `TST_ICCE_TC_70`
- `TST_ICCE_TC_71`
- `TST_ICCE_TC_72`
- `TST_ICCE_TC_73`
- `TST_ICCE_TC_74`
- `TST_ICCE_TC_75`
- `TST_ICCE_TC_76`
- `TST_ICCE_TC_77`
- `TST_ICCE_TC_78`
- `TST_ICCE_TC_79`
- `TST_ICCE_TC_8`
- `TST_ICCE_TC_80`
- `TST_ICCE_TC_81`
- `TST_ICCE_TC_82`
- `TST_ICCE_TC_83`
- `TST_ICCE_TC_84`
- `TST_ICCE_TC_85`
- `TST_ICCE_TC_86`
- `TST_ICCE_TC_87`
- `TST_ICCE_TC_88`
- `TST_ICCE_TC_89`
- `TST_ICCE_TC_9`
- `TST_ICCE_TC_90`
- `TST_ICCE_TC_91`
- `TST_ICCE_TC_92`
- `TST_ICCE_TC_93`
- `TST_ICCE_TC_94`
- `TST_ICCE_TC_95`
- `TST_ICCE_TC_96`
- `TST_ICCE_TC_97`
- `TST_ICCE_TC_98`
- `TST_ICCE_TC_99`
- `TST_ICCL_TC_1`
- `TST_ICCL_TC_10`
- `TST_ICCL_TC_11`
- `TST_ICCL_TC_12`
- `TST_ICCL_TC_13`
- `TST_ICCL_TC_14`
- `TST_ICCL_TC_15`
- `TST_ICCL_TC_16`
- `TST_ICCL_TC_17`
- `TST_ICCL_TC_18`
- `TST_ICCL_TC_19`
- `TST_ICCL_TC_2`
- `TST_ICCL_TC_20`
- `TST_ICCL_TC_21`
- `TST_ICCL_TC_22`
- `TST_ICCL_TC_23`
- `TST_ICCL_TC_24`
- `TST_ICCL_TC_25`
- `TST_ICCL_TC_26`
- `TST_ICCL_TC_27`
- `TST_ICCL_TC_28`
- `TST_ICCL_TC_3`
- `TST_ICCL_TC_4`
- `TST_ICCL_TC_5`
- `TST_ICCL_TC_6`
- `TST_ICCL_TC_7`
- `TST_ICCL_TC_8`
- `TST_ICCL_TC_9`
- `TST_ICCM_TC_10`
- `TST_ICCM_TC_11`
- `TST_ICCM_TC_12`
- `TST_ICCM_TC_13`
- `TST_ICCM_TC_14`
- `TST_ICCM_TC_15`
- `TST_ICCM_TC_16`
- `TST_ICCM_TC_17`
- `TST_ICCM_TC_18`
- `TST_ICCM_TC_19`
- `TST_ICCM_TC_2`
- `TST_ICCM_TC_20`
- `TST_ICCM_TC_21`
- `TST_ICCM_TC_22`
- `TST_ICCM_TC_23`
- `TST_ICCM_TC_24`
- `TST_ICCM_TC_25`
- `TST_ICCM_TC_26`
- `TST_ICCM_TC_27`
- `TST_ICCM_TC_28`
- `TST_ICCM_TC_29`
- `TST_ICCM_TC_3`
- `TST_ICCM_TC_30`
- `TST_ICCM_TC_31`
- `TST_ICCM_TC_32`
- `TST_ICCM_TC_33`
- `TST_ICCM_TC_34`
- `TST_ICCM_TC_35`
- `TST_ICCM_TC_4`
- `TST_ICCM_TC_5`
- `TST_ICCM_TC_6`
- `TST_ICCM_TC_7`
- `TST_ICCM_TC_8`
- `TST_ICCM_TC_9`
- `TST_ICCT_TC_1`
- `TST_ICCT_TC_10`
- `TST_ICCT_TC_11`
- `TST_ICCT_TC_12`
- `TST_ICCT_TC_13`
- `TST_ICCT_TC_14`
- `TST_ICCT_TC_2`
- `TST_ICCT_TC_3`
- `TST_ICCT_TC_4`
- `TST_ICCT_TC_5`
- `TST_ICCT_TC_6`
- `TST_ICCT_TC_7`
- `TST_ICCT_TC_8`
- `TST_ICCT_TC_9`
- `TST_ITEM_VOICE_TC_1`
- `TST_ITEM_VOICE_TC_10`
- `TST_ITEM_VOICE_TC_11`
- `TST_ITEM_VOICE_TC_12`
- `TST_ITEM_VOICE_TC_2`
- `TST_ITEM_VOICE_TC_3`
- `TST_ITEM_VOICE_TC_4`
- `TST_ITEM_VOICE_TC_5`
- `TST_ITEM_VOICE_TC_7`
- `TST_ITEM_WRITING_TC_1`
- `TST_ITEM_WRITING_TC_2`
- `TST_ITEM_WRITING_TC_3`
- `TST_ITEM_WRITING_TC_4`
- `TST_ITEM_WRITING_TC_5`
- `TST_ITEM_WRITING_TC_6`
- `TST_ITEM_WRITING_TC_7`
- `TST_LTI_EBKDL_TC_1`
- `TST_LTI_IP2_TC_1`
- `TST_LTI_IP2_TC_2`
- `TST_LTI_IP2_TC_3`
- `TST_LTI_PEDL_TC_1`
- `TST_LTI_PEDL_TC_2`
- `TST_NEMO24401_CLEANUP`
- `TST_NEMO24401_RESET`
- `TST_NEMO24402_CLEANUP`
- `TST_NEMO24402_RESET`
- `TST_OPEN_TC_1`
- `TST_OPEN_TC_11`
- `TST_OPEN_TC_12`
- `TST_OPEN_TC_13`
- `TST_OPEN_TC_14`
- `TST_OPEN_TC_16`
- `TST_OPEN_TC_2`
- `TST_OPEN_TC_23`
- `TST_OPEN_TC_24`
- `TST_OPEN_TC_3`
- `TST_OPEN_TC_4`
- `TST_OPEN_TC_6`
- `TST_PLIS_TC_1`
- `TST_PLIS_TC_10`
- `TST_PLIS_TC_11`
- `TST_PLIS_TC_12`
- `TST_PLIS_TC_13`
- `TST_PLIS_TC_2`
- `TST_PLIS_TC_3`
- `TST_PLIS_TC_4`
- `TST_PLIS_TC_5`
- `TST_PLIS_TC_6`
- `TST_PLIS_TC_7`
- `TST_PLIS_TC_8`
- `TST_PLIS_TC_9`
- `TST_SETT_TC_1`
- `TST_SETT_TC_10`
- `TST_SETT_TC_11`
- `TST_SETT_TC_12`
- `TST_SETT_TC_13`
- `TST_SETT_TC_14`
- `TST_SETT_TC_15`
- `TST_SETT_TC_16`
- `TST_SETT_TC_17`
- `TST_SETT_TC_18`
- `TST_SETT_TC_19`
- `TST_SETT_TC_2`
- `TST_SETT_TC_23`
- `TST_SETT_TC_24`
- `TST_SETT_TC_25`
- `TST_SETT_TC_26`
- `TST_SETT_TC_27`
- `TST_SETT_TC_28`
- `TST_SETT_TC_29`
- `TST_SETT_TC_3`
- `TST_SETT_TC_37`
- `TST_SETT_TC_4`
- `TST_SETT_TC_40`
- `TST_SETT_TC_5`
- `TST_SETT_TC_54`
- `TST_SETT_TC_55`
- `TST_SETT_TC_56`
- `TST_SETT_TC_57`
- `TST_SETT_TC_58`
- `TST_SETT_TC_59`
- `TST_SETT_TC_6`
- `TST_SETT_TC_60`
- `TST_SETT_TC_61`
- `TST_SETT_TC_7`
- `TST_SETT_TC_8`
- `TST_SETT_TC_9`
- `TST_SLCTACTIVITY_TC_1`
- `TST_SLCTACTIVITY_TC_2`
- `TST_SLCTACTIVITY_TC_3`
- `TST_SLCTACTIVITY_TC_4`
- `TST_SNUP_TC_1`
- `TST_SNUP_TC_10`
- `TST_SNUP_TC_11`
- `TST_SNUP_TC_12`
- `TST_SNUP_TC_13`
- `TST_SNUP_TC_14`
- `TST_SNUP_TC_16`
- `TST_SNUP_TC_17`
- `TST_SNUP_TC_19`
- `TST_SNUP_TC_2`
- `TST_SNUP_TC_20`
- `TST_SNUP_TC_21`
- `TST_SNUP_TC_22`
- `TST_SNUP_TC_23`
- `TST_SNUP_TC_24`
- `TST_SNUP_TC_25`
- `TST_SNUP_TC_3`
- `TST_SNUP_TC_31`
- `TST_SNUP_TC_32`
- `TST_SNUP_TC_37`
- `TST_SNUP_TC_39`
- `TST_SNUP_TC_4`
- `TST_SNUP_TC_5`
- `TST_SNUP_TC_54`
- `TST_SNUP_TC_55`
- `TST_SNUP_TC_56`
- `TST_SNUP_TC_57`
- `TST_SNUP_TC_58`
- `TST_SNUP_TC_6`
- `TST_SNUP_TC_7`
- `TST_SNUP_TC_9`
- `TST_STU_GRADEBOOK_TC_1`
- `TST_STU_GRADEBOOK_TC_2`
- `TST_STU_GRADEBOOK_TC_3`
- `TST_STU_GRADEBOOK_TC_4`
- `TST_STU_GRADEBOOK_TC_5`
- `TST_STU_GRADEBOOK_TC_6`
- `TST_STU_GRADEBOOK_TC_7`
- `TST_STU_GRADEBOOK_TC_8`

## Map

One row per TC. **Suites** shows every execution file that runs it and the hook it runs in.

### ?

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ASSLIST_STU_TC_1` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_10` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_13` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_2` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_3` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_4` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_5` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_6` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_7` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_8` |  | false | **- none -** | - |
| `TST_ASSLIST_STU_TC_9` |  | false | **- none -** | - |
| `TST_ITEM_VOICE_TC_1` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_10` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_11` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_12` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_2` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_3` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_4` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_5` |  | **true** | **- none -** | - |
| `TST_ITEM_VOICE_TC_7` |  | **true** | **- none -** | - |
| `TST_ITEM_WRITING_TC_1` |  | **true** | **- none -** | - |
| `TST_ITEM_WRITING_TC_2` |  | **true** | **- none -** | - |
| `TST_ITEM_WRITING_TC_3` |  | **true** | **- none -** | - |
| `TST_ITEM_WRITING_TC_4` |  | **true** | **- none -** | - |
| `TST_ITEM_WRITING_TC_5` |  | **true** | **- none -** | - |
| `TST_ITEM_WRITING_TC_6` |  | **true** | **- none -** | - |
| `TST_ITEM_WRITING_TC_7` |  | **true** | **- none -** | - |
| `TST_LTI_EBKDL_TC_1` |  | false | **- none -** | - |
| `TST_LTI_IP2_TC_1` |  | false | **- none -** | - |
| `TST_LTI_IP2_TC_2` |  | false | **- none -** | - |
| `TST_LTI_IP2_TC_3` |  | false | **- none -** | - |
| `TST_LTI_PEDL_TC_1` |  | false | **- none -** | - |
| `TST_LTI_PEDL_TC_2` |  | false | **- none -** | - |
| `TST_NEMO24401_CLEANUP` |  | false | **- none -** | - |
| `TST_NEMO24401_RESET` |  | false | **- none -** | - |
| `TST_NEMO24402_CLEANUP` |  | false | **- none -** | - |
| `TST_NEMO24402_RESET` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_1` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_2` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_3` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_4` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_5` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_6` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_7` |  | false | **- none -** | - |
| `TST_STU_GRADEBOOK_TC_8` |  | false | **- none -** | - |

### ACTI

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ACTI_TC_1` | ExperienceApp/activeClass.test.js | **true** | activeClass / Test<br>createNewClassWithStudent / Test<br>activeClass / Test<br>createNewClassWithStudent / Test<br>manageReportsTest / Before<br>activeClass / Test<br>createNewClassWithStudent / Test<br>manageReportsTest / Before<br>activeClass / Test<br>createNewClassWithStudent / Test<br>manageReportsTest / Before | deleteClassTest_prod<br>deleteClassTest_LT<br>deleteClassTest_thor<br>deleteClassTest_rel<br>createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel<br>manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel |
| `TST_ACTI_TC_2` | ExperienceApp/activeClass.test.js | **true** | activeClass / Test<br>createNewClassWithStudent / Test<br>activeClass / Test<br>createNewClassWithStudent / Test<br>activeClass / Test<br>createNewClassWithStudent / Test<br>activeClass / Test<br>createNewClassWithStudent / Test | deleteClassTest_prod<br>deleteClassTest_LT<br>deleteClassTest_thor<br>deleteClassTest_rel<br>createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ACTI_TC_3` | ExperienceApp/activeClass.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ACTI_TC_4` | ExperienceApp/activeClass.test.js | **true** | **- none -** | - |
| `TST_ACTI_TC_5` | ExperienceApp/activeClass.test.js | **true** | **- none -** | - |

### APPS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_APPS_TC_1` | ExperienceApp/appShell.test.js | **true** | loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After<br>loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After<br>loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After<br>loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After | loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa |
| `TST_APPS_TC_2` | ExperienceApp/appShell.test.js | **true** | loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After<br>loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After<br>loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After<br>loginTest / Test<br>nextPreviousPageButtonTest / After<br>toolsFeatureTest / After | loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa |

### ASSDETAILS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ASSDETAILS_TC_1` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_10` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_11` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_12` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_13` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_14` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_2` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_3` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_4` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_5` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_6` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_7` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_8` |  | **true** | **- none -** | - |
| `TST_ASSDETAILS_TC_9` |  | **true** | **- none -** | - |

### ASSLIST

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ASSLIST_TC_1` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_10` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_11` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_12` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_2` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_3` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_4` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_5` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_6` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_7` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_8` |  | **true** | **- none -** | - |
| `TST_ASSLIST_TC_9` |  | **true** | **- none -** | - |

### ASSLISTDETAILS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ASSLISTDETAILS_TC_1` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_10` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_11` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_12` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_2` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_3` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_4` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_5` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_6` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_7` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_8` |  | **true** | **- none -** | - |
| `TST_ASSLISTDETAILS_TC_9` |  | **true** | **- none -** | - |

### BBCN

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BBCN_TC_1` | Integrations/Blackboard/bbCourse.test.js | false | ltiComponentLaunch_thor / Before<br>ltiTeacherDashboardLaunch_thor / Test<br>studentDeeplinkLaunch_thor / Before<br>teacherDeeplinkLaunch_thor / Before | ltiComponentLaunch_thor<br>ltiTeacherDashboardLaunch_thor<br>ltiStudentDeeplinkLaunch_thor<br>ltiTeacherDeeplinkLaunch_thor |

### BBIP1

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BBIP1_TC_1` | Integrations/Blackboard/bbLtiTeacherDashboard.test.js | false | ltiComponentLaunch_thor / Before<br>ltiTeacherDashboardLaunch_thor / Test | ltiComponentLaunch_thor<br>ltiTeacherDashboardLaunch_thor |
| `TST_BBIP1_TC_2` | Integrations/Blackboard/bbLtiTeacherDashboard.test.js | false | ltiTeacherDashboardLaunch_thor / Test | ltiTeacherDashboardLaunch_thor |

### BBIP3

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BBIP3_TC_1` | Integrations/Blackboard/bbDeeplink.test.js | false | teacherDeeplinkLaunch_thor / Test | ltiTeacherDeeplinkLaunch_thor |
| `TST_BBIP3_TC_2` | Integrations/Blackboard/bbDeeplink.test.js | false | teacherDeeplinkLaunch_thor / Test | ltiTeacherDeeplinkLaunch_thor |
| `TST_BBIP3_TC_3` | Integrations/Blackboard/bbDeeplink.test.js | false | studentDeeplinkLaunch_thor / Test<br>teacherDeeplinkLaunch_thor / Test | ltiStudentDeeplinkLaunch_thor<br>ltiTeacherDeeplinkLaunch_thor |

### BBIP4

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BBIP4_TC_1` | Integrations/Blackboard/bbDeeplink.test.js | false | studentDeeplinkLaunch_thor / Test | ltiStudentDeeplinkLaunch_thor |
| `TST_BBIP4_TC_2` | Integrations/Blackboard/bbDeeplink.test.js | false | studentDeeplinkLaunch_thor / Test | ltiStudentDeeplinkLaunch_thor |
| `TST_BBIP4_TC_3` | Integrations/Blackboard/bbDeeplink.test.js | false | studentDeeplinkLaunch_thor / Test | ltiStudentDeeplinkLaunch_thor |

### BBLG

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BBLG_TC_1` | Integrations/Blackboard/bbLogin.test.js | false | bbLoginTest / Test<br>ltiComponentLaunch_thor / Before<br>ltiTeacherDashboardLaunch_thor / Test<br>studentDeeplinkLaunch_thor / Before<br>teacherDeeplinkLaunch_thor / Before | bbLoginTest_thor<br>ltiComponentLaunch_thor<br>ltiTeacherDashboardLaunch_thor<br>ltiStudentDeeplinkLaunch_thor<br>ltiTeacherDeeplinkLaunch_thor |
| `TST_BBLG_TC_2` | Integrations/Blackboard/bbLogin.test.js | false | bbLoginTest / Test<br>ltiComponentLaunch_thor / Before<br>ltiTeacherDashboardLaunch_thor / Test<br>studentDeeplinkLaunch_thor / Before<br>teacherDeeplinkLaunch_thor / Before | bbLoginTest_thor<br>ltiComponentLaunch_thor<br>ltiTeacherDashboardLaunch_thor<br>ltiStudentDeeplinkLaunch_thor<br>ltiTeacherDeeplinkLaunch_thor |
| `TST_BBLG_TC_3` | Integrations/Blackboard/bbLogin.test.js | false | bbLoginTest / Test<br>ltiComponentLaunch_thor / Before<br>ltiTeacherDashboardLaunch_thor / Test<br>studentDeeplinkLaunch_thor / Before<br>teacherDeeplinkLaunch_thor / Before | bbLoginTest_thor<br>ltiComponentLaunch_thor<br>ltiTeacherDashboardLaunch_thor<br>ltiStudentDeeplinkLaunch_thor<br>ltiTeacherDeeplinkLaunch_thor |
| `TST_BBLG_TC_4` | Integrations/Blackboard/bbLogin.test.js | false | bbLoginTest / Test<br>ltiComponentLaunch_thor / Before<br>ltiTeacherDashboardLaunch_thor / Test<br>studentDeeplinkLaunch_thor / Before<br>teacherDeeplinkLaunch_thor / Before | bbLoginTest_thor<br>ltiComponentLaunch_thor<br>ltiTeacherDashboardLaunch_thor<br>ltiStudentDeeplinkLaunch_thor<br>ltiTeacherDeeplinkLaunch_thor |

### BECR

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BECR_TC_1` | Builder/createEbook.test.js | false | createEbookTest / Test<br>createEbookTest / Test | CreateEbook_thor<br>CreateEbook_qa |
| `TST_BECR_TC_2` | Builder/createEbook.test.js | false | createEbookTest / Test<br>createEbookTest / Test | CreateEbook_thor<br>CreateEbook_qa |
| `TST_BECR_TC_3` | Builder/createEbook.test.js | false | createEbookTest / Test<br>createEbookTest / Test | CreateEbook_thor<br>CreateEbook_qa |
| `TST_BECR_TC_4` | Builder/createEbook.test.js | false | createEbookTest / Test<br>createEbookTest / Test | CreateEbook_thor<br>CreateEbook_qa |
| `TST_BECR_TC_5` | Builder/createEbook.test.js | false | createEbookTest / Test<br>createEbookTest / Test | CreateEbook_thor<br>CreateEbook_qa |
| `TST_BECR_TC_6` | Builder/createEbook.test.js | false | createEbookTest / Test<br>createEbookTest / Test | CreateEbook_thor<br>CreateEbook_qa |

### BFAM

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BFAM_TC_1` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_10` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_11` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_12` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_13` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_14` | Builder/familyImage.test.js | **true** | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_15` | Builder/familyImage.test.js | **true** | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_16` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_17` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_18` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_2` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_3` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_4` | Builder/familyImage.test.js | **true** | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_5` | Builder/familyImage.test.js | **true** | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_6` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_7` | Builder/familyImage.test.js | **true** | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_8` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |
| `TST_BFAM_TC_9` | Builder/familyImage.test.js | false | familyImageTest / Test | familyImageTest_thor<br>visualAcceptance_familyImage_thor |

### BLOGI

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BLOGI_TC_1` | Builder/login.test.js | false | cloneComponentTest / Test<br>cloneEbookTest / Test<br>createEbookTest / Test<br>builderLoginTest / Test<br>cloneComponentTest / Test<br>cloneEbookTest / Test<br>createEbookTest / Test<br>familyImageTest / Test<br>umbrellaImageTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa<br>BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa<br>CreateEbook_thor<br>CreateEbook_qa<br>BuilderLoginTest_thor<br>familyImageTest_thor<br>visualAcceptance_familyImage_thor<br>umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BLOGI_TC_2` | Builder/login.test.js | false | cloneComponentTest / Test<br>cloneEbookTest / Test<br>createEbookTest / Test<br>builderLoginTest / Test<br>cloneComponentTest / Test<br>cloneEbookTest / Test<br>createEbookTest / Test<br>familyImageTest / Test<br>umbrellaImageTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa<br>BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa<br>CreateEbook_thor<br>CreateEbook_qa<br>BuilderLoginTest_thor<br>familyImageTest_thor<br>visualAcceptance_familyImage_thor<br>umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |

### BUMB

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_BUMB_TC_1` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_10` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_11` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_2` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_3` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_4` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_5` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_6` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_7` | Builder/umbrellaImage.test.js | **true** | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_8` | Builder/umbrellaImage.test.js | **true** | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |
| `TST_BUMB_TC_9` | Builder/umbrellaImage.test.js | false | umbrellaImageTest / Test | umbrellaImageTest_NEMO-24627_thor<br>visualAcceptance_umbrellaImage_NEMO-24627_thor |

### C1AS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_C1AS_TC_1` | ExperienceApp/c1assignment.test.js | **true** | **- none -** | - |
| `TST_C1AS_TC_10` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_11` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_12` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_13` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_14` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1assignment / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_15` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_16` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_17` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_18` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_19` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_2` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1assignment / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_20` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1deleteAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel |
| `TST_C1AS_TC_3` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_4` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_5` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_6` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_7` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_8` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |
| `TST_C1AS_TC_9` | ExperienceApp/c1assignment.test.js | **true** | c1assignment / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test<br>c1assignment copy / Test<br>c1completeAssignment / Test<br>c1createAssignment / Test | completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel |

### C1ST

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_C1ST_TC_1` | ExperienceApp/c1student.test.js | **true** | c1student / Test<br>c1student / Test<br>c1student / Test | studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel |
| `TST_C1ST_TC_2` | ExperienceApp/c1student.test.js | **true** | c1student / Test<br>c1student / Test<br>c1student / Test | studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel |
| `TST_C1ST_TC_3` | ExperienceApp/c1student.test.js | **true** | c1student / Test<br>c1student / Test<br>c1student / Test | studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel |
| `TST_C1ST_TC_4` | ExperienceApp/c1student.test.js | **true** | c1student / Test<br>c1student / Test<br>c1student / Test | studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel |
| `TST_C1ST_TC_5` | ExperienceApp/c1student.test.js | **true** | c1student / Test<br>c1student / Test<br>c1student / Test | studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel |
| `TST_C1ST_TC_6` | ExperienceApp/c1student.test.js | **true** | c1student / Test<br>c1student / Test<br>c1student / Test | studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel |
| `TST_C1ST_TC_7` | ExperienceApp/c1student.test.js | **true** | c1student / Test<br>c1student / Test<br>c1student / Test | studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel |
| `TST_C1ST_TC_8` | ExperienceApp/c1student.test.js | **true** | **- none -** | - |

### CCLS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_CCLS_TC_1` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_10` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassValidation / Test | P1AdminclassValidation_Thor |
| `TST_CCLS_TC_11` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassValidation / Test | P1AdminclassValidation_Thor |
| `TST_CCLS_TC_12` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassValidation / Test | P1AdminclassValidation_Thor |
| `TST_CCLS_TC_13` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassBulk / Test | P1AdminclassBulk_Thor |
| `TST_CCLS_TC_14` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassBulk / Test | P1AdminclassBulk_Thor |
| `TST_CCLS_TC_15` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClass / Test | P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_16` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClass / Test | P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_17` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassBulk / Test | P1AdminclassBulk_Thor |
| `TST_CCLS_TC_18` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassBulk / Test | P1AdminclassBulk_Thor |
| `TST_CCLS_TC_19` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassBulk / Test<br>schoolAdminAddClassBulkCreateCSV / Test | P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor |
| `TST_CCLS_TC_2` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_20` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClass / Test | P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_21` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassBulk / Test | P1AdminclassBulk_Thor |
| `TST_CCLS_TC_22` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassBulk / Test<br>schoolAdminAddClassBulkCreateCSV / Test | P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor |
| `TST_CCLS_TC_23` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test<br>schoolAdminAddClassBulk / BeforeEach<br>schoolAdminAddClassBulkCreateCSV / Test<br>schoolAdminAddClassValidation / BeforeEach | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor<br>P1AdminclassValidation_Thor |
| `TST_CCLS_TC_3` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_4` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test<br>schoolAdminAddClassBulkCreateCSV / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulkCreateCSV_Thor |
| `TST_CCLS_TC_5` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_6` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_7` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor |
| `TST_CCLS_TC_8` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test<br>schoolAdminAddClassBulkCreateCSV / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulkCreateCSV_Thor |
| `TST_CCLS_TC_9` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClassValidation / Test | P1AdminclassValidation_Thor |

### CGST

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_CGST_TC_1` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_2` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_3` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_4` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_5` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_6` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_7` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_8` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_CGST_TC_9` | ExperienceApp/adminClassGradeSettings.test.js | false | adminClassGradeSettings / After | P1AdminClassGradeSettings_Thor |

### CLST

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_CLST_TC_1` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_10` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_11` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_12` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_13` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_14` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_15` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_16` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_17` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_18` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_19` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_2` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_20` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_21` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_22` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_23` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_3` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_4` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_5` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_6` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_7` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_8` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_9` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / Test | P1AdminClassesTab_Thor |
| `TST_CLST_TC_RESET` | ExperienceApp/adminClassesTab.test.js | false | adminClassesTab / BeforeEach<br>adminClassesTab / After | P1AdminClassesTab_Thor |

### COMM

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_COMM_TC_1` | ExperienceApp/commonActivity.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_COMM_TC_2` | ExperienceApp/commonActivity.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_COMM_TC_3` | ExperienceApp/commonActivity.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_COMM_TC_4` | ExperienceApp/commonActivity.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_COMM_TC_5` | ExperienceApp/commonActivity.test.js | **true** | **- none -** | - |
| `TST_COMM_TC_6` | ExperienceApp/commonActivity.test.js | false | **- none -** | - |

### CONT

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_CONT_TC_1` |  | **true** | **- none -** | - |
| `TST_CONT_TC_2` |  | **true** | **- none -** | - |
| `TST_CONT_TC_3` |  | **true** | **- none -** | - |
| `TST_CONT_TC_4` |  | **true** | **- none -** | - |
| `TST_CONT_TC_5` |  | **true** | **- none -** | - |
| `TST_CONT_TC_6` |  | **true** | **- none -** | - |
| `TST_CONT_TC_7` |  | **true** | **- none -** | - |

### CREA

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_CREA_TC_19` | ExperienceApp/createNewClass.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_CREA_TC_20` | ExperienceApp/createNewClass.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_CREA_TC_21` | ExperienceApp/createNewClass.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_CREA_TC_22` | ExperienceApp/createNewClass.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_CREA_TC_23` | ExperienceApp/createNewClass.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_CREA_TC_24` | ExperienceApp/createNewClass.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_CREA_TC_29` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |

### CREATEASS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_CREATEASS_TC_1` |  | **true** | **- none -** | - |
| `TST_CREATEASS_TC_2` |  | **true** | **- none -** | - |
| `TST_CREATEASS_TC_3` |  | **true** | **- none -** | - |
| `TST_CREATEASS_TC_4` |  | **true** | **- none -** | - |
| `TST_CREATEASS_TC_5` |  | **true** | **- none -** | - |
| `TST_CREATEASS_TC_6` |  | **true** | **- none -** | - |

### DASH

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_DASH_TC_1` | ExperienceApp/dashboard.test.js | **true** | dashboardTest / Test<br>dashboardTest / Test<br>NEMO-24388 / Before | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa<br>setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_DASH_TC_10` | ExperienceApp/dashboard.test.js | **true** | createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Test<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Test<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Test<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel<br>dashboardFeatureTestTeacher_prod<br>dashboardFeatureTestTeacher_LT<br>dashboardFeatureTestTeacher_thor<br>dashboardFeatureTestTeacher_rel |
| `TST_DASH_TC_11` | ExperienceApp/dashboard.test.js | **true** | activeClass / Before<br>c1assignment / Before<br>c1assignment / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>manageReportsTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>manageReportsTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>manageReportsTest / Before | deleteClassTest_prod<br>deleteClassTest_LT<br>deleteClassTest_thor<br>deleteClassTest_rel<br>completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel<br>createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel<br>manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel |
| `TST_DASH_TC_2` | ExperienceApp/dashboard.test.js | **true** | **- none -** | - |
| `TST_DASH_TC_3` | ExperienceApp/dashboard.test.js | **true** | dashboardTest / Test<br>dashboardTest / Test | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa |
| `TST_DASH_TC_4` | ExperienceApp/dashboard.test.js | **true** | dashboardTest / Test<br>dashboardTest / Test | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa |
| `TST_DASH_TC_5` | ExperienceApp/dashboard.test.js | false | dashboardTest / Test<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Before<br>eBookTest_rg / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC_V.1.0 / Before<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Before<br>testPurposeonly / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>dashboardTest / Test<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookToolbarFocusTest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Test<br>ebooksE2ETest / Before<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa<br>drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebookFocusA11yTest_thor<br>ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor<br>ebooksE2ETest_thor |
| `TST_DASH_TC_6` | ExperienceApp/dashboard.test.js | **true** | dashboardTest / Test<br>dashboardTest / Test | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa |
| `TST_DASH_TC_7` | ExperienceApp/dashboard.test.js | **true** | dashboardTest / Test<br>dashboardTest / Test | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa |
| `TST_DASH_TC_8` | ExperienceApp/dashboard.test.js | **true** | dashboardTest / Test<br>dashboardTest / Test | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa |
| `TST_DASH_TC_9` | ExperienceApp/dashboard.test.js | **true** | dashboardTest / Test<br>dashboardTest / Test | dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa |

### DINS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_DINS_TC_1` | ExperienceApp/doINeedASchoolAccount.test.js | false | NEMO-24388 / Before | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### DOWN

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_DOWN_TC_1` |  | **true** | **- none -** | - |
| `TST_DOWN_TC_2` |  | **true** | **- none -** | - |
| `TST_DOWN_TC_3` |  | **true** | **- none -** | - |
| `TST_DOWN_TC_4` |  | **true** | **- none -** | - |
| `TST_DOWN_TC_5` |  | **true** | **- none -** | - |

### DRAW

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_DRAW_TC_1` | ExperienceApp/drawingTool.test.js | **true** | highlighterTest / Test<br>testPurposeonly / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_10` | ExperienceApp/drawingTool.test.js | false | highlighterTest / Test<br>testPurposeonly / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_11` | ExperienceApp/drawingTool.test.js | false | **- none -** | - |
| `TST_DRAW_TC_12` | ExperienceApp/drawingTool.test.js | false | **- none -** | - |
| `TST_DRAW_TC_13` | ExperienceApp/drawingTool.test.js | false | **- none -** | - |
| `TST_DRAW_TC_14` | ExperienceApp/drawingTool.test.js | **true** | highlighterTest / Test<br>testPurposeonly / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_15` | ExperienceApp/drawingTool.test.js | false | **- none -** | - |
| `TST_DRAW_TC_16` | ExperienceApp/drawingTool.test.js | false | **- none -** | - |
| `TST_DRAW_TC_17` | ExperienceApp/drawingTool.test.js | false | **- none -** | - |
| `TST_DRAW_TC_18` | ExperienceApp/drawingTool.test.js | false | highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_19` | ExperienceApp/drawingTool.test.js | false | highlighterTest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_2` | ExperienceApp/drawingTool.test.js | **true** | highlighterTest / Test<br>testPurposeonly / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_20` | ExperienceApp/drawingTool.test.js | false | highlighterTest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>highlighterTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_3` | ExperienceApp/drawingTool.test.js | **true** | highlighterTest / Test<br>testPurposeonly / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_4` | ExperienceApp/drawingTool.test.js | **true** | highlighterTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_5` | ExperienceApp/drawingTool.test.js | **true** | highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_6` | ExperienceApp/drawingTool.test.js | **true** | highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_DRAW_TC_7` | ExperienceApp/drawingTool.test.js | **true** | **- none -** | - |
| `TST_DRAW_TC_8` | ExperienceApp/drawingTool.test.js | **true** | **- none -** | - |
| `TST_DRAW_TC_9` | ExperienceApp/drawingTool.test.js | false | highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |

### EBOO

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_EBOO_TC_1` | ExperienceApp/eBookTools.test.js | false | drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTest_rg / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>highlighterTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Test<br>testPurposeonly / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>highlighterTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Test<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>highlighterTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Test<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Test<br>highlighterTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>notesTest / Test<br>player / Test<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_10` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_EBOO_TC_11` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_EBOO_TC_12` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_EBOO_TC_13` | ExperienceApp/eBook.test.js | **true** | eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_14` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_EBOO_TC_15` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_EBOO_TC_16` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_EBOO_TC_17` | ExperienceApp/eBook.test.js | false | eBookTestMaster_v.0 / Test<br>eBookTest_rg / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_18` | ExperienceApp/eBook.test.js | false | eBookTestMaster_v.0 / Test<br>eBookTest_rg / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_19` | ExperienceApp/eBook.test.js | false | eBookTestMaster_v.0 / Test<br>eBookTest_rg / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_2` | ExperienceApp/eBookTools.test.js | **true** | eBookTestMaster_v.0 / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>player / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_20` | ExperienceApp/eBook.test.js | false | eBookTestMaster_v.0 / Test<br>eBookTest_rg / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_21` | ExperienceApp/eBook.test.js | false | eBookTestMaster_v.0 / Test<br>eBookTest_rg / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_22` | ExperienceApp/eBook.test.js | false | drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTest_rg / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_23` | ExperienceApp/eBook.test.js | **true** | drawingTool / Before<br>toolsFeatureTest / Test<br>drawingTool / Before<br>toolsFeatureTest / Test<br>drawingTool / Before<br>toolsFeatureTest / Test<br>drawingTool / Before<br>ebooksE2ETest / Test<br>toolsFeatureTest / Test | drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_3` | ExperienceApp/eBookTools.test.js | **true** | drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>notesTest / Before<br>notesTest / Test<br>testPurposeonly / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>notesTest / Before<br>notesTest / Test<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>notesTest / Before<br>notesTest / Test<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Before<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>notesTest / Before<br>notesTest / Test<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_4` | ExperienceApp/eBookTools.test.js | **true** | eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_5` | ExperienceApp/eBook.test.js | false | eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / After<br>notesTest / Test<br>notesTest / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / After<br>notesTest / Test<br>notesTest / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / After<br>notesTest / Test<br>notesTest / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Test<br>highlighterTest / Test<br>nextPreviousPageButtonTest / After<br>notesTest / Test<br>notesTest / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_51` | ExperienceApp/eBook.test.js | **true** | highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>testPurposeonly / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Before<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>highlighterTest / Before<br>highlighterTest / Test<br>highlighterTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test | visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_52` | ExperienceApp/eBook.test.js | **true** | timerTest_VC / Before<br>toolsFeatureTest / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>ebooksE2ETest / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_53` | ExperienceApp/eBook.test.js | **true** | nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test<br>nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test<br>nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test | nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_54` | ExperienceApp/eBook.test.js | **true** | nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test<br>nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test<br>nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>nextPreviousPageButtonTest / Test<br>toolsFeatureTest / Test | nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_55` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOO_TC_56` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOO_TC_57` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOO_TC_58` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOO_TC_59` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOO_TC_6` | ExperienceApp/eBook.test.js | **true** | eBookTestMaster_v.0 / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>player / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_60` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOO_TC_61` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOO_TC_7` | ExperienceApp/eBook.test.js | **true** | eBookTestMaster_v.0 / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>player / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>player / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_8` | ExperienceApp/eBook.test.js | false | eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Before<br>notesTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Before<br>notesTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Before<br>notesTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>notesTest / Before<br>notesTest / Test<br>toolsFeatureTest / Before<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_EBOO_TC_9` | ExperienceApp/eBook.test.js | **true** | ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After | nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |

### EBOOK

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_EBOOK_TC_1` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOOK_TC_2` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test | - |
| `TST_EBOOK_TC_3` | ExperienceApp/eBook.test.js | - | **- none -** | - |
| `TST_EBOOK_TC_4` | ExperienceApp/eBook.test.js | - | ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test | - |

### EBTF

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_EBTF_TC_1` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_10` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_11` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_12` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_13` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_14` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_15` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_16` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_2` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_3` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_4` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_5` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_6` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_7` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_8` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |
| `TST_EBTF_TC_9` | ExperienceApp/ebookToolbarFocus.test.js | **true** | ebookToolbarFocusTest / Test | ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor |

### ENTE

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ENTE_TC_1` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |
| `TST_ENTE_TC_10` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test | - |
| `TST_ENTE_TC_11` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |
| `TST_ENTE_TC_12` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_13` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test | - |
| `TST_ENTE_TC_14` | ExperienceApp/createNewClass.test.js | - | **- none -** | - |
| `TST_ENTE_TC_15` | ExperienceApp/createNewClass.test.js | - | **- none -** | - |
| `TST_ENTE_TC_16` | ExperienceApp/createNewClass.test.js | - | **- none -** | - |
| `TST_ENTE_TC_17` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test | - |
| `TST_ENTE_TC_18` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_19` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_2` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test<br>createNewClass / Test | - |
| `TST_ENTE_TC_20` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_21` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_22` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_23` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_3` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_ENTE_TC_4` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |
| `TST_ENTE_TC_5` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |
| `TST_ENTE_TC_6` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |
| `TST_ENTE_TC_7` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |
| `TST_ENTE_TC_8` | ExperienceApp/createNewClass.test.js | **true** | **- none -** | - |
| `TST_ENTE_TC_9` | ExperienceApp/createNewClass.test.js | **true** | createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test<br>createNewClass / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |

### FLIP

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_FLIP_TC_1` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_10` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_11` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_12` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_13` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_14` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_15` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_16` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_17` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_18` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_19` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_2` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_20` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_21` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_22` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_23` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_24` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_3` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_4` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_5` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_6` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_7` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_8` |  | **true** | **- none -** | - |
| `TST_FLIP_TC_9` |  | **true** | **- none -** | - |

### FOOT

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_FOOT_TC_1` | ExperienceApp/footer.test.js | **true** | footerTest / Test<br>footerTest / Test<br>footerTest / Test<br>footerTest / Test | FooterFeatureTest_prod<br>FooterFeatureTest_LT<br>FooterFeatureTest_thor<br>FooterFeatureTest_rel<br>FooterFeatureTest_qa |
| `TST_FOOT_TC_2` | ExperienceApp/footer.test.js | **true** | footerTest / Test<br>footerTest / Test<br>footerTest / Test<br>footerTest / Test | FooterFeatureTest_prod<br>FooterFeatureTest_LT<br>FooterFeatureTest_thor<br>FooterFeatureTest_rel<br>FooterFeatureTest_qa |
| `TST_FOOT_TC_3` | ExperienceApp/footer.test.js | **true** | footerTest / Test<br>footerTest / Test<br>footerTest / Test<br>footerTest / Test | FooterFeatureTest_prod<br>FooterFeatureTest_LT<br>FooterFeatureTest_thor<br>FooterFeatureTest_rel<br>FooterFeatureTest_qa |
| `TST_FOOT_TC_4` |  | **true** | **- none -** | - |
| `TST_FOOT_TC_5` |  | **true** | **- none -** | - |
| `TST_FOOT_TC_6` |  | **true** | **- none -** | - |
| `TST_FOOT_TC_7` | ExperienceApp/footer.test.js | **true** | footerTest / Test<br>footerTest / Test<br>footerTest / Test<br>NEMO-24388 / Before<br>footerTest / Test | FooterFeatureTest_prod<br>FooterFeatureTest_LT<br>FooterFeatureTest_thor<br>FooterFeatureTest_rel<br>FooterFeatureTest_qa<br>setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_FOOT_TC_8` |  | **true** | **- none -** | - |
| `TST_FOOT_TC_9` |  | **true** | **- none -** | - |

### GCAT

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_GCAT_TC_1` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / Test | P1AdminGradingCategories_Thor |
| `TST_GCAT_TC_10` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / BeforeEach | P1AdminGradingCategories_Thor |
| `TST_GCAT_TC_2` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / Test | P1AdminGradingCategories_Thor |
| `TST_GCAT_TC_3` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / Test | P1AdminGradingCategories_Thor |
| `TST_GCAT_TC_5` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / Test | P1AdminGradingCategories_Thor |
| `TST_GCAT_TC_6` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / Test | P1AdminGradingCategories_Thor |
| `TST_GCAT_TC_7` | ExperienceApp/adminGradingCategories.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_GCAT_TC_8` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / Test | P1AdminGradingCategories_Thor |
| `TST_GCAT_TC_9` | ExperienceApp/adminGradingCategories.test.js | false | adminGradingCategories / Test | P1AdminGradingCategories_Thor |

### GLOB

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_GLOB_TC_10` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_11` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_12` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_13` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_14` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_15` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_16` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_19` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_20` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_21` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_22` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_23` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_24` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_25` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_26` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_28` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_36` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_37` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_38` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_41` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_42` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_53` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_57` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_58` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_59` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_60` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_61` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_62` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_63` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_64` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_65` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_66` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_67` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_68` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_69` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_70` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_71` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_72` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_73` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_75` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_76` |  | **true** | **- none -** | - |
| `TST_GLOB_TC_77` |  | **true** | **- none -** | - |

### GRADEBOOK

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_GRADEBOOK_TC_1` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_10` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_11` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_12` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_13` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_14` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_15` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_16` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_17` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_2` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_3` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_4` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_5` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_6` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_7` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_8` |  | false | **- none -** | - |
| `TST_GRADEBOOK_TC_9` |  | false | **- none -** | - |

### GSCL

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_GSCL_TC_1` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_10` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_11` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_12` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_13` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / BeforeEach<br>adminGradingScales / After | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_2` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_3` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_5` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_6` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_7` | ExperienceApp/adminGradingScales.test.js | false | adminClassGradeSettings / Test | P1AdminClassGradeSettings_Thor |
| `TST_GSCL_TC_8` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |
| `TST_GSCL_TC_9` | ExperienceApp/adminGradingScales.test.js | false | adminGradingScales / Test | P1AdminGradingScales_Thor |

### HYPE

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_HYPE_TC_1` | ExperienceApp/eBook.test.js | - | **- none -** | - |
| `TST_HYPE_TC_2` | ExperienceApp/eBook.test.js | - | **- none -** | - |
| `TST_HYPE_TC_3` | ExperienceApp/eBook.test.js | - | **- none -** | - |
| `TST_HYPE_TC_4` | ExperienceApp/eBook.test.js | - | **- none -** | - |

### ICCA

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ICCA_TC_17` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_22` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_24` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_25` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_3` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_31` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_33` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_34` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_4` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_5` |  | **true** | **- none -** | - |
| `TST_ICCA_TC_6` |  | **true** | **- none -** | - |

### ICCE

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ICCE_TC_1` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_100` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_101` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_102` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_103` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_104` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_11` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_12` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_13` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_14` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_17` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_18` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_19` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_2` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_21` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_3` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_31` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_32` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_33` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_34` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_35` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_36` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_37` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_4` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_40` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_41` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_42` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_45` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_46` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_47` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_48` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_49` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_5` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_50` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_52` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_54` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_6` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_60` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_61` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_62` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_63` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_64` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_65` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_66` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_67` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_68` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_69` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_7` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_70` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_71` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_72` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_73` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_74` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_75` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_76` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_77` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_78` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_79` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_8` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_80` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_81` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_82` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_83` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_84` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_85` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_86` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_87` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_88` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_89` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_9` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_90` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_91` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_92` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_93` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_94` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_95` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_96` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_97` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_98` |  | **true** | **- none -** | - |
| `TST_ICCE_TC_99` |  | **true** | **- none -** | - |

### ICCL

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ICCL_TC_1` |  | false | **- none -** | - |
| `TST_ICCL_TC_10` |  | false | **- none -** | - |
| `TST_ICCL_TC_11` |  | false | **- none -** | - |
| `TST_ICCL_TC_12` |  | false | **- none -** | - |
| `TST_ICCL_TC_13` |  | false | **- none -** | - |
| `TST_ICCL_TC_14` |  | false | **- none -** | - |
| `TST_ICCL_TC_15` |  | false | **- none -** | - |
| `TST_ICCL_TC_16` |  | false | **- none -** | - |
| `TST_ICCL_TC_17` |  | false | **- none -** | - |
| `TST_ICCL_TC_18` |  | false | **- none -** | - |
| `TST_ICCL_TC_19` |  | false | **- none -** | - |
| `TST_ICCL_TC_2` |  | false | **- none -** | - |
| `TST_ICCL_TC_20` |  | false | **- none -** | - |
| `TST_ICCL_TC_21` |  | false | **- none -** | - |
| `TST_ICCL_TC_22` |  | false | **- none -** | - |
| `TST_ICCL_TC_23` |  | false | **- none -** | - |
| `TST_ICCL_TC_24` |  | false | **- none -** | - |
| `TST_ICCL_TC_25` |  | false | **- none -** | - |
| `TST_ICCL_TC_26` |  | false | **- none -** | - |
| `TST_ICCL_TC_27` |  | false | **- none -** | - |
| `TST_ICCL_TC_28` |  | false | **- none -** | - |
| `TST_ICCL_TC_3` |  | false | **- none -** | - |
| `TST_ICCL_TC_4` |  | false | **- none -** | - |
| `TST_ICCL_TC_5` |  | false | **- none -** | - |
| `TST_ICCL_TC_6` |  | **true** | **- none -** | - |
| `TST_ICCL_TC_7` |  | false | **- none -** | - |
| `TST_ICCL_TC_8` |  | false | **- none -** | - |
| `TST_ICCL_TC_9` |  | false | **- none -** | - |

### ICCM

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ICCM_TC_10` |  | false | **- none -** | - |
| `TST_ICCM_TC_11` |  | false | **- none -** | - |
| `TST_ICCM_TC_12` |  | false | **- none -** | - |
| `TST_ICCM_TC_13` |  | false | **- none -** | - |
| `TST_ICCM_TC_14` |  | false | **- none -** | - |
| `TST_ICCM_TC_15` |  | false | **- none -** | - |
| `TST_ICCM_TC_16` |  | false | **- none -** | - |
| `TST_ICCM_TC_17` |  | false | **- none -** | - |
| `TST_ICCM_TC_18` |  | false | **- none -** | - |
| `TST_ICCM_TC_19` |  | false | **- none -** | - |
| `TST_ICCM_TC_2` |  | false | **- none -** | - |
| `TST_ICCM_TC_20` |  | false | **- none -** | - |
| `TST_ICCM_TC_21` |  | false | **- none -** | - |
| `TST_ICCM_TC_22` |  | false | **- none -** | - |
| `TST_ICCM_TC_23` |  | false | **- none -** | - |
| `TST_ICCM_TC_24` |  | false | **- none -** | - |
| `TST_ICCM_TC_25` |  | false | **- none -** | - |
| `TST_ICCM_TC_26` |  | false | **- none -** | - |
| `TST_ICCM_TC_27` |  | false | **- none -** | - |
| `TST_ICCM_TC_28` |  | false | **- none -** | - |
| `TST_ICCM_TC_29` |  | false | **- none -** | - |
| `TST_ICCM_TC_3` |  | false | **- none -** | - |
| `TST_ICCM_TC_30` |  | false | **- none -** | - |
| `TST_ICCM_TC_31` |  | false | **- none -** | - |
| `TST_ICCM_TC_32` |  | false | **- none -** | - |
| `TST_ICCM_TC_33` |  | false | **- none -** | - |
| `TST_ICCM_TC_34` |  | false | **- none -** | - |
| `TST_ICCM_TC_35` |  | false | **- none -** | - |
| `TST_ICCM_TC_4` |  | false | **- none -** | - |
| `TST_ICCM_TC_5` |  | false | **- none -** | - |
| `TST_ICCM_TC_6` |  | false | **- none -** | - |
| `TST_ICCM_TC_7` |  | false | **- none -** | - |
| `TST_ICCM_TC_8` |  | false | **- none -** | - |
| `TST_ICCM_TC_9` |  | false | **- none -** | - |

### ICCT

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_ICCT_TC_1` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_10` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_11` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_12` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_13` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_14` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_2` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_3` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_4` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_5` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_6` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_7` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_8` |  | **true** | **- none -** | - |
| `TST_ICCT_TC_9` |  | **true** | **- none -** | - |

### IDEN

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_IDEN_TC_2` | ExperienceApp/login.test.js | **true** | loginTest / Test<br>loginTest / Test<br>loginTest / Test<br>loginTest / Test | loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari |

### INVI

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_INVI_TC_1` | ExperienceApp/invitationNotification.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_INVI_TC_2` | ExperienceApp/invitationNotification.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_INVI_TC_3` | ExperienceApp/invitationNotification.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_INVI_TC_4` | ExperienceApp/invitationNotification.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_INVI_TC_5` | ExperienceApp/invitationNotification.test.js | **true** | createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test<br>createNewClassWithStudent / Test | createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel |
| `TST_INVI_TC_6` | ExperienceApp/invitationNotification.test.js | **true** | **- none -** | - |

### KBOA

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_KBOA_TC_1` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_10` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_11` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_12` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_13` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_14` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_15` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_16` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_17` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_18` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_19` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_2` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_3` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_4` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_5` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_6` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_7` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_8` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |
| `TST_KBOA_TC_9` | ExperienceApp/ebookFocusA11y.test.js | false | ebookFocusA11yTest / Test | ebookFocusA11yTest_thor |

### LAND

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_LAND_TC_1` | ExperienceApp/landing.test.js | **true** | **- none -** | - |
| `TST_LAND_TC_2` | ExperienceApp/landing.test.js | **true** | landingTest / Test<br>landingTest / Test<br>landingTest / Test<br>landingTest / Test | landingFeatureTest_prod<br>landingFeatureTest_LT<br>landingFeatureTest_thor<br>landingFeatureTest_rel<br>landingFeatureTest_qa |
| `TST_LAND_TC_3` | ExperienceApp/landing.test.js | **true** | activeClass / Before<br>c1assignment / Before<br>c1assignment / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTest_rg / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC_V.1.0 / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>highlighterTest / Before<br>landingTest / Test<br>loginTest / Before<br>loginTest / Before<br>loginTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>resetPassword / Before<br>resetPassword / Before<br>testPurposeonly / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>highlighterTest / Before<br>landingTest / Test<br>loginTest / Before<br>loginTest / Before<br>loginTest / Before<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>highlighterTest / Before<br>landingTest / Test<br>loginTest / Before<br>loginTest / Before<br>loginTest / Before<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>NEMO-24306_csvUpload / Before<br>NEMO-24306_csvUpload / Before<br>NEMO-24388 / Before<br>activeClass / Before<br>adminClassGradeSettings / Before<br>adminClassesTab / Before<br>adminGradingCategories / Before<br>adminGradingScales / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookToolbarFocusTest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>highlighterTest / Before<br>landingTest / Test<br>loginTest / Before<br>loginTest / Before<br>loginTest / Before<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>schoolAdminAddClass / Before<br>schoolAdminAddClassBulk / Before<br>schoolAdminAddClassBulkCreateCSV / Before<br>schoolAdminAddClassValidation / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | deleteClassTest_prod<br>deleteClassTest_LT<br>deleteClassTest_thor<br>deleteClassTest_rel<br>completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel<br>createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel<br>dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa<br>dashboardFeatureTestTeacher_prod<br>dashboardFeatureTestTeacher_LT<br>dashboardFeatureTestTeacher_thor<br>dashboardFeatureTestTeacher_rel<br>drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>FooterFeatureTest_prod<br>FooterFeatureTest_LT<br>FooterFeatureTest_thor<br>FooterFeatureTest_rel<br>FooterFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>landingFeatureTest_prod<br>landingFeatureTest_LT<br>landingFeatureTest_thor<br>landingFeatureTest_rel<br>landingFeatureTest_qa<br>loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>resetPasswordTest_prod<br>resetPasswordTest_LT<br>resetPasswordTest_thor<br>resetPasswordTest_rel<br>timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel<br>manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel<br>NEMO24306_csvUploadTest_thor<br>setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor<br>P1AdminClassGradeSettings_Thor<br>P1AdminClassesTab_Thor<br>P1AdminGradingCategories_Thor<br>P1AdminGradingScales_Thor<br>ebookFocusA11yTest_thor<br>ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor<br>ebooksE2ETest_thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor<br>P1AdminclassValidation_Thor |
| `TST_LAND_TC_4` | ExperienceApp/landing.test.js | **true** | landingTest / Test<br>landingTest / Test<br>landingTest / Test<br>landingTest / Test | landingFeatureTest_prod<br>landingFeatureTest_LT<br>landingFeatureTest_thor<br>landingFeatureTest_rel<br>landingFeatureTest_qa |
| `TST_LAND_TC_5` | ExperienceApp/landing.test.js | **true** | footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>landingTest / Test<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>landingTest / Test<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>landingTest / Test<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>footerTest / Before<br>landingTest / Test | FooterFeatureTest_prod<br>FooterFeatureTest_LT<br>FooterFeatureTest_thor<br>FooterFeatureTest_rel<br>FooterFeatureTest_qa<br>landingFeatureTest_prod<br>landingFeatureTest_LT<br>landingFeatureTest_thor<br>landingFeatureTest_rel<br>landingFeatureTest_qa |

### LOGI

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_LOGI_TC_1` | ExperienceApp/login.test.js | **true** | activeClass / Before<br>c1assignment / Before<br>c1assignment / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTest_rg / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC_V.1.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>testPurposeonly / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>NEMO-24306_csvUpload / Before<br>NEMO-24306_csvUpload / Before<br>NEMO-24388 / Before<br>activeClass / Before<br>adminClassGradeSettings / Before<br>adminClassesTab / Before<br>adminGradingCategories / Before<br>adminGradingScales / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookToolbarFocusTest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>schoolAdminAddClass / Before<br>schoolAdminAddClassBulk / Before<br>schoolAdminAddClassBulkCreateCSV / Before<br>schoolAdminAddClassValidation / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | deleteClassTest_prod<br>deleteClassTest_LT<br>deleteClassTest_thor<br>deleteClassTest_rel<br>completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel<br>createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel<br>dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa<br>dashboardFeatureTestTeacher_prod<br>dashboardFeatureTestTeacher_LT<br>dashboardFeatureTestTeacher_thor<br>dashboardFeatureTestTeacher_rel<br>drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel<br>manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel<br>NEMO24306_csvUploadTest_thor<br>setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor<br>P1AdminClassGradeSettings_Thor<br>P1AdminClassesTab_Thor<br>P1AdminGradingCategories_Thor<br>P1AdminGradingScales_Thor<br>ebookFocusA11yTest_thor<br>ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor<br>ebooksE2ETest_thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor<br>P1AdminclassValidation_Thor |
| `TST_LOGI_TC_2` | ExperienceApp/login.test.js | **true** | activeClass / Before<br>c1assignment / Before<br>c1assignment / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTest_rg / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC_V.1.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>testPurposeonly / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>NEMO-24306_csvUpload / Before<br>NEMO-24306_csvUpload / Before<br>NEMO-24388 / Before<br>activeClass / Before<br>adminClassGradeSettings / Before<br>adminClassesTab / Before<br>adminGradingCategories / Before<br>adminGradingScales / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookToolbarFocusTest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>schoolAdminAddClass / Before<br>schoolAdminAddClassBulk / Before<br>schoolAdminAddClassBulkCreateCSV / Before<br>schoolAdminAddClassValidation / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | deleteClassTest_prod<br>deleteClassTest_LT<br>deleteClassTest_thor<br>deleteClassTest_rel<br>completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel<br>createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel<br>dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa<br>dashboardFeatureTestTeacher_prod<br>dashboardFeatureTestTeacher_LT<br>dashboardFeatureTestTeacher_thor<br>dashboardFeatureTestTeacher_rel<br>drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel<br>manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel<br>NEMO24306_csvUploadTest_thor<br>setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor<br>P1AdminClassGradeSettings_Thor<br>P1AdminClassesTab_Thor<br>P1AdminGradingCategories_Thor<br>P1AdminGradingScales_Thor<br>ebookFocusA11yTest_thor<br>ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor<br>ebooksE2ETest_thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor<br>P1AdminclassValidation_Thor |
| `TST_LOGI_TC_3` | ExperienceApp/login.test.js | - | **- none -** | - |
| `TST_LOGI_TC_4` | ExperienceApp/login.test.js | **true** | loginTest / Test<br>resetPassword / Before<br>resetPassword / Before<br>loginTest / Test<br>loginTest / Test<br>loginTest / Test | loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari<br>resetPasswordTest_prod<br>resetPasswordTest_LT<br>resetPasswordTest_thor<br>resetPasswordTest_rel |
| `TST_LOGI_TC_5` | ExperienceApp/login.test.js | false | activeClass / Before<br>c1assignment / Before<br>c1assignment / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTest_rg / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC / Before<br>ebookLearningHyperlinkVC_V.1.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>testPurposeonly / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>NEMO-24388 / Before<br>activeClass / Before<br>c1assignment copy / Before<br>c1assignment copy / Before<br>c1completeAssignment / Before<br>c1completeAssignment / Before<br>c1createAssignment / Before<br>c1deleteAssignment / Before<br>c1student / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClass / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>createNewClassWithStudent / Before<br>dashboardTest_Teacher / Before<br>drawingTool / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>eBookTestMaster_v.0 / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookFocusA11yTest / Before<br>ebookToolbarFocusTest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>ebooksE2ETest / Before<br>highlighterTest / Before<br>loginTest / Test<br>manageReportsTest / Before<br>nextPreviousPageButtonTest / Before<br>notesTest / Before<br>player / Before<br>timerTest_VC / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before<br>toolsFeatureTest / Before | deleteClassTest_prod<br>deleteClassTest_LT<br>deleteClassTest_thor<br>deleteClassTest_rel<br>completeAssignmentFeatureTest_prod<br>completeAssignmentFeatureTest_LT<br>completeAssignmentFeatureTest_thor<br>completeAssignmentFeatureTest_rel<br>createAssignmentFeatureTest_prod<br>createAssignmentFeatureTest_LT<br>createAssignmentFeatureTest_thor<br>createAssignmentFeatureTest_rel<br>deleteAssignmentFeatureTest_prod<br>deleteAssignmentFeatureTest_LT<br>deleteAssignmentFeatureTest_thor<br>deleteAssignmentFeatureTest_rel<br>createNewClassTest_prod<br>createNewClassTest_LT<br>createNewClassTest_thor<br>createNewClassTest_rel<br>dashboardFeatureTest_prod<br>dashboardFeatureTest_LT<br>dashboardFeatureTest_thor<br>dashboardFeatureTest_rel<br>dashboardFeatureTest_qa<br>dashboardFeatureTestTeacher_prod<br>dashboardFeatureTestTeacher_LT<br>dashboardFeatureTestTeacher_thor<br>dashboardFeatureTestTeacher_rel<br>drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>visualAcceptance_prod<br>highlighterFeatureTest_prod<br>highlighterFeatureTest_LT<br>visualAcceptance_thor<br>highlighterFeatureTest_thor<br>visualAcceptance_rel<br>highlighterFeatureTest_rel<br>visualAcceptance_qa<br>highlighterFeatureTest_qa<br>loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari<br>nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>studentAssignmentFeatureTest_prod<br>studentAssignmentFeatureTest_LT<br>studentAssignmentFeatureTest_thor<br>studentAssignmentFeatureTest_rel<br>manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel<br>setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor<br>ebookFocusA11yTest_thor<br>ebookToolbarFocusTest_thor<br>ebookToolbarFocusTestVisual_thor<br>ebooksE2ETest_thor |
| `TST_LOGI_TC_6` | ExperienceApp/login.test.js | **true** | loginTest / Test<br>loginTest / Test<br>loginTest / Test<br>loginTest / Test | loginFeatureTest_prod<br>loginFeatureTest_LT<br>loginFeatureTest_thor<br>loginFeatureTest_rel<br>loginFeatureTest_qa<br>loginFeatureTest_LTmobile<br>poc:thor<br>loginFeatureTest_LT_safari |

### MRPT

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_MRPT_TC_1` | ExperienceApp/manageReports.test.js | false | manageReportsTest / Test<br>manageReportsTest / Test<br>manageReportsTest / Test | manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel |
| `TST_MRPT_TC_2` | ExperienceApp/manageReports.test.js | false | manageReportsTest / Test<br>manageReportsTest / Test<br>manageReportsTest / Test | manageReportsTest_thor<br>manageReportsTest_qa<br>manageReportsTest_rel |

### NEMO24306

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_NEMO24306_TC_1` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_10` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_11` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_12` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_13` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_14` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_15` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_16` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_17` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_18` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_2` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_3` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_4` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_5` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_6` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_7` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_8` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_9` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Test | NEMO24306_csvUploadTest_thor |
| `TST_NEMO24306_TC_LOGIN` | ExperienceApp/nemoUploadCsvValidation.test.js | false | NEMO-24306_csvUpload / Before<br>NEMO-24306_csvUpload / Before<br>adminClassGradeSettings / Before<br>adminClassesTab / Before<br>adminGradingCategories / Before<br>adminGradingScales / Before<br>schoolAdminAddClass / Before<br>schoolAdminAddClassBulk / Before<br>schoolAdminAddClassBulkCreateCSV / Before<br>schoolAdminAddClassValidation / Before | NEMO24306_csvUploadTest_thor<br>P1AdminClassGradeSettings_Thor<br>P1AdminClassesTab_Thor<br>P1AdminGradingCategories_Thor<br>P1AdminGradingScales_Thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor<br>P1AdminclassValidation_Thor |

### NEMO24401

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_NEMO24401_TC_1` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_10` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_11` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_12` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_13` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_14` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_15` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_16` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_17` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_18` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_19` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_2` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_20` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_21` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_3` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_4` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_5` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_6` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_7` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_8` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |
| `TST_NEMO24401_TC_9` | Builder/cloneComponent.test.js | false | cloneComponentTest / Test<br>cloneComponentTest / Test | BuilderCloneComponentTest_thor<br>BuilderCloneComponentTest_qa |

### NEMO24402

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_NEMO24402_TC_1` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_10` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_11` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_12` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_13` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_14` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_15` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_16` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_17` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_18` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_19` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_2` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_20` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_21` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_3` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_4` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_5` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_6` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_7` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_8` | Builder/cloneEbook.test.js | false | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |
| `TST_NEMO24402_TC_9` | Builder/cloneEbook.test.js | **true** | cloneEbookTest / Test<br>cloneEbookTest / Test | BuilderCloneEbookTest_thor<br>BuilderCloneEbookTest_qa |

### NOTE

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_NOTE_TC_1` | ExperienceApp/notes.test.js | **true** | eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>notesTest / Test<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_NOTE_TC_2` | ExperienceApp/notes.test.js | **true** | **- none -** | - |
| `TST_NOTE_TC_3` | ExperienceApp/notes.test.js | **true** | eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>notesTest / Test<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_NOTE_TC_4` | ExperienceApp/notes.test.js | **true** | eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>notesTest / Test<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_NOTE_TC_5` | ExperienceApp/notes.test.js | **true** | **- none -** | - |
| `TST_NOTE_TC_6` | ExperienceApp/notes.test.js | false | eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>notesTest / Test<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_NOTE_TC_7` | ExperienceApp/notes.test.js | **true** | eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>notesTest / Test<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_NOTE_TC_8` | ExperienceApp/notes.test.js | **true** | eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>notesTest / Test<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_NOTE_TC_9` | ExperienceApp/notes.test.js | **true** | eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>notesTest / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>eBookTestMaster_v.0 / Test<br>eBookTestMaster_v.0 / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>notesTest / Test<br>notesTest / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test | eBookFeatureTest_prod<br>eBookFeatureTest_LT<br>eBookFeatureTest_thor<br>eBookFeatureTest_rel<br>eBookFeatureTest_qa<br>notesFeatureTest_prod<br>notesFeatureTest_LT<br>notesFeatureTest_thor<br>notesFeatureTest_rel<br>notesFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |

### NTCH

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_NTCH_TC_1` | ExperienceApp/numberOfTeachers.test.js | false | **- none -** | - |
| `TST_NTCH_TC_2` | ExperienceApp/numberOfTeachers.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_NTCH_TC_3` | ExperienceApp/numberOfTeachers.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### OPEN

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_OPEN_TC_1` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_11` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_12` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_13` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_14` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_16` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_2` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_23` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_24` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_3` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_4` |  | **true** | **- none -** | - |
| `TST_OPEN_TC_6` |  | **true** | **- none -** | - |

### PAGE

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_PAGE_TC_1` | ExperienceApp/eBook.test.js | **true** | ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After | nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_PAGE_TC_2` | ExperienceApp/eBook.test.js | **true** | ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After | nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_PAGE_TC_3` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_PAGE_TC_4` | ExperienceApp/eBook.test.js | **true** | ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>ebookLearningHyperlinkVC_V.1.0 / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>nextPreviousPageButtonTest / Test<br>nextPreviousPageButtonTest / After<br>player / Test<br>player / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / After | nextPreviousPageTest_prod<br>nextPreviousPageTest_LT<br>nextPreviousPageTest_thor<br>nextPreviousPageTest_rel<br>nextPreviousPageTest_qa<br>eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_PAGE_TC_5` | ExperienceApp/eBook.test.js | **true** | **- none -** | - |
| `TST_PAGE_TC_6` | ExperienceApp/eBook.test.js | - | **- none -** | - |

### PLAY

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_PLAY_TC_1` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_10` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_11` | ExperienceApp/player.test.js | - | **- none -** | - |
| `TST_PLAY_TC_2` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_3` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_4` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_5` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_6` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_7` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_8` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |
| `TST_PLAY_TC_9` | ExperienceApp/player.test.js | **true** | player / Test<br>player / Test<br>player / Test<br>ebooksE2ETest / Test<br>player / Test | eBookHotLinkTest_prod<br>eBookHotLinkTest_LT<br>eBookHotLinkTest_thor<br>eBookHotLinkTest_rel<br>eBookHotLinkTest_qa<br>ebooksE2ETest_thor |

### PLIS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_PLIS_TC_1` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_10` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_11` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_12` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_13` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_2` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_3` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_4` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_5` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_6` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_7` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_8` |  | **true** | **- none -** | - |
| `TST_PLIS_TC_9` |  | **true** | **- none -** | - |

### RESE

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_RESE_TC_1` | ExperienceApp/resetPassword.test.js | **true** | resetPassword / Test | resetPasswordTest_prod<br>resetPasswordTest_LT<br>resetPasswordTest_thor<br>resetPasswordTest_rel |
| `TST_RESE_TC_2` | ExperienceApp/resetPassword.test.js | **true** | resetPassword / Test | resetPasswordTest_prod<br>resetPasswordTest_LT<br>resetPasswordTest_thor<br>resetPasswordTest_rel |
| `TST_RESE_TC_3` | ExperienceApp/resetPassword.test.js | **true** | resetPassword / Test | resetPasswordTest_prod<br>resetPasswordTest_LT<br>resetPasswordTest_thor<br>resetPasswordTest_rel |
| `TST_RESE_TC_4` | ExperienceApp/resetPassword.test.js | **true** | resetPassword / Test | resetPasswordTest_prod<br>resetPasswordTest_LT<br>resetPasswordTest_thor<br>resetPasswordTest_rel |
| `TST_RESE_TC_5` | ExperienceApp/resetPassword.test.js | **true** | resetPassword / Test | resetPasswordTest_prod<br>resetPasswordTest_LT<br>resetPasswordTest_thor<br>resetPasswordTest_rel |

### SADB

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SADB_TC_1` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>adminClassesTab / Before<br>adminGradingCategories / Before<br>adminGradingScales / Before<br>schoolAdminAddClass / Test<br>schoolAdminAddClassBulk / Test<br>schoolAdminAddClassBulkCreateCSV / Test<br>schoolAdminAddClassValidation / Test | P1AdminClassGradeSettings_Thor<br>P1AdminClassesTab_Thor<br>P1AdminGradingCategories_Thor<br>P1AdminGradingScales_Thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor<br>P1AdminclassValidation_Thor |

### SADR

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SADR_TC_1` | ExperienceApp/schoolAddress.test.js | false | **- none -** | - |
| `TST_SADR_TC_2` | ExperienceApp/schoolAddress.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_SADR_TC_3` | ExperienceApp/schoolAddress.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### SCLS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SCLS_TC_1` | ExperienceApp/schoolAdminAddClass.test.js | false | schoolAdminAddClass / Test | P1Adminclassworkflow_Thor |
| `TST_SCLS_TC_2` | ExperienceApp/schoolAdminAddClass.test.js | false | adminClassGradeSettings / Test<br>schoolAdminAddClass / Test<br>schoolAdminAddClass / Test<br>schoolAdminAddClassBulk / Test<br>schoolAdminAddClassBulkCreateCSV / Test<br>schoolAdminAddClassValidation / Test | P1AdminClassGradeSettings_Thor<br>P1Adminclassworkflow_Thor<br>P1AdminclassBulk_Thor<br>P1AdminclassBulkCreateCSV_Thor<br>P1AdminclassValidation_Thor |

### SCON

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SCON_TC_1` | ExperienceApp/schoolContactDetails.test.js | false | **- none -** | - |
| `TST_SCON_TC_2` | ExperienceApp/schoolContactDetails.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_SCON_TC_3` | ExperienceApp/schoolContactDetails.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### SCTY

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SCTY_TC_1` | ExperienceApp/schoolType.test.js | false | **- none -** | - |
| `TST_SCTY_TC_2` | ExperienceApp/schoolType.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_SCTY_TC_3` | ExperienceApp/schoolType.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### SETT

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SETT_TC_1` |  | **true** | **- none -** | - |
| `TST_SETT_TC_10` |  | **true** | **- none -** | - |
| `TST_SETT_TC_11` |  | **true** | **- none -** | - |
| `TST_SETT_TC_12` |  | **true** | **- none -** | - |
| `TST_SETT_TC_13` |  | **true** | **- none -** | - |
| `TST_SETT_TC_14` |  | **true** | **- none -** | - |
| `TST_SETT_TC_15` |  | **true** | **- none -** | - |
| `TST_SETT_TC_16` |  | **true** | **- none -** | - |
| `TST_SETT_TC_17` |  | **true** | **- none -** | - |
| `TST_SETT_TC_18` |  | **true** | **- none -** | - |
| `TST_SETT_TC_19` |  | **true** | **- none -** | - |
| `TST_SETT_TC_2` |  | **true** | **- none -** | - |
| `TST_SETT_TC_23` |  | **true** | **- none -** | - |
| `TST_SETT_TC_24` |  | **true** | **- none -** | - |
| `TST_SETT_TC_25` |  | **true** | **- none -** | - |
| `TST_SETT_TC_26` |  | **true** | **- none -** | - |
| `TST_SETT_TC_27` |  | **true** | **- none -** | - |
| `TST_SETT_TC_28` |  | **true** | **- none -** | - |
| `TST_SETT_TC_29` |  | **true** | **- none -** | - |
| `TST_SETT_TC_3` |  | **true** | **- none -** | - |
| `TST_SETT_TC_37` |  | **true** | **- none -** | - |
| `TST_SETT_TC_4` |  | **true** | **- none -** | - |
| `TST_SETT_TC_40` |  | **true** | **- none -** | - |
| `TST_SETT_TC_5` |  | **true** | **- none -** | - |
| `TST_SETT_TC_54` |  | **true** | **- none -** | - |
| `TST_SETT_TC_55` |  | **true** | **- none -** | - |
| `TST_SETT_TC_56` |  | **true** | **- none -** | - |
| `TST_SETT_TC_57` |  | **true** | **- none -** | - |
| `TST_SETT_TC_58` |  | **true** | **- none -** | - |
| `TST_SETT_TC_59` |  | **true** | **- none -** | - |
| `TST_SETT_TC_6` |  | **true** | **- none -** | - |
| `TST_SETT_TC_60` |  | **true** | **- none -** | - |
| `TST_SETT_TC_61` |  | **true** | **- none -** | - |
| `TST_SETT_TC_7` |  | **true** | **- none -** | - |
| `TST_SETT_TC_8` |  | **true** | **- none -** | - |
| `TST_SETT_TC_9` |  | **true** | **- none -** | - |

### SHOW

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SHOW_TC_1` | ExperienceApp/showHideSelection.test.js | false | drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>ebooksE2ETest / Test<br>toolsFeatureTest / Test | drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_SHOW_TC_2` | ExperienceApp/showHideSelection.test.js | false | drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>ebooksE2ETest / Test<br>toolsFeatureTest / Test | drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_SHOW_TC_3` | ExperienceApp/showHideSelection.test.js | false | drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>toolsFeatureTest / Test<br>drawingTool / Test<br>ebooksE2ETest / Test<br>toolsFeatureTest / Test | drawingFeatureTest_prod<br>drawingFeatureTest_LT<br>drawingFeatureTest_thor<br>drawingFeatureTest_rel<br>drawingFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_SHOW_TC_4` | ExperienceApp/showHideSelection.test.js | false | **- none -** | - |

### SLCTACTIVITY

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SLCTACTIVITY_TC_1` |  | **true** | **- none -** | - |
| `TST_SLCTACTIVITY_TC_2` |  | **true** | **- none -** | - |
| `TST_SLCTACTIVITY_TC_3` |  | **true** | **- none -** | - |
| `TST_SLCTACTIVITY_TC_4` |  | **true** | **- none -** | - |

### SLOC

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SLOC_TC_1` | ExperienceApp/schoolLocation.test.js | false | **- none -** | - |
| `TST_SLOC_TC_2` | ExperienceApp/schoolLocation.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_SLOC_TC_3` | ExperienceApp/schoolLocation.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### SNAM

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SNAM_TC_1` | ExperienceApp/schoolName.test.js | false | **- none -** | - |
| `TST_SNAM_TC_2` | ExperienceApp/schoolName.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_SNAM_TC_3` | ExperienceApp/schoolName.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### SNUP

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SNUP_TC_1` |  | false | **- none -** | - |
| `TST_SNUP_TC_10` |  | false | **- none -** | - |
| `TST_SNUP_TC_11` |  | false | **- none -** | - |
| `TST_SNUP_TC_12` |  | false | **- none -** | - |
| `TST_SNUP_TC_13` |  | false | **- none -** | - |
| `TST_SNUP_TC_14` |  | false | **- none -** | - |
| `TST_SNUP_TC_16` |  | false | **- none -** | - |
| `TST_SNUP_TC_17` |  | false | **- none -** | - |
| `TST_SNUP_TC_19` |  | false | **- none -** | - |
| `TST_SNUP_TC_2` |  | false | **- none -** | - |
| `TST_SNUP_TC_20` |  | false | **- none -** | - |
| `TST_SNUP_TC_21` |  | false | **- none -** | - |
| `TST_SNUP_TC_22` |  | false | **- none -** | - |
| `TST_SNUP_TC_23` |  | false | **- none -** | - |
| `TST_SNUP_TC_24` |  | false | **- none -** | - |
| `TST_SNUP_TC_25` |  | false | **- none -** | - |
| `TST_SNUP_TC_3` |  | false | **- none -** | - |
| `TST_SNUP_TC_31` |  | false | **- none -** | - |
| `TST_SNUP_TC_32` |  | false | **- none -** | - |
| `TST_SNUP_TC_37` |  | false | **- none -** | - |
| `TST_SNUP_TC_39` |  | false | **- none -** | - |
| `TST_SNUP_TC_4` |  | false | **- none -** | - |
| `TST_SNUP_TC_5` |  | false | **- none -** | - |
| `TST_SNUP_TC_54` |  | false | **- none -** | - |
| `TST_SNUP_TC_55` |  | false | **- none -** | - |
| `TST_SNUP_TC_56` |  | false | **- none -** | - |
| `TST_SNUP_TC_57` |  | false | **- none -** | - |
| `TST_SNUP_TC_58` |  | false | **- none -** | - |
| `TST_SNUP_TC_6` |  | false | **- none -** | - |
| `TST_SNUP_TC_7` |  | false | **- none -** | - |
| `TST_SNUP_TC_9` |  | false | **- none -** | - |

### SRQS

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SRQS_TC_1` | ExperienceApp/schoolRequestSummary.test.js | false | **- none -** | - |

### SUSA

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_SUSA_TC_1` | ExperienceApp/setupSchoolAccount.test.js | **true** | NEMO-24388 / Test<br>NEMO-24388 / Test<br>NEMO-24388 / Test<br>NEMO-24388 / Test<br>NEMO-24388 / Test<br>NEMO-24388 / Test<br>NEMO-24388 / Test<br>NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |
| `TST_SUSA_TC_2` | ExperienceApp/setupSchoolAccount.test.js | false | NEMO-24388 / Test | setUpSchoolAccountTest_thor<br>visualAcceptance_setUpSchoolAccount_thor |

### TIME

| TC | Test file | Visual | Suites (exec file / hook) | npm script |
|---|---|---|---|---|
| `TST_TIME_TC_1` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_10` | ExperienceApp/timer.test.js | **true** | **- none -** | - |
| `TST_TIME_TC_11` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_12` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_13` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_14` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_15` | ExperienceApp/timer.test.js | **true** | **- none -** | - |
| `TST_TIME_TC_16` | ExperienceApp/timer.test.js | **true** | **- none -** | - |
| `TST_TIME_TC_2` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_3` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_4` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_5` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_6` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_7` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |
| `TST_TIME_TC_8` | ExperienceApp/timer.test.js | **true** | **- none -** | - |
| `TST_TIME_TC_9` | ExperienceApp/timer.test.js | **true** | timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test<br>ebooksE2ETest / Test<br>timerTest_VC / Test<br>toolsFeatureTest / Test | timerFeatureTest_prod<br>timerFeatureTest_LT<br>timerFeatureTest_thor<br>timerFeatureTest_rel<br>timerFeatureTest_qa<br>toolsFeatureTest_prod<br>toolsFeatureTest_LT<br>toolsFeatureTest_thor<br>toolsFeatureTest_rel<br>toolsFeatureTest_qa<br>ebooksE2ETest_thor |

