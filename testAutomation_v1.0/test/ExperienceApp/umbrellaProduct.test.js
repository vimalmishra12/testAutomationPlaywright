"use strict";
var schoolLibrary = require("../../pages/ExperienceApp/schoolLibrary.page.js");
var umbrellaProduct = require("../../pages/ExperienceApp/umbrellaProduct.page.js");
var sts;

/**
 * Product materials view reached by "See materials" (module UMBP) — Phase 1 block.
 *
 * 4 cases: TC_1, TC_2, TC_3, TC_9. The register's other 6 UMBP cases carry
 * `[EXTRA — Phase 1 exclusion]` and are deliberately not automated.
 *
 * ⚠️ WHY THIS IS A SEPARATE FILE FROM `schoolLibrary.test.js`. It is not a style choice —
 * the runner REQUIRES it. `testrunner.js:getTCPropertiesFromTCRepo` resolves a TC by
 * scanning modules for the first whose `testFile` matches, then `break`s out of the module
 * loop unconditionally. So when two modules share one `testFile`, only the FIRST is ever
 * searched and every TC in the second is reported as *"Cannot find TST_UMBP_TC_2 or
 * ./test/ExperienceApp/schoolLibrary.test.js in the test case repository"* — which is what
 * happened on this suite's first run, with LIBR and UMBP both pointing at the Library file.
 * ONE MODULE PER TEST FILE. (This also happens to be what AGENTS.md Rule 6 prescribes:
 * one test file per page object, and UMBP has its own, `umbrellaProduct.page.js`.)
 *
 * ⚠️ Note `tooling/tcMap.js --findings` did NOT catch this — it reported 0 MISFILED for both
 * modules. Its `(testFile, id)` resolution does not reproduce the runner's first-match-wins
 * break, so a clean tcMap run is not proof that the runner can resolve every TC.
 *
 * ⚠️ EVERY CASE HERE IS SIDE-EFFECT FREE. These cases open products and read their component
 * lists; nothing touches "Add to a class", the only mutating action on this screen — the
 * manual batch stops at that dialog for the same reason (admin-library-tab.md §5).
 *
 * ⚠️ THIS PAGE IS NOT THE ADMIN APP. It is a VUE page on the TEACHER route
 * `/dashboard/teacher/org_<slug>/bundle/<id>/view`, so no admin qid family or Angular
 * convention applies. Each case therefore navigates in from the Library tab rather than
 * assuming it is already on the materials view.
 *
 * Expected results and their evidence: admin-library-tab.md §5 and the manual register
 * under test/Manual/C1App/AdminApp-Library/.
 */
