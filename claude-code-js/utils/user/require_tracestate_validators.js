// var: require_tracestate_validators
var require_tracestate_validators = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validateValue = exports.validateKey = void 0;
  var VALID_KEY_CHAR_RANGE = "[_0-9a-z-*/]", VALID_KEY = `[a-z]${VALID_KEY_CHAR_RANGE}{0,255}`, VALID_VENDOR_KEY = `[a-z0-9]${VALID_KEY_CHAR_RANGE}{0,240}@[a-z]${VALID_KEY_CHAR_RANGE}{0,13}`, VALID_KEY_REGEX = new RegExp(`^(?:${VALID_KEY}|${VALID_VENDOR_KEY})$`), VALID_VALUE_BASE_REGEX = /^[ -~]{0,255}[!-~]$/, INVALID_VALUE_COMMA_EQUAL_REGEX = /,|=/;
  function validateKey(key2) {
    return VALID_KEY_REGEX.test(key2);
  }
  exports.validateKey = validateKey;
  function validateValue(value) {
    return VALID_VALUE_BASE_REGEX.test(value) && !INVALID_VALUE_COMMA_EQUAL_REGEX.test(value);
  }
  exports.validateValue = validateValue;
});
