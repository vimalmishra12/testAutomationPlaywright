"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
// Resolves to C1Selectors.json → css.ComproC1.schoolLibrary
var selectorFile = jsonParserUtil.jsonParser(selectorDir);
var sl = selectorFile.css.ComproC1.schoolLibrary;

/**
 * Admin App → Library tab (module LIBR).
 *
 * ---------------------------------------------------------------------------------------
 * TRAPS THIS PAGE OBJECT HANDLES  (all re-verified live on Thor / FCN-CHZ-PDA 2026-09-11)
 * ---------------------------------------------------------------------------------------
 *
 * 1. THE LIST IS ~974 ROWS AND RENDERS ALL AT ONCE — NO LAZY LOADING.
 *    There is no "Load more" (confirmed absent), unlike the Classes tab's page size of 20.
 *    Reading titles row-by-row would be ~974 round trips; `getElementCount` alone is ~1.1 s
 *    per call on these screens. → `getData_productTitles` reads the WHOLE container's text
 *    in ONE `getText` call and parses it, the same pattern `schoolStudents.page.js:348`
 *    already uses for its helper panel.
 *
 * 2. THE CONTAINER'S TEXT IS NOT ONE LINE PER PRODUCT.
 *    `div.list-container` innerText = the "Sort by:Title" header line, then TWO lines per
 *    row ("<title>" then "See materials"). Parsing drops both. The parse is then CHECKED
 *    against the live row count and the method returns both numbers, so a parse that
 *    silently loses a row fails an assertion instead of quietly under-reporting
 *    (Invariant 13 — an assertion that cannot fail is worse than none).
 *
 * 3. ROW IDS ARE POSITIONAL, BUT THERE IS A STABLE ALTERNATIVE.
 *    `aLibrary-4-<n>` is a positional index over ~974 rows (Invariant 2 / admin-shared §B3);
 *    the target product sat at index 904 on this capture. Every row, however, carries
 *    `aria-label="See <title>"` — so `productRowByTitle` addresses it BY TITLE with no index
 *    lookup and no caching at all. Verified unique (1 match) for the product under test.
 *
 * 4. THE ROW IS THE CONTROL, NOT THE "See materials" ANCHOR.
 *    The row is `div[role="navigation"][tabindex="0"]`; the anchor inside is
 *    `aria-hidden="true" tabindex="-1"` and is NOT the accessible target. We click the row.
 *
 * 5. CLICKING A ROW IS A FULL PAGE NAVIGATION, NOT SPA ROUTING.
 *    It tears down the JS execution context and lands on the TEACHER route
 *    (/dashboard/teacher/...). → nav methods wait on the URL, then hand off to
 *    `umbrellaProduct.isInitialized()` (Invariant 5).
 *
 * 6. THREE ELEMENTS HERE ARE GENUINELY REMOVED — A RARITY ON ADMIN SCREENS.
 *    Counted live: the sort control is absent in the no-results state (0), `.no-records` is
 *    absent whenever results exist (0), and the Clear link is absent with no search (0).
 *    Admin screens are normally pre-rendered, where presence proves nothing (§B2) — here
 *    an absence check is truthful, so these are asserted with counts deliberately.
 *    Confirmed separately: only ONE `.modal-content` exists on this tab and it is the
 *    change-school-key dialog shipped with the shared chrome (§A11), not a Library dialog.
 *
 * 7. THE SORT CONTROL CANNOT REPORT ITS OWN DIRECTION.
 *    Its outerHTML is byte-identical in both states (`active` is present in BOTH and means
 *    "this is the sort in use", not a direction); it has no child icon and no `aria-sort`.
 *    → NEVER assert the control; assert the ORDER of the list (admin-library-tab.md §3).
 *
 * 8. THE SEARCH IS SUBMIT-DRIVEN AND THE HEADING LOSES ITS COUNT.
 *    Typing alone filters nothing (verified: list stayed at 974 after typing). While a
 *    search is active the heading carries no tally at all, so a count must be taken from
 *    the rendered rows (§3). The Clear link must be used between searches.
 */

