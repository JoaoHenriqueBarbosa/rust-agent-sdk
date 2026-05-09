// var: require_getMachineId_unsupported
var require_getMachineId_unsupported = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getMachineId = void 0;
  var api_1 = require_src7();
  async function getMachineId() {
    api_1.diag.debug("could not read machine-id: unsupported platform");
    return;
  }
  exports.getMachineId = getMachineId;
});
