// var: require_whatwgEncodingApi
var require_whatwgEncodingApi = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.toUtf8 = exports.fromUtf8 = void 0;
  function fromUtf810(input) {
    return (/* @__PURE__ */ new TextEncoder()).encode(input);
  }
  exports.fromUtf8 = fromUtf810;
  function toUtf85(input) {
    return new TextDecoder("utf-8").decode(input);
  }
  exports.toUtf8 = toUtf85;
});