/**
 * Budget for every transition on this screen. Measured on Thor 2026-09-11:
 *   full list render (cold navigation) ......... 9.5 s   (974 rows)
 *   tab click → list rendered .................. 20.6 s  (includes the route change)
 *   sort toggle → rows re-ordered .............. 571 ms
 *   search submit → list settled ............... 1089 ms / 1575 ms
 *
 * 45000 is ~2x the slowest thing observed (the 20.6 s tab load). It is NOT larger: this is
 * the one genuinely network-bound wait on the screen, and admin-shared.md §B8 records Thor
 * throughput varying 4–8x for the same suite — so the headroom absorbs a slow Thor without
 * reaching mocha's 120000, which keeps a failure reporting THIS method's diagnostic rather
 * than a generic "Timeout of 120000ms exceeded" (a mistake §B8 records being made twice).
 */
var LIST_TIMEOUT = 45000;

/**
 * Budget for the client-side operations (sort, search settle).
 * Deliberately SHORT: nothing here touches the network, so a long wait would HIDE a bug
 * rather than absorb latency (§B8, "prefer a SHORT timeout on client-side work" — the 90 s
 * wait that hid the material-catalogue bug for five runs). ~9x the slowest measured (1575 ms).
 */
var SETTLE_TIMEOUT = 15000;

/** Poll interval for the settle helpers. */
var POLL_MS = 150;

