// var: require_dist_cjs89
var require_dist_cjs89 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.toUtf8 = exports.fromUtf8 = void 0;
  var pureJs_1 = require_pureJs(), whatwgEncodingApi_1 = require_whatwgEncodingApi(), fromUtf810 = (input) => typeof TextEncoder === "function" ? (0, whatwgEncodingApi_1.fromUtf8)(input) : (0, pureJs_1.fromUtf8)(input);
  exports.fromUtf8 = fromUtf810;
  var toUtf85 = (input) => typeof TextDecoder === "function" ? (0, whatwgEncodingApi_1.toUtf8)(input) : (0, pureJs_1.toUtf8)(input);
  exports.toUtf8 = toUtf85;
});
