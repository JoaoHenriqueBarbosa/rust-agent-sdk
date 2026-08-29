// var: require_validate3
var require_validate3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
  var boolSchema_1 = require_boolSchema(), dataType_1 = require_dataType(), applicability_1 = require_applicability(), dataType_2 = require_dataType(), defaults_1 = require_defaults(), keyword_1 = require_keyword(), subschema_1 = require_subschema(), codegen_1 = require_codegen(), names_1 = require_names(), resolve_1 = require_resolve(), util_1 = require_util4(), errors_1 = require_errors7();
  function validateFunctionCode(it) {
    if (isSchemaObj(it)) {
      if (checkKeywords(it), schemaCxtHasRules(it)) {
        topSchemaObjCode(it);
        return;
      }
    }
    validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
  }
  exports.validateFunctionCode = validateFunctionCode;
  function validateFunction({ gen, validateName, schema: schema5, schemaEnv, opts }, body) {
    if (opts.code.es5)
      gen.func(validateName, codegen_1._`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
        gen.code(codegen_1._`"use strict"; ${funcSourceUrl(schema5, opts)}`), destructureValCxtES5(gen, opts), gen.code(body);
      });
    else
      gen.func(validateName, codegen_1._`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema5, opts)).code(body));
  }
  function destructureValCxt(opts) {
    return codegen_1._`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? codegen_1._`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
  }
  function destructureValCxtES5(gen, opts) {
    gen.if(names_1.default.valCxt, () => {
      if (gen.var(names_1.default.instancePath, codegen_1._`${names_1.default.valCxt}.${names_1.default.instancePath}`), gen.var(names_1.default.parentData, codegen_1._`${names_1.default.valCxt}.${names_1.default.parentData}`), gen.var(names_1.default.parentDataProperty, codegen_1._`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`), gen.var(names_1.default.rootData, codegen_1._`${names_1.default.valCxt}.${names_1.default.rootData}`), opts.dynamicRef)
        gen.var(names_1.default.dynamicAnchors, codegen_1._`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
    }, () => {
      if (gen.var(names_1.default.instancePath, codegen_1._`""`), gen.var(names_1.default.parentData, codegen_1._`undefined`), gen.var(names_1.default.parentDataProperty, codegen_1._`undefined`), gen.var(names_1.default.rootData, names_1.default.data), opts.dynamicRef)
        gen.var(names_1.default.dynamicAnchors, codegen_1._`{}`);
    });
  }
  function topSchemaObjCode(it) {
    let { schema: schema5, opts, gen } = it;
    validateFunction(it, () => {
      if (opts.$comment && schema5.$comment)
        commentKeyword(it);
      if (checkNoDefault(it), gen.let(names_1.default.vErrors, null), gen.let(names_1.default.errors, 0), opts.unevaluated)
        resetEvaluated(it);
      typeAndKeywords(it), returnResults(it);
    });
    return;
  }
  function resetEvaluated(it) {
    let { gen, validateName } = it;
    it.evaluated = gen.const("evaluated", codegen_1._`${validateName}.evaluated`), gen.if(codegen_1._`${it.evaluated}.dynamicProps`, () => gen.assign(codegen_1._`${it.evaluated}.props`, codegen_1._`undefined`)), gen.if(codegen_1._`${it.evaluated}.dynamicItems`, () => gen.assign(codegen_1._`${it.evaluated}.items`, codegen_1._`undefined`));
  }
  function funcSourceUrl(schema5, opts) {
    let schId = typeof schema5 == "object" && schema5[opts.schemaId];
    return schId && (opts.code.source || opts.code.process) ? codegen_1._`/*# sourceURL=${schId} */` : codegen_1.nil;
  }
  function subschemaCode(it, valid) {
    if (isSchemaObj(it)) {
      if (checkKeywords(it), schemaCxtHasRules(it)) {
        subSchemaObjCode(it, valid);
        return;
      }
    }
    (0, boolSchema_1.boolOrEmptySchema)(it, valid);
  }
  function schemaCxtHasRules({ schema: schema5, self: self2 }) {
    if (typeof schema5 == "boolean")
      return !schema5;
    for (let key2 in schema5)
      if (self2.RULES.all[key2])
        return !0;
    return !1;
  }
  function isSchemaObj(it) {
    return typeof it.schema != "boolean";
  }
  function subSchemaObjCode(it, valid) {
    let { schema: schema5, gen, opts } = it;
    if (opts.$comment && schema5.$comment)
      commentKeyword(it);
    updateContext(it), checkAsyncSchema(it);
    let errsCount = gen.const("_errs", names_1.default.errors);
    typeAndKeywords(it, errsCount), gen.var(valid, codegen_1._`${errsCount} === ${names_1.default.errors}`);
  }
  function checkKeywords(it) {
    (0, util_1.checkUnknownRules)(it), checkRefsAndKeywords(it);
  }
  function typeAndKeywords(it, errsCount) {
    if (it.opts.jtd)
      return schemaKeywords(it, [], !1, errsCount);
    let types14 = (0, dataType_1.getSchemaTypes)(it.schema), checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types14);
    schemaKeywords(it, types14, !checkedTypes, errsCount);
  }
  function checkRefsAndKeywords(it) {
    let { schema: schema5, errSchemaPath, opts, self: self2 } = it;
    if (schema5.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema5, self2.RULES))
      self2.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
  }
  function checkNoDefault(it) {
    let { schema: schema5, opts } = it;
    if (schema5.default !== void 0 && opts.useDefaults && opts.strictSchema)
      (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
  }
  function updateContext(it) {
    let schId = it.schema[it.opts.schemaId];
    if (schId)
      it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
  }
  function checkAsyncSchema(it) {
    if (it.schema.$async && !it.schemaEnv.$async)
      throw Error("async schema in sync schema");
  }
  function commentKeyword({ gen, schemaEnv, schema: schema5, errSchemaPath, opts }) {
    let msg = schema5.$comment;
    if (opts.$comment === !0)
      gen.code(codegen_1._`${names_1.default.self}.logger.log(${msg})`);
    else if (typeof opts.$comment == "function") {
      let schemaPath = codegen_1.str`${errSchemaPath}/$comment`, rootName = gen.scopeValue("root", { ref: schemaEnv.root });
      gen.code(codegen_1._`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
    }
  }
  function returnResults(it) {
    let { gen, schemaEnv, validateName, ValidationError: ValidationError2, opts } = it;
    if (schemaEnv.$async)
      gen.if(codegen_1._`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw(codegen_1._`new ${ValidationError2}(${names_1.default.vErrors})`));
    else {
      if (gen.assign(codegen_1._`${validateName}.errors`, names_1.default.vErrors), opts.unevaluated)
        assignEvaluated(it);
      gen.return(codegen_1._`${names_1.default.errors} === 0`);
    }
  }
  function assignEvaluated({ gen, evaluated, props, items }) {
    if (props instanceof codegen_1.Name)
      gen.assign(codegen_1._`${evaluated}.props`, props);
    if (items instanceof codegen_1.Name)
      gen.assign(codegen_1._`${evaluated}.items`, items);
  }
  function schemaKeywords(it, types14, typeErrors, errsCount) {
    let { gen, schema: schema5, data, allErrors, opts, self: self2 } = it, { RULES } = self2;
    if (schema5.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema5, RULES))) {
      gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
      return;
    }
    if (!opts.jtd)
      checkStrictTypes(it, types14);
    gen.block(() => {
      for (let group of RULES.rules)
        groupKeywords(group);
      groupKeywords(RULES.post);
    });
    function groupKeywords(group) {
      if (!(0, applicability_1.shouldUseGroup)(schema5, group))
        return;
      if (group.type) {
        if (gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers)), iterateKeywords(it, group), types14.length === 1 && types14[0] === group.type && typeErrors)
          gen.else(), (0, dataType_2.reportTypeError)(it);
        gen.endIf();
      } else
        iterateKeywords(it, group);
      if (!allErrors)
        gen.if(codegen_1._`${names_1.default.errors} === ${errsCount || 0}`);
    }
  }
  function iterateKeywords(it, group) {
    let { gen, schema: schema5, opts: { useDefaults } } = it;
    if (useDefaults)
      (0, defaults_1.assignDefaults)(it, group.type);
    gen.block(() => {
      for (let rule of group.rules)
        if ((0, applicability_1.shouldUseRule)(schema5, rule))
          keywordCode(it, rule.keyword, rule.definition, group.type);
    });
  }
  function checkStrictTypes(it, types14) {
    if (it.schemaEnv.meta || !it.opts.strictTypes)
      return;
    if (checkContextTypes(it, types14), !it.opts.allowUnionTypes)
      checkMultipleTypes(it, types14);
    checkKeywordTypes(it, it.dataTypes);
  }
  function checkContextTypes(it, types14) {
    if (!types14.length)
      return;
    if (!it.dataTypes.length) {
      it.dataTypes = types14;
      return;
    }
    types14.forEach((t2) => {
      if (!includesType(it.dataTypes, t2))
        strictTypesError(it, `type "${t2}" not allowed by context "${it.dataTypes.join(",")}"`);
    }), narrowSchemaTypes(it, types14);
  }
  function checkMultipleTypes(it, ts) {
    if (ts.length > 1 && !(ts.length === 2 && ts.includes("null")))
      strictTypesError(it, "use allowUnionTypes to allow union type keyword");
  }
  function checkKeywordTypes(it, ts) {
    let rules = it.self.RULES.all;
    for (let keyword in rules) {
      let rule = rules[keyword];
      if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
        let { type } = rule.definition;
        if (type.length && !type.some((t2) => hasApplicableType(ts, t2)))
          strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
      }
    }
  }
  function hasApplicableType(schTs, kwdT) {
    return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
  }
  function includesType(ts, t2) {
    return ts.includes(t2) || t2 === "integer" && ts.includes("number");
  }
  function narrowSchemaTypes(it, withTypes) {
    let ts = [];
    for (let t2 of it.dataTypes)
      if (includesType(withTypes, t2))
        ts.push(t2);
      else if (withTypes.includes("integer") && t2 === "number")
        ts.push("integer");
    it.dataTypes = ts;
  }
  function strictTypesError(it, msg) {
    let schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
    msg += ` at "${schemaPath}" (strictTypes)`, (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
  }

  class KeywordCxt {
    constructor(it, def2, keyword) {
      if ((0, keyword_1.validateKeywordUsage)(it, def2, keyword), this.gen = it.gen, this.allErrors = it.allErrors, this.keyword = keyword, this.data = it.data, this.schema = it.schema[keyword], this.$data = def2.$data && it.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data), this.schemaType = def2.schemaType, this.parentSchema = it.schema, this.params = {}, this.it = it, this.def = def2, this.$data)
        this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
      else if (this.schemaCode = this.schemaValue, !(0, keyword_1.validSchemaType)(this.schema, def2.schemaType, def2.allowUndefined))
        throw Error(`${keyword} value must be ${JSON.stringify(def2.schemaType)}`);
      if ("code" in def2 ? def2.trackErrors : def2.errors !== !1)
        this.errsCount = it.gen.const("_errs", names_1.default.errors);
    }
    result(condition, successAction, failAction) {
      this.failResult((0, codegen_1.not)(condition), successAction, failAction);
    }
    failResult(condition, successAction, failAction) {
      if (this.gen.if(condition), failAction)
        failAction();
      else
        this.error();
      if (successAction) {
        if (this.gen.else(), successAction(), this.allErrors)
          this.gen.endIf();
      } else if (this.allErrors)
        this.gen.endIf();
      else
        this.gen.else();
    }
    pass(condition, failAction) {
      this.failResult((0, codegen_1.not)(condition), void 0, failAction);
    }
    fail(condition) {
      if (condition === void 0) {
        if (this.error(), !this.allErrors)
          this.gen.if(!1);
        return;
      }
      if (this.gen.if(condition), this.error(), this.allErrors)
        this.gen.endIf();
      else
        this.gen.else();
    }
    fail$data(condition) {
      if (!this.$data)
        return this.fail(condition);
      let { schemaCode } = this;
      this.fail(codegen_1._`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
    }
    error(append2, errorParams, errorPaths) {
      if (errorParams) {
        this.setParams(errorParams), this._error(append2, errorPaths), this.setParams({});
        return;
      }
      this._error(append2, errorPaths);
    }
    _error(append2, errorPaths) {
      (append2 ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
    }
    $dataError() {
      (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw Error('add "trackErrors" to keyword definition');
      (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(cond) {
      if (!this.allErrors)
        this.gen.if(cond);
    }
    setParams(obj, assign) {
      if (assign)
        Object.assign(this.params, obj);
      else
        this.params = obj;
    }
    block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
      this.gen.block(() => {
        this.check$data(valid, $dataValid), codeBlock();
      });
    }
    check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
      if (!this.$data)
        return;
      let { gen, schemaCode, schemaType, def: def2 } = this;
      if (gen.if((0, codegen_1.or)(codegen_1._`${schemaCode} === undefined`, $dataValid)), valid !== codegen_1.nil)
        gen.assign(valid, !0);
      if (schemaType.length || def2.validateSchema) {
        if (gen.elseIf(this.invalid$data()), this.$dataError(), valid !== codegen_1.nil)
          gen.assign(valid, !1);
      }
      gen.else();
    }
    invalid$data() {
      let { gen, schemaCode, schemaType, def: def2, it } = this;
      return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
      function wrong$DataType() {
        if (schemaType.length) {
          if (!(schemaCode instanceof codegen_1.Name))
            throw Error("ajv implementation error");
          let st = Array.isArray(schemaType) ? schemaType : [schemaType];
          return codegen_1._`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
        }
        return codegen_1.nil;
      }
      function invalid$DataSchema() {
        if (def2.validateSchema) {
          let validateSchemaRef = gen.scopeValue("validate$data", { ref: def2.validateSchema });
          return codegen_1._`!${validateSchemaRef}(${schemaCode})`;
        }
        return codegen_1.nil;
      }
    }
    subschema(appl, valid) {
      let subschema = (0, subschema_1.getSubschema)(this.it, appl);
      (0, subschema_1.extendSubschemaData)(subschema, this.it, appl), (0, subschema_1.extendSubschemaMode)(subschema, appl);
      let nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
      return subschemaCode(nextContext, valid), nextContext;
    }
    mergeEvaluated(schemaCxt, toName) {
      let { it, gen } = this;
      if (!it.opts.unevaluated)
        return;
      if (it.props !== !0 && schemaCxt.props !== void 0)
        it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
      if (it.items !== !0 && schemaCxt.items !== void 0)
        it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
    }
    mergeValidEvaluated(schemaCxt, valid) {
      let { it, gen } = this;
      if (it.opts.unevaluated && (it.props !== !0 || it.items !== !0))
        return gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name)), !0;
    }
  }
  exports.KeywordCxt = KeywordCxt;
  function keywordCode(it, keyword, def2, ruleType) {
    let cxt = new KeywordCxt(it, def2, keyword);
    if ("code" in def2)
      def2.code(cxt, ruleType);
    else if (cxt.$data && def2.validate)
      (0, keyword_1.funcKeywordCode)(cxt, def2);
    else if ("macro" in def2)
      (0, keyword_1.macroKeywordCode)(cxt, def2);
    else if (def2.compile || def2.validate)
      (0, keyword_1.funcKeywordCode)(cxt, def2);
  }
  var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/, RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function getData($data, { dataLevel, dataNames, dataPathArr }) {
    let jsonPointer, data;
    if ($data === "")
      return names_1.default.rootData;
    if ($data[0] === "/") {
      if (!JSON_POINTER.test($data))
        throw Error(`Invalid JSON-pointer: ${$data}`);
      jsonPointer = $data, data = names_1.default.rootData;
    } else {
      let matches = RELATIVE_JSON_POINTER.exec($data);
      if (!matches)
        throw Error(`Invalid JSON-pointer: ${$data}`);
      let up = +matches[1];
      if (jsonPointer = matches[2], jsonPointer === "#") {
        if (up >= dataLevel)
          throw Error(errorMsg("property/index", up));
        return dataPathArr[dataLevel - up];
      }
      if (up > dataLevel)
        throw Error(errorMsg("data", up));
      if (data = dataNames[dataLevel - up], !jsonPointer)
        return data;
    }
    let expr = data, segments = jsonPointer.split("/");
    for (let segment of segments)
      if (segment)
        data = codegen_1._`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`, expr = codegen_1._`${expr} && ${data}`;
    return expr;
    function errorMsg(pointerType, up) {
      return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
    }
  }
  exports.getData = getData;
});
