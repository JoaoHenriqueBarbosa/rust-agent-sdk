// var: require_sha12
var require_sha12 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _crypto = _interopRequireDefault(__require("crypto"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function sha1(bytes) {
    if (Array.isArray(bytes))
      bytes = Buffer.from(bytes);
    else if (typeof bytes === "string")
      bytes = Buffer.from(bytes, "utf8");
    return _crypto.default.createHash("sha1").update(bytes).digest();
  }
  var _default3 = sha1;
  exports.default = _default3;
});
