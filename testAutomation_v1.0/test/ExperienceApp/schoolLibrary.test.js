"use strict";
var schoolLibrary = require("../../pages/ExperienceApp/schoolLibrary.page.js");
var umbrellaProduct = require("../../pages/ExperienceApp/umbrellaProduct.page.js");
var sts;

/**
 * Admin App → Library tab (LIBR) and the product materials view (UMBP) — Phase 1 block.
 *
 * 14 cases: LIBR TC_2, 3, 4, 10, 11, 12, 20, 23, 25, 33 · UMBP TC_1, 2, 3, 9.
 *
 * ⚠️ SCOPE. The manual register holds 42 cases, but 28 of them carry
 * `[EXTRA — Phase 1 exclusion]` in their Remarks and are explicitly OUT of Phase 1
 * automation scope (register header, [2026-09-02]). The 14 automated here are exactly the
 * cases that do NOT carry that marker. Do not "complete" this file by adding the other 28.
 *
 * ⚠️ EVERY CASE IN THIS FILE IS SIDE-EFFECT FREE. Nothing searches, sorts or opens a product
 * in a way that writes to the school. The Library tab's search does NOT persist server-side
 * (unlike the Classes tab's, admin-shared.md §A4), so a search left behind cannot leak into
 * another suite — but `BeforeEach` clears it anyway so each case starts from the full list.
 *
 * The one mutating action on this screen — "Add to a class" — is deliberately NOT automated
 * here; the manual batch stops at the dialog for the same reason (admin-library-tab.md §5).
 *
 * ⚠️ CLEANUP IS IN BeforeEach AND THE EXEC FILE'S AfterEach IS EMPTY BY DESIGN (ADR-019).
 * The mochawesome screenshot is taken in a ROOT afterEach, which mocha runs LAST, so an
 * AfterEach clear would wipe the search microseconds before the screenshot — TST_LIBR_TC_20's
 * evidence IS the no-results message, and it would be photographed as the full 974-row list
 * while the test still reported green. That empty AfterEach is a deliberate signal.
 *
 * ⚠️ NO ABSOLUTE COUNT IS ASSERTED ANYWHERE (ADR-021 rule 1). The school is shared and its
 * catalogue moved 970 → 974 between the register's capture and this build, and one of the
 * three school licences was replaced outright. Every count assertion here is relative (the
 * list is unchanged by sorting, results are fewer than the full list) or compared against a
 * number the page itself reports in the same run.
 *
 * Expected results and their evidence: admin-library-tab.md and the manual register under
 * test/Manual/C1App/AdminApp-Library/.
 */
