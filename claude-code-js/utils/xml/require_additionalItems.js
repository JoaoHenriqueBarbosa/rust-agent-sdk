// var: require_additionalItems
var require_additionalItems = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validateAdditionalItems = void 0;
  var codegen_1 = require_codegen(), util_1 = require_util4(), error44 = {
    message: ({ params: { len } }) => codegen_1.str`must NOT have more than ${len} items`,
    params: ({ params: { len } }) => codegen_1._`{limit: ${len}}`
  }, def2 = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: error44,
    code(cxt) {
      let { parentSchema, it } = cxt, { items } = parentSchema;
      if (!Array.isArray(items)) {
        (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      validateAdditionalItems(cxt, items);
    }
  };
  function validateAdditionalItems(cxt, items) {
    let { gen, schema: schema5, data, keyword, it } = cxt;
    it.items = !0;
    let len = gen.const("len", codegen_1._`${data}.length`);
    if (schema5 === !1)
      cxt.setParams({ len: items.length }), cxt.pass(codegen_1._`${len} <= ${items.length}`);
    else if (typeof schema5 == "object" && !(0, util_1.alwaysValidSchema)(it, schema5)) {
      let valid = gen.var("valid", codegen_1._`${len} <= ${items.length}`);
      gen.if((0, codegen_1.not)(valid), () => validateItems(valid)), cxt.ok(valid);
    }
    function validateItems(valid) {
      gen.forRange("i", items.length, len, (i5) => {
        if (cxt.subschema({ keyword, dataProp: i5, dataPropType: util_1.Type.Num }, valid), !it.allErrors)
          gen.if((0, codegen_1.not)(valid), () => gen.break());
      });
    }
  }
  exports.validateAdditionalItems = validateAdditionalItems;
  exports.default = def2;
});
