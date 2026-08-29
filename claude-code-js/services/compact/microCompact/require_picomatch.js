// var: require_picomatch
var require_picomatch = __commonJS((exports, module) => {
  var scan = require_scan(), parse10 = require_parse7(), utils = require_utils3(), constants11 = require_constants3(), isObject6 = (val) => val && typeof val === "object" && !Array.isArray(val), picomatch = (glob, options2, returnState = !1) => {
    if (Array.isArray(glob)) {
      let fns = glob.map((input) => picomatch(input, options2, returnState));
      return (str) => {
        for (let isMatch of fns) {
          let state4 = isMatch(str);
          if (state4)
            return state4;
        }
        return !1;
      };
    }
    let isState = isObject6(glob) && glob.tokens && glob.input;
    if (glob === "" || typeof glob !== "string" && !isState)
      throw TypeError("Expected pattern to be a non-empty string");
    let opts = options2 || {}, posix = opts.windows, regex2 = isState ? picomatch.compileRe(glob, options2) : picomatch.makeRe(glob, options2, !1, !0), state3 = regex2.state;
    delete regex2.state;
    let isIgnored = () => !1;
    if (opts.ignore) {
      let ignoreOpts = { ...options2, ignore: null, onMatch: null, onResult: null };
      isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
    }
    let matcher = (input, returnObject = !1) => {
      let { isMatch, match, output } = picomatch.test(input, regex2, options2, { glob, posix }), result = { glob, state: state3, regex: regex2, posix, input, output, match, isMatch };
      if (typeof opts.onResult === "function")
        opts.onResult(result);
      if (isMatch === !1)
        return result.isMatch = !1, returnObject ? result : !1;
      if (isIgnored(input)) {
        if (typeof opts.onIgnore === "function")
          opts.onIgnore(result);
        return result.isMatch = !1, returnObject ? result : !1;
      }
      if (typeof opts.onMatch === "function")
        opts.onMatch(result);
      return returnObject ? result : !0;
    };
    if (returnState)
      matcher.state = state3;
    return matcher;
  };
  picomatch.test = (input, regex2, options2, { glob, posix } = {}) => {
    if (typeof input !== "string")
      throw TypeError("Expected input to be a string");
    if (input === "")
      return { isMatch: !1, output: "" };
    let opts = options2 || {}, format4 = opts.format || (posix ? utils.toPosixSlashes : null), match = input === glob, output = match && format4 ? format4(input) : input;
    if (match === !1)
      output = format4 ? format4(input) : input, match = output === glob;
    if (match === !1 || opts.capture === !0)
      if (opts.matchBase === !0 || opts.basename === !0)
        match = picomatch.matchBase(input, regex2, options2, posix);
      else
        match = regex2.exec(output);
    return { isMatch: Boolean(match), match, output };
  };
  picomatch.matchBase = (input, glob, options2) => {
    return (glob instanceof RegExp ? glob : picomatch.makeRe(glob, options2)).test(utils.basename(input));
  };
  picomatch.isMatch = (str, patterns, options2) => picomatch(patterns, options2)(str);
  picomatch.parse = (pattern, options2) => {
    if (Array.isArray(pattern))
      return pattern.map((p4) => picomatch.parse(p4, options2));
    return parse10(pattern, { ...options2, fastpaths: !1 });
  };
  picomatch.scan = (input, options2) => scan(input, options2);
  picomatch.compileRe = (state3, options2, returnOutput = !1, returnState = !1) => {
    if (returnOutput === !0)
      return state3.output;
    let opts = options2 || {}, prepend = opts.contains ? "" : "^", append2 = opts.contains ? "" : "$", source = `${prepend}(?:${state3.output})${append2}`;
    if (state3 && state3.negated === !0)
      source = `^(?!${source}).*$`;
    let regex2 = picomatch.toRegex(source, options2);
    if (returnState === !0)
      regex2.state = state3;
    return regex2;
  };
  picomatch.makeRe = (input, options2 = {}, returnOutput = !1, returnState = !1) => {
    if (!input || typeof input !== "string")
      throw TypeError("Expected a non-empty string");
    let parsed = { negated: !1, fastpaths: !0 };
    if (options2.fastpaths !== !1 && (input[0] === "." || input[0] === "*"))
      parsed.output = parse10.fastpaths(input, options2);
    if (!parsed.output)
      parsed = parse10(input, options2);
    return picomatch.compileRe(parsed, options2, returnOutput, returnState);
  };
  picomatch.toRegex = (source, options2) => {
    try {
      let opts = options2 || {};
      return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
    } catch (err2) {
      if (options2 && options2.debug === !0)
        throw err2;
      return /$^/;
    }
  };
  picomatch.constants = constants11;
  module.exports = picomatch;
});
