"use strict";
/**
 * Assertion evidence recorder — ADR-025 (pilot, 2026-09-25, user request).
 *
 * Records, per test, WHICH ELEMENT each assertion checked, so the assertion evidence report
 * (core/utils/assertion-report/) can draw a ✔ / ✘ mark on that element in the end-of-test
 * screenshot. Active only with `--assertReport=true`; otherwise every entry point returns
 * at once and the framework behaves exactly as before.
 *
 * WHY THE LOGIC LIVES HERE AND NOT IN THE PROTECTED FILES. baseActionLibrary,
 * baseAssertionLibrary and playwright.setup.js only gain one-line calls into this module
 * (recordRead / wrapAssertions / beginTest / finishTest / finishRun). Everything that can
 * be wrong lives in this one non-protected file, which keeps each protected diff small
 * enough to review at a glance.
 *
 * HOW A CHECK IS LINKED TO AN ELEMENT. Assertions receive VALUES, not elements
 * (`assertion.assertEqual(sts.searchBtnDisplayed, true, …)`), and page objects typically
 * read a dozen values into one object before the test asserts them one by one — so
 * matching on the value alone would link most `true` checks to the wrong element. Instead
 * the link is made by NAME, from the source lines the stack trace points at:
 *   read  : schoolStudents.page.js:185  `searchBtnDisplayed: await action.isDisplayed(…)`
 *           → key "searchBtnDisplayed", made while the test was on the line that assigned `sts`
 *   check : adminStudentsTab.test.js:112 `assertion.assertEqual(sts.searchBtnDisplayed, …)`
 *           → first argument references `sts` . `searchBtnDisplayed`
 * A read matches a check when it was made while evaluating the line that last assigned the
 * referenced variable AND its key is the referenced member. Inline calls
 * (`assertEqual(await po.getCount(), …)`) match the read made on the assertion's own line.
 * Nothing matched → the check is listed with "no element"; a guess is never drawn as fact.
 *
 * Never throws into a test: every public function is wrapped, and a recording failure
 * only costs that check its mark.
 */

const fs = require("fs");
const nodePath = require("path");

function flagOn(v) { return v === true || String(v).toLowerCase() === "true"; }

// global.argv is set by env.conf.js before any framework file is required (same as
// baseAssertionLibrary's skipAssertion read). skipAssertion turns assertions into noops,
// so there would be nothing to evidence — stay off in that mode (ADR-008).
const _argv = global.argv || {};
const ENABLED = flagOn(_argv.assertReport) && !flagOn(_argv.skipAssertion);

// Bounds so a loop that reads thousands of rows cannot grow memory or slow the end-of-test
// measurement: reads beyond the cap drop the OLDEST (checks refer to recent reads).
const MAX_READS_PER_TEST = 3000;
const MAX_TARGETS_PER_CHECK = 3;
const MAX_MEASURED_PER_TEST = 50;
const MAX_ELEMENTS_PER_COUNT = 30;
const MEASURE_TIMEOUT_MS = 1000;

const THIS_FILE = __filename;
const ACTION_LIB_RE = /[\\/]core[\\/]actionLibrary[\\/]base(Action|Assertion)Library\.js$/;
// Test files live under test/<App>/… of the framework root (the run's cwd); page objects under
// pages/. Matched on the path RELATIVE to cwd, so a checkout that itself sits in a folder named
// "test" does not make every frame look like a test file. (test/Manual holds no executed code.)
function isTestFile(file) {
    const rel = nodePath.relative(process.cwd(), file);
    return /^test[\\/]/.test(rel) && !/node_modules/.test(rel);
}

let reads = [];
let checks = [];
let readSeq = 0;
let originSeq = 0;
let lastOriginKey = null;
let testCounter = 0;
let runDir = null;
let runMeta = null;
let testsWritten = 0;

// ── stack + source helpers ───────────────────────────────────────────────────────────

