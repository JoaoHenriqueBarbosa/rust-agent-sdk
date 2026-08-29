// var: require_format
var require_format = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var codegen_1 = require_codegen(), error44 = {
    message: ({ schemaCode }) => codegen_1.str`must match format "${schemaCode}"`,
    params: ({ schemaCode }) => codegen_1._`{format: ${schemaCode}}`
  }, def2 = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: error44,
    code(cxt, ruleType) {
      let { gen, data, $data, schema: schema5, schemaCode, it } = cxt, { opts, errSchemaPath, schemaEnv, self: self2 } = it;
      if (!opts.validateFormats)
        return;
      if ($data)
        validate$DataFormat();
      else
        validateFormat();
      function validate$DataFormat() {
        let fmts = gen.scopeValue("formats", {
          ref: self2.formats,
          code: opts.code.formats
        }), fDef = gen.const("fDef", codegen_1._`${fmts}[${schemaCode}]`), fType = gen.let("fType"), format4 = gen.let("format");
        gen.if(codegen_1._`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, codegen_1._`${fDef}.type || "string"`).assign(format4, codegen_1._`${fDef}.validate`), () => gen.assign(fType, codegen_1._`"string"`).assign(format4, fDef)), cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
        function unknownFmt() {
          if (opts.strictSchema === !1)
            return codegen_1.nil;
          return codegen_1._`${schemaCode} && !${format4}`;
        }
        function invalidFmt() {
          let callFormat = schemaEnv.$async ? codegen_1._`(${fDef}.async ? await ${format4}(${data}) : ${format4}(${data}))` : codegen_1._`${format4}(${data})`, validData = codegen_1._`(typeof ${format4} == "function" ? ${callFormat} : ${format4}.test(${data}))`;
          return codegen_1._`${format4} && ${format4} !== true && ${fType} === ${ruleType} && !${validData}`;
        }
      }
      function validateFormat() {
        let formatDef = self2.formats[schema5];
        if (!formatDef) {
          unknownFormat();
          return;
        }
        if (formatDef === !0)
          return;
        let [fmtType, format4, fmtRef] = getFormat(formatDef);
        if (fmtType === ruleType)
          cxt.pass(validCondition());
        function unknownFormat() {
          if (opts.strictSchema === !1) {
            self2.logger.warn(unknownMsg());
            return;
          }
          throw Error(unknownMsg());
          function unknownMsg() {
            return `unknown format "${schema5}" ignored in schema at path "${errSchemaPath}"`;
          }
        }
        function getFormat(fmtDef) {
          let code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? codegen_1._`${opts.code.formats}${(0, codegen_1.getProperty)(schema5)}` : void 0, fmt = gen.scopeValue("formats", { key: schema5, ref: fmtDef, code });
          if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp))
            return [fmtDef.type || "string", fmtDef.validate, codegen_1._`${fmt}.validate`];
          return ["string", fmtDef, fmt];
        }
        function validCondition() {
          if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
            if (!schemaEnv.$async)
              throw Error("async format in sync schema");
            return codegen_1._`await ${fmtRef}(${data})`;
          }
          return typeof format4 == "function" ? codegen_1._`${fmtRef}(${data})` : codegen_1._`${fmtRef}.test(${data})`;
        }
      }
    }
  };
  exports.default = def2;
});
