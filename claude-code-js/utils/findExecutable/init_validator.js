// var: init_validator
var init_validator = __esm(() => {
  init_AxiosError();
  validators = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i2) => {
    validators[type] = function(thing) {
      return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
    };
  });
  deprecatedWarnings = {};
  validators.transitional = function(validator, version2, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION2 + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return (value, opt, opts) => {
      if (validator === !1)
        throw new AxiosError_default(formatMessage(opt, " has been removed" + (version2 ? " in " + version2 : "")), AxiosError_default.ERR_DEPRECATED);
      if (version2 && !deprecatedWarnings[opt])
        deprecatedWarnings[opt] = !0, console.warn(formatMessage(opt, " has been deprecated since v" + version2 + " and will be removed in the near future"));
      return validator ? validator(value, opt, opts) : !0;
    };
  };
  validators.spelling = function(correctSpelling) {
    return (value, opt) => {
      return console.warn(`${opt} is likely a misspelling of ${correctSpelling}`), !0;
    };
  };
  validator_default = {
    assertOptions,
    validators
  };
});
