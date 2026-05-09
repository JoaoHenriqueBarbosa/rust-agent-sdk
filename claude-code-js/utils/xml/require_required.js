// var: require_required
var require_required = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var code_1 = require_code2(), codegen_1 = require_codegen(), util_1 = require_util4(), error44 = {
    message: ({ params: { missingProperty } }) => codegen_1.str`must have required property '${missingProperty}'`,
    params: ({ params: { missingProperty } }) => codegen_1._`{missingProperty: ${missingProperty}}`
  }, def2 = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: error44,
    code(cxt) {
      let { gen, schema: schema5, schemaCode, data, $data, it } = cxt, { opts } = it;
      if (!$data && schema5.length === 0)
        return;
      let useLoop = schema5.length >= opts.loopRequired;
      if (it.allErrors)
        allErrorsMode();
      else
        exitOnErrorMode();
      if (opts.strictRequired) {
        let props = cxt.parentSchema.properties, { definedProperties } = cxt.it;
        for (let requiredKey of schema5)
          if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
            let schemaPath = it.schemaEnv.baseId + it.errSchemaPath, msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
            (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
          }
      }
      function allErrorsMode() {
        if (useLoop || $data)
          cxt.block$data(codegen_1.nil, loopAllRequired);
        else
          for (let prop of schema5)
            (0, code_1.checkReportMissingProp)(cxt, prop);
      }
      function exitOnErrorMode() {
        let missing = gen.let("missing");
        if (useLoop || $data) {
          let valid = gen.let("valid", !0);
          cxt.block$data(valid, () => loopUntilMissing(missing, valid)), cxt.ok(valid);
        } else
          gen.if((0, code_1.checkMissingProp)(cxt, schema5, missing)), (0, code_1.reportMissingProp)(cxt, missing), gen.else();
      }
      function loopAllRequired() {
        gen.forOf("prop", schemaCode, (prop) => {
          cxt.setParams({ missingProperty: prop }), gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
        });
      }
      function loopUntilMissing(missing, valid) {
        cxt.setParams({ missingProperty: missing }), gen.forOf(missing, schemaCode, () => {
          gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties)), gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(), gen.break();
          });
        }, codegen_1.nil);
      }
    }
  };
  exports.default = def2;
});
