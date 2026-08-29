// var: require_multipleOf
var require_multipleOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), error44 = {
    message: ({ schemaCode }) => codegen_1.str`must be multiple of ${schemaCode}`,
    params: ({ schemaCode }) => codegen_1._`{multipleOf: ${schemaCode}}`
  }, def2 = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: error44,
    code(cxt) {
      let { gen, data, schemaCode, it } = cxt, prec = it.opts.multipleOfPrecision, res = gen.let("res"), invalid = prec ? codegen_1._`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : codegen_1._`${res} !== parseInt(${res})`;
      cxt.fail$data(codegen_1._`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
    }
  };
  exports.default = def2;
});
