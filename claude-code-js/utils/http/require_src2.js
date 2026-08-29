// var: require_src2
var require_src2 = __commonJS((exports) => {
  var __createBinding2 = exports && exports.__createBinding || (Object.create ? function(o5, m4, k3, k22) {
    if (k22 === void 0)
      k22 = k3;
    var desc = Object.getOwnPropertyDescriptor(m4, k3);
    if (!desc || ("get" in desc ? !m4.__esModule : desc.writable || desc.configurable))
      desc = { enumerable: !0, get: function() {
        return m4[k3];
      } };
    Object.defineProperty(o5, k22, desc);
  } : function(o5, m4, k3, k22) {
    if (k22 === void 0)
      k22 = k3;
    o5[k22] = m4[k3];
  }), __exportStar2 = exports && exports.__exportStar || function(m4, exports2) {
    for (var p4 in m4)
      if (p4 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p4))
        __createBinding2(exports2, m4, p4);
  };
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.instance = exports.Gaxios = exports.GaxiosError = void 0;
  exports.request = request2;
  var gaxios_1 = require_gaxios();
  Object.defineProperty(exports, "Gaxios", { enumerable: !0, get: function() {
    return gaxios_1.Gaxios;
  } });
  var common_1 = require_common2();
  Object.defineProperty(exports, "GaxiosError", { enumerable: !0, get: function() {
    return common_1.GaxiosError;
  } });
  __exportStar2(require_interceptor(), exports);
  exports.instance = new gaxios_1.Gaxios;
  async function request2(opts) {
    return exports.instance.request(opts);
  }
});
