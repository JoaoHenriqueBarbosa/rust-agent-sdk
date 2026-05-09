// var: require_contains
var require_contains = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), error44 = {
    message: ({ params: { min, max: max2 } }) => max2 === void 0 ? codegen_1.str`must contain at least ${min} valid item(s)` : codegen_1.str`must contain at least ${min} and no more than ${max2} valid item(s)`,
    params: ({ params: { min, max: max2 } }) => max2 === void 0 ? codegen_1._`{minContains: ${min}}` : codegen_1._`{minContains: ${min}, maxContains: ${max2}}`
  }, def2 = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: error44,
    code(cxt) {
      let { gen, schema: schema5, parentSchema, data, it } = cxt, min, max2, { minContains, maxContains } = parentSchema;
      if (it.opts.next)
        min = minContains === void 0 ? 1 : minContains, max2 = maxContains;
      else
        min = 1;
      let len = gen.const("len", codegen_1._`${data}.length`);
      if (cxt.setParams({ min, max: max2 }), max2 === void 0 && min === 0) {
        (0, util_1.checkStrictMode)(it, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (max2 !== void 0 && min > max2) {
        (0, util_1.checkStrictMode)(it, '"minContains" > "maxContains" is always invalid'), cxt.fail();
        return;
      }
      if ((0, util_1.alwaysValidSchema)(it, schema5)) {
        let cond = codegen_1._`${len} >= ${min}`;
        if (max2 !== void 0)
          cond = codegen_1._`${cond} && ${len} <= ${max2}`;
        cxt.pass(cond);
        return;
      }
      it.items = !0;
      let valid = gen.name("valid");
      if (max2 === void 0 && min === 1)
        validateItems(valid, () => gen.if(valid, () => gen.break()));
      else if (min === 0) {
        if (gen.let(valid, !0), max2 !== void 0)
          gen.if(codegen_1._`${data}.length > 0`, validateItemsWithCount);
      } else
        gen.let(valid, !1), validateItemsWithCount();
      cxt.result(valid, () => cxt.reset());
      function validateItemsWithCount() {
        let schValid = gen.name("_valid"), count3 = gen.let("count", 0);
        validateItems(schValid, () => gen.if(schValid, () => checkLimits(count3)));
      }
      function validateItems(_valid, block2) {
        gen.forRange("i", 0, len, (i5) => {
          cxt.subschema({
            keyword: "contains",
            dataProp: i5,
            dataPropType: util_1.Type.Num,
            compositeRule: !0
          }, _valid), block2();
        });
      }
      function checkLimits(count3) {
        if (gen.code(codegen_1._`${count3}++`), max2 === void 0)
          gen.if(codegen_1._`${count3} >= ${min}`, () => gen.assign(valid, !0).break());
        else if (gen.if(codegen_1._`${count3} > ${max2}`, () => gen.assign(valid, !1).break()), min === 1)
          gen.assign(valid, !0);
        else
          gen.if(codegen_1._`${count3} >= ${min}`, () => gen.assign(valid, !0));
      }
    }
  };
  exports.default = def2;
});
