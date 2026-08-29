// var: require_validate2
var require_validate2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _regex2 = _interopRequireDefault(require_regex2());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function validate3(uuid8) {
    return typeof uuid8 === "string" && _regex2.default.test(uuid8);
  }
  var _default3 = validate3;
  exports.default = _default3;
});
