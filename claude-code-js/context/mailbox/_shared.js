// Shared module state and imports
// Original: src/context/mailbox.tsx
var import_compiler_runtime18, import_react29, jsx_dev_runtime21, MailboxContext;

// node_modules/readdirp/esm/index.js
import { stat as stat7, lstat, readdir as readdir4, realpath as realpath3 } from "fs/promises";
import { Readable as Readable9 } from "stream";
import { resolve as presolve, relative as prelative, join as pjoin, sep as psep } from "path";
var EntryTypes, defaultOptions, RECURSIVE_ERROR_CODE = "READDIRP_RECURSIVE_ERROR", NORMAL_FLOW_ERRORS, ALL_TYPES, DIR_TYPES, FILE_TYPES2, isNormalFlowError = (error44) => NORMAL_FLOW_ERRORS.has(error44.code), wantBigintFsStats, emptyFn = (_entryInfo) => !0, normalizeFilter = (filter2) => {
  if (filter2 === void 0)
    return emptyFn;
  if (typeof filter2 === "function")
    return filter2;
  if (typeof filter2 === "string") {
    let fl = filter2.trim();
    return (entry) => entry.basename === fl;
  }
  if (Array.isArray(filter2)) {
    let trItems = filter2.map((item) => item.trim());
    return (entry) => trItems.some((f) => entry.basename === f);
  }
  return emptyFn;
}, ReaddirpStream;

// node_modules/chokidar/esm/handler.js
import { watchFile as watchFile3, unwatchFile as unwatchFile3, watch as fs_watch } from "fs";
import { open as open4, stat as stat8, lstat as lstat2, realpath as fsrealpath } from "fs/promises";
import * as sysPath from "path";
import { type as osType } from "os";


// node_modules/chokidar/esm/index.js
import { stat as statcb } from "fs";
import { stat as stat9, readdir as readdir5 } from "fs/promises";
import { EventEmitter as EventEmitter4 } from "events";
import * as sysPath2 from "path";



