# Manual Test Cases — Family "Product Logo" Image Selection

**Feature:** Builder — Create/Edit Family cover image ("Product Logo" control)
**Module:** Builder Family (`BFAM`) — `pages/Builder/families.page.js`
**App:** asgard-thor-builder.comprodls.com (Thor)
**Purpose:** Verify the Family cover-image control on the **Create Family** form and the **Setup (edit)**
page — local-file upload, external-URL upload (Enter and blur), preview confirmation, unsupported/broken
inputs, special-character filenames, removal/replacement, and persistence to the detail page + Families list.

**Generated:** 2026-07-08 | **Scope:** Admin role only (`harishthoradmin`)
**Total TCs:** 15 (7 Positive, 3 Edge, 5 Negative)

> **ID convention (AGENTS.md Rule 6):** `TST_BFAM_TC_<N>` — module code `BFAM` from the Families page
> object, **not** a Jira ticket. The IDs here **match the automated suite** (`familyImage.test.js`) 1:1 for
> traceability, so they are **not** re-sequenced; `S.No.` follows the standard Positive → Edge → Negative
> order. Automation-only scaffolding (fixture-create / cleanup-delete TCs) is not listed as a manual case.
>
> **Structure:** Flat (no AC traceability matrix) — no formal acceptance criteria for this control.

---

## Pages in scope

| Page | URL | Notes |
|---|---|---|
| Create Family form | `/2024/families/create` | Vue form: Unique Code, Title, **Product Logo** image control |
| Families listing | `/2024/families` | Save redirects here; each family card shows a **cover thumbnail** |
| Family detail → **Setup** tab | `/2024/families/<code>` | Edit mode; same image control; shows the saved cover |

---

## Product Logo image control — facts (confirmed on Thor)

- Two sources in one dashed dropzone: **local file** (accepts **png / jpeg / jpg** only) and **external URL** field.
- The external-URL preview loads only on an explicit **confirm** — pressing **Enter** *or* **clicking outside**
  the URL box (blur). It does **not** auto-load while typing.
- A **valid** image renders a preview thumbnail with a **Remove** button.
- A **broken/invalid URL** renders a generic **image-placeholder icon** (no real image) — accepted behaviour
  for now (a clearer inline error may come in a future iteration).
- An **unsupported format** (e.g. `.webp`) or a **non-image** file (e.g. `.txt`) is rejected with the red
  message **"You are uploading a file with an unsupported format. Please upload a file with a supported
  format (png, jpeg, jpg)."** plus a **Reset** link; no preview renders.
- Cover image is optional — **Unique Code + Title** are still required to Save.

---

## Test Entities & Data

