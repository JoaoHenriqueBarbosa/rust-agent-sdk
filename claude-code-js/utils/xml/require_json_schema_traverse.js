// var: require_json_schema_traverse
var require_json_schema_traverse = __commonJS((exports, module) => {
  var traverse = module.exports = function(schema5, opts, cb) {
    if (typeof opts == "function")
      cb = opts, opts = {};
    cb = opts.cb || cb;
    var pre = typeof cb == "function" ? cb : cb.pre || function() {}, post = cb.post || function() {};
    _traverse(opts, pre, post, schema5, "", schema5);
  };
  traverse.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  };
  traverse.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  };
  traverse.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  };
  traverse.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function _traverse(opts, pre, post, schema5, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
    if (schema5 && typeof schema5 == "object" && !Array.isArray(schema5)) {
      pre(schema5, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      for (var key2 in schema5) {
        var sch = schema5[key2];
        if (Array.isArray(sch)) {
          if (key2 in traverse.arrayKeywords)
            for (var i5 = 0;i5 < sch.length; i5++)
              _traverse(opts, pre, post, sch[i5], jsonPtr + "/" + key2 + "/" + i5, rootSchema, jsonPtr, key2, schema5, i5);
        } else if (key2 in traverse.propsKeywords) {
          if (sch && typeof sch == "object")
            for (var prop in sch)
              _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key2 + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key2, schema5, prop);
        } else if (key2 in traverse.keywords || opts.allKeys && !(key2 in traverse.skipKeywords))
          _traverse(opts, pre, post, sch, jsonPtr + "/" + key2, rootSchema, jsonPtr, key2, schema5);
      }
      post(schema5, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
    }
  }
  function escapeJsonPtr(str) {
    return str.replace(/~/g, "~0").replace(/\//g, "~1");
  }
});
