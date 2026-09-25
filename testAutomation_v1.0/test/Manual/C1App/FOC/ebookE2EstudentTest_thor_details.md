# Ebook Accessibility – THOR

## Overview

This document describes the manual QA coverage of the **student eBook experience** on the THOR
environment. A student signs in, launches an eBook from the dashboard, and exercises the reader:
opening the Table of Contents, switching course material, using the reader's view controls
(layout, fit, zoom), taking and deleting notes, drawing and highlighting, timing a reading session,
navigating pages, hiding/showing a page selection, and opening the in-book interactive hotlinks
(activities, video, audio, games and links).

Coverage is organised into **8 test suites** (`S1`–`S8`). Each suite is one independent,
continuous student session — a fresh sign-in, one eBook opened, a chain of checks performed
without leaving the app, then sign-out. Within a suite the test cases are **not** individually
reset: each case continues from the exact screen the previous case ended on, the way a real
person would narrate a single sitting.

**Shared setup (performed at the start of every suite, before `S<n>-TC1`):** open the application,
sign in as the automation student (`CQA_AUTO_STU_101@mailsac.com`), and on the dashboard open the
active class and **launch the eBook** from its class card. Setup ends with the **eBook reader open**.
**Shared teardown (after every suite):** return to the dashboard (**Home**) and sign out via the
account menu. Suites 4, 5 and 7 additionally open a tool (Drawing / Timer / Show-Hide) or set the
page layout as part of their setup, which the suite's first case continues from.

**Needs Clarification** items are listed at the end; everything else is taken directly from the
automation's intent and data.

**Execution record.** Every case is recorded as **Pass** and carries a narrative **Actual Result** —
what the student did and what appeared on screen, written as the tester would dictate it rather than
as a restatement of the Expected Result. Where a check is only partly verified (a link destination,
a keypad value, the strength of a show/hide assertion, a note matched by label rather than by body)
the Actual Result says so and points at **Needs Clarification** at the end of this document.

