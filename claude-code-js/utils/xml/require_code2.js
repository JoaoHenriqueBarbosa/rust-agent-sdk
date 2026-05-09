// var: require_code2
var require_code2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
  var codegen_1 = require_codegen(), util_1 = require_util4(), names_1 = require_names(), util_2 = require_util4();
  function checkReportMissingProp(cxt, prop) {
    let { gen, data, it } = cxt;
    gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
      cxt.setParams({ missingProperty: codegen_1._`${prop}` }, !0), cxt.error();
    });
  }
  exports.checkReportMissingProp = checkReportMissingProp;
  function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
    return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), codegen_1._`${missing} = ${prop}`)));
  }
  exports.checkMissingProp = checkMissingProp;
  function reportMissingProp(cxt, missing) {
    cxt.setParams({ missingProperty: missing }, !0), cxt.error();
  }
  exports.reportMissingProp = reportMissingProp;
  function hasPropFunc(gen) {
    return gen.scopeValue("func", {
      ref: Object.prototype.hasOwnProperty,
      code: codegen_1._`Object.prototype.hasOwnProperty`
    });
  }
  exports.hasPropFunc = hasPropFunc;
  function isOwnProperty(gen, data, property2) {
    return codegen_1._`${hasPropFunc(gen)}.call(${data}, ${property2})`;
  }
  exports.isOwnProperty = isOwnProperty;
  function propertyInData(gen, data, property2, ownProperties) {
    let cond = codegen_1._`${data}${(0, codegen_1.getProperty)(property2)} !== undefined`;
    return ownProperties ? codegen_1._`${cond} && ${isOwnProperty(gen, data, property2)}` : cond;
  }
  exports.propertyInData = propertyInData;
  function noPropertyInData(gen, data, property2, ownProperties) {
    let cond = codegen_1._`${data}${(0, codegen_1.getProperty)(property2)} === undefined`;
    return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property2))) : cond;
  }
  exports.noPropertyInData = noPropertyInData;
  function allSchemaProperties(schemaMap) {
    return schemaMap ? Object.keys(schemaMap).filter((p4) => p4 !== "__proto__") : [];
  }
  exports.allSchemaProperties = allSchemaProperties;
  function schemaProperties(it, schemaMap) {
    return allSchemaProperties(schemaMap).filter((p4) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p4]));
  }
  exports.schemaProperties = schemaProperties;
  function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context3, passSchema) {
    let dataAndSchema = passSchema ? codegen_1._`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data, valCxt = [
      [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
      [names_1.default.parentData, it.parentData],
      [names_1.default.parentDataProperty, it.parentDataProperty],
      [names_1.default.rootData, names_1.default.rootData]
    ];
    if (it.opts.dynamicRef)
      valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
    let args = codegen_1._`${dataAndSchema}, ${gen.object(...valCxt)}`;
    return context3 !== codegen_1.nil ? codegen_1._`${func}.call(${context3}, ${args})` : codegen_1._`${func}(${args})`;
  }
  exports.callValidateCode = callValidateCode;
  var newRegExp = codegen_1._`new RegExp`;
  function usePattern({ gen, it: { opts } }, pattern) {
    let u5 = opts.unicodeRegExp ? "u" : "", { regExp } = opts.code, rx = regExp(pattern, u5);
    return gen.scopeValue("pattern", {
      key: rx.toString(),
      ref: rx,
      code: codegen_1._`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u5})`
    });
  }
  exports.usePattern = usePattern;
  function validateArray(cxt) {
    let { gen, data, keyword, it } = cxt, valid = gen.name("valid");
    if (it.allErrors) {
      let validArr = gen.let("valid", !0);
      return validateItems(() => gen.assign(validArr, !1)), validArr;
    }
    return gen.var(valid, !0), validateItems(() => gen.break()), valid;
    function validateItems(notValid) {
      let len = gen.const("len", codegen_1._`${data}.length`);
      gen.forRange("i", 0, len, (i5) => {
        cxt.subschema({
          keyword,
          dataProp: i5,
          dataPropType: util_1.Type.Num
        }, valid), gen.if((0, codegen_1.not)(valid), notValid);
      });
    }
  }
  exports.validateArray = validateArray;
  function validateUnion(cxt) {
    let { gen, schema: schema5, keyword, it } = cxt;
    if (!Array.isArray(schema5))
      throw Error("ajv implementation error");
    if (schema5.some((sch) => (0, util_1.alwaysValidSchema)(it, sch)) && !it.opts.unevaluated)
      return;
    let valid = gen.let("valid", !1), schValid = gen.name("_valid");
    gen.block(() => schema5.forEach((_sch, i5) => {
      let schCxt = cxt.subschema({
        keyword,
        schemaProp: i5,
        compositeRule: !0
      }, schValid);
      if (gen.assign(valid, codegen_1._`${valid} || ${schValid}`), !cxt.mergeValidEvaluated(schCxt, schValid))
        gen.if((0, codegen_1.not)(valid));
    })), cxt.result(valid, () => cxt.reset(), () => cxt.error(!0));
  }
  exports.validateUnion = validateUnion;
});
