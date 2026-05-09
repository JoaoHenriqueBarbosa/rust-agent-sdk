// var: require_rules
var require_rules = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getRules = exports.isJSONType = void 0;
  var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"], jsonTypes = new Set(_jsonTypes);
  function isJSONType(x4) {
    return typeof x4 == "string" && jsonTypes.has(x4);
  }
  exports.isJSONType = isJSONType;
  function getRules() {
    let groups = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...groups, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  exports.getRules = getRules;
});
