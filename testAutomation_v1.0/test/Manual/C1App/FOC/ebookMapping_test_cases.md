# Manual Functional Test Cases — Cambridge One FOC: Presentation Plus book-to-book page mapping (Batch 1)

**Source:** `FOC-_Web_Mapping Cases.xlsx` — 2 scenarios (TC_FOCMap_web1, TC_FOCMap_web2), both P1 / Positive, no NEMO ticket recorded
**Module:** EMAP (Presentation Plus book mapping) — maps to the `ebookMapping` page object (`pages/ExperienceApp/ebookMapping.page.js`)
**App:** Cambridge One (C1) — `micro-nemo.comprodls.com` (thor), teacher role
**Page in scope:** Presentation Plus reader toolbar → *Change course material* dropdown — `/foc/<org>/class/<classId>/product/<productId>/studentbook/<bookId>/view?page=<page>`
**Generated:** 2026-09-25 | **Total TCs:** 5 (3 Positive · 2 Edge · 0 Negative) — every sheet scenario is covered; 2 derived Edge cases and the owner-stated Book 3 → Book 1 mapping added
**Execution status (2026-09-25):** **3 of 5 TCs automated and passing.**
- Module **EMAP** (`TST_EMAP_TC_1–2, 6`, 3 TCs) — Requirements #1, #2, #4 — via `npm run eBookMappingTest_Thor` on **thor** (2026-09-25).

The remaining **2 TCs are Not Run** (`TST_EMAP_TC_3–4` — derived, expected result unconfirmed, not automated).

**Batches:** Batch 1 — book-to-book page mapping (`TST_EMAP_*`, module EMAP, 5 TCs)

> **Ordering:** test cases are **grouped by Linked Requirement (scenario)**; within each group they run **Positive → Edge → Negative**. **S.No.** is sequential in this grouped order.
>
> **Batch 1 scope (agreed):** the two sheet scenarios plus the owner-stated Book 3 → Book 1 mapping and two derived Edge cases (switching from an unmapped page). Deferred: any mapping other than Book 1 → Book 2 → Book 3, the student view of the mapping, and mapping authoring in Builder.
>
> Unverified expected text is marked `[ASSUMED]`; environment-specific values are the thor fixtures named in Test Data.

**Note — Book 1 start page.** Book 1 opens on its Cover by default (Next page then reaches page ii), but the reader saves the last page visited in Book 1 and can reopen it there. Automation therefore runs a conditional setup before each scenario and a teardown after it: click Previous page until Book 1 is on its Cover.

## Requirement → Test Case coverage map

| Linked Requirement (scenario) | Mapped TC IDs (P → E → N) |
|---|---|
| #1 — TC_FOCMap_web1: Check that Page ii of book1 is going to mapped page ii of second book | TST_EMAP_TC_1 |
| #2 — TC_FOCMap_web2: Check redirection from book2 to Book3 and back to Book2 with mapped page from ii to Cover | TST_EMAP_TC_2 |
| #3 — Switching book from a page that has no mapping | TST_EMAP_TC_3 (E), TST_EMAP_TC_4 (E) |
| #4 — Book 3 page ii is mapped to page ii of Book 1 (and to the Cover of Book 2) | TST_EMAP_TC_6 |

## Product reference (captured live 2026-09-25, thor · teacher CQA_AUTO_TEA_101@mailsac.com · class CQA_AUTO_TEST_DND_1RB)

**Entry path.** Teacher dashboard → class card → **Class Materials** → bundle **EBOOK AUTOMATION 1RB TEST DATA** → **Presentation Plus**. The reader opens in the same tab at `.../product/vm_automation_testing_1rb/studentbook/vm_automation_first_ebook_pplus_1rb/view?page=ii`.

