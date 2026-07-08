# Manual Test Cases — Umbrella Product "Product Logo" Image Selection

**Feature:** Builder — Create/Edit Umbrella Product cover image ("Product Logo" control)
**Module:** Builder Umbrella (`BUMB`) — `pages/Builder/umbrella.page.js` · **Ticket:** NEMO-24627
**App:** asgard-thor-builder.comprodls.com (Thor)
**Purpose:** Verify the Umbrella cover-image control on the **Create Umbrella** form and the **Setup (edit)**
page — local-file upload, external-URL upload (Enter and blur), preview confirmation, unsupported/broken
inputs, special-character filenames, and persistence to the detail (Setup) page.

**Generated:** 2026-07-08 | **Scope:** Admin role only (`harishthoradmin`)
**Total TCs:** 8 (4 Positive, 2 Edge, 2 Negative)

> **ID convention (AGENTS.md Rule 6):** `TST_BUMB_TC_<N>` — module code `BUMB` from the Umbrella page
> object. The IDs here **match the automated suite** (`umbrellaImage.test.js`) 1:1 for traceability, so they
> are **not** re-sequenced; `S.No.` follows the standard Positive → Edge → Negative order. Automation-only
> scaffolding (fixture-create / cleanup-delete TCs) is not listed as a manual case.
>
> **Umbrella vs Family:** Umbrella is a **separate entity**. Its create form has an extra required
> **Umbrella Type** select, and the submit button reads **"Submit"** (not "Save"). **The Umbrella listing does
> NOT show a cover thumbnail** (Family's does), so image persistence is verified in **edit mode only**.
>
> **Structure:** Flat (no AC traceability matrix).

---

## Pages in scope

| Page | URL | Notes |
|---|---|---|
| Create Umbrella form | `/2024/umbrellas/create` | Vue form: **Umbrella Type** (select), Unique Code, Title, **Product Logo** image control; **Submit** button |
| Umbrella listing | `/2024/umbrellas` | Submit redirects here; cards show title/type/component count — **no cover thumbnail** |
| Umbrella detail → **Setup** tab | `/2024/umbrellas/<code>` | Edit mode; same image control; shows the saved cover |

---

## Product Logo image control — facts (identical component to Family)

- Two sources in one dashed dropzone: **local file** (accepts **png / jpeg / jpg** only) and **external URL** field.
- The external-URL preview loads only on an explicit **confirm** — pressing **Enter** *or* **clicking outside**
  the URL box (blur). It does **not** auto-load while typing.
- A **valid** image renders a preview thumbnail with a **Remove** button.
- A **broken/invalid URL** renders a generic **image-placeholder icon** (no real image) — accepted for now.
- An **unsupported format** (e.g. `.webp`) or a **non-image** file (e.g. `.txt`) is rejected with the red
  message **"You are uploading a file with an unsupported format. Please upload a file with a supported
  format (png, jpeg, jpg)."** plus a **Reset** link; no preview renders.

---

## Test Entities & Data

| Item | Value | Notes |
|---|---|---|
| Umbrella Type | `Generic Umbrella Product` | Required select on the create form (other option: `Teacher Training Umbrella Product`). |
| Unique Code = Title | e.g. `hkumbimgsave<runid>` | Search is title-based, so code and title use the **same** value. Unique per run. |
| External image URL | `https://cambridgeonehelp.cambridge.org/hc/article_attachments/23954872673938` | Valid Cambridge One logo (png). |
| Broken image URL | `https://example.com/this-family-cover-does-not-exist-xyz.png` | Does not resolve to a valid image. |
| Local image (png) | `D:\ebookCreate\familyImages\familyLogo.png` | Valid cover. |
| Non-image file | `D:\ebookCreate\familyImages\notAnImage.txt` | Plain text. |
| Special-character filename | `D:\ebookCreate\familyImages\sp3cial @#&()!+ name.png` | Valid png; name has spaces + `@#&()!+`. |

> **Login (precondition for every case):** `https://asgard-thor-builder.comprodls.com/2024/pre-login` →
> select org **Cambridge One** → confirm → enter `harishthoradmin` credentials at the comproDLS Identity
> IdP → land on `/2024/dashboard`.

---

## Test Cases

### ✅ POSITIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 1 |
| **Test Case ID** | TST_BUMB_TC_1 |
| **Title** | Verify an Umbrella is created and saved with a cover image that persists on the Setup (edit) page |
| **Linked Requirement** | NEMO-24627 (Umbrella cover image + persistence) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; on the **Create Umbrella** form (`/2024/umbrellas/create`). Unique code `hkumbimgsave<runid>` does not already exist. |
| **Test Steps** | 1. Select **Umbrella Type** = `Generic Umbrella Product`. 2. Enter Unique Code and Title (same value). 3. In **Product Logo**, add a cover via external URL (Enter to confirm); preview shows. 4. Click **Submit**. 5. On the umbrellas listing, search the title, open the umbrella, and switch to the **Setup** tab. |
| **Test Data** | Type `Generic Umbrella Product`; Code = Title = `hkumbimgsave<runid>`; external image URL |
| **Expected Result** | Submit returns to the umbrellas listing; opening the umbrella → **Setup** tab shows the **saved cover** matching the uploaded image. |
| **Remarks** | The umbrella listing shows no cover thumbnail — persistence is verified on the Setup page only. Automation deletes the umbrella afterwards (cleanup). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_BUMB_TC_11 |
| **Title** | Verify the external-URL preview loads on blur (clicking outside the text box) on the Create Umbrella form |
| **Linked Requirement** | RTM TC-CF-017 (external URL confirm behaviour) |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; on the **Create Umbrella** form. |
| **Test Steps** | 1. Type the external image URL into the URL field. 2. Without pressing Enter, **click outside** the URL box (e.g. click the **Title** field). 3. Wait for the preview. |
| **Test Data** | External image URL (Cambridge One logo) |
| **Expected Result** | The preview thumbnail loads on blur (the real image appears), same as pressing Enter. |
| **Remarks** | Parity with family TST_BFAM_TC_18. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_BUMB_TC_4 |
| **Title** | Verify a cover image is accepted from a local file on the Umbrella Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-016 (edit mode) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; an existing cover-less umbrella open on its **Setup** tab (`/2024/umbrellas/<code>`). |
| **Test Steps** | 1. In the **Product Logo** section of the Setup page, upload a local image. 2. Select `familyLogo.png`. 3. Wait for the preview. |
| **Test Data** | Local image: `familyLogo.png` |
| **Expected Result** | The image uploads and the preview thumbnail is shown on the Setup page (with a **Remove** button). |
| **Remarks** | Same image control as the create form. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_BUMB_TC_5 |
| **Title** | Verify a cover image is accepted from a valid external URL on the Umbrella Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-017 (edit mode) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; a cover-less umbrella open on its **Setup** tab. |
| **Test Steps** | 1. Type the external image URL into the URL field. 2. Confirm (Enter). 3. Wait for the preview. |
| **Test Data** | External image URL (Cambridge One logo) |
| **Expected Result** | The external image previews on the Setup page (real image, not placeholder). |
| **Remarks** | |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### 🔶 EDGE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_BUMB_TC_6 |
| **Title** | Verify the external-URL preview does NOT auto-load while typing and loads only after Enter (Setup page) |
| **Linked Requirement** | RTM TC-CF-018 (confirmation required) |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; a cover-less umbrella open on its **Setup** tab. |
| **Test Steps** | 1. Type the external image URL; do not press Enter or click away. 2. Observe (no preview). 3. Press **Enter**. 4. Observe (preview loads). |
| **Test Data** | External image URL (Cambridge One logo) |
| **Expected Result** | No preview while typing; preview loads after Enter. |
| **Remarks** | |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_BUMB_TC_10 |
| **Title** | Verify an image file whose filename contains special characters is accepted (Create Umbrella form) |
| **Linked Requirement** | RTM TC-CF-016 (file upload — filename handling) |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; on the **Create Umbrella** form. |
| **Test Steps** | 1. Upload a local png whose filename contains special characters: `sp3cial @#&()!+ name.png`. 2. Wait for the upload. |
| **Test Data** | Local image: `sp3cial @#&()!+ name.png` |
| **Expected Result** | The image is **accepted**, uploads and previews normally — the special characters in the filename do not block acceptance. |
| **Remarks** | Parity with family TST_BFAM_TC_17. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### ❌ NEGATIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 7 |
| **Test Case ID** | TST_BUMB_TC_7 |
| **Title** | Verify a broken/invalid external image URL shows the placeholder icon on the Umbrella Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-019 (broken external URL) |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; a cover-less umbrella open on its **Setup** tab. |
| **Test Steps** | 1. Type a broken image URL. 2. Confirm (Enter). 3. Observe the dropzone. |
| **Test Data** | Broken URL: `https://example.com/this-family-cover-does-not-exist-xyz.png` |
| **Expected Result** | No real image loads; the control shows a generic **image-placeholder icon** (accepted behaviour for now). The broken URL is not accepted as a valid cover. |
| **Remarks** | A clearer inline error for broken URLs may be added in a future iteration. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 8 |
| **Test Case ID** | TST_BUMB_TC_8 |
| **Title** | Verify a non-image file is rejected on the Umbrella Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-020 (non-image rejected) |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; a cover-less umbrella open on its **Setup** tab. |
| **Test Steps** | 1. Attempt to upload a non-image file `notAnImage.txt` to the Product Logo control. 2. Observe the dropzone. |
| **Test Data** | Non-image file: `notAnImage.txt` |
| **Expected Result** | No preview renders; the red message **"You are uploading a file with an unsupported format. Please upload a file with a supported format (png, jpeg, jpg)."** is shown with a **Reset** link. |
| **Remarks** | |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

> **Automation mapping:** these cases correspond 1:1 to `test/Builder/umbrellaImage.test.js`
> (`TST_BUMB_TC_1..11`, run via `npm run umbrellaImageTest_NEMO-24627_thor`). Automation-only scaffolding —
> `TST_BUMB_TC_2` (delete saved umbrella), `TST_BUMB_TC_3` (create cover-less edit fixture),
> `TST_BUMB_TC_9` (delete edit fixture) — is setup/cleanup and is not listed as a manual case.
