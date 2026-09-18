# Product questions / bug reports — Admin App Students tab

**Raised:** 2026-09-16 · **By:** QA automation (Students tab Phase 1, Group A)
**Environment for all four:** Thor — `https://micro-nemo.comprodls.com`
**School:** 3 July Test School 1 (key `FCN-CHZ-PDA`) · **Account:** `testt1@mailsac.com` (school admin)

> These are written to be pasted into Jira as-is. Each ends with an **Internal note (QA)** saying
> which test cases are affected — drop that section if the ticket is customer-facing.
>
> **Automation status:** the affected cases are **On Hold** in the register — written, registered
> and verified against the app, but deliberately kept OUT of the execution files so the suites do
> not stay permanently red. Each asserts the REQUIREMENT, never the defect, so it turns green by
> itself the day the product is fixed (the same treatment as `TST_SPRF_TC_7`).

| # | Title | Type | Priority |
|---|---|---|---|
| 1 | Student removal missing from the Students tab | Bug — needs product confirmation | High |
| 2 | "Create N account" stays enabled with an invalid row | Bug | High |
| 3 | Unused activation code search → HTTP 504 → error page | Bug | High |
| 4 | Raw translation keys instead of text | Bug | Medium |

---

## Issue 1 — Admin cannot remove a student from the school

**Component:** Students tab · **Found:** 2026-09-15 · **Last seen working:** 2026-08-28

### Summary
A school admin has no way to remove a student from the school account. The option is gone from both
places it used to exist — the student's profile and the student list.

### Steps to reproduce
1. Sign in as a school admin and open *My school accounts*.
2. Open the school with key `FCN-CHZ-PDA`.
3. Go to the **Students** tab.
4. Look at the student list: no row checkboxes, no "N Selected" counter, no **Remove from school
   account** button.
5. Open any student's row menu and click **View student profile**.
6. Look at the profile: no **Manage account** menu and no **Remove from school account** option. The
   only action is **Manage learner profile**, which edits the name.

### Expected
An admin can remove a student, either from the profile or by selecting rows in the list, with the
usual confirmation dialog before anything happens.

### Actual
No removal option anywhere on the Students tab. Checked on a child account and on adult accounts, on
two separate visits.

### Evidence
- **2026-08-28:** both paths existed — the profile had **Manage account → Remove from school
  account**; the list had row checkboxes, an "N Selected" counter and a **Remove from school
  account** button, with three confirmation dialogs (confirm, 50-student limit, email-report notice).
- **2026-09-15:** none of those elements are present in the page.

### Impact
If unintended, no school admin can remove a student at all. Students who have left keep access to the
school account and its classes.

### Question for product
Was student removal withdrawn deliberately (moved elsewhere, or switched off), or is this a
regression? We cannot tell from the UI, and the answer decides whether this is a bug to fix or a
change to document.

### Internal note (QA)
Blocks `TST_SPRF_TC_19`, `TST_SPRF_TC_20`, `TST_SPRF_TC_21`, `TST_SPRF_TC_22`. Our automated tests
were quietly adapted around the missing controls on 2026-09-09 (commit `c5ed7dc`), so the suite
stayed green while the feature was absent — which is why it went unnoticed.

---

## Issue 2 — "Create N account" stays enabled when a row is invalid

**Component:** Students → Add new students to classes → Create adult student accounts
**Found:** 2026-09-15

### Summary
After a CSV upload, rows breaking the username and password rules are correctly flagged — but the
submit button stays fully enabled, so an admin can submit a batch the form has already marked invalid.

### Steps to reproduce
1. Sign in as a school admin, open `FCN-CHZ-PDA`, go to the **Students** tab.
2. **Manage students → Add new students to classes**.
3. Choose **Adults** → **Next**.
4. Choose **Create adult student accounts** → **Next**.
5. **Upload file** with two rows, one valid and one invalid. Header row and data, exactly as the
   downloaded template:

   ```
   Student First name,Student Last name,Username,Password,Class key
   Valid,Student,autostudentvalid0915,Welcome1!,62k3-AXm6
   Invalid,Student,9B,abc,62k3-AXm6
   ```

   (In the real template the first two headers carry an apostrophe — "Student's First name" and
   "Student's Last name". Use the downloaded template rather than retyping it.)
6. Wait for the grid to render, then look at row 2 and at the submit button.

### Expected
While any row is invalid, account creation is unavailable — the submit button is disabled.

### Actual
Row 2 is flagged correctly, on the right fields:
- Username — *"This must start with a letter"*
- Password — *"See password guidance in the info section at the top"*
- Row 1 is clean.

