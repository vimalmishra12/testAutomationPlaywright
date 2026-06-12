"use strict";

/**
 * Framework runtime config (Prompt 4 / Phase 2).
 *
 * Replaces the single field the logging utilities used to read from wdio.conf.js
 * (`config.logFormat`). Extracting it here removes the last RUNTIME dependency on
 * wdio.conf.js so that file can be retired (decision D10). Shaped as `{ config }`
 * to match the previous `require('../../wdio.conf.js').config` call sites.
 */
module.exports = {
    config: {
        // Winston logger format key (see core/utils/logger.js).
        logFormat: "jsonFileFormat"
    }
};
