// var: require_properties2
var require_properties2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var validate_1 = require_validate3(), code_1 = require_code2(), util_1 = require_util4(), additionalProperties_1 = require_additionalProperties(), def2 = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(cxt) {
      let { gen, schema: schema5, parentSchema, data, it } = cxt;
      if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0)
        additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
      let allProps = (0, code_1.allSchemaProperties)(schema5);
      for (let prop of allProps)
        it.definedProperties.add(prop);
      if (it.opts.unevaluated && allProps.length && it.props !== !0)
        it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
      let properties = allProps.filter((p4) => !(0, util_1.alwaysValidSchema)(it, schema5[p4]));
      if (properties.length === 0)
        return;
      let valid = gen.name("valid");
      for (let prop of properties) {
        if (hasDefault(prop))
          applyPropertySchema(prop);
        else {
          if (gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties)), applyPropertySchema(prop), !it.allErrors)
            gen.else().var(valid, !0);
          gen.endIf();
        }
        cxt.it.definedProperties.add(prop), cxt.ok(valid);
      }
      function hasDefault(prop) {
        return it.opts.useDefaults && !it.compositeRule && schema5[prop].default !== void 0;
      }
      function applyPropertySchema(prop) {
        cxt.subschema({
          keyword: "properties",
          schemaProp: prop,
          dataProp: prop
        }, valid);
      }
    }
  };
  exports.default = def2;
});