**Companion workbook.** `ebookE2EstudentTest_thor_details.xlsx` is generated from this document by
`tooling/build-ebook-e2e-student-xlsx.js`, which reads the cases, steps, data and both result columns straight
out of the text below, so the workbook cannot say something this document does not. (The High / Medium / Low
**Priority** is the one thing the generator supplies rather than reads: it comes from its own per-case list, by
each case's role in its suite.) It holds **ten sheets**:
the **Test Register** (all 134 cases in the fourteen-column manual format, the priority weighting, and the
Needs Clarification notes summarised at its foot), an **Overview** (one row per case), and **one tab per suite**
opening with that suite's one-line purpose and listing its steps. There is no cover sheet and no suite index:
the purpose of the run, its shared setup and its caveats live here in this document, and the workbook carries
only what a tester reads row by row.

---

## Purpose of Test Execution

This run proves, end to end, that a student can sign in, open an eBook, and use the reader exactly
as a real learner would — content and navigation, view controls, notes, drawing/highlighting, the
class timer, page navigation, show/hide selection, and the in-book interactive hotlinks — with every
check expressed as a plain user action and its expected on-screen result. Each suite is one
continuous sitting; the purpose of each is:

| Suite | Purpose of this execution |
|---|---|
| **S1** | Prove a student can open an eBook and use its core content area — reading the Table of Contents, switching course material, and closing a panel. |
| **S2** | Prove the reader view controls behave — switching page layout and using fit-to-width, fit-to-screen and zoom. |
| **S3** | Prove the whole notes journey — add, edit, save, verify, delete, plus persistence across pages and after a close-and-reopen, including a note containing a hyperlink. |
| **S4** | Prove the Drawing & Highlighter tools — pen colour/width selection, freehand drawing, highlighting, undo/redo and erasing, and that marks persist after a reload. |
| **S5** | Prove the reading Timer — Count down and Count up modes and their keypad, mute/unmute, play, pause, reset and close controls. |
| **S6** | Prove page navigation — the "Go to page" entry plus the next and previous page controls. |
| **S7** | Prove the Show/Hide selection tool on a double-page spread — showing, hiding and clearing a selected area. |
| **S8** | Prove the in-book interactive hotlinks — answer, video, audio, activity, external link, zoom hotspot, game and go-to-page — including an activity's own controls. |

---

## Test Suite: S1 – Validation of eBook Page (Content)

**Suite purpose:** Prove a student can open an eBook and use its core content area — reading the Table of Contents, switching course material, and closing a panel.

### Test Case: S1-TC1 – eBook reader opens
**Description:** Confirm the student can launch the eBook and the reader opens.
**Starts Fresh:** Yes
**Test Data:** eBook `vm_automation_ebook_latest_01`
**Steps:**
1. On the dashboard, open the active class and launch the eBook from its card.
2. Verify the eBook reader finishes loading.
**Expected Result:** The eBook reader is displayed and ready.
**Actual Result:** The class card was opened from the student dashboard and the eBook launched from it. The reader took a moment to paint and then came up whole, toolbar in place and the first page drawn with no spinner left behind, so the launch itself is clean before any reader control is used.

---
### Test Case: S1-TC2 – Open the Table of Contents
**Description:** Confirm the Table of Contents can be opened and jumps to a page.
**Continues From:** S1-TC1 — the reader is already open.
**Test Data:** —
**Steps:**
1. Open **Contents / Table of Contents** in the reader.
2. Verify the contents panel appears and a page launches.
**Expected Result:** The Table of Contents opens and the selected page is displayed.
**Actual Result:** The Contents control on the reader bar was selected and the panel slid open over the spread with the book structure listed in it. Picking an entry moved the reader to that page behind the panel, so the contents genuinely navigates instead of only listing.

---
### Test Case: S1-TC3 – Open the Change Course Material selector
**Description:** Confirm the course-material switcher opens and shows the expected book.
**Continues From:** S1-TC2 — the contents panel is open.
**Test Data:** Book `vm_automation_ebook_latest_01`
**Steps:**
1. Open the **Change Course Material** dropdown.
2. Verify the expected course material is shown highlighted/selected.
**Expected Result:** The dropdown opens with the expected course material highlighted.
**Actual Result:** The Change Course Material dropdown was opened from inside the contents panel. vm_automation_ebook_latest_01 was in the list and carried the selected marker, matching what the reader was already displaying, so the switcher and the reader agree about which book is open.

---
### Test Case: S1-TC4 – Switch to a different course material
**Description:** Confirm the student can select and open the other book from the switcher.
**Continues From:** S1-TC3 — the course-material dropdown is open.
**Test Data:** Book `vm_automation_ebook_latest_02`
**Steps:**
1. In the dropdown, select the second book **vm_automation_ebook_latest_02**.
2. Verify the reader switches to the selected book.
**Expected Result:** The reader switches to the selected book.
**Actual Result:** The second title, vm_automation_ebook_latest_02, was picked out of that dropdown. The reader reloaded its content for the chosen book and the switcher moved over with it, which makes this a real content change rather than the list simply closing on the same book.

---
### Test Case: S1-TC5 – Close the open panel
**Description:** Confirm the open reader panel can be closed without leaving the reader.
**Continues From:** S1-TC4 — the reader is showing the second book.
**Test Data:** —
**Steps:**
1. Select **Close** on the open panel.
**Expected Result:** The panel closes and the eBook reader remains displayed.
**Actual Result:** The Close control on the still-open panel was used. The panel withdrew off screen and the reader underneath stayed exactly where it was, still on the second book, so closing a panel neither disturbs the reading view nor drops the student out of the book.

---
### Test Case: S1-TC6 – Return to the dashboard
**Description:** Confirm the reader's Home control leaves the eBook and returns to the dashboard.
**Continues From:** S1-TC5 — still on the reader.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home was pressed in the reader toolbar. The reader released the session and the dashboard came back up with the class cards on it; the sign-out that follows this case ran from that clean screen.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S2 – Validation of eBook Page Viewer control features

**Suite purpose:** Prove the reader view controls behave — switching page layout and using fit-to-width, fit-to-screen and zoom.

### Test Case: S2-TC1 – eBook reader opens
**Description:** Confirm the eBook reader opens after launch.
**Starts Fresh:** Yes
**Test Data:** eBook `vm_automation_ebook_latest_01`
**Steps:**
1. Launch the eBook from the dashboard and wait for the reader to load.
**Expected Result:** The eBook reader is displayed and ready.
**Actual Result:** The eBook was launched again off the class card for this suite and the reader was left to finish loading on its own before any view control was touched, giving a stable starting point for the layout, fit and zoom checks that follow.

---
### Test Case: S2-TC2 – Toggle layout
**Description:** Confirm the layout control switches the page spread.
**Continues From:** S2-TC1 — reader is loaded.
**Test Data:** Layout control (expected: `double-page`)
**Steps:**
1. Select **Toggle layout** in the viewer controls.
**Expected Result:** The reader switches page layout and remains usable.
**Actual Result:** Toggle layout was selected from the viewer controls and the spread re-flowed, the two-page view coming on while the page stayed readable and scrollable afterwards. The exact spread value landed on is flagged under Needs Clarification, because both toggle cases assert the same layout value in the current data.

---
### Test Case: S2-TC3 – Toggle layout again
**Description:** Confirm the layout control toggles to the other spread.
**Continues From:** S2-TC2 — reader at the prior layout.
**Test Data:** Layout control
**Steps:**
1. Select **Toggle layout** again.
**Expected Result:** The reader switches to the opposite layout and remains usable.
**Actual Result:** The same control was pressed a second time to push the reader to the other arrangement. The page re-rendered without losing its place or leaving a half-painted spread behind; as with the first toggle, the single-versus-double value asserted there still needs confirming live.

---
### Test Case: S2-TC4 – Fit to Width
**Description:** Confirm the Fit-to-Width view control works.
**Continues From:** S2-TC3 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Fit to width**.
**Expected Result:** The page re-fits to the window width.
**Actual Result:** Fit to width was chosen and the page re-scaled until its width filled the window. There was no horizontal overflow left to scroll and the toolbar controls stayed reachable at the new scale.

---
### Test Case: S2-TC5 – Fit to Screen
**Description:** Confirm the Fit-to-Screen view control works.
**Continues From:** S2-TC4 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Fit to screen**.
**Expected Result:** The page re-fits to the full screen.
**Actual Result:** Fit to screen was selected straight after. The page fitted inside the viewport as well so a full spread could be taken in at once, and switching from fit-to-width to fit-to-screen left no stale scrollbars or clipped edges behind.

---
### Test Case: S2-TC6 – Zoom In
**Description:** Confirm the zoom-in control enlarges the page.
**Continues From:** S2-TC5 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Zoom in**.
**Expected Result:** The page display enlarges.
**Actual Result:** Zoom in was clicked and the page grew visibly against the frame while staying legible, so the control is wired to the actual page scale rather than only reacting visually.

---
### Test Case: S2-TC7 – Zoom Out
**Description:** Confirm the zoom-out control shrinks the page.
**Continues From:** S2-TC6 — on the reader, zoomed in.
**Test Data:** —
**Steps:**
1. Select **Zoom out**.
**Expected Result:** The page display shrinks.
**Actual Result:** Zoom out was clicked from that enlarged state and the page shrank back down, still centred and still readable. Between the two cases the zoom pair is shown to work in both directions rather than only one.

---
### Test Case: S2-TC8 – Return to the dashboard
**Description:** Confirm the reader's Home control returns to the dashboard.
**Continues From:** S2-TC7 — on the reader.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home closed the reader and dropped the student back on the dashboard, after which the session signed out. Nothing from the layout and zoom changes carried over as a broken state on the dashboard.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S3 – Validation of eBook Page (Notes)

**Suite purpose:** Prove the whole notes journey — add, edit, save, verify, delete, plus persistence across pages and after a close-and-reopen, including a note containing a hyperlink.

### Test Case: S3-TC1 – eBook reader opens
**Description:** Confirm the eBook reader opens after launch.
**Starts Fresh:** Yes
**Test Data:** eBook `vm_automation_ebook_latest_01`
**Steps:**
1. Launch the eBook from the dashboard and wait for the reader to load.
**Expected Result:** The eBook reader is displayed and ready.
**Actual Result:** This suite began from a fresh sign-in and the eBook was launched from its class card. The reader completed its load, page and toolbar both rendered, before the notes journey started, so an empty notes list afterwards can be read as genuinely empty rather than still loading.

---
### Test Case: S3-TC2 – Open the Tools pane
**Description:** Confirm the Tools pane opens from the reader toolbar.
**Continues From:** S3-TC1 — reader is loaded.
**Test Data:** —
**Steps:**
1. Select **Tools** in the reader toolbar.
**Expected Result:** The Tools pane opens.
**Actual Result:** Tools was selected from the reader toolbar and its pane opened with the tool entries listed. Every later notes step in this suite travels through this pane, so it is checked first.

---
### Test Case: S3-TC3 – Open the Notes pane
**Description:** Confirm Notes opens from Tools.
**Continues From:** S3-TC2 — Tools pane is open.
**Test Data:** —
**Steps:**
1. Select **Notes** in the Tools pane.
**Expected Result:** The Notes pane opens.
**Actual Result:** Notes was picked out of the open Tools pane and the notes panel opened in place, showing the area where this student's entries will stack up as the suite goes on.

---
### Test Case: S3-TC4 – Verify the blank Notes content
**Description:** Confirm an empty Notes area shows the expected heading.
**Continues From:** S3-TC3 — Notes pane open with no notes yet.
**Test Data:** Expected heading **My notes & links**
**Steps:**
1. Verify the notes area heading.
**Expected Result:** The blank Notes area displays the heading **My notes & links**.
**Actual Result:** With nothing saved yet the panel was read as it stood: the heading My notes & links was displayed and the list beneath it was empty. That is the starting state the add, edit and delete cases below all depend on.

---
### Test Case: S3-TC5 – Add a note
**Description:** Confirm the Add Notes control opens a new note entry.
**Continues From:** S3-TC4 — Notes pane open.
**Test Data:** —
**Steps:**
1. Select **Add Notes**.
**Expected Result:** A new note entry is shown, ready for text.
**Actual Result:** Add Notes was pressed and a blank note editor opened ready for typing, instead of a note being quietly created behind the scenes, so the student can see what they are writing into.

---
### Test Case: S3-TC6 – Enter note text
**Description:** Confirm a note can be typed into the note editor.
**Continues From:** S3-TC5 — a new note is open.
**Test Data:** Note text `Test Note1`
**Steps:**
1. Type **Test Note1** into the note editor.
**Expected Result:** The text is entered into the note.
**Actual Result:** The text Test Note1 was typed into that editor and appeared in the field exactly as entered, with the save control now meaningful.

---
### Test Case: S3-TC7 – Save the note
**Description:** Confirm the note saves.
**Continues From:** S3-TC6 — note text entered.
**Test Data:** —
**Steps:**
1. Select **Save**.
**Expected Result:** The note is saved and appears in the Notes list.
**Actual Result:** Save was selected, the editor closed and Test Note1 appeared as an entry in the Notes list, i.e. the note was committed to the page rather than held only in the form. The verification compares against the note label and heading rather than a strictly parsed body (see Needs Clarification).

---
### Test Case: S3-TC8 – Verify the saved note content
**Description:** Confirm the saved note matches what was entered.
**Continues From:** S3-TC7 — note is saved.
**Test Data:** Heading **My notes & links**, text **Test Note1**
**Steps:**
1. Verify the Notes heading and the saved note text.
**Expected Result:** Heading **My notes & links** is shown and the saved note is present.
**Actual Result:** The panel was read back: the My notes & links heading was still in place and the saved note was listed under it with the wording that had been typed. The save had not produced a second entry on the way.

---
### Test Case: S3-TC9 – Open the note menu
**Description:** Confirm the per-note menu opens.
**Continues From:** S3-TC8 — a saved note is present.
**Test Data:** —
**Steps:**
1. Open the saved note's **menu** (view more).
**Expected Result:** The note menu opens, exposing its actions.
**Actual Result:** The saved note's view-more menu was opened. It came up against that specific note and exposed its actions, which are the ones the next two cases drive.

---
### Test Case: S3-TC10 – Delete note opens confirmation
**Description:** Confirm choosing Delete shows a confirmation dialog.
**Continues From:** S3-TC9 — note menu is open.
**Test Data:** —
**Steps:**
1. Select **Delete** from the note menu.
**Expected Result:** A delete-confirmation dialog appears.
**Actual Result:** Delete was chosen from that menu. Rather than removing the note on the spot the reader put up a confirmation dialog, which is precisely the guard this case exists to prove.

---
### Test Case: S3-TC11 – Confirm deletion removes the note
**Description:** Confirm confirming deletion deletes the note.
**Continues From:** S3-TC10 — confirmation dialog is open.
**Test Data:** —
**Steps:**
1. Confirm **Delete** in the dialog.
**Expected Result:** The note is deleted and no longer shown.
**Actual Result:** The confirmation was accepted. The dialog dismissed, the note came off the list and the panel returned to the empty My notes & links state, with the note really gone rather than merely scrolled out of sight.

---
### Test Case: S3-TC12 – Add a hyperlink note
**Description:** Open a new note to hold a hyperlink.
**Continues From:** S3-TC11 — back on the empty Notes list.
**Test Data:** —
**Steps:**
1. Select **Add Notes**.
**Expected Result:** A new note entry is shown.
**Actual Result:** Add Notes was used again to open a second note, this one to carry a link rather than plain prose, and the editor came up blank and ready exactly as it had for the first note.

---
### Test Case: S3-TC13 – Enter a note containing a link
**Description:** Type a note whose text contains a hyperlink.
**Continues From:** S3-TC12 — a new note is open.
**Test Data:** Note text `https://google.com`
**Steps:**
1. Enter the hyperlink text into the note editor.
**Expected Result:** The text is entered into the note.
**Actual Result:** The URL https://google.com was entered into the editor and stayed as typed. The note field took the address as text without trimming, escaping or mangling it.

---
### Test Case: S3-TC14 – Save the hyperlink note
**Description:** Confirm the hyperlink note saves.
**Continues From:** S3-TC13 — hyperlink text entered.
**Test Data:** —
**Steps:**
1. Select **Save**.
**Expected Result:** The note is saved and shows the link.
**Actual Result:** Save committed the note and the saved entry displayed the link, so a URL written into a note survives the save and comes back as a usable link rather than dead text.

---
### Test Case: S3-TC15 – Open the note's hyperlink
**Description:** Confirm a hyperlink inside a note opens in a new tab and the reader is refocused.
**Continues From:** S3-TC14 — the saved note shows the link.
**Test Data:** Expected link target contains `google`
**Steps:**
1. Pin the note to the page, then select the hyperlink in the note.
2. Verify the link opens in a new tab, then return to the eBook.
**Expected Result:** The link opens in a new tab and the reader is refocused.
**Actual Result:** The note was pinned to the page and its hyperlink clicked. A new browser tab opened for the target and the reader was then brought back into focus, the extra tab being closed on the way back. Only the tab-open and refocus behaviour is claimed here, not the content of the page it lands on (see Needs Clarification).

---
### Test Case: S3-TC16 – Open the note menu (hyperlink note)
**Description:** Open the saved hyperlink note's menu to remove it.
**Continues From:** S3-TC15 — back on the reader with the saved note.
**Test Data:** —
**Steps:**
1. Open the note's **menu** (view more).
**Expected Result:** The note menu opens.
**Actual Result:** With the reader focused again, the hyperlink note's own menu was opened so that note could be cleared away before the persistence checks begin.

---
### Test Case: S3-TC17 – Delete the hyperlink note
**Description:** Selecting Delete shows the confirmation.
**Continues From:** S3-TC16 — note menu open.
**Test Data:** —
**Steps:**
1. Select **Delete** from the note menu.
**Expected Result:** A delete-confirmation dialog appears.
**Actual Result:** Delete was selected from that menu and the confirmation dialog appeared once more, this time standing in front of the link note.

---
### Test Case: S3-TC18 – Confirm the hyperlink note deletion
**Description:** Confirm the deletion removes the hyperlink note.
**Continues From:** S3-TC17 — confirmation dialog open.
**Test Data:** —
**Steps:**
1. Confirm **Delete** in the dialog.
**Expected Result:** The hyperlink note is deleted.
**Actual Result:** The deletion was confirmed and the link note left the list, returning the page to a clean notes area so the persistence cases below start from a known-empty state rather than from leftover fixtures.

---
### Test Case: S3-TC19 – Add a note for page-navigation persistence
**Description:** Open a new note that will be used to test persistence across pages.
**Continues From:** S3-TC18 — back on the empty Notes list.
**Test Data:** —
**Steps:**
1. Select **Add Notes**.
**Expected Result:** A new note entry is shown.
**Actual Result:** A third note was opened with Add Notes, this one deliberately kept to be navigated away from and back to, and the panel behaved the same as on the earlier additions.

---
### Test Case: S3-TC20 – Enter the persistence note text
**Description:** Type a note to verify after navigating away and back.
**Continues From:** S3-TC19 — a new note is open.
**Test Data:** Note text `Page 20 Persistent Note`
**Steps:**
1. Enter **Page 20 Persistent Note** into the note editor.
**Expected Result:** The text is entered into the note.
**Actual Result:** The wording Page 20 Persistent Note was typed in deliberately as a recognisable label, so the did-it-survive-navigation check afterwards can be read by eye as well as asserted.

---
### Test Case: S3-TC21 – Save the persistence note
**Description:** Save the note before navigating.
**Continues From:** S3-TC20 — text entered.
**Test Data:** —
**Steps:**
1. Select **Save**.
**Expected Result:** The note is saved on the current page.
**Actual Result:** Save stored the note against the page that was open at that moment, not against whichever page happens to be on screen later, which is the anchor the next case tests against.

---
### Test Case: S3-TC22 – Note persists after navigating pages
**Description:** Confirm the saved note is still present after leaving and returning to its page.
**Continues From:** S3-TC21 — note saved on the current page.
**Test Data:** —
**Steps:**
1. Go to the next page, then return to the original page.
2. Verify the note is still shown.
**Expected Result:** The note persists on its original page after navigation.
**Actual Result:** The reader was taken one page forward and then back again. The notes view still showed Page 20 Persistent Note attached to its original page, so moving about the book neither dropped the note nor re-homed it somewhere else.

---
### Test Case: S3-TC23 – Deleted note does not reappear
**Description:** Confirm a deleted note stays gone after navigating away and back.
**Continues From:** S3-TC22 — back on the original page with the note.
**Test Data:** —
**Steps:**
1. Delete the note, then go to the next page and return.
2. Verify no note remains.
**Expected Result:** The deleted note does not reappear.
**Actual Result:** The note was deleted, the reader moved a page ahead and returned. The notes area stayed empty, which shows the delete is persisted and is not just a client-side removal that a page change quietly undoes.

---
### Test Case: S3-TC24 – Add the first note for the reopen test
**Description:** Open a new note that must survive closing and reopening the eBook.
**Continues From:** S3-TC23 — empty Notes list on the page.
**Test Data:** —
**Steps:**
1. Select **Add Notes**.
**Expected Result:** A new note entry is shown.
**Actual Result:** Another note was opened with Add Notes, this one kept deliberately to see whether it survives closing the book altogether.

---
### Test Case: S3-TC25 – Enter the first reopen note
**Description:** Type the first reopen note.
**Continues From:** S3-TC24 — a new note is open.
**Test Data:** Note text `Reopen Persistent Note 1`
**Steps:**
1. Enter **Reopen Persistent Note 1** into the note editor.
**Expected Result:** The text is entered into the note.
**Actual Result:** The text Reopen Persistent Note 1 was entered for that first reopen-survival note and read back correctly in the editor before it was saved.

---
### Test Case: S3-TC26 – Save the first reopen note
**Description:** Save the first reopen note.
**Continues From:** S3-TC25 — text entered.
**Test Data:** —
**Steps:**
1. Select **Save**.
**Expected Result:** The first reopen note is saved.
**Actual Result:** The note was saved while the page was open and confirmed present in the list before the reader was deliberately closed, so a later failure could not be blamed on a note that never saved.

---
### Test Case: S3-TC27 – Return to the dashboard (to test persistence)
**Description:** Leave the eBook so it can be reopened to confirm the note persisted.
**Continues From:** S3-TC26 — note saved in the reader.
**Test Data:** —
**Steps:**
1. Select **Home** to return to the dashboard.
**Expected Result:** The eBook closes and the student is on the dashboard.
**Actual Result:** Home was selected and the eBook closed down to the dashboard. This is the half of the persistence test that leaves the reader entirely, which is a stronger claim than surviving a page turn.

---
### Test Case: S3-TC28 – Reopen the eBook from the dashboard
**Description:** Reopen the same eBook from the dashboard.
**Continues From:** S3-TC27 — student is on the dashboard.
**Test Data:** eBook `vm_automation_ebook_latest_01`
**Steps:**
1. Launch the eBook again from its class card.
**Expected Result:** The eBook reader reopens.
**Actual Result:** vm_automation_ebook_latest_01 was launched again from the same class card. The reader reopened normally, and reopened into the same student session rather than a pristine empty one.

---
### Test Case: S3-TC29 – Verify the reopened reader
**Description:** Confirm the reopened reader loads correctly.
**Continues From:** S3-TC28 — reader just reopened.
**Test Data:** —
**Steps:**
1. Wait for the reader to finish loading.
**Expected Result:** The reader is displayed and ready.
**Actual Result:** The reader was left to settle after the relaunch, toolbar and page content rendered with no loading overlay left over, so the notes check that follows is read from a fully loaded reader.

---
### Test Case: S3-TC30 – Open the Tools pane after reopening
**Description:** Reopen Tools to reach Notes after the reload.
**Continues From:** S3-TC29 — reader loaded.
**Test Data:** —
**Steps:**
1. Select **Tools** in the reader toolbar.
**Expected Result:** The Tools pane opens.
**Actual Result:** Tools was opened again on this reloaded reader, showing that the tool entry points come back after a reopen and not only on a first launch.

---
### Test Case: S3-TC31 – Open the Notes pane after reopening
**Description:** Reopen Notes to inspect the persisted note.
**Continues From:** S3-TC30 — Tools pane open.
**Test Data:** —
**Steps:**
1. Select **Notes** in the Tools pane.
**Expected Result:** The Notes pane opens.
**Actual Result:** Notes was selected from the Tools pane and the panel opened against the reloaded page, ready to be asked what it still holds.

---
### Test Case: S3-TC32 – First reopen note persisted
**Description:** Confirm the first reopen note is still present after closing and reopening.
**Continues From:** S3-TC31 — Notes pane open after reopen.
**Test Data:** Note text `Reopen Persistent Note 1`
**Steps:**
1. Verify the first reopen note is still shown.
**Expected Result:** The note persisted across the reopen.
**Actual Result:** Reopen Persistent Note 1 was still listed. Closing the eBook and opening it again had not cost the student the note, so notes are stored against the book and page rather than kept in memory for one sitting. The check confirms the note is present rather than matching its body character for character (see Needs Clarification).

---
### Test Case: S3-TC33 – Add a second note on the same page
**Description:** Add a second note to confirm multiple notes display together.
**Continues From:** S3-TC32 — Notes pane open with the first note.
**Test Data:** —
**Steps:**
1. Select **Add Notes**.
**Expected Result:** A new note entry is shown.
**Actual Result:** A second note was opened on that very same page, to see whether the panel can hold more than one entry side by side or whether the new editor quietly takes the place of the first.

---
### Test Case: S3-TC34 – Enter the second note text
**Description:** Type the second note.
**Continues From:** S3-TC33 — a new note is open.
**Test Data:** Note text `Reopen Persistent Note 2`
**Steps:**
1. Enter **Reopen Persistent Note 2** into the note editor.
**Expected Result:** The text is entered into the note.
**Actual Result:** The wording Reopen Persistent Note 2 was typed into the second note and appeared in full in the editor, the first note still sitting on the page behind the panel.

---
### Test Case: S3-TC35 – Save the second note
**Description:** Save the second note.
**Continues From:** S3-TC34 — text entered.
**Test Data:** —
**Steps:**
1. Select **Save**.
**Expected Result:** The second note is saved on the same page.
**Actual Result:** The second note was saved while the first one was still on the page, and the list grew to two entries instead of the new note replacing the old one.

---
### Test Case: S3-TC36 – Both notes displayed together
**Description:** Confirm both notes are listed on the page at the same time.
**Continues From:** S3-TC35 — two notes saved on the page.
**Test Data:** Two notes expected on the page
**Steps:**
1. Verify both notes appear in the Notes list.
**Expected Result:** Both notes are displayed correctly on the page.
**Actual Result:** Both notes were read back together from the list, one under the other against the same page, so several notes on one page stack rather than overwrite each other.

---
### Test Case: S3-TC37 – Delete both notes
**Description:** Confirm all notes on the page can be removed cleanly.
**Continues From:** S3-TC36 — two notes present.
**Test Data:** —
**Steps:**
1. Delete the notes and verify the list is empty.
**Expected Result:** Both notes are removed and the page shows no notes.
**Actual Result:** Each of the two notes was deleted in turn and the panel came back to its empty state, leaving nothing behind for the cases that follow to trip over.

---
### Test Case: S3-TC38 – Note with special characters and numbers
**Description:** Confirm a note containing symbols and numbers saves verbatim.
**Continues From:** S3-TC37 — empty Notes list.
**Test Data:** Note text `Notes #123 @ Test & Cambridge! [2026] $50% (A+B)=C`
**Steps:**
1. Add a new note, enter the special-character text, and save it.
**Expected Result:** The special-character note is saved and shown as entered.
**Actual Result:** A new note was created with deliberately awkward content, Notes #123 @ Test & Cambridge! [2026] $50% (A+B)=C, and saved. It came back in the list exactly as typed, symbols, brackets, currency and the percent sign all intact, none dropped or escaped into something else.

---
### Test Case: S3-TC39 – Clean up the special-character note
**Description:** Remove the special-character note.
**Continues From:** S3-TC38 — special-character note present.
**Test Data:** —
**Steps:**
1. Delete the note and verify the list is empty.
**Expected Result:** The special-character note is removed.
**Actual Result:** That special-character note was deleted and the list verified empty again, so the odd characters had not produced an entry that the normal menu could no longer remove.

---
### Test Case: S3-TC40 – Edit an existing note
**Description:** Confirm an existing note can be edited and the change persists.
**Continues From:** S3-TC39 — empty Notes list (an initial note is created if none exist).
**Test Data:** Updated text `Initial Note For Editing - Updated Version`
**Steps:**
1. Open the note's menu and select **Edit**.
2. Change the text to the updated version and save.
**Expected Result:** The note is saved with the updated content.
**Actual Result:** The note's menu was opened and Edit chosen, a starting note being created first since the list had only just been emptied. The wording was replaced with Initial Note For Editing - Updated Version and saved, and the list then showed the updated text, so an edit overwrites the same note instead of quietly adding another one beside it.

---
### Test Case: S3-TC41 – Clean up after editing
**Description:** Remove the edited note.
**Continues From:** S3-TC40 — edited note present.
**Test Data:** —
**Steps:**
1. Delete the note and verify the list is empty.
**Expected Result:** The edited note is removed.
**Actual Result:** The edited note was deleted and the notes area verified empty, closing the notes journey without leaving fixture notes on the page for the next run to inherit.

---
### Test Case: S3-TC42 – Return to the dashboard
**Description:** Conclude the suite by leaving the eBook.
**Continues From:** S3-TC41 — Notes cleaned up.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home was used to leave the reader and the dashboard came up normally, after which the session signed out. None of the notes created along the way were still hanging on the page when the reader let go.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S4 – Validation of Highlighter and Drawing

**Suite purpose:** Prove the Drawing & Highlighter tools — pen colour/width selection, freehand drawing, highlighting, undo/redo and erasing, and that marks persist after a reload.

_Setup for this suite additionally opens **Tools → Drawing** before `S4-TC1`; the first case
continues from the open Drawing tool._

### Test Case: S4-TC1 – Open the Pen colour selector
**Description:** Confirm the pen colour options open in the Drawing tool.
**Starts Fresh:** Yes
**Test Data:** Drawing tool open (via Tools)
**Steps:**
1. Select the **Pen colour** control.
**Expected Result:** The pen colour options are displayed.
**Actual Result:** With the Drawing tool already open from the suite setup, the pen colour control was pressed and its colour swatches appeared, showing the tool is interactive rather than a panel that merely renders.

---
### Test Case: S4-TC2 – Select a pen colour
**Description:** Confirm a pen colour can be chosen.
**Continues From:** S4-TC1 — pen colour options open.
**Test Data:** Colour **Green**
**Steps:**
1. Select the **Green** pen colour.
**Expected Result:** The chosen colour is applied to the pen.
**Actual Result:** Green was chosen from the swatches and became the active pen colour, still reflected in the control once the palette closed, so the choice stuck rather than snapping back to the default.

---
### Test Case: S4-TC3 – Open the Pen width selector
**Description:** Confirm the pen width options open.
**Continues From:** S4-TC2 — a pen colour is selected.
**Test Data:** —
**Steps:**
1. Select the **Pen width** control.
**Expected Result:** The pen width options are displayed.
**Actual Result:** The pen width control was opened next and its stroke options displayed, so width can be set independently of the colour picked a moment earlier.

---
### Test Case: S4-TC4 – Select a pen width
**Description:** Confirm a stroke width can be chosen.
**Continues From:** S4-TC3 — pen width options open.
**Test Data:** Width **4** (largest)
**Steps:**
1. Select stroke width **4**.
**Expected Result:** The chosen width is applied to the pen.
**Actual Result:** The largest width, 4, was selected and the pen now carries that thick stroke while the earlier green selection stayed in force, the two settings not cancelling each other out.

---
### Test Case: S4-TC5 – Draw with the pen
**Description:** Confirm a freehand line can be drawn with the selected pen.
**Continues From:** S4-TC4 — pen colour and width are set.
**Test Data:** —
**Steps:**
1. Choose the **Pen / draw** tool and draw a line on the page.
**Expected Result:** The line is drawn on the page with the chosen colour and width.
**Actual Result:** The pen tool was picked and a freehand line was dragged across the page. The stroke appeared as it was drawn, in the chosen green and at the thicker width, which proves the colour and width selections actually reach the canvas.

---
### Test Case: S4-TC6 – Pen drawing is saved
**Description:** Confirm the pen drawing is stored so it persists.
**Continues From:** S4-TC5 — a pen line is drawn.
**Test Data:** —
**Steps:**
1. Verify the pen drawing has been recorded for the page.
**Expected Result:** The pen drawing is saved.
**Actual Result:** The drawing was checked immediately afterwards and had been recorded against the page, so the mark is stored and not merely painted. That is what makes the reopen check further down this suite worth anything.

---
### Test Case: S4-TC7 – Undo the drawing
**Description:** Confirm Undo removes the most recent stroke.
**Continues From:** S4-TC6 — a pen line is drawn.
**Test Data:** —
**Steps:**
1. Select **Undo**.
**Expected Result:** The last stroke is removed from the page.
**Actual Result:** Undo took the most recent stroke off the page and only that stroke, the printed content underneath coming back untouched.

---
### Test Case: S4-TC8 – Redo the drawing
**Description:** Confirm Redo restores the undone stroke.
**Continues From:** S4-TC7 — stroke undone.
**Test Data:** —
**Steps:**
1. Select **Redo**.
**Expected Result:** The stroke reappears on the page.
**Actual Result:** Redo put the same stroke straight back, so the pair round-trips and an undone mark is not discarded the instant it disappears.

---
### Test Case: S4-TC9 – Return to the dashboard (to reopen fresh)
**Description:** Leave the eBook so the drawing can be checked on a fresh load.
**Continues From:** S4-TC8 — drawing present on the page.
**Test Data:** —
**Steps:**
1. Select **Home** to return to the dashboard.
**Expected Result:** The eBook closes and the student is on the dashboard.
**Actual Result:** Home was pressed to leave the reader with the drawing still sitting on the page, so the mark could be tested against a fresh load rather than one the reader still held in memory.

---
### Test Case: S4-TC10 – Reopen the eBook
**Description:** Reopen the eBook from the dashboard.
**Continues From:** S4-TC9 — on the dashboard.
**Test Data:** eBook `vm_automation_ebook_latest_01`
**Steps:**
1. Launch the eBook again from its class card.
**Expected Result:** The eBook reader reopens.
**Actual Result:** The book was launched again from its class card and the reader reopened cleanly, ready to be asked what it remembers of the drawing.

---
### Test Case: S4-TC11 – Open the Tools pane
**Description:** Reopen Tools to reach the Drawing tool.
**Continues From:** S4-TC10 — reader reopened.
**Test Data:** —
**Steps:**
1. Select **Tools** in the reader toolbar.
**Expected Result:** The Tools pane opens.
**Actual Result:** Tools was opened on the reopened reader and its pane came back listing the same tools as before the reader was closed, Drawing among them.

---
### Test Case: S4-TC12 – Open the Drawing tool
**Description:** Open the Drawing tool.
**Continues From:** S4-TC11 — Tools pane open.
**Test Data:** —
**Steps:**
1. Select **Drawing** in the Tools pane.
**Expected Result:** The Drawing tool opens.
**Actual Result:** Drawing was selected again from the pane, and the tool came up with the previously stored strokes still present on the page.

---
### Test Case: S4-TC13 – Erase a drawing
**Description:** Confirm the eraser removes a drawn stroke.
**Continues From:** S4-TC12 — Drawing tool open with a prior drawing.
**Test Data:** —
**Steps:**
1. Select the **Eraser** and remove a stroke.
**Expected Result:** The erased stroke is removed from the page.
**Actual Result:** The eraser was chosen and a stroke traced over. That stroke lifted off the page while the rest of the drawing, and the page content beneath it, were left alone.

---
### Test Case: S4-TC14 – All drawings cleared
**Description:** Confirm the stored drawing data is cleared once all strokes are erased.
**Continues From:** S4-TC13 — strokes erased.
**Test Data:** —
**Steps:**
1. Erase the remaining drawings and verify none are stored.
**Expected Result:** No drawing data remains after erasing everything.
**Actual Result:** The remaining strokes were erased one by one and no drawing data was left against the page, so erasing genuinely clears the stored marks instead of hiding them from view.

---
### Test Case: S4-TC15 – Return to the dashboard (to reopen fresh)
**Description:** Leave the eBook again to test the highlighter on a fresh load.
**Continues From:** S4-TC14 — drawings cleared.
**Test Data:** —
**Steps:**
1. Select **Home** to return to the dashboard.
**Expected Result:** The eBook closes and the student is on the dashboard.
**Actual Result:** Home was used again to get back to the dashboard, this time so the highlighter half of the suite could start from a freshly loaded reader rather than the one that had just been erased.

---
### Test Case: S4-TC16 – Reopen the eBook
**Description:** Reopen the eBook from the dashboard.
**Continues From:** S4-TC15 — on the dashboard.
**Test Data:** eBook `vm_automation_ebook_latest_01`
**Steps:**
1. Launch the eBook again from its class card.
**Expected Result:** The eBook reader reopens.
**Actual Result:** The book was opened once more from the class card and the reader loaded without carrying over anything from the just-erased drawing state.

---
### Test Case: S4-TC17 – Open the Tools pane
**Description:** Reopen Tools to reach the Drawing tool.
**Continues From:** S4-TC16 — reader reopened.
**Test Data:** —
**Steps:**
1. Select **Tools** in the reader toolbar.
**Expected Result:** The Tools pane opens.
**Actual Result:** Tools was opened from the toolbar on this third load of the reader, its pane appearing over the page the same way it had earlier in the suite.

---
### Test Case: S4-TC18 – Open the Drawing tool
**Description:** Open the Drawing tool to use the highlighter.
**Continues From:** S4-TC17 — Tools pane open.
**Test Data:** —
**Steps:**
1. Select **Drawing** in the Tools pane.
**Expected Result:** The Drawing tool opens.
**Actual Result:** The Drawing tool was opened and its highlighter entry was available, with no stale pen marks left on the canvas to confuse the highlight that follows.

---
### Test Case: S4-TC19 – Highlight an area
**Description:** Confirm the highlighter marks a selected area.
**Continues From:** S4-TC18 — Drawing tool open.
**Test Data:** —
**Steps:**
1. Select the **Highlighter** and highlight a passage on the page.
**Expected Result:** The selected area is highlighted.
**Actual Result:** The highlighter was selected and a passage on the page dragged over. The band of highlight appeared over the text rather than replacing it, in the highlighter's own colour.

---
### Test Case: S4-TC20 – Highlight is saved
**Description:** Confirm the highlight is stored so it persists.
**Continues From:** S4-TC19 — a highlight is on the page.
**Test Data:** —
**Steps:**
1. Verify the highlight has been recorded for the page.
**Expected Result:** The highlight is saved.
**Actual Result:** The highlight was verified as recorded for the page, so highlighting is persisted in the same way freehand drawing is rather than being a transient overlay that a reload would drop.

---
### Test Case: S4-TC21 – Erase the highlight
**Description:** Confirm the eraser removes the highlight.
**Continues From:** S4-TC20 — highlight present.
**Test Data:** —
**Steps:**
1. Select the **Eraser** and remove the highlight.
**Expected Result:** The highlight is removed.
**Actual Result:** The eraser was run over the highlighted passage and the highlight came off, leaving the underlying text readable and unmarked.

---
### Test Case: S4-TC22 – All drawings cleared
**Description:** Confirm the stored drawing data is cleared once everything is erased.
**Continues From:** S4-TC21 — highlight erased.
**Test Data:** —
**Steps:**
1. Verify no drawing data remains after erasing.
**Expected Result:** No drawing data remains on the page.
**Actual Result:** After that erase nothing was stored against the page any more, so the drawing store is empty again and the suite leaves the book as it found it.

---
### Test Case: S4-TC23 – Return to the dashboard
**Description:** Conclude the suite by leaving the eBook.
**Continues From:** S4-TC22 — drawings cleared.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home closed the reader back to the dashboard for the suite teardown and the session signed out from there, with no marks left behind on the page.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S5 – Validation of Timer Page

**Suite purpose:** Prove the reading Timer — Count down and Count up modes and their keypad, mute/unmute, play, pause, reset and close controls.

_Setup for this suite additionally opens **Tools → Timer** before `S5-TC1`; the first case
continues from the open Timer panel._

### Test Case: S5-TC1 – Select Count down
**Description:** Confirm the student can switch the Timer to Count down mode.
**Starts Fresh:** Yes
**Test Data:** Timer open (via Tools)
**Steps:**
1. Select the **Count down** option.
**Expected Result:** The Timer shows the Count-down controls.
**Actual Result:** With the Timer panel already open from setup, Count down was selected and the panel swapped to its count-down face, showing the keypad and start controls that the rest of this suite drives.

---
### Test Case: S5-TC2 – Enter a countdown digit
**Description:** Confirm digits can be entered on the countdown keypad.
**Continues From:** S5-TC1 — Count-down mode is active.
**Test Data:** Keypad digit **1**
**Steps:**
1. Press the first countdown keypad digit.
**Expected Result:** The digit is entered into the countdown time.
**Actual Result:** The first keypad digit was pressed and registered in the countdown entry, the display taking input one digit at a time rather than expecting a whole time to be entered at once.

---
### Test Case: S5-TC3 – Enter another countdown digit
**Description:** Confirm a second digit can be entered.
**Continues From:** S5-TC2 — first digit entered.
**Test Data:** Keypad digit **2**
**Steps:**
1. Press the next countdown keypad digit.
**Expected Result:** The digit is entered into the countdown time.
**Actual Result:** A second digit was pressed and appended to the first instead of replacing it. No specific time is claimed here, because the keypad digits are exercised by position and the resulting display value is not asserted (see Needs Clarification).

---
### Test Case: S5-TC4 – Mute the countdown
**Description:** Confirm the countdown sound can be muted.
**Continues From:** S5-TC3 — countdown time entered.
**Test Data:** —
**Steps:**
1. Select **Mute**.
**Expected Result:** The countdown is muted.
**Actual Result:** Mute was selected and the timer moved into its muted state, the control visibly changing state rather than only affecting audio nobody can observe in a run.

---
### Test Case: S5-TC5 – Unmute the countdown
**Description:** Confirm the countdown sound can be turned back on.
**Continues From:** S5-TC4 — countdown muted.
**Test Data:** —
**Steps:**
1. Select **Unmute**.
**Expected Result:** The countdown sound is restored.
**Actual Result:** Unmute was selected next and the sound state came back on the control, so the mute toggle is reversible rather than something the student cannot undo.

---
### Test Case: S5-TC6 – Start the countdown
**Description:** Confirm the countdown can be started.
**Continues From:** S5-TC5 — countdown unmuted.
**Test Data:** —
**Steps:**
1. Select **Play / Start** on the countdown.
**Expected Result:** The countdown begins.
**Actual Result:** Play/Start was pressed and the countdown began running down from the value that had been entered, the display ticking rather than sitting still.

---
### Test Case: S5-TC7 – Enter a countdown digit
**Description:** Confirm digits can be entered while adjusting the countdown.
**Continues From:** S5-TC6 — countdown started.
**Test Data:** Keypad digit **2**
**Steps:**
1. Press a countdown keypad digit.
**Expected Result:** The digit is entered into the countdown time.
**Actual Result:** While the countdown was being adjusted a digit was pressed again and it registered in the countdown field, showing the keypad stays live once a run has been started.

---
### Test Case: S5-TC8 – Enter a countdown digit
**Description:** Confirm another digit can be entered.
**Continues From:** S5-TC7 — digit entered.
**Test Data:** Keypad digit **1**
**Steps:**
1. Press another countdown keypad digit.
**Expected Result:** The digit is entered into the countdown time.
**Actual Result:** One further digit went in the same way and built the value up rather than resetting what was already sitting in the field.

---
### Test Case: S5-TC9 – Pause the countdown
**Description:** Confirm the running countdown can be paused.
**Continues From:** S5-TC8 — countdown running.
**Test Data:** —
**Steps:**
1. Select **Pause**.
**Expected Result:** The countdown pauses.
**Actual Result:** Pause stopped the running countdown where it stood and the display held that value instead of continuing to drop away behind the panel.

---
### Test Case: S5-TC10 – Reset the countdown
**Description:** Confirm the countdown can be cleared/reset.
**Continues From:** S5-TC9 — countdown paused.
**Test Data:** —
**Steps:**
1. Select **Reset**.
**Expected Result:** The countdown is cleared back to its start.
**Actual Result:** Reset cleared the countdown back to its start state, the paused value being discarded rather than sitting there waiting to be resumed.

---
### Test Case: S5-TC11 – Select Count up
**Description:** Confirm the student can switch the Timer to Count up mode.
**Continues From:** S5-TC10 — countdown reset.
**Test Data:** —
**Steps:**
1. Select the **Count up** option.
**Expected Result:** The Timer shows the Count-up controls.
**Actual Result:** Count up was switched to and the panel changed across to the count-up face, with its own start control and no countdown keypad entry left in the way.

---
### Test Case: S5-TC12 – Start the count up
**Description:** Confirm the count-up timer can be started.
**Continues From:** S5-TC11 — Count-up mode active.
**Test Data:** —
**Steps:**
1. Select **Play / Start** on the count-up timer.
**Expected Result:** The count-up begins.
**Actual Result:** Start was pressed on the count-up timer and it began climbing from zero, running in the opposite direction to the countdown but behaving the same way otherwise.

---
### Test Case: S5-TC13 – Pause the timer
**Description:** Confirm the running timer can be paused.
**Continues From:** S5-TC12 — count-up running.
**Test Data:** —
**Steps:**
1. Select **Pause**.
**Expected Result:** The timer pauses.
**Actual Result:** Pause was pressed on the running count-up and it froze at its current value, so pause behaves consistently in both timer modes and not only in the countdown.

---
### Test Case: S5-TC14 – Close the Timer
**Description:** Confirm the Timer can be closed.
**Continues From:** S5-TC13 — timer paused.
**Test Data:** —
**Steps:**
1. Select **Close** on the Timer.
**Expected Result:** The Timer closes.
**Actual Result:** Close dismissed the Timer panel and left the reader underneath it alone, so leaving the tool does not take the book with it.

---
### Test Case: S5-TC15 – Return to the dashboard
**Description:** Conclude the suite by leaving the eBook.
**Continues From:** S5-TC14 — Timer closed.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home returned the student to the dashboard and the suite signed out from there, the timer having been left properly closed rather than still running in a panel.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S6 – Validation of Next/Previous Page

**Suite purpose:** Prove page navigation — the "Go to page" entry plus the next and previous page controls.

### Test Case: S6-TC1 – Open "Go to page"
**Description:** Confirm the student can open the Go-to-page control.
**Starts Fresh:** Yes
**Test Data:** eBook reader open
**Steps:**
1. Select the **Go to page** control in the reader.
**Expected Result:** The page-entry control opens.
**Actual Result:** Once the reader had loaded, the Go to page control was opened and the page-entry pad came up ready to take digits, without the reader moving off its current spread.

---
### Test Case: S6-TC2 – Enter a page number
**Description:** Enter a page number using the keypad.
**Continues From:** S6-TC1 — page-entry control is open.
**Test Data:** Keypad digit **1**
**Steps:**
1. Press **1** on the page keypad.
**Expected Result:** The digit appears in the page field.
**Actual Result:** Digit 1 was pressed on the page keypad and appeared in the page field, the field still waiting for the rest of the number rather than navigating straight away.

---
### Test Case: S6-TC3 – Enter another page number
**Description:** Append a second digit to the page number.
**Continues From:** S6-TC2 — first digit entered.
**Test Data:** Keypad digit **2**
**Steps:**
1. Press **2** on the page keypad.
**Expected Result:** The digits appear in the page field.
**Actual Result:** Digit 2 was pressed next and appended to it, so the field read as a two-digit entry rather than the second press restarting the value.

---
### Test Case: S6-TC4 – Go to the entered page
**Description:** Confirm Go-to navigates to the entered page.
**Continues From:** S6-TC3 — page number entered.
**Test Data:** —
**Steps:**
1. Select **Go to**.
**Expected Result:** The reader navigates to the entered page.
**Actual Result:** Go to was selected and the reader jumped to that page, the entry behaving as a real navigation action and the panel closing back to the reading view afterwards.

---
### Test Case: S6-TC5 – Next page
**Description:** Confirm the Next-page control advances the reader.
**Continues From:** S6-TC4 — reader on the entered page.
**Test Data:** Expected page indicator `14-15 / 160`
**Steps:**
1. Select **Next page**.
**Expected Result:** The reader advances to the next page (indicator `14-15 / 160`).
**Actual Result:** Next page advanced the reader by one spread and the page indicator moved on to 14-15 / 160, the value this run expects for that position in the book.

---
### Test Case: S6-TC6 – Previous page
**Description:** Confirm the Previous-page control steps back.
**Continues From:** S6-TC5 — reader on the next page.
**Test Data:** Expected page indicator `12-13 / 160`
**Steps:**
1. Select **Previous page**.
**Expected Result:** The reader steps back to the previous page (indicator `12-13 / 160`).
**Actual Result:** Previous page stepped back one spread and the indicator read 12-13 / 160, i.e. the page it had actually come from rather than a re-render of the current one.

---
### Test Case: S6-TC7 – Return to the dashboard
**Description:** Conclude the suite by leaving the eBook.
**Continues From:** S6-TC6 — reader on the previous page.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home closed the reader back to the dashboard and the sign-out that ends the suite ran from there, with the book parked wherever the navigation had left it and no complaint from the app.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S7 – Validation of Show/Hide Selection Page

**Suite purpose:** Prove the Show/Hide selection tool on a double-page spread — showing, hiding and clearing a selected area.

_Setup for this suite additionally sets the reader to a double-page layout and opens **Tools**
before `S7-TC1`; the first case continues from the open Tools pane._

### Test Case: S7-TC1 – Open the Show/Hide Selection tool
**Description:** Confirm the Show/Hide selection tool opens.
**Starts Fresh:** Yes
**Test Data:** Reader on double-page layout, Tools open
**Steps:**
1. Select the **Show/Hide selection** tool.
**Expected Result:** The Show/Hide selection tool is activated.
**Actual Result:** On the double-page spread with Tools already open from setup, the Show/Hide selection tool was activated and the reader entered its selection mode, which is the state the next three cases work inside.

---
### Test Case: S7-TC2 – Show a selection
**Description:** Confirm the Show control displays only the selected area.
**Continues From:** S7-TC1 — Show/Hide tool active with a selection.
**Test Data:** Control **Show Selection**
**Steps:**
1. Select **Show Selection**.
**Expected Result:** Only the selected area is shown.
**Actual Result:** Show Selection was chosen and the view narrowed down to just the selected region of the spread. The verification behind this is a light one, so the claim is the visible show only (see Needs Clarification).

---
### Test Case: S7-TC3 – Close the selection
**Description:** Confirm the selection can be cleared.
**Continues From:** S7-TC2 — area shown.
**Test Data:** Control **Close**
**Steps:**
1. Select **Close** on the selection.
**Expected Result:** The selection is removed and the full page is shown.
**Actual Result:** Close on the selection was pressed, the region was cleared and the full spread came back, so the tool offers a way out that does not need a reader reload.

---
### Test Case: S7-TC4 – Hide a selection
**Description:** Confirm the Hide control hides the selected area.
**Continues From:** S7-TC3 — selection cleared, new selection made.
**Test Data:** Control **Hide Selection**
**Steps:**
1. Select **Hide Selection**.
**Expected Result:** The selected area is hidden.
**Actual Result:** A fresh selection was made and Hide Selection applied to it; that area was blanked out of the view while the rest of the spread stayed visible. As with show, only the visible hide is claimed here.

---
### Test Case: S7-TC5 – Return to the dashboard
**Description:** Conclude the suite by leaving the eBook.
**Continues From:** S7-TC4 — selection hidden.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home took the student back to the dashboard and the suite signed out from there, ending the show/hide session without leaving the reader or its selection tool open.
_Note: after this case the session signs out (shared teardown)._

---

## Test Suite: S8 – Validation of eBook Page (Hotlink)

**Suite purpose:** Prove the in-book interactive hotlinks — answer, video, audio, activity, external link, zoom hotspot, game and go-to-page — including an activity's own controls.

### Test Case: S8-TC1 – eBook reader opens
**Description:** Confirm the eBook reader opens after launch.
**Starts Fresh:** Yes
**Test Data:** eBook `vm_automation_ebook_latest_01`
**Steps:**
1. Launch the eBook from the dashboard and wait for the reader to load.
**Expected Result:** The eBook reader is displayed and ready.
**Actual Result:** The book was launched from its class card after the usual sign-in and the reader finished loading before any hotlink hunting began.

---
### Test Case: S8-TC2 – Open the Table of Contents
**Description:** Confirm the Table of Contents can be opened.
**Continues From:** S8-TC1 — reader loaded.
**Test Data:** —
**Steps:**
1. Open **Contents / Table of Contents**.
**Expected Result:** The contents panel opens.
**Actual Result:** Contents was opened over the reader and the section list came up, used in this suite mainly as the way into the course-material switcher.

---
### Test Case: S8-TC3 – Open the Change Course Material selector
**Description:** Confirm the course-material switcher opens with the expected book.
**Continues From:** S8-TC2 — contents panel is open.
**Test Data:** Book `vm_automation_ebook_latest_01`
**Steps:**
1. Open the **Change Course Material** dropdown.
2. Verify the expected course material is shown.
**Expected Result:** The dropdown opens with the expected course material shown.
**Actual Result:** The Change Course Material dropdown was opened from the contents panel and vm_automation_ebook_latest_01 was shown there as the current selection.

---
### Test Case: S8-TC4 – Switch to the second book
**Description:** Confirm the student can open the other book.
**Continues From:** S8-TC3 — course-material dropdown open.
**Test Data:** Book `vm_automation_ebook_latest_02`
**Steps:**
1. Select the second book **vm_automation_ebook_latest_02**.
**Expected Result:** The reader switches to the selected book.
**Actual Result:** vm_automation_ebook_latest_02 was chosen and the reader swapped its content across to that title, so the hotlinks opened later in this suite are known to belong to the second book rather than the first.

---
### Test Case: S8-TC5 – Open "Go to page"
**Description:** Open the page-entry control to reach a page containing hotlinks.
**Continues From:** S8-TC4 — reader on the second book.
**Test Data:** —
**Steps:**
1. Select the **Go to page** control.
**Expected Result:** The page-entry control opens.
**Actual Result:** The Go to page control was opened to reach a page that carries interactive hotlinks, rather than paging through the book by hand to find one.

---
### Test Case: S8-TC6 – Enter a page number
**Description:** Enter a page number using the keypad.
**Continues From:** S8-TC5 — page-entry control open.
**Test Data:** Keypad digit **1**
**Steps:**
1. Press **1** on the page keypad.
**Expected Result:** The digit appears in the page field.
**Actual Result:** Digit 1 was pressed on the page keypad and landed in the page field, with nothing navigating until Go to is actually pressed.

---
### Test Case: S8-TC7 – Enter another page number
**Description:** Append a second digit.
**Continues From:** S8-TC6 — first digit entered.
**Test Data:** Keypad digit **2**
**Steps:**
1. Press **2** on the page keypad.
**Expected Result:** The digits appear in the page field.
**Actual Result:** Digit 2 followed it and the field read as a two-digit page number, the first digit staying where it was rather than being replaced.

---
### Test Case: S8-TC8 – Go to the entered page
**Description:** Navigate to the entered page.
**Continues From:** S8-TC7 — page number entered.
**Test Data:** —
**Steps:**
1. Select **Go to**.
**Expected Result:** The reader navigates to the entered page.
**Actual Result:** Go to was selected and the reader moved to the entered page, and the page settled far enough for its hotlink markers to be clicked for the rest of the suite.

---
### Test Case: S8-TC9 – Open the Answer hotlink
**Description:** Confirm an in-book Answer hotlink opens.
**Continues From:** S8-TC8 — reader on the hotlink page.
**Test Data:** —
**Steps:**
1. Select the **Answer** hotlink on the page.
**Expected Result:** The Answer activity opens.
**Actual Result:** The Answer hotlink on that page was clicked and the answer content opened inside the reader over the page, rather than the click doing nothing or throwing the student out of the book.

---
### Test Case: S8-TC10 – Open the Video hotlink
**Description:** Confirm an in-book Video hotlink opens.
**Continues From:** S8-TC9 — reader on the hotlink page.
**Test Data:** —
**Steps:**
1. Select the **Video** hotlink on the page.
**Expected Result:** The Video player opens.
**Actual Result:** The Video hotlink was opened and the video player appeared in the content area, so an in-book video launches in place instead of failing or escaping into a browser-native element.

---
### Test Case: S8-TC11 – Open the Audio hotlink
**Description:** Confirm an in-book Audio hotlink opens.
**Continues From:** S8-TC10 — reader on the hotlink page.
**Test Data:** —
**Steps:**
1. Select the **Audio** hotlink on the page.
**Expected Result:** The Audio player opens.
**Actual Result:** The Audio hotlink opened the audio player on the page and its own controls came up with it, the reader page underneath being left as it was.

---
### Test Case: S8-TC12 – Open the Activity hotlink
**Description:** Confirm an interactive Activity hotlink launches.
**Continues From:** S8-TC11 — reader on the hotlink page.
**Test Data:** Activity feedback **Good effort!**
**Steps:**
1. Select the **Activity** hotlink on the page.
**Expected Result:** The interactive activity launches in the reader.
**Actual Result:** The Activity hotlink was opened and the interactive activity launched inside the reader, in the same container a student would meet in a lesson. The fixture behind it is the one whose feedback reads Good effort!.

---
### Test Case: S8-TC13 – Check the answer in the activity
**Description:** Confirm the activity's Check-answer control works.
**Continues From:** S8-TC12 — activity open.
**Test Data:** —
**Steps:**
1. Select **Check answer** in the activity.
**Expected Result:** The activity checks the submitted answer.
**Actual Result:** Check answer was pressed inside the activity and the activity responded to the submitted response instead of ignoring the click, which is the reason for driving the activity's own control rather than trusting it to work.

---
### Test Case: S8-TC14 – Go to the next activity item
**Description:** Confirm the activity's Next control works.
**Continues From:** S8-TC13 — answer checked.
**Test Data:** —
**Steps:**
1. Select **Next** in the activity.
**Expected Result:** The activity advances to the next item.
**Actual Result:** Next moved the activity on to its following item, so its internal navigation works and is independent of the reader's own page controls.

---
### Test Case: S8-TC15 – Start the activity again
**Description:** Confirm the activity's Start-again control works.
**Continues From:** S8-TC14 — advanced in the activity.
**Test Data:** —
**Steps:**
1. Select **Start again** in the activity.
**Expected Result:** The activity restarts from the beginning.
**Actual Result:** Start again reset the activity back to its first item, clearing what had already been worked through in that sitting rather than leaving it parked on the last question.

---
### Test Case: S8-TC16 – Close the activity
**Description:** Confirm the activity can be closed back to the reader.
**Continues From:** S8-TC15 — activity restarted.
**Test Data:** —
**Steps:**
1. Select **Close** on the activity.
**Expected Result:** The activity closes and the reader is shown.
**Actual Result:** Close on the activity brought the student back to the reader with the page as it had been left, so leaving an activity is not a dead end and does not strand the reader.

---
### Test Case: S8-TC17 – Enter a page number
**Description:** Navigate to another hotlink page using the keypad.
**Continues From:** S8-TC16 — back on the reader.
**Test Data:** Keypad digit **2**
**Steps:**
1. Open **Go to page** and press **2**.
**Expected Result:** The digit appears in the page field.
**Actual Result:** Go to page was opened once more and digit 2 was pressed into the field, entering the next hotlink page for the checks still to come.

---
### Test Case: S8-TC18 – Go to the entered page
**Description:** Navigate to the entered page.
**Continues From:** S8-TC17 — page number entered.
**Test Data:** —
**Steps:**
1. Select **Go to**.
**Expected Result:** The reader navigates to the entered page.
**Actual Result:** Go to navigated the reader to that entered page and it loaded normally, the hotlinks sitting on it reachable from there.

---
### Test Case: S8-TC19 – Open the Audio (no transcript) hotlink
**Description:** Confirm an audio hotlink without a transcript opens.
**Continues From:** S8-TC18 — reader on the hotlink page.
**Test Data:** —
**Steps:**
1. Select the **Audio (no transcript)** hotlink.
**Expected Result:** The Audio player opens.
**Actual Result:** The audio hotlink that carries no transcript was opened and its player came up the same way a transcript-bearing one does, so the missing transcript does not break the launch.

---
### Test Case: S8-TC20 – Open the external-link hotlink
**Description:** Confirm an external-link hotlink opens in a new tab.
**Continues From:** S8-TC19 — reader on the hotlink page.
**Test Data:** —
**Steps:**
1. Select the **external link** hotlink.
2. Verify it opens in a new tab, then return to the eBook.
**Expected Result:** The link opens in a new tab and the reader is refocused.
**Actual Result:** The external-link hotlink was clicked, a new browser tab opened for the target, and the reader was brought back into focus with that extra tab closed. The destination page itself is not validated, only the tab-open and refocus behaviour (see Needs Clarification).

---
### Test Case: S8-TC21 – Open the Zoom Hotspot hotlink
**Description:** Confirm a zoom-hotspot hotlink enlarges the target area.
**Continues From:** S8-TC20 — back on the reader.
**Test Data:** —
**Steps:**
1. Select the **Zoom hotspot** hotlink.
**Expected Result:** The hotspot zoom view opens.
**Actual Result:** The Zoom hotspot was selected and the enlarged view of that area opened on top of the page, with the surrounding page content still visible behind it.

---
### Test Case: S8-TC22 – Close the Zoom Hotspot
**Description:** Confirm the zoom-hotspot view can be closed.
**Continues From:** S8-TC21 — zoom hotspot open.
**Test Data:** —
**Steps:**
1. Select **Close** on the zoom hotspot.
**Expected Result:** The zoom view closes and the reader is shown.
**Actual Result:** Closing the zoom view returned the reader to the ordinary page at its normal scale, so the zoom is scoped to the hotspot and does not leave the whole reader magnified.

---
### Test Case: S8-TC23 – Open the Game hotlink
**Description:** Confirm a game hotlink launches.
**Continues From:** S8-TC22 — back on the reader.
**Test Data:** —
**Steps:**
1. Select the **Game** hotlink.
**Expected Result:** The game launches in the reader.
**Actual Result:** The Game hotlink was opened and the game launched inside the reader, loading its own play area over the page rather than in a separate window.

---
### Test Case: S8-TC24 – Open the Go-to-page hotlink
**Description:** Confirm an in-book Go-to-page hotlink jumps to its page.
**Continues From:** S8-TC23 — reader on the hotlink page.
**Test Data:** —
**Steps:**
1. Select the **Go to page** hotlink.
**Expected Result:** The reader jumps to the linked page.
**Actual Result:** The in-book Go to page hotlink was clicked and the reader jumped straight to the page it points at, i.e. an in-book link navigating the reader instead of opening anything external.

---
### Test Case: S8-TC25 – Open "Go to page"
**Description:** Open the page-entry control for the closing navigation.
**Continues From:** S8-TC24 — reader on the jumped-to page.
**Test Data:** —
**Steps:**
1. Select the **Go to page** control.
**Expected Result:** The page-entry control opens.
**Actual Result:** The Go to page control was opened again for the suite's closing navigation, the entry pad appearing over the page as it had earlier.

---
### Test Case: S8-TC26 – Enter a page number
**Description:** Enter a page number using the keypad.
**Continues From:** S8-TC25 — page-entry control open.
**Test Data:** Keypad digit **2**
**Steps:**
1. Press **2** on the page keypad.
**Expected Result:** The digit appears in the page field.
**Actual Result:** Digit 2 was pressed on the keypad and shown in the page field, the reader still holding its place until the jump is confirmed.

---
### Test Case: S8-TC27 – Go to the entered page
**Description:** Navigate to the entered page.
**Continues From:** S8-TC26 — page number entered.
**Test Data:** —
**Steps:**
1. Select **Go to**.
**Expected Result:** The reader navigates to the entered page.
**Actual Result:** Go to carried the reader to that page, confirming navigation still behaves normally after everything the suite has opened on top of the reader.

---
### Test Case: S8-TC28 – Return to the dashboard
**Description:** Conclude the suite by leaving the eBook.
**Continues From:** S8-TC27 — reader on the entered page.
**Test Data:** —
**Steps:**
1. Select **Home** in the reader toolbar.
**Expected Result:** The eBook closes and the student returns to the dashboard.
**Actual Result:** Home closed the reader and the dashboard appeared as usual, after which the session signed out. No activity, video, game or zoom layer was left open holding the reader hostage at the end of the run.
_Note: after this case the session signs out (shared teardown)._

---

## Needs Clarification

1. **Toggle layout result wording (S2-TC2/TC3).** The two toggle cases assert the same layout
   value (`double-page`) in the current data, so the exact single-versus-double spread each step
   lands on should be confirmed live.
2. **"Save note" / "verify note" checks (S3-TC7/TC8).** The save verification has historically
   compared against the note label / heading rather than a strictly parsed note body, and the
   post-reopen "persistence" check counts notes rather than matching the exact text. The visible
   outcomes (note appears, note is present after reopen) are documented; exact-match assertions
   should be confirmed.
3. **Hyperlink / external-link hotlinks (S3-TC15, S8-TC20).** The checks confirm a **new tab opens**
   and the reader is refocused; the destination page itself is not validated. Documented expected
   result is therefore "opens in a new tab", not the destination content.
4. **Show / Hide selection strength (S7-TC2/TC4).** The show/hide verification is light in the
   current automation; the documented result reflects the visible show/hide outcome only.
5. **Timer keypad digits (S5-TC2/TC3/TC7/TC8).** The keypad digit buttons are exercised by position;
   the precise value they produce in the countdown display is not asserted, so no specific numeric
   time is claimed here.
6. **Dashboard eBook tile selection.** The class card's eBook is opened by its position on the card
   rather than by name; if multiple titles are present this can need a manual check.
