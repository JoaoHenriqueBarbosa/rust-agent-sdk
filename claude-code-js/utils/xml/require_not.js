// var: require_not
var require_not = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var util_1 = require_util4(), def2 = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(cxt) {
      let { gen, schema: schema5, it } = cxt;
      if ((0, util_1.alwaysValidSchema)(it, schema5)) {
        cxt.fail();
        return;
      }
      let valid = gen.name("valid");
      cxt.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, valid), cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
    },
    error: { message: "must NOT be valid" }
  };
  exports.default = def2;
});