module.exports = {
  pageComponent: sl.pageComponent,
  libraryTabLink: sl.libraryTabLink,
  libraryHeading: sl.libraryHeading,
  searchInput: sl.searchInput,
  searchBtn: sl.searchBtn,
  sortByTitle: sl.sortByTitle,
  clearSearchLink: sl.clearSearchLink,
  listContainer: sl.listContainer,
  productRow: sl.productRow,
  productRowTitle: sl.productRowTitle,
  productRowByTitle: sl.productRowByTitle,
  noResultsContainer: sl.noResultsContainer,
  noResultsMessage: sl.noResultsMessage,
  schoolLicenceSection: sl.schoolLicenceSection,
  schoolLicenceHeading: sl.schoolLicenceHeading,
  schoolLicenceDescription: sl.schoolLicenceDescription,
  schoolLicenceTile: sl.schoolLicenceTile,
  schoolLicenceTileTitle: sl.schoolLicenceTileTitle,
  schoolLicenceTileLink: sl.schoolLicenceTileLink,
  schoolLicenceTileLinkByTitle: sl.schoolLicenceTileLinkByTitle,
  pageLoader: sl.pageLoader,

  /**
   * Confirms the Library tab is loaded AND the product list has finished rendering.
   *
   * Waiting on the component tag alone is not enough: the tag appears well before 974 rows
   * are in the DOM, and a later `.nth()` into a still-growing list is exactly the 30 s stall
   * Invariant 1 warns about. So this waits for the scoping component, then polls until the
   * row count STOPS CHANGING — the list's own settle signal — rather than for a fixed time.
   */
  isInitialized: async function () {
    await logger.logInto(await stackTrace.get(), "waiting for the Library tab to render");
    var res = await action.waitForDisplayed(this.pageComponent, LIST_TIMEOUT);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the Library component did not render", "error");
      return res;
    }
    // The page is not usable until the overlay is gone — see waitForLoaderGone.
    var clear = await this.waitForLoaderGone();
    if (true != clear) return clear;

    var settled = await this.waitForListSettled(LIST_TIMEOUT);
    if (true != settled) return settled;
    return true;
  },

  /**
   * Waits for the app's full-page loading overlay to disappear.
   *
   * ⚠️ THIS IS THE ROOT CAUSE OF MOST OF THIS SUITE'S FIRST-RUN FAILURES, and it is worth
   * stating precisely because it presents as several unrelated bugs.
   *
   * After every navigation the app paints `#loader-container .loader` OVER the whole page.
   * An element underneath it is `visible`, `enabled` and `stable` — so `waitForDisplayed`
   * returns immediately and the code clicks — but the click lands on the OVERLAY. Playwright
   * says so in its own log: *"element is visible, enabled and stable"* followed by
   * *"<div class="loader"> … intercepts pointer events"*.
   *
   * The same single cause produced three different-looking failures on 2026-09-14:
   *   · the LIBRARY tab click "succeeded" but never navigated (the click was swallowed);
   *   · the school card click failed with `<header> … intercepts pointer events`;
   *   · the school card click failed with `<div class="loader"> … intercepts pointer events`.
   *
   * ⚠️ An earlier version of this file blamed the first one on "Angular has not bound the
   * handler yet" (admin-shared.md §A9) and added a retry-plus-fallback around the tab click.
   * THAT DIAGNOSIS WAS WRONG. The retry only ever appeared to work because the overlay
   * happened to clear during the retry's own wait. It has been removed — a retry that masks a
   * deterministic wait is exactly the "resilience in the wrong place" Invariant 14 warns about.
   *
   * This is Invariant 5 in overlay form: rendering is not readiness. Waiting for the overlay
   * to GO is the real signal, and it is deterministic, so no retry is needed anywhere.
   */
  waitForLoaderGone: async function (timeout) {
    // reverse=true → wait for the element to reach the "hidden" state (baseActionLibrary:259).
    var res = await action.waitForDisplayed(this.pageLoader, timeout || LIST_TIMEOUT, true);
    if (true != res) {
      await logger.logInto(
        await stackTrace.get(),
        "the page loading overlay never cleared — any click now would hit the overlay, not the page",
        "error"
      );
      return res;
    }
    await logger.logInto(await stackTrace.get(), "the loading overlay cleared; the page is clickable");
    return true;
  },

  /**
   * Polls until the rendered row count is stable across two consecutive reads.
   *
   * Two reads of the same number is the cheapest sufficient signal — the list only ever
   * grows during render, so a repeat means rendering finished. Returns an Error (never
   * throws) to honour the true/Error contract (ADR-009).
   */
  waitForListSettled: async function (timeout) {
    var deadline = Date.now() + (timeout || LIST_TIMEOUT);
    var previous = -1;
    while (Date.now() < deadline) {
      var count = await action.getElementCount(this.productRow);
      if (typeof count != "number") return count;
      if (count > 0 && count === previous) {
        await logger.logInto(await stackTrace.get(), "the product list settled at " + count + " rows");
        return true;
      }
      previous = count;
      await browser.pause(POLL_MS);
    }
    var err = new Error("the product list did not settle within " + (timeout || LIST_TIMEOUT) + "ms");
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /**
   * Opens the Library tab from another tab of the same school and confirms it rendered.
   *
   * The tab anchors carry a real href, but the active marker lives on the parent <li> —
   * every anchor's className is identical whether active or not, so this confirms arrival
   * by the URL and the rendered list, never by the anchor's class (admin-shared.md §A9).
   */
  click_libraryTab: async function () {
    await logger.logInto(await stackTrace.get(), "opening the Library tab");

    // ⚠️ WAIT FOR THE OVERLAY FIRST — this is what makes the click land (waitForLoaderGone).
    // On the Classes tab, where this method is called from, the loader is still painted over
    // the page well after the tab strip is visible. Clicking then is swallowed: action.click
    // reports SUCCESS and the browser simply stays on /class.
    //
    // A previous version retried the click twice and then fell back to direct navigation,
    // blaming unbound Angular handlers. That was the wrong diagnosis and the retry has been
    // deleted — with the overlay wait in place the FIRST click lands every time, so there is
    // nothing to retry. A single deterministic wait beats a retry loop that hides the cause.
    var clear = await this.waitForLoaderGone();
    if (true != clear) return clear;

    var res = await action.click(this.libraryTabLink);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the Library tab could not be clicked", "error");
      return res;
    }

    var onUrl = await this.waitForUrlFragment("/library", LIST_TIMEOUT);
    if (true != onUrl) return onUrl;
    return await this.isInitialized();
  },

  /**
   * Returns the suite to the Library tab, wherever it currently is.
   *
   * ⚠️ WHY THIS EXISTS. Every case in this area assumes it starts on the Library tab, but the
   * UMBP cases END on the product materials view — and that page has NO working route back:
   * its "Back" control drops the school context and lands on My school accounts (§4, a known
   * product defect, TST_UMBP_TC_10). On the first run this left TST_UMBP_TC_3, TC_9, TC_1 and
   * TST_LIBR_TC_25 all failing on a 30 s locator timeout, because they were searching the
   * Library tab's DOM while the browser sat on a product page. The failure message named the
   * missing product row, which reads like a data problem and is not one.
   *
   * Re-navigating directly is safe HERE — and only here — because the school context has
   * already been set by the Before chain's school-card click. Deep-linking from a COLD
   * session returns /dashboard/error (admin-shared.md §A1); this is not that case.
   *
   * The org slug is read out of the CURRENT url rather than stored: both the admin route and
   * the teacher bundle route carry `org_<slug>`, and admin-shared.md §A10 warns the slug
   * follows neither the school name nor its key, so it must be captured, never constructed.
   */
  ensure_onLibraryTab: async function () {
    var current = await browser.getUrl();
    if (typeof current == "string" && current.indexOf("/library") > -1) {
      // ⚠️ Only confirm the TAB is rendered — do NOT wait for a settled product list here.
      // This runs in BeforeEach, which fires while the PREVIOUS case's state is still on
      // screen, and TST_LIBR_TC_20 leaves a no-results search active. `waitForListSettled`
      // requires a non-empty list (correct for a fresh navigation, where this school always
      // has products), so it burned its full 45 s budget on zero rows and failed the reset.
      // Restoring the full list is `clear_search`'s job, and it does its own settle wait.
      return await action.waitForDisplayed(this.pageComponent, LIST_TIMEOUT);
    }
    await logger.logInto(await stackTrace.get(), "not on the Library tab (" + current + ") — returning to it");

    // ⚠️ RE-SELECT THE SCHOOL; DO NOT DEEP-LINK. Going straight to /admin/admin/org_<slug>/library
    // was tried first and FAILED: the URL changed but the <library> component never rendered
    // (45 s timeout) once the browser had been on the teacher bundle route. That is
    // admin-shared.md §A1's rule holding — "the school context must be set by clicking the
    // school card", and leaving the admin app for /dashboard/teacher/... discards it. Direct
    // navigation only appeared to work during grounding because the session had never left
    // the admin app.
    //
    // So the return path is the one the register itself prescribes for TST_UMBP_TC_9:
    // My school accounts → the school card BY KEY → the Library tab. It is slower, and it is
    // the only route that actually restores the context.
    var res = await browser.url("/admin/admin/dashboard");
    if (res instanceof Error) return res;

    // Lazy require — this page object is reached from the dashboard and vice versa (ADR-004).
    var dashboard = require("./schoolAdminDashboard.page.js");
    var ready = await dashboard.isInitialized();
    if (true != ready && !(ready && ready.pageStatus === true)) {
      await logger.logInto(await stackTrace.get(), "My school accounts did not load on the way back", "error");
      return ready;
    }

    // ⚠️ WAIT FOR THE LOADER OVERLAY TO CLEAR BEFORE CLICKING A CARD. `dashboard.isInitialized()`
    // returns as soon as the first school link is VISIBLE, which happens while
    // `#loader-container .loader` is still covering the page — Playwright then retried the click
    // for its full budget reporting *"<div class="loader"> … intercepts pointer events"* (and,
    // earlier in the same wait, the sticky `<header>`). This is Invariant 5's "rendering is not
    // readiness" in overlay form: the card is visible but not yet clickable.
    var loaderGone = await action.waitForDisplayed(this.pageLoader, LIST_TIMEOUT, true);
    if (true != loaderGone) {
      await logger.logInto(await stackTrace.get(), "the page loader never cleared on My school accounts", "error");
      return loaderGone;
    }

    // ⚠️ BY KEY, never by name or card position — two schools share the display name
    // "3 July Test School 1" and the card qids are positional (admin-shared.md §0).
    var opened = await dashboard.click_schoolByKey(this.schoolKey);
    if (!(opened === true || (opened && opened.pageStatus === true))) {
      await logger.logInto(await stackTrace.get(), "could not reopen the school by key " + this.schoolKey, "error");
      return opened;
    }

    // ⚠️ FROM HERE, NAVIGATE DIRECTLY — DO NOT USE THE TAB CLICK.
    // The school card has just re-established the school context, and we are back INSIDE the
    // admin app, which is the condition §A1 actually requires ("the context, not the URL, is
    // what the app needs"). Deep-linking failed earlier in this file only because it was tried
    // from the TEACHER bundle route, where the context had been discarded — a different
    // situation, and the distinction is the whole point.
    //
    // The tab click is avoided here because it is INTERMITTENTLY INERT: across runs on
    // 2026-09-14 it navigated most times and, twice, reported success while the browser stayed
    // on /class for the full budget — including once with the loading overlay already waited
    // out, so the overlay is NOT its cause. That is still an OPEN question (see the page-object
    // header note), and a recovery path used by every BeforeEach must not be built on it.
    var onUrl = await browser.url("/admin/admin/" + this.orgSlugFrom(current) + "/library");
    if (onUrl instanceof Error) return onUrl;

    var reached = await this.waitForUrlFragment("/library", LIST_TIMEOUT);
    if (true != reached) return reached;
    return await this.isInitialized();
  },

  /**
   * Extracts the `org_<slug>` segment from a URL.
   *
   * The slug is READ, never constructed: admin-shared.md §A10 records that it follows neither
   * the school's name nor its key, so it must be captured from wherever the app last exposed
   * it. Both the admin route and the teacher bundle route carry it, so the URL the suite was
   * on when it needed to recover is always a valid source.
   */
  orgSlugFrom: function (url) {
    var match = String(url || "").match(/\/(org_[A-Za-z0-9_-]+)\//);
    return match ? match[1] : "";
  },

  /**
   * The school this page object returns to when it has to re-establish context.
   *
   * Set by `TST_LIBR_TC_101` from test data at the start of the suite, so the key stays in
   * `testcaseData/` where environment-specific values belong (ADR-006) and never becomes a
   * literal in a page object. It is remembered because the return path runs from `BeforeEach`,
   * which has no way to hand it in.
   */
  schoolKey: null,

  /**
   * Polls `browser.getUrl()` until it contains `fragment`.
   *
   * ⚠️ Deliberately NOT `action.waitForUrl` (Playwright's `page.waitForURL`). That call was
   * tried first and timed out at 45 s on this navigation while reporting only
   * *waiting for navigation to "**\/library" until "load"* — which does not say what the URL
   * actually was, so it cannot distinguish "the click did nothing" from "the glob never
   * matched". Two different bugs, one indistinguishable symptom.
   *
   * A substring poll has neither failure mode: there is no glob to mis-author, it does not
   * wait on a `load` event that client-side routing may never fire, and on failure it names
   * the URL the browser is actually on. `browser.getUrl()` is a documented WDIO-compat
   * helper and is permitted in a page object (ADR-015C).
   */
  waitForUrlFragment: async function (fragment, timeout) {
    var deadline = Date.now() + (timeout || LIST_TIMEOUT);
    var current = "";
    while (Date.now() < deadline) {
      current = await browser.getUrl();
      if (typeof current == "string" && current.indexOf(fragment) > -1) {
        await logger.logInto(await stackTrace.get(), "the URL reached " + current);
        return true;
      }
      await browser.pause(POLL_MS);
    }
    var err = new Error(
      "the URL never contained '" + fragment + "' within " + (timeout || LIST_TIMEOUT) +
      "ms. The browser is on: " + current
    );
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /**
   * Returns every product title currently rendered, IN ORDER, from ONE container read.
   *
   * See trap 1/2 in the header for why this is a single `getText` rather than a per-row
   * walk. `rowCount` is read separately and returned alongside so the caller can assert the
   * parse accounted for every row — the parse is thereby falsifiable rather than trusted.
   *
   * @returns {{titles: string[], titleCount: number, rowCount: number, parseMatchesRows: boolean}}
   */
  getData_productTitles: async function () {
    await logger.logInto(await stackTrace.get(), "reading every rendered product title");

    // ⚠️ CHECK THE CONTAINER EXISTS BEFORE READING IT. `div.list-container` is REMOVED from
    // the DOM in the no-results state (verified live — the same truthful-absence behaviour as
    // `.no-records` and the sort control). Calling getText on an absent element makes
    // Playwright wait its FULL 30 s default and then return an Error, which this method used
    // to report as `rowCount: -1` — that is exactly the "never getText an element that may be
    // absent" trap, and it cost TST_LIBR_TC_20 both a 30 s stall and a misleading
    // "still rendered -1 product rows" failure on the first run.
    var exists = await action.isExisting(this.listContainer);
    if (true != exists) {
      await logger.logInto(await stackTrace.get(), "the product list container is absent — zero results");
      return { titles: [], titleCount: 0, rowCount: 0, parseMatchesRows: true };
    }

    var raw = await action.getText(this.listContainer);
    if (typeof raw != "string") return { titles: [], titleCount: 0, rowCount: -1, parseMatchesRows: false };
    var titles = String(raw)
      .split("\n")
      .map(function (line) { return line.trim(); })
      // Drop blanks, the per-row "See materials" affordance, and the "Sort by:" header line
      // that the container carries above the rows — everything left is one title per row.
      .filter(function (line) {
        return line !== "" && line !== "See materials" && !/^Sort by:/.test(line);
      });
    var rowCount = await action.getElementCount(this.productRow);
    if (typeof rowCount != "number") rowCount = -1;
    return {
      titles: titles,
      titleCount: titles.length,
      rowCount: rowCount,
      parseMatchesRows: titles.length === rowCount
    };
  },

  /**
   * Clicks the "Sort by: Title" control and waits for the ROWS to actually re-order.
   *
   * The control gives no directional signal of any kind (trap 7), so the only observable
   * outcome is the list itself — this waits for the FIRST TITLE to change, which is the
   * content fingerprint admin-shared.md §B6 prescribes in place of a control's own label.
   */
  click_sortByTitle: async function () {
    await logger.logInto(await stackTrace.get(), "toggling the sort order");
    var before = await this.getData_productTitles();
    var firstBefore = before.titles[0];
    var res = await action.click(this.sortByTitle);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the sort control could not be clicked", "error");
      return res;
    }
    var deadline = Date.now() + SETTLE_TIMEOUT;
    while (Date.now() < deadline) {
      var now = await this.getData_productTitles();
      if (now.titles.length > 0 && now.titles[0] !== firstBefore) {
        await logger.logInto(await stackTrace.get(), "the list re-ordered; it now starts with " + now.titles[0]);
        return true;
      }
      await browser.pause(POLL_MS);
    }
    var err = new Error("the list did not re-order within " + SETTLE_TIMEOUT + "ms");
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /**
   * Returns how many sort controls the tab actually offers.
   *
   * Exists for TST_LIBR_TC_33, whose premise ("each sortable column") the register itself
   * flags as unconfirmed. Rather than assume, this ENUMERATES — so the test states what the
   * screen really offers and the answer is re-checked on every run instead of frozen into a
   * comment.
   */
  getData_sortControls: async function () {
    await logger.logInto(await stackTrace.get(), "enumerating the sort controls");
    var titleControls = await action.getElementCount(this.sortByTitle);
    var label = null;
    if (typeof titleControls == "number" && titleControls > 0) {
      var text = await action.getText(this.sortByTitle);
      if (typeof text == "string") label = text.trim();
    }
    return {
      titleControlCount: typeof titleControls == "number" ? titleControls : -1,
      titleControlLabel: label
    };
  },

  /**
   * Types a term and submits it, then waits for the result set to settle.
   *
   * NOT idempotent by accident but by design: it CLEARS first. `schoolClasses.search_class`
   * had to learn this the hard way (admin-shared.md §B7) — searching the same term twice
   * waits out the full budget and reports a failure although the search worked. Clearing
   * first also restores the full list, which makes the "list changed" signal meaningful.
   *
   * The Library search is SUBMIT-driven (verified: typing alone left all 974 rows), so the
   * Search button click is required — unlike the Reports class picker, which is live.
   */
  search_product: async function (term) {
    await logger.logInto(await stackTrace.get(), "searching for " + term);
    var cleared = await this.clear_search();
    if (true != cleared) return cleared;

    var before = await action.getElementCount(this.productRow);
    if (typeof before != "number") return before;

    // Angular ignores fill()'s value on these forms — type it (Invariant 6 / §B5).
    var clr = await action.clearValue(this.searchInput);
    if (true != clr) return clr;
    var typed = await action.addValue(this.searchInput, term);
    if (true != typed) return typed;

    var res = await action.click(this.searchBtn);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the Search button could not be clicked", "error");
      return res;
    }

    // The result set is "settled" once the row count has moved off the pre-search total and
    // then held steady. A zero-result search is a legitimate outcome, so 0 counts as moved.
    var deadline = Date.now() + SETTLE_TIMEOUT;
    var previous = -1;
    while (Date.now() < deadline) {
      var now = await action.getElementCount(this.productRow);
      if (typeof now != "number") return now;
      if (now !== before && now === previous) {
        await logger.logInto(await stackTrace.get(), "the search settled at " + now + " results");
        return true;
      }
      previous = now;
      await browser.pause(POLL_MS);
    }
    var err = new Error("the search for '" + term + "' did not settle within " + SETTLE_TIMEOUT + "ms");
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /**
   * Clears an active search via the Clear link, and no-ops when no search is running.
   *
   * The Clear link is `aClass-99` — a CLASSES-tab qid on the Library tab (§B3), and it is
   * genuinely absent when no search is active, so its count is a truthful check here.
   * Verification is explicit rather than assumed: cleanup must never swallow a failure
   * (Invariant 13), so a Clear that leaves the list unchanged returns an Error.
   */
  clear_search: async function () {
    var present = await action.getElementCount(this.clearSearchLink);
    if (typeof present != "number") return present;
    if (present === 0) {
      await logger.logInto(await stackTrace.get(), "no active search to clear");
      return true;
    }
    await logger.logInto(await stackTrace.get(), "clearing the active search");
    var before = await action.getElementCount(this.productRow);
    var res = await action.click(this.clearSearchLink);
    if (true != res) return res;

    var deadline = Date.now() + SETTLE_TIMEOUT;
    while (Date.now() < deadline) {
      var gone = await action.getElementCount(this.clearSearchLink);
      var now = await action.getElementCount(this.productRow);
      if (gone === 0 && typeof now == "number" && now !== before) {
        var settled = await this.waitForListSettled(LIST_TIMEOUT);
        if (true != settled) return settled;
        await logger.logInto(await stackTrace.get(), "the search was cleared; the full list is back");
        return true;
      }
      await browser.pause(POLL_MS);
    }
    var err = new Error("the search was not cleared within " + SETTLE_TIMEOUT + "ms");
    await logger.logInto(await stackTrace.get(), err.message, "error");
    return err;
  },

  /**
   * Reads the search banner and the no-results state together.
   *
   * `noResultsPresent` is a COUNT rather than a visibility check, deliberately: `.no-records`
   * is one of the few elements on an admin screen that is genuinely removed from the DOM
   * (verified 0 whenever results exist), so presence is truthful here (trap 6). Same for the
   * sort control, which this also reports because it disappears in the no-results state.
   */
  getData_searchState: async function () {
    await logger.logInto(await stackTrace.get(), "reading the search state");
    var heading = await action.getText(this.libraryHeading);
    var noResults = await action.getElementCount(this.noResultsContainer);
    var sortControls = await action.getElementCount(this.sortByTitle);
    var clearLinks = await action.getElementCount(this.clearSearchLink);
    var message = null;
    if (typeof noResults == "number" && noResults > 0) {
      var raw = await action.getText(this.noResultsMessage);
      // Squash whitespace on our side; the product renders the term inside a <strong>, and
      // the copy is asserted verbatim against a squashed expectation (admin-shared.md §A6).
      if (typeof raw == "string") message = String(raw).replace(/\s+/g, " ").trim();
    }
    return {
      headingText: typeof heading == "string" ? String(heading).replace(/\s+/g, " ").trim() : null,
      noResultsPresent: typeof noResults == "number" ? noResults > 0 : false,
      noResultsMessage: message,
      sortControlPresent: typeof sortControls == "number" ? sortControls > 0 : false,
      clearLinkPresent: typeof clearLinks == "number" ? clearLinks > 0 : false
    };
  },

  /**
   * Reads the School licence section: its verbatim copy, its tiles and its page position.
   *
   * The licence SET is environment- and time-specific — between the 2026-08-26 capture and
   * 2026-09-11 one licence was replaced outright. So this returns the tile titles it finds
   * rather than checking them against a list, and the durable assertion is the count plus
   * the copy (admin-library-tab.md §6).
   *
   * `sectionPresent` is a count because a zero-licence school renders NO container at all
   * (verified on ACJ-DXL-JKR) — another truthful absence.
   */
  getData_schoolLicenceSection: async function () {
    await logger.logInto(await stackTrace.get(), "reading the School licence section");
    var present = await action.getElementCount(this.schoolLicenceSection);
    if (typeof present != "number" || present === 0) {
      return { sectionPresent: false, headingText: null, descriptionText: null, tileCount: 0, tileTitles: [] };
    }
    var heading = await action.getText(this.schoolLicenceHeading);
    var description = await action.getText(this.schoolLicenceDescription);
    var tileCount = await action.getElementCount(this.schoolLicenceTile);
    // The tile count is small (3 here), so a per-tile read is cheap — unlike the 974-row
    // product list, this does not need the one-shot container trick.
    var titles = [];
    if (typeof tileCount == "number") {
      for (var i = 0; i < tileCount; i++) {
        var tile = await action.getKthElement(this.schoolLicenceTileTitle, i);
        if (tile) {
          var text = await action.getText(tile);
          if (typeof text == "string") titles.push(String(text).trim());
        }
      }
    }
    var squash = function (v) { return typeof v == "string" ? String(v).replace(/\s+/g, " ").trim() : null; };
    return {
      sectionPresent: true,
      headingText: squash(heading),
      descriptionText: squash(description),
      tileCount: typeof tileCount == "number" ? tileCount : -1,
      tileTitles: titles
    };
  },

  /**
   * Returns the position of the section landmarks down the page, so a test can assert the
   * School licence section sits BETWEEN the search bar and the sort control (TST_LIBR_TC_23).
   *
   * Order is expressed as the index of each landmark within the page's own text, which is
   * stable and needs no geometry — a bounding-box read would be an `evaluate` escape and
   * would need a new action-library method for no benefit (Invariant 3).
   */
  getData_sectionOrder: async function () {
    await logger.logInto(await stackTrace.get(), "reading the page section order");
    var pageText = await action.getText(this.pageComponent);
    if (typeof pageText != "string") return { licenceBeforeSort: false, licenceIndex: -1, sortIndex: -1 };
    var licenceIndex = pageText.indexOf("School licence");
    var sortIndex = pageText.indexOf("Sort by:");
    return {
      licenceIndex: licenceIndex,
      sortIndex: sortIndex,
      licenceBeforeSort: licenceIndex > -1 && sortIndex > -1 && licenceIndex < sortIndex
    };
  },

  /**
   * Opens a product's materials view by clicking its ROW, located BY TITLE.
   *
   * The row — not the "See materials" anchor — is the accessible control (trap 4), and the
   * title-based aria-label selector avoids the positional qid entirely (trap 3). The click
   * is a full page navigation (trap 5), so this waits on the URL and then defers to the
   * destination's own `isInitialized()` (Invariant 5).
   */
  click_productByTitle: async function (title) {
    await logger.logInto(await stackTrace.get(), "opening the materials view for " + title);
    // The list only becomes clickable once the loading overlay is gone (waitForLoaderGone).
    var clear = await this.waitForLoaderGone();
    if (true != clear) return clear;

    var rowSelector = this.productRowByTitle.replace("{{title}}", title);
    var res = await action.click(rowSelector);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the product row for " + title + " could not be clicked", "error");
      return res;
    }
    var onUrl = await this.waitForUrlFragment("/bundle/", LIST_TIMEOUT);
    if (true != onUrl) return onUrl;
    // Lazy require — the two pages navigate to each other (ADR-004).
    return await require("./umbrellaProduct.page.js").isInitialized();
  },

  /**
   * Opens a product's materials view by clicking its SCHOOL LICENCE TILE.
   *
   * ⚠️ The element carrying the `sa-lbt-sle-prdtcrd-<n>` qid is an inert wrapper DIV with no
   * role, no tabindex and no click handler — clicking it does nothing at all (observed: a
   * 40 s wait with no navigation). The real control is the `a.product-tile` inside it, which
   * is what `schoolLicenceTileLinkByTitle` targets.
   */
  click_schoolLicenceTileByTitle: async function (title) {
    await logger.logInto(await stackTrace.get(), "opening the licence tile for " + title);
    // The list only becomes clickable once the loading overlay is gone (waitForLoaderGone).
    var clear = await this.waitForLoaderGone();
    if (true != clear) return clear;

    var tileSelector = this.schoolLicenceTileLinkByTitle.replace("{{title}}", title);
    var res = await action.click(tileSelector);
    if (true != res) {
      await logger.logInto(await stackTrace.get(), "the licence tile for " + title + " could not be clicked", "error");
      return res;
    }
    var onUrl = await this.waitForUrlFragment("/bundle/", LIST_TIMEOUT);
    if (true != onUrl) return onUrl;
    return await require("./umbrellaProduct.page.js").isInitialized();
  },

  /**
   * Returns the title of the Nth School licence tile, read at RUN TIME.
   *
   * Product titles on this shared school change — one was renamed within two days, and a
   * whole licence was swapped out between captures. Tests therefore ask the page which
   * product to use instead of carrying a hard-coded title (admin-library-tab.md §6).
   */
  getData_licenceTileTitleAt: async function (index) {
    var tile = await action.getKthElement(this.schoolLicenceTileTitle, index);
    if (!tile) {
      var err = new Error("there is no School licence tile at index " + index);
      await logger.logInto(await stackTrace.get(), err.message, "error");
      return err;
    }
    var text = await action.getText(tile);
    if (typeof text != "string") return text;
    return String(text).trim();
  }
};
