// var: require_propertyNames
var require_propertyNames = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), error44 = {
    message: "property name must be valid",
    params: ({ params }) => codegen_1._`{propertyName: ${params.propertyName}}`
  }, def2 = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: error44,
    code(cxt) {
      let { gen, schema: schema5, data, it } = cxt;
      if ((0, util_1.alwaysValidSchema)(it, schema5))
        return;
      let valid = gen.name("valid");
      gen.forIn("key", data, (key2) => {
        cxt.setParams({ propertyName: key2 }), cxt.subschema({
          keyword: "propertyNames",
          data: key2,
          dataTypes: ["string"],
          propertyName: key2,
          compositeRule: !0
        }, valid), gen.if((0, codegen_1.not)(valid), () => {
          if (cxt.error(!0), !it.allErrors)
            gen.break();
        });
      }), cxt.ok(valid);
    }
  };
  exports.default = def2;
});
