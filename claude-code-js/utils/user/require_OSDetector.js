// var: require_OSDetector
var require_OSDetector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.osDetector = void 0;
  var semconv_1 = require_semconv2(), os_1 = __require("os"), utils_1 = require_utils10();

  class OSDetector {
    detect(_config2) {
      return { attributes: {
        [semconv_1.ATTR_OS_TYPE]: (0, utils_1.normalizeType)((0, os_1.platform)()),
        [semconv_1.ATTR_OS_VERSION]: (0, os_1.release)()
      } };
    }
  }
  exports.osDetector = new OSDetector;
});
