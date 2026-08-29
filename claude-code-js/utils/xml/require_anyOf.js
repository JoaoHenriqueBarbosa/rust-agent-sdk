// var: require_anyOf
var require_anyOf = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var code_1 = require_code2(), def2 = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: code_1.validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  exports.default = def2;
});
