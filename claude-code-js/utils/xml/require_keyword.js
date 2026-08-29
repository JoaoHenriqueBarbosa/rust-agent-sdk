// var: require_keyword
var require_keyword = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
  var codegen_1 = require_codegen(), names_1 = require_names(), code_1 = require_code2(), errors_1 = require_errors7();
  function macroKeywordCode(cxt, def2) {
    let { gen, keyword, schema: schema5, parentSchema, it } = cxt, macroSchema = def2.macro.call(it.self, schema5, parentSchema, it), schemaRef = useKeyword(gen, keyword, macroSchema);
    if (it.opts.validateSchema !== !1)
      it.self.validateSchema(macroSchema, !0);
    let valid = gen.name("valid");
    cxt.subschema({
      schema: macroSchema,
      schemaPath: codegen_1.nil,
      errSchemaPath: `${it.errSchemaPath}/${keyword}`,
      topSchemaRef: schemaRef,
      compositeRule: !0
    }, valid), cxt.pass(valid, () => cxt.error(!0));
  }
  exports.macroKeywordCode = macroKeywordCode;
  function funcKeywordCode(cxt, def2) {
    var _a3;
    let { gen, keyword, schema: schema5, parentSchema, $data, it } = cxt;
    checkAsyncKeyword(it, def2);
    let validate4 = !$data && def2.compile ? def2.compile.call(it.self, schema5, parentSchema, it) : def2.validate, validateRef = useKeyword(gen, keyword, validate4), valid = gen.let("valid");
    cxt.block$data(valid, validateKeyword), cxt.ok((_a3 = def2.valid) !== null && _a3 !== void 0 ? _a3 : valid);
    function validateKeyword() {
      if (def2.errors === !1) {
        if (assignValid(), def2.modifying)
          modifyData(cxt);
        reportErrs(() => cxt.error());
      } else {
        let ruleErrs = def2.async ? validateAsync() : validateSync();
        if (def2.modifying)
          modifyData(cxt);
        reportErrs(() => addErrs(cxt, ruleErrs));
      }
    }
    function validateAsync() {
      let ruleErrs = gen.let("ruleErrs", null);
      return gen.try(() => assignValid(codegen_1._`await `), (e) => gen.assign(valid, !1).if(codegen_1._`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, codegen_1._`${e}.errors`), () => gen.throw(e))), ruleErrs;
    }
    function validateSync() {
      let validateErrs = codegen_1._`${validateRef}.errors`;
      return gen.assign(validateErrs, null), assignValid(codegen_1.nil), validateErrs;
    }
    function assignValid(_await = def2.async ? codegen_1._`await ` : codegen_1.nil) {
      let passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self, passSchema = !(("compile" in def2) && !$data || def2.schema === !1);
      gen.assign(valid, codegen_1._`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def2.modifying);
    }
    function reportErrs(errors8) {
      var _a4;
      gen.if((0, codegen_1.not)((_a4 = def2.valid) !== null && _a4 !== void 0 ? _a4 : valid), errors8);
    }
  }
  exports.funcKeywordCode = funcKeywordCode;
  function modifyData(cxt) {
    let { gen, data, it } = cxt;
    gen.if(it.parentData, () => gen.assign(data, codegen_1._`${it.parentData}[${it.parentDataProperty}]`));
  }
  function addErrs(cxt, errs) {
    let { gen } = cxt;
    gen.if(codegen_1._`Array.isArray(${errs})`, () => {
      gen.assign(names_1.default.vErrors, codegen_1._`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, codegen_1._`${names_1.default.vErrors}.length`), (0, errors_1.extendErrors)(cxt);
    }, () => cxt.error());
  }
  function checkAsyncKeyword({ schemaEnv }, def2) {
    if (def2.async && !schemaEnv.$async)
      throw Error("async keyword in sync schema");
  }
  function useKeyword(gen, keyword, result) {
    if (result === void 0)
      throw Error(`keyword "${keyword}" failed to compile`);
    return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
  }
  function validSchemaType(schema5, schemaType, allowUndefined = !1) {
    return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema5) : st === "object" ? schema5 && typeof schema5 == "object" && !Array.isArray(schema5) : typeof schema5 == st || allowUndefined && typeof schema5 > "u");
  }
  exports.validSchemaType = validSchemaType;
  function validateKeywordUsage({ schema: schema5, opts, self: self2, errSchemaPath }, def2, keyword) {
    if (Array.isArray(def2.keyword) ? !def2.keyword.includes(keyword) : def2.keyword !== keyword)
      throw Error("ajv implementation error");
    let deps = def2.dependencies;
    if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema5, kwd)))
      throw Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
    if (def2.validateSchema) {
      if (!def2.validateSchema(schema5[keyword])) {
        let msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self2.errorsText(def2.validateSchema.errors);
        if (opts.validateSchema === "log")
          self2.logger.error(msg);
        else
          throw Error(msg);
      }
    }
  }
  exports.validateKeywordUsage = validateKeywordUsage;
});
