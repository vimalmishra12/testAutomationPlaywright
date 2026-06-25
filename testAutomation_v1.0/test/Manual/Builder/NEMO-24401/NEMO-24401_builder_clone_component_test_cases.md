# Manual Test Cases — NEMO-24401
**Ticket:** NEMO-24401 — Unique code validation when cloning a Component  
**Module:** Builder Clone Component  
**App:** asgard-thor-builder.comprodls.com (Thor)  
**Pages in scope:**
- Components listing — `/2024/components` `[ASSUMED]`
- Clone Component modal — triggered from component listing
- Component detail page — `/2024/components/<code>` `[ASSUMED]`

**Generated:** 2026-06-16 | **Updated:** 2026-06-16 | **Scope:** Admin role only (harishthoradmin)  
**Total TCs:** 20

> **ID convention:**
> - **Test Case ID** (Test Cases tab): `TST_NEMO24401_TC_<N>` — simple sequential, Positive → Edge → Negative order
> - **Linked Requirement** (Test Cases tab + Mapped TC ID in Matrix): `AC<n>.UC<n>.S<n>.TC<n>` — compound traceability ID
> - The Traceability Matrix maps each compound ID to its TST ID.

---

## Test Entities

| Entity | Code | Status |
|---|---|---|
| Source Component (for cloning) | `cqaclone1_15junepe1` | Non-ingested |
| Guard Component | `cqathorjune10pe1` | Ingested |
| Source eBook (for cross-entity tests) | `cqacloneebook15june26` | Non-ingested |
| Umbrella (cross-entity ref) | `cqaumbrellaforautotest15june2026` | Exists |

---

## Acceptance Criteria

| AC ID | Description |
|---|---|
| **AC1** | Unique code format: only lowercase letters (a–z), numbers (0–9), and underscore (_) are allowed. Code cannot be empty. Uppercase, hyphens, special characters, and whitespace must be rejected. |
| **AC2** | Unique code must be globally unique across all entity types (components, eBooks, umbrellas, families). |
| **AC3** | Clone succeeds when a valid unique code is submitted; cloned entity appears in the Components listing. |
| **AC4** | Validation errors appear inline near the unique code input field — not as browser alert dialogs. The Clone modal stays open on error; the user can correct the code without reopening the modal. |
| **AC5** | A non-ingested cloned entity can be deleted by Admin. Deletion removes the entity from the listing and frees its unique code for reuse. |
| **AC6** | An ingested entity has no Delete action available (absent or disabled). An ingested entity's unique code remains permanently locked and cannot be reused. |

---

## Section 1 — Traceability Matrix

### AC1 — Code format: lowercase, numbers, underscore only; not empty

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC1 | Code format validation | UC1 | Valid format accepted | S1 | Code with lowercase letters and underscores only | Positive | AC1.UC1.S1.TC1 | TST_NEMO24401_TC_1 |
| AC1 | | UC1 | | S2 | Code containing numbers | Positive | AC1.UC1.S2.TC1 | TST_NEMO24401_TC_2 |
| AC1 | | UC1 | | S3 | Code with mixed lowercase + numbers + underscores | Positive | AC1.UC1.S3.TC1 | TST_NEMO24401_TC_3 |
| AC1 | | UC2 | Invalid format rejected | S1 | Whitespace-only code | Edge | AC1.UC2.S1.TC1 | TST_NEMO24401_TC_9 |
| AC1 | | UC2 | | S2 | Code with uppercase letters | Negative | AC1.UC2.S2.TC1 | TST_NEMO24401_TC_15 |
| AC1 | | UC2 | | S3 | Code with special characters | Negative | AC1.UC2.S3.TC1 | TST_NEMO24401_TC_16 |
| AC1 | | UC2 | | S4 | Empty code field | Negative | AC1.UC2.S4.TC1 | TST_NEMO24401_TC_14 |

