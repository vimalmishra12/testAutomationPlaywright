"use strict";
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
var argv = require("yargs").argv;

// Fast CRC-32 table for pure Node.js ZIP creation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Creates a standard, 100% compliant .zip file in pure Node.js (built-in zlib).
 * Packaging the HTML report in a ZIP container prevents browser Safe Browsing / Antivirus
 * from flagging inline base64 scripts as "Virus detected" / phishing.
 */
function createZipFromBuffer(fileNameInZip, fileBuffer) {
  const nameBuf = Buffer.from(fileNameInZip, "utf8");
  const compressedData = zlib.deflateRawSync(fileBuffer);
  const crc = crc32(fileBuffer);
  const uncompressedSize = fileBuffer.length;
  const compressedSize = compressedData.length;

  // Local File Header (30 bytes + filename)
  const localHeader = Buffer.alloc(30 + nameBuf.length);
  localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
  localHeader.writeUInt16LE(20, 4);         // Version needed (2.0)
  localHeader.writeUInt16LE(0x0800, 6);     // General purpose bit flag (UTF-8)
  localHeader.writeUInt16LE(8, 8);          // Compression method (8 = Deflate)
  localHeader.writeUInt16LE(0, 10);         // Last mod file time
  localHeader.writeUInt16LE(0, 12);         // Last mod file date
  localHeader.writeUInt32LE(crc, 14);       // CRC-32
  localHeader.writeUInt32LE(compressedSize, 18);   // Compressed size
  localHeader.writeUInt32LE(uncompressedSize, 22); // Uncompressed size
  localHeader.writeUInt16LE(nameBuf.length, 26);   // Filename length
  localHeader.writeUInt16LE(0, 28);         // Extra field length
  nameBuf.copy(localHeader, 30);

  // Central Directory File Header (46 bytes + filename)
  const centralHeader = Buffer.alloc(46 + nameBuf.length);
  centralHeader.writeUInt32LE(0x02014b50, 0); // Central dir signature
  centralHeader.writeUInt16LE(20, 4);          // Version made by
  centralHeader.writeUInt16LE(20, 6);          // Version needed
  centralHeader.writeUInt16LE(0x0800, 8);      // UTF-8 flag
  centralHeader.writeUInt16LE(8, 10);          // Deflate
  centralHeader.writeUInt16LE(0, 12);          // Last mod time
  centralHeader.writeUInt16LE(0, 14);          // Last mod date
  centralHeader.writeUInt32LE(crc, 16);        // CRC-32
  centralHeader.writeUInt32LE(compressedSize, 20);
  centralHeader.writeUInt32LE(uncompressedSize, 24);
  centralHeader.writeUInt16LE(nameBuf.length, 28);
  centralHeader.writeUInt16LE(0, 30);          // Extra field length
  centralHeader.writeUInt16LE(0, 32);          // Comment length
  centralHeader.writeUInt16LE(0, 34);          // Disk number start
  centralHeader.writeUInt16LE(0, 36);          // Internal file attributes
  centralHeader.writeUInt32LE(0, 38);          // External file attributes
  centralHeader.writeUInt32LE(0, 42);          // Relative offset of local header
  nameBuf.copy(centralHeader, 46);

  // End of Central Directory Record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);          // EOCD signature
  eocd.writeUInt16LE(0, 4);                   // Disk number
  eocd.writeUInt16LE(0, 6);                   // Start disk
  eocd.writeUInt16LE(1, 8);                   // Entries on this disk
  eocd.writeUInt16LE(1, 10);                  // Total entries
  eocd.writeUInt32LE(centralHeader.length, 12); // Central dir size
  eocd.writeUInt32LE(localHeader.length + compressedData.length, 16); // Central dir offset
  eocd.writeUInt16LE(0, 20);                  // Comment length

  return Buffer.concat([localHeader, compressedData, centralHeader, eocd]);
}

// Check if output/reports directory exists and has subdirectories
var folder = [];
try {
  if (fs.existsSync("../../output/reports/")) {
    folder = fs.readdirSync("../../output/reports/");
  }
} catch (e) {
  console.warn("Could not read ../../output/reports/ directory:", e.message);
}

var envData = {};
try {
  if (fs.existsSync("../../env.json")) {
    envData = JSON.parse(fs.readFileSync("../../env.json", "utf-8"));
  }
} catch (e) {
  console.warn("Could not read ../../env.json:", e.message);
}

var errorMailingList =
  "vimal.mishra@comprotechnologies.com,ashish.kushwaha@comprotechnologies.com";
