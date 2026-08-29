// var: require_boolSchema
var require_boolSchema = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
  var errors_1 = require_errors7(), codegen_1 = require_codegen(), names_1 = require_names(), boolError = {
    message: "boolean schema is false"
  };
  function topBoolOrEmptySchema(it) {
    let { gen, schema: schema5, validateName } = it;
    if (schema5 === !1)
      falseSchemaError(it, !1);
    else if (typeof schema5 == "object" && schema5.$async === !0)
      gen.return(names_1.default.data);
    else
      gen.assign(codegen_1._`${validateName}.errors`, null), gen.return(!0);
  }
  exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
  function boolOrEmptySchema(it, valid) {
    let { gen, schema: schema5 } = it;
    if (schema5 === !1)
      gen.var(valid, !1), falseSchemaError(it);
    else
      gen.var(valid, !0);
  }
  exports.boolOrEmptySchema = boolOrEmptySchema;
  function falseSchemaError(it, overrideAllErrors) {
    let { gen, data } = it, cxt = {
      gen,
      keyword: "false schema",
      data,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it
    };
    (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
  }
});