**Reader state.** The current book and page are kept in the address bar (`studentbook/<bookId>` and `?page=`). Book 1 opens on **page ii** (double-page spread, page label `ii-iii / 160`) — not on the Cover. **Next page** moves the spread to `iv-v / 160`. On the Cover the page label reads `- / 160` and the address bar shows `?page=cover`.

**Change course material dropdown** (toolbar, bottom right; button title "Change course material"). Entries, in order: *Teacher's Resources* (opens a new tab), `vm_automation_first_ebook_pplus_1rb` (selected), `vm_automation_second_ebook_pplus_1rb`, `vm_automation_Third_ebook_pplus_1rb dt` (its address-bar id is lower case: `vm_automation_third_ebook_pplus_1rb`). The list order is positional; books are picked by title.

**Observed mapping behaviour** (thor, 2026-09-25, each row on a freshly opened Presentation Plus):

| From | To | Opens on | Times seen |
|---|---|---|---|
| Book 1 page ii | Book 2 | page ii | 4 of 4 |
| Book 2 page ii | Book 1 | Cover | 2 of 2 |
| Book 1 Cover | Book 2 | Cover | 1 of 1 |
| Book 2 page iv (Next page twice from the Cover) | Book 3 | page ii | 3 of 3 (page ii is the mapped page — see TC_2) |
| Book 3 page ii | Book 2 | Cover | 5 of 6 (1 run: reader stayed on Book 3) |
| Book 1 page iv (after Next page) | Book 2 | page iv | 5 of 6 |
| Book 1 page iv (after Next page) | Book 2 | Cover | 1 of 6 (first probe only) |

**Timing.** A book switch completes in under 1–3 s.

## Section — Test Cases (grouped by Linked Requirement)

### Requirement #1 — TC_FOCMap_web1: Check that Page ii of book1 is going to mapped page ii of second book

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_EMAP_TC_1 |
| **Title** | Verify Book 2 opens on page ii and switching back opens the Book 1 Cover when Book 1 page ii is mapped to Book 2 page ii |
| **Linked Requirement** | #1 — TC_FOCMap_web1: Check that Page ii of book1 is going to mapped page ii of second book |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Builder mapping defined: Book 1 (vm_automation_first_ebook_pplus_1rb) page ii -> Book 2 (vm_automation_second_ebook_pplus_1rb) page ii. Teacher CQA_AUTO_TEA_101@mailsac.com has class CQA_AUTO_TEST_DND_1RB with the bundle EBOOK AUTOMATION 1RB TEST DATA. |
| **Test Steps** | 1. Open the application on thor and log in as the teacher CQA_AUTO_TEA_101@mailsac.com. 2. On the teacher dashboard open the class card CQA_AUTO_TEST_DND_1RB, then the Class Materials tab. 3. In the bundle EBOOK AUTOMATION 1RB TEST DATA, open the Presentation Plus component. 4. Confirm Book 1 opened on its Cover (if the reader reopened it on a later page, click Previous page until the Cover is shown). 4a. Slowly click Next page once and wait — the reader moves to page ii. 5. In the toolbar open the Change course material dropdown and select vm_automation_second_ebook_pplus_1rb. 6. Note the book shown in the toolbar and the page the reader opens on. 7. Open the Change course material dropdown again and select vm_automation_first_ebook_pplus_1rb. 8. Note the book shown in the toolbar and the page the reader opens on. |
| **Test Data** | Teacher CQA_AUTO_TEA_101@mailsac.com (password: assignmentLoginData.json -> C1.login.user.validTeacher) · Class CQA_AUTO_TEST_DND_1RB · Books: vm_automation_first_ebook_pplus_1rb -> vm_automation_second_ebook_pplus_1rb |
| **Expected Result** | After step 5 the toolbar shows vm_automation_second_ebook_pplus_1rb and the reader opens on page ii (page label 'ii-iii / 160', address bar ?page=ii). After step 7 the toolbar shows vm_automation_first_ebook_pplus_1rb and the reader opens on the Cover (page label '- / 160', address bar ?page=cover). |
| **Remarks** | Sheet row 1 (TC_FOCMap_web1), P1 Positive. Book 1 opens on its Cover by default, but the reader saves the last page visited in Book 1 and can reopen it there; automation therefore runs a conditional setup (Previous page until the Cover) and a teardown that does the same, per the product owner (2026-09-25). |
| **Actual Result** | Automated run 2026-09-25: Book 2 opened on page ii (label ii-iii / 160); after switching back Book 1 opened on its Cover (?page=cover). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — ebookMapping.test.js, Suite1 (npm run eBookMappingTest_Thor, thor). Last runs 2026-09-25: two consecutive 18/18 passing (incl. Book 1 Cover setup/teardown); an earlier run had one intermittent switch-back failure (Open item 4). |

