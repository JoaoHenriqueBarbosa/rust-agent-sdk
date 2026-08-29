// var: require_oneOf
var require_oneOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), error44 = {
    message: "must match exactly one schema in oneOf",
    params: ({ params }) => codegen_1._`{passingSchemas: ${params.passing}}`
  }, def2 = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: error44,
    code(cxt) {
      let { gen, schema: schema5, parentSchema, it } = cxt;
      if (!Array.isArray(schema5))
        throw Error("ajv implementation error");
      if (it.opts.discriminator && parentSchema.discriminator)
        return;
      let schArr = schema5, valid = gen.let("valid", !1), passing = gen.let("passing", null), schValid = gen.name("_valid");
      cxt.setParams({ passing }), gen.block(validateOneOf), cxt.result(valid, () => cxt.reset(), () => cxt.error(!0));
      function validateOneOf() {
        schArr.forEach((sch, i5) => {
          let schCxt;
          if ((0, util_1.alwaysValidSchema)(it, sch))
            gen.var(schValid, !0);
          else
            schCxt = cxt.subschema({
              keyword: "oneOf",
              schemaProp: i5,
              compositeRule: !0
            }, schValid);
          if (i5 > 0)
            gen.if(codegen_1._`${schValid} && ${valid}`).assign(valid, !1).assign(passing, codegen_1._`[${passing}, ${i5}]`).else();
          gen.if(schValid, () => {
            if (gen.assign(valid, !0), gen.assign(passing, i5), schCxt)
              cxt.mergeEvaluated(schCxt, codegen_1.Name);
          });
        });
      }
    }
  };
  exports.default = def2;
});
