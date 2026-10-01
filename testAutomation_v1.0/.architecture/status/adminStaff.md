# Admin Staff tab (ExperienceApp, thor) — `STFL` / `STFP` / `STFB`
Knowledge `admin-staff-tab.md` · register `test/Manual/C1App/AdminApp-Staff/` (57 TCs) · school `FCN-CHZ-PDA`
- **STFL** `adminStaffTabTest_thor` — P1 ✅ · P2 ✅ 2026-09-02 19/19, 2 clean runs · P3 ⏭️ DEFERRED by user · Not built `TC_27` (needs an invited teacher to accept → data-owning suite) · Watch: runtime drifted 77 s → 229 s (environmental) — re-measure rather than raise
- **STFP** `adminStaffProfileTest_thor` — P1 ✅ 2026-09-07 9/9 on three runs · P2 ⬜ · P3 ⬜
  🔒 six cases open a mutating dialog and leave it — never click confirm · Proposed for Phase 2 (awaiting OK): `TST_STFP_TC_RESET` must wait for the Clear link to go, else `TC_16/17` burn the 20 s poll · Blocked `TC_20` (needs a school with one administrator) · Not built `TC_10`, `TC_13`, `TC_18`, `TC_19` (data-owning suite, `AutoStaff_`; never confirm against `testt1@mailsac.com`)
- **STFB** (invitation form) — not started; leave until last (`TC_3` downloads, `TC_9` uploads, `TC_10` sends real email; the form restores a shared draft) · Blocked `TC_11`
- Open product items: `TST_STFL_TC_26` heading count ≠ rendered rows (22 vs 21) · a larger school for Staff? · self-revocation of admin rights by design?
- Found here, unrelated: `manageReportsTest_thor` (MRAC, teacher side) fails 0/2 on `button[qid^="aReport-2-"]` — not investigated `[2026-09-07]`
- ▶ Now: idle since 2026-09-07 · Next: STFP Phase 2 — get the user's OK for the reset fix