---

### Requirement #2 — TC_FOCMap_web2: Check redirection from book2 to Book3 and back to Book2 with mapped page from ii to Cover

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_EMAP_TC_2 |
| **Title** | Verify Book 3 opens on page ii and switching back from Book 3 page ii opens the Book 2 Cover when the mapping is defined between Book 2, Book 3 and the Book 2 Cover |
| **Linked Requirement** | #2 — TC_FOCMap_web2: Check redirection from book2 to Book3 and back to Book2 with mapped page from ii to Cover |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Builder mapping defined: Book 2 (vm_automation_second_ebook_pplus_1rb) page ii -> Book 3 (vm_automation_Third_ebook_pplus_1rb dt) page ii, and Book 3 page ii -> Book 2 Cover. Same teacher, class and bundle as TST_EMAP_TC_1. Presentation Plus freshly opened (Book 1 selected). |
| **Test Steps** | 1. Open the application on thor and log in as the teacher CQA_AUTO_TEA_101@mailsac.com. 2. On the teacher dashboard open the class card CQA_AUTO_TEST_DND_1RB, then the Class Materials tab. 3. In the bundle EBOOK AUTOMATION 1RB TEST DATA, open the Presentation Plus component. 4. Confirm Book 1 opened on its Cover (if not, click Previous page until it is). 5. In the toolbar open the Change course material dropdown and select vm_automation_second_ebook_pplus_1rb (it opens on its Cover). 6. Slowly click Next page once in Book 2 and wait — it moves to page ii. 6a. Open the Change course material dropdown and select vm_automation_Third_ebook_pplus_1rb dt. 7. Note the book shown in the toolbar and the page the reader opens on. 8. Open the Change course material dropdown and select vm_automation_second_ebook_pplus_1rb. 9. Note the book shown in the toolbar and the page the reader opens on. |
| **Test Data** | Teacher CQA_AUTO_TEA_101@mailsac.com · Class CQA_AUTO_TEST_DND_1RB · Books: vm_automation_first_ebook_pplus_1rb -> vm_automation_second_ebook_pplus_1rb -> vm_automation_Third_ebook_pplus_1rb dt -> vm_automation_second_ebook_pplus_1rb |
| **Expected Result** | After step 6a the toolbar shows vm_automation_Third_ebook_pplus_1rb dt and the reader opens on page ii (page label 'ii-iii / 160', address bar ?page=ii). After step 8 the toolbar shows vm_automation_second_ebook_pplus_1rb and the reader opens on the Cover (page label '- / 160', address bar ?page=cover). |
| **Remarks** | Sheet row 2 (TC_FOCMap_web2), P1 Positive. Follows the sheet steps literally. Consistent with the mapping: Book 2 Cover -> Next page -> page ii -> Book 3 page ii. In the first automated run (2026-09-25) the final switch back to Book 2 did not take effect within 60 s once; it passed on the two reruns — see Open item 4. |
| **Actual Result** | Automated run 2026-09-25: Book 3 opened on page ii (label ii-iii / 160); after switching back Book 2 opened on its Cover (?page=cover). |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — ebookMapping.test.js, Suite2 (npm run eBookMappingTest_Thor, thor). Last runs 2026-09-25: two consecutive 18/18 passing (incl. Book 1 Cover setup/teardown); an earlier run had one intermittent switch-back failure (Open item 4). |

