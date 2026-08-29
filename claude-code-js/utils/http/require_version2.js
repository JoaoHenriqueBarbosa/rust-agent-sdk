// var: require_version2
var require_version2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _validate = _interopRequireDefault(require_validate2());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function version5(uuid8) {
    if (!(0, _validate.default)(uuid8))
      throw TypeError("Invalid UUID");
    return parseInt(uuid8.slice(14, 15), 16);
  }
  var _default3 = version5;
  exports.default = _default3;
});
