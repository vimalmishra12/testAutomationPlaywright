# Ebook Accessibility – THOR

## Purpose

Verify the Cambridge One **eBook reader can be used with a keyboard alone** (no mouse) for accessibility / screen-reader support — that every in-page interactive item (Note marker, Hotlink) and every reader toolbar control can be **reached with Tab / Shift+Tab and operated with Enter**, in a sensible order. One student login covers all 35 cases in a single continuous session.

## About this document

- **Coverage:** 35 test cases across 2 suites — **S1** in-page keyboard focus (19) and **S2** toolbar keyboard focus (16).
- **Type:** every case is a Positive (correct-behaviour) check.
- **Status:** all cases are recorded as **Pass** as the documentation baseline. The **Actual Result** is the observed outcome in plain tester language — update it and the Status if a future run diverges.
- **Priority weighting:**
- **High** — keyboard reachability/operability of primary content and reading order: reaching the in-page Note/Hotlink, activating them (open / close Notes, follow a Hotlink), the multi-item reading order, and the primary toolbar navigation controls (Home, Content, Tools, Jump to Page, Table of Contents).
- **Medium** — supporting traversal: advancing from a page item to Home, reverse (Shift+Tab) focus, empty-page focus handling, the zoom / view toolbar controls, and each suite’s page-anchor step.
- **Low** — housekeeping and peripheral controls: page resets between flows and the Move Toolbar / Toolbar Status / Change Course Material controls.

---

## Shared session setup (once, before S1-TC1)

A student signs in to the THOR environment and opens their assigned eBook from the dashboard. Every case starts from there; the eBook is closed and the user signs out at the very end. Account: student `CQA_AUTO_STU_101@mailsac.com`.

---

## Test Suite: S1 – eBook In-Page Keyboard Focus Traversal

undefined

### Test Case: S1-TC1 – Go to page 22 and confirm the Note item

**Description:** Opens a page with one Note marker and places focus in the reader.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Starts Fresh:** Yes *(the shared login + eBook launch run once, before this first case.)*

**Preconditions:** The student is signed in and the eBook reader has just been opened from the dashboard.

**Test Data:**

1. Page 22
2. —
3. —

**Steps:**

1. Jump to page 22
2. Confirm the Note item is shown
3. Click into the reading area

**Expected Result:** Page 22 shows its Note item; focus is placed in the reader ready to tab forward.

**Actual Result:** Navigated the reader to page 22 using the on-screen page-number control. The page rendered with its single Note icon on the text, and clicking into the reading area left the keyboard focus at the start of the content so the next Tab begins from the page.

---

### Test Case: S1-TC2 – Tab to the Note item on page 22

**Description:** First Tab press lands on the page Note item.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC1

**Preconditions:** The reader is open on page 22 (which has a Note marker), with keyboard focus placed in the reading area.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus moves onto the Note item.

**Actual Result:** With focus on the reader content, one press of Tab moved the focus indicator onto the Note icon on page 22 (focus ring visible), confirming the Note is the first keyboard-reachable interactive element on the page.

---

### Test Case: S1-TC3 – Tab from the Note item to Home (page 22)

**Description:** Continuing forward leaves the page and reaches the toolbar Home button.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC2

**Preconditions:** The reader is on page 22 with keyboard focus currently on the Note marker.

**Test Data:** Tab

**Steps:**

1. Press Tab again

**Expected Result:** Focus moves from the Note item to the Home button.

**Actual Result:** From the focused Note, a second Tab carried focus past the page content and onto the toolbar Home button (focus ring appeared on Home), showing the tab path correctly leaves the page and enters the toolbar.

---

### Test Case: S1-TC4 – Shift+Tab back to the Note item (page 22)

**Description:** Reverse navigation returns focus to the Note item.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC3

**Preconditions:** The reader is on page 22 with keyboard focus currently on the toolbar Home button.

**Test Data:** Shift+Tab

**Steps:**

1. Press Shift+Tab

