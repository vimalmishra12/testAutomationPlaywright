# Manual Test Cases — NEMO-24306
**Ticket:** NEMO-24306 — [Regression] missing error message for empty username field
**Module:** NEMO
**App:** micro-nemo.comprodls.com (Thor)
**Pages in scope:**
- Create adult student accounts — `/admin/admin/org_<school>/username-adult/new_csv`
- Create new accounts for children — `/admin/admin/org_<school>/children/new_csv`

**Generated:** 2026-06-10 | **Revised:** 2026-06-10 (traceability applied)
**Total TCs:** 18 (10 existing + 8 new for AC2 / AC3)

> **ID convention:**
> - **Test Case ID** (Test Cases tab): `TST_NEMO24306_TC_<N>` — simple sequential
> - **Linked Requirement** (Test Cases tab + Mapped TC ID in Matrix): `AC<n>.UC<n>.S<n>.TC<n>` — compound traceability ID
> - The Traceability Matrix is the bridge — it maps each compound ID to its TST id.

---

## Section 1 — Traceability Matrix

### AC1 — Username must start with a lower-case letter; 3–30 chars; allowed chars = lowercase letters, numbers, hyphens, underscores

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC1 | Username format & character rules | UC1 | Validate username starting character | S1 | Username starts with a valid lowercase letter | Positive | AC1.UC1.S1.TC1 | TST_NEMO24306_TC_1 |
| AC1 | | UC1 | | S1 | Username starts with a valid lowercase letter | Positive | AC1.UC1.S1.TC2 | TST_NEMO24306_TC_2 |
| AC1 | | UC1 | | S2 | Username starts with an uppercase letter | Negative | AC1.UC1.S2.TC1 | TST_NEMO24306_TC_10 |
| AC1 | | UC1 | | S3 | Username starts with a number | Negative | AC1.UC1.S3.TC1 | TST_NEMO24306_TC_11 |
| AC1 | | UC1 | | S4 | Username field is empty (Headline Defect NEMO-24306) | Negative | AC1.UC1.S4.TC1 | TST_NEMO24306_TC_12 |
| AC1 | | UC1 | | S4 | Username field is empty (Headline Defect NEMO-24306) | Negative | AC1.UC1.S4.TC2 | TST_NEMO24306_TC_13 |
| AC1 | | UC2 | Validate username length boundaries | S1 | Username is exactly 3 characters (minimum boundary) | Edge | AC1.UC2.S1.TC1 | TST_NEMO24306_TC_5 |
| AC1 | | UC2 | | S2 | Username is exactly 30 characters (maximum boundary) | Edge | AC1.UC2.S2.TC1 | TST_NEMO24306_TC_6 |
| AC1 | | UC2 | | S3 | Username is 2 characters (below minimum) | Negative | AC1.UC2.S3.TC1 | TST_NEMO24306_TC_14 |
| AC1 | | UC3 | Validate username allowed characters | S1 | Username contains hyphens and underscores | Edge | AC1.UC3.S1.TC1 | TST_NEMO24306_TC_7 |

### AC2 — Password must contain ≥ 8 characters including at least one letter AND at least one number or special character

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC2 | Password complexity & length rules | UC1 | Validate password length | S1 | Password is exactly 8 characters with required complexity | Edge | AC2.UC1.S1.TC1 | TST_NEMO24306_TC_8 |
| AC2 | | UC1 | | S2 | Password is less than 8 characters | Negative | AC2.UC1.S2.TC1 | TST_NEMO24306_TC_15 |
| AC2 | | UC2 | Validate password complexity | S1 | Password contains at least one letter and one number | Positive | AC2.UC2.S1.TC1 | TST_NEMO24306_TC_3 |
| AC2 | | UC2 | | S2 | Password contains at least one letter and one special character | Positive | AC2.UC2.S2.TC1 | TST_NEMO24306_TC_4 |
| AC2 | | UC2 | | S3 | Password contains only letters (no number or special char) | Negative | AC2.UC2.S3.TC1 | TST_NEMO24306_TC_16 |
| AC2 | | UC2 | | S4 | Password contains only numbers (no letter) | Negative | AC2.UC2.S4.TC1 | TST_NEMO24306_TC_17 |

### AC3 — CSV file can have up to 200 records

| AC ID | AC Description | UC ID | UC Description | Scenario ID | Scenario Description | Type | Mapped TC ID | TST ID |
|---|---|---|---|---|---|---|---|---|
| AC3 | CSV record count limit | UC1 | Validate CSV record count | S1 | CSV contains exactly 200 records (upper boundary) | Edge | AC3.UC1.S1.TC1 | TST_NEMO24306_TC_9 |
| AC3 | | UC1 | | S2 | CSV contains 201 records (one above the maximum limit) | Negative | AC3.UC1.S2.TC1 | TST_NEMO24306_TC_18 |

