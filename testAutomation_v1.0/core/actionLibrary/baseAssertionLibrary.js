"use strict";
// [2026-06-11] Playwright migration (Prompt 4 / Phase 1) — confirmed by user.
// Chai replaced with the STANDALONE auto-retrying expect from @playwright/test
// (import only — the @playwright/test RUNNER is NOT used; decision D1/D5).
// Public API (assert, assertEqual, ...) and the skipAssertion noop-at-module-load
// behaviour (ADR-008) are preserved EXACTLY.
const { expect } = require("@playwright/test");

/*******************************************************************
Skip Assertions  (ADR-008 — unchanged)
On basis of skipAssertion parameter (True/False/missing):
  #True               : skip the assertions in the testcases
  #False / undefined  : execute the assertions
********************************************************************/

function noop() {
    //No Operation Performed...
}

// chai's assert.typeOf used a "kindOf" string (e.g. 'array', 'string', 'object').
// Replicate the common cases so typeOf keeps the same contract under expect.
function kindOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

//add new assertion type in the object: assertionList
var assertionList = {

    assert: async function (actual, message) {
        await logger.logInto(await stackTrace.get(), message);
        // chai assert(actual) = truthy check.
        expect(actual, message).toBeTruthy();
    },

    assertEqual: async function (actual, expected, message) {
        await logger.logInto(await stackTrace.get(), message);
        // chai assert.equal used LOOSE equality (==). Preserve that exact semantics
        // (ADR-009 loose-equality convention) so previously-passing tests are unaffected,
        // while routing the failure through expect for a clear thrown error.
        expect(actual == expected, `${message} [expected ${actual} == ${expected}]`).toBe(true);
    },

    assertNotEqual: async function (actual, expected, message) {
        await logger.logInto(await stackTrace.get(), message);
        // chai assert.notEqual used loose inequality (!=). Preserve it.
        expect(actual != expected, `${message} [expected ${actual} != ${expected}]`).toBe(true);
    },

    isNotNaN: async function (actual, message) {
        await logger.logInto(await stackTrace.get(), message);
        expect(Number.isNaN(actual), message).toBe(false);
    },

    typeOf: async function (value, name, message) {
        await logger.logInto(await stackTrace.get(), message);
        expect(kindOf(value), message).toBe(String(name).toLowerCase());
    },

    assertFail: async function (message) {
        await logger.logInto(await stackTrace.get(), message);
        // chai assert.fail always throws — mirror with an always-failing expect.
        expect(true, message || "assertFail").toBe(false);
    },

    isAtMost: async function (valueToCheck, valueToBeAtMost, message) {
        await logger.logInto(await stackTrace.get(), message);
        expect(valueToCheck, message).toBeLessThanOrEqual(valueToBeAtMost);
    }
};

function _evaluateAndAssert(skipAssertion) {
    var out = {};
    var keys = Object.keys(assertionList);

    keys.forEach(function (k) {
        if (skipAssertion == true) {
            out[k] = noop;
            return;
        } else { //skipAssertion is missing / false
            out[k] = assertionList[k];
        }
    });
    return out;
}

// skipAssertion resolved ONCE at module load — identical to the Chai version (ADR-008).
module.exports = _evaluateAndAssert(argv.skipAssertion);
