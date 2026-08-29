// var: require_limitLength
var require_limitLength = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), ucs2length_1 = require_ucs2length(), error44 = {
    message({ keyword, schemaCode }) {
      let comp = keyword === "maxLength" ? "more" : "fewer";
      return codegen_1.str`must NOT have ${comp} than ${schemaCode} characters`;
    },
    params: ({ schemaCode }) => codegen_1._`{limit: ${schemaCode}}`
  }, def2 = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: error44,
    code(cxt) {
      let { keyword, data, schemaCode, it } = cxt, op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT, len = it.opts.unicode === !1 ? codegen_1._`${data}.length` : codegen_1._`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
      cxt.fail$data(codegen_1._`${len} ${op} ${schemaCode}`);
    }
  };
  exports.default = def2;
});
