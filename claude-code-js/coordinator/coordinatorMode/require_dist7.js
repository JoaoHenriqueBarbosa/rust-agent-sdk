// var: require_dist7
var require_dist7 = __commonJS((exports, module) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var formats_1 = require_formats(), limit_1 = require_limit(), codegen_1 = require_codegen(), fullName = new codegen_1.Name("fullFormats"), fastName = new codegen_1.Name("fastFormats"), formatsPlugin = (ajv, opts = { keywords: !0 }) => {
    if (Array.isArray(opts))
      return addFormats(ajv, opts, formats_1.fullFormats, fullName), ajv;
    let [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName], list2 = opts.formats || formats_1.formatNames;
    if (addFormats(ajv, list2, formats, exportName), opts.keywords)
      (0, limit_1.default)(ajv);
    return ajv;
  };
  formatsPlugin.get = (name3, mode = "full") => {
    let f = (mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats)[name3];
    if (!f)
      throw Error(`Unknown format "${name3}"`);
    return f;
  };
  function addFormats(ajv, list2, fs16, exportName) {
    var _a3, _b2;
    (_a3 = (_b2 = ajv.opts.code).formats) !== null && _a3 !== void 0 || (_b2.formats = codegen_1._`require("ajv-formats/dist/formats").${exportName}`);
    for (let f of list2)
      ajv.addFormat(f, fs16[f]);
  }
  module.exports = exports = formatsPlugin;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.default = formatsPlugin;
});
