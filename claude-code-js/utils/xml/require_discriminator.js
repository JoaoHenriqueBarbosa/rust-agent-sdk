// var: require_discriminator
var require_discriminator = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), types_1 = require_types(), compile_1 = require_compile(), ref_error_1 = require_ref_error(), util_1 = require_util4(), error44 = {
    message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
    params: ({ params: { discrError, tag: tag2, tagName } }) => codegen_1._`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag2}}`
  }, def2 = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: error44,
    code(cxt) {
      let { gen, data, schema: schema5, parentSchema, it } = cxt, { oneOf } = parentSchema;
      if (!it.opts.discriminator)
        throw Error("discriminator: requires discriminator option");
      let tagName = schema5.propertyName;
      if (typeof tagName != "string")
        throw Error("discriminator: requires propertyName");
      if (schema5.mapping)
        throw Error("discriminator: mapping is not supported");
      if (!oneOf)
        throw Error("discriminator: requires oneOf keyword");
      let valid = gen.let("valid", !1), tag2 = gen.const("tag", codegen_1._`${data}${(0, codegen_1.getProperty)(tagName)}`);
      gen.if(codegen_1._`typeof ${tag2} == "string"`, () => validateMapping(), () => cxt.error(!1, { discrError: types_1.DiscrError.Tag, tag: tag2, tagName })), cxt.ok(valid);
      function validateMapping() {
        let mapping = getMapping();
        gen.if(!1);
        for (let tagValue in mapping)
          gen.elseIf(codegen_1._`${tag2} === ${tagValue}`), gen.assign(valid, applyTagSchema(mapping[tagValue]));
        gen.else(), cxt.error(!1, { discrError: types_1.DiscrError.Mapping, tag: tag2, tagName }), gen.endIf();
      }
      function applyTagSchema(schemaProp) {
        let _valid = gen.name("valid"), schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
        return cxt.mergeEvaluated(schCxt, codegen_1.Name), _valid;
      }
      function getMapping() {
        var _a3;
        let oneOfMapping = {}, topRequired = hasRequired(parentSchema), tagRequired = !0;
        for (let i5 = 0;i5 < oneOf.length; i5++) {
          let sch = oneOf[i5];
          if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
            let ref = sch.$ref;
            if (sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref), sch instanceof compile_1.SchemaEnv)
              sch = sch.schema;
            if (sch === void 0)
              throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
          }
          let propSch = (_a3 = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a3 === void 0 ? void 0 : _a3[tagName];
          if (typeof propSch != "object")
            throw Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
          tagRequired = tagRequired && (topRequired || hasRequired(sch)), addMappings(propSch, i5);
        }
        if (!tagRequired)
          throw Error(`discriminator: "${tagName}" must be required`);
        return oneOfMapping;
        function hasRequired({ required: required2 }) {
          return Array.isArray(required2) && required2.includes(tagName);
        }
        function addMappings(sch, i5) {
          if (sch.const)
            addMapping(sch.const, i5);
          else if (sch.enum)
            for (let tagValue of sch.enum)
              addMapping(tagValue, i5);
          else
            throw Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
        }
        function addMapping(tagValue, i5) {
          if (typeof tagValue != "string" || tagValue in oneOfMapping)
            throw Error(`discriminator: "${tagName}" values must be unique strings`);
          oneOfMapping[tagValue] = i5;
        }
      }
    }
  };
  exports.default = def2;
});