---

### Requirement #3 — Switching book from a page that has no mapping

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_EMAP_TC_3 |
| **Title** | Verify the target book opens on the expected page when the book is switched from a page that has no mapping |
| **Linked Requirement** | #3 — Switching book from a page that has no mapping |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Same as TST_EMAP_TC_1. Book 1 page iv has no mapping defined in Builder [ASSUMED — only page ii is described in the sheet]. |
| **Test Steps** | 1. Open the application on thor and log in as the teacher CQA_AUTO_TEA_101@mailsac.com. 2. On the teacher dashboard open the class card CQA_AUTO_TEST_DND_1RB, then the Class Materials tab. 3. In the bundle EBOOK AUTOMATION 1RB TEST DATA, open the Presentation Plus component. 4. Click Next page once in Book 1 (page ii -> iv-v). 5. Open the Change course material dropdown and select vm_automation_second_ebook_pplus_1rb. 6. Note the book shown in the toolbar and the page the reader opens on. |
| **Test Data** | Books: vm_automation_first_ebook_pplus_1rb (page iv) -> vm_automation_second_ebook_pplus_1rb |
| **Expected Result** | [ASSUMED] The reader opens vm_automation_second_ebook_pplus_1rb on the page the product owner defines for an unmapped source page. Observed on thor 2026-09-25 (5 of 6 runs): it opens on page iv-v (same page as the source); in 1 of 6 runs it opened on the Cover. |
| **Remarks** | Not in the sheet — derived from the live runs. NOT automated: the expected behaviour for an unmapped page is unconfirmed and the observed result was not stable (Cover once). Confirm the rule, then automate. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_EMAP_TC_4 |
| **Title** | Verify Book 2 opens on its Cover when the switch is made from the Book 1 Cover |
| **Linked Requirement** | #3 — Switching book from a page that has no mapping |
| **Type** | Edge |
| **Priority** | Low |
| **Preconditions** | Same as TST_EMAP_TC_1. No mapping is defined for the Book 1 Cover [ASSUMED]. |
| **Test Steps** | 1. Open the application on thor and log in as the teacher CQA_AUTO_TEA_101@mailsac.com. 2. On the teacher dashboard open the class card CQA_AUTO_TEST_DND_1RB, then the Class Materials tab. 3. In the bundle EBOOK AUTOMATION 1RB TEST DATA, open the Presentation Plus component. 4. Complete TST_EMAP_TC_1 so the reader is on the Book 1 Cover. 5. Open the Change course material dropdown and select vm_automation_second_ebook_pplus_1rb. 6. Note the book shown in the toolbar and the page the reader opens on. |
| **Test Data** | Books: vm_automation_first_ebook_pplus_1rb (Cover) -> vm_automation_second_ebook_pplus_1rb |
| **Expected Result** | [ASSUMED] The toolbar shows vm_automation_second_ebook_pplus_1rb and the reader opens on its Cover (page label '- / 160', address bar ?page=cover). Observed once on thor 2026-09-25. |
| **Remarks** | Not in the sheet — derived from a live probe (single observation). Not automated. |
| **Actual Result** | *(blank in design)* |
| **Status** | Not Run |
| **Comments / Defect ID** | *(blank in design)* |

---

