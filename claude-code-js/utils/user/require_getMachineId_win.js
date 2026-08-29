// var: require_getMachineId_win
var require_getMachineId_win = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getMachineId = void 0;
  var process23 = __require("process"), execAsync_1 = require_execAsync(), api_1 = require_src7();
  async function getMachineId() {
    let command12 = "%windir%\\System32\\REG.exe";
    if (process23.arch === "ia32" && "PROCESSOR_ARCHITEW6432" in process23.env)
      command12 = "%windir%\\sysnative\\cmd.exe /c " + command12;
    try {
      let parts = (await (0, execAsync_1.execAsync)(`${command12} QUERY HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid`)).stdout.split("REG_SZ");
      if (parts.length === 2)
        return parts[1].trim();
    } catch (e) {
      api_1.diag.debug(`error reading machine id: ${e}`);
    }
    return;
  }
  exports.getMachineId = getMachineId;
});
