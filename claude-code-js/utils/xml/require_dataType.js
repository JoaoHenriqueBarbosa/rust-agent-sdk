// var: require_dataType
var require_dataType = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
  var rules_1 = require_rules(), applicability_1 = require_applicability(), errors_1 = require_errors7(), codegen_1 = require_codegen(), util_1 = require_util4(), DataType;
  (function(DataType2) {
    DataType2[DataType2.Correct = 0] = "Correct", DataType2[DataType2.Wrong = 1] = "Wrong";
  })(DataType || (exports.DataType = DataType = {}));
  function getSchemaTypes(schema5) {
    let types14 = getJSONTypes(schema5.type);
    if (types14.includes("null")) {
      if (schema5.nullable === !1)
        throw Error("type: null contradicts nullable: false");
    } else {
      if (!types14.length && schema5.nullable !== void 0)
        throw Error('"nullable" cannot be used without "type"');
      if (schema5.nullable === !0)
        types14.push("null");
    }
    return types14;
  }
  exports.getSchemaTypes = getSchemaTypes;
  function getJSONTypes(ts) {
    let types14 = Array.isArray(ts) ? ts : ts ? [ts] : [];
    if (types14.every(rules_1.isJSONType))
      return types14;
    throw Error("type must be JSONType or JSONType[]: " + types14.join(","));
  }
  exports.getJSONTypes = getJSONTypes;
  function coerceAndCheckDataType(it, types14) {
    let { gen, data, opts } = it, coerceTo = coerceToTypes(types14, opts.coerceTypes), checkTypes = types14.length > 0 && !(coerceTo.length === 0 && types14.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types14[0]));
    if (checkTypes) {
      let wrongType = checkDataTypes(types14, data, opts.strictNumbers, DataType.Wrong);
      gen.if(wrongType, () => {
        if (coerceTo.length)
          coerceData(it, types14, coerceTo);
        else
          reportTypeError(it);
      });
    }
    return checkTypes;
  }
  exports.coerceAndCheckDataType = coerceAndCheckDataType;
  var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function coerceToTypes(types14, coerceTypes) {
    return coerceTypes ? types14.filter((t2) => COERCIBLE.has(t2) || coerceTypes === "array" && t2 === "array") : [];
  }
  function coerceData(it, types14, coerceTo) {
    let { gen, data, opts } = it, dataType = gen.let("dataType", codegen_1._`typeof ${data}`), coerced = gen.let("coerced", codegen_1._`undefined`);
    if (opts.coerceTypes === "array")
      gen.if(codegen_1._`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, codegen_1._`${data}[0]`).assign(dataType, codegen_1._`typeof ${data}`).if(checkDataTypes(types14, data, opts.strictNumbers), () => gen.assign(coerced, data)));
    gen.if(codegen_1._`${coerced} !== undefined`);
    for (let t2 of coerceTo)
      if (COERCIBLE.has(t2) || t2 === "array" && opts.coerceTypes === "array")
        coerceSpecificType(t2);
    gen.else(), reportTypeError(it), gen.endIf(), gen.if(codegen_1._`${coerced} !== undefined`, () => {
      gen.assign(data, coerced), assignParentData(it, coerced);
    });
    function coerceSpecificType(t2) {
      switch (t2) {
        case "string":
          gen.elseIf(codegen_1._`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, codegen_1._`"" + ${data}`).elseIf(codegen_1._`${data} === null`).assign(coerced, codegen_1._`""`);
          return;
        case "number":
          gen.elseIf(codegen_1._`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, codegen_1._`+${data}`);
          return;
        case "integer":
          gen.elseIf(codegen_1._`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, codegen_1._`+${data}`);
          return;
        case "boolean":
          gen.elseIf(codegen_1._`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, !1).elseIf(codegen_1._`${data} === "true" || ${data} === 1`).assign(coerced, !0);
          return;
        case "null":
          gen.elseIf(codegen_1._`${data} === "" || ${data} === 0 || ${data} === false`), gen.assign(coerced, null);
          return;
        case "array":
          gen.elseIf(codegen_1._`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, codegen_1._`[${data}]`);
      }
    }
  }
  function assignParentData({ gen, parentData, parentDataProperty }, expr) {
    gen.if(codegen_1._`${parentData} !== undefined`, () => gen.assign(codegen_1._`${parentData}[${parentDataProperty}]`, expr));
  }
  function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
    let EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ, cond;
    switch (dataType) {
      case "null":
        return codegen_1._`${data} ${EQ} null`;
      case "array":
        cond = codegen_1._`Array.isArray(${data})`;
        break;
      case "object":
        cond = codegen_1._`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
        break;
      case "integer":
        cond = numCond(codegen_1._`!(${data} % 1) && !isNaN(${data})`);
        break;
      case "number":
        cond = numCond();
        break;
      default:
        return codegen_1._`typeof ${data} ${EQ} ${dataType}`;
    }
    return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
    function numCond(_cond = codegen_1.nil) {
      return (0, codegen_1.and)(codegen_1._`typeof ${data} == "number"`, _cond, strictNums ? codegen_1._`isFinite(${data})` : codegen_1.nil);
    }
  }
  exports.checkDataType = checkDataType;
  function checkDataTypes(dataTypes, data, strictNums, correct) {
    if (dataTypes.length === 1)
      return checkDataType(dataTypes[0], data, strictNums, correct);
    let cond, types14 = (0, util_1.toHash)(dataTypes);
    if (types14.array && types14.object) {
      let notObj = codegen_1._`typeof ${data} != "object"`;
      cond = types14.null ? notObj : codegen_1._`!${data} || ${notObj}`, delete types14.null, delete types14.array, delete types14.object;
    } else
      cond = codegen_1.nil;
    if (types14.number)
      delete types14.integer;
    for (let t2 in types14)
      cond = (0, codegen_1.and)(cond, checkDataType(t2, data, strictNums, correct));
    return cond;
  }
  exports.checkDataTypes = checkDataTypes;
  var typeError = {
    message: ({ schema: schema5 }) => `must be ${schema5}`,
    params: ({ schema: schema5, schemaValue }) => typeof schema5 == "string" ? codegen_1._`{type: ${schema5}}` : codegen_1._`{type: ${schemaValue}}`
  };
  function reportTypeError(it) {
    let cxt = getTypeErrorContext(it);
    (0, errors_1.reportError)(cxt, typeError);
  }
  exports.reportTypeError = reportTypeError;
  function getTypeErrorContext(it) {
    let { gen, data, schema: schema5 } = it, schemaCode = (0, util_1.schemaRefOrVal)(it, schema5, "type");
    return {
      gen,
      keyword: "type",
      data,
      schema: schema5.type,
      schemaCode,
      schemaValue: schemaCode,
      parentSchema: schema5,
      params: {},
      it
    };
  }
});
