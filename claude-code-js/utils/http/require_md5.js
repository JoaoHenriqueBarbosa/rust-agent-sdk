// var: require_md5
var require_md5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _crypto = _interopRequireDefault(__require("crypto"));
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function md5(bytes) {
    if (Array.isArray(bytes))
      bytes = Buffer.from(bytes);
    else if (typeof bytes === "string")
      bytes = Buffer.from(bytes, "utf8");
    return _crypto.default.createHash("md5").update(bytes).digest();
  }
  var _default3 = md5;
  exports.default = _default3;
});
