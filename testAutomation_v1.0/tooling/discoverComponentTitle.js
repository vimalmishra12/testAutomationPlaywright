"use strict";
const { chromium } = require("playwright");

(async function run() {
  const browser = await chromium.launch({ headless: false, channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  try {
    // Step 1: pre-login — select org and submit
    await page.goto("https://asgard-thor-builder.comprodls.com/2024/pre-login");
    await page.waitForSelector("#selectedOrg", { timeout: 30000 });
    await page.selectOption("#selectedOrg", { label: "Cambridge One" });
    await page.click("button[type='submit']");

    // Step 2: confirm page
    await page.waitForURL("**/2024/login**", { timeout: 30000 });
    await page.waitForSelector("button[type='submit']", { timeout: 30000 });
    await page.click("button[type='submit']");

    // Step 3: IdP login (pressSequentially fires keystroke events the form needs)
    await page.waitForSelector("#login-user", { timeout: 45000 });
    await page.click("#login-user");
    await page.locator("#login-user").pressSequentially("harishthoradmin", { delay: 40 });
    await page.click("#login-pass");
    await page.locator("#login-pass").pressSequentially("C0>pr0!899", { delay: 40 });
    await page.waitForTimeout(500);
    await page.click("#login-mfa-btn");

    // Wait for Builder landing
    await page.waitForSelector("header.sticky", { timeout: 45000 });
    console.log("LOGIN OK. URL:", page.url());

    // Navigate to components listing
    await page.goto("https://asgard-thor-builder.comprodls.com/2024/components");
    await page.waitForSelector("#search", { timeout: 20000 });
    await page.waitForTimeout(2000);

    const freshDump = await page.evaluate(function () {
      var main = document.querySelector("[role='main']");
      if (!main) return "NO_MAIN_ON_FRESH_LOAD";
      return "MAIN=" + (main.innerText || main.textContent).replace(/\s+/g, " ").trim().substring(0, 400);
    });
    console.log("FRESH:", freshDump);

    // --- Verify: does fill() (setValue) trigger the search filter? ---
    // Use Playwright's page.fill() to simulate the test framework's action.setValue
    await page.fill("#search", "cqaclone1_15junepe1");
    await page.waitForTimeout(2000);
    const afterFill = await page.evaluate(function () {
      var links = Array.from(document.querySelectorAll("a[href='javascript:void(0);']"));
      return "fill_LINKS=" + links.length + " texts=" + links.slice(0,3).map(function(a){ return "["+a.textContent.trim()+"]"; }).join(",");
    });
    console.log("AFTER_FILL:", afterFill);

    // Try pressing Enter after fill — some search boxes need Enter
    await page.keyboard.press("Enter");
    await page.waitForTimeout(3000);
    const afterEnter = await page.evaluate(function () {
      var links = Array.from(document.querySelectorAll("a[href='javascript:void(0);']"));
      return "enter_LINKS=" + links.length + " texts=" + links.slice(0,5).map(function(a){ return "["+a.textContent.trim()+"]"; }).join(",");
    });
    console.log("AFTER_ENTER:", afterEnter);

    console.log("URL_AFTER_ENTER:", await page.url());

    // ---- Families page DOM investigation ----
    await page.goto("https://asgard-thor-builder.comprodls.com/2024/families");
    await page.waitForSelector("#search", { timeout: 20000 });
    await page.waitForTimeout(2000);

    const familiesFresh = await page.evaluate(function () {
      var roles = ["main", "list", "listitem", "grid", "region"];
      var roleInfo = roles.map(function(r) {
        return "role=" + r + ":" + document.querySelectorAll("[role='" + r + "']").length;
      }).join(", ");
      var voidLinks = Array.from(document.querySelectorAll("a[href='javascript:void(0)']")).length;
      var voidLinksSemi = Array.from(document.querySelectorAll("a[href='javascript:void(0);']")).length;
      return "ROLES: " + roleInfo + " | void(0): " + voidLinks + " | void(0);: " + voidLinksSemi;
    });
    console.log("FAMILIES_FRESH:", familiesFresh);

    // Check families listing without any search — to find the card structure
    const familiesDefault = await page.evaluate(function () {
      var all = document.body.innerText.replace(/\s+/g,' ').trim().substring(0, 500);
      // Find all buttons with "Delete" text
      var deleteBtns = Array.from(document.querySelectorAll("button")).filter(function(b){
        return (b.textContent || "").trim() === "Delete";
      });
      // Count all anchor tags
      var allAnchors = document.querySelectorAll("a").length;
      return "BODY=" + all + " | DELETE_BTNS=" + deleteBtns.length + " | ALL_ANCHORS=" + allAnchors;
    });
    console.log("FAMILIES_DEFAULT:", familiesDefault);

    // Inspect void links on families page (no search)
    const familiesVoidLinks = await page.evaluate(function() {
      var links = Array.from(document.querySelectorAll("a[href='javascript:void(0)']"));
      return "COUNT=" + links.length + " | FIRST3=" + links.slice(0,3).map(function(a,i){ return i+"=["+a.textContent.trim().substring(0,60)+"]"; }).join(" | ");
    });
    console.log("FAMILIES_VOID_LINKS:", familiesVoidLinks);

    // Cleanup: Click Delete for "Diag Family Temp" and inspect the dialog
    await page.locator("#search").pressSequentially("Diag Family Temp", { delay: 50 });
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2000);

    var diagDeleteCount = await page.locator("button:has-text('Delete')").count();
    console.log("DIAG_DELETE_COUNT:", diagDeleteCount);
    if (diagDeleteCount > 0) {
      await page.locator("button:has-text('Delete')").first().click();
      await page.waitForTimeout(1500);
      // Inspect the dialog structure
      const dialogDOM = await page.evaluate(function() {
        var dlg = document.querySelector("[role='dialog']");
        if (!dlg) return "NO_DIALOG";
        var inputs = Array.from(dlg.querySelectorAll("input,textarea,select")).map(function(e,i){
          return i+":"+e.tagName+"[type="+e.type+",id="+e.id+",disabled="+e.disabled+"]";
        }).join(" || ");
        var buttons = Array.from(dlg.querySelectorAll("button")).map(function(b){
          return "["+b.textContent.trim()+":disabled="+b.disabled+"]";
        }).join(" | ");
        return "INPUTS=" + inputs + " | BUTTONS=" + buttons + " | TEXT=" + dlg.innerText.replace(/\s+/g,' ').trim().substring(0,200);
      });
      console.log("DELETE_DIALOG:", dialogDOM);
      // Try waiting for Confirm to be enabled (up to 5s)
      try {
        await page.locator("[role='dialog'] button:has-text('Confirm')").waitFor({ state: 'visible', timeout: 1000 });
        var isEnabled = await page.locator("[role='dialog'] button:has-text('Confirm')").isEnabled();
        console.log("CONFIRM_ENABLED:", isEnabled);
        if (!isEnabled) {
          // Check if there's a textarea to fill
          var hasTextarea = await page.locator("[role='dialog'] textarea").count();
          if (hasTextarea > 0) {
            await page.locator("[role='dialog'] textarea").fill("Cleanup");
            await page.waitForTimeout(500);
            isEnabled = await page.locator("[role='dialog'] button:has-text('Confirm')").isEnabled();
            console.log("CONFIRM_ENABLED_AFTER_COMMENT:", isEnabled);
          }
        }
        if (isEnabled) {
          await page.locator("[role='dialog'] button:has-text('Confirm')").click();
          await page.waitForTimeout(1000);
          console.log("CLEANUP: deleted Diag Family Temp");
        } else {
          // Just close the dialog
          var hasClose = await page.locator("[role='dialog'] button:has-text('Cancel')").count();
          if (hasClose) await page.locator("[role='dialog'] button:has-text('Cancel')").click();
          console.log("CLEANUP: could not delete (Confirm never enabled)");
        }
      } catch(e) {
        console.log("CLEANUP_ERR:", e.message.substring(0,100));
      }
    } else {
      console.log("CLEANUP: Diag Family Temp not found");
    }

    // Dump DOM structure: find what container holds the listing
    const domInvestigation = await page.evaluate(function () {
      var out = [];

      // Check common role values
      var roles = ["main", "list", "listitem", "grid", "table", "region"];
      roles.forEach(function (r) {
        var els = document.querySelectorAll("[role='" + r + "']");
        if (els.length) out.push("role=" + r + " count=" + els.length);
      });

      // Find all a[href='javascript:void(0);'] — without role='main' scope
      var allLinks = Array.from(document.querySelectorAll("a[href='javascript:void(0);']"));
      out.push("TOTAL_VOIDLINKS=" + allLinks.length);

      // Find links WITHOUT semicolon
      var allLinksNoSemi = Array.from(document.querySelectorAll("a[href='javascript:void(0)']"));
      out.push("TOTAL_VOIDLINKS_NOSEMI=" + allLinksNoSemi.length);

      // Look for container element that has many void links
      if (allLinks.length > 0) {
        var firstLink = allLinks[0];
        // Walk up to find a container with multiple links
        var el = firstLink.parentElement;
        while (el && el !== document.body) {
          var linksInEl = el.querySelectorAll("a[href='javascript:void(0);']").length;
          if (linksInEl >= 3) {
            out.push("CONTAINER=" + el.tagName + " id=" + (el.id||"") + " class=" + el.className.substring(0,80) + " role=" + (el.getAttribute("role")||"") + " links=" + linksInEl);
            break;
          }
          el = el.parentElement;
        }
        // Dump first 3 link texts
        out.push("FIRST3_LINKS=" + allLinks.slice(0,3).map(function(a,i){ return i+"=["+a.textContent.trim().substring(0,80)+"]"; }).join(" | "));
      }

      // Search for "cqaclone1_15junepe1" in the DOM
      var allEls = Array.from(document.querySelectorAll("*"));
      var matchEl = allEls.find(function(el) {
        return el.children.length === 0 && el.textContent.trim() === "cqaclone1_15junepe1";
      });
      if (matchEl) {
        // Walk up to find card container
        var card = matchEl;
        for (var j = 0; j < 10; j++) {
          card = card.parentElement;
          if (!card || card === document.body) break;
          var cardText = (card.innerText || card.textContent).replace(/\s+/g, " ").trim();
          if (cardText.length > 30 && cardText.length < 500) {
            out.push("CARD_TEXT=" + cardText.substring(0, 300));
            // Also get the link text in this card
            var cardLink = card.querySelector("a[href='javascript:void(0);']");
            if (cardLink) out.push("CARD_LINK_TEXT=" + cardLink.textContent.trim());
            break;
          }
        }
      } else {
        out.push("CODE_NOT_FOUND_IN_DOM");
      }

      return out.join("\n");
    });
    console.log("DOM_INVESTIGATION:\n" + domInvestigation);

  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await browser.close();
  }
})();
