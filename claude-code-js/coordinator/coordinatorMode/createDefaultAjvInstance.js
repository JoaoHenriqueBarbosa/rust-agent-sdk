// function: createDefaultAjvInstance
function createDefaultAjvInstance() {
  let ajv = new import_ajv2.default({
    strict: !1,
    validateFormats: !0,
    validateSchema: !1,
    allErrors: !0
  });
  return import_ajv_formats.default(ajv), ajv;
}
