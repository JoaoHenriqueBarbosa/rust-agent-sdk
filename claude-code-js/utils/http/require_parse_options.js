// var: require_parse_options
var require_parse_options = __commonJS((exports, module) => {
  var looseOption = Object.freeze({ loose: !0 }), emptyOpts = Object.freeze({}), parseOptions = (options) => {
    if (!options)
      return emptyOpts;
    if (typeof options !== "object")
      return looseOption;
    return options;
  };
  module.exports = parseOptions;
});