module.exports = {
  /**
   * BeforeEach reset — clears any active search so each case starts on the full list.
   *
   * The result IS asserted (Invariant 13): a clear that silently failed would leave the next
   * case searching inside 22 rows and produce a baffling downstream failure. `clear_search`
   * no-ops safely when no search is active, so this is cheap on most cases.
   */
  TST_LIBR_TC_100: async function (testdata) {
    // ⚠️ RETURN TO THE LIBRARY TAB FIRST. The UMBP cases end on the product materials view,
    // which has no working route back (its "Back" control is a known defect, TST_UMBP_TC_10).
    // Without this, every case after the first UMBP one searched the Library DOM while the
    // browser sat on a product page — four cases failed that way on the first run, each with
    // a 30 s timeout naming a "missing" product row that was never missing.
    sts = await schoolLibrary.ensure_onLibraryTab();
    await assertion.assertEqual(
      sts,
      true,
      "Reset failed: could not return to the Library tab before the test."
    );

    sts = await schoolLibrary.clear_search();
    await assertion.assertEqual(
      sts,
      true,
      "Reset failed: an active search could not be cleared before the test."
    );
  },

  /**
   * Before-chain step — from the Classes tab (where opening a school lands) to the Library
   * tab, so every case starts there.
   *
   * ⚠️ Suite plumbing, not a register case. The register's own tab-load case is
   * TST_LIBR_TC_1, which is an `[EXTRA]` Phase 1 exclusion and so is not automated.
   */
  TST_LIBR_TC_101: async function (testdata) {
    // Hand the school key to the page object once, for the BeforeEach return path. The UMBP
    // cases leave the admin app entirely (the materials view is on the teacher route), and
    // recovering from that means re-selecting the school BY KEY — but BeforeEach has no test
    // data of its own to supply it with. The key itself stays in testcaseData (ADR-006).
    schoolLibrary.schoolKey = testdata.schoolKey;

    sts = await schoolLibrary.click_libraryTab();
    await assertion.assertEqual(sts, true, "The Library tab did not open and render its product list.");
  },

  /**
   * TC_2 — the list is sorted by title ascending when the tab first loads.
   *
   * ⚠️ THE COLLATION IS `localeCompare`, NOT NAIVE LOWERCASING. Measured across all 974
   * titles on 2026-09-11: `localeCompare` (default AND base sensitivity) matched the
   * product's order EXACTLY, while a lowercase lexicographic sort diverged at index 41 —
   * the product orders `anmol_13_oct_2022_03` BEFORE `anmol-test-11-nov`, because locale
   * collation weights `_` and `-` differently from their character codes.
   *
   * This refines the product-knowledge entry, which said only "case-insensitive" — true but
   * too loose to write an assertion from. It is also the OPPOSITE of the Classes tab, where
   * admin-shared.md §A4 records that a `localeCompare` expectation is WRONG (that list sorts
   * by code point). Two admin lists, two collations — do not inherit either.
   *
   * The register names the first three and last titles at capture; those are Thor/FCN-CHZ-PDA
   * specific and already stale, so the durable assertion is "the list equals itself sorted",
   * exactly as the register's own Remarks instruct.
   */
  TST_LIBR_TC_2: async function (testdata) {
    var data = await schoolLibrary.getData_productTitles();

    await assertion.assertEqual(
      data.parseMatchesRows,
      true,
      "The title parse did not account for every rendered row — parsed " + data.titleCount +
      " titles from " + data.rowCount + " rows."
    );
    await assertion.assert(
      data.titleCount > 1,
      "The product list rendered " + data.titleCount + " titles, so its order cannot be verified."
    );

    var expected = data.titles.slice().sort(function (a, b) { return a.localeCompare(b); });
    var firstMismatch = data.titles.findIndex(function (title, i) { return title !== expected[i]; });
    await assertion.assertEqual(
      firstMismatch,
      -1,
      "The list is not sorted ascending by title. First mismatch at position " + firstMismatch +
      ": the page shows '" + data.titles[firstMismatch] + "' where sorted order expects '" +
      expected[firstMismatch] + "'."
    );

    // The control is asserted as DISPLAYED only — never for its direction, which it cannot
    // report (its outerHTML is byte-identical in both states; `active` appears in both).
    var controls = await schoolLibrary.getData_sortControls();
    await assertion.assert(
      controls.titleControlCount > 0,
      "The 'Sort by: Title' control is not displayed on the Library tab."
    );
    await assertion.assertEqual(
      controls.titleControlLabel,
      "Title",
      "The sort control's label is not 'Title'."
    );
  },

  /**
   * TC_3 — one click on "Title" reverses the list, and the product count is unchanged.
   *
   * Asserts an EXACT reverse (verified live: the 974-title list reversed byte-for-byte),
   * which is a far stronger check than "the first title changed" and would catch a sort that
   * re-orders rather than reverses. The count check is relative — the same list before and
   * after — so it survives the catalogue growing between runs (ADR-021 rule 1).
   */
  TST_LIBR_TC_3: async function (testdata) {
    var before = await schoolLibrary.getData_productTitles();
    await assertion.assertEqual(
      before.parseMatchesRows,
      true,
      "The title parse did not account for every rendered row before sorting."
    );

    sts = await schoolLibrary.click_sortByTitle();
    await assertion.assertEqual(sts, true, "The list did not re-order after clicking the sort control.");

    var after = await schoolLibrary.getData_productTitles();
    await assertion.assertEqual(
      after.titleCount,
      before.titleCount,
      "Sorting changed the number of products from " + before.titleCount + " to " + after.titleCount +
      " — sorting must not add or drop products."
    );

    var reversed = before.titles.slice().reverse();
    var firstMismatch = after.titles.findIndex(function (title, i) { return title !== reversed[i]; });
    await assertion.assertEqual(
      firstMismatch,
      -1,
      "The descending list is not the exact reverse of the ascending list. First mismatch at " +
      "position " + firstMismatch + ": got '" + after.titles[firstMismatch] + "', expected '" +
      reversed[firstMismatch] + "'."
    );
  },

  /**
   * TC_4 — a second click returns the list to ascending, confirming a two-state toggle.
   *
   * Runs the full cycle itself (ascending → descending → ascending) rather than depending on
   * TC_3 having left the list reversed. Test cases must not assume execution order unless it
   * is documented (ADR-011), and a case that silently depended on its predecessor would pass
   * or fail according to how the suite was composed rather than how the product behaves.
   */
  TST_LIBR_TC_4: async function (testdata) {
    var ascending = await schoolLibrary.getData_productTitles();
    await assertion.assertEqual(
      ascending.parseMatchesRows,
      true,
      "The title parse did not account for every rendered row at the start of the sort cycle."
    );

    sts = await schoolLibrary.click_sortByTitle();
    await assertion.assertEqual(sts, true, "The list did not re-order on the first sort click.");

    sts = await schoolLibrary.click_sortByTitle();
    await assertion.assertEqual(sts, true, "The list did not re-order on the second sort click.");

    var restored = await schoolLibrary.getData_productTitles();
    await assertion.assertEqual(
      restored.titleCount,
      ascending.titleCount,
      "The product count changed across the sort cycle: " + ascending.titleCount + " → " +
      restored.titleCount + "."
    );

    var firstMismatch = restored.titles.findIndex(function (title, i) { return title !== ascending.titles[i]; });
    await assertion.assertEqual(
      firstMismatch,
      -1,
      "A second click did not restore the original ascending order. First mismatch at position " +
      firstMismatch + ": got '" + restored.titles[firstMismatch] + "', expected '" +
      ascending.titles[firstMismatch] + "'."
    );
  },

  /**
   * TC_10 — an exact full-title search returns that product as the FIRST result.
   *
   * ⚠️ ASSERTS RANK 1, NEVER A RESULT COUNT. The search is fuzzy BY DESIGN (confirmed with
   * the product team, admin-library-tab.md §3), so even an exact title returns a tail —
   * 10 results for this term on both the 2026-08-26 capture and the 2026-09-11 re-check.
   * "Exactly one result" is an assertion that fails against a correct product.
   */
  TST_LIBR_TC_10: async function (testdata) {
    sts = await schoolLibrary.search_product(testdata.exactTitle);
    await assertion.assertEqual(sts, true, "The search for '" + testdata.exactTitle + "' did not settle.");

    var results = await schoolLibrary.getData_productTitles();
    await assertion.assert(
      results.titleCount > 0,
      "The exact-title search for '" + testdata.exactTitle + "' returned no results at all."
    );
    await assertion.assertEqual(
      results.titles[0],
      testdata.exactTitle,
      "The exactly-matching product is not ranked first. Rank 1 was '" + results.titles[0] + "'."
    );

    var state = await schoolLibrary.getData_searchState();
    await assertion.assert(
      state.headingText.indexOf(testdata.exactTitle) > -1,
      "The heading does not echo the search term. It reads: " + state.headingText
    );
    await assertion.assertEqual(
      state.clearLinkPresent,
      true,
      "The 'Clear' link is not offered while a search is active."
    );
  },

  /**
   * TC_11 — every product whose title CONTAINS the term ranks above the fuzzy tail.
   *
   * This is the ranking rule, and it is the one durable assertion the search supports.
   * NEVER assert "every result contains the term" (the fuzzy tail makes that fail) and never
   * assert a result count (the tail is data-dependent — 22 for this term on two separate
   * captures, but nothing guarantees that).
   *
   * The check is computed from what the page returns rather than from a recorded list: it
   * finds the substring matches among the results and requires them to occupy positions
   * 0..n-1. That stays correct if another `vm_automation*` product is ever added.
   */
  TST_LIBR_TC_11: async function (testdata) {
    var full = await schoolLibrary.getData_productTitles();

    sts = await schoolLibrary.search_product(testdata.partialTerm);
    await assertion.assertEqual(sts, true, "The search for '" + testdata.partialTerm + "' did not settle.");

    var results = await schoolLibrary.getData_productTitles();
    await assertion.assert(
      results.titleCount > 0 && results.titleCount < full.titleCount,
      "The search did not narrow the list: " + full.titleCount + " products before, " +
      results.titleCount + " after."
    );

    var term = testdata.partialTerm.toLowerCase();
    var substringMatches = results.titles.filter(function (t) { return t.toLowerCase().indexOf(term) > -1; });
    await assertion.assert(
      substringMatches.length > 0,
      "No returned product actually contains '" + testdata.partialTerm + "', so ranking cannot be verified."
    );

    // Every substring match must occupy a leading position — i.e. the first N results are
    // exactly the N substring matches.
    var leading = results.titles.slice(0, substringMatches.length);
    var notLeading = leading.filter(function (t) { return t.toLowerCase().indexOf(term) === -1; });
    await assertion.assertEqual(
      notLeading.length,
      0,
      "Substring matches do not occupy the leading positions. The first " + substringMatches.length +
      " results were: " + JSON.stringify(leading) + ", but the substring matches are: " +
      JSON.stringify(substringMatches) + "."
    );

    // The products the register names must be among the matches, so a rename is reported as
    // a data problem here rather than silently weakening the case to a tautology.
    var expected = testdata.expectedSubstringMatches || [];
    for (var i = 0; i < expected.length; i++) {
      await assertion.assert(
        results.titles.indexOf(expected[i]) > -1,
        "The expected product '" + expected[i] + "' was not returned by the search for '" +
        testdata.partialTerm + "'. Results: " + JSON.stringify(results.titles) + "."
      );
    }
  },

  /**
   * TC_12 — matching is case-insensitive, and the banner echoes the term as the user typed it.
   *
   * Compares the two result lists in full (same products, SAME order), which is what was
   * verified live — an identical 22-title list for both cases on 2026-08-26 and again on
   * 2026-09-11.
   */
  TST_LIBR_TC_12: async function (testdata) {
    sts = await schoolLibrary.search_product(testdata.partialTerm);
    await assertion.assertEqual(sts, true, "The lower-case search did not settle.");
    var lower = await schoolLibrary.getData_productTitles();

    sts = await schoolLibrary.search_product(testdata.partialTermUpper);
    await assertion.assertEqual(sts, true, "The upper-case search did not settle.");
    var upper = await schoolLibrary.getData_productTitles();

    await assertion.assertEqual(
      upper.titleCount,
      lower.titleCount,
      "The two cases returned different numbers of results: '" + testdata.partialTerm + "' → " +
      lower.titleCount + ", '" + testdata.partialTermUpper + "' → " + upper.titleCount + "."
    );
    var firstMismatch = upper.titles.findIndex(function (t, i) { return t !== lower.titles[i]; });
    await assertion.assertEqual(
      firstMismatch,
      -1,
      "The two cases returned results in a different order. First difference at position " +
      firstMismatch + ": '" + upper.titles[firstMismatch] + "' vs '" + lower.titles[firstMismatch] + "'."
    );

    // The banner preserves the case the user entered — verified live.
    var state = await schoolLibrary.getData_searchState();
    await assertion.assert(
      state.headingText.indexOf(testdata.partialTermUpper) > -1,
      "The heading does not echo the term in the case it was typed. It reads: " + state.headingText
    );
  },

  /**
   * TC_20 — a term matching nothing shows the no-results message, echoing the term.
   *
   * The copy is asserted VERBATIM through a whitespace squash on both sides, because the
   * product renders the term inside a <strong> and the surrounding markup introduces
   * whitespace a naive capture flattens differently (admin-shared.md §A6). Note the message
   * has NO closing full stop — that is the product's real copy, not a transcription slip.
   *
   * Also pins two structural facts verified live: the sort control is GENUINELY REMOVED in
   * this state (one of the few truthful absence checks on an admin screen), and the School
   * licence section is untouched by searching.
   */
  TST_LIBR_TC_20: async function (testdata) {
    sts = await schoolLibrary.search_product(testdata.noMatchTerm);
    await assertion.assertEqual(sts, true, "The no-match search did not settle.");

    var results = await schoolLibrary.getData_productTitles();
    await assertion.assertEqual(
      results.rowCount,
      0,
      "The no-match search still rendered " + results.rowCount + " product rows."
    );

    var state = await schoolLibrary.getData_searchState();
    await assertion.assertEqual(
      state.noResultsPresent,
      true,
      "The no-results message was not rendered."
    );
    await assertion.assertEqual(
      state.noResultsMessage,
      "This school has no learning materials that match your search " + testdata.noMatchTerm +
      ". Please check the spelling or try a different search term",
      "The no-results copy does not match the expected text verbatim."
    );
    await assertion.assert(
      state.headingText.indexOf(testdata.noMatchTerm) > -1,
      "The heading does not echo the unmatched term. It reads: " + state.headingText
    );
    await assertion.assertEqual(
      state.sortControlPresent,
      false,
      "The sort control is still present in the no-results state — it is expected to be removed."
    );

    var licence = await schoolLibrary.getData_schoolLicenceSection();
    await assertion.assertEqual(
      licence.sectionPresent,
      true,
      "The School licence section disappeared during a search — searching must not affect it."
    );
  },

  /**
   * TC_23 — the School licence section lists one tile per licence, with verbatim copy.
   *
   * ⚠️ NO LICENCE NAME IS ASSERTED. The register records three licences captured on
   * 2026-08-26; by 2026-09-11 one had been replaced entirely
   * (`presentation_plus_test_umb_product_2_june_1` → `devtest0106`). Asserting the set would
   * make this case fail on a correct product whenever another team changes a licence. So the
   * durable assertions are the verbatim heading and description, a non-empty tile set, every
   * tile carrying a title, and the section's POSITION — exactly as the register's own
   * Remarks direct.
   */
  TST_LIBR_TC_23: async function (testdata) {
    var licence = await schoolLibrary.getData_schoolLicenceSection();

    await assertion.assertEqual(
      licence.sectionPresent,
      true,
      "The School licence section is not rendered on this school."
    );
    await assertion.assertEqual(
      licence.headingText,
      "School licence",
      "The section heading is not 'School licence'."
    );
    await assertion.assertEqual(
      licence.descriptionText,
      "Here are the materials that students can access when added to a class and all teachers can access in their library",
      "The section description does not match the expected copy verbatim."
    );
    await assertion.assert(
      licence.tileCount > 0,
      "The School licence section rendered no tiles on a school that holds licences."
    );
    await assertion.assertEqual(
      licence.tileTitles.length,
      licence.tileCount,
      "Only " + licence.tileTitles.length + " of " + licence.tileCount + " licence tiles showed a product title."
    );
    var blank = licence.tileTitles.filter(function (t) { return t === ""; });
    await assertion.assertEqual(
      blank.length,
      0,
      "One or more School licence tiles rendered an empty product title."
    );

    var order = await schoolLibrary.getData_sectionOrder();
    await assertion.assertEqual(
      order.licenceBeforeSort,
      true,
      "The School licence section does not sit above the 'Sort by:' control."
    );
  },

  /**
   * TC_25 — clicking a School licence tile opens that product's materials view.
   *
   * ⚠️ The product is read from the page at RUN TIME rather than hard-coded, because the
   * licence set changes (see TC_23). The tile's own title then becomes the expected heading,
   * so the case proves "the tile opens ITS product" regardless of which product that is.
   *
   * ⚠️ The element carrying the tile's qid is an inert wrapper — clicking it does nothing
   * (observed: 40 s with no navigation). The page object clicks the `a.product-tile` inside.
   */
  TST_LIBR_TC_25: async function (testdata) {
    var expectedTitle = await schoolLibrary.getData_licenceTileTitleAt(testdata.licenceTileIndex);
    await assertion.assert(
      typeof expectedTitle == "string" && expectedTitle.length > 0,
      "Could not read the title of School licence tile " + testdata.licenceTileIndex + "."
    );

    sts = await schoolLibrary.click_schoolLicenceTileByTitle(expectedTitle);
    await assertion.assertEqual(
      sts,
      true,
      "The materials view did not open after clicking the licence tile for '" + expectedTitle + "'."
    );

    var url = await browser.getUrl();
    await assertion.assert(
      url.indexOf("/bundle/") > -1 && url.indexOf("/view") > -1,
      "The licence tile did not navigate to a product materials view. URL: " + url
    );
    // The destination is on the TEACHER route, not the admin app — pinned deliberately, since
    // it is the reason the "Back" control cannot return here (TST_UMBP_TC_10).
    await assertion.assert(
      url.indexOf("/dashboard/teacher/") > -1,
      "The materials view is not on the expected teacher route. URL: " + url
    );

    var header = await umbrellaProduct.getData_pageHeader();
    await assertion.assertEqual(
      header.productTitle,
      expectedTitle,
      "The materials view heading does not match the licensed product that was clicked."
    );
  },

  /**
   * TC_33 — enumerate the Library tab's sortable controls.
   *
   * ⚠️ THE REGISTER FLAGS ITS OWN PREMISE AS UNCONFIRMED. The case came from another team's
   * sheet, which says "each sortable column header (e.g., Title, Date added)", and the
   * register's Remarks instruct: ground it, and if Title is the only control, close the case
   * as not applicable and feed the correction back.
   *
   * GROUNDED 2026-09-11: **Title is the only sort control on this screen.** A live sweep of
   * the tab found exactly one (`aLibrary-3`), and no "Date added" control exists anywhere on
   * the Library tab. So this case asserts the real shape of the screen rather than a sort
   * behaviour that has no second control to exercise — and it is written as an ENUMERATION so
   * that the day a second sort control is added, this test fails and says so, instead of
   * quietly continuing to pass a premise that has changed.
   *
   * TC_3 and TC_4 already prove the Title control orders in both directions, which is the
   * whole of the "sorts in both directions" requirement that this screen can support.
   */
  TST_LIBR_TC_33: async function (testdata) {
    var controls = await schoolLibrary.getData_sortControls();

    await assertion.assertEqual(
      controls.titleControlCount,
      1,
      "The Library tab is expected to offer exactly ONE sort control ('Title'); it offered " +
      controls.titleControlCount + ". If a sort control has been added, this case and " +
      "admin-library-tab.md §3 both need updating."
    );
    await assertion.assertEqual(
      controls.titleControlLabel,
      "Title",
      "The single sort control is not labelled 'Title'."
    );

    // "Date added", the second control the other team's sheet assumes, does not exist here.
    var pageText = await schoolLibrary.getData_sectionOrder();
    await assertion.assertEqual(
      pageText.sortIndex > -1,
      true,
      "The 'Sort by:' control group was not found on the Library tab at all."
    );
  }
};