// GitHub Actions CI run URL.
// argv.projectName = "owner/repo", argv.jobID = GITHUB_RUN_ID (passed by e2e-tests.yml).
var githubActionsRunUrl =
  "https://github.com/" + argv.projectName + "/actions/runs/" + argv.jobID;

// lambdatest shareable link detection
const ltShareUrl = process.env.LT_SHARE_URL || "";

var reportFolderName = folder.length > 0 ? folder[0] : "TestReports";
var funcReportDir = "../../output/reports/" + reportFolderName;
var visReportDir = funcReportDir + "/visual";
var mailingList, mailOutput, mailSubject, appUrl;

// Maximum email attachment size limit (18 MB to stay safely under Gmail's 25 MB payload limit)
const MAX_ZIP_ATTACH_LIMIT = 18 * 1024 * 1024;

/**
 * Packages report into a clean ZIP archive and prepares attachment.
 * Packaging inside a ZIP avoids antivirus / Chrome Safe Browsing flagging raw .html files.
 * Returns { attachment: object | null, statusText: string, tempFilePath: string | null }
 */
function prepareReportAttachment(reportPath, reportLabel, buildNumber) {
  if (!reportPath || !fs.existsSync(reportPath)) {
    return {
      attachment: null,
      statusText: "Report file not found on disk",
      tempFilePath: null,
    };
  }

  try {
    const rawFileBuffer = fs.readFileSync(reportPath);
    const innerFileName = path.basename(reportPath) || "report.html";
    const zipBuffer = createZipFromBuffer(innerFileName, rawFileBuffer);
    const zipSizeInMB = (zipBuffer.length / (1024 * 1024)).toFixed(2);
    const rawSizeInMB = (rawFileBuffer.length / (1024 * 1024)).toFixed(2);

    if (zipBuffer.length <= MAX_ZIP_ATTACH_LIMIT) {
      const zipFileName = `${reportLabel}_Report_Build_${buildNumber}.zip`;
      const tempZipPath = path.join(path.dirname(reportPath), zipFileName);
      fs.writeFileSync(tempZipPath, zipBuffer);

      console.log(
        `📦 [MAILER] Packaged report (${rawSizeInMB} MB) into ZIP: ${zipFileName} (${zipSizeInMB} MB)`
      );
      return {
        attachment: {
          filename: zipFileName,
          path: tempZipPath,
          contentType: "application/zip",
        },
        statusText: `📎 Attached (${zipFileName}, ${zipSizeInMB} MB)`,
        tempFilePath: tempZipPath,
      };
    } else {
      console.warn(
        `⚠️ [MAILER] Report ZIP (${zipSizeInMB} MB) exceeds maximum email attachment limit (18 MB).`
      );
      return {
        attachment: null,
        statusText: `⚠️ Omitted (${zipSizeInMB} MB > 18 MB email limit — download via CI Artifacts)`,
        tempFilePath: null,
      };
    }
  } catch (err) {
    console.error("Error preparing ZIP attachment for " + reportPath + ":", err.message);
    return {
      attachment: null,
      statusText: "Error preparing attachment",
      tempFilePath: null,
    };
  }
}

