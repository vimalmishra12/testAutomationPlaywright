"use strict";
global.appUrl = undefined;
// global.testJsDir = undefined;
// global.testRepoDir = undefined;
global.testExecDir = undefined;
global.selectorDir = undefined;
//global.tcDataDir = undefined;
global.fs = require('fs');
global.argv = require('yargs').argv;
global.path = require('path');
global.jsonParserUtil = require('./core/utils/jsonParser.js');
global.assertion = require('./core/actionLibrary/baseAssertionLibrary.js');
global.loadashget = require('lodash.get');
global.stackTrace = require('stack-trace');
global.resolution = {
    width: undefined,
    height: undefined
};
global.view = undefined;
global.build = argv.buildNumber;
global.jobName = argv.jobName;
global.suiteKey = undefined;
global.tcId = undefined;
global.tcNumber = undefined;
global.screenshotName = undefined;
global.reportOutputDir = 'output/reports/' + (argv.reportdir ? argv.reportdir : 'TestReports');
global.baseScreenshotDir = undefined;
global.testScreenshotDir = undefined;
global.diffScreenshotDir = undefined;
global.resScreenshotDir = undefined;
global.capabilities = undefined;
global.maximizeWindow = undefined;
global.capabilitiesFile = global.jsonParserUtil.jsonParser(path.join(process.cwd() + '/capabilities.json'));


// after loading env.json
let envData = global.jsonParserUtil.jsonParser(process.cwd() + '/env.json');

// set LT creds globally (fallback if not provided in real env vars)
if (envData.lambdaTestCredentials) {
    process.env.LT_USERNAME = process.env.LT_USERNAME || envData.lambdaTestCredentials.LT_USERNAME;
    process.env.LT_ACCESS_KEY = process.env.LT_ACCESS_KEY || envData.lambdaTestCredentials.LT_ACCESS_KEY;
}

global.envData = envData;


if (
    argv.browserCapability &&
    global.capabilitiesFile[argv.browserCapability] &&
    global.capabilitiesFile[argv.browserCapability].webDriverService ===
        "lambdatest"
) {
    const cap = global.capabilitiesFile[argv.browserCapability];
    cap.hostname = cap.hostname || "hub.lambdatest.com";
    cap.portNumber = cap.portNumber || 443;
    cap.webServicePath = cap.webServicePath || "/wd/hub";

    // prefer env vars for credentials (safer for CI)
    cap.user = process.env.LT_USERNAME || cap.user;
    cap.key = process.env.LT_ACCESS_KEY || cap.key;
}



// // Ensure LambdaTest defaults & pick up LT credentials from env if present
// if (argv.browserCapability && global.capabilitiesFile[argv.browserCapability] && global.capabilitiesFile[argv.browserCapability].webDriverService === 'lambdatest') {
//     const cap = global.capabilitiesFile[argv.browserCapability];
//     cap.hostname = cap.hostname || 'hub.lambdatest.com';
//     cap.portNumber = cap.portNumber || 443;
//     cap.webServicePath = cap.webServicePath || '/wd/hub';

//     // prefer env vars for credentials (safer for CI)
//     cap.user = process.env.LT_USERNAME || cap.user;
//     cap.key  = process.env.LT_ACCESS_KEY || cap.key;
// }

global.appVersion = undefined;
global.moduleOff = undefined;