### AC2 — Unique code globally unique across all entity types

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC2 | Code globally unique across components, eBooks, umbrellas, families | UC1 | Duplicate within component entity | S1 | Code already used by the source component itself | Negative | AC2.UC1.S1.TC1 | TST_NEMO24401_TC_11 |
| AC2 | | UC1 | | S2 | Code used by an ingested component (guard) | Negative | AC2.UC1.S2.TC1 | TST_NEMO24401_TC_18 |
| AC2 | | UC2 | Duplicate across entity types | S1 | Code used by an umbrella | Negative | AC2.UC2.S1.TC1 | TST_NEMO24401_TC_12 |
| AC2 | | UC2 | | S2 | Code used by a non-ingested eBook | Negative | AC2.UC2.S2.TC1 | TST_NEMO24401_TC_13 |
| AC2 | | UC3 | Family code cross-entity uniqueness | S1 | Code used by an existing Family | Negative | AC2.UC3.S1.TC1 | TST_NEMO24401_TC_19 |

### AC3 — Clone succeeds with valid unique code

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC3 | Clone succeeds; entity appears in listing | UC1 | In-modal error correction and resubmit | S1 | Enter duplicate → get error → correct code in-modal → submit → success | Positive | AC3.UC1.S1.TC1 | TST_NEMO24401_TC_4 |
| AC3 | | UC2 | Regression validation | S1 | Enter ingested code (error) → retry with new valid code → success | Positive | AC3.UC2.S1.TC1 | TST_NEMO24401_TC_5 |

### AC4 — Error UX: inline, modal stays open, correctable without reopening

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC4 | Error is inline near code field; modal stays open | UC1 | Error placement and modal persistence | S1 | Trigger duplicate error; verify error is inline not a browser alert | Edge | AC4.UC1.S1.TC1 | TST_NEMO24401_TC_10 |

### AC5 — Non-ingested clone deletable; deletion frees unique code

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC5 | Non-ingested clone can be deleted; deletion frees unique code | UC1 | Delete cloned component (same type) | S1 | Clone then delete; entity removed from listing | Positive | AC5.UC1.S1.TC1 | TST_NEMO24401_TC_6 |
| AC5 | | UC1 | | S2 | Clone → delete → clone again with same code → success | Positive | AC5.UC1.S2.TC1 | TST_NEMO24401_TC_7 |
| AC5 | | UC2 | Code freed across entity types | S1 | Clone eBook → delete eBook → clone Component using freed code → success | Positive | AC5.UC2.S1.TC1 | TST_NEMO24401_TC_8 |
| AC5 | | UC3 | Code freed by deleting a Family | S1 | Delete Family → clone Component using freed code → success | Positive | AC5.UC3.S1.TC1 | TST_NEMO24401_TC_20 |

### AC6 — Ingested entity: no Delete action; code permanently locked

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC6 | Ingested entity has no Delete action; ingested code locked | UC1 | Guard: no delete for ingested component | S1 | Locate ingested component; verify Delete action absent or disabled | Negative | AC6.UC1.S1.TC1 | TST_NEMO24401_TC_17 |

---

## Section 2 — Test Cases

> **Ordering:** Positive → Edge → Negative (per manual-test-standard.md). S.No. is sequential.  
> **Login path:** https://asgard-thor-builder.comprodls.com/2024/pre-login → select org "Cambridge One" → confirm → enter credentials at IdP → land on `/2024/dashboard`.  
> **Navigation to Components:** `[ASSUMED]` From dashboard, navigate to the Components section via the left nav or top menu.  
> **Precondition (all TCs unless stated):** Logged in as Admin (`harishthoradmin`) on Builder Thor. Non-ingested source component `cqaclone1_15junepe1` exists in the Components listing.

---

