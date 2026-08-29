// var: require_compile
var require_compile = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
  var codegen_1 = require_codegen(), validation_error_1 = require_validation_error(), names_1 = require_names(), resolve_1 = require_resolve(), util_1 = require_util4(), validate_1 = require_validate3();

  class SchemaEnv {
    constructor(env5) {
      var _a3;
      this.refs = {}, this.dynamicAnchors = {};
      let schema5;
      if (typeof env5.schema == "object")
        schema5 = env5.schema;
      this.schema = env5.schema, this.schemaId = env5.schemaId, this.root = env5.root || this, this.baseId = (_a3 = env5.baseId) !== null && _a3 !== void 0 ? _a3 : (0, resolve_1.normalizeId)(schema5 === null || schema5 === void 0 ? void 0 : schema5[env5.schemaId || "$id"]), this.schemaPath = env5.schemaPath, this.localRefs = env5.localRefs, this.meta = env5.meta, this.$async = schema5 === null || schema5 === void 0 ? void 0 : schema5.$async, this.refs = {};
    }
  }
  exports.SchemaEnv = SchemaEnv;
  function compileSchema(sch) {
    let _sch = getCompilingSchema.call(this, sch);
    if (_sch)
      return _sch;
    let rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId), { es5, lines: lines2 } = this.opts.code, { ownProperties } = this.opts, gen = new codegen_1.CodeGen(this.scope, { es5, lines: lines2, ownProperties }), _ValidationError;
    if (sch.$async)
      _ValidationError = gen.scopeValue("Error", {
        ref: validation_error_1.default,
        code: codegen_1._`require("ajv/dist/runtime/validation_error").default`
      });
    let validateName = gen.scopeName("validate");
    sch.validateName = validateName;
    let schemaCxt = {
      gen,
      allErrors: this.opts.allErrors,
      data: names_1.default.data,
      parentData: names_1.default.parentData,
      parentDataProperty: names_1.default.parentDataProperty,
      dataNames: [names_1.default.data],
      dataPathArr: [codegen_1.nil],
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set,
      topSchemaRef: gen.scopeValue("schema", this.opts.code.source === !0 ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
      validateName,
      ValidationError: _ValidationError,
      schema: sch.schema,
      schemaEnv: sch,
      rootId,
      baseId: sch.baseId || rootId,
      schemaPath: codegen_1.nil,
      errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: codegen_1._`""`,
      opts: this.opts,
      self: this
    }, sourceCode;
    try {
      this._compilations.add(sch), (0, validate_1.validateFunctionCode)(schemaCxt), gen.optimize(this.opts.code.optimize);
      let validateCode = gen.toString();
      if (sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`, this.opts.code.process)
        sourceCode = this.opts.code.process(sourceCode, sch);
      let validate4 = Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode)(this, this.scope.get());
      if (this.scope.value(validateName, { ref: validate4 }), validate4.errors = null, validate4.schema = sch.schema, validate4.schemaEnv = sch, sch.$async)
        validate4.$async = !0;
      if (this.opts.code.source === !0)
        validate4.source = { validateName, validateCode, scopeValues: gen._values };
      if (this.opts.unevaluated) {
        let { props, items } = schemaCxt;
        if (validate4.evaluated = {
          props: props instanceof codegen_1.Name ? void 0 : props,
          items: items instanceof codegen_1.Name ? void 0 : items,
          dynamicProps: props instanceof codegen_1.Name,
          dynamicItems: items instanceof codegen_1.Name
        }, validate4.source)
          validate4.source.evaluated = (0, codegen_1.stringify)(validate4.evaluated);
      }
      return sch.validate = validate4, sch;
    } catch (e) {
      if (delete sch.validate, delete sch.validateName, sourceCode)
        this.logger.error("Error compiling schema, function code:", sourceCode);
      throw e;
    } finally {
      this._compilations.delete(sch);
    }
  }
  exports.compileSchema = compileSchema;
  function resolveRef2(root2, baseId, ref) {
    var _a3;
    ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
    let schOrFunc = root2.refs[ref];
    if (schOrFunc)
      return schOrFunc;
    let _sch = resolve24.call(this, root2, ref);
    if (_sch === void 0) {
      let schema5 = (_a3 = root2.localRefs) === null || _a3 === void 0 ? void 0 : _a3[ref], { schemaId } = this.opts;
      if (schema5)
        _sch = new SchemaEnv({ schema: schema5, schemaId, root: root2, baseId });
    }
    if (_sch === void 0)
      return;
    return root2.refs[ref] = inlineOrCompile.call(this, _sch);
  }
  exports.resolveRef = resolveRef2;
  function inlineOrCompile(sch) {
    if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
      return sch.schema;
    return sch.validate ? sch : compileSchema.call(this, sch);
  }
  function getCompilingSchema(schEnv) {
    for (let sch of this._compilations)
      if (sameSchemaEnv(sch, schEnv))
        return sch;
  }
  exports.getCompilingSchema = getCompilingSchema;
  function sameSchemaEnv(s1, s2) {
    return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
  }
  function resolve24(root2, ref) {
    let sch;
    while (typeof (sch = this.refs[ref]) == "string")
      ref = sch;
    return sch || this.schemas[ref] || resolveSchema.call(this, root2, ref);
  }
  function resolveSchema(root2, ref) {
    let p4 = this.opts.uriResolver.parse(ref), refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p4), baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root2.baseId, void 0);
    if (Object.keys(root2.schema).length > 0 && refPath === baseId)
      return getJsonPointer.call(this, p4, root2);
    let id = (0, resolve_1.normalizeId)(refPath), schOrRef = this.refs[id] || this.schemas[id];
    if (typeof schOrRef == "string") {
      let sch = resolveSchema.call(this, root2, schOrRef);
      if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
        return;
      return getJsonPointer.call(this, p4, sch);
    }
    if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
      return;
    if (!schOrRef.validate)
      compileSchema.call(this, schOrRef);
    if (id === (0, resolve_1.normalizeId)(ref)) {
      let { schema: schema5 } = schOrRef, { schemaId } = this.opts, schId = schema5[schemaId];
      if (schId)
        baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
      return new SchemaEnv({ schema: schema5, schemaId, root: root2, baseId });
    }
    return getJsonPointer.call(this, p4, schOrRef);
  }
  exports.resolveSchema = resolveSchema;
  var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function getJsonPointer(parsedRef, { baseId, schema: schema5, root: root2 }) {
    var _a3;
    if (((_a3 = parsedRef.fragment) === null || _a3 === void 0 ? void 0 : _a3[0]) !== "/")
      return;
    for (let part of parsedRef.fragment.slice(1).split("/")) {
      if (typeof schema5 === "boolean")
        return;
      let partSchema = schema5[(0, util_1.unescapeFragment)(part)];
      if (partSchema === void 0)
        return;
      schema5 = partSchema;
      let schId = typeof schema5 === "object" && schema5[this.opts.schemaId];
      if (!PREVENT_SCOPE_CHANGE.has(part) && schId)
        baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
    }
    let env5;
    if (typeof schema5 != "boolean" && schema5.$ref && !(0, util_1.schemaHasRulesButRef)(schema5, this.RULES)) {
      let $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema5.$ref);
      env5 = resolveSchema.call(this, root2, $ref);
    }
    let { schemaId } = this.opts;
    if (env5 = env5 || new SchemaEnv({ schema: schema5, schemaId, root: root2, baseId }), env5.schema !== env5.root.schema)
      return env5;
    return;
  }
});
