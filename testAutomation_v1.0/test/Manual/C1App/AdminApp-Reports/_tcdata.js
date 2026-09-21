/**
 * Source of truth for the AdminApp Reports tab manual test-case set (module MRPT).
 * Both the .md document and the .xlsx register are generated from this file, so they
 * cannot drift (SKILL golden rule 6).
 */

// [2026-09-08] Re-grounded on FCN-CHZ-PDA. The original grounding school,
// "Cqa Test Ashish School 1" (VED-NEH-KVU, org_cup_j9GskaJJmvDjmQZ9) via
// cqatestashish_admin@mailsac.com, has NO credentials in the repo and is invisible to the
// suite's login account (testt1@mailsac.com). FCN-CHZ-PDA is also the better fixture: 110
// classes across several statuses, where VED-NEH-KVU held 6 all-Active classes and so could
// not demonstrate filter exclusion at all.
const SCHOOL = '3 July Test School 1 (key FCN-CHZ-PDA)';
const PRE_TAB = 'Logged in as school-admin <REPORTS_ADMIN_USER>; school "' + SCHOOL + '" opened from "My school accounts"; Reports tab open.';
const PRE_SEL = 'Logged in as school-admin <REPORTS_ADMIN_USER>; school "' + SCHOOL + '" opened; "Create report" clicked so the class-selection step is displayed.';

function typeTC(n, id, name, prio) {
  return {
    id: 'TST_MRPT_TC_' + id,
    title: 'Verify a ' + name + ' report is created and listed for download when "From the beginning" is selected',
    req: '#' + n + ' — Verify ' + name + ' report from beginning',
    type: 'Positive',
    priority: prio,
    pre: PRE_SEL,
    steps: '1. Select one class (e.g. "Gated LP Class", key 4mG6-9Jkf) using its row checkbox.\n'
      + '2. Click "Continue" in the footer bar.\n'
      + '3. In the "Create report" dialog open the "Report type" dropdown and choose "' + name + '".\n'
      + '4. Leave "Date range" on the default "From the beginning".\n'
      + '5. Leave "Only include items that contribute to grade calculation" unchecked.\n'
      + '6. Click "Submit".\n'
      + '7. Click "Back to Reports".',
    data: 'Class: "Gated LP Class" (4mG6-9Jkf) · Report type: "' + name + '" · Date range: From the beginning',
    expected: 'After step 6 the confirmation dialog reads "We are preparing your report" and '
      + '"We will notify you when your ' + name + ' report is ready to download", offering "Create another report" and "Back to Reports".\n'
      + 'After step 7 the Reports heading count increases by one and a new row carrying a "New" badge shows: '
      + 'Report type = "' + name + '"; Classes = 1; Students = 1; Items = "All items"; '
      + 'Date range = "All student data (up to - <TODAY>)"; Date created = <TODAY>; a file size; and a "Download" link.',
    remarks: 'Grounded live for Class summary on 2026-08-26 — the row rendered "All items" / "All student data (up to - Aug 26, 2026)" / "496 Bytes" / Download, and generation completed within seconds despite the "we will notify you" wording. '
      + (name === 'Class summary'
        ? 'This is the fully grounded case; the other five follow the identical flow.'
        : '[ASSUMED] for this report type — the report-type value and its availability were verified live, but the resulting row was not. The row shape is inherited from the grounded Class summary run.')
      + ' CREATES REAL DATA: a report on the school, auto-expiring after 60 days.',
  };
}