**Expected Result:** Focus returns to the Note item.

**Actual Result:** Pressing Shift+Tab from Home moved focus backwards and it landed again on the Note icon on page 22 (focus ring returned to the Note), confirming focus moves in both directions across the page boundary.

---

### Test Case: S1-TC5 – Open the Notes panel with Enter (page 22)

**Description:** Activating the focused Note item opens My Notes.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC4

**Preconditions:** The reader is on page 22 with keyboard focus on the Note marker and the My Notes panel closed.

**Test Data:** Enter

**Steps:**

1. Press Enter on the focused Note item

**Expected Result:** The My Notes panel opens.

**Actual Result:** With the Note icon focused, pressing Enter activated it and the "My notes" side panel opened at the side of the reader, its heading visible on screen — the activation worked entirely from the keyboard.

---

### Test Case: S1-TC6 – Close the Notes panel with Enter (page 22)

**Description:** Activating the close control dismisses My Notes.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC5

**Preconditions:** The reader is on page 22 with the My Notes panel open.

**Test Data:** Enter

**Steps:**

1. Press Enter on the Close control of My Notes

**Expected Result:** The My Notes panel closes.

**Actual Result:** Moving focus to the panel close control and pressing Enter dismissed the "My notes" panel; its heading disappeared and the reader returned to the full page view, confirming the panel closes by keyboard.

---

### Test Case: S1-TC7 – Go to page 24 and confirm the Hotlink

**Description:** Opens a page with one Hotlink and places focus in the reader.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC6

**Preconditions:** The student is signed in with the eBook open and the previous page’s My Notes panel closed; the reader is about to move to page 24.

**Test Data:**

1. Page 24
2. —
3. —

**Steps:**

1. Jump to page 24
2. Confirm the Hotlink item is shown
3. Click into the reading area

**Expected Result:** Page 24 shows its Hotlink; focus placed in the reader.

**Actual Result:** Navigated to page 24 via the page-number control. The page displayed its single "Go to page" Hotlink icon, and clicking into the reading area placed focus at the start of the content, ready to traverse to the Hotlink.

---

### Test Case: S1-TC8 – Tab to the Hotlink (page 24)

**Description:** First Tab press lands on the page Hotlink.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC7

**Preconditions:** The reader is open on page 24 (which has a Hotlink), with keyboard focus placed in the reading area.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus moves onto the Hotlink item.

**Actual Result:** One Tab press from the reading area moved focus onto the Hotlink icon on page 24 (focus ring visible), confirming the Hotlink is keyboard-reachable as the interactive element on the page.

---

### Test Case: S1-TC9 – Tab from the Hotlink to Home (page 24)

**Description:** Continuing forward reaches the toolbar Home button.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC8

**Preconditions:** The reader is on page 24 with keyboard focus currently on the Hotlink.

**Test Data:** Tab

**Steps:**

1. Press Tab again

**Expected Result:** Focus moves to the toolbar Home button.

**Actual Result:** A further Tab moved focus from the Hotlink out of the page content and onto the toolbar Home button, showing the tab path exits the page to the toolbar after the single in-page item.

---

### Test Case: S1-TC10 – Shift+Tab back to the Hotlink (page 24)

**Description:** Reverse navigation returns focus to the Hotlink.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC9

**Preconditions:** The reader is on page 24 with keyboard focus currently on the toolbar Home button.

**Test Data:** Shift+Tab

**Steps:**

1. Press Shift+Tab

**Expected Result:** Focus returns to the Hotlink item.

**Actual Result:** Shift+Tab from Home returned focus in reverse onto the Hotlink icon on page 24 (focus ring back on the Hotlink), again confirming bidirectional traversal across the page/toolbar boundary.

---

### Test Case: S1-TC11 – Follow the Hotlink to page 28 with Enter

**Description:** Activating the Hotlink jumps the reader to its linked page.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC10

**Preconditions:** The reader is on page 24 with keyboard focus on the Hotlink (which links to page 28).

