// var: require_errors7
var require_errors7 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
  var codegen_1 = require_codegen(), util_1 = require_util4(), names_1 = require_names();
  exports.keywordError = {
    message: ({ keyword }) => codegen_1.str`must pass "${keyword}" keyword validation`
  };
  exports.keyword$DataError = {
    message: ({ keyword, schemaType }) => schemaType ? codegen_1.str`"${keyword}" keyword must be ${schemaType} ($data)` : codegen_1.str`"${keyword}" keyword is invalid ($data)`
  };
  function reportError2(cxt, error44 = exports.keywordError, errorPaths, overrideAllErrors) {
    let { it } = cxt, { gen, compositeRule, allErrors } = it, errObj = errorObjectCode(cxt, error44, errorPaths);
    if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors)
      addError(gen, errObj);
    else
      returnErrors(it, codegen_1._`[${errObj}]`);
  }
  exports.reportError = reportError2;
  function reportExtraError(cxt, error44 = exports.keywordError, errorPaths) {
    let { it } = cxt, { gen, compositeRule, allErrors } = it, errObj = errorObjectCode(cxt, error44, errorPaths);
    if (addError(gen, errObj), !(compositeRule || allErrors))
      returnErrors(it, names_1.default.vErrors);
  }
  exports.reportExtraError = reportExtraError;
  function resetErrorsCount(gen, errsCount) {
    gen.assign(names_1.default.errors, errsCount), gen.if(codegen_1._`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign(codegen_1._`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
  }
  exports.resetErrorsCount = resetErrorsCount;
  function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
    if (errsCount === void 0)
      throw Error("ajv implementation error");
    let err2 = gen.name("err");
    gen.forRange("i", errsCount, names_1.default.errors, (i5) => {
      if (gen.const(err2, codegen_1._`${names_1.default.vErrors}[${i5}]`), gen.if(codegen_1._`${err2}.instancePath === undefined`, () => gen.assign(codegen_1._`${err2}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath))), gen.assign(codegen_1._`${err2}.schemaPath`, codegen_1.str`${it.errSchemaPath}/${keyword}`), it.opts.verbose)
        gen.assign(codegen_1._`${err2}.schema`, schemaValue), gen.assign(codegen_1._`${err2}.data`, data);
    });
  }
  exports.extendErrors = extendErrors;
  function addError(gen, errObj) {
    let err2 = gen.const("err", errObj);
    gen.if(codegen_1._`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, codegen_1._`[${err2}]`), codegen_1._`${names_1.default.vErrors}.push(${err2})`), gen.code(codegen_1._`${names_1.default.errors}++`);
  }
  function returnErrors(it, errs) {
    let { gen, validateName, schemaEnv } = it;
    if (schemaEnv.$async)
      gen.throw(codegen_1._`new ${it.ValidationError}(${errs})`);
    else
      gen.assign(codegen_1._`${validateName}.errors`, errs), gen.return(!1);
  }
  var E2 = {
    keyword: new codegen_1.Name("keyword"),
    schemaPath: new codegen_1.Name("schemaPath"),
    params: new codegen_1.Name("params"),
    propertyName: new codegen_1.Name("propertyName"),
    message: new codegen_1.Name("message"),
    schema: new codegen_1.Name("schema"),
    parentSchema: new codegen_1.Name("parentSchema")
  };
  function errorObjectCode(cxt, error44, errorPaths) {
    let { createErrors } = cxt.it;
    if (createErrors === !1)
      return codegen_1._`{}`;
    return errorObject(cxt, error44, errorPaths);
  }
  function errorObject(cxt, error44, errorPaths = {}) {
    let { gen, it } = cxt, keyValues = [
      errorInstancePath(it, errorPaths),
      errorSchemaPath(cxt, errorPaths)
    ];
    return extraErrorProps(cxt, error44, keyValues), gen.object(...keyValues);
  }
  function errorInstancePath({ errorPath }, { instancePath }) {
    let instPath = instancePath ? codegen_1.str`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
    return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
  }
  function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
    let schPath = parentSchema ? errSchemaPath : codegen_1.str`${errSchemaPath}/${keyword}`;
    if (schemaPath)
      schPath = codegen_1.str`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
    return [E2.schemaPath, schPath];
  }
  function extraErrorProps(cxt, { params, message }, keyValues) {
    let { keyword, data, schemaValue, it } = cxt, { opts, propertyName, topSchemaRef, schemaPath } = it;
    if (keyValues.push([E2.keyword, keyword], [E2.params, typeof params == "function" ? params(cxt) : params || codegen_1._`{}`]), opts.messages)
      keyValues.push([E2.message, typeof message == "function" ? message(cxt) : message]);
    if (opts.verbose)
      keyValues.push([E2.schema, schemaValue], [E2.parentSchema, codegen_1._`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
    if (propertyName)
      keyValues.push([E2.propertyName, propertyName]);
  }
});
