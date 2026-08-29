// var: require_diag_api
var require_diag_api = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.diag = void 0;
  var diag_1 = require_diag();
  exports.diag = diag_1.DiagAPI.instance();
});