const TCS = [
  // ---------- Requirement #1
  {
    id: 'TST_MRPT_TC_2',
    title: 'Verify the class-selection step launches when "Create report" is clicked',
    req: '#1 — Verify Create Report is launching',
    type: 'Positive', priority: 'High', pre: PRE_TAB,
    steps: '1. Click "Create report".\n2. Observe the page.',
    data: '—',
    expected: 'The app navigates to /admin/admin/org_<slug>/reports/create. The page shows a "Go back" link, the heading "Create report", the sub-heading "Choose classes you want to include in your report", a section heading "Select classes" with the note "You can include up to 1500 classes", a search box placeholdered "Search for class name or class key", a "Filter" control showing "All class statuses", a "Select all classes" checkbox, sortable column headers (Class name, Class key, Start date, End date, Students, Class status) and one selectable row per class.',
    remarks: 'Captured live 2026-08-26. Note the "Select classes" heading carries NO count while zero classes are selected — the "(N)" appears only once at least one class is ticked.',
  },

  // ---------- Requirement #2
  {
    id: 'TST_MRPT_TC_4',
    title: 'Verify a class is returned when the full class name is searched',
    req: '#2 — Verify search using class name or class key',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Type "Fixture_GradeSettings_DO_NOT_DELETE" into the "Search for class name or class key" box.\n2. Do NOT click "Search".\n3. Observe the class list.',
    data: 'Search term: Fixture_GradeSettings_DO_NOT_DELETE',
    expected: 'The list narrows to the single class "Fixture_GradeSettings_DO_NOT_DELETE" with key 62k3-AXm6, WITHOUT the "Search" button being clicked, and the row remains selectable.',
    remarks: 'CORRECTED 2026-09-08 — the previous expected result was [ASSUMED] and WRONG. The search is LIVE / debounced, not submit-driven: the list narrowed to one row before the "Search" button was clicked. The earlier assumption was inherited from the Classes tab, which IS submit-driven — exactly the trap admin-shared.md §A4 warns about. A "Search" control (a[qid="createReport-10"]) does exist but is not required to filter. Test data also changed: the original "Gated LP Class" (4mG6-9Jkf) lives on VED-NEH-KVU, which the suite account cannot see. Fixture_GradeSettings_DO_NOT_DELETE is documented never-delete in admin-shared.md §A7, so it is unique and stable on this shared school.',
  },
  {
    id: 'TST_MRPT_TC_5',
    title: 'Verify a class is returned when its class key is searched',
    req: '#2 — Verify search using class name or class key',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Type "62k3-AXm6" into the search box.\n2. Do NOT click "Search".\n3. Observe the class list.',
    data: 'Search term: 62k3-AXm6',
    expected: 'The list narrows to the single class whose Class key column reads "62k3-AXm6" ("Fixture_GradeSettings_DO_NOT_DELETE").',
    remarks: 'Verified live 2026-09-08. The placeholder offers both paths — "Search for class name or class key" — so the key path is covered separately from the name path. Key changed from 4mG6-9Jkf (VED-NEH-KVU) to 62k3-AXm6 (FCN-CHZ-PDA) with the re-grounding. As with TC_4 the search is live — no "Search" click is required.',
  },
  {
    id: 'TST_MRPT_TC_6',
    title: 'Verify matching classes are returned when a partial, differently-cased term is searched',
    req: '#2 — Verify search using class name or class key',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Type "school license" into the search box.\n2. Click "Search".\n3. Observe the class list.',
    data: 'Search term: school license',
    expected: '[ASSUMED] All four "School License Test Class 1–4" rows are returned, proving the search is partial-matching and case-insensitive.',
    remarks: '[ASSUMED] — NOT verified live. admin-shared.md §A4 warns explicitly that the Library tab search is FUZZY rather than substring while the Classes tab search is substring, and that a Classes-tab expectation must not be inherited onto a new admin tab without re-verifying. Confirm the semantics here before trusting this case.',
  },
  {
    id: 'TST_MRPT_TC_7',
    title: 'Verify a no-results state is shown when the search term matches no class',
    req: '#2 — Verify search using class name or class key',
    type: 'Negative', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Type "zzzznotaclass" into the search box.\n2. Click "Search".\n3. Observe the class list area.',
    data: 'Search term: zzzznotaclass',
    expected: '[ASSUMED] No class rows are rendered and a no-results message is shown that echoes the search term (the Classes tab renders "No classes that match your search <term>").',
    remarks: '[ASSUMED] copy — the no-results state was not reached during the 2026-08-26 capture. Capture the exact string live before automating.',
  },

  // ---------- Requirement #3
  {
    id: 'TST_MRPT_TC_8',
    title: 'Verify the filter panel opens with all five class statuses when "Filter" is clicked',
    req: '#3 — Verify filter',
    type: 'Positive', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Click the "Filter" control.\n2. Observe the panel.',
    data: '—',
    expected: 'A panel headed "Filter by" opens containing exactly five checkboxes labelled "Not started", "Active", "Ended", "Expired" and "Deleted", ALL FIVE TICKED by default, plus a "Clear all" link, an "Apply" button and a "Close" control. The filter summary label reads "All class statuses".',
    remarks: 'CORRECTED 2026-09-08 — the previous expected result said the five checkboxes were UNTICKED. They are all TICKED by default, which is what makes the unfiltered summary read "All class statuses". Strings otherwise captured verbatim live 2026-08-26 and re-verified 2026-09-08. Note the status set includes "Not started", which the existing Classes-tab knowledge did not record (it listed Ended / Expired / Deleted).',
  },
  {
    id: 'TST_MRPT_TC_9',
    title: 'Verify the class list is narrowed to one status when that status filter is applied',
    req: '#3 — Verify filter',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Click "Filter".\n2. Untick "Not started", "Ended", "Expired" and "Deleted", leaving only "Active" ticked.\n3. Click "Apply".\n4. Observe the class list and the filter summary label.',
    data: 'Filter: Active only',
    expected: 'The panel closes and every rendered row shows "Active" in its Class status column. The summary label changes from "All class statuses" to "1 class status".',
    remarks: 'VERIFIED live 2026-09-08 on FCN-CHZ-PDA; the [ASSUMED] on the summary label is resolved. The label is "<N> class status(es)" where N is the number of TICKED statuses — so leaving one ticked reads "1 class status" (singular). Steps corrected: because all five start ticked (TC_8), a single-status filter is reached by UNTICKING the other four, not by ticking one. This school proves exclusion properly — 21 of its 110 classes are Active, and the pre-filter list contained Deleted rows.',
  },
  {
    id: 'TST_MRPT_TC_10',
    title: 'Verify the unfiltered class list is restored when "Clear all" is used',
    req: '#3 — Verify filter',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Apply a filter of a single status (see TST_MRPT_TC_9) so the summary reads "1 class status".\n2. Click "Filter" to reopen the panel.\n3. Click "Clear all".\n4. Observe the checkboxes, the panel, the class list and the summary label.',
    data: 'A single applied status, then Clear all',
    expected: 'All five status checkboxes return to TICKED, the panel closes immediately WITHOUT "Apply" being clicked, the class list returns to the unfiltered set and the summary label returns to "All class statuses".',
    remarks: 'CORRECTED 2026-09-08 — both [ASSUMED]s resolved, and the previous expected result was WRONG. "Clear all" is a RESET TO UNFILTERED, not an "untick everything": it re-checks all five statuses, applies immediately with no "Apply" click, and closes the panel. This was flagged in the original Remarks as the most likely place for a wrong expected result, and it was.',
  },
  {
    id: 'TST_MRPT_TC_11',
    title: 'Verify classes of every selected status are listed when multiple status filters are applied',
    req: '#3 — Verify filter',
    type: 'Edge', priority: 'Low', pre: PRE_SEL,
    steps: '1. Click "Filter".\n2. Tick "Active" and "Not started".\n3. Click "Apply".\n4. Observe the class list.',
    data: 'Filter: Active + Not started',
    expected: 'The list contains classes of BOTH statuses (an OR combination), not their intersection.',
    remarks: 'Requires the school to hold at least one "Not started" class. All six classes on VED-NEH-KVU were Active on 2026-08-26, so this needs a class whose start date is in the future.',
  },
  {
    id: 'TST_MRPT_TC_12',
    title: 'Verify an empty class list is shown when the applied filter matches no class',
    req: '#3 — Verify filter',
    type: 'Negative', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Click "Filter".\n2. Tick "Deleted" only.\n3. Click "Apply".\n4. Observe the class list area.',
    data: 'Filter: Deleted',
    expected: '[ASSUMED] No class rows are rendered and a no-results message naming the applied status is shown (the Classes tab renders "No classes that are <status>, <label>").',
    remarks: '[ASSUMED] copy — not captured live. Depends on the school holding no soft-deleted class; on a school that does, pick a status that is genuinely absent.',
  },

  // ---------- Requirement #4
  {
    id: 'TST_MRPT_TC_13',
    title: 'Verify the selection count and footer summary update when a single class checkbox is ticked',
    req: '#4 — Verify class selection checkbox',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Search for "Fixture_GradeSettings_DO_NOT_DELETE" so the list holds a single known row.\n2. Tick that row\'s "Select class" checkbox.\n3. Observe the section heading and the bottom of the page.',
    data: 'Class: "Fixture_GradeSettings_DO_NOT_DELETE" (62k3-AXm6), 0 students',
    expected: 'The section heading becomes "Select classes(1)". A footer bar appears reading "You have selected 1 class with a total of 0 students" and carrying a "Cancel" link and a "Continue" button.',
    remarks: 'Re-verified live 2026-09-08 on FCN-CHZ-PDA. Both the "(1)" suffix and the whole footer bar are absent at zero selection — see TST_MRPT_TC_15. NOTE the summary says "0 studentS" — plural with a zero count; the singular "1 student" form recorded on 2026-08-26 came from a different class. Do not assert a singular/plural rule. The footer appears on the SAME TICK as the click (measured 0 ms).',
  },
  {
    id: 'TST_MRPT_TC_14',
    title: 'Verify every matching class is selected when "Select all classes" is ticked',
    req: '#4 — Verify class selection checkbox',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. With no search or filter applied, note how many class rows are rendered (the list lazy-loads 20 at a time and offers "Load more...").\n2. Tick the "Select all classes" checkbox.\n3. Observe the row checkboxes, the section heading and the footer bar.',
    data: 'FCN-CHZ-PDA: 110 classes in total, 20 rendered per page, 30 students across the school',
    expected: 'Every RENDERED row checkbox becomes ticked. The heading reads "Select classes(<TOTAL>)" where <TOTAL> is the number of classes MATCHING the current query — the full 110, not the 20 rendered — and the footer bar summarises the same totals ("You have selected 110 classes with a total of 30 students").',
    remarks: 'RESOLVED live 2026-09-08 — the open question in the original Remarks is answered: "Select all" covers EVERY MATCHING class on the school, not just the loaded page. With 20 of 110 rows rendered the heading read "Select classes(110)". So an expected result of the form "<N> = the number of listed classes" is WRONG and would fail. Plural wording confirmed ("classes" / "students"). When automating, do not hardcode 110 — this school churns; assert the heading count against the createReport-11-N anchor count, which tracks the matching total. Also: clicking select-all while a PARTIAL selection exists clears it instead of completing it, so reaching "all selected" from one ticked row takes two clicks.',
  },
  {
    id: 'TST_MRPT_TC_15',
    title: 'Verify the footer action bar is not rendered when no class is selected',
    req: '#4 — Verify class selection checkbox',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Ensure no class checkbox is ticked.\n2. Observe the section heading and the bottom of the page.',
    data: '—',
    expected: 'The section heading reads "Select classes" with no "(N)" suffix, and no footer bar is present — there is no "Continue" control by which the report-configuration step could be reached.',
    remarks: 'Verified live 2026-08-26: the footer panel is genuinely ABSENT from the DOM at zero selection, not merely a disabled button. An automated assertion of the form "Continue is disabled" would fail to find the element at all — assert absence instead.',
  },
  {
    id: 'TST_MRPT_TC_16',
    title: 'Verify the selection count decreases when a selected class checkbox is unticked',
    req: '#4 — Verify class selection checkbox',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Tick two class checkboxes and confirm the heading reads "Select classes(2)".\n2. Untick one of them.\n3. Observe the heading and the footer bar.',
    data: 'Two classes from VED-NEH-KVU',
    expected: 'The heading returns to "Select classes(1)" and the footer summary returns to "You have selected 1 class with a total of 1 student".',
    remarks: 'Unticking the last remaining class should also remove the footer bar entirely — cross-check against TST_MRPT_TC_15.',
  },

  // ---------- Requirement #5
  {
    id: 'TST_MRPT_TC_18',
    title: 'Verify the class selection is cleared and no report is created when "Cancel" is used on the class-selection step',
    req: '#5 — Verify Cancel button functionality',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Tick one class checkbox so the footer bar appears.\n2. Click "Cancel" in the footer bar.\n3. Observe the row checkbox, the section heading, the footer bar and the URL.',
    data: 'Class: "Fixture_GradeSettings_DO_NOT_DELETE" (62k3-AXm6)',
    expected: 'The class is deselected, the section heading returns to a bare "Select classes" with no "(N)" suffix and the footer bar is removed from the page. The app REMAINS on /admin/admin/org_<slug>/reports/create. No report is created.',
    remarks: 'CORRECTED 2026-09-08 — the previous expected result ("the app returns to the Reports tab") was WRONG and had never been verified live. Reproduced twice, the second time on a freshly reloaded page, with no dialog, no backdrop and 0 visible modals: the footer "Cancel" (createReport-13) CLEARS THE SELECTION and stays on the class-selection step. The control that leaves the flow is "Go back" (createReport-1), covered by TST_MRPT_TC_3, which was verified returning to /reports with "Reports (0)" unchanged. Confirmed as accepted product behaviour by the user 2026-09-08 — NOT raised as a defect. There are now THREE distinct Cancel-like controls on this flow: createReport-1 leaves, createReport-13 clears the selection, createReport-15 closes the config dialog (TST_MRPT_TC_19). They must not be conflated.',
  },
  {
    id: 'TST_MRPT_TC_19',
    title: 'Verify the report-configuration dialog closes without creating a report when its "Cancel" is used',
    req: '#5 — Verify Cancel button functionality',
    type: 'Positive', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Tick one class checkbox.\n2. Click "Continue" to open the "Create report" dialog.\n3. Choose report type "Class summary".\n4. Click "Cancel" in the dialog.\n5. Observe the dialog, the class selection and the URL.',
    data: 'Class: "Fixture_GradeSettings_DO_NOT_DELETE" (62k3-AXm6) · Report type: "Class summary"',
    expected: 'The dialog closes and the class-selection step is shown again with the class STILL SELECTED — heading still "Select classes(1)", footer bar still present. The report type resets to "Select a report type". The app remains on /admin/admin/org_<slug>/reports/create and no report is created.',
    remarks: 'VERIFIED live 2026-09-08 — the [ASSUMED] is resolved and the guess was right: the dialog Cancel PRESERVES the class selection. It does not clear it and does not return to the Reports tab. The dialog (#schoolReportModal) stays in the DOM at display:none, so assert visibility, never presence. The report type resetting to "Select a report type" is an additional confirmed detail. This case could not be confirmed on 2026-09-07 because the browser session was degraded, not because the product misbehaved.',
  },
  {
    id: 'TST_MRPT_TC_20',
    title: 'Verify the report-configuration dialog closes without creating a report when its "Close" control is used',
    req: '#5 — Verify Cancel button functionality',
    type: 'Edge', priority: 'Low', pre: PRE_SEL,
    steps: '1. Tick one class checkbox.\n2. Click "Continue" to open the "Create report" dialog.\n3. Click the dialog\'s "Close" (X) control.\n4. Observe the page and the Reports list.',
    data: 'Class: "Gated LP Class"',
    expected: '[ASSUMED] The dialog closes with the same outcome as its "Cancel" button, and no report is created.',
    remarks: '[ASSUMED] — the dialog exposes a "Close" control distinct from "Cancel" (both captured live in the pre-rendered DOM). Verify the two behave identically rather than assuming it.',
  },

  // ---------- Requirements #6–#11
  typeTC(6, 21, 'Class summary', 'High'),
  typeTC(7, 22, 'Class detailed data', 'High'),
  typeTC(8, 23, 'Class daily data', 'High'),
  typeTC(9, 24, 'Aggregated data', 'High'),
  typeTC(10, 25, 'Assignments summary', 'Medium'),
  typeTC(11, 26, 'Assignments detailed data', 'Medium'),

  // ---------- Requirement #12
  {
    id: 'TST_MRPT_TC_27',
    title: 'Verify the custom date-range controls become available when a date-capable report type is selected',
    req: '#12 — Verify Custom date range reports',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Tick one class and click "Continue".\n2. Observe the "Date range" radios BEFORE choosing a report type.\n3. Choose report type "Class summary".\n4. Observe the "Date range" radios again.\n5. Select "Custom date range".\n6. Observe the fields that appear.',
    data: 'Report type: Class summary',
    expected: 'At step 2 both date-range radios are DISABLED, "From the beginning" is pre-selected and "Submit" is disabled. After step 3 both radios and "Submit" become enabled. The radios read "From the beginning" / "Export all student data" and "Custom date range" / "Export data based on specific dates". After step 5 a "From" and a "To" field appear, pre-filled with the last seven days (start = today minus 6 days, end = today).',
    remarks: 'All states verified live 2026-08-26: radios disabled until a report type is chosen; the defaults were "Thu, Aug 20, 2026" to "Wed, Aug 26, 2026". Repeat for Class detailed data, Class daily data and Aggregated data — all four verified date-capable.',
  },
  {
    id: 'TST_MRPT_TC_28',
    title: 'Verify a report is created over the chosen window when a custom date range is submitted',
    req: '#12 — Verify Custom date range reports',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Tick one class and click "Continue".\n2. Choose report type "Class summary".\n3. Select "Custom date range".\n4. Set "From" and "To" to a window inside the allowed range using the pickers.\n5. Click "Submit".\n6. Click "Back to Reports".',
    data: 'Class: "Gated LP Class" · Report type: Class summary · From/To: a valid past window',
    expected: 'The confirmation dialog appears as in TST_MRPT_TC_21, and the new Reports row shows a "Date range" value reflecting the chosen window rather than "All student data (up to - <TODAY>)".',
    remarks: '[ASSUMED] the exact "Date range" cell format for a custom window — only the "From the beginning" form ("All student data (up to - Aug 26, 2026)") was captured live. Listed in Open items. Repeat for the other three date-capable types. CREATES REAL DATA.',
  },
  {
    id: 'TST_MRPT_TC_31',
    title: 'Verify the end date cannot be set earlier than the selected start date',
    req: '#12 — Verify Custom date range reports',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".\n2. Note the "From" value.\n3. Open the "To" picker and attempt to select a date before it.\n4. Change "From" to a different date and re-open the "To" picker.',
    data: 'Boundary: start date',
    expected: 'Dates before the current "From" value are disabled in the "To" picker; the start date itself is selectable (a single-day range). The floor moves when "From" is changed.',
    remarks: 'Verified live 2026-08-26: the "To" input carried min="2026-08-19T18:30:00.000Z" while "From" was Aug 20, 2026 — the end-date floor tracks the chosen start date. Step 4 (that the floor moves) is [ASSUMED].',
  },

  // ---------- Requirement #13
  {
    id: 'TST_MRPT_TC_34',
    title: 'Verify the custom grade-settings option is offered and unticked by default for the report types that support it',
    req: '#13 — Verify reports with custom grade settings applied',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Tick one class and click "Continue".\n2. Choose report type "Class summary".\n3. Observe the checkbox labelled "Only include items that contribute to grade calculation".\n4. Repeat for Class detailed data, Class daily data, Aggregated data, Assignments summary and Assignments detailed data.',
    data: 'The six grade-capable report types',
    expected: 'For all six types the checkbox "Only include items that contribute to grade calculation" is present, ENABLED and unticked by default.',
    remarks: 'Verified live 2026-08-26 across all seven types — exactly these six offer it, matching the six listed in scenario #13. This checkbox is the product\'s expression of "custom grade settings applied (eg: exclude a component)": the exclusion itself is configured on the class\'s Class grade settings page (module CGST), and this checkbox makes the report honour it.',
  },
  {
    id: 'TST_MRPT_TC_35',
    title: 'Verify the created report is restricted to grade-contributing items when the custom grade option is ticked',
    req: '#13 — Verify reports with custom grade settings applied',
    type: 'Positive', priority: 'High',
    pre: PRE_SEL + ' The chosen class has Class grade settings configured so that at least one component is excluded from grade calculation.',
    steps: '1. Tick a class whose grade settings exclude a component, and click "Continue".\n2. Choose report type "Class summary".\n3. Tick "Only include items that contribute to grade calculation".\n4. Click "Submit".\n5. Click "Back to Reports".\n6. Observe the new row\'s "Items" column.\n7. Download the report and compare its contents with the same report created without the option.',
    data: 'Class with an excluded component · Report type: Class summary · Custom grade option: ticked',
    expected: '[ASSUMED] The new Reports row shows an "Items" value other than "All items", reflecting the restriction, and the downloaded report omits the excluded component.',
    remarks: '[ASSUMED] — the "Items" cell reads "All items" when the option is UNticked (verified live 2026-08-26); the ticked value was NOT captured. Listed in Open items. Also requires a class with an excluded component — verify one exists on VED-NEH-KVU or configure one via Class grade settings (CGST) first. CREATES REAL DATA.',
  },

  // ---------- Requirement #14 — the report type missing from the source list
  (function () {
    const tc = typeTC(14, 37, 'Estimated CEFR level', 'High');
    tc.remarks = 'IN SCOPE — confirmed with the requester on 2026-08-26 that this seventh report type was a '
      + 'genuine omission from AdminApp_Report tab.xlsx, not a deliberate exclusion. It is therefore treated as a '
      + 'first-class report-type scenario alongside #6–#11 rather than as added coverage. Its dropdown description '
      + 'reads "Gives an indication of your students\' level based on all tests submitted." '
      + 'Estimated CEFR level supports NEITHER a custom date range NOR custom grade settings (verified live '
      + '2026-08-26), so it is correctly absent from scenarios #12 and #13; those exclusions are pinned by '
      + 'TST_MRPT_TC_33 and TST_MRPT_TC_36. '
      + '[ASSUMED] for the resulting Reports row — the report-type value and its availability were verified live, '
      + 'but the row was not; its shape is inherited from the grounded Class summary run. '
      + 'CREATES REAL DATA: a report on the school, auto-expiring after 60 days.';
    return tc;
  })(),

  // ---------- Requirement #15 (added coverage — error paths)

  // ---------- Gap-analysis batch, added 2026-09-01.
  // These three were appended straight to the .md/.xlsx and were NEVER added to this file, so
  // regenerating would have silently deleted them. Restored here 2026-09-08 so the generator is
  // once again the single source of truth (SKILL golden rule 6).
  {
    id: 'TST_MRPT_TC_40',
    title: 'Verify the class-selection filter offers class statuses only and no class-label filter',
    req: '#3 — Verify filter',
    type: 'Positive', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Click "Create report" to reach the class-selection step.\n2. Open "Filter".\n3. Record every filter group the panel offers.\n4. Confirm no class-label group is present.',
    data: '—',
    expected: 'The filter panel offers EXACTLY ONE group — the five class statuses ("Not started", "Active", "Ended", "Expired", "Deleted") — and no class-label filter of any kind. The panel contains exactly five checkboxes in total.',
    remarks: 'REWRITTEN 2026-09-08 by user decision. Originally added 2026-09-01 from the other team\'s TC_REP_003, which describes a "status/label filter", and the case asked whether the filter narrows the list by class LABEL. Its own Remarks flagged the premise as unconfirmed and said GROUND FIRST. Grounded live 2026-09-08: the premise is FALSE — the report-flow panel offers five status checkboxes and no other group, so the other team\'s sheet is wrong on this point. The case is therefore inverted into an expected-versus-actual assertion that PINS the absence of a label filter. A class-label filter does exist on the Classes tab (TST_CLST_TC_4); the report flow does not reuse that panel. Read-only.',
  },
  {
    id: 'TST_MRPT_TC_41',
    title: 'Verify a generated report contains data that reconciles with the class it was run against',
    req: '#6 — Verify Class summary report from beginning',
    type: 'Positive', priority: 'High',
    pre: 'A fixture class whose activity data is known and stable, with a report generated over it.',
    steps: '1. Record the fixture class\'s known activity — enrolled students and their completed activities/scores.\n2. Generate a "Class summary" report "From the beginning" and download it.\n3. Reconcile the file against the recorded data: one row per enrolled student, totals summing correctly.\n4. Repeat for "Aggregated data" and confirm its figures sum/average the underlying class-level data.',
    data: 'Fixture class <FROZEN_ACTIVITY_CLASS> with known, unchanging activity.',
    pre: 'Logged in as the Reports school-admin; the FROZEN fixture class "Automation_frozen_DND" (gHoZ-iBXf) exists on VED-NEH-KVU with 2 enrolled students whose activity is known and unchanging.',
    steps: '1. Create a "Class summary" report over "Automation_frozen_DND" and return to the Reports tab.\n'
      + '2. Wait for the new row to offer "Download", then download and unzip it.\n'
      + '3. Locate each component\'s CSV by its Component COLUMN (not by filename or position).\n'
      + '4. For the component that holds the activity ("Project Work"), reconcile every student row against the known activity.\n'
      + '5. Confirm the components with no activity report none.',
    data: 'Class "Automation_frozen_DND" (gHoZ-iBXf). cqatestauto_stu1@mailsac.com performed 3 activities; cqatestauto_stu2@mailsac.com performed 1. Product total: 24 activities on the "Project Work" component.',
    expected: 'The "Project Work" CSV holds one row per enrolled student, each carrying Class name "Automation_frozen_DND" and Class key "gHoZ-iBXf". '
      + 'cqatestauto_stu1 reports 3 activities completed of 24 (13%), best and first score average 72. '
      + 'cqatestauto_stu2 reports 1 of 24 (4%), best and first score average 67. '
      + 'The percentage is arithmetically consistent with completed/total in every row. '
      + 'Both students show a non-zero Time spent and a Last active value. '
      + 'The CSVs for "Practice Extra" and "Practice Extra - Group Enabled" report no completed activities and 00:00:00 time spent for either student.',
    remarks: 'UNBLOCKED AND AUTOMATED 2026-09-11 — the fixture was provisioned by the user specifically for this. '
      + 'THE POINT OF THIS CASE, and why it is worth the fixture: our eight generation cases (TST_MRPT_TC_21–TC_26, TC_28, TC_37) all stop at "a row appeared in the list", and TST_MRPT_TC_43 checks the file\'s structure and identity — a report generated with the WRONG NUMBERS passes all nine. This is the only case that reads the figures. '
      + 'The completed counts (3 and 1) are the one expectation here that did NOT come from the product: the user performed that activity and stated the counts BEFORE the report was read, and the report then agreed. That makes this a genuine correctness check; the score averages and totals are frozen snapshots and only catch regressions. '
      + 'The percentage is additionally asserted against its own arithmetic (round(completed/total*100)), which needs no frozen value and keeps working if the fixture is ever re-baselined. '
      + 'DELIBERATELY NOT ASSERTED AS VALUES: "Time spent" (00:02:40 / 00:00:50) and "Last active" (11-Sep-2026-11:10:18am / 11:13:12am) — both move the moment anyone opens the content, so only their presence or absence is checked. '
      + '🚨 NEVER MODIFY "Automation_frozen_DND": no enrolment changes, no material or grade-settings changes, and never log in as cqatestauto_stu1/stu2 and touch content. The day someone does, this case fails and it is NOT a product defect.',
  },
  {
    id: 'TST_MRPT_TC_42',
    title: 'Verify a custom grade exclusion is respected consistently across every report type that supports it',
    req: '#13 — Verify reports with custom grade settings applied',
    type: 'Edge', priority: 'Medium',
    pre: 'A class whose grade settings exclude one component or category from the grade, with known activity on the excluded item.',
    steps: '1. Configure the class grade settings to exclude one component/category.\n2. Generate each supported type with the custom grade option ticked: Class summary, Class detailed data, Class daily data, Aggregated data, Assignments summary, Assignments detailed data.\n3. In each output, confirm the excluded item is absent and the totals recompute without it.',
    data: 'Class <FROZEN_ACTIVITY_CLASS> with one component excluded from the grade.',
    expected: 'All six report types consistently omit the excluded component and recompute their totals/averages without it. [ASSUMED]',
    remarks: 'Added 2026-09-01 from the other team\'s TC_REP_014, which sweeps the exclusion across all six types. Our TST_MRPT_TC_35 proves the option takes effect on ONE report; consistency across types was untested — and inconsistency between report types is precisely the defect this guards against. Depends on the same fixture as TST_MRPT_TC_41.',
    status: 'Blocked',
    comments: 'Blocked at design time. The frozen-activity fixture it needed NOW EXISTS (Automation_frozen_DND / gHoZ-iBXf, provisioned 2026-09-11 and used by TST_MRPT_TC_41), so the remaining blocker is narrower than it was: that class still needs ONE COMPONENT EXCLUDED from its grade settings, and activity on the excluded item. Once that is configured this case can follow TST_MRPT_TC_41 directly.',
  },

  // ---------- Added 2026-09-11 after inspecting a real downloaded report.
  {
    id: 'TST_MRPT_TC_43',
    title: 'Verify the downloaded report file is well formed and contains the right class and students',
    req: '#6 — Verify Class summary report from beginning',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Create a "Class summary" report over the fixture class and return to the Reports tab.\n'
      + '2. Wait for the new row to offer "Download", then click it.\n'
      + '3. Unzip the downloaded archive.\n'
      + '4. Open each CSV inside it and check the header row and the data rows.',
    data: 'Class: "Automation_class_DND" (z698-JPfC), 2 students: cqa_stu8sept@mailsac.com, cqa_student12jan@mailsac.com',
    expected: 'The download is a ZIP containing at least one CSV, one per product component, named "<product> <component>_<DD-MMM-YYYY>_<report type> report.csv". '
      + 'Every CSV has 19 columns beginning with the fixed identity block "First name, Last name, Email, Username, Class name, Class key, Product, Component". '
      + 'Every data row carries Class name "Automation_class_DND" and Class key "z698-JPfC". '
      + 'Each CSV holds exactly one row per enrolled student (2), and the set of Email values equals the class roster.',
    remarks: 'ADDED 2026-09-11 after a real report was downloaded and inspected — the first case in this register to look INSIDE the file. '
      + 'Until now every generation case (TST_MRPT_TC_21–TC_26, TC_28, TC_37) stopped at "a row appeared in the list", so a report generated with entirely wrong CONTENT passed all of them. '
      + 'This case closes the structural half of that gap: empty file, corrupt ZIP, wrong class, a missing student, or changed columns are all now caught. '
      + 'It does NOT reconcile the activity NUMBERS (scores, completion, time spent) — that still needs the frozen-activity fixture and remains TST_MRPT_TC_41, which stays Blocked. '
      + 'TWO THINGS ARE DELIBERATELY NOT ASSERTED: (1) the exact label of column 14, which varies by component — observed as "Best attempts above target score (Gold Medals)" on two CSVs and "Best attempts above target score" on the third; '
      + '(2) the NUMBER of CSVs, which follows the product\'s component count and would fail on a product change rather than a defect. '
      + 'Runs in the data-owning suite because a report must exist before it can be downloaded.',
  },
];

