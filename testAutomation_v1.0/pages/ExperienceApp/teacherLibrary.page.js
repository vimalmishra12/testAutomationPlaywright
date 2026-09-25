"use strict";
var action = require("../../core/actionLibrary/baseActionLibrary.js");
var selectorFile = jsonParserUtil.jsonParser(selectorDir);

/**
 * Teacher dashboard > "My library" (module TLIB — agreed with the user 2026-09-23).
 * Captured live on production 2026-09-23 — see learning-path-player.md §A9. Read-only.
 *
 * Flow: "My library" → search the product → click its TITLE (this EXPANDS the card; it does not
 * navigate) → "View details" → the product materials view, which is the same Vue page as the admin's
 * "See materials" (umbrellaProduct.page.js).
 */
module.exports = {
  searchInput: selectorFile.css.ComproC1.teacherLibrary.searchInput,

  isInitialized: async function () {
    await logger.logInto(await stackTrace.get());
    await action.waitForDocumentLoad();
    // [2026-09-24, prod] The library's content (and its search box) renders only after the teacher-materials request
    // answers — > 30 s during the production disruption (full run 9: tab open, spinner at 30 s). Same budget as
    // createNewClass.click_addMaterial_btn; the step still fails if the library never loads.
    return { pageStatus: true == (await action.waitForDisplayed(this.searchInput, 90000)) };
  },

  /** From the teacher dashboard: My library → search → expand the product → View details → materials view. */
  open_productDetails: async function (productId, productTitle) {
    await logger.logInto(await stackTrace.get(), "product:" + productId + " / " + productTitle);
    var tl = selectorFile.css.ComproC1.teacherLibrary;
    var title = tl.productTitleById.replace(/\{ID\}/g, productId);
    var details = tl.viewDetailsById.replace(/\{ID\}/g, productId);
    var out = { libraryShown: false, productListed: false, detailsShown: false, materialsShown: false };
    var res = await action.click(tl.myLibraryNav);
    out.libraryShown = true == res && true == (await action.waitForUrl(/\/dashboard\/teacher\/library/, 30000)) && (await this.isInitialized()).pageStatus;
    if (!out.libraryShown) return out;
    // Search is submit-driven: type, then Enter.
    res = await action.click(this.searchInput);
    if (true == res) res = await action.addValue(this.searchInput, productTitle);
    if (true == res) res = await action.pressKey(this.searchInput, "Enter");
    out.productListed = true == res && true == (await action.waitForDisplayed(title, 30000));
    if (!out.productListed || true != (await action.click(title))) return out;
    out.detailsShown = true == (await action.waitForDisplayed(details, 15000));
    if (!out.detailsShown || true != (await action.click(details))) return out;
    out.materialsShown = true == (await require("./umbrellaProduct.page.js").isInitialized());
    return out;
  },
};