| Item | Value | Notes |
|---|---|---|
| Unique Code = Title | e.g. `hkfamimgsave<runid>` | Search is title-based, so code and title use the **same** value. Lowercase letters/digits; unique per run. |
| External image URL | `https://cambridgeonehelp.cambridge.org/hc/article_attachments/23954872673938` | Valid Cambridge One logo (png). |
| Broken image URL | `https://example.com/this-family-cover-does-not-exist-xyz.png` | Does not resolve to a valid image. |
| Local image (png) | `D:\ebookCreate\familyImages\familyLogo.png` | Valid cover. |
| Unsupported image (webp) | `D:\ebookCreate\familyImages\familyLogo.webp` | Valid webp, but not an allowed format. |
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
| **Test Case ID** | TST_BFAM_TC_1 |
| **Title** | Verify a cover image is accepted when uploaded from a local file on the Create Family form |
| **Linked Requirement** | RTM TC-CF-016 (Cover image uploadable via file selection) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; on the **Create Family** form (`/2024/families/create`). |
| **Test Steps** | 1. In the **Product Logo** section, click the upload area and choose a local image. 2. Select `familyLogo.png`. 3. Wait for the upload to complete. |
| **Test Data** | Local image: `familyLogo.png` |
| **Expected Result** | The image uploads and a **preview thumbnail** of the cover is shown (not the placeholder), with a **Remove** button. |
| **Remarks** | Only png/jpeg/jpg are allowed by the file picker. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 2 |
| **Test Case ID** | TST_BFAM_TC_2 |
| **Title** | Verify a cover image is accepted from a valid external URL confirmed with Enter |
| **Linked Requirement** | RTM TC-CF-017 (Cover image uploadable via external URL) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. In the **Product Logo** section, type the external image URL into the "Specify an external URL to the image" field. 2. Press **Enter** to confirm. 3. Wait for the preview. |
| **Test Data** | External image URL (Cambridge One logo) |
| **Expected Result** | The preview thumbnail of the external image is shown (real image, not the placeholder), with a **Remove** button. |
| **Remarks** | Enter is one of two confirm triggers (see TC_18 for blur). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 3 |
| **Test Case ID** | TST_BFAM_TC_18 |
| **Title** | Verify the external-URL preview loads on blur (clicking outside the text box) |
| **Linked Requirement** | RTM TC-CF-017 (external URL confirm behaviour) |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. Type the external image URL into the URL field. 2. Without pressing Enter, **click outside** the URL box (e.g. click the **Title** field). 3. Wait for the preview. |
| **Test Data** | External image URL (Cambridge One logo) |
| **Expected Result** | The preview thumbnail loads on blur (the real image appears), same as pressing Enter. |
| **Remarks** | Confirms blur is a valid confirm trigger, not only Enter. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 4 |
| **Test Case ID** | TST_BFAM_TC_6 |
| **Title** | Verify a selected cover image can be removed and replaced with a different source |
| **Linked Requirement** | RTM TC-CF-021 (image removable/replaceable) |
| **Type** | Positive |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. Add a cover via external URL (Enter to confirm) and confirm the preview shows. 2. Click **Remove**. 3. Confirm the preview is gone and the upload control returns. 4. Add a different cover via **local file** (`familyLogo.png`). |
| **Test Data** | External image URL; then local image `familyLogo.png` |
| **Expected Result** | Remove clears the preview and restores the upload/URL control; the replacement local image then uploads and previews successfully. |
| **Remarks** | |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 5 |
| **Test Case ID** | TST_BFAM_TC_8 |
| **Title** | Verify a saved family's cover image persists on the Setup (edit) page and the Families list |
| **Linked Requirement** | RTM TC-CF-016/017 + persistence |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. Unique code `hkfamimgsave<runid>` does not already exist. |
| **Test Steps** | 1. Enter Unique Code and Title (same value). 2. Add a cover via external URL (Enter to confirm); preview shows. 3. Click **Save**. 4. On the Families listing, search the title. 5. Open the family and switch to the **Setup** tab. |
| **Test Data** | Code = Title = `hkfamimgsave<runid>`; external image URL |
| **Expected Result** | Save returns to the Families listing; the family card shows the **cover thumbnail**; opening the family → **Setup** tab shows the **saved cover** matching the uploaded image. |
| **Remarks** | Automation deletes the created family afterwards (cleanup). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 6 |
| **Test Case ID** | TST_BFAM_TC_11 |
| **Title** | Verify a cover image is accepted from a local file on the Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-016 (edit mode) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; an existing cover-less family is open on its **Setup** tab (`/2024/families/<code>`). |
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
| **S.No.** | 7 |
| **Test Case ID** | TST_BFAM_TC_12 |
| **Title** | Verify a cover image is accepted from a valid external URL on the Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-017 (edit mode) |
| **Type** | Positive |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; an existing cover-less family is open on its **Setup** tab. |
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
| **S.No.** | 8 |
| **Test Case ID** | TST_BFAM_TC_3 |
| **Title** | Verify the external-URL preview does NOT auto-load while typing and loads only after Enter |
| **Linked Requirement** | RTM TC-CF-018 (confirmation required before preview) |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. Type the external image URL into the URL field but **do not** press Enter or click away. 2. Observe the dropzone. 3. Now press **Enter**. 4. Observe again. |
| **Test Data** | External image URL (Cambridge One logo) |
| **Expected Result** | While typing (before confirm) **no preview** appears; after pressing **Enter** the preview loads. |
| **Remarks** | Blur is the other confirm trigger (TC_18). |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 9 |
| **Test Case ID** | TST_BFAM_TC_13 |
| **Title** | Verify external-URL confirmation behaviour (no auto-load; Enter confirms) on the Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-018 (edit mode) |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; a cover-less family open on its **Setup** tab. |
| **Test Steps** | 1. Type the external image URL; do not confirm. 2. Observe (no preview). 3. Press **Enter**. 4. Observe (preview loads). |
| **Test Data** | External image URL (Cambridge One logo) |
| **Expected Result** | No preview while typing; preview loads after Enter — same as the create form. |
| **Remarks** | |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 10 |
| **Test Case ID** | TST_BFAM_TC_17 |
| **Title** | Verify an image file whose filename contains special characters is accepted |
| **Linked Requirement** | RTM TC-CF-016 (file upload — filename handling) |
| **Type** | Edge |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. Upload a local png whose filename contains special characters: `sp3cial @#&()!+ name.png`. 2. Wait for the upload. |
| **Test Data** | Local image: `sp3cial @#&()!+ name.png` |
| **Expected Result** | The image is **accepted**, uploads and previews normally — the special characters in the filename do not block acceptance (the name is URL-encoded in the stored key). |
| **Remarks** | Confirms filename special characters are handled. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