### Requirement #4 — Book 3 page ii is mapped to page ii of Book 1 (and to the Cover of Book 2)

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_EMAP_TC_6 |
| **Title** | Verify Book 1 opens on page ii when Book 3 page ii is mapped to Book 1 page ii |
| **Linked Requirement** | #4 — Book 3 page ii is mapped to page ii of Book 1 (and to the Cover of Book 2) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Builder mapping defined: Book 3 (vm_automation_Third_ebook_pplus_1rb dt) page ii -> Book 1 (vm_automation_first_ebook_pplus_1rb) page ii (and Book 3 page ii -> Book 2 Cover, see TST_EMAP_TC_2). Same teacher, class and bundle as TST_EMAP_TC_1. Presentation Plus freshly opened. |
| **Test Steps** | 1. Open the application on thor and log in as the teacher CQA_AUTO_TEA_101@mailsac.com. 2. On the teacher dashboard open the class card CQA_AUTO_TEST_DND_1RB, then the Class Materials tab. 3. In the bundle EBOOK AUTOMATION 1RB TEST DATA, open the Presentation Plus component. 4. Confirm Book 1 opened on its Cover (if not, click Previous page until it is). 5. In the toolbar open the Change course material dropdown and select vm_automation_second_ebook_pplus_1rb (it opens on its Cover). 6. Slowly click Next page once and wait — Book 2 moves to page ii. 6a. Open the Change course material dropdown and select vm_automation_Third_ebook_pplus_1rb dt — it opens on page ii. 7. Open the Change course material dropdown and select vm_automation_first_ebook_pplus_1rb. 8. Note the book shown in the toolbar and the page the reader opens on. |
| **Test Data** | Teacher CQA_AUTO_TEA_101@mailsac.com · Class CQA_AUTO_TEST_DND_1RB · Books: vm_automation_first_ebook_pplus_1rb -> vm_automation_second_ebook_pplus_1rb -> vm_automation_Third_ebook_pplus_1rb dt -> vm_automation_first_ebook_pplus_1rb |
| **Expected Result** | After step 7 the toolbar shows vm_automation_first_ebook_pplus_1rb and the reader opens on page ii (page label 'ii-iii / 160', address bar ?page=ii). |
| **Remarks** | Not a sheet row — the mapping was stated by the product owner on 2026-09-25 ('Book 3 page ii is mapped to page ii of Book 1'). Verified live and automated as TST_EMAP_TC_6 (Suite3). TST_EMAP_TC_5 is the automation-only Book 1 Cover setup/teardown step and has no manual case. |
| **Actual Result** | Automated run 2026-09-25: Book 3 opened on page ii; switching to Book 1 opened it on page ii (label ii-iii / 160). Teardown then returned Book 1 to its Cover. |
| **Status** | Pass |
| **Comments / Defect ID** | Automated — ebookMapping.test.js, Suite3 (npm run eBookMappingTest_Thor, thor). Last runs 2026-09-25: two consecutive 18/18 passing (incl. Book 1 Cover setup/teardown); an earlier run had one intermittent switch-back failure (Open item 4). |

---

## Open items / `[ASSUMED]` to confirm on the next live pass

1. ~~**Sheet step "Move to next page"**~~ — **RESOLVED 2026-09-25.** Confirmed by the product owner: Book 1 opens on the Cover and Next page goes to page ii; the reader may instead reopen Book 1 on its saved last page, handled by the conditional Cover setup.
2. ~~**Book 2 page iv -> Book 3 page ii**~~ — **RESOLVED 2026-09-25.** With the Cover start, Book 2 opens on its Cover and Next page reaches page ii, which is the mapped page.
3. **Unmapped page** (TST_EMAP_TC_3): the sheet does not say where a book opens when the source page has no mapping. Observed: same page (5 of 6) or Cover (1 of 6). Confirm the rule and why the result varied, then automate.
4. **Intermittent switch-back** (TST_EMAP_TC_2): in the first automated run the last step (Book 3 → Book 2) selected the book but the reader stayed on Book 3 for 60 s; not reproduced in 4 manual-style probes or the 2 reruns. Watch for recurrence — if it repeats it is a product defect to raise, not a test wait to lengthen.
5. **NEMO ticket / traceability:** the sheet's ticket column is empty — add the ticket once known.
