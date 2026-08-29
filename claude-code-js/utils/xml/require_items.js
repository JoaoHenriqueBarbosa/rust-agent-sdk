// var: require_items
var require_items = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validateTuple = void 0;
  var codegen_1 = require_codegen(), util_1 = require_util4(), code_1 = require_code2(), def2 = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(cxt) {
      let { schema: schema5, it } = cxt;
      if (Array.isArray(schema5))
        return validateTuple(cxt, "additionalItems", schema5);
      if (it.items = !0, (0, util_1.alwaysValidSchema)(it, schema5))
        return;
      cxt.ok((0, code_1.validateArray)(cxt));
    }
  };
  function validateTuple(cxt, extraItems, schArr = cxt.schema) {
    let { gen, parentSchema, data, keyword, it } = cxt;
    if (checkStrictTuple(parentSchema), it.opts.unevaluated && schArr.length && it.items !== !0)
      it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
    let valid = gen.name("valid"), len = gen.const("len", codegen_1._`${data}.length`);
    schArr.forEach((sch, i5) => {
      if ((0, util_1.alwaysValidSchema)(it, sch))
        return;
      gen.if(codegen_1._`${len} > ${i5}`, () => cxt.subschema({
        keyword,
        schemaProp: i5,
        dataProp: i5
      }, valid)), cxt.ok(valid);
    });
    function checkStrictTuple(sch) {
      let { opts, errSchemaPath } = it, l3 = schArr.length, fullTuple = l3 === sch.minItems && (l3 === sch.maxItems || sch[extraItems] === !1);
      if (opts.strictTuples && !fullTuple) {
        let msg = `"${keyword}" is ${l3}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
        (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
      }
    }
  }
  exports.validateTuple = validateTuple;
  exports.default = def2;
});