async function main() {
  const tempFilesToClean = [];
  try {
    if (
      !argv.appType ||
      !argv.testEnv ||
      !argv.mailingList ||
      !argv.jobResult ||
      !argv.buildNumber
    ) {
      console.log(
        "!!!!! ERROR: One or more environment parameters are missing!!!!!"
      );
      console.log("appType = " + argv.appType);
      console.log("testEnv = " + argv.testEnv);
      console.log("projectName = " + argv.projectName);
      console.log("branchName = " + argv.branchName);
      console.log("buildNumber = " + argv.buildNumber);
      console.log("mailingList = " + argv.mailingList);
      console.log("jobResult = " + argv.jobResult);
      console.log("GitHub Actions Run = " + githubActionsRunUrl);
      mailOutput =
        "<p>!!!!! ERROR: One or more environment parameters are missing!!!!!</p><p>&nbsp;appType = " +
        argv.appType +
        "</p><p>&nbsp;testEnv = " +
        argv.testEnv +
        "</p><p>&nbsp;projectName = " +
        argv.projectName +
        "</p><p>&nbsp;branchName = " +
        argv.branchName +
        "</p><p>&nbsp;buildNumber = " +
        argv.buildNumber +
        "</p></p><p>&nbsp;mailingList = " +
        argv.mailingList +
        '</p><p><span style="background-color: #ffffff;"><span style="font-weight: 400;">This test was triggered via \'' +
        argv.triggerSource +
        "' on the '" +
        argv.branchName +
        '\' branch. For GitHub Actions run details, click <a style="background-color: #ffffff;" href=' +
        githubActionsRunUrl +
        '><span style="font-weight: 400;">here</span></a></span></span></p>';
      mailSubject =
        "❌ " +
        argv.appType +
        " | " +
        argv.testEnv +
        " | " +
        reportFolderName +
        " | Error in sending mail";
      mailingList = errorMailingList;
      await sendMail(mailingList, mailSubject, mailOutput, "html", []);
    } else {
      var mailObj1, mailObj2, logData;
      appUrl =
        envData[argv.appType] &&
        envData[argv.appType].environments &&
        envData[argv.appType].environments[argv.testEnv]
          ? envData[argv.appType].environments[argv.testEnv].url
          : "";

      logData = updateLogDataObj(funcReportDir);

      if (!logData) {
        throw new Error(
          "Could not find or parse report log data from " +
            funcReportDir +
            " (no valid changelog.txt or mochawesome/report.json)."
        );
      }

      const attachmentsToSend = [];

      // 1. Functional Report
      if (logData.skipAssertion != true) {
        const mochaReportFile = path.join(funcReportDir, "mochawesome", "report.html");
        const legacyReportFile = path.join(funcReportDir, "index.html");
        const funcHtmlPath = fs.existsSync(mochaReportFile)
          ? mochaReportFile
          : fs.existsSync(legacyReportFile)
          ? legacyReportFile
          : "";

        if (ltShareUrl) console.log("🔗 [MAILER] LambdaTest Shareable URL:", ltShareUrl);

        // Prepare ZIP Attachment (Safe against Antivirus/Chrome Safe Browsing)
        const funcAttachInfo = prepareReportAttachment(
          funcHtmlPath,
          "Functional",
          argv.buildNumber
        );
        if (funcAttachInfo.attachment) {
          attachmentsToSend.push(funcAttachInfo.attachment);
        }
        if (funcAttachInfo.tempFilePath) {
          tempFilesToClean.push(funcAttachInfo.tempFilePath);
        }

        const funcLinks = {
          ltShareUrl: ltShareUrl,
          attachmentStatus: funcAttachInfo.statusText,
        };

        mailObj1 = await createMail(
          logData,
          funcLinks,
          "Functional Automation Test Run"
        );
      }

      // 2. Visual Report (if present)
      if (fs.existsSync(visReportDir)) {
        const visHtmlPath = path.join(visReportDir, "index.html");

        const visAttachInfo = prepareReportAttachment(
          visHtmlPath,
          "Visual",
          argv.buildNumber
        );
        if (visAttachInfo.attachment) {
          attachmentsToSend.push(visAttachInfo.attachment);
        }
        if (visAttachInfo.tempFilePath) {
          tempFilesToClean.push(visAttachInfo.tempFilePath);
        }

        const visLinks = {
          ltShareUrl: ltShareUrl,
          attachmentStatus: visAttachInfo.statusText,
        };

        logData = updateLogDataObj(visReportDir);
        mailObj2 = await createMail(
          logData,
          visLinks,
          "Visual Regression Test Run"
        );
      }

      if (mailObj2 == undefined) {
        mailOutput = mailObj1.mailOutput + mailObj1.lastLine;
        mailSubject = mailObj1.mailSubject;
      } else if (mailObj1 == undefined) {
        mailOutput = mailObj2.mailOutput + mailObj2.lastLine;
        mailSubject = mailObj2.mailSubject;
      } else {
        mailOutput =
          mailObj1.mailOutput +
          "<!DOCTYPE html><html><body><br></body></html>" +
          mailObj2.mailOutput +
          mailObj1.lastLine;
        if (mailObj1.status == "passed" && mailObj2.status == "passed")
          mailSubject =
            "✔️ " +
            argv.appType +
            " | " +
            argv.testEnv.toUpperCase() +
            " | " +
            reportFolderName +
            " | PASSED";
        else if (mailObj1.status == "error" || mailObj2.status == "error")
          mailSubject =
            "❌ " +
            argv.appType +
            " | " +
            argv.testEnv.toUpperCase() +
            " | " +
            reportFolderName +
            " | Error in sending mail";
        else
          mailSubject =
            "❌ " +
            argv.appType +
            " | " +
            argv.testEnv.toUpperCase() +
            " | " +
            reportFolderName +
            " | FAILED";
      }

      console.log(mailSubject);
      console.log(mailOutput);
      await sendMail(mailingList, mailSubject, mailOutput, "html", attachmentsToSend);
    }
  } catch (err) {
    console.log(
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Error !!!!!!!!!!!!!!!!!!!!!!!!!!"
    );
    console.log(err);
    mailOutput = err.toString();
    mailSubject =
      "❌ " +
      argv.appType +
      " | " +
      argv.testEnv +
      " | " +
      reportFolderName +
      " | Error in sending Mail";
    await sendMail(errorMailingList, mailSubject, mailOutput, "text", []);
  } finally {
    // Cleanup temporary zip files
    if (tempFilesToClean.length > 0) {
      tempFilesToClean.forEach((f) => {
        try {
          if (fs.existsSync(f)) {
            fs.unlinkSync(f);
            console.log("🧹 [MAILER] Cleaned up temporary attachment file:", f);
          }
        } catch (_) {}
      });
    }
  }
}
main().catch(function (err) {
  console.log(err);
  throw err;
});