/** Parses the current stack into [{ file, line }], skipping this module's own frames. */
function stackFrames() {
    const prev = Error.stackTraceLimit;
    Error.stackTraceLimit = 40; // page-object helpers nest; the default 10 can lose the test frame
    const stack = String(new Error().stack || "");
    Error.stackTraceLimit = prev;
    const out = [];
    stack.split("\n").slice(1).forEach(function (l) {
        const m = l.match(/\(?((?:[A-Za-z]:)?[^():\s][^():]*):(\d+):(\d+)\)?\s*$/);
        if (!m) return;
        const file = m[1].replace(/^file:\/\//, "");
        if (file === THIS_FILE) return;
        out.push({ file: file, line: Number(m[2]) });
    });
    return out;
}

const _src = new Map();
/** Source lines of a file (cached; null when unreadable). */
function sourceLines(file) {
    if (_src.has(file)) return _src.get(file);
    let lines = null;
    try { lines = fs.readFileSync(file, "utf8").split(/\r?\n/); } catch (_) { lines = null; }
    _src.set(file, lines);
    return lines;
}

const IDENT = "[A-Za-z_$][\\w$]*";

/**
 * The name a read's value is stored under, from the page-object line that made it:
 *   `searchBtnDisplayed: await action.isDisplayed(…)`  → key "searchBtnDisplayed"
 *   `firstName: text(await action.getText(…))`         → key "firstName"
 *   `var label = await action.getAttribute(…)`         → key "label"
 *   `return await action.getElementCount(…)`           → isReturn
 *   `? await action.isDisplayed(…) : false,` (continuation of `selectAllDisplayed: (…)`)
 *                                                       → key from the line above
 */
function readKey(file, line) {
    const lines = sourceLines(file);
    if (!lines) return { key: null, isReturn: false };
    const text = lines[line - 1] || "";
    const at = text.search(/\bawait\s+action\s*\./);
    const prefix = at >= 0 ? text.slice(0, at) : text;
    if (/\breturn\b/.test(prefix) && !/:/.test(prefix)) return { key: null, isReturn: true };
    // The binding nearest to the `await` wins: `var o = { k: await …` → "k".
    let best = null;
    let m;
    const colonRe = new RegExp("(" + IDENT + ")\\s*:(?!:)", "g");
    while ((m = colonRe.exec(prefix))) {
        // `a ? b : c` — a ternary's ':' is not a key. A key is preceded by line start, '{' or ','.
        const before = prefix.slice(0, m.index).trim();
        if (before === "" || /[{,]$/.test(before)) best = { key: m[1], at: m.index };
    }
    const assignRe = new RegExp("(" + IDENT + ")\\s*=(?![=>])", "g");
    while ((m = assignRe.exec(prefix))) {
        if (!best || m.index > best.at) best = { key: m[1], at: m.index };
    }
    if (best) return { key: best.key, isReturn: false };
    // Continuation line (`? await …`, `&& await …`, or the await alone): the key is on the
    // line that opened the expression.
    if (/^\s*(\?|:|&&|\|\||\(|)\s*$/.test(prefix)) {
        for (let i = line - 2; i >= Math.max(0, line - 4); i--) {
            const up = lines[i] || "";
            const k = up.match(new RegExp("^\\s*(" + IDENT + ")\\s*:(?!:)"));
            if (k) return { key: k[1], isReturn: false };
            const a = up.match(new RegExp("(" + IDENT + ")\\s*=(?![=>])[^=]*$"));
            if (a) return { key: a[1], isReturn: false };
            if (/[;{}]\s*$/.test(up)) break;
        }
    }
    return { key: null, isReturn: false };
}

/**
 * Text of the FIRST argument of the `assertion.<kind>(` call at/above `line`, plus the line
 * span of the whole call. Walks characters so that commas inside strings, template
 * literals, regex literals, brackets and nested calls do not end the argument early.
 */
function firstArgument(file, line, kind) {
    const lines = sourceLines(file);
    if (!lines) return null;
    const callRe = new RegExp("\\bassertion\\s*\\.\\s*" + kind + "\\s*\\(");
    let start = -1;
    for (let i = line - 1; i >= Math.max(0, line - 4); i--) {
        if (callRe.test(lines[i] || "")) { start = i; break; }
    }
    if (start < 0) return null;
    const chunk = lines.slice(start, start + 15).join("\n");
    const open = chunk.search(callRe);
    let i = chunk.indexOf("(", open) + 1;
    let depth = 0, arg = null, prevSig = "(";
    const begin = i;
    for (; i < chunk.length; i++) {
        const c = chunk[i];
        if (c === "'" || c === '"' || c === "`") {
            const q = c; i++;
            while (i < chunk.length && chunk[i] !== q) { if (chunk[i] === "\\") i++; i++; }
            prevSig = q; continue;
        }
        if (c === "/" && chunk[i + 1] === "/") { while (i < chunk.length && chunk[i] !== "\n") i++; continue; }
        if (c === "/" && chunk[i + 1] === "*") { i = chunk.indexOf("*/", i + 2); if (i < 0) break; i++; continue; }
        if (c === "/" && /[(,=:[!&|?{};+\-*%<>~^]/.test(prevSig)) {
            // regex literal
            i++; let inClass = false;
            while (i < chunk.length && (chunk[i] !== "/" || inClass)) {
                if (chunk[i] === "\\") i++;
                else if (chunk[i] === "[") inClass = true;
                else if (chunk[i] === "]") inClass = false;
                i++;
            }
            prevSig = "a"; continue;
        }
        if ("([{".indexOf(c) >= 0) depth++;
        else if (")]}".indexOf(c) >= 0) {
            if (depth === 0) { arg = chunk.slice(begin, i); break; }
            depth--;
        } else if (c === "," && depth === 0) { arg = chunk.slice(begin, i); break; }
        if (!/\s/.test(c)) prevSig = c;
    }
    if (arg === null) return null;
    const endLine = start + chunk.slice(0, i).split("\n").length; // 1-based
    return { text: arg, startLine: start + 1, endLine: endLine };
}

const NOT_A_VARIABLE = new Set(("await typeof instanceof new this true false null undefined " +
    "String Number Boolean Math JSON Object Array Date RegExp parseInt parseFloat isNaN " +
    "testdata assertion browser page argv global").split(" "));

/** Variable references in an expression: `rows[0].firstName` → { root:"rows", member:"firstName", index:0 }. */
function references(expr) {
    // Blank out string / template / regex contents so words inside them are not read as code.
    const code = expr.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, "''").replace(/\/(?:\\.|[^/\n])+\/[gimsuy]*/g, "0");
    const out = [];
    const re = new RegExp("(^|[^\\w$.])(" + IDENT + ")((?:\\s*\\.\\s*" + IDENT + "|\\s*\\[\\s*\\d+\\s*\\])*)", "g");
    let m;
    while ((m = re.exec(code))) {
        const root = m[2];
        if (NOT_A_VARIABLE.has(root)) continue;
        const chainText = m[3] || "";
        const parts = [];
        const partRe = new RegExp("\\.\\s*(" + IDENT + ")|\\[\\s*(\\d+)\\s*\\]", "g");
        let p;
        while ((p = partRe.exec(chainText))) parts.push(p[1] !== undefined ? { name: p[1] } : { index: Number(p[2]) });
        // `x.y.indexOf(` — the last name is a method being CALLED, not a stored value.
        const after = code.slice(m.index + m[0].length);
        if (/^\s*\(/.test(after)) { if (!parts.length) continue; parts.pop(); }
        const names = parts.filter(function (q) { return q.name; });
        const idx = parts.find(function (q) { return q.index !== undefined; });
        out.push({ root: root, member: names.length ? names[names.length - 1].name : null, index: idx ? idx.index : null });
    }
    return out;
}

/** 1-based line that last assigned `root` above `line`, within the same TC function. */
function assignmentLine(file, line, root) {
    const lines = sourceLines(file);
    if (!lines) return null;
    const re = new RegExp("(^|[^\\w$.])" + root.replace(/\$/g, "\\$") + "\\s*=(?![=>])");
    for (let i = line - 1; i >= 0 && i >= line - 300; i--) {
        const t = lines[i] || "";
        if (re.test(t)) return i + 1;
        if (/^\s*TST_\w+\s*:\s*async\s+function/.test(t)) break;
    }
    return null;
}

// ── value helpers ────────────────────────────────────────────────────────────────────

/** A JSON-safe, size-bounded copy of a value for the record. */
function plain(v) {
    if (v instanceof Error) return { error: String(v.message).slice(0, 300) };
    if (v === null || v === undefined || typeof v === "boolean" || typeof v === "number") return v === undefined ? null : v;
    if (typeof v === "string") return v.length > 300 ? v.slice(0, 300) + "…" : v;
    if (Array.isArray(v)) return "[array(" + v.length + ")]";
    if (typeof v === "object" && "value" in v) return plain(v.value); // getCSSProperty's rich object
    try { return String(JSON.stringify(v)).slice(0, 300); } catch (_) { return "[object]"; }
}

function same(a, b) {
    if (a == b) return true; // eslint-disable-line eqeqeq — loose, like assertEqual (ADR-009)
    if (typeof a === "string" && typeof b === "string") return a.replace(/\s+/g, " ").trim() === b.replace(/\s+/g, " ").trim();
    return false;
}

// ── recording (called from the action / assertion libraries) ─────────────────────────

/**
 * Records one element read made through baseActionLibrary.
 * @param {string} action   library method name (isDisplayed, getText, …)
 * @param {*} selector      the CSS string or Locator the page object passed
 * @param {object} locator  the Playwright Locator the library resolved (kept in memory only,
 *                          so the element can be measured at the end of the test)
 * @param {*} value         what the library returned
 * @param {boolean} multi   true for count-type reads (all matches, not just the first)
 */
function recordRead(action, selector, locator, value, multi) {
    if (!ENABLED) return;
    try {
        const frames = stackFrames().filter(function (f) { return !ACTION_LIB_RE.test(f.file); });
        const site = frames[0] || null;
        const testFrame = frames.find(function (f) { return isTestFile(f.file); }) || null;
        const k = site ? readKey(site.file, site.line) : { key: null, isReturn: false };
        const originKey = testFrame ? testFrame.file + ":" + testFrame.line : null;
        if (originKey !== lastOriginKey) { originSeq++; lastOriginKey = originKey; }
        reads.push({
            id: ++readSeq,
            action: action,
            selector: typeof selector === "string" ? selector : describeLocator(selector),
            locator: locator || null,
            multi: !!multi,
            value: plain(value),
            key: k.key,
            isReturn: k.isReturn,
            site: site ? { file: site.file, line: site.line } : null,
            testFile: testFrame ? testFrame.file : null,
            testLine: testFrame ? testFrame.line : null,
            originSeq: originSeq
        });
        if (reads.length > MAX_READS_PER_TEST) reads.shift();
    } catch (_) { /* recording must never affect the test */ }
}

function describeLocator(loc) {
    try { return String(loc).replace(/^Locator@/, ""); } catch (_) { return "[locator]"; }
}

/** Arguments by assertion kind → which one is the actual value / expected / message. */
const ARG_ROLES = {
    assert: { actual: 0, message: 1 },
    assertEqual: { actual: 0, expected: 1, message: 2 },
    assertNotEqual: { actual: 0, expected: 1, message: 2, negate: true },
    isNotNaN: { actual: 0, message: 1 },
    typeOf: { actual: 0, expected: 1, message: 2 },
    assertFail: { message: 0 },
    isAtMost: { actual: 0, expected: 1, message: 2 }
};

/** Finds the reads a check is about (see the header comment for the rules). */
function linkReads(site, kind, actual) {
    const arg = firstArgument(site.file, site.line, kind);
    if (!arg) return { link: "none", reads: [] };
    const found = [];
    let inferred = false;

    // Latest execution of a given test line (a line inside a loop runs many times).
    function latestGroup(pred) {
        const g = reads.filter(function (r) { return r.testFile === site.file && pred(r.testLine); });
        if (!g.length) return [];
        const seq = g[g.length - 1].originSeq;
        return g.filter(function (r) { return r.originSeq === seq; });
    }
    function distinctSelectors(list) {
        return new Set(list.map(function (r) { return r.selector; })).size;
    }

    references(arg.text).forEach(function (ref) {
        const line = assignmentLine(site.file, arg.startLine, ref.root);
        if (!line) return;
        const group = latestGroup(function (l) { return l === line; });
        if (!group.length) return;
        let cands = ref.member
            ? group.filter(function (r) { return r.key === ref.member; })
            : group.filter(function (r) { return r.isReturn; });
        if (!cands.length) return;
        if (ref.member && ref.index !== null) {
            // rows[k].field — k-th element read under that key (one read per row, in order).
            const perEl = [];
            cands.forEach(function (r) { if (!perEl.length || perEl[perEl.length - 1].selector !== r.selector) perEl.push(r); else perEl[perEl.length - 1] = r; });
            if (perEl[ref.index]) { found.push(perEl[ref.index]); return; }
        }
        const valueMatch = cands.filter(function (r) { return same(r.value, actual); });
        const pool = valueMatch.length ? valueMatch : cands;
        if (distinctSelectors(pool) > 1) inferred = true;
        found.push(pool[pool.length - 1]);
    });

    // assertEqual(await po.getCount(), …) — the read happened while evaluating this call.
    if (/\bawait\b/.test(arg.text)) {
        const group = latestGroup(function (l) { return l >= arg.startLine && l <= arg.endLine; });
        if (group.length) {
            const ret = group.filter(function (r) { return r.isReturn; });
            const pool = ret.length ? ret : group;
            if (distinctSelectors(pool) > 1) inferred = true;
            found.push(pool[pool.length - 1]);
        }
    }

    const unique = [];
    found.forEach(function (r) { if (unique.indexOf(r) < 0) unique.push(r); });
    if (!unique.length) return { link: "none", reads: [] };
    return { link: inferred ? "inferred" : "exact", reads: unique.slice(0, MAX_TARGETS_PER_CHECK) };
}

function recordCheck(kind, args, site, passed, err) {
    try {
        const roles = ARG_ROLES[kind] || { actual: 0 };
        const actual = roles.actual !== undefined ? args[roles.actual] : undefined;
        const linked = site ? linkReads(site, kind, actual) : { link: "none", reads: [] };
        checks.push({
            n: checks.length + 1,
            kind: kind,
            status: passed ? "passed" : "failed",
            message: roles.message !== undefined ? String(args[roles.message] === undefined ? "" : args[roles.message]) : "",
            actual: roles.actual !== undefined ? plain(actual) : null,
            expected: roles.expected !== undefined ? plain(args[roles.expected]) : null,
            error: err ? String(err.message || err).split("\n")[0].slice(0, 500) : null,
            link: linked.link,
            readIds: linked.reads.map(function (r) { return r.id; }),
            site: site ? { file: nodePath.relative(process.cwd(), site.file), line: site.line } : null
        });
    } catch (_) { /* recording must never affect the test */ }
}

/**
 * Wraps the assertion functions so each call is recorded with its pass / fail result.
 * The original function runs unchanged and its error is re-thrown as-is, so failure
 * behaviour, messages and the loose-equality semantics (ADR-009) are untouched.
 * Returns the input unchanged when the report is off.
 */
function wrapAssertions(fns) {
    if (!ENABLED) return fns;
    const out = {};
    Object.keys(fns).forEach(function (kind) {
        const fn = fns[kind];
        out[kind] = async function () {
            const args = Array.prototype.slice.call(arguments);
            // Taken synchronously, before any await, so the caller's frame is the test line.
            let site = null;
            try {
                site = stackFrames().find(function (f) { return !ACTION_LIB_RE.test(f.file); }) || null;
            } catch (_) { site = null; }
            try {
                const r = await fn.apply(this, args);
                recordCheck(kind, args, site, true, null);
                return r;
            } catch (e) {
                recordCheck(kind, args, site, false, e);
                throw e;
            }
        };
    });
    return out;
}

// ── test lifecycle (called from playwright.setup.js root hooks) ──────────────────────

/** Root beforeEach: start a fresh record. Reads made by suite-level BeforeEach TCs follow. */
function beginTest() {
    if (!ENABLED) return;
    reads = [];
    checks = [];
    lastOriginKey = null;
}

/** Re-reads the value a check saw, to detect an element that changed before the screenshot. */
async function reread(r, loc) {
    const o = { timeout: MEASURE_TIMEOUT_MS };
    switch (r.action) {
        case "getText": case "getTextIfPresent": return (await loc.innerText(o));
        case "isDisplayed": return (await loc.isVisible());
        case "isEnabled": return (await loc.isEnabled(o));
        case "isSelected": return (await loc.isChecked(o));
        case "getValue": return (await loc.inputValue(o));
        case "isExisting": return (await loc.count()) > 0;
        default: return undefined; // attribute / css / count: not re-read, too many variants
    }
}

/** In-page geometry of one element: document-space box, clipped by scrolling ancestors. */
async function geometry(loc) {
    const bb = await loc.boundingBox({ timeout: MEASURE_TIMEOUT_MS }).catch(function () { return null; });
    if (!bb || bb.width <= 0 || bb.height <= 0) return null;
    // Fraction of the element NOT hidden by an overflow:auto/scroll/hidden ancestor (an
    // inner scroll panel) — the full-page screenshot only shows such a panel's visible part.
    const info = await loc.evaluate(function (node) {
        const r = node.getBoundingClientRect();
        let x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom;
        for (let a = node.parentElement; a && a !== document.documentElement; a = a.parentElement) {
            if (a === document.body) continue;
            const s = getComputedStyle(a);
            if (/(auto|scroll|hidden|clip)/.test(s.overflowX + " " + s.overflowY)) {
                const ar = a.getBoundingClientRect();
                x1 = Math.max(x1, ar.left); y1 = Math.max(y1, ar.top);
                x2 = Math.min(x2, ar.right); y2 = Math.min(y2, ar.bottom);
            }
        }
        const area = Math.max(0, r.width) * Math.max(0, r.height);
        const vis = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
        return { visibleFraction: area > 0 ? vis / area : 0 };
    }, null, { timeout: MEASURE_TIMEOUT_MS }).catch(function () { return { visibleFraction: 1 }; });
    return { bb: bb, visibleFraction: info.visibleFraction };
}

/**
 * Root afterEach, BEFORE the screenshot: measures every linked element where it is now.
 * Returns the per-read measurement map that finishTest stores with the record.
 */
async function measure(page) {
    if (!ENABLED || !page) return null;
    const out = {};
    try {
        const scroll = await page.evaluate(function () { return { x: window.scrollX, y: window.scrollY, dpr: window.devicePixelRatio || 1 }; });
        const ids = [];
        checks.forEach(function (c) { c.readIds.forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); }); });
        const byId = {};
        reads.forEach(function (r) { byId[r.id] = r; });
        for (const id of ids.slice(0, MAX_MEASURED_PER_TEST)) {
            const r = byId[id];
            if (!r) continue;
            out[id] = await measureRead(r, scroll);
        }
        out.__scroll = scroll;
    } catch (_) { /* partial measurements are still useful */ }
    return out;
}

async function measureRead(r, scroll) {
    if (!r.locator) return { state: "noLocator" };
    try {
        let geos = [];
        if (r.multi) {
            const all = await r.locator.all().catch(function () { return []; });
            for (const l of all.slice(0, MAX_ELEMENTS_PER_COUNT)) {
                const g = await geometry(l);
                if (g) geos.push(g);
            }
        } else {
            const g = await geometry(r.locator);
            if (g) geos = [g];
        }
        if (!geos.length) {
            // Nothing to draw. If the check was that the element is NOT there / not shown,
            // that absence is exactly what was checked — say so rather than "missing".
            const negative = (r.action === "isDisplayed" || r.action === "isExisting") && r.value === false;
            return { state: negative ? "absentAsChecked" : "absent" };
        }
        let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity, frac = 0;
        geos.forEach(function (g) {
            // Viewport box + scroll = position in the full-page screenshot. This holds for FIXED
            // elements too: Chromium's full-page capture keeps the scroll position and paints a
            // fixed header where the viewport was, not at the top (verified on the ADR-025 fixture).
            x1 = Math.min(x1, g.bb.x + scroll.x); y1 = Math.min(y1, g.bb.y + scroll.y);
            x2 = Math.max(x2, g.bb.x + scroll.x + g.bb.width); y2 = Math.max(y2, g.bb.y + scroll.y + g.bb.height);
            frac = Math.max(frac, g.visibleFraction);
        });
        const box = { x: Math.round(x1), y: Math.round(y1), w: Math.round(x2 - x1), h: Math.round(y2 - y1) };
        if (!r.multi) {
            const now = await reread(r, r.locator).catch(function () { return undefined; });
            if (now !== undefined && !same(plain(now), r.value)) return { state: "changed", box: box, now: plain(now) };
        }
        if (frac < 0.5) return { state: "clipped", box: box };
        return { state: "shown", box: box, count: r.multi ? geos.length : undefined };
    } catch (e) {
        return { state: "error", error: String(e.message || e).slice(0, 200) };
    }
}

/** PNG width/height from its header (bytes 16–23). */
function pngSize(buf) {
    try { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; } catch (_) { return null; }
}

function ensureRunDir() {
    if (runDir) return runDir;
    const exec = String(_argv.testExecFile || "run").replace(/\.json$/i, "").replace(/[^\w.-]+/g, "_");
    const env = String(_argv.testEnv || "env").replace(/[^\w.-]+/g, "_");
    const d = new Date();
    const pad = function (n) { return String(n).padStart(2, "0"); };
    const stamp = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "_" + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
    runDir = nodePath.join(process.cwd(), "output", "reports", "TestReports", "assertionReport", exec + "_" + env + "_" + stamp);
    fs.mkdirSync(nodePath.join(runDir, "shots"), { recursive: true });
    runMeta = {
        execFile: _argv.testExecFile || null,
        env: _argv.testEnv || null,
        appType: _argv.appType || null,
        startedAt: d.toISOString(),
        endedAt: null
    };
    fs.writeFileSync(nodePath.join(runDir, "run.json"), JSON.stringify(runMeta, null, 2));
    return runDir;
}

/**
 * Root afterEach, AFTER the screenshot: writes this test's record (one JSON line, so a
 * crashed run keeps every finished test) and its screenshot.
 */
function finishTest(test, shotBuffer, measured) {
    if (!ENABLED || !test) return;
    try {
        const dir = ensureRunDir();
        testCounter++;
        let shot = null;
        if (shotBuffer) {
            const name = "shots/" + String(testCounter).padStart(4, "0") + ".png";
            fs.writeFileSync(nodePath.join(dir, name), shotBuffer);
            const px = pngSize(shotBuffer);
            const dpr = (measured && measured.__scroll && measured.__scroll.dpr) || 1;
            shot = { path: name, w: px ? Math.round(px.w / dpr) : null, h: px ? Math.round(px.h / dpr) : null };
        }
        const byId = {};
        reads.forEach(function (r) { byId[r.id] = r; });
        // Mocha leaves `state` unset in afterEach when an attempt failed and WILL be retried
        // (runner.js: the clone is queued before the hook runs), so an unset state is a retry.
        const attempt = typeof test.currentRetry === "function" ? test.currentRetry() : 0;
        const record = {
            index: testCounter,
            title: test.title,
            suite: test.parent ? test.parent.title : "",
            state: test.state || "retried",
            attempt: attempt,
            durationMs: typeof test.duration === "number" ? test.duration : null,
            error: test.err ? String(test.err.message || test.err).slice(0, 2000) : null,
            shot: shot,
            checks: checks.map(function (c) {
                const t = Object.assign({}, c);
                t.targets = c.readIds.map(function (id) {
                    const r = byId[id] || {};
                    const m = (measured && measured[id]) || { state: "notMeasured" };
                    const inShot = m.box && shot && shot.w && shot.h
                        ? (m.box.x < shot.w && m.box.y < shot.h && m.box.x + m.box.w > 0 && m.box.y + m.box.h > 0)
                        : false;
                    return {
                        action: r.action || null,
                        selector: r.selector || null,
                        key: r.key || null,
                        value: r.value === undefined ? null : r.value,
                        state: m.state === "shown" && !inShot ? "offscreen" : m.state,
                        box: m.box || null,
                        now: m.now === undefined ? undefined : m.now,
                        count: m.count
                    };
                });
                delete t.readIds;
                return t;
            }),
            readCount: reads.length
        };
        // Mocha does not put the error on the test object, so the message comes from the failed
        // check. A failure outside any assertion (timeout, a thrown page-object error) has no
        // failed check — say so plainly instead of leaving the reader to guess.
        if (!record.error && (record.state === "failed" || record.state === "retried")) {
            const f = record.checks.find(function (c) { return c.status === "failed"; });
            record.error = f ? f.error
                : "Failed outside an assertion (for example a timeout or an error thrown by a page object) — see the console output or the mochawesome report for the error.";
        }
        fs.appendFileSync(nodePath.join(dir, "evidence.jsonl"), JSON.stringify(record) + "\n");
        testsWritten++;
    } catch (e) {
        console.log("[assert-report] could not record test:", e.message);
    } finally {
        reads = [];
        checks = [];
    }
}

/** Root afterAll: build the report from what the run wrote. */
function finishRun() {
    if (!ENABLED || !runDir || !testsWritten) return null;
    try {
        runMeta.endedAt = new Date().toISOString();
        fs.writeFileSync(nodePath.join(runDir, "run.json"), JSON.stringify(runMeta, null, 2));
        const out = require("./assertion-report/buildAssertionReport.js").build(runDir);
        console.log("[assert-report] Assertion evidence report: " + out);
        return out;
    } catch (e) {
        console.log("[assert-report] report build failed (" + e.message + "). Rebuild with: node core/utils/assertion-report/buildAssertionReport.js --from=\"" + runDir + "\"");
        return null;
    }
}

module.exports = {
    enabled: ENABLED,
    recordRead: recordRead,
    wrapAssertions: wrapAssertions,
    beginTest: beginTest,
    measure: measure,
    finishTest: finishTest,
    finishRun: finishRun,
    // exported for the fixture test only
    _internal: { readKey: readKey, firstArgument: firstArgument, references: references, assignmentLine: assignmentLine }
};
