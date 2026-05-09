// var: require_node
var require_node = __commonJS((exports, module) => {
  var tty4 = __require("tty"), util = __require("util");
  exports.init = init;
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load2;
  exports.useColors = useColors;
  exports.destroy = util.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  exports.colors = [6, 2, 3, 4, 5, 1];
  try {
    let supportsColor2 = require_supports_color();
    if (supportsColor2 && (supportsColor2.stderr || supportsColor2).level >= 2)
      exports.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ];
  } catch (error41) {}
  exports.inspectOpts = Object.keys(process.env).filter((key) => {
    return /^debug_/i.test(key);
  }).reduce((obj, key) => {
    let prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
      return k.toUpperCase();
    }), val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val))
      val = !0;
    else if (/^(no|off|false|disabled)$/i.test(val))
      val = !1;
    else if (val === "null")
      val = null;
    else
      val = Number(val);
    return obj[prop] = val, obj;
  }, {});
  function useColors() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty4.isatty(process.stderr.fd);
  }
  function formatArgs(args) {
    let { namespace: name, useColors: useColors2 } = this;
    if (useColors2) {
      let c3 = this.color, colorCode = "\x1B[3" + (c3 < 8 ? c3 : "8;5;" + c3), prefix = `  ${colorCode};1m${name} \x1B[0m`;
      args[0] = prefix + args[0].split(`
`).join(`
` + prefix), args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1B[0m");
    } else
      args[0] = getDate() + name + " " + args[0];
  }
  function getDate() {
    if (exports.inspectOpts.hideDate)
      return "";
    return (/* @__PURE__ */ new Date()).toISOString() + " ";
  }
  function log(...args) {
    return process.stderr.write(util.formatWithOptions(exports.inspectOpts, ...args) + `
`);
  }
  function save(namespaces) {
    if (namespaces)
      process.env.DEBUG = namespaces;
    else
      delete process.env.DEBUG;
  }
  function load2() {
    return process.env.DEBUG;
  }
  function init(debug) {
    debug.inspectOpts = {};
    let keys2 = Object.keys(exports.inspectOpts);
    for (let i2 = 0;i2 < keys2.length; i2++)
      debug.inspectOpts[keys2[i2]] = exports.inspectOpts[keys2[i2]];
  }
  module.exports = require_common()(exports);
  var { formatters } = module.exports;
  formatters.o = function(v) {
    return this.inspectOpts.colors = this.useColors, util.inspect(v, this.inspectOpts).split(`
`).map((str) => str.trim()).join(" ");
  };
  formatters.O = function(v) {
    return this.inspectOpts.colors = this.useColors, util.inspect(v, this.inspectOpts);
  };
});