But **"Create 2 account" is fully enabled** — no disabled attribute, no disabled styling, and it
accepts clicks.

### Impact
The only thing preventing submission of a known-bad batch is the admin noticing the red text. What
happens after submitting is unknown — we deliberately did not click it, to avoid creating real
accounts on a shared school.

### Also on this screen (minor)
The button reads **"Create 2 account"** — should be "accounts". The label is built from the row count.

### Evidence
Reproduced three times on 2026-09-15: two manual uploads and one automated run.

### Internal note (QA)
`TST_SBLK_TC_14`, fixture `TST_SBLK_TC_14_invalid_username_password.csv`. **On Hold** — kept out of
the suites; it never clicks Create.

---

## Issue 3 — Unused activation code search times out and throws the admin to the error page

**Component:** Students tab → "Who activated the code in my school?" · **Found:** 2026-09-15

### Summary
Searching an activation code never used at the school shows no "nothing found" message. The request
times out with HTTP 504 and the admin is redirected to the generic error page, losing school context.

### Steps to reproduce
1. Sign in as a school admin, open `FCN-CHZ-PDA`, go to the **Students** tab.
2. Tick **"Who activated the code in my school?"**.
3. Type a well-formed 16-character code never activated at this school, e.g. `AAAA-BBBB-CCCC-DDDD`.
4. Click **Search**.
5. Wait up to two minutes with the network tab open.

### Expected
A clear no-results state, as the name search gives: *"This school has no students that match your
search …"*. The admin stays on the Students tab.

### Actual
- `GET /admin/apigateway/org_perf_testschool_1/activationCodeSearch` returns **HTTP 504**.
- The admin bundle logs a JavaScript error.
- The page redirects to `/dashboard/error` — *"Sorry! Something went wrong…"*.
- School context is lost; the admin must navigate back in from *My school accounts*.

**Timing varies — allow two minutes when reproducing.** The failure arrived after **20 s**, **109 s**
and **62 s** on three attempts. The screen's own helper text says the search can take up to a minute.

### Impact
Mistyping a code is an everyday mistake, and the result is being ejected from the page with no
explanation. The admin also cannot tell whether the code is invalid or the system is broken.

### Evidence
Reproduced three times on 2026-09-15, including once after opening the school normally from the
dashboard card — so it is not caused by deep-linking.

### Internal note (QA)
`TST_SLST_TC_28`. **On Hold** — kept out of the suites. The failure message records the redirect URL
and the elapsed time.

---

## Issue 4 — Raw translation keys shown instead of text

**Component:** Students → bulk account creation and code activation
**Found:** 2026-08-22 · **Still present:** 2026-09-15

### Summary
Several dialogs and labels display untranslated keys instead of English text. Some are visible on
screen; others reach only screen-reader users.

### Where it appears
| Screen | What shows instead of text |
|---|---|
| Create adult student accounts — success dialog | `ADMIN.LEARNER.CREATE_ADULT_FORM.SUCCESS_MODAL_INFO_1`, `_2`, `_3` |
| Create adult student accounts — upload error dialog | `…FORM_UPLOAD_ERROR_HEADING`, `…FORM_UPLOAD_ERROR_INFO`, `…FORM_UPLOAD_ERROR_CLOSE` |
| Bulk activation — success dialog | `ADMIN.LEARNER.BULK_ACTIVATION.SUCCESS_MODAL_INFO_1`, `_2`, `_3` |
| Bulk activation — row checkbox label (screen readers only) | `ADMIN.LEARNER.BULK_ACTIVATION.SELECT_STUDENT` |
| Individual code activation — while a code is checked | `SCREEN_READER.PROCESSING_MESSAGE` |

### Steps to reproduce (without submitting anything)
1. Open **Students → Manage students → Add new students to classes → Adults → Create adult student
   accounts**.
2. Inspect the page's hidden dialogs — the success and upload-error dialogs exist in the page before
   they are triggered, and already show the keys above.
3. The same applies at **Students → Manage students → Activate course materials**.

The first two rows are also seen normally: the success dialog appears after the first successful bulk
creation.

### Expected
Real English text in every dialog and label.

### Impact
An admin completing a bulk creation or activation sees meaningless keys at the moment they need
confirmation of what happened. Screen-reader users hear a translation key instead of a description.

### Evidence
Present 2026-08-22, re-confirmed 2026-09-15. Looks like one missing set of translations rather than
separate typos.

### Internal note (QA)
`TST_SBLK_TC_9`, `TST_SBLK_TC_10`, `TST_SPRF_TC_16`.