**Test Data:** Enter (jumps to page 28)

**Steps:**

1. Press Enter on the focused Hotlink

**Expected Result:** The reader jumps to page 28.

**Actual Result:** Pressing Enter on the focused Hotlink followed its link: the reader jumped and the page-number readout updated to page 28, the link target. The link activated by keyboard and navigated as intended.

---

### Test Case: S1-TC12 – Return to page 24

**Description:** Leaves the page in a clean state before the next flow.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Low  |  **Status:** Pass

**Continues From:** S1-TC11

**Preconditions:** The reader is on page 28, having just been jumped to by the Hotlink.

**Test Data:** Page 24

**Steps:**

1. Jump back to page 24

**Expected Result:** The reader is back on page 24.

**Actual Result:** Used the page-number control to return the reader to page 24, leaving the Hotlink flow in a clean, known state for the cases that follow. No errors observed.

---

### Test Case: S1-TC13 – Go to page 26 (no interactive items)

**Description:** Opens a page with no Note and no Hotlink.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC12

**Preconditions:** The reader has returned to page 24 and is about to move to page 26 (a page with no interactive items).

**Test Data:**

1. Page 26
2. —

**Steps:**

1. Jump to page 26
2. Click into the reading area

**Expected Result:** Page 26 shows no interactive items; focus placed in the reader.

**Actual Result:** Navigated to page 26, which contains no Note and no Hotlink. The page displayed as plain content and focus was placed at the start of the reading area — the correct baseline for the no-hotspot check that follows.

---

### Test Case: S1-TC14 – Tab goes straight to Home (page 26)

**Description:** With nothing interactive, Tab skips the page and reaches Home.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC13

**Preconditions:** The reader is open on page 26 (no Note or Hotlink), with keyboard focus placed in the reading area.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands directly on the Home button.

**Actual Result:** Pressing Tab on the non-interactive page 26 skipped straight over the content and landed directly on the toolbar Home button — nothing in the page caught focus. This confirms keyboard focus is not trapped on plain page content.

---

### Test Case: S1-TC15 – Go to page 28 and confirm both items

**Description:** Opens a page containing both a Note and a Hotlink.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC14

**Preconditions:** The reader is on page 26 and is about to move to page 28 (which has both a Note and a Hotlink).

**Test Data:**

1. Page 28
2. —
3. —
4. —

**Steps:**

1. Jump to page 28
2. Confirm the Note item is shown
3. Confirm the Hotlink item is shown
4. Click into the reading area

**Expected Result:** Page 28 shows both items; focus placed in the reader.

**Actual Result:** Navigated to page 28, which carries both a Note icon and a Hotlink icon; both were visible on the page and focus was placed at the start of the reading area — the baseline for the multi-item tab-order checks.

---

### Test Case: S1-TC16 – Tab to the Note first (page 28)

**Description:** First Tab reaches the Note when both items are present.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC15

**Preconditions:** The reader is open on page 28 (Note and Hotlink both present), with keyboard focus placed in the reading area.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Note item first.

**Actual Result:** The first Tab on page 28 moved focus onto the Note icon first (focus ring on the Note), establishing the correct reading order before the Hotlink.

---

### Test Case: S1-TC17 – Tab to the Hotlink second (page 28)

**Description:** Next Tab advances from Note to Hotlink.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC16

**Preconditions:** The reader is on page 28 with keyboard focus currently on the Note item.

**Test Data:** Tab

**Steps:**

1. Press Tab again

**Expected Result:** Focus lands on the Hotlink item next.

**Actual Result:** The next Tab advanced focus from the Note to the Hotlink icon on the same page (focus ring moved to the Hotlink), confirming the two in-page items are reached in the expected Note-then-Hotlink sequence.

---

### Test Case: S1-TC18 – Tab to Home last (page 28)

**Description:** Final Tab reaches Home, confirming Note -> Hotlink -> Home order.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S1-TC17

**Preconditions:** The reader is on page 28 with keyboard focus currently on the Hotlink.

