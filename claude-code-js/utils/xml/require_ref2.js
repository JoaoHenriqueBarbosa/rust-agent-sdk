// var: require_ref2
var require_ref2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.callRef = exports.getValidate = void 0;
  var ref_error_1 = require_ref_error(), code_1 = require_code2(), codegen_1 = require_codegen(), names_1 = require_names(), compile_1 = require_compile(), util_1 = require_util4(), def2 = {
    keyword: "$ref",
    schemaType: "string",
    code(cxt) {
      let { gen, schema: $ref, it } = cxt, { baseId, schemaEnv: env5, validateName, opts, self: self2 } = it, { root: root2 } = env5;
      if (($ref === "#" || $ref === "#/") && baseId === root2.baseId)
        return callRootRef();
      let schOrEnv = compile_1.resolveRef.call(self2, root2, baseId, $ref);
      if (schOrEnv === void 0)
        throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
      if (schOrEnv instanceof compile_1.SchemaEnv)
        return callValidate(schOrEnv);
      return inlineRefSchema(schOrEnv);
      function callRootRef() {
        if (env5 === root2)
          return callRef(cxt, validateName, env5, env5.$async);
        let rootName = gen.scopeValue("root", { ref: root2 });
        return callRef(cxt, codegen_1._`${rootName}.validate`, root2, root2.$async);
      }
      function callValidate(sch) {
        let v2 = getValidate(cxt, sch);
        callRef(cxt, v2, sch, sch.$async);
      }
      function inlineRefSchema(sch) {
        let schName = gen.scopeValue("schema", opts.code.source === !0 ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch }), valid = gen.name("valid"), schCxt = cxt.subschema({
          schema: sch,
          dataTypes: [],
          schemaPath: codegen_1.nil,
          topSchemaRef: schName,
          errSchemaPath: $ref
        }, valid);
        cxt.mergeEvaluated(schCxt), cxt.ok(valid);
      }
    }
  };
  function getValidate(cxt, sch) {
    let { gen } = cxt;
    return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : codegen_1._`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
  }
  exports.getValidate = getValidate;
  function callRef(cxt, v2, sch, $async) {
    let { gen, it } = cxt, { allErrors, schemaEnv: env5, opts } = it, passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
    if ($async)
      callAsyncRef();
    else
      callSyncRef();
    function callAsyncRef() {
      if (!env5.$async)
        throw Error("async schema referenced by sync schema");
      let valid = gen.let("valid");
      gen.try(() => {
        if (gen.code(codegen_1._`await ${(0, code_1.callValidateCode)(cxt, v2, passCxt)}`), addEvaluatedFrom(v2), !allErrors)
          gen.assign(valid, !0);
      }, (e) => {
        if (gen.if(codegen_1._`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e)), addErrorsFrom(e), !allErrors)
          gen.assign(valid, !1);
      }), cxt.ok(valid);
    }
    function callSyncRef() {
      cxt.result((0, code_1.callValidateCode)(cxt, v2, passCxt), () => addEvaluatedFrom(v2), () => addErrorsFrom(v2));
    }
    function addErrorsFrom(source) {
      let errs = codegen_1._`${source}.errors`;
      gen.assign(names_1.default.vErrors, codegen_1._`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`), gen.assign(names_1.default.errors, codegen_1._`${names_1.default.vErrors}.length`);
    }
    function addEvaluatedFrom(source) {
      var _a3;
      if (!it.opts.unevaluated)
        return;
      let schEvaluated = (_a3 = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a3 === void 0 ? void 0 : _a3.evaluated;
      if (it.props !== !0)
        if (schEvaluated && !schEvaluated.dynamicProps) {
          if (schEvaluated.props !== void 0)
            it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
        } else {
          let props = gen.var("props", codegen_1._`${source}.evaluated.props`);
          it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
        }
      if (it.items !== !0)
        if (schEvaluated && !schEvaluated.dynamicItems) {
          if (schEvaluated.items !== void 0)
            it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
        } else {
          let items = gen.var("items", codegen_1._`${source}.evaluated.items`);
          it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
        }
    }
  }
  exports.callRef = callRef;
  exports.default = def2;
});
