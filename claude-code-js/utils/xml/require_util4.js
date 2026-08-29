// var: require_util4
var require_util4 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
  var codegen_1 = require_codegen(), code_1 = require_code();
  function toHash(arr) {
    let hash = {};
    for (let item of arr)
      hash[item] = !0;
    return hash;
  }
  exports.toHash = toHash;
  function alwaysValidSchema(it, schema5) {
    if (typeof schema5 == "boolean")
      return schema5;
    if (Object.keys(schema5).length === 0)
      return !0;
    return checkUnknownRules(it, schema5), !schemaHasRules(schema5, it.self.RULES.all);
  }
  exports.alwaysValidSchema = alwaysValidSchema;
  function checkUnknownRules(it, schema5 = it.schema) {
    let { opts, self: self2 } = it;
    if (!opts.strictSchema)
      return;
    if (typeof schema5 === "boolean")
      return;
    let rules = self2.RULES.keywords;
    for (let key2 in schema5)
      if (!rules[key2])
        checkStrictMode(it, `unknown keyword: "${key2}"`);
  }
  exports.checkUnknownRules = checkUnknownRules;
  function schemaHasRules(schema5, rules) {
    if (typeof schema5 == "boolean")
      return !schema5;
    for (let key2 in schema5)
      if (rules[key2])
        return !0;
    return !1;
  }
  exports.schemaHasRules = schemaHasRules;
  function schemaHasRulesButRef(schema5, RULES) {
    if (typeof schema5 == "boolean")
      return !schema5;
    for (let key2 in schema5)
      if (key2 !== "$ref" && RULES.all[key2])
        return !0;
    return !1;
  }
  exports.schemaHasRulesButRef = schemaHasRulesButRef;
  function schemaRefOrVal({ topSchemaRef, schemaPath }, schema5, keyword, $data) {
    if (!$data) {
      if (typeof schema5 == "number" || typeof schema5 == "boolean")
        return schema5;
      if (typeof schema5 == "string")
        return codegen_1._`${schema5}`;
    }
    return codegen_1._`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
  }
  exports.schemaRefOrVal = schemaRefOrVal;
  function unescapeFragment(str) {
    return unescapeJsonPointer(decodeURIComponent(str));
  }
  exports.unescapeFragment = unescapeFragment;
  function escapeFragment(str) {
    return encodeURIComponent(escapeJsonPointer(str));
  }
  exports.escapeFragment = escapeFragment;
  function escapeJsonPointer(str) {
    if (typeof str == "number")
      return `${str}`;
    return str.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  exports.escapeJsonPointer = escapeJsonPointer;
  function unescapeJsonPointer(str) {
    return str.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  exports.unescapeJsonPointer = unescapeJsonPointer;
  function eachItem(xs, f) {
    if (Array.isArray(xs))
      for (let x4 of xs)
        f(x4);
    else
      f(xs);
  }
  exports.eachItem = eachItem;
  function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues: mergeValues3, resultToName }) {
    return (gen, from, to, toName) => {
      let res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues3(from, to);
      return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
    };
  }
  exports.mergeEvaluated = {
    props: makeMergeEvaluated({
      mergeNames: (gen, from, to) => gen.if(codegen_1._`${to} !== true && ${from} !== undefined`, () => {
        gen.if(codegen_1._`${from} === true`, () => gen.assign(to, !0), () => gen.assign(to, codegen_1._`${to} || {}`).code(codegen_1._`Object.assign(${to}, ${from})`));
      }),
      mergeToName: (gen, from, to) => gen.if(codegen_1._`${to} !== true`, () => {
        if (from === !0)
          gen.assign(to, !0);
        else
          gen.assign(to, codegen_1._`${to} || {}`), setEvaluated(gen, to, from);
      }),
      mergeValues: (from, to) => from === !0 ? !0 : { ...from, ...to },
      resultToName: evaluatedPropsToName
    }),
    items: makeMergeEvaluated({
      mergeNames: (gen, from, to) => gen.if(codegen_1._`${to} !== true && ${from} !== undefined`, () => gen.assign(to, codegen_1._`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
      mergeToName: (gen, from, to) => gen.if(codegen_1._`${to} !== true`, () => gen.assign(to, from === !0 ? !0 : codegen_1._`${to} > ${from} ? ${to} : ${from}`)),
      mergeValues: (from, to) => from === !0 ? !0 : Math.max(from, to),
      resultToName: (gen, items) => gen.var("items", items)
    })
  };
  function evaluatedPropsToName(gen, ps) {
    if (ps === !0)
      return gen.var("props", !0);
    let props = gen.var("props", codegen_1._`{}`);
    if (ps !== void 0)
      setEvaluated(gen, props, ps);
    return props;
  }
  exports.evaluatedPropsToName = evaluatedPropsToName;
  function setEvaluated(gen, props, ps) {
    Object.keys(ps).forEach((p4) => gen.assign(codegen_1._`${props}${(0, codegen_1.getProperty)(p4)}`, !0));
  }
  exports.setEvaluated = setEvaluated;
  var snippets = {};
  function useFunc(gen, f) {
    return gen.scopeValue("func", {
      ref: f,
      code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
    });
  }
  exports.useFunc = useFunc;
  var Type;
  (function(Type2) {
    Type2[Type2.Num = 0] = "Num", Type2[Type2.Str = 1] = "Str";
  })(Type || (exports.Type = Type = {}));
  function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
    if (dataProp instanceof codegen_1.Name) {
      let isNumber2 = dataPropType === Type.Num;
      return jsPropertySyntax ? isNumber2 ? codegen_1._`"[" + ${dataProp} + "]"` : codegen_1._`"['" + ${dataProp} + "']"` : isNumber2 ? codegen_1._`"/" + ${dataProp}` : codegen_1._`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
  }
  exports.getErrorPath = getErrorPath;
  function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
    if (!mode)
      return;
    if (msg = `strict mode: ${msg}`, mode === !0)
      throw Error(msg);
    it.self.logger.warn(msg);
  }
  exports.checkStrictMode = checkStrictMode;
});