**Test Data:** Tab

**Steps:**

1. Press Tab again

**Expected Result:** Focus lands on the Home button, confirming order Note -> Hotlink -> Home.

**Actual Result:** The following Tab moved focus from the Hotlink out to the toolbar Home button. Across the three presses the observed order was Note then Hotlink then Home, matching the intended keyboard reading order for a page holding both items.

---

### Test Case: S1-TC19 – Return to page 20

**Description:** Leaves the reader on a neutral page before the toolbar flow.

**Suite:** S1 — eBook in-page keyboard focus (Note & Hotlink hotspots)  
**Type:** Positive  |  **Priority:** Low  |  **Status:** Pass

**Continues From:** S1-TC18

**Preconditions:** The reader is on page 28 with keyboard focus on the toolbar Home button.

**Test Data:** Page 20

**Steps:**

1. Jump to page 20

**Expected Result:** The reader is on page 20.

**Actual Result:** Navigated the reader back to page 20 to park it on a neutral page before the toolbar suite begins. No errors observed.

---

---

## Test Suite: S2 – eBook Toolbar Keyboard Focus Traversal

undefined

### Test Case: S2-TC1 – Go to page 26 and place focus for toolbar traversal

**Description:** Repositions to page 26 and places focus to start tabbing the toolbar.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S1-TC19

**Preconditions:** The student is still signed in on the same eBook reader (it was on page 20 at the end of the in-page flow); the reader is about to move to page 26.

**Test Data:**

1. Page 26
2. —

**Steps:**

1. Jump to page 26
2. Click into the reading area

**Expected Result:** Reader on page 26, focus placed to begin the toolbar walk.

**Actual Result:** From the shared session (reader last left on page 20) navigated to page 26 and clicked into the reading area, giving a consistent keyboard start point for the toolbar traversal. No re-login was needed — the same signed-in reader session was reused.

---

### Test Case: S2-TC2 – Tab to Home

**Description:** Toolbar traversal reaches the Home button.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S2-TC1

**Preconditions:** The reader is open on page 26 with keyboard focus placed in the reading area, ready to walk the toolbar.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Home button.

**Actual Result:** The first Tab from the reading area landed focus on the toolbar Home button (focus ring on Home) — the expected start of the toolbar walk.

---

### Test Case: S2-TC3 – Tab to Content

**Description:** Toolbar traversal reaches the Content button.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S2-TC2

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Home button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Content button.

**Actual Result:** The next Tab advanced focus to the Content button on the toolbar (focus ring on Content), so a keyboard-only user can reach it.

---

### Test Case: S2-TC4 – Tab to Tools

**Description:** Toolbar traversal reaches the Tools button.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S2-TC3

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Content button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Tools button.

**Actual Result:** Tab moved focus on to the Tools button (focus ring on Tools), keeping the left-to-right toolbar order intact.

---

### Test Case: S2-TC5 – Tab to Zoom Out

**Description:** Toolbar traversal reaches Zoom Out.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S2-TC4

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Tools button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Zoom Out button.

**Actual Result:** Tab advanced focus to the Zoom Out button (focus ring on Zoom Out), the first of the zoom controls reached in sequence.

---

### Test Case: S2-TC6 – Tab to Zoom In

**Description:** Toolbar traversal reaches Zoom In.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S2-TC5

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Zoom Out button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Zoom In button.

**Actual Result:** Tab advanced focus to the Zoom In button (focus ring on Zoom In), immediately after Zoom Out.

---

### Test Case: S2-TC7 – Tab to Fit To Height

**Description:** Toolbar traversal reaches Fit To Height.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S2-TC6

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Zoom In button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Fit To Height button.

**Actual Result:** Tab advanced focus to the Fit To Height button (focus ring on it), following the zoom controls.

---

### Test Case: S2-TC8 – Tab to Jump to Page

**Description:** Toolbar traversal reaches the page-number control.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S2-TC7

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Fit To Height button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Jump to Page control.

