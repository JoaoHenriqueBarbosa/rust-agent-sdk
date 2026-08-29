// var: require_limit
var require_limit = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.formatLimitDefinition = void 0;
  var ajv_1 = require_ajv(), codegen_1 = require_codegen(), ops = codegen_1.operators, KWDs = {
    formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
    formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
    formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
  }, error44 = {
    message: ({ keyword, schemaCode }) => codegen_1.str`should be ${KWDs[keyword].okStr} ${schemaCode}`,
    params: ({ keyword, schemaCode }) => codegen_1._`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
  };
  exports.formatLimitDefinition = {
    keyword: Object.keys(KWDs),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: error44,
    code(cxt) {
      let { gen, data, schemaCode, keyword, it } = cxt, { opts, self: self2 } = it;
      if (!opts.validateFormats)
        return;
      let fCxt = new ajv_1.KeywordCxt(it, self2.RULES.all.format.definition, "format");
      if (fCxt.$data)
        validate$DataFormat();
      else
        validateFormat();
      function validate$DataFormat() {
        let fmts = gen.scopeValue("formats", {
          ref: self2.formats,
          code: opts.code.formats
        }), fmt = gen.const("fmt", codegen_1._`${fmts}[${fCxt.schemaCode}]`);
        cxt.fail$data((0, codegen_1.or)(codegen_1._`typeof ${fmt} != "object"`, codegen_1._`${fmt} instanceof RegExp`, codegen_1._`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
      }
      function validateFormat() {
        let format4 = fCxt.schema, fmtDef = self2.formats[format4];
        if (!fmtDef || fmtDef === !0)
          return;
        if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function")
          throw Error(`"${keyword}": format "${format4}" does not define "compare" function`);
        let fmt = gen.scopeValue("formats", {
          key: format4,
          ref: fmtDef,
          code: opts.code.formats ? codegen_1._`${opts.code.formats}${(0, codegen_1.getProperty)(format4)}` : void 0
        });
        cxt.fail$data(compareCode(fmt));
      }
      function compareCode(fmt) {
        return codegen_1._`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  var formatLimitPlugin = (ajv) => {
    return ajv.addKeyword(exports.formatLimitDefinition), ajv;
  };
  exports.default = formatLimitPlugin;
});
