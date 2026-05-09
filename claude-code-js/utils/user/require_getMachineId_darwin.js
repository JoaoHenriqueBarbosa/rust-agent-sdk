// var: require_getMachineId_darwin
var require_getMachineId_darwin = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getMachineId = void 0;
  var execAsync_1 = require_execAsync(), api_1 = require_src7();
  async function getMachineId() {
    try {
      let idLine = (await (0, execAsync_1.execAsync)('ioreg -rd1 -c "IOPlatformExpertDevice"')).stdout.split(`
`).find((line) => line.includes("IOPlatformUUID"));
      if (!idLine)
        return;
      let parts = idLine.split('" = "');
      if (parts.length === 2)
        return parts[1].slice(0, -1);
    } catch (e) {
      api_1.diag.debug(`error reading machine id: ${e}`);
    }
    return;
  }
  exports.getMachineId = getMachineId;
});
