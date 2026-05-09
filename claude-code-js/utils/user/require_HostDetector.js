// var: require_HostDetector
var require_HostDetector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.hostDetector = void 0;
  var semconv_1 = require_semconv2(), os_1 = __require("os"), getMachineId_1 = require_getMachineId(), utils_1 = require_utils10();

  class HostDetector {
    detect(_config2) {
      return { attributes: {
        [semconv_1.ATTR_HOST_NAME]: (0, os_1.hostname)(),
        [semconv_1.ATTR_HOST_ARCH]: (0, utils_1.normalizeArch)((0, os_1.arch)()),
        [semconv_1.ATTR_HOST_ID]: (0, getMachineId_1.getMachineId)()
      } };
    }
  }
  exports.hostDetector = new HostDetector;
});