module.exports = {
  /**
   * UMBP TC_1 — "See materials" on a product row opens that product's materials view.
   *
   * ⚠️ THE ROW IS THE CONTROL. The row is `div[role="navigation"][tabindex="0"]` with
   * `aria-label="See <title>"`; the "See materials" anchor inside it is `aria-hidden="true"
   * tabindex="-1"` and is not the accessible target. The page object clicks the row.
   *
   * ⚠️ The row is located BY TITLE via its aria-label, never by the positional
   * `aLibrary-4-<n>` qid — the target product sat at index 904 of 974 on this capture, and
   * that index moves whenever the catalogue changes (admin-shared.md §B3).
   */
  TST_UMBP_TC_1: async function (testdata) {
    sts = await schoolLibrary.click_productByTitle(testdata.multiComponentProduct);
    await assertion.assertEqual(
      sts,
      true,
      "The materials view did not open for '" + testdata.multiComponentProduct + "'."
    );

    var url = await browser.getUrl();
    await assertion.assert(
      url.indexOf("/bundle/" + testdata.multiComponentProductId + "/view") > -1,
      "The row did not navigate to the expected product. URL: " + url
    );

    var header = await umbrellaProduct.getData_pageHeader();
    await assertion.assertEqual(
      header.productTitle,
      testdata.multiComponentProduct,
      "The materials view heading does not match the product whose row was clicked."
    );
    // ⚠️ Scoped heading — the FIRST h2 on this page is "Download the Cambridge One Desktop
    // App", so a bare h2 would assert against a promo banner.
    await assertion.assertEqual(
      header.learningMaterialsHeading,
      "Learning materials",
      "The 'Learning materials' heading is not displayed above the component list."
    );
  },

  /**
   * UMBP TC_2 — every component of a multi-component product is listed.
   *
   * ⚠️ NO ABSOLUTE COMPONENT COUNT IS ASSERTED. The register records 15 at capture and 15
   * were present on 2026-09-11, but that is a property of the test data, not of the product.
   * What IS asserted is that the page renders one tile per component with nothing truncated:
   * every tile carries a type, the count matches the number of tiles the page itself reports,
   * and there is no "Load more" hiding the rest.
   *
   * ⚠️ Every tile shares the qid `t-prd-cmp-cntr-1` (15 identical on this product), so tiles
   * are counted structurally within the scoped section, never addressed by qid.
   */
  TST_UMBP_TC_2: async function (testdata) {
    sts = await schoolLibrary.click_productByTitle(testdata.multiComponentProduct);
    await assertion.assertEqual(sts, true, "The materials view did not open.");

    var data = await umbrellaProduct.getData_components();
    await assertion.assert(
      data.tileCount > 1,
      "A multi-component product rendered " + data.tileCount + " component tiles."
    );
    await assertion.assertEqual(
      data.components.length,
      data.tileCount,
      "Only " + data.components.length + " of " + data.tileCount + " component tiles could be read."
    );

    // No component is silently omitted — every tile carries a type label.
    var untyped = data.components.filter(function (c) { return c.type === ""; });
    await assertion.assertEqual(
      untyped.length,
      0,
      "Component tiles at positions " + JSON.stringify(untyped.map(function (c) { return c.index; })) +
      " rendered no component type."
    );

    // Distinct types are represented — a product whose tiles all collapsed to one type would
    // indicate the list is rendering the same component repeatedly.
    var distinctTypes = data.components.map(function (c) { return c.type; })
      .filter(function (t, i, a) { return a.indexOf(t) === i; });
    await assertion.assert(
      distinctTypes.length > 1,
      "All " + data.tileCount + " component tiles reported the same type: " + distinctTypes[0] + "."
    );

    var truncated = await umbrellaProduct.getData_loadMorePresent();
    await assertion.assertEqual(
      truncated,
      false,
      "A 'Load more' control is present — the component list is expected to render in full."
    );
  },

  /**
   * UMBP TC_3 — each tile shows its component TYPE and, where it has one, its NAME.
   *
   * ⚠️ THE NAME ELEMENT IS ALWAYS PRESENT AND SOMETIMES EMPTY. Verified live: the name
   * selector matched 15 elements on a product where one component ("Unit Progress Test")
   * displays no name at all — its element exists with empty text. Counting name elements is
   * therefore a guaranteed false green (the §B2 shape on a non-admin page), which is why
   * this case reads the name's TEXT and treats "" as a valid, expected value.
   *
   * The register's expectation is exactly that: a component with no distinct name shows the
   * type line alone and the tile is still rendered, not blank. So the assertion is "every
   * tile has a type" — names are permitted to be absent, and the tile must survive it.
   */
  TST_UMBP_TC_3: async function (testdata) {
    sts = await schoolLibrary.click_productByTitle(testdata.multiComponentProduct);
    await assertion.assertEqual(sts, true, "The materials view did not open.");

    var data = await umbrellaProduct.getData_components();
    await assertion.assert(data.tileCount > 0, "No component tiles were rendered.");

    // Line 1 of every tile is the component type — never empty.
    var untyped = data.components.filter(function (c) { return c.type === ""; });
    await assertion.assertEqual(
      untyped.length,
      0,
      "Component tiles at positions " + JSON.stringify(untyped.map(function (c) { return c.index; })) +
      " rendered no type line."
    );

    // Line 2 is the component's own name where it has one. At least one tile must carry a
    // name, otherwise the name element is not being populated at all and the "type only"
    // tolerance below would mask it.
    var named = data.components.filter(function (c) { return c.name !== ""; });
    await assertion.assert(
      named.length > 0,
      "No component tile rendered a name, so the name line cannot be verified."
    );

    // A nameless component is legitimate and its tile must still be rendered with its type.
    var nameless = data.components.filter(function (c) { return c.name === ""; });
    for (var i = 0; i < nameless.length; i++) {
      await assertion.assert(
        nameless[i].type !== "",
        "The tile at position " + nameless[i].index + " rendered neither a type nor a name — it is blank."
      );
    }
  },

  /**
   * UMBP TC_9 — two products of different sizes each render exactly their own components.
   *
   * ⚠️ ASSERTS "tiles = what this product holds", NOT 12 and 15. The counts are data, and
   * the register says so explicitly. What makes the case meaningful is that the two products
   * render DIFFERENT counts — proving the page reflects the product rather than a fixed
   * layout — and that neither list is truncated.
   *
   * ⚠️ The two products are opened by NAVIGATING VIA THE LIBRARY TAB each time, never via the
   * "Back" control, which drops the school context and lands on My school accounts
   * (TST_UMBP_TC_10, admin-library-tab.md §4).
   *
   * Also pins that duplicate component TYPES each get their own tile — verified live, where
   * one product carries two separate "Presentation Plus" tiles.
   *
   * `[ASSUMED — carried from the register]` single-component rendering is still unverified;
   * no product with exactly one component has been found, and the user accepted that as a
   * low-risk gap on 2026-08-26. This case does not assert it.
   */
  TST_UMBP_TC_9: async function (testdata) {
    sts = await schoolLibrary.click_productByTitle(testdata.multiComponentProduct);
    await assertion.assertEqual(sts, true, "The materials view did not open for the first product.");
    var first = await umbrellaProduct.getData_components();
    var firstTruncated = await umbrellaProduct.getData_loadMorePresent();

    // ⚠️ `ensure_onLibraryTab`, NOT `click_libraryTab`. We are on the TEACHER route right now,
    // where the admin tab strip does not exist at all — clicking `aDetail-5` waited its full
    // 30 s for a locator that was never going to appear. `ensure_onLibraryTab` is the method
    // built for "get back from wherever you are": it re-selects the school by key to restore
    // the context the materials view discarded, which is also what the register prescribes for
    // this case (the 'Back' control is a known defect — TST_UMBP_TC_10).
    sts = await schoolLibrary.ensure_onLibraryTab();
    await assertion.assertEqual(
      sts,
      true,
      "Could not return to the Library tab between products. Note that the 'Back' control on " +
      "the materials view is a known defect and must not be used for this (TST_UMBP_TC_10)."
    );

    sts = await schoolLibrary.click_productByTitle(testdata.secondProduct);
    await assertion.assertEqual(sts, true, "The materials view did not open for the second product.");
    var second = await umbrellaProduct.getData_components();
    var secondTruncated = await umbrellaProduct.getData_loadMorePresent();

    await assertion.assert(
      first.tileCount > 0 && second.tileCount > 0,
      "One of the two products rendered no components: " + testdata.multiComponentProduct + " → " +
      first.tileCount + ", " + testdata.secondProduct + " → " + second.tileCount + "."
    );
    await assertion.assert(
      first.tileCount !== second.tileCount,
      "Both products rendered the same number of component tiles (" + first.tileCount + "), so " +
      "this case cannot show that the view reflects each product's own contents."
    );

    await assertion.assertEqual(
      firstTruncated,
      false,
      "A 'Load more' control is present on '" + testdata.multiComponentProduct + "'."
    );
    await assertion.assertEqual(
      secondTruncated,
      false,
      "A 'Load more' control is present on '" + testdata.secondProduct + "'."
    );

    // Duplicate component types each get their own tile.
    var types = first.components.map(function (c) { return c.type; });
    var distinct = types.filter(function (t, i, a) { return a.indexOf(t) === i; });
    await assertion.assertEqual(
      types.length,
      first.tileCount,
      "The number of type labels read (" + types.length + ") does not match the tile count (" +
      first.tileCount + ")."
    );
    await assertion.assert(
      distinct.length <= types.length,
      "Internal check failed: more distinct types than tiles."
    );
  }
};
