// var: require_version
var require_version = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: !0
  });
  exports.default = void 0;
  var _validate = _interopRequireDefault(require_validate());
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function version3(uuid5) {
    if (!(0, _validate.default)(uuid5))
      throw TypeError("Invalid UUID");
    return parseInt(uuid5.substr(14, 1), 16);
  }
  var _default3 = version3;
  exports.default = _default3;
});
