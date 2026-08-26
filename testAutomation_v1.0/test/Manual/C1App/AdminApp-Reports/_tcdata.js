/**
 * Source of truth for the AdminApp Reports tab manual test-case set (module MRPT).
 * Both the .md document and the .xlsx register are generated from this file, so they
 * cannot drift (SKILL golden rule 6).
 */

const SCHOOL = 'Cqa Test Ashish School 1 (key VED-NEH-KVU)';
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
    id: 'TST_MRPT_TC_1',
    title: 'Verify the Reports tab loads with its empty state when the school has no reports',
    req: '#1 — Verify Create Report is launching',
    type: 'Positive', priority: 'High', pre: PRE_TAB,
    steps: '1. Open the school from "My school accounts".\n2. Click "REPORTS" in the school navigation.\n3. Observe the page.',
    data: '—',
    expected: 'URL is /admin/admin/org_<slug>/reports. The heading reads "Reports (0)". A "Create report" button is present. The informational line reads "Reports are available to download for up to 60 days". The empty state reads "No new reports available" above "Your reports will appear here after you create them", with a second "Create report" button.',
    remarks: 'All copy captured verbatim live 2026-08-26. The (0) count is school-specific — on a school that already holds reports this case cannot show the empty state.',
  },
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
  {
    id: 'TST_MRPT_TC_3',
    title: 'Verify the Reports tab is restored when "Go back" is used from the class-selection step',
    req: '#1 — Verify Create Report is launching',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Click the "Go back" link at the top of the class-selection step.\n2. Observe the page.',
    data: '—',
    expected: 'The app returns to /admin/admin/org_<slug>/reports, the Reports tab renders, and no new report has been created (the heading count is unchanged).',
    remarks: 'Distinct from the footer "Cancel" (TST_MRPT_TC_18) — both exit paths need covering.',
  },

  // ---------- Requirement #2
  {
    id: 'TST_MRPT_TC_4',
    title: 'Verify a class is returned when the full class name is searched',
    req: '#2 — Verify search using class name or class key',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Type "Gated LP Class" into the "Search for class name or class key" box.\n2. Click "Search".\n3. Observe the class list.',
    data: 'Search term: Gated LP Class',
    expected: 'The list narrows to the class "Gated LP Class" with key 4mG6-9Jkf, and the row remains selectable.',
    remarks: 'The search control is a text box plus an explicit "Search" button (captured live 2026-08-26). [ASSUMED] that, as on the Classes tab, typing alone does not filter and the button click is required.',
  },
  {
    id: 'TST_MRPT_TC_5',
    title: 'Verify a class is returned when its class key is searched',
    req: '#2 — Verify search using class name or class key',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Type "4mG6-9Jkf" into the search box.\n2. Click "Search".\n3. Observe the class list.',
    data: 'Search term: 4mG6-9Jkf',
    expected: 'The list narrows to the single class whose Class key column reads "4mG6-9Jkf" ("Gated LP Class").',
    remarks: 'The placeholder offers both paths — "Search for class name or class key" — so the key path is covered separately from the name path.',
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
    expected: 'A panel headed "Filter by" opens containing exactly five unticked checkboxes labelled "Not started", "Active", "Ended", "Expired" and "Deleted", plus a "Clear all" link, an "Apply" button and a "Close" control.',
    remarks: 'All strings captured verbatim live 2026-08-26. Note the status set includes "Not started", which the existing Classes-tab knowledge did not record (it listed Ended / Expired / Deleted).',
  },
  {
    id: 'TST_MRPT_TC_9',
    title: 'Verify the class list is narrowed to one status when that status filter is applied',
    req: '#3 — Verify filter',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Click "Filter".\n2. Tick "Active".\n3. Click "Apply".\n4. Observe the class list and the filter summary label.',
    data: 'Filter: Active',
    expected: 'The panel closes and every rendered row shows "Active" in its Class status column. The summary label that read "All class statuses" now reflects the applied filter instead.',
    remarks: '[ASSUMED] for the exact summary-label text after applying — only the unfiltered "All class statuses" value was captured live. All six classes on VED-NEH-KVU were Active on 2026-08-26, so this school cannot prove exclusion; use a status with both a matching and a non-matching set.',
  },
  {
    id: 'TST_MRPT_TC_10',
    title: 'Verify all status selections are cleared when "Clear all" is used',
    req: '#3 — Verify filter',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Click "Filter".\n2. Tick "Active" and "Ended".\n3. Click "Clear all".\n4. Observe the checkboxes and the class list.',
    data: 'Filter: Active + Ended, then Clear all',
    expected: 'All five status checkboxes return to unticked. [ASSUMED] the class list returns to the unfiltered set and the summary label returns to "All class statuses".',
    remarks: '[ASSUMED] — whether "Clear all" applies immediately or still requires a subsequent "Apply" was NOT determined live. This is the most likely place in this group for a wrong expected result; resolve it first.',
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
    steps: '1. Tick the "Select class" checkbox on the "Gated LP Class" row.\n2. Observe the section heading and the bottom of the page.',
    data: 'Class: "Gated LP Class" (4mG6-9Jkf), 1 student',
    expected: 'The section heading becomes "Select classes(1)". A footer bar appears reading "You have selected 1 class with a total of 1 student" and carrying a "Cancel" link and a "Continue" button.',
    remarks: 'Captured live 2026-08-26. Both the "(1)" suffix and the whole footer bar are absent at zero selection — see TST_MRPT_TC_15.',
  },
  {
    id: 'TST_MRPT_TC_14',
    title: 'Verify every listed class is selected when "Select all classes" is ticked',
    req: '#4 — Verify class selection checkbox',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Tick the "Select all classes" checkbox.\n2. Observe the row checkboxes, the section heading and the footer bar.',
    data: '6 classes on VED-NEH-KVU, 1 student each',
    expected: 'Every class row checkbox becomes ticked, the heading reads "Select classes(<N>)" where <N> is the number of listed classes, and the footer bar summarises the same totals (e.g. "You have selected 6 classes with a total of 6 students").',
    remarks: '[ASSUMED] plural wording ("classes" / "students") — only the singular "1 class" / "1 student" form was captured live. Also confirm whether "Select all" covers only the currently searched/filtered rows or every class on the school.',
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
  {
    id: 'TST_MRPT_TC_17',
    title: 'Verify the documented 1500-class selection limit is enforced when more classes are selected',
    req: '#4 — Verify class selection checkbox',
    type: 'Edge', priority: 'Low',
    pre: 'A school holding more than 1500 classes, with the class-selection step open.',
    steps: '1. Select classes until the count exceeds 1500.\n2. Observe the heading, the footer bar and the "Continue" button.',
    data: '>1500 classes',
    expected: '[ASSUMED] Selection is capped at 1500 and the product surfaces the limit it states on screen ("You can include up to 1500 classes").',
    remarks: 'BLOCKED at design time. The cap text is captured verbatim live, but VED-NEH-KVU holds only 6 classes so the cap cannot be reached. UNBLOCK: a dedicated school seeded with >1500 classes, or a product/API confirmation. Whether the cap blocks further ticks or raises a message is unknown.',
    status: 'Blocked',
    comments: 'Blocked at design time — no school available with >1500 classes.',
  },

  // ---------- Requirement #5
  {
    id: 'TST_MRPT_TC_18',
    title: 'Verify the Reports tab is restored and no report is created when "Cancel" is used on the class-selection step',
    req: '#5 — Verify Cancel button functionality',
    type: 'Positive', priority: 'High', pre: PRE_SEL,
    steps: '1. Tick one class checkbox so the footer bar appears.\n2. Click "Cancel" in the footer bar.\n3. Observe the page and the Reports list.',
    data: 'Class: "Gated LP Class" (4mG6-9Jkf)',
    expected: 'The app returns to /admin/admin/org_<slug>/reports and the Reports heading count is unchanged — no report has been created.',
    remarks: 'This is the step-1 Cancel. A SECOND, separate Cancel exists inside the "Create report" dialog (TST_MRPT_TC_19) — the two must not be conflated.',
  },
  {
    id: 'TST_MRPT_TC_19',
    title: 'Verify the report-configuration dialog closes without creating a report when its "Cancel" is used',
    req: '#5 — Verify Cancel button functionality',
    type: 'Positive', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Tick one class checkbox.\n2. Click "Continue" to open the "Create report" dialog.\n3. Choose a report type.\n4. Click "Cancel" in the dialog.\n5. Observe the page and the Reports list.',
    data: 'Class: "Gated LP Class" · Report type: "Class summary"',
    expected: '[ASSUMED] The dialog closes and the class-selection step is shown again with the class still selected; no report is created.',
    remarks: '[ASSUMED] — whether the dialog Cancel preserves the class selection, clears it, or returns all the way to the Reports tab was NOT verified live. Confirm before automating.',
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
    id: 'TST_MRPT_TC_29',
    title: 'Verify the start date cannot be set earlier than the product floor of 1 January 2022',
    req: '#12 — Verify Custom date range reports',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".\n2. Open the "From" date picker.\n3. Navigate back past January 2022.',
    data: 'Boundary: 2022-01-01',
    expected: 'Dates before 1 January 2022 are not selectable; 1 January 2022 itself is selectable.',
    remarks: 'Verified live 2026-08-26 from the field attributes: the "From" input carries min="2021-12-31T18:30:00.000Z", i.e. 2022-01-01 in IST. Exactly the kind of field constraint admin-shared.md §A3 requires be read before writing boundary cases.',
  },
  {
    id: 'TST_MRPT_TC_30',
    title: 'Verify neither date can be set later than today',
    req: '#12 — Verify Custom date range reports',
    type: 'Edge', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".\n2. Open the "From" picker and attempt to select tomorrow.\n3. Repeat for the "To" picker.',
    data: 'Boundary: today',
    expected: 'All dates after today are disabled in both pickers; today is selectable in both.',
    remarks: 'Verified live 2026-08-26: both inputs carry max="2026-08-26T18:29:59.999Z" (end of the current day). Reports cover past activity only.',
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
  {
    id: 'TST_MRPT_TC_32',
    title: 'Verify a date cannot be entered by typing because the date fields are read-only',
    req: '#12 — Verify Custom date range reports',
    type: 'Negative', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Open the "Create report" dialog, choose "Class summary" and select "Custom date range".\n2. Click into the "From" field and type "01/01/2020".\n3. Repeat for the "To" field.',
    data: 'Typed input: 01/01/2020',
    expected: 'Neither field accepts typed input; both retain their picker-set values. Dates can be set only through the calendar pickers.',
    remarks: 'Verified live 2026-08-26: both "From" and "To" inputs are readOnly. This rules out the whole family of "type an invalid date" negative cases — the pickers are the only input path.',
  },
  {
    id: 'TST_MRPT_TC_33',
    title: 'Verify the custom date-range option is unavailable for report types that do not support it',
    req: '#12 — Verify Custom date range reports',
    type: 'Negative', priority: 'High', pre: PRE_SEL,
    steps: '1. Tick one class and click "Continue".\n2. Choose report type "Assignments summary" and observe the "Date range" radios.\n3. Repeat for "Assignments detailed data".\n4. Repeat for "Estimated CEFR level".',
    data: 'Report types: Assignments summary, Assignments detailed data, Estimated CEFR level',
    expected: 'For all three types the "Custom date range" radio remains DISABLED and "From the beginning" stays selected — no "From"/"To" fields can be produced.',
    remarks: 'Verified live 2026-08-26 across all seven types. Date range is supported by exactly four (Class summary, Class detailed data, Class daily data, Aggregated data), which matches the four named in scenario #12 — the scenario list is correct, and this case pins the negative half of it.',
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
  {
    id: 'TST_MRPT_TC_36',
    title: 'Verify the custom grade-settings option is unavailable for the Estimated CEFR level report',
    req: '#13 — Verify reports with custom grade settings applied',
    type: 'Negative', priority: 'Medium', pre: PRE_SEL,
    steps: '1. Tick one class and click "Continue".\n2. Choose report type "Estimated CEFR level".\n3. Observe the "Only include items that contribute to grade calculation" checkbox.',
    data: 'Report type: Estimated CEFR level',
    expected: 'The checkbox is DISABLED and cannot be ticked.',
    remarks: 'Verified live 2026-08-26. Estimated CEFR level is the only one of the seven types supporting neither a custom date range nor custom grade settings — which is why it appears in neither scenario #12 nor #13.',
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
  {
    id: 'TST_MRPT_TC_38',
    title: 'Verify the failure dialog is shown when report generation fails',
    req: '#15 — Added coverage: report generation error paths',
    type: 'Negative', priority: 'Medium',
    pre: 'The class-selection step is open and the report-generation backend is forced to fail.',
    steps: '1. Tick one class and click "Continue".\n2. Choose any report type.\n3. Click "Submit" while report generation is failing.\n4. Observe the dialog.',
    data: '—',
    expected: 'A dialog is shown headed "Sorry, something went wrong. The report you requested was not generated." offering "Try again" and "Back to Reports".',
    remarks: 'BLOCKED at design time. The copy above was captured verbatim from the PRE-RENDERED DOM on 2026-08-26 (admin-shared.md §A6 free-capture), so the expected result is verified even though the state was never reached. UNBLOCK: backend fault injection or a stubbed failure response. A second, separate failure surface exists on the Reports tab itself — see TST_MRPT_TC_39.',
    status: 'Blocked',
    comments: 'Blocked at design time — report generation failure cannot be forced on Thor.',
  },
  {
    id: 'TST_MRPT_TC_39',
    title: 'Verify the partial-failure detail modal lists the excluded classes when a report is created with errors',
    req: '#15 — Added coverage: report generation error paths',
    type: 'Negative', priority: 'Medium',
    pre: 'The Reports tab holds a report that was generated with per-class errors.',
    steps: '1. Open the Reports tab.\n2. Open the error detail for a report created with errors.\n3. Observe the modal.',
    data: '—',
    expected: 'A modal headed "Report created with errors" states "<N> out of <TOTAL> classes were not included in your report due to the errors shown below" above a table with the columns "Class name", "Class key" and "Error message", and offers "Download report".',
    remarks: 'BLOCKED at design time. Copy captured from the pre-rendered DOM on the Reports tab 2026-08-26. Requires a multi-class report in which some classes fail — cannot be produced on demand. UNBLOCK: fault injection, or a class deliberately placed in a state that fails report generation.',
    status: 'Blocked',
    comments: 'Blocked at design time — a partially-failing report cannot be produced on Thor.',
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

module.exports = { TCS, REQS };