// ====================================
// Check for mandatory input parameters
// ====================================
if (!argv.appType || !argv.testEnv || !argv.testExecFile) {
    console.log("!!!!! ERROR: One or more of the following run parameters are missing !!!!!!!!!!!");
    console.log("appType = " + argv.appType);
    console.log("testEnv = " + argv.testEnv);
    console.log("testExecFile = " + argv.testExecFile);
    console.log("!!!!! Exiting program... !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    process.exit(1);
}
else {
    let envData = global.jsonParserUtil.jsonParser(process.cwd() + '/env.json');
    //global.testJsDir = envData[argv.appType].testJsDir;
    // global.testRepoDir = envData[argv.appType].testRepoDir;
    global.testExecDir = envData[argv.appType].testExecDir;
    // global.tcDataDir = envData[argv.appType].environments[argv.testEnv].tcDataDir;
    // global.selectorDir = envData[argv.appType].selectorDir;
    global.appUrl = envData[argv.appType].environments[argv.testEnv].url;
    global.moduleOff = envData[argv.appType].environments[argv.testEnv].moduleOff;

    global.headers = envData?.[argv.appType]?.environments?.[argv.testEnv]?.headers || {};
    // Normalize header names to lowercase and ensure values are strings
    global.headers = Object.fromEntries(
      Object.entries(global.headers || {}).map(([k, v]) => [String(k).toLowerCase(), String(v)])
    );

    if (Object.keys(global.headers).length) {
      console.log("🔐 [ENV] Cloudflare headers loaded for bypass:", Object.keys(global.headers));
    } else {
      console.log("⚠️ [ENV] No Cloudflare headers found in environment configuration");
    }


    if (!global.appUrl || !global.testExecDir) {
        console.log("!!!!! ERROR: One or more environment parameters are missing in the env.json !!!!!");
        console.log("appUrl = " + global.appUrl);
        //console.log("testJsDir = " + global.testJsDir);
        //console.log("testRepoDir = " + global.testRepoDir);
        console.log("testExecDir = " + global.testExecDir);
        //console.log("tcDataDir = " + global.tcDataDir);
        //console.log("selectorDir = " + global.selectorDir);
        console.log("!!!!! Exiting program... !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        process.exit(1);
    }

    // ============================
    // Setting browser capabilities
    // ============================
    if (!argv.browserCapability || argv.browserCapability == "") {
        argv.browserCapability = "desktop-chrome-1920";
        console.log("WARNING!! Browser capability not provided, using default capabilities (" + argv.browserCapability + ")...");
    }
    if (capabilitiesFile[argv.browserCapability] == undefined) {
        console.log("!!!!! ERROR: Browser capability not found in the capabilities.json !!!!!");
        console.log("browserCapability = " + argv.browserCapability);
        console.log("!!!!! Exiting program... !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        process.exit(1);
    }
    global.capabilities = capabilitiesFile[argv.browserCapability].capabilities;
    if (capabilitiesFile[argv.browserCapability].webDriverService === 'lambdatest') {
        global.capabilities.forEach(cap => {
            if (cap['LT:Options']) {
                cap['LT:Options'].customHeaders = global.headers;
            }
        });
    }
    global.maximizeWindow = capabilitiesFile[argv.browserCapability].maximizeWindow;
    global.resScreenshotDir = argv.browserCapability;
    if (capabilitiesFile[argv.browserCapability].resolution != undefined) {
        global.resolution.width = capabilitiesFile[argv.browserCapability].resolution.split("x")[0].trim();
        global.resolution.height = capabilitiesFile[argv.browserCapability].resolution.split("x")[1].trim();
    }
    if (parseInt(global.resolution.width, 10) > 1023)
        global.view = 'desktop';
    else
        global.view = 'mobile';
}

global.baseScreenshotDir = path.join('screenshots/baseline/' + argv.appType, argv.testEnv, global.resScreenshotDir);
global.testScreenshotDir = path.join('screenshots/screen/' + argv.appType, argv.testEnv, global.resScreenshotDir);
global.diffScreenshotDir = path.join('screenshots/diff/' + argv.appType, argv.testEnv, global.resScreenshotDir);

// ========================================
// Setting screenshot label folder location
// ========================================
if (argv.visual) {
    fs.mkdirSync(global.reportOutputDir + '/visual/', { recursive: true });
}

global.setupCDPHeaders = async () => {
  // [2026-06-11] Playwright migration (Prompt 4 / Phase 1) — confirmed by user.
  // Under Playwright there is no WebDriverIO `browser` / Puppeteer bridge, so this
  // WDIO-CDP header-injection path is a safe no-op. Cloudflare header injection (if
  // ever needed for qa/rel) moves to Playwright context `extraHTTPHeaders` in a
  // later step. The guard also prevents a ReferenceError on the undeclared `browser`.
  if (typeof browser === "undefined" || !browser) {
    if (global.headers && Object.keys(global.headers).length) {
      console.log("⚠️ [CDP] Playwright mode — Cloudflare headers will be applied at context level; skipping WDIO CDP path");
    }
    return;
  }

  // Prevent duplicate initialization/listeners
  // if (global._cdpHeadersSetup) {
  //   console.log('🔧 [CDP] setupCDPHeaders already run; skipping duplicate initialization');
  //   return;
  // }
  // global._cdpHeadersSetup = true;

  try {
    if (!global.appUrl) {
      console.warn('⚠️ [CDP] global.appUrl is not set — skipping CDP header setup');
      return;
    }

    if (!global.headers || Object.keys(global.headers).length === 0) {
      console.log('⚠️ [ENV] No Cloudflare headers to inject; skipping CDP header setup');
      return;
    }

    // Ensure Puppeteer bridge exists on browser
    if (typeof browser?.getPuppeteer !== 'function') {
      console.warn('⚠️ [CDP] browser.getPuppeteer is not available; cannot configure CDP headers');
      return;
    }

    const puppeteerBrowser = await browser.getPuppeteer();
    if (!puppeteerBrowser) {
      console.warn('⚠️ [CDP] puppeteerBrowser is undefined; aborting header setup');
      return;
    }

    // Obtain or create a Puppeteer page
    const pages = await puppeteerBrowser.pages();
    let page = pages && pages.length ? pages[0] : null;
    if (!page) {
      try {
        page = await puppeteerBrowser.newPage();
      } catch (err) {
        // ignore - will be handled below
      }
    }
    if (!page) {
      console.warn('⚠️ [CDP] Could not obtain a Puppeteer page; aborting header setup');
      return;
    }

    // Try the high-level Puppeteer API first (cleanest)
    // if (typeof page.setExtraHTTPHeaders === 'function') {
    //   try {
    //     await page.setExtraHTTPHeaders(global.headers);
    //     console.log('🔐 [CDP] Headers applied via page.setExtraHTTPHeaders');
    //     return;
    //   } catch (err) {
    //     console.warn('⚠️ [CDP] page.setExtraHTTPHeaders failed, falling back to CDP Fetch interception:', err);
    //   }
    // }

    // Safely parse hostname to scope interception patterns
    let hostnamePattern = '*';
    try {
      const parsed = new URL(global.appUrl.includes('://') ? global.appUrl : `http://${global.appUrl}`);
      hostnamePattern = `*${parsed.hostname}*`;
    } catch (err) {
      console.warn('⚠️ [CDP] Could not parse global.appUrl; request interception will not be hostname-scoped');
    }

    // Create CDP session
    const client = await page.target().createCDPSession();
    if (!client) {
      console.warn('⚠️ [CDP] Failed to create CDP session; aborting header setup');
      return;
    }

    // Enable Network (best-effort) and Fetch domain for request modification
    try { await client.send('Network.enable'); } catch (_) { /* non-fatal */ }
    await client.send('Network.setRequestInterception', {
      patterns: [{ urlPattern: hostnamePattern }]
    });

    // Handler: on request paused, merge headers and continue the request
      // Listen for requests and inject headers
  client.on('Network.requestIntercepted', async (event) => {
    const { interceptionId, request } = event;

    // console.log(`📡 [CDP] Intercepted request: ${request.method} ${request.url}`);

    // Check if this request should have headers
    const shouldAddHeaders = global.appUrl && request.url.includes(new URL(global.appUrl).hostname);

    if (shouldAddHeaders) {
      // console.log(`🔐 [CDP] Adding headers to: ${request.url}`);

      // Add headers to the request
      const headers = { ...request.headers, ...global.headers };

      // console.log(`🔐 [CDP] Headers injected:`, Object.keys(global.headers));

      // Continue the request with modified headers
      await client.send('Network.continueInterceptedRequest', {
        interceptionId,
        headers
      });
    } else {
      // Continue the request without modification
      await client.send('Network.continueInterceptedRequest', {
        interceptionId
      });
    }
  });

    console.log('🔧 [CDP] Header injection via CDP Fetch domain configured');
  } catch (err) {
    console.error('❌ [CDP] Error setting up CDP headers:', err);
  }
};










// This is the modern approach using `fetch` to ingest headers to bypass the cloudfare authentication via headers, but we are not using it for now because it does not align with our current testing setup.


// global.setupCDPHeaders = async () => {
//   // Prevent duplicate initialization/listeners
//   // if (global._cdpHeadersSetup) {
//   //   console.log('🔧 [CDP] setupCDPHeaders already run; skipping duplicate initialization');
//   //   return;
//   // }
//   // global._cdpHeadersSetup = true;

//   try {
//     if (!global.appUrl) {
//       console.warn('⚠️ [CDP] global.appUrl is not set — skipping CDP header setup');
//       return;
//     }

//     if (!global.headers || Object.keys(global.headers).length === 0) {
//       console.log('⚠️ [ENV] No Cloudflare headers to inject; skipping CDP header setup');
//       return;
//     }

//     // Ensure Puppeteer bridge exists on browser
//     if (typeof browser?.getPuppeteer !== 'function') {
//       console.warn('⚠️ [CDP] browser.getPuppeteer is not available; cannot configure CDP headers');
//       return;
//     }

//     const puppeteerBrowser = await browser.getPuppeteer();
//     if (!puppeteerBrowser) {
//       console.warn('⚠️ [CDP] puppeteerBrowser is undefined; aborting header setup');
//       return;
//     }

//     // Obtain or create a Puppeteer page
//     const pages = await puppeteerBrowser.pages();
//     let page = pages && pages.length ? pages[0] : null;
//     if (!page) {
//       try {
//         page = await puppeteerBrowser.newPage();
//       } catch (err) {
//         // ignore - will be handled below
//       }
//     }
//     if (!page) {
//       console.warn('⚠️ [CDP] Could not obtain a Puppeteer page; aborting header setup');
//       return;
//     }

//     // Try the high-level Puppeteer API first (cleanest)
//     // if (typeof page.setExtraHTTPHeaders === 'function') {
//     //   try {
//     //     await page.setExtraHTTPHeaders(global.headers);
//     //     console.log('🔐 [CDP] Headers applied via page.setExtraHTTPHeaders');
//     //     return;
//     //   } catch (err) {
//     //     console.warn('⚠️ [CDP] page.setExtraHTTPHeaders failed, falling back to CDP Fetch interception:', err);
//     //   }
//     // }

//     // Safely parse hostname to scope interception patterns
//     let hostnamePattern = '*';
//     try {
//       const parsed = new URL(global.appUrl.includes('://') ? global.appUrl : `http://${global.appUrl}`);
//       hostnamePattern = `*${parsed.hostname}*`;
//     } catch (err) {
//       console.warn('⚠️ [CDP] Could not parse global.appUrl; request interception will not be hostname-scoped');
//     }

//     // Create CDP session
//     const client = await page.target().createCDPSession();
//     if (!client) {
//       console.warn('⚠️ [CDP] Failed to create CDP session; aborting header setup');
//       return;
//     }

//     // Enable Network (best-effort) and Fetch domain for request modification
//     try { await client.send('Network.enable'); } catch (_) { /* non-fatal */ }
//     await client.send('Fetch.enable', {
//       handleAuthRequests: false,
//       patterns: [{ urlPattern: hostnamePattern }]
//     });

//     // Handler: on request paused, merge headers and continue the request
//     client.on('Fetch.requestPaused', async (event) => {
//       const { requestId, request } = event;
//       try {
//         const originalHeaders = request.headers || {};
//         // normalize original headers (lowercase keys) then merge with global.headers (global headers win)
//         const normalizedOriginal = Object.fromEntries(
//           Object.entries(originalHeaders).map(([k, v]) => [String(k).toLowerCase(), String(v)])
//         );
//         const merged = { ...normalizedOriginal, ...global.headers };

//         // Convert to CDP's expected header array format
//         const headerArray = Object.entries(merged).map(([name, value]) => ({ name: String(name), value: String(value) }));

//         await client.send('Fetch.continueRequest', {
//           requestId,
//           headers: headerArray
//         });
//       } catch (err) {
//         console.warn('⚠️ [CDP] Error injecting headers for paused request, attempting to continue without modification:', err);
//         try {
//           await client.send('Fetch.continueRequest', { requestId });
//         } catch (innerErr) {
//           // Final best-effort fallback: try to use Network.continueInterceptedRequest if possible
//           try {
//             if (event.interceptionId) {
//               await client.send('Network.continueInterceptedRequest', { interceptionId: event.interceptionId });
//             }
//           } catch (_) {
//             // swallow - nothing more we can do for this request
//           }
//         }
//       }
//     });

//     console.log('🔧 [CDP] Header injection via CDP Fetch domain configured');
//   } catch (err) {
//     console.error('❌ [CDP] Error setting up CDP headers:', err);
//   }
// };