### ✅ POSITIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_NEMO24401_TC_1 |
| **Title** | Verify clone succeeds when the unique code contains only lowercase letters and underscores |
| **Linked Requirement** | AC1.UC1.S1.TC1 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` (non-ingested) visible in listing. Code `my_comp_01` does not already exist. |
| **Test Steps** | 1. Navigate to the Components listing page. 2. Locate component `cqaclone1_15junepe1`. 3. Click the Clone action for this component `[ASSUMED: context menu / action button]`. 4. In the Clone modal, enter unique code: `my_comp_01`. 5. Click the Submit / Save button. 6. Wait for the result. |
| **Test Data** | Unique code: `my_comp_01` |
| **Expected Result** | A clone success toast notification appears. The cloned component with unique code `my_comp_01` is visible in the Components listing. |
| **Remarks** | `[ASSUMED]` Exact Clone modal selector and button label not yet confirmed on Thor — confirm during exploratory session. If code already exists from a prior run, use `my_comp_01b`. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_NEMO24401_TC_2 |
| **Title** | Verify clone succeeds when the unique code contains numbers |
| **Linked Requirement** | AC1.UC1.S2.TC1 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Code `comp_2024` does not already exist. |
| **Test Steps** | 1. Navigate to the Components listing page. 2. Locate component `cqaclone1_15junepe1`. 3. Click the Clone action. 4. In the Clone modal, enter unique code: `comp_2024`. 5. Click Submit / Save. 6. Wait for the result. |
| **Test Data** | Unique code: `comp_2024` |
| **Expected Result** | Clone succeeds. Success toast appears. Component `comp_2024` visible in listing. |
| **Remarks** | Confirms numbers (0–9) are permitted in the unique code. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_NEMO24401_TC_3 |
| **Title** | Verify clone succeeds when the unique code contains a mix of lowercase letters, numbers, and underscores |
| **Linked Requirement** | AC1.UC1.S3.TC1 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Code `comp_a_2_b` does not already exist. |
| **Test Steps** | 1. Navigate to the Components listing page. 2. Locate component `cqaclone1_15junepe1`. 3. Click the Clone action. 4. In the Clone modal, enter unique code: `comp_a_2_b`. 5. Click Submit / Save. 6. Wait for the result. |
| **Test Data** | Unique code: `comp_a_2_b` |
| **Expected Result** | Clone succeeds. Success toast appears. Component `comp_a_2_b` visible in listing. |
| **Remarks** | Validates all three allowed character types together. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_NEMO24401_TC_4 |
| **Title** | Verify clone succeeds after correcting a duplicate code to a valid unique code within the same modal session |
| **Linked Requirement** | AC3.UC1.S1.TC1 |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Code `unique_new_01` does not already exist. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter duplicate code: `cqaclone1_15junepe1` (source entity's own code). 4. Click Submit / Save — observe inline error. 5. WITHOUT closing the modal, clear the code field and enter: `unique_new_01`. 6. Click Submit / Save again. 7. Wait for the result. |
| **Test Data** | First attempt: `cqaclone1_15junepe1` (triggers error). Second attempt: `unique_new_01` (valid). |
| **Expected Result** | Step 4: Inline error is shown near the code field; modal remains open. Step 6: Clone succeeds. Success toast appears. Component `unique_new_01` visible in listing. |
| **Remarks** | Validates AC4 (modal stays open, error correctable) in combination with AC3 (clone eventually succeeds). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_NEMO24401_TC_5 |
| **Title** | Verify regression — uniqueness check rejects ingested component code and allows a new valid code in the same modal session |
| **Linked Requirement** | AC3.UC2.S1.TC1 |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Ingested component `cqathorjune10pe1` exists. Code `reg_comp_new_01` does not already exist. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter code: `cqathorjune10pe1` (ingested component's code). 4. Click Submit / Save — observe inline uniqueness error. 5. WITHOUT closing modal, clear field and enter: `reg_comp_new_01`. 6. Click Submit / Save. 7. Wait for result. |
| **Test Data** | First attempt: `cqathorjune10pe1`. Second attempt: `reg_comp_new_01`. |
| **Expected Result** | Step 4: Inline uniqueness error displayed; modal stays open. Step 6: Clone succeeds. Success toast. Component `reg_comp_new_01` in listing. |
| **Remarks** | **Regression gate.** Validates uniqueness check is intact post-deploy. Ingested entity codes must remain locked. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_NEMO24401_TC_6 |
| **Title** | Verify Admin can delete a non-ingested cloned component and it is removed from the listing |
| **Linked Requirement** | AC5.UC1.S1.TC1 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Code `reuse_comp_del_01` does not already exist. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter code: `reuse_comp_del_01`. 4. Click Submit / Save. 5. Confirm clone success toast and `reuse_comp_del_01` in listing. 6. Locate `reuse_comp_del_01` in the listing. 7. Click the Delete action for this component `[ASSUMED: context menu / action button]`. 8. Confirm the deletion in any confirmation dialog. 9. Wait for delete result. |
| **Test Data** | Clone code: `reuse_comp_del_01` |
| **Expected Result** | Step 4–5: Clone success. Step 8–9: Delete success toast appears. Component `reuse_comp_del_01` is no longer visible in the Components listing. |
| **Remarks** | `[ASSUMED]` Delete action UI and confirmation dialog flow not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_NEMO24401_TC_7 |
| **Title** | Verify the unique code of a deleted non-ingested component can be reused for a new clone |
| **Linked Requirement** | AC5.UC1.S2.TC1 |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Code `reuse_after_del_comp` does not already exist. |
| **Test Steps** | 1. Navigate to Components listing. 2. Clone `cqaclone1_15junepe1` using code `reuse_after_del_comp`. 3. Confirm clone success and entity in listing. 4. Delete the clone `reuse_after_del_comp`. 5. Confirm delete success and entity removed from listing. 6. Clone `cqaclone1_15junepe1` again using the same code `reuse_after_del_comp`. 7. Click Submit / Save. |
| **Test Data** | Clone code (both attempts): `reuse_after_del_comp` |
| **Expected Result** | Step 2–3: First clone succeeds. Step 4–5: Delete succeeds. Step 6–7: Second clone with the same code `reuse_after_del_comp` succeeds — success toast, entity in listing. |
| **Remarks** | Validates that deletion genuinely frees the code for reuse. Critical for data hygiene. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_NEMO24401_TC_8 |
| **Title** | Verify a unique code freed by deleting a non-ingested eBook can be reused to clone a Component |
| **Linked Requirement** | AC5.UC2.S1.TC1 |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Non-ingested eBook `cqacloneebook15june26` and Component `cqaclone1_15junepe1` exist. Code `reuse_ebook_on_comp_01` does not exist. |
| **Test Steps** | 1. Navigate to eBooks listing. 2. Clone eBook `cqacloneebook15june26` using code `reuse_ebook_on_comp_01`. 3. Confirm clone success and eBook in listing. 4. Delete the cloned eBook `reuse_ebook_on_comp_01`. 5. Confirm delete success and eBook removed from listing. 6. Navigate to Components listing. 7. Clone Component `cqaclone1_15junepe1` using code `reuse_ebook_on_comp_01`. 8. Click Submit / Save. |
| **Test Data** | Clone code (both entities): `reuse_ebook_on_comp_01` |
| **Expected Result** | Steps 1–3: eBook clone succeeds. Steps 4–5: Delete eBook succeeds. Steps 7–8: Component clone with same code `reuse_ebook_on_comp_01` succeeds — success toast, component in listing. |
| **Remarks** | Validates cross-entity code reuse after deletion. Code freed by deleting an eBook can be used for a component, confirming the global code pool is freed on delete. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### 🔶 EDGE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_NEMO24401_TC_9 |
| **Title** | Verify a format validation error is shown when the unique code field contains only whitespace |
| **Linked Requirement** | AC1.UC2.S1.TC1 |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. In the Unique Code field, enter three or more space characters (whitespace only). 4. Click Submit / Save. |
| **Test Data** | Unique code: `   ` (spaces only) |
| **Expected Result** | An inline validation error appears near the code input field. The Clone modal stays open. No clone is created. |
| **Remarks** | Whitespace is a boundary between "empty" (AC1 — required field) and "invalid format" (AC1 — allowed chars). App should reject it as a format error. `[ASSUMED]` Exact error message text not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_NEMO24401_TC_10 |
| **Title** | Verify that the duplicate code error is displayed inline near the code input field and not as a browser alert dialog |
| **Linked Requirement** | AC4.UC1.S1.TC1 |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter the source component's own code: `cqaclone1_15junepe1`. 4. Click Submit / Save. 5. Observe where the error message appears. |
| **Test Data** | Unique code: `cqaclone1_15junepe1` (triggers duplicate error) |
| **Expected Result** | The error message appears as inline text **within** the Clone modal, near or beneath the Unique Code input field. No browser-level alert dialog (`window.alert`) is shown. The modal remains open. |
| **Remarks** | This TC validates the error display mechanism (AC4), not the error message content. A browser alert (`window.alert`) breaking the page flow would be a UX defect. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### ❌ NEGATIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_NEMO24401_TC_11 |
| **Title** | Verify an inline uniqueness error is shown when cloning a component using the source component's own existing code |
| **Linked Requirement** | AC2.UC1.S1.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter the source entity's own code: `cqaclone1_15junepe1`. 4. Click Submit / Save. |
| **Test Data** | Unique code: `cqaclone1_15junepe1` |
| **Expected Result** | Inline uniqueness error is displayed near the code field. Clone modal stays open. No clone is created. |
| **Remarks** | `[ASSUMED]` Exact error message text not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_NEMO24401_TC_12 |
| **Title** | Verify a cross-entity uniqueness error is shown when cloning a component using an umbrella's existing code |
| **Linked Requirement** | AC2.UC2.S1.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Umbrella `cqaumbrellaforautotest15june2026` exists. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter code: `cqaumbrellaforautotest15june2026`. 4. Click Submit / Save. |
| **Test Data** | Unique code: `cqaumbrellaforautotest15june2026` |
| **Expected Result** | Inline cross-entity uniqueness error displayed. Clone modal stays open. No clone is created. |
| **Remarks** | Validates global uniqueness constraint — code belonging to an umbrella is locked across entity types. `[ASSUMED]` Exact error message text not yet confirmed. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_NEMO24401_TC_13 |
| **Title** | Verify a cross-entity uniqueness error is shown when cloning a component using a non-ingested eBook's existing code |
| **Linked Requirement** | AC2.UC2.S2.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. Non-ingested eBook `cqacloneebook15june26` exists. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter code: `cqacloneebook15june26`. 4. Click Submit / Save. |
| **Test Data** | Unique code: `cqacloneebook15june26` |
| **Expected Result** | Inline cross-entity uniqueness error displayed. Clone modal stays open. No clone is created. |
| **Remarks** | Validates global uniqueness — code in use by a non-ingested eBook cannot be used for a component. `[ASSUMED]` Exact error message not confirmed. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_NEMO24401_TC_14 |
| **Title** | Verify a required-field error is shown when the unique code field is left empty |
| **Linked Requirement** | AC1.UC2.S4.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Leave the Unique Code field empty. 4. Click Submit / Save. |
| **Test Data** | Unique code: (empty — no value entered) |
| **Expected Result** | Inline required-field validation error appears near the code input field. Clone modal stays open. No clone is created. |
| **Remarks** | `[ASSUMED]` Exact error message text not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_NEMO24401_TC_15 |
| **Title** | Verify a format error is shown when the unique code contains uppercase letters |
| **Linked Requirement** | AC1.UC2.S2.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter code: `MyComp_Invalid` (contains uppercase letters). 4. Click Submit / Save. |
| **Test Data** | Unique code: `MyComp_Invalid` |
| **Expected Result** | Inline format validation error appears near the code field indicating only lowercase letters, numbers, and underscores are allowed. Clone modal stays open. No clone is created. |
| **Remarks** | `[ASSUMED]` Exact error message text not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_NEMO24401_TC_16 |
| **Title** | Verify a format error is shown when the unique code contains special characters |
| **Linked Requirement** | AC1.UC2.S3.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible in listing. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter code: `comp-one@test` (contains hyphen and @ symbol). 4. Click Submit / Save. |
| **Test Data** | Unique code: `comp-one@test` |
| **Expected Result** | Inline format validation error appears. Clone modal stays open. No clone is created. |
| **Remarks** | Hyphens (`-`) and special characters (`@`, `!`, etc.) are explicitly excluded. `[ASSUMED]` Exact error message not confirmed. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_NEMO24401_TC_17 |
| **Title** | Verify the Delete action is absent or disabled for an ingested component |
| **Linked Requirement** | AC6.UC1.S1.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Ingested component `cqathorjune10pe1` visible in the Components listing. |
| **Test Steps** | 1. Navigate to Components listing. 2. Locate ingested component `cqathorjune10pe1`. 3. Open the action menu / context menu for this component `[ASSUMED]`. 4. Observe available actions. |
| **Test Data** | Target entity: `cqathorjune10pe1` (ingested) |
| **Expected Result** | The Delete action is **not visible** in the action menu, OR is visible but **disabled/greyed out**. No deletion is possible for an ingested component. |
| **Remarks** | `[ASSUMED]` Whether Delete is hidden vs. disabled/greyed is an implementation detail — either is acceptable. Confirm the exact behavior on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_NEMO24401_TC_18 |
| **Title** | Verify guard test — cloning with an ingested component's code is rejected even after other operations |
| **Linked Requirement** | AC2.UC1.S2.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` visible. Ingested component `cqathorjune10pe1` exists. |
| **Test Steps** | 1. Navigate to Components listing. 2. Open Clone modal for `cqaclone1_15junepe1`. 3. Enter code: `cqathorjune10pe1` (ingested component's code). 4. Click Submit / Save. |
| **Test Data** | Unique code: `cqathorjune10pe1` |
| **Expected Result** | Inline uniqueness error displayed. Clone modal stays open. No clone is created. The ingested entity's code is permanently locked and cannot be reused. |
| **Remarks** | **Guard test.** Ingested entity codes must NEVER be freed by any operation short of un-ingesting or hard deletion. This TC should be run last in a regression pass to confirm the guard is intact. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 19 |
| **Test Case ID** | TST_NEMO24401_TC_19 |
| **Title** | Verify a cross-entity uniqueness error is shown when cloning a Component using a code already in use by a Family |
| **Linked Requirement** | AC2.UC3.S1.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` (non-ingested) visible in listing. Code `family_comp_01` does not already exist anywhere. |
| **Test Steps** | 1. Navigate to Builder Thor (login as `harishthoradmin`, org: Cambridge One → confirm → IdP credentials). 2. In the left pane, click **Families** `[ASSUMED: left nav item label]`. 3. Click **Create a Family** `[ASSUMED: button label]`. 4. In the Create Family form, enter unique code: `family_comp_01` (lowercase letters + numbers only) `[ASSUMED: field name/label]`. 5. Submit the form and confirm the Family is created successfully. 6. Navigate to the Components listing page. 7. Open the Clone modal for `cqaclone1_15junepe1`. 8. Enter unique code: `family_comp_01`. 9. Click Submit / Save. |
| **Test Data** | Family code (created in step 4): `family_comp_01`. Clone modal code (step 8): `family_comp_01`. |
| **Expected Result** | Step 5: Family `family_comp_01` created successfully. Step 9: Inline cross-entity uniqueness error is displayed near the code field. The Clone modal stays open. No component clone is created. |
| **Remarks** | Validates global uniqueness — a code in use by a Family must be locked across all entity types including Components. `[ASSUMED]` Families left-nav item label, Create Family button label, and unique-code field name not yet confirmed on Thor. `[ASSUMED]` Exact error message text not confirmed. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 20 |
| **Test Case ID** | TST_NEMO24401_TC_20 |
| **Title** | Verify a unique code freed by deleting a Family can be used to clone a Component |
| **Linked Requirement** | AC5.UC3.S1.TC1 |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin on Builder Thor. Component `cqaclone1_15junepe1` (non-ingested) visible. Family with code `family_comp_01` exists (created in TST_NEMO24401_TC_19 or created fresh for this run). |
| **Test Steps** | 1. Navigate to Builder Thor (login as `harishthoradmin`, org: Cambridge One → confirm → IdP credentials). 2. In the left pane, click **Families** `[ASSUMED]`. 3. Locate Family `family_comp_01` in the listing. 4. Click the Delete action for Family `family_comp_01` `[ASSUMED: context menu / action button]`. 5. Confirm the deletion in any confirmation dialog. 6. Confirm Family `family_comp_01` is no longer visible in the Families listing. 7. Navigate to the Components listing page. 8. Open the Clone modal for `cqaclone1_15junepe1`. 9. Enter unique code: `family_comp_01`. 10. Click Submit / Save. |
| **Test Data** | Family code (to delete in step 4): `family_comp_01`. Clone modal code (step 9): `family_comp_01`. |
| **Expected Result** | Steps 4–6: Family deleted successfully; removed from listing. Steps 9–10: Clone success toast appears. Component `family_comp_01` is visible in the Components listing. |
| **Remarks** | Validates that deleting a Family frees its unique code for reuse across entity types. This TC is the follow-on to TST_NEMO24401_TC_19 — the same code that was locked by the Family in TC_19 must now be accepted for a Component clone. `[ASSUMED]` Family delete action UI and confirmation dialog not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

## Test Code Index

| S.No. | TST ID | Source Entity | Unique Code Used | Type |
|---|---|---|---|---|
| 1 | TST_NEMO24401_TC_1 | cqaclone1_15junepe1 | `my_comp_01` | Clone code |
| 2 | TST_NEMO24401_TC_2 | cqaclone1_15junepe1 | `comp_2024` | Clone code |
| 3 | TST_NEMO24401_TC_3 | cqaclone1_15junepe1 | `comp_a_2_b` | Clone code |
| 4 | TST_NEMO24401_TC_4 | cqaclone1_15junepe1 | `cqaclone1_15junepe1` → `unique_new_01` | Error then fix |
| 5 | TST_NEMO24401_TC_5 | cqaclone1_15junepe1 | `cqathorjune10pe1` → `reg_comp_new_01` | Error then fix |
| 6 | TST_NEMO24401_TC_6 | cqaclone1_15junepe1 | `reuse_comp_del_01` | Clone then delete |
| 7 | TST_NEMO24401_TC_7 | cqaclone1_15junepe1 | `reuse_after_del_comp` (×2) | Delete and reuse |
| 8 | TST_NEMO24401_TC_8 | cqacloneebook15june26 (eBook) → cqaclone1_15junepe1 | `reuse_ebook_on_comp_01` | Cross-entity reuse |
| 9 | TST_NEMO24401_TC_9 | cqaclone1_15junepe1 | `   ` (spaces) | Format edge |
| 10 | TST_NEMO24401_TC_10 | cqaclone1_15junepe1 | `cqaclone1_15junepe1` | Error placement check |
| 11 | TST_NEMO24401_TC_11 | cqaclone1_15junepe1 | `cqaclone1_15junepe1` | Duplicate own code |
| 12 | TST_NEMO24401_TC_12 | cqaclone1_15junepe1 | `cqaumbrellaforautotest15june2026` | Umbrella code |
| 13 | TST_NEMO24401_TC_13 | cqaclone1_15junepe1 | `cqacloneebook15june26` | eBook code |
| 14 | TST_NEMO24401_TC_14 | cqaclone1_15junepe1 | (empty) | Required field |
| 15 | TST_NEMO24401_TC_15 | cqaclone1_15junepe1 | `MyComp_Invalid` | Uppercase |
| 16 | TST_NEMO24401_TC_16 | cqaclone1_15junepe1 | `comp-one@test` | Special chars |
| 17 | TST_NEMO24401_TC_17 | cqathorjune10pe1 (guard) | — | No delete for ingested |
| 18 | TST_NEMO24401_TC_18 | cqaclone1_15junepe1 | `cqathorjune10pe1` | Ingested code guard |
| 19 | TST_NEMO24401_TC_19 | Family created + cqaclone1_15junepe1 | `family_comp_01` | Family code cross-entity block |
| 20 | TST_NEMO24401_TC_20 | Family deleted → cqaclone1_15junepe1 | `family_comp_01` | Family code freed, Component clone succeeds |
