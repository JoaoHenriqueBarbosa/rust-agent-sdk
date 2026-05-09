// var: require_resolve
var require_resolve = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
  var util_1 = require_util4(), equal = require_fast_deep_equal(), traverse = require_json_schema_traverse(), SIMPLE_INLINED = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function inlineRef(schema5, limit = !0) {
    if (typeof schema5 == "boolean")
      return !0;
    if (limit === !0)
      return !hasRef(schema5);
    if (!limit)
      return !1;
    return countKeys(schema5) <= limit;
  }
  exports.inlineRef = inlineRef;
  var REF_KEYWORDS = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function hasRef(schema5) {
    for (let key2 in schema5) {
      if (REF_KEYWORDS.has(key2))
        return !0;
      let sch = schema5[key2];
      if (Array.isArray(sch) && sch.some(hasRef))
        return !0;
      if (typeof sch == "object" && hasRef(sch))
        return !0;
    }
    return !1;
  }
  function countKeys(schema5) {
    let count3 = 0;
    for (let key2 in schema5) {
      if (key2 === "$ref")
        return 1 / 0;
      if (count3++, SIMPLE_INLINED.has(key2))
        continue;
      if (typeof schema5[key2] == "object")
        (0, util_1.eachItem)(schema5[key2], (sch) => count3 += countKeys(sch));
      if (count3 === 1 / 0)
        return 1 / 0;
    }
    return count3;
  }
  function getFullPath(resolver, id = "", normalize10) {
    if (normalize10 !== !1)
      id = normalizeId(id);
    let p4 = resolver.parse(id);
    return _getFullPath(resolver, p4);
  }
  exports.getFullPath = getFullPath;
  function _getFullPath(resolver, p4) {
    return resolver.serialize(p4).split("#")[0] + "#";
  }
  exports._getFullPath = _getFullPath;
  var TRAILING_SLASH_HASH = /#\/?$/;
  function normalizeId(id) {
    return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
  }
  exports.normalizeId = normalizeId;
  function resolveUrl(resolver, baseId, id) {
    return id = normalizeId(id), resolver.resolve(baseId, id);
  }
  exports.resolveUrl = resolveUrl;
  var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
  function getSchemaRefs(schema5, baseId) {
    if (typeof schema5 == "boolean")
      return {};
    let { schemaId, uriResolver } = this.opts, schId = normalizeId(schema5[schemaId] || baseId), baseIds = { "": schId }, pathPrefix = getFullPath(uriResolver, schId, !1), localRefs = {}, schemaRefs = /* @__PURE__ */ new Set;
    return traverse(schema5, { allKeys: !0 }, (sch, jsonPtr, _, parentJsonPtr) => {
      if (parentJsonPtr === void 0)
        return;
      let fullPath = pathPrefix + jsonPtr, innerBaseId = baseIds[parentJsonPtr];
      if (typeof sch[schemaId] == "string")
        innerBaseId = addRef.call(this, sch[schemaId]);
      addAnchor.call(this, sch.$anchor), addAnchor.call(this, sch.$dynamicAnchor), baseIds[jsonPtr] = innerBaseId;
      function addRef(ref) {
        let _resolve = this.opts.uriResolver.resolve;
        if (ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref), schemaRefs.has(ref))
          throw ambiguos(ref);
        schemaRefs.add(ref);
        let schOrRef = this.refs[ref];
        if (typeof schOrRef == "string")
          schOrRef = this.refs[schOrRef];
        if (typeof schOrRef == "object")
          checkAmbiguosRef(sch, schOrRef.schema, ref);
        else if (ref !== normalizeId(fullPath))
          if (ref[0] === "#")
            checkAmbiguosRef(sch, localRefs[ref], ref), localRefs[ref] = sch;
          else
            this.refs[ref] = fullPath;
        return ref;
      }
      function addAnchor(anchor) {
        if (typeof anchor == "string") {
          if (!ANCHOR.test(anchor))
            throw Error(`invalid anchor "${anchor}"`);
          addRef.call(this, `#${anchor}`);
        }
      }
    }), localRefs;
    function checkAmbiguosRef(sch1, sch2, ref) {
      if (sch2 !== void 0 && !equal(sch1, sch2))
        throw ambiguos(ref);
    }
    function ambiguos(ref) {
      return Error(`reference "${ref}" resolves to more than one schema`);
    }
  }
  exports.getSchemaRefs = getSchemaRefs;
});
