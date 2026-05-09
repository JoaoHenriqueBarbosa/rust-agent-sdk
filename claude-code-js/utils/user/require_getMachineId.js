// var: require_getMachineId
var require_getMachineId = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getMachineId = void 0;
  var process23 = __require("process"), getMachineIdImpl;
  async function getMachineId() {
    if (!getMachineIdImpl)
      switch (process23.platform) {
        case "darwin":
          getMachineIdImpl = (await Promise.resolve().then(() => __toESM(require_getMachineId_darwin()))).getMachineId;
          break;
        case "linux":
          getMachineIdImpl = (await Promise.resolve().then(() => __toESM(require_getMachineId_linux()))).getMachineId;
          break;
        case "freebsd":
          getMachineIdImpl = (await Promise.resolve().then(() => __toESM(require_getMachineId_bsd()))).getMachineId;
          break;
        case "win32":
          getMachineIdImpl = (await Promise.resolve().then(() => __toESM(require_getMachineId_win()))).getMachineId;
          break;
        default:
          getMachineIdImpl = (await Promise.resolve().then(() => __toESM(require_getMachineId_unsupported()))).getMachineId;
          break;
      }
    return getMachineIdImpl();
  }
  exports.getMachineId = getMachineId;
});
