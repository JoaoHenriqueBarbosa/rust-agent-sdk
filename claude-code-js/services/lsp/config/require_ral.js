// var: require_ral
var require_ral = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  var _ral;
  function RAL() {
    if (_ral === void 0)
      throw Error("No runtime abstraction layer installed");
    return _ral;
  }
  (function(RAL2) {
    function install(ral) {
      if (ral === void 0)
        throw Error("No runtime abstraction layer provided");
      _ral = ral;
    }
    RAL2.install = install;
  })(RAL || (RAL = {}));
  exports.default = RAL;
});