async function createMail(logData, linksObj, mailTitle) {
  let tc_passed = logData.state.tc_passed;
  let tc_failed = logData.state.tc_failed;
  let tc_skipped = logData.state.tc_skipped;
  let tc_total = tc_passed + tc_failed + tc_skipped;
  let testExecFile = logData.specs.toString();
  let tc_status = tc_total == tc_passed ? "passed" : "failed";
  let envDetail, output, subject, jobDetails;
  let appVersion = logData.appVersion;

  if (logData.capabilities.pixelRatio == undefined) {
    envDetail =
      logData.capabilities.platformName.toUpperCase() +
      "<br>" +
      logData.capabilities.browserName.toUpperCase() +
      " " +
      logData.capabilities.browserVersion +
      "<br>" +
      logData.capabilities.screenResolution.width +
      "x" +
      logData.capabilities.screenResolution.height;
  } else {
    let deviceScreenSize = logData.capabilities.deviceScreenSize.split("x");
    let browserWidth = Math.floor(
      parseInt(deviceScreenSize[0]) / logData.capabilities.pixelRatio
    );
    let browserHeight = Math.floor(
      parseInt(deviceScreenSize[1]) / logData.capabilities.pixelRatio
    );
    envDetail =
      logData.capabilities.deviceModel +
      "<br>" +
      logData.capabilities.platformName.toUpperCase() +
      " " +
      logData.capabilities.platformVersion +
      "<br>" +
      logData.capabilities.browserName.toUpperCase() +
      " " +
      logData.capabilities.browserVersion +
      "<br>" +
      browserWidth +
      "x" +
      browserHeight;
  }

  const ltUrl = linksObj && linksObj.ltShareUrl ? linksObj.ltShareUrl : "";
  const attachStatus = linksObj && linksObj.attachmentStatus ? linksObj.attachmentStatus : "";

  if (
    null == tc_passed ||
    null == tc_failed ||
    !envDetail ||
    !appUrl ||
    tc_total == 0
  ) {
    console.log(mailTitle);
    console.log(
      "!!!!! ERROR: One or more details are missing in the timeline report log file !!!!!"
    );
    console.log("tc_total = " + tc_total);
    console.log("tc_passed = " + tc_passed);
    console.log("tc_failed = " + tc_failed);
    console.log("tc_skipped = " + tc_skipped);
    console.log("appUrl = " + appUrl);
    console.log("appVersion = " + appVersion);
    console.log("envDetail = " + envDetail);
    console.log("testExecFile = " + testExecFile);
    output =
      "<p><strong>" +
      mailTitle +
      " (" +
      argv.testEnv.toUpperCase() +
      ")</strong></p><p>!!!!! ERROR: One or more parameter are missing/invalid for the report to publish successfully !!!!!</p><p>appType = " +
      argv.appType +
      "</p><p>testEnv = " +
      argv.testEnv +
      "</p><p>projectName = " +
      argv.projectName +
      "</p><p>branchName = " +
      argv.branchName +
      "</p><p>buildNumber = " +
      argv.buildNumber +
      "</p><p>testExecFile = " +
      testExecFile +
      "</p><p>tc_total = " +
      tc_total +
      "</p><p>tc_passed = " +
      tc_passed +
      "</p><p>tc_failed = " +
      tc_failed +
      "</p><p>tc_skipped = " +
      tc_skipped +
      "</p><p>appURL = " +
      appUrl +
      "</p><p>Environment = " +
      envDetail +
      (ltUrl ? "</p><p>lambdaTestReport = " + ltUrl : "") +
      '</p>';
    jobDetails =
      '<p><span style="font-weight: 400;">This test was triggered via \'' +
      argv.triggerSource +
      "' on the '" +
      argv.branchName +
      "' branch. For GitHub Actions run details, click <a style=background-color: #ffffff;\" href=" +
      githubActionsRunUrl +
      "><span>here</span></a></span></p></body></html>";
    subject =
      "❌ " +
      argv.appType +
      " | " +
      argv.testEnv.toUpperCase() +
      " | " +
      reportFolderName +
      " | Error in sending Mail";
    tc_status = "error";
    mailingList = errorMailingList;
  } else {
    let tableRows =
      '<tr><td style="width:140px;"><strong>Build#</strong></td><td><span>' +
      argv.buildNumber +
      '</span></td></tr><tr><td><strong>Total Test</strong></td><td><strong><span style="color: #0000ff;">' +
      tc_total +
      '</span></strong></td></tr><tr><td><strong>Passed</strong></td><td><strong><span style="color: #3db67a;">' +
      tc_passed +
      '</span></strong></td></tr><tr><td><strong>Failed</strong></td><td><strong><span style="color: #ff0000;">' +
      tc_failed +
      '</span></strong></td></tr><tr><td><strong>Skipped</strong></td><td><strong><span style="color: #ff9900;">' +
      tc_skipped +
      "</span></strong></td></tr><tr><td><strong>Status</strong></td><td>" +
      tc_status.toUpperCase() +
      "</td></tr><tr><td><strong>Environment&nbsp;</strong></td><td>" +
      envDetail +
      "</td></tr><tr><td><strong>Test File&nbsp;</strong></td><td>" +
      testExecFile +
      "</td></tr><tr><td><strong>Application Url</strong></td><td><a href=" +
      appUrl +
      "><span>" +
      appUrl +
      "</span></a></td></tr><tr><td><strong>Application Version&nbsp;</strong></td><td>" +
      appVersion +
      "</td></tr>";

    if (ltUrl) {
      tableRows +=
        '<tr><td><strong>LambdaTest Report</strong></td><td style="white-space: nowrap;"><a href=' +
        ltUrl +
        "><span>" +
        ltUrl +
        "</span></a></td></tr>";
    }

    if (attachStatus) {
      tableRows +=
        '<tr><td><strong>Report Attachment</strong></td><td><span>' +
        attachStatus +
        "</span></td></tr>";
    }

    output =
      '<!DOCTYPE html><html> <head><style> table, td { padding: 5px; border: 1.5px solid #D3D3D3; border-collapse: collapse; font-size: 14px; font-family: Arial; } </style> </head> <body><h2 style="font-family: Arial;"><strong>' +
      mailTitle +
      " (" +
      argv.testEnv.toUpperCase() +
      ')</strong>&nbsp;</h2><table style="width: 560px;"><tbody>' +
      tableRows +
      "</tbody></table>";

    if (tc_status == "passed")
      subject =
        "✔️ " +
        argv.appType +
        " | " +
        argv.testEnv.toUpperCase() +
        " | " +
        reportFolderName +
        " | " +
        tc_status.toUpperCase();
    else
      subject =
        "❌ " +
        argv.appType +
        " | " +
        argv.testEnv.toUpperCase() +
        " | " +
        reportFolderName +
        " | " +
        tc_status.toUpperCase();
    jobDetails =
      '<p><span style="font-family: Arial; font-size: 14px;">This test was triggered via \'' +
      argv.triggerSource +
      "' on the '" +
      argv.branchName +
      "' branch. For GitHub Actions run details, click <a style=background-color: #ffffff;\" href=" +
      githubActionsRunUrl +
      "><span>here</span></a></span></p></body></html>";
    mailingList = argv.mailingList;
  }

  return {
    status: tc_status,
    mailSubject: subject,
    mailOutput: output,
    lastLine: jobDetails,
  };
}

