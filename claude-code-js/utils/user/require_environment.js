// var: require_environment
var require_environment = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getStringListFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = exports.getNumberFromEnv = void 0;
  var api_1 = require_src7(), util_1 = __require("util");
  function getNumberFromEnv(key2) {
    let raw = process.env[key2];
    if (raw == null || raw.trim() === "")
      return;
    let value = Number(raw);
    if (isNaN(value)) {
      api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)} for ${key2}, expected a number, using defaults`);
      return;
    }
    return value;
  }
  exports.getNumberFromEnv = getNumberFromEnv;
  function getStringFromEnv(key2) {
    let raw = process.env[key2];
    if (raw == null || raw.trim() === "")
      return;
    return raw;
  }
  exports.getStringFromEnv = getStringFromEnv;
  function getBooleanFromEnv(key2) {
    let raw = process.env[key2]?.trim().toLowerCase();
    if (raw == null || raw === "")
      return !1;
    if (raw === "true")
      return !0;
    else if (raw === "false")
      return !1;
    else
      return api_1.diag.warn(`Unknown value ${(0, util_1.inspect)(raw)} for ${key2}, expected 'true' or 'false', falling back to 'false' (default)`), !1;
  }
  exports.getBooleanFromEnv = getBooleanFromEnv;
  function getStringListFromEnv(key2) {
    return getStringFromEnv(key2)?.split(",").map((v2) => v2.trim()).filter((s2) => s2 !== "");
  }
  exports.getStringListFromEnv = getStringListFromEnv;
});
