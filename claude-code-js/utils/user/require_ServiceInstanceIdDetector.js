// var: require_ServiceInstanceIdDetector
var require_ServiceInstanceIdDetector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.serviceInstanceIdDetector = void 0;
  var semconv_1 = require_semconv2(), crypto_1 = __require("crypto");

  class ServiceInstanceIdDetector {
    detect(_config2) {
      return {
        attributes: {
          [semconv_1.ATTR_SERVICE_INSTANCE_ID]: (0, crypto_1.randomUUID)()
        }
      };
    }
  }
  exports.serviceInstanceIdDetector = new ServiceInstanceIdDetector;
});
