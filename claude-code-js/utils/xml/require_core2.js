// var: require_core2
var require_core2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
  var validate_1 = require_validate3();
  Object.defineProperty(exports, "KeywordCxt", { enumerable: !0, get: function() {
    return validate_1.KeywordCxt;
  } });
  var codegen_1 = require_codegen();
  Object.defineProperty(exports, "_", { enumerable: !0, get: function() {
    return codegen_1._;
  } });
  Object.defineProperty(exports, "str", { enumerable: !0, get: function() {
    return codegen_1.str;
  } });
  Object.defineProperty(exports, "stringify", { enumerable: !0, get: function() {
    return codegen_1.stringify;
  } });
  Object.defineProperty(exports, "nil", { enumerable: !0, get: function() {
    return codegen_1.nil;
  } });
  Object.defineProperty(exports, "Name", { enumerable: !0, get: function() {
    return codegen_1.Name;
  } });
  Object.defineProperty(exports, "CodeGen", { enumerable: !0, get: function() {
    return codegen_1.CodeGen;
  } });
  var validation_error_1 = require_validation_error(), ref_error_1 = require_ref_error(), rules_1 = require_rules(), compile_1 = require_compile(), codegen_2 = require_codegen(), resolve_1 = require_resolve(), dataType_1 = require_dataType(), util_1 = require_util4(), $dataRefSchema = require_data(), uri_1 = require_uri2(), defaultRegExp = (str, flags) => new RegExp(str, flags);
  defaultRegExp.code = "new RegExp";
  var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"], EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), removedOptions = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, deprecatedOptions = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, MAX_EXPRESSION = 200;
  function requiredOptions(o5) {
    var _a3, _b2, _c19, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
    let s2 = o5.strict, _optz = (_a3 = o5.code) === null || _a3 === void 0 ? void 0 : _a3.optimize, optimize2 = _optz === !0 || _optz === void 0 ? 1 : _optz || 0, regExp = (_c19 = (_b2 = o5.code) === null || _b2 === void 0 ? void 0 : _b2.regExp) !== null && _c19 !== void 0 ? _c19 : defaultRegExp, uriResolver = (_d = o5.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
    return {
      strictSchema: (_f = (_e = o5.strictSchema) !== null && _e !== void 0 ? _e : s2) !== null && _f !== void 0 ? _f : !0,
      strictNumbers: (_h = (_g = o5.strictNumbers) !== null && _g !== void 0 ? _g : s2) !== null && _h !== void 0 ? _h : !0,
      strictTypes: (_k = (_j = o5.strictTypes) !== null && _j !== void 0 ? _j : s2) !== null && _k !== void 0 ? _k : "log",
      strictTuples: (_m = (_l = o5.strictTuples) !== null && _l !== void 0 ? _l : s2) !== null && _m !== void 0 ? _m : "log",
      strictRequired: (_p = (_o = o5.strictRequired) !== null && _o !== void 0 ? _o : s2) !== null && _p !== void 0 ? _p : !1,
      code: o5.code ? { ...o5.code, optimize: optimize2, regExp } : { optimize: optimize2, regExp },
      loopRequired: (_q = o5.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
      loopEnum: (_r = o5.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
      meta: (_s = o5.meta) !== null && _s !== void 0 ? _s : !0,
      messages: (_t = o5.messages) !== null && _t !== void 0 ? _t : !0,
      inlineRefs: (_u = o5.inlineRefs) !== null && _u !== void 0 ? _u : !0,
      schemaId: (_v = o5.schemaId) !== null && _v !== void 0 ? _v : "$id",
      addUsedSchema: (_w = o5.addUsedSchema) !== null && _w !== void 0 ? _w : !0,
      validateSchema: (_x = o5.validateSchema) !== null && _x !== void 0 ? _x : !0,
      validateFormats: (_y = o5.validateFormats) !== null && _y !== void 0 ? _y : !0,
      unicodeRegExp: (_z = o5.unicodeRegExp) !== null && _z !== void 0 ? _z : !0,
      int32range: (_0 = o5.int32range) !== null && _0 !== void 0 ? _0 : !0,
      uriResolver
    };
  }

  class Ajv {
    constructor(opts = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set, this._loading = {}, this._cache = /* @__PURE__ */ new Map, opts = this.opts = { ...opts, ...requiredOptions(opts) };
      let { es5, lines: lines2 } = this.opts.code;
      this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines: lines2 }), this.logger = getLogger2(opts.logger);
      let formatOpt = opts.validateFormats;
      if (opts.validateFormats = !1, this.RULES = (0, rules_1.getRules)(), checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED"), checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn"), this._metaOpts = getMetaSchemaOptions.call(this), opts.formats)
        addInitialFormats.call(this);
      if (this._addVocabularies(), this._addDefaultMetaSchema(), opts.keywords)
        addInitialKeywords.call(this, opts.keywords);
      if (typeof opts.meta == "object")
        this.addMetaSchema(opts.meta);
      addInitialSchemas.call(this), opts.validateFormats = formatOpt;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      let { $data, meta, schemaId } = this.opts, _dataRefSchema = $dataRefSchema;
      if (schemaId === "id")
        _dataRefSchema = { ...$dataRefSchema }, _dataRefSchema.id = _dataRefSchema.$id, delete _dataRefSchema.$id;
      if (meta && $data)
        this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], !1);
    }
    defaultMeta() {
      let { meta, schemaId } = this.opts;
      return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
    }
    validate(schemaKeyRef, data) {
      let v2;
      if (typeof schemaKeyRef == "string") {
        if (v2 = this.getSchema(schemaKeyRef), !v2)
          throw Error(`no schema with key or ref "${schemaKeyRef}"`);
      } else
        v2 = this.compile(schemaKeyRef);
      let valid = v2(data);
      if (!("$async" in v2))
        this.errors = v2.errors;
      return valid;
    }
    compile(schema5, _meta) {
      let sch = this._addSchema(schema5, _meta);
      return sch.validate || this._compileSchemaEnv(sch);
    }
    compileAsync(schema5, meta) {
      if (typeof this.opts.loadSchema != "function")
        throw Error("options.loadSchema should be a function");
      let { loadSchema } = this.opts;
      return runCompileAsync.call(this, schema5, meta);
      async function runCompileAsync(_schema, _meta) {
        await loadMetaSchema.call(this, _schema.$schema);
        let sch = this._addSchema(_schema, _meta);
        return sch.validate || _compileAsync.call(this, sch);
      }
      async function loadMetaSchema($ref) {
        if ($ref && !this.getSchema($ref))
          await runCompileAsync.call(this, { $ref }, !0);
      }
      async function _compileAsync(sch) {
        try {
          return this._compileSchemaEnv(sch);
        } catch (e) {
          if (!(e instanceof ref_error_1.default))
            throw e;
          return checkLoaded.call(this, e), await loadMissingSchema.call(this, e.missingSchema), _compileAsync.call(this, sch);
        }
      }
      function checkLoaded({ missingSchema: ref, missingRef }) {
        if (this.refs[ref])
          throw Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
      }
      async function loadMissingSchema(ref) {
        let _schema = await _loadSchema.call(this, ref);
        if (!this.refs[ref])
          await loadMetaSchema.call(this, _schema.$schema);
        if (!this.refs[ref])
          this.addSchema(_schema, ref, meta);
      }
      async function _loadSchema(ref) {
        let p4 = this._loading[ref];
        if (p4)
          return p4;
        try {
          return await (this._loading[ref] = loadSchema(ref));
        } finally {
          delete this._loading[ref];
        }
      }
    }
    addSchema(schema5, key2, _meta, _validateSchema = this.opts.validateSchema) {
      if (Array.isArray(schema5)) {
        for (let sch of schema5)
          this.addSchema(sch, void 0, _meta, _validateSchema);
        return this;
      }
      let id;
      if (typeof schema5 === "object") {
        let { schemaId } = this.opts;
        if (id = schema5[schemaId], id !== void 0 && typeof id != "string")
          throw Error(`schema ${schemaId} must be string`);
      }
      return key2 = (0, resolve_1.normalizeId)(key2 || id), this._checkUnique(key2), this.schemas[key2] = this._addSchema(schema5, _meta, key2, _validateSchema, !0), this;
    }
    addMetaSchema(schema5, key2, _validateSchema = this.opts.validateSchema) {
      return this.addSchema(schema5, key2, !0, _validateSchema), this;
    }
    validateSchema(schema5, throwOrLogError) {
      if (typeof schema5 == "boolean")
        return !0;
      let $schema;
      if ($schema = schema5.$schema, $schema !== void 0 && typeof $schema != "string")
        throw Error("$schema must be a string");
      if ($schema = $schema || this.opts.defaultMeta || this.defaultMeta(), !$schema)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      let valid = this.validate($schema, schema5);
      if (!valid && throwOrLogError) {
        let message = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(message);
        else
          throw Error(message);
      }
      return valid;
    }
    getSchema(keyRef) {
      let sch;
      while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
        keyRef = sch;
      if (sch === void 0) {
        let { schemaId } = this.opts, root2 = new compile_1.SchemaEnv({ schema: {}, schemaId });
        if (sch = compile_1.resolveSchema.call(this, root2, keyRef), !sch)
          return;
        this.refs[keyRef] = sch;
      }
      return sch.validate || this._compileSchemaEnv(sch);
    }
    removeSchema(schemaKeyRef) {
      if (schemaKeyRef instanceof RegExp)
        return this._removeAllSchemas(this.schemas, schemaKeyRef), this._removeAllSchemas(this.refs, schemaKeyRef), this;
      switch (typeof schemaKeyRef) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          let sch = getSchEnv.call(this, schemaKeyRef);
          if (typeof sch == "object")
            this._cache.delete(sch.schema);
          return delete this.schemas[schemaKeyRef], delete this.refs[schemaKeyRef], this;
        }
        case "object": {
          let cacheKey = schemaKeyRef;
          this._cache.delete(cacheKey);
          let id = schemaKeyRef[this.opts.schemaId];
          if (id)
            id = (0, resolve_1.normalizeId)(id), delete this.schemas[id], delete this.refs[id];
          return this;
        }
        default:
          throw Error("ajv.removeSchema: invalid parameter");
      }
    }
    addVocabulary(definitions) {
      for (let def2 of definitions)
        this.addKeyword(def2);
      return this;
    }
    addKeyword(kwdOrDef, def2) {
      let keyword;
      if (typeof kwdOrDef == "string") {
        if (keyword = kwdOrDef, typeof def2 == "object")
          this.logger.warn("these parameters are deprecated, see docs for addKeyword"), def2.keyword = keyword;
      } else if (typeof kwdOrDef == "object" && def2 === void 0) {
        if (def2 = kwdOrDef, keyword = def2.keyword, Array.isArray(keyword) && !keyword.length)
          throw Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw Error("invalid addKeywords parameters");
      if (checkKeyword.call(this, keyword, def2), !def2)
        return (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd)), this;
      keywordMetaschema.call(this, def2);
      let definition = {
        ...def2,
        type: (0, dataType_1.getJSONTypes)(def2.type),
        schemaType: (0, dataType_1.getJSONTypes)(def2.schemaType)
      };
      return (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k3) => addRule.call(this, k3, definition) : (k3) => definition.type.forEach((t2) => addRule.call(this, k3, definition, t2))), this;
    }
    getKeyword(keyword) {
      let rule = this.RULES.all[keyword];
      return typeof rule == "object" ? rule.definition : !!rule;
    }
    removeKeyword(keyword) {
      let { RULES } = this;
      delete RULES.keywords[keyword], delete RULES.all[keyword];
      for (let group of RULES.rules) {
        let i5 = group.rules.findIndex((rule) => rule.keyword === keyword);
        if (i5 >= 0)
          group.rules.splice(i5, 1);
      }
      return this;
    }
    addFormat(name3, format4) {
      if (typeof format4 == "string")
        format4 = new RegExp(format4);
      return this.formats[name3] = format4, this;
    }
    errorsText(errors8 = this.errors, { separator = ", ", dataVar = "data" } = {}) {
      if (!errors8 || errors8.length === 0)
        return "No errors";
      return errors8.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text2, msg) => text2 + separator + msg);
    }
    $dataMetaSchema(metaSchema, keywordsJsonPointers) {
      let rules = this.RULES.all;
      metaSchema = JSON.parse(JSON.stringify(metaSchema));
      for (let jsonPointer of keywordsJsonPointers) {
        let segments = jsonPointer.split("/").slice(1), keywords = metaSchema;
        for (let seg of segments)
          keywords = keywords[seg];
        for (let key2 in rules) {
          let rule = rules[key2];
          if (typeof rule != "object")
            continue;
          let { $data } = rule.definition, schema5 = keywords[key2];
          if ($data && schema5)
            keywords[key2] = schemaOrData(schema5);
        }
      }
      return metaSchema;
    }
    _removeAllSchemas(schemas4, regex2) {
      for (let keyRef in schemas4) {
        let sch = schemas4[keyRef];
        if (!regex2 || regex2.test(keyRef)) {
          if (typeof sch == "string")
            delete schemas4[keyRef];
          else if (sch && !sch.meta)
            this._cache.delete(sch.schema), delete schemas4[keyRef];
        }
      }
    }
    _addSchema(schema5, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
      let id, { schemaId } = this.opts;
      if (typeof schema5 == "object")
        id = schema5[schemaId];
      else if (this.opts.jtd)
        throw Error("schema must be object");
      else if (typeof schema5 != "boolean")
        throw Error("schema must be object or boolean");
      let sch = this._cache.get(schema5);
      if (sch !== void 0)
        return sch;
      baseId = (0, resolve_1.normalizeId)(id || baseId);
      let localRefs = resolve_1.getSchemaRefs.call(this, schema5, baseId);
      if (sch = new compile_1.SchemaEnv({ schema: schema5, schemaId, meta, baseId, localRefs }), this._cache.set(sch.schema, sch), addSchema && !baseId.startsWith("#")) {
        if (baseId)
          this._checkUnique(baseId);
        this.refs[baseId] = sch;
      }
      if (validateSchema)
        this.validateSchema(schema5, !0);
      return sch;
    }
    _checkUnique(id) {
      if (this.schemas[id] || this.refs[id])
        throw Error(`schema with key or id "${id}" already exists`);
    }
    _compileSchemaEnv(sch) {
      if (sch.meta)
        this._compileMetaSchema(sch);
      else
        compile_1.compileSchema.call(this, sch);
      if (!sch.validate)
        throw Error("ajv implementation error");
      return sch.validate;
    }
    _compileMetaSchema(sch) {
      let currentOpts = this.opts;
      this.opts = this._metaOpts;
      try {
        compile_1.compileSchema.call(this, sch);
      } finally {
        this.opts = currentOpts;
      }
    }
  }
  Ajv.ValidationError = validation_error_1.default;
  Ajv.MissingRefError = ref_error_1.default;
  exports.default = Ajv;
  function checkOptions(checkOpts, options2, msg, log3 = "error") {
    for (let key2 in checkOpts) {
      let opt = key2;
      if (opt in options2)
        this.logger[log3](`${msg}: option ${key2}. ${checkOpts[opt]}`);
    }
  }
  function getSchEnv(keyRef) {
    return keyRef = (0, resolve_1.normalizeId)(keyRef), this.schemas[keyRef] || this.refs[keyRef];
  }
  function addInitialSchemas() {
    let optsSchemas = this.opts.schemas;
    if (!optsSchemas)
      return;
    if (Array.isArray(optsSchemas))
      this.addSchema(optsSchemas);
    else
      for (let key2 in optsSchemas)
        this.addSchema(optsSchemas[key2], key2);
  }
  function addInitialFormats() {
    for (let name3 in this.opts.formats) {
      let format4 = this.opts.formats[name3];
      if (format4)
        this.addFormat(name3, format4);
    }
  }
  function addInitialKeywords(defs) {
    if (Array.isArray(defs)) {
      this.addVocabulary(defs);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (let keyword in defs) {
      let def2 = defs[keyword];
      if (!def2.keyword)
        def2.keyword = keyword;
      this.addKeyword(def2);
    }
  }
  function getMetaSchemaOptions() {
    let metaOpts = { ...this.opts };
    for (let opt of META_IGNORE_OPTIONS)
      delete metaOpts[opt];
    return metaOpts;
  }
  var noLogs = { log() {}, warn() {}, error() {} };
  function getLogger2(logger34) {
    if (logger34 === !1)
      return noLogs;
    if (logger34 === void 0)
      return console;
    if (logger34.log && logger34.warn && logger34.error)
      return logger34;
    throw Error("logger must implement log, warn and error methods");
  }
  var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
  function checkKeyword(keyword, def2) {
    let { RULES } = this;
    if ((0, util_1.eachItem)(keyword, (kwd) => {
      if (RULES.keywords[kwd])
        throw Error(`Keyword ${kwd} is already defined`);
      if (!KEYWORD_NAME.test(kwd))
        throw Error(`Keyword ${kwd} has invalid name`);
    }), !def2)
      return;
    if (def2.$data && !(("code" in def2) || ("validate" in def2)))
      throw Error('$data keyword must have "code" or "validate" function');
  }
  function addRule(keyword, definition, dataType) {
    var _a3;
    let post = definition === null || definition === void 0 ? void 0 : definition.post;
    if (dataType && post)
      throw Error('keyword with "post" flag cannot have "type"');
    let { RULES } = this, ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t2 }) => t2 === dataType);
    if (!ruleGroup)
      ruleGroup = { type: dataType, rules: [] }, RULES.rules.push(ruleGroup);
    if (RULES.keywords[keyword] = !0, !definition)
      return;
    let rule = {
      keyword,
      definition: {
        ...definition,
        type: (0, dataType_1.getJSONTypes)(definition.type),
        schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
      }
    };
    if (definition.before)
      addBeforeRule.call(this, ruleGroup, rule, definition.before);
    else
      ruleGroup.rules.push(rule);
    RULES.all[keyword] = rule, (_a3 = definition.implements) === null || _a3 === void 0 || _a3.forEach((kwd) => this.addKeyword(kwd));
  }
  function addBeforeRule(ruleGroup, rule, before) {
    let i5 = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
    if (i5 >= 0)
      ruleGroup.rules.splice(i5, 0, rule);
    else
      ruleGroup.rules.push(rule), this.logger.warn(`rule ${before} is not defined`);
  }
  function keywordMetaschema(def2) {
    let { metaSchema } = def2;
    if (metaSchema === void 0)
      return;
    if (def2.$data && this.opts.$data)
      metaSchema = schemaOrData(metaSchema);
    def2.validateSchema = this.compile(metaSchema, !0);
  }
  var $dataRef = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function schemaOrData(schema5) {
    return { anyOf: [schema5, $dataRef] };
  }
});
