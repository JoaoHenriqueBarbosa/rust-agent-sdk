// var: require_limitNumber
var require_limitNumber = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), ops = codegen_1.operators, KWDs = {
    maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
    minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
    exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
    exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
  }, error44 = {
    message: ({ keyword, schemaCode }) => codegen_1.str`must be ${KWDs[keyword].okStr} ${schemaCode}`,
    params: ({ keyword, schemaCode }) => codegen_1._`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
  }, def2 = {
    keyword: Object.keys(KWDs),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: error44,
    code(cxt) {
      let { keyword, data, schemaCode } = cxt;
      cxt.fail$data(codegen_1._`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
    }
  };
  exports.default = def2;
});
