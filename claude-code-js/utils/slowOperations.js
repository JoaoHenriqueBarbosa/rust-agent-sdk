// Original: src/utils/slowOperations.ts
import {
  closeSync,
  writeFileSync as fsWriteFileSync,
  fsyncSync,
  openSync
} from "fs";
function slowLoggingExternal() {
  return NOOP_LOGGER;
}
function jsonStringify(value, replacer, space) {
  let __stack = [];
  try {
    const _ = __using(__stack, slowLogging`JSON.stringify(${value})`, 0);
    return JSON.stringify(value, replacer, space);
  } catch (_catch) {
    var _err = _catch, _hasErr = 1;
  } finally {
    __callDispose(__stack, _err, _hasErr);
  }
}
function clone(value, options) {
  let __stack = [];
  try {
    const _ = __using(__stack, slowLogging`structuredClone(${value})`, 0);
    return structuredClone(value, options);
  } catch (_catch) {
    var _err = _catch, _hasErr = 1;
  } finally {
    __callDispose(__stack, _err, _hasErr);
  }
}
function writeFileSync_DEPRECATED(filePath, data, options) {
  let __stack = [];
  try {
    const _ = __using(__stack, slowLogging`fs.writeFileSync(${filePath}, ${data})`, 0);
    let needsFlush = options !== null && typeof options === "object" && "flush" in options && options.flush === !0;
    if (needsFlush) {
      let encoding = typeof options === "object" && "encoding" in options ? options.encoding : void 0, mode = typeof options === "object" && "mode" in options ? options.mode : void 0, fd;
      try {
        fd = openSync(filePath, "w", mode), fsWriteFileSync(fd, data, { encoding: encoding ?? void 0 }), fsyncSync(fd);
      } finally {
        if (fd !== void 0)
          closeSync(fd);
      }
    } else
      fsWriteFileSync(filePath, data, options);
  } catch (_catch) {
    var _err = _catch, _hasErr = 1;
  } finally {
    __callDispose(__stack, _err, _hasErr);
  }
}
var SLOW_OPERATION_THRESHOLD_MS, NOOP_LOGGER, slowLogging, jsonParse = (text, reviver) => {
  let __stack = [];
  try {
    const _ = __using(__stack, slowLogging`JSON.parse(${text})`, 0);
    return typeof reviver > "u" ? JSON.parse(text) : JSON.parse(text, reviver);
  } catch (_catch) {
    var _err = _catch, _hasErr = 1;
  } finally {
    __callDispose(__stack, _err, _hasErr);
  }
};
var init_slowOperations = __esm(() => {
  init_debug();
  SLOW_OPERATION_THRESHOLD_MS = (() => {
    let envValue = process.env.CLAUDE_CODE_SLOW_OPERATION_THRESHOLD_MS;
    if (envValue !== void 0) {
      let parsed = Number(envValue);
      if (!Number.isNaN(parsed) && parsed >= 0)
        return parsed;
    }
    return 20;
  })(), NOOP_LOGGER = { [Symbol.dispose]() {} };
  slowLogging = slowLoggingExternal;
});