**Actual Result:** Tab advanced focus to the Jump to Page (page-number) control (focus ring on it). Focusing it surfaced its page-entry pop-up, which the next case dismisses.

---

### Test Case: S2-TC9 – Tab to Previous

**Description:** Dismisses the page-entry pop-up, then continues to Previous.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S2-TC8

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is on the Jump to Page control (its page-entry pop-up may still be open).

**Test Data:** Tab

**Steps:**

1. Dismiss the page-number pop-up from Jump to Page, then press Tab

**Expected Result:** Focus lands on the Previous button.

**Actual Result:** Dismissed the page-number pop-up that Jump to Page had opened, then pressed Tab; focus moved past it onto the Previous (previous-page) button, confirming a lingering pop-up does not block the keyboard path.

---

### Test Case: S2-TC10 – Tab to Table of Contents

**Description:** Toolbar traversal reaches Table of Contents.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** High  |  **Status:** Pass

**Continues From:** S2-TC9

**Preconditions:** The toolbar walk on page 26 is in progress; the page-number pop-up has been dismissed and focus is on the Previous button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Table of Contents button.

**Actual Result:** Tab advanced focus to the Table of Contents button (focus ring on it), so a keyboard user can reach the contents from the toolbar.

---

### Test Case: S2-TC11 – Tab to Next

**Description:** Toolbar traversal reaches Next.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S2-TC10

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Table of Contents button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Next button.

**Actual Result:** Tab advanced focus to the Next (next-page) button (focus ring on Next).

---

### Test Case: S2-TC12 – Tab to Single Page View

**Description:** Toolbar traversal reaches Single Page View.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Medium  |  **Status:** Pass

**Continues From:** S2-TC11

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Next button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Single Page View toggle.

**Actual Result:** Tab advanced focus to the Single Page View toggle (focus ring on it), confirming the layout control is keyboard-reachable.

---

### Test Case: S2-TC13 – Tab to Change Course Material

**Description:** Toolbar traversal reaches Change Course Material.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Low  |  **Status:** Pass

**Continues From:** S2-TC12

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Single Page View toggle.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Change Course Material button.

**Actual Result:** Tab advanced focus to the Change Course Material button (focus ring on it), a peripheral but still reachable toolbar control.

---

### Test Case: S2-TC14 – Tab to Move Toolbar

**Description:** Toolbar traversal reaches Move Toolbar.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Low  |  **Status:** Pass

**Continues From:** S2-TC13

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Change Course Material button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Move Toolbar button.

**Actual Result:** Tab advanced focus to the Move Toolbar button (focus ring on it); the control is keyboard-reachable even though it is used rarely.

---

### Test Case: S2-TC15 – Tab to Toolbar Status

**Description:** Toolbar traversal reaches the Toolbar Status control.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Low  |  **Status:** Pass

**Continues From:** S2-TC14

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Move Toolbar button.

**Test Data:** Tab

**Steps:**

1. Press Tab

**Expected Result:** Focus lands on the Toolbar Status control.

**Actual Result:** Tab advanced focus to the Toolbar Status control (focus ring on it) — the last control in the toolbar walk; every toolbar item proved keyboard-reachable in order.

---

### Test Case: S2-TC16 – Return to page 20

**Description:** Leaves the reader on a neutral page to finish the session.

**Suite:** S2 — eBook toolbar keyboard focus traversal (page 26)  
**Type:** Positive  |  **Priority:** Low  |  **Status:** Pass

**Continues From:** S2-TC15

**Preconditions:** The toolbar walk on page 26 is in progress; keyboard focus is currently on the Toolbar Status control.

**Test Data:** Page 20

**Steps:**

1. Click into the reading area, then jump to page 20

**Expected Result:** The reader is back on page 20; eBook then closed and user signed out.

**Actual Result:** Clicked into the reading area and navigated the reader back to page 20 to finish on a neutral page; the eBook is then closed and the user signs out. No errors observed.

---

