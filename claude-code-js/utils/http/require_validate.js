// var: require_validate
var require_validate = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _regex2 = _interopRequireDefault(require_regex());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function validate2(uuid5) {
    return typeof uuid5 === "string" && _regex2.default.test(uuid5);
  }
  var _default3 = validate2;
  exports.default = _default3;
});
