// var: require_limitProperties
var require_limitProperties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), error44 = {
    message({ keyword, schemaCode }) {
      let comp = keyword === "maxProperties" ? "more" : "fewer";
      return codegen_1.str`must NOT have ${comp} than ${schemaCode} properties`;
    },
    params: ({ schemaCode }) => codegen_1._`{limit: ${schemaCode}}`
  }, def2 = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: error44,
    code(cxt) {
      let { keyword, data, schemaCode } = cxt, op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
      cxt.fail$data(codegen_1._`Object.keys(${data}).length ${op} ${schemaCode}`);
    }
  };
  exports.default = def2;
});
