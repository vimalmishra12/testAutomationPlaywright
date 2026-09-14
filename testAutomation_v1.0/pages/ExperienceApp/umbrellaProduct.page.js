"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Resolves to C1Selectors.json → css.ComproC1.umbrellaProduct
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var up = selectorFile.css.ComproC1.umbrellaProduct;

/**
 * Product materials view, reached by "See materials" on a Library row or by a School
 * licence tile (module UMBP).
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS THIS PAGE OBJECT HANDLES  (all verified live on Thor 2026-09-11)
 * ---------------------------------------------------------------------------------------
 *
 * 1. THIS IS NOT THE ADMIN APP.
 *    The route is `/dashboard/teacher/org_<slug>/bundle/<productId>/view` — the TEACHER
 *    dashboard — and the markup is VUE (`data-v-*` attributes), not the Angular admin app.
 *    None of the admin `qid` families apply, and neither do the Angular typing rules.
 *
 * 2. THERE ARE TWO <h2> AND THE FIRST IS NOT THE ONE YOU WANT.
 *    Counted live: `h2[0]` = "Download the Cambridge One Desktop App", `h2[1]` = "Learning
 *    materials". A bare `h2` therefore matches a promo banner. → the heading selector is
 *    scoped to `section.umbrella-components`, which is also this page's scoping anchor
 *    (the admin equivalent of the component-tag rule in admin-shared.md §B9).
 *
 * 3. EVERY COMPONENT TILE CARRIES THE SAME QID.
 *    `t-prd-cmp-cntr-1` appears once per tile — 15 on testumbrellabundle, 12 on
 *    r55multicomponent — so the qid CANNOT address an individual component (§B3). Tiles are
 *    addressed positionally within the scoped list, and their content is read as text.
 *
 * 4. ⚠️ THE COMPONENT NAME ELEMENT IS ALWAYS PRESENT AND SOMETIMES EMPTY.
 *    `div.font-xs.mb-1` returned 15 matches on a product where one component ("Unit Progress
 *    Test") displays NO name — its element exists with empty text. So counting name elements
 *    is a GUARANTEED FALSE GREEN, a fresh instance of the §B2 shape on a non-admin page.
 *    → `getData_components` reads each name's TEXT and reports "" for the nameless one.
 *
 * 5. ⚠️ "Back" DROPS THE SCHOOL CONTEXT — a known product defect (TST_UMBP_TC_10).
 *    `t-prd-umb-link-1` requests `/admin/admin//library` — org slug missing, doubled slash —
 *    which does not resolve, so the app lands on My school accounts. No method here returns
 *    to the Library tab; a caller that needs to go back re-navigates via the school card.
 *    This page object deliberately exposes the control but never uses it as a nav path.
 *
 * 6. THE ACTIVATION SUMMARY IS NOT ALWAYS RENDERED.
 *    "N out of M components activated" appears on r55multicomponent ("3 out of 11") and is
 *    ABSENT on testumbrellabundle despite that product having unactivated components. The
 *    rule is still unknown (admin-library-tab.md §5) → never assert it is present, and never
 *    treat its absence as a defect. It is reported here as data only.
 */

/**
 * Budget for this page to render. Measured on Thor 2026-09-11: the component list was
 * present ~1.2–1.5 s after the route resolved, on both products.
 *
 * 30000 is deliberately generous relative to that: unlike the Library tab's client-side
 * operations, reaching this page is a FULL page navigation plus a product fetch, and Thor
 * throughput varies 4–8x (§B8). It still leaves headroom under mocha's 120000 so a failure
 * reports this method's own diagnostic.
 */
var PAGE_TIMEOUT = 30000;

