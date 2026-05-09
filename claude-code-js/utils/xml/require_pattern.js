// var: require_pattern
var require_pattern = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var code_1 = require_code2(), util_1 = require_util4(), codegen_1 = require_codegen(), error44 = {
    message: ({ schemaCode }) => codegen_1.str`must match pattern "${schemaCode}"`,
    params: ({ schemaCode }) => codegen_1._`{pattern: ${schemaCode}}`
  }, def2 = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: error44,
    code(cxt) {
      let { gen, data, $data, schema: schema5, schemaCode, it } = cxt, u5 = it.opts.unicodeRegExp ? "u" : "";
      if ($data) {
        let { regExp } = it.opts.code, regExpCode = regExp.code === "new RegExp" ? codegen_1._`new RegExp` : (0, util_1.useFunc)(gen, regExp), valid = gen.let("valid");
        gen.try(() => gen.assign(valid, codegen_1._`${regExpCode}(${schemaCode}, ${u5}).test(${data})`), () => gen.assign(valid, !1)), cxt.fail$data(codegen_1._`!${valid}`);
      } else {
        let regExp = (0, code_1.usePattern)(cxt, schema5);
        cxt.fail$data(codegen_1._`!${regExp}.test(${data})`);
      }
    }
  };
  exports.default = def2;
});