---

## Section 2 — Test Cases

> **Ordering:** Positive → Edge → Negative (per manual-test-standard.md). S.No. is sequential.
> **Navigation path (adult):** Login → My school accounts → [School] → Students → Manage students → Add new students to classes → Adults → Create adult student accounts → Next
> **Navigation path (children):** Login → My school accounts → [School] → Students → Manage students → Add new students to classes → Children → Next
> **Precondition (all TCs):** Logged in as school admin on Thor (`testt1@mailsac.com`). Valid active class key `w8k3-kK8U` available in MQA Sierra School.

### ✅ POSITIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_NEMO24306_TC_1 |
| **Title** | Verify CSV upload completes successfully on the adult page when all fields are valid and the username starts with a lowercase letter |
| **Linked Requirement** | AC1.UC1.S1.TC1 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_1_valid_adult.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_1_valid_adult.csv` — username: `jsmith01`, password: `Welcome1!`, class key: `w8k3-kK8U` |
| **Expected Result** | No inline validation errors are shown. Upload is accepted and success/confirmation state is displayed. |
| **Remarks** | Also validates AC2 (password `Welcome1!` satisfies complexity rules). Username `jsmith01` may already exist on repeated runs. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_NEMO24306_TC_2 |
| **Title** | Verify CSV upload completes successfully on the children page when all fields are valid and the username starts with a lowercase letter |
| **Linked Requirement** | AC1.UC1.S1.TC2 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create new accounts for children" page. |
| **Test Steps** | 1. Navigate to Create new accounts for children page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_2_valid_children.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_2_valid_children.csv` — username: `ejones01`, password: `Welcome1!`, class key: `w8k3-kK8U` |
| **Expected Result** | No inline validation errors are shown. Upload is accepted and success/confirmation state is displayed. |
| **Remarks** | Children page equivalent of TST_NEMO24306_TC_1. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_NEMO24306_TC_3 |
| **Title** | Verify CSV upload proceeds on the adult page when the password contains at least one letter and one number |
| **Linked Requirement** | AC2.UC2.S1.TC1 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_3_password_letter_and_number.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_3_password_letter_and_number.csv` — username: `testuser03`, password: `TestPass1` (letter + number) |
| **Expected Result** | No password validation error is shown. Upload proceeds without a password-related error. |
| **Remarks** | `[ASSUMED]` Exact password error message not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_NEMO24306_TC_4 |
| **Title** | Verify CSV upload proceeds on the adult page when the password contains at least one letter and one special character |
| **Linked Requirement** | AC2.UC2.S2.TC1 |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_4_password_letter_and_special.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_4_password_letter_and_special.csv` — username: `testuser04`, password: `TestPass!` (letter + special char) |
| **Expected Result** | No password validation error is shown. Upload proceeds without a password-related error. |
| **Remarks** | Verifies that a special character satisfies the "number or special character" requirement. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### 🔶 EDGE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_NEMO24306_TC_5 |
| **Title** | Verify CSV upload proceeds on the adult page when the username is exactly 3 characters (minimum length boundary) |
| **Linked Requirement** | AC1.UC2.S1.TC1 |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_5_username_min_boundary.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_5_username_min_boundary.csv` — username: `abc` (exactly 3 chars) |
| **Expected Result** | No username length error is shown. The 3-character username is accepted. |
| **Remarks** | Lower boundary: 3 chars. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_NEMO24306_TC_6 |
| **Title** | Verify CSV upload proceeds on the adult page when the username is exactly 30 characters (maximum length boundary) |
| **Linked Requirement** | AC1.UC2.S2.TC1 |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_6_username_max_boundary.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_6_username_max_boundary.csv` — username: `abcdefghijklmnopqrstuvwxyz1234` (exactly 30 chars) |
| **Expected Result** | No username length error is shown. The 30-character username is accepted. |
| **Remarks** | Upper boundary: 30 chars. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_NEMO24306_TC_7 |
| **Title** | Verify CSV upload proceeds on the adult page when the username contains hyphens and underscores |
| **Linked Requirement** | AC1.UC3.S1.TC1 |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_7_username_special_chars.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_7_username_special_chars.csv` — username: `test-user_01` (hyphen + underscore) |
| **Expected Result** | No username validation error is shown. Hyphens and underscores are accepted. |
| **Remarks** | The "only letters and numbers" error copy is known misleading — NEMO-24306. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_NEMO24306_TC_8 |
| **Title** | Verify CSV upload proceeds on the adult page when the password is exactly 8 characters and meets complexity requirements |
| **Linked Requirement** | AC2.UC1.S1.TC1 |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_8_password_8char_boundary.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_8_password_8char_boundary.csv` — username: `testuser01`, password: `Welcome1a` (letter + number) |
| **Expected Result** | No password validation error is shown. The minimum-length password is accepted. |
| **Remarks** | Password length boundary. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_NEMO24306_TC_9 |
| **Title** | Verify CSV upload proceeds when the file contains exactly 200 records (maximum allowed boundary) |
| **Linked Requirement** | AC3.UC1.S1.TC1 |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_9_csv_200_records.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_9_csv_200_records.csv` — 200 rows. Rows 1–100 use class key `w8k3-kK8U`; rows 101–200 use class key `3N43-ABqV`. Password `Welcome1!`. |
| **Expected Result** | No validation errors are shown. All 200 rows are accepted and processed. |
| **Remarks** | **Class-key split is intentional:** AC3 (≤ 200 records per CSV) is independent of any single class's seat capacity. Splitting 200 rows across two classes (100 + 100) keeps both rules satisfied so the test isolates AC3. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### ❌ NEGATIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_NEMO24306_TC_10 |
| **Title** | Verify 'This must start with a letter' error is shown on the adult page when the username starts with an uppercase letter |
| **Linked Requirement** | AC1.UC1.S2.TC1 |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_10_username_uppercase.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_10_username_uppercase.csv` — username: `Testuser01` |
| **Expected Result** | Inline validation error **"This must start with a letter"** is displayed. Upload is blocked. |
| **Remarks** | Rule confirmed on page: "start with a lower-case letter". |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_NEMO24306_TC_11 |
| **Title** | Verify 'This must start with a letter' error is shown on the adult page when the username starts with a number |
| **Linked Requirement** | AC1.UC1.S3.TC1 |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_11_username_starts_number.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_11_username_starts_number.csv` — username: `1testuser` |
| **Expected Result** | Inline validation error **"This must start with a letter"** is displayed. Upload is blocked. |
| **Remarks** | Confirms the starting-character rule. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_NEMO24306_TC_12 |
| **Title** | Verify 'Enter username' error is shown on the adult page when the username field is empty |
| **Linked Requirement** | AC1.UC1.S4.TC1 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_12_empty_username_adult.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_12_empty_username_adult.csv` — username field empty; all other fields valid |
| **Expected Result** | Inline validation error **"Enter Username"** is displayed. Upload is blocked. |
| **Remarks** | **Headline Defect — NEMO-24306.** Before fix: no error was shown. EN: "Enter Username". ES: "Introducir nombre de usuario". |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_NEMO24306_TC_13 |
| **Title** | Verify 'Enter username' error is shown on the children page when the username field is empty |
| **Linked Requirement** | AC1.UC1.S4.TC2 |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as school admin on Thor. On "Create new accounts for children" page. |
| **Test Steps** | 1. Navigate to Create new accounts for children page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_13_empty_username_children.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_13_empty_username_children.csv` — username field empty; all other fields valid |
| **Expected Result** | Inline validation error **"Enter Username"** is displayed. Upload is blocked. |
| **Remarks** | **Headline Defect — NEMO-24306** on the children page. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_NEMO24306_TC_14 |
| **Title** | Verify a length validation error is shown on the adult page when the username is 2 characters (below the 3-character minimum) |
| **Linked Requirement** | AC1.UC2.S3.TC1 |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_14_username_too_short.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_14_username_too_short.csv` — username: `ab` (2 chars) |
| **Expected Result** | Inline validation error **"This should be at least 3 characters, only letters and numbers"** is displayed. Upload is blocked. |
| **Remarks** | Error copy says "only letters and numbers" but hyphens/underscores are also allowed — known misleading copy. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_NEMO24306_TC_15 |
| **Title** | Verify a password error is shown on the adult page when the password is less than 8 characters |
| **Linked Requirement** | AC2.UC1.S2.TC1 |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_15_password_too_short.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_15_password_too_short.csv` — username: `testuser02`, password: `Pass1ab` (7 chars) |
| **Expected Result** | Inline password validation error is displayed. Upload is blocked. |
| **Remarks** | `[ASSUMED]` Exact error message not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 16 |
| **Test Case ID** | TST_NEMO24306_TC_16 |
| **Title** | Verify a password error is shown on the adult page when the password contains only letters and no number or special character |
| **Linked Requirement** | AC2.UC2.S3.TC1 |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_16_password_letters_only.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_16_password_letters_only.csv` — username: `testuser05`, password: `TestPassword` (letters only, no number, no special char) |
| **Expected Result** | Inline password validation error `See password guidance in the info section at the top` is displayed. Upload is blocked. |
| **Remarks** | **🐛 Known product gap — this TC is expected to FAIL until fixed.** AC2 says password must contain "at least one letter AND at least one number or special character", but Thor currently accepts letters-only passwords like `TestPassword` with no error. Numbers-only IS rejected (see TC_17), letters-only is NOT. Recommend a separate Jira ticket; TC_16 stays in the active suite so the regression is visible. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 17 |
| **Test Case ID** | TST_NEMO24306_TC_17 |
| **Title** | Verify a password error is shown on the adult page when the password contains only numbers and no letter |
| **Linked Requirement** | AC2.UC2.S4.TC1 |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_17_password_numbers_only.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_17_password_numbers_only.csv` — username: `testuser06`, password: `12345678` (numbers only) |
| **Expected Result** | Inline password validation error is displayed. Upload is blocked. |
| **Remarks** | `[ASSUMED]` Exact error message not yet confirmed on Thor. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 18 |
| **Test Case ID** | TST_NEMO24306_TC_18 |
| **Title** | Verify an error is shown when the CSV file contains 201 records — one above the 200-record maximum |
| **Linked Requirement** | AC3.UC1.S2.TC1 |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as school admin on Thor. On "Create adult student accounts" page. |
| **Test Steps** | 1. Navigate to Create adult student accounts page. 2. Click **+ Upload file**. 3. Select `TST_NEMO24306_TC_18_csv_201_records.csv`. 4. Wait for upload modal to close. |
| **Test Data** | `TST_NEMO24306_TC_18_csv_201_records.csv` — 201 rows. Rows 1–100 use class key `w8k3-kK8U`; rows 101–200 use class key `3N43-ABqV`; row 201 also uses `3N43-ABqV` (the row that pushes the file over the 200-record cap). Password `Welcome1!`. |
| **Expected Result** | An error is displayed indicating the CSV exceeds the 200-record maximum. Upload is blocked. |
| **Remarks** | **Class-key split is intentional:** mirrors AC3.UC1.S1.TC1 — keeps the test focused on the 200-record CSV cap rather than per-class capacity. The 201st row is the one that exceeds the AC3 limit. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

## Test Data File Index

| S.No. | TST ID | Linked Requirement | CSV Filename |
|---|---|---|---|
| 1  | TST_NEMO24306_TC_1  | AC1.UC1.S1.TC1 | `TST_NEMO24306_TC_1_valid_adult.csv` |
| 2  | TST_NEMO24306_TC_2  | AC1.UC1.S1.TC2 | `TST_NEMO24306_TC_2_valid_children.csv` |
| 3  | TST_NEMO24306_TC_3  | AC2.UC2.S1.TC1 | `TST_NEMO24306_TC_3_password_letter_and_number.csv` |
| 4  | TST_NEMO24306_TC_4  | AC2.UC2.S2.TC1 | `TST_NEMO24306_TC_4_password_letter_and_special.csv` |
| 5  | TST_NEMO24306_TC_5  | AC1.UC2.S1.TC1 | `TST_NEMO24306_TC_5_username_min_boundary.csv` |
| 6  | TST_NEMO24306_TC_6  | AC1.UC2.S2.TC1 | `TST_NEMO24306_TC_6_username_max_boundary.csv` |
| 7  | TST_NEMO24306_TC_7  | AC1.UC3.S1.TC1 | `TST_NEMO24306_TC_7_username_special_chars.csv` |
| 8  | TST_NEMO24306_TC_8  | AC2.UC1.S1.TC1 | `TST_NEMO24306_TC_8_password_8char_boundary.csv` |
| 9  | TST_NEMO24306_TC_9  | AC3.UC1.S1.TC1 | `TST_NEMO24306_TC_9_csv_200_records.csv` |
| 10 | TST_NEMO24306_TC_10 | AC1.UC1.S2.TC1 | `TST_NEMO24306_TC_10_username_uppercase.csv` |
| 11 | TST_NEMO24306_TC_11 | AC1.UC1.S3.TC1 | `TST_NEMO24306_TC_11_username_starts_number.csv` |
| 12 | TST_NEMO24306_TC_12 | AC1.UC1.S4.TC1 | `TST_NEMO24306_TC_12_empty_username_adult.csv` |
| 13 | TST_NEMO24306_TC_13 | AC1.UC1.S4.TC2 | `TST_NEMO24306_TC_13_empty_username_children.csv` |
| 14 | TST_NEMO24306_TC_14 | AC1.UC2.S3.TC1 | `TST_NEMO24306_TC_14_username_too_short.csv` |
| 15 | TST_NEMO24306_TC_15 | AC2.UC1.S2.TC1 | `TST_NEMO24306_TC_15_password_too_short.csv` |
| 16 | TST_NEMO24306_TC_16 | AC2.UC2.S3.TC1 | `TST_NEMO24306_TC_16_password_letters_only.csv` |
| 17 | TST_NEMO24306_TC_17 | AC2.UC2.S4.TC1 | `TST_NEMO24306_TC_17_password_numbers_only.csv` |
| 18 | TST_NEMO24306_TC_18 | AC3.UC1.S2.TC1 | `TST_NEMO24306_TC_18_csv_201_records.csv` |