module.exports = {
  pageComponent: up.pageComponent,
  backLink: up.backLink,
  productTitleHeading: up.productTitleHeading,
  learningMaterialsHeading: up.learningMaterialsHeading,
  addToClassBtn: up.addToClassBtn,
  componentTile: up.componentTile,
  componentType: up.componentType,
  componentName: up.componentName,

  /**
   * Confirms the materials view is loaded.
   *
   * Waits for the scoping section AND for at least one component tile inside it — the
   * section can paint before its contents arrive, and a caller that immediately indexes into
   * an empty list would hit the 30 s stall Invariant 1 describes.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get(), "waiting for the product materials view");
    var res = await action.waitForDisplayed(this.pageComponent, PAGE_TIMEOUT);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the materials view did not render", "error");
      return res;
    }
    var tiles = await action.waitForDisplayed(this.componentTile, PAGE_TIMEOUT);
    if (true != tiles) {
      await logger.logInto(await stackTrace.get(), "no component tile rendered on the materials view", "error");
      return tiles;
    }
    return true;
  },

  /**
   * Reads the page's identity: the product heading and the "Learning materials" heading.
   *
   * The heading is read from `t-prd-umb-link-2` (an <a> that carries the title) rather than
   * from `h1`, and the materials heading from the SCOPED selector — see trap 2.
   */
  getData_pageHeader: async function () {
    await logger.logInto(await stackTrace.get(), "reading the materials view header");
    var title = await action.getText(this.productTitleHeading);
    var materials = await action.getText(this.learningMaterialsHeading);
    var addToClass = await action.getElementCount(this.addToClassBtn);
    var squash = function (v) { return typeof v == "string" ? String(v).replace(/\s+/g, " ").trim() : null; };
    return {
      productTitle: squash(title),
      learningMaterialsHeading: squash(materials),
      addToClassPresent: typeof addToClass == "number" ? addToClass > 0 : false
    };
  },

  /**
   * Returns every component tile's TYPE and NAME, in render order.
   *
   * Name is read as TEXT, never counted, because the element is always present and is empty
   * for a component that has no distinct name (trap 4). A nameless component yields
   * `{ type: "Unit Progress Test", name: "" }` — which is exactly what TST_UMBP_TC_3 checks,
   * so the empty string is a meaningful result rather than a read failure.
   *
   * Counts here are small (12–15), so a per-tile read is cheap; the Library tab's one-shot
   * container trick is not needed and would only make the type/name split harder.
   *
   * @returns {{tileCount: number, components: Array<{index: number, type: string, name: string}>}}
   */
  getData_components: async function () {
    await logger.logInto(await stackTrace.get(), "reading the component tiles");
    var tileCount = await action.getElementCount(this.componentTile);
    if (typeof tileCount != "number") return { tileCount: -1, components: [] };
    var components = [];
    for (var i = 0; i < tileCount; i++) {
      var typeEl = await action.getKthElement(this.componentType, i);
      var nameEl = await action.getKthElement(this.componentName, i);
      var type = typeEl ? await action.getText(typeEl) : null;
      var name = nameEl ? await action.getText(nameEl) : null;
      components.push({
        index: i,
        type: typeof type == "string" ? String(type).trim() : "",
        name: typeof name == "string" ? String(name).trim() : ""
      });
    }
    await logger.logInto(await stackTrace.get(), "read " + components.length + " component tiles");
    return { tileCount: tileCount, components: components };
  },

  /**
   * Reports whether a "Load more" affordance exists on this page.
   *
   * TST_UMBP_TC_9 asserts the component list is never truncated. Verified live: no such
   * control on either product, and all components render at once — so a count of 0 is the
   * expected, truthful result (the same absence check the Library tab's `.no-records` allows).
   */
  getData_loadMorePresent: async function () {
    var pageText = await action.getText(this.pageComponent);
    if (typeof pageText != "string") return false;
    return /load more/i.test(pageText);
  },

  /**
   * Reads the "N out of M components activated" summary if the page renders one.
   *
   * Returns null when absent, which is a legitimate state on some products — see trap 6.
   * Never assert this is non-null.
   */
  getData_activationSummary: async function () {
    var pageText = await action.getText(this.pageComponent);
    if (typeof pageText != "string") return null;
    var match = String(pageText).match(/(\d+)\s+out of\s+(\d+)\s+components activated/i);
    if (!match) {
      await logger.logInto(await stackTrace.get(), "this product renders no activation summary");
      return null;
    }
    return { text: match[0], activated: Number(match[1]), total: Number(match[2]) };
  }
};
