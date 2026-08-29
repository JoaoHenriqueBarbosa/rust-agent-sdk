// var: require_items2020
var require_items2020 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), code_1 = require_code2(), additionalItems_1 = require_additionalItems(), error44 = {
    message: ({ params: { len } }) => codegen_1.str`must NOT have more than ${len} items`,
    params: ({ params: { len } }) => codegen_1._`{limit: ${len}}`
  }, def2 = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: error44,
    code(cxt) {
      let { schema: schema5, parentSchema, it } = cxt, { prefixItems } = parentSchema;
      if (it.items = !0, (0, util_1.alwaysValidSchema)(it, schema5))
        return;
      if (prefixItems)
        (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
      else
        cxt.ok((0, code_1.validateArray)(cxt));
    }
  };
  exports.default = def2;
});
