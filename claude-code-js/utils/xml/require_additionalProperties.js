// var: require_additionalProperties
var require_additionalProperties = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var code_1 = require_code2(), codegen_1 = require_codegen(), names_1 = require_names(), util_1 = require_util4(), error44 = {
    message: "must NOT have additional properties",
    params: ({ params }) => codegen_1._`{additionalProperty: ${params.additionalProperty}}`
  }, def2 = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: error44,
    code(cxt) {
      let { gen, schema: schema5, parentSchema, data, errsCount, it } = cxt;
      if (!errsCount)
        throw Error("ajv implementation error");
      let { allErrors, opts } = it;
      if (it.props = !0, opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema5))
        return;
      let props = (0, code_1.allSchemaProperties)(parentSchema.properties), patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
      checkAdditionalProperties(), cxt.ok(codegen_1._`${errsCount} === ${names_1.default.errors}`);
      function checkAdditionalProperties() {
        gen.forIn("key", data, (key2) => {
          if (!props.length && !patProps.length)
            additionalPropertyCode(key2);
          else
            gen.if(isAdditional(key2), () => additionalPropertyCode(key2));
        });
      }
      function isAdditional(key2) {
        let definedProp;
        if (props.length > 8) {
          let propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
          definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key2);
        } else if (props.length)
          definedProp = (0, codegen_1.or)(...props.map((p4) => codegen_1._`${key2} === ${p4}`));
        else
          definedProp = codegen_1.nil;
        if (patProps.length)
          definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p4) => codegen_1._`${(0, code_1.usePattern)(cxt, p4)}.test(${key2})`));
        return (0, codegen_1.not)(definedProp);
      }
      function deleteAdditional(key2) {
        gen.code(codegen_1._`delete ${data}[${key2}]`);
      }
      function additionalPropertyCode(key2) {
        if (opts.removeAdditional === "all" || opts.removeAdditional && schema5 === !1) {
          deleteAdditional(key2);
          return;
        }
        if (schema5 === !1) {
          if (cxt.setParams({ additionalProperty: key2 }), cxt.error(), !allErrors)
            gen.break();
          return;
        }
        if (typeof schema5 == "object" && !(0, util_1.alwaysValidSchema)(it, schema5)) {
          let valid = gen.name("valid");
          if (opts.removeAdditional === "failing")
            applyAdditionalSchema(key2, valid, !1), gen.if((0, codegen_1.not)(valid), () => {
              cxt.reset(), deleteAdditional(key2);
            });
          else if (applyAdditionalSchema(key2, valid), !allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        }
      }
      function applyAdditionalSchema(key2, valid, errors8) {
        let subschema = {
          keyword: "additionalProperties",
          dataProp: key2,
          dataPropType: util_1.Type.Str
        };
        if (errors8 === !1)
          Object.assign(subschema, {
            compositeRule: !0,
            createErrors: !1,
            allErrors: !1
          });
        cxt.subschema(subschema, valid);
      }
    }
  };
  exports.default = def2;
});
