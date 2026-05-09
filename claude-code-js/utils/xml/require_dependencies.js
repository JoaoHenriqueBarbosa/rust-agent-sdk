// var: require_dependencies
var require_dependencies = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
  var codegen_1 = require_codegen(), util_1 = require_util4(), code_1 = require_code2();
  exports.error = {
    message: ({ params: { property: property2, depsCount, deps } }) => {
      let property_ies = depsCount === 1 ? "property" : "properties";
      return codegen_1.str`must have ${property_ies} ${deps} when property ${property2} is present`;
    },
    params: ({ params: { property: property2, depsCount, deps, missingProperty } }) => codegen_1._`{property: ${property2},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
  };
  var def2 = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: exports.error,
    code(cxt) {
      let [propDeps, schDeps] = splitDependencies(cxt);
      validatePropertyDeps(cxt, propDeps), validateSchemaDeps(cxt, schDeps);
    }
  };
  function splitDependencies({ schema: schema5 }) {
    let propertyDeps = {}, schemaDeps = {};
    for (let key2 in schema5) {
      if (key2 === "__proto__")
        continue;
      let deps = Array.isArray(schema5[key2]) ? propertyDeps : schemaDeps;
      deps[key2] = schema5[key2];
    }
    return [propertyDeps, schemaDeps];
  }
  function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
    let { gen, data, it } = cxt;
    if (Object.keys(propertyDeps).length === 0)
      return;
    let missing = gen.let("missing");
    for (let prop in propertyDeps) {
      let deps = propertyDeps[prop];
      if (deps.length === 0)
        continue;
      let hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
      if (cxt.setParams({
        property: prop,
        depsCount: deps.length,
        deps: deps.join(", ")
      }), it.allErrors)
        gen.if(hasProperty, () => {
          for (let depProp of deps)
            (0, code_1.checkReportMissingProp)(cxt, depProp);
        });
      else
        gen.if(codegen_1._`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`), (0, code_1.reportMissingProp)(cxt, missing), gen.else();
    }
  }
  exports.validatePropertyDeps = validatePropertyDeps;
  function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
    let { gen, data, keyword, it } = cxt, valid = gen.name("valid");
    for (let prop in schemaDeps) {
      if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
        continue;
      gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties), () => {
        let schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
        cxt.mergeValidEvaluated(schCxt, valid);
      }, () => gen.var(valid, !0)), cxt.ok(valid);
    }
  }
  exports.validateSchemaDeps = validateSchemaDeps;
  exports.default = def2;
});
