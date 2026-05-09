// var: require_subschema
var require_subschema = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
  var codegen_1 = require_codegen(), util_1 = require_util4();
  function getSubschema(it, { keyword, schemaProp, schema: schema5, schemaPath, errSchemaPath, topSchemaRef }) {
    if (keyword !== void 0 && schema5 !== void 0)
      throw Error('both "keyword" and "schema" passed, only one allowed');
    if (keyword !== void 0) {
      let sch = it.schema[keyword];
      return schemaProp === void 0 ? {
        schema: sch,
        schemaPath: codegen_1._`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`
      } : {
        schema: sch[schemaProp],
        schemaPath: codegen_1._`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
        errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
      };
    }
    if (schema5 !== void 0) {
      if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0)
        throw Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: schema5,
        schemaPath,
        topSchemaRef,
        errSchemaPath
      };
    }
    throw Error('either "keyword" or "schema" must be passed');
  }
  exports.getSubschema = getSubschema;
  function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
    if (data !== void 0 && dataProp !== void 0)
      throw Error('both "data" and "dataProp" passed, only one allowed');
    let { gen } = it;
    if (dataProp !== void 0) {
      let { errorPath, dataPathArr, opts } = it, nextData = gen.let("data", codegen_1._`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, !0);
      dataContextProps(nextData), subschema.errorPath = codegen_1.str`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`, subschema.parentDataProperty = codegen_1._`${dataProp}`, subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
    }
    if (data !== void 0) {
      let nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, !0);
      if (dataContextProps(nextData), propertyName !== void 0)
        subschema.propertyName = propertyName;
    }
    if (dataTypes)
      subschema.dataTypes = dataTypes;
    function dataContextProps(_nextData) {
      subschema.data = _nextData, subschema.dataLevel = it.dataLevel + 1, subschema.dataTypes = [], it.definedProperties = /* @__PURE__ */ new Set, subschema.parentData = it.data, subschema.dataNames = [...it.dataNames, _nextData];
    }
  }
  exports.extendSubschemaData = extendSubschemaData;
  function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
    if (compositeRule !== void 0)
      subschema.compositeRule = compositeRule;
    if (createErrors !== void 0)
      subschema.createErrors = createErrors;
    if (allErrors !== void 0)
      subschema.allErrors = allErrors;
    subschema.jtdDiscriminator = jtdDiscriminator, subschema.jtdMetadata = jtdMetadata;
  }
  exports.extendSubschemaMode = extendSubschemaMode;
});
