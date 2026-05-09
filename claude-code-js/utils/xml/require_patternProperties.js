// var: require_patternProperties
var require_patternProperties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var code_1 = require_code2(), codegen_1 = require_codegen(), util_1 = require_util4(), util_2 = require_util4(), def2 = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(cxt) {
      let { gen, schema: schema5, data, parentSchema, it } = cxt, { opts } = it, patterns = (0, code_1.allSchemaProperties)(schema5), alwaysValidPatterns = patterns.filter((p4) => (0, util_1.alwaysValidSchema)(it, schema5[p4]));
      if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === !0))
        return;
      let checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties, valid = gen.name("valid");
      if (it.props !== !0 && !(it.props instanceof codegen_1.Name))
        it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
      let { props } = it;
      validatePatternProperties();
      function validatePatternProperties() {
        for (let pat of patterns) {
          if (checkProperties)
            checkMatchingProperties(pat);
          if (it.allErrors)
            validateProperties(pat);
          else
            gen.var(valid, !0), validateProperties(pat), gen.if(valid);
        }
      }
      function checkMatchingProperties(pat) {
        for (let prop in checkProperties)
          if (new RegExp(pat).test(prop))
            (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
      }
      function validateProperties(pat) {
        gen.forIn("key", data, (key2) => {
          gen.if(codegen_1._`${(0, code_1.usePattern)(cxt, pat)}.test(${key2})`, () => {
            let alwaysValid = alwaysValidPatterns.includes(pat);
            if (!alwaysValid)
              cxt.subschema({
                keyword: "patternProperties",
                schemaProp: pat,
                dataProp: key2,
                dataPropType: util_2.Type.Str
              }, valid);
            if (it.opts.unevaluated && props !== !0)
              gen.assign(codegen_1._`${props}[${key2}]`, !0);
            else if (!alwaysValid && !it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        });
      }
    }
  };
  exports.default = def2;
});
