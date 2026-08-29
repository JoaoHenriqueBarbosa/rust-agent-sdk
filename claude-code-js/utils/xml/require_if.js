// var: require_if
var require_if = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), util_1 = require_util4(), error44 = {
    message: ({ params }) => codegen_1.str`must match "${params.ifClause}" schema`,
    params: ({ params }) => codegen_1._`{failingKeyword: ${params.ifClause}}`
  }, def2 = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: error44,
    code(cxt) {
      let { gen, parentSchema, it } = cxt;
      if (parentSchema.then === void 0 && parentSchema.else === void 0)
        (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
      let hasThen = hasSchema(it, "then"), hasElse = hasSchema(it, "else");
      if (!hasThen && !hasElse)
        return;
      let valid = gen.let("valid", !0), schValid = gen.name("_valid");
      if (validateIf(), cxt.reset(), hasThen && hasElse) {
        let ifClause = gen.let("ifClause");
        cxt.setParams({ ifClause }), gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
      } else if (hasThen)
        gen.if(schValid, validateClause("then"));
      else
        gen.if((0, codegen_1.not)(schValid), validateClause("else"));
      cxt.pass(valid, () => cxt.error(!0));
      function validateIf() {
        let schCxt = cxt.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, schValid);
        cxt.mergeEvaluated(schCxt);
      }
      function validateClause(keyword, ifClause) {
        return () => {
          let schCxt = cxt.subschema({ keyword }, schValid);
          if (gen.assign(valid, schValid), cxt.mergeValidEvaluated(schCxt, valid), ifClause)
            gen.assign(ifClause, codegen_1._`${keyword}`);
          else
            cxt.setParams({ ifClause: keyword });
        };
      }
    }
  };
  function hasSchema(it, keyword) {
    let schema5 = it.schema[keyword];
    return schema5 !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema5);
  }
  exports.default = def2;
});
