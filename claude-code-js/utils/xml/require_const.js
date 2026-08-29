// var: require_const
var require_const = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), equal_1 = require_equal(), error44 = {
    message: "must be equal to constant",
    params: ({ schemaCode }) => codegen_1._`{allowedValue: ${schemaCode}}`
  }, def2 = {
    keyword: "const",
    $data: !0,
    error: error44,
    code(cxt) {
      let { gen, data, $data, schemaCode, schema: schema5 } = cxt;
      if ($data || schema5 && typeof schema5 == "object")
        cxt.fail$data(codegen_1._`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
      else
        cxt.fail(codegen_1._`${schema5} !== ${data}`);
    }
  };
  exports.default = def2;
});