async function sendMail(mailingList, mailsubject, content, contentType, attachments = []) {
  let info;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: argv.emailId,
      pass: argv.emailPwd,
    },
  });

  const validAttachments = (attachments || []).filter(Boolean);

  let mailOptions = {
    from: '"C1-test-report" <' + argv.emailId + ">", // sender address
    to: mailingList,
    subject: mailsubject,
    [contentType === "html" ? "html" : "text"]: content,
    attachments: validAttachments,
  };

  try {
    info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (err) {
    if (validAttachments.length > 0) {
      console.warn(
        "⚠️ [MAILER] Failed to send email with attachments (" +
          err.message +
          "). Retrying without attachments..."
      );
      delete mailOptions.attachments;
      info = await transporter.sendMail(mailOptions);
      console.log("✅ Fallback message sent (without attachments): %s", info.messageId);
    } else {
      throw err;
    }
  }
}

function updateLogDataObj(dir) {
  var logData;
  var changelogFile = dir + "/changelog.txt";
  var mochawesomeFile = dir + "/mochawesome/report.json";

  console.log("Checking for log files in: " + dir);
  try {
    if (fs.existsSync(changelogFile)) {
      var specs = [];
      let tc_status = {
        tc_passed: 0,
        tc_failed: 0,
        tc_skipped: 0,
      };
      const functionalLogFiles = fs
        .readFileSync(changelogFile, "utf-8")
        .split("\n")
        .filter((line) => line !== "");

      Array.from(new Set(functionalLogFiles))
        .filter((line) => line !== "")
        .forEach((file) => {
          try {
            var reportLogPath = `${dir}/${file}`;
            if (
              fs.existsSync(reportLogPath) &&
              fs.readFileSync(reportLogPath).length > 0
            ) {
              console.log(reportLogPath);
              logData = JSON.parse(fs.readFileSync(reportLogPath));
              specs.push(logData.specs.toString());
              tc_status.tc_passed = tc_status.tc_passed + logData.state.passed;
              tc_status.tc_failed = tc_status.tc_failed + logData.state.failed;
              tc_status.tc_skipped =
                tc_status.tc_skipped + logData.state.skipped;
              logData.state = tc_status;
              logData.specs = specs;
            }
          } catch (error) {
            console.error(error);
          }
        });
    } else if (fs.existsSync(mochawesomeFile)) {
      console.log("Found mochawesome report: " + mochawesomeFile);
      var rawData = fs.readFileSync(mochawesomeFile, "utf-8");
      var mochaData = JSON.parse(rawData);

      logData = {
        state: {
          tc_passed: mochaData.stats ? mochaData.stats.passes || 0 : 0,
          tc_failed: mochaData.stats ? mochaData.stats.failures || 0 : 0,
          tc_skipped: mochaData.stats ? mochaData.stats.pending || 0 : 0,
        },
        specs: [],
        capabilities: mochaData.capabilities || {
          pixelRatio: undefined,
          platformName: "N/A",
          browserName: "N/A",
          browserVersion: "",
          screenResolution: { width: "N/A", height: "N/A" },
        },
        appVersion: "N/A",
        skipAssertion: false,
      };

      if (mochaData.results && mochaData.results.length > 0) {
        let specsSet = new Set();

        function extractSpecs(suites) {
          if (!suites || suites.length === 0) return;
          suites.forEach((suite) => {
            if (
              suite.file &&
              typeof suite.file === "string" &&
              suite.file.trim() !== ""
            ) {
              specsSet.add(
                suite.file.split(/[\\/]/).pop().replace(/\.js$/, ".json")
              );
            } else if (
              suite.fullFile &&
              typeof suite.fullFile === "string" &&
              suite.fullFile.trim() !== ""
            ) {
              specsSet.add(
                suite.fullFile.split(/[\\/]/).pop().replace(/\.js$/, ".json")
              );
            }
            if (suite.suites && suite.suites.length > 0) {
              extractSpecs(suite.suites);
            }
          });
        }

        mochaData.results.forEach((result) => {
          if (
            result.file &&
            typeof result.file === "string" &&
            result.file.trim() !== ""
          ) {
            specsSet.add(
              result.file.split(/[\\/]/).pop().replace(/\.js$/, ".json")
            );
          } else if (
            result.fullFile &&
            typeof result.fullFile === "string" &&
            result.fullFile.trim() !== ""
          ) {
            specsSet.add(
              result.fullFile.split(/[\\/]/).pop().replace(/\.js$/, ".json")
            );
          }
          if (result.suites && result.suites.length > 0) {
            extractSpecs(result.suites);
          }
        });

        logData.specs = Array.from(specsSet);
      }
      if (logData.specs.length === 0) logData.specs.push("Functional Test Run");
    } else {
      console.log(
        "No valid changelog.txt or mochawesome/report.json found in " + dir
      );
    }
  } catch (err) {
    console.error(err);
  }
  return logData;
}
