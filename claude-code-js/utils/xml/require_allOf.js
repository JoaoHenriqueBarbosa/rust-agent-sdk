// var: require_allOf
var require_allOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var util_1 = require_util4(), def2 = {
    keyword: "allOf",
    schemaType: "array",
    code(cxt) {
      let { gen, schema: schema5, it } = cxt;
      if (!Array.isArray(schema5))
        throw Error("ajv implementation error");
      let valid = gen.name("valid");
      schema5.forEach((sch, i5) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        let schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i5 }, valid);
        cxt.ok(valid), cxt.mergeEvaluated(schCxt);
      });
    }
  };
  exports.default = def2;
});
