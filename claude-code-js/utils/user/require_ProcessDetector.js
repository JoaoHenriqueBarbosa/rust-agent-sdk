// var: require_ProcessDetector
var require_ProcessDetector = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.processDetector = void 0;
  var api_1 = require_src7(), semconv_1 = require_semconv2(), os6 = __require("os");

  class ProcessDetector {
    detect(_config2) {
      let attributes = {
        [semconv_1.ATTR_PROCESS_PID]: process.pid,
        [semconv_1.ATTR_PROCESS_EXECUTABLE_NAME]: process.title,
        [semconv_1.ATTR_PROCESS_EXECUTABLE_PATH]: process.execPath,
        [semconv_1.ATTR_PROCESS_COMMAND_ARGS]: [
          process.argv[0],
          ...process.execArgv,
          ...process.argv.slice(1)
        ],
        [semconv_1.ATTR_PROCESS_RUNTIME_VERSION]: process.versions.node,
        [semconv_1.ATTR_PROCESS_RUNTIME_NAME]: "nodejs",
        [semconv_1.ATTR_PROCESS_RUNTIME_DESCRIPTION]: "Node.js"
      };
      if (process.argv.length > 1)
        attributes[semconv_1.ATTR_PROCESS_COMMAND] = process.argv[1];
      try {
        let userInfo4 = os6.userInfo();
        attributes[semconv_1.ATTR_PROCESS_OWNER] = userInfo4.username;
      } catch (e) {
        api_1.diag.debug(`error obtaining process owner: ${e}`);
      }
      return { attributes };
    }
  }
  exports.processDetector = new ProcessDetector;
});