### ❌ NEGATIVE TEST CASES

---

| Field | Value |
|---|---|
| **S.No.** | 11 |
| **Test Case ID** | TST_BFAM_TC_4 |
| **Title** | Verify a broken/invalid external image URL is not accepted as a cover (placeholder icon shown) |
| **Linked Requirement** | RTM TC-CF-019 (broken external URL) |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. Type a broken image URL into the URL field. 2. Confirm (Enter). 3. Observe the dropzone. |
| **Test Data** | Broken URL: `https://example.com/this-family-cover-does-not-exist-xyz.png` |
| **Expected Result** | No real image loads; the control shows a generic **image-placeholder icon** (accepted behaviour for now). The broken URL is not accepted as a valid cover. |
| **Remarks** | A clearer inline error for broken URLs may be added in a future iteration. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 12 |
| **Test Case ID** | TST_BFAM_TC_14 |
| **Title** | Verify a broken/invalid external image URL shows the placeholder icon on the Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-019 (edit mode) |
| **Type** | Negative |
| **Priority** | Medium |
| **Preconditions** | Logged in as Admin; a cover-less family open on its **Setup** tab. |
| **Test Steps** | 1. Type a broken image URL. 2. Confirm (Enter). 3. Observe. |
| **Test Data** | Broken URL (as above) |
| **Expected Result** | No real image; the image-placeholder icon is shown; the broken URL is not accepted as a cover. |
| **Remarks** | |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 13 |
| **Test Case ID** | TST_BFAM_TC_5 |
| **Title** | Verify a non-image file is rejected with an unsupported-format message |
| **Linked Requirement** | RTM TC-CF-020 (non-image rejected) |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. Attempt to upload a non-image file `notAnImage.txt` to the Product Logo control. 2. Observe the dropzone. |
| **Test Data** | Non-image file: `notAnImage.txt` |
| **Expected Result** | No preview renders; the red message **"You are uploading a file with an unsupported format. Please upload a file with a supported format (png, jpeg, jpg)."** is shown with a **Reset** link. |
| **Remarks** | The file picker filters to png/jpeg by `accept`; a file reaching the control via drag/other path is rejected with this message. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 14 |
| **Test Case ID** | TST_BFAM_TC_15 |
| **Title** | Verify a non-image file is rejected on the Setup (edit) page |
| **Linked Requirement** | RTM TC-CF-020 (edit mode) |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; a cover-less family open on its **Setup** tab. |
| **Test Steps** | 1. Attempt to upload `notAnImage.txt`. 2. Observe. |
| **Test Data** | Non-image file: `notAnImage.txt` |
| **Expected Result** | No preview; the unsupported-format red message + **Reset** link are shown — same as the create form. |
| **Remarks** | |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

| Field | Value |
|---|---|
| **S.No.** | 15 |
| **Test Case ID** | TST_BFAM_TC_7 |
| **Title** | Verify a disallowed image format (.webp) is rejected with a format-specific message |
| **Linked Requirement** | RTM CF-IMG-005 (disallowed format) |
| **Type** | Negative |
| **Priority** | High |
| **Preconditions** | Logged in as Admin; on the **Create Family** form. |
| **Test Steps** | 1. Attempt to upload a `.webp` image (`familyLogo.webp`) to the Product Logo control. 2. Observe the dropzone. |
| **Test Data** | Unsupported image: `familyLogo.webp` |
| **Expected Result** | No preview; the red message **"You are uploading a file with an unsupported format. Please upload a file with a supported format (png, jpeg, jpg)."** is shown with a **Reset** link. |
| **Remarks** | webp is a valid image but not an allowed format for the cover. |
| **Actual Result** | |
| **Status** | Not Run |
| **Comments / Defect ID** | |

---

> **Automation mapping:** these cases correspond 1:1 to `test/Builder/familyImage.test.js`
> (`TST_BFAM_TC_1..18`, run via `npm run familyImageTest_thor`). Automation-only scaffolding —
> `TST_BFAM_TC_9` (delete saved family), `TST_BFAM_TC_10` (create cover-less edit fixture),
> `TST_BFAM_TC_16` (delete edit fixture) — is setup/cleanup and is not listed as a manual case.