// Requirement order for the coverage map (verbatim scenario names from the source workbook).
const REQS = [
  '#1 — Verify Create Report is launching',
  '#2 — Verify search using class name or class key',
  '#3 — Verify filter',
  '#4 — Verify class selection checkbox',
  '#5 — Verify Cancel button functionality',
  '#6 — Verify Class summary report from beginning',
  '#7 — Verify Class detailed data report from beginning',
  '#8 — Verify Class daily data report from beginning',
  '#9 — Verify Aggregated data report from beginning',
  '#10 — Verify Assignments summary report from beginning',
  '#11 — Verify Assignments detailed data report from beginning',
  '#12 — Verify Custom date range reports',
  '#13 — Verify reports with custom grade settings applied',
  '#14 — Verify Estimated CEFR level report from beginning',
  '#15 — Added coverage: report generation error paths',
];

// ---------------------------------------------------------------------------------------------
// Phase 1 automation exclusions, agreed 2026-09-02.
//
// These are the cases carried as "Extra in Ours" in Admin_Gap_Analysis.xlsx — coverage we hold
// that the other team's reviewed sheet does not. None of them is automated in Phase 1; Phase 1
// scope is the cases NOT listed here.
//
// EMPTIED 2026-09-21: all ten were removed from this register (extra + not automated — see the
// register note and archive/_tcdata_before-extra-removal_2026-09-21.js). Kept as an empty list so
// _generate.js still works; a future exclusion goes back in here.
//
// Restored into the generator 2026-09-08: the marker had been hand-added to the .md/.xlsx only,
// so regenerating would have dropped it from all ten Remarks cells.
const PHASE1_EXCLUSIONS = [];

const EXCLUSION_MARKER =
  '**[EXTRA — Phase 1 exclusion]** Not present in the other team\'s reviewed sheet '
  + '(`Admin_Gap_Analysis.xlsx`, status "Extra in Ours"). **This case will NOT be automated in '
  + 'Phase 1** — exclude it from the Phase 1 automation scope; revisit for a later phase. ';

// Applied here rather than in the generator so TCS is the finished article for every consumer.
for (const tc of TCS) {
  if (PHASE1_EXCLUSIONS.includes(tc.id) && !/\[EXTRA/.test(tc.remarks || '')) {
    tc.remarks = EXCLUSION_MARKER + (tc.remarks || '');
  }
}

// ---------------------------------------------------------------------------------------------
// Automated as of 2026-09-10, across TWO suites that must stay separate.
//
//   READ-ONLY   npm run adminSchoolReportsTest_thor        12 TCs, school FCN-CHZ-PDA (testt1)
//               Creates nothing. Two of its cases open the config dialog and leave it without
//               submitting, which is the only reason they are side-effect free.
//
//   DATA-OWNING npm run adminSchoolReportsCreateTest_thor   8 TCs, school VED-NEH-KVU
//               (cqatestashish_admin). Creates 8 REAL reports per run and CANNOT delete them -
//               a successful report's only row control is Download. They expire after 60 days.
//
// ⚠️ The two run on DIFFERENT schools on purpose and must not be merged: the read-only suite
// needs FCN-CHZ-PDA's 110 classes and mixed statuses (TC_14 asserts the selection exceeds the
// rendered page; TC_9 needs a status that excludes something), and neither is possible on
// VED-NEH-KVU's 9 all-Active classes.
const AUTOMATED_READ_ONLY = [
  'TST_MRPT_TC_2', 'TST_MRPT_TC_4', 'TST_MRPT_TC_5', 'TST_MRPT_TC_6', 'TST_MRPT_TC_7',
  'TST_MRPT_TC_8', 'TST_MRPT_TC_9', 'TST_MRPT_TC_10', 'TST_MRPT_TC_11', 'TST_MRPT_TC_12',
  'TST_MRPT_TC_13', 'TST_MRPT_TC_14', 'TST_MRPT_TC_15', 'TST_MRPT_TC_16', 'TST_MRPT_TC_18',
  'TST_MRPT_TC_19', 'TST_MRPT_TC_20', 'TST_MRPT_TC_27', 'TST_MRPT_TC_31', 'TST_MRPT_TC_34',
  'TST_MRPT_TC_40',
];
const AUTOMATED_DATA_OWNING = [
  'TST_MRPT_TC_21', 'TST_MRPT_TC_22', 'TST_MRPT_TC_23', 'TST_MRPT_TC_24', 'TST_MRPT_TC_25',
  'TST_MRPT_TC_26', 'TST_MRPT_TC_28', 'TST_MRPT_TC_37', 'TST_MRPT_TC_41', 'TST_MRPT_TC_43',
];
const AUTOMATED = AUTOMATED_READ_ONLY.concat(AUTOMATED_DATA_OWNING);

for (const tc of TCS) {
  if (AUTOMATED.includes(tc.id) && tc.status !== 'Blocked') tc.status = 'Pass';
}

module.exports = {
  TCS, REQS, PHASE1_EXCLUSIONS,
  AUTOMATED, AUTOMATED_READ_ONLY, AUTOMATED_DATA_OWNING,
};
