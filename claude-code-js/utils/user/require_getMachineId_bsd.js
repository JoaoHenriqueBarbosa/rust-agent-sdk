// var: require_getMachineId_bsd
var require_getMachineId_bsd = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getMachineId = void 0;
  var fs_1 = __require("fs"), execAsync_1 = require_execAsync(), api_1 = require_src7();
  async function getMachineId() {
    try {
      return (await fs_1.promises.readFile("/etc/hostid", { encoding: "utf8" })).trim();
    } catch (e) {
      api_1.diag.debug(`error reading machine id: ${e}`);
    }
    try {
      return (await (0, execAsync_1.execAsync)("kenv -q smbios.system.uuid")).stdout.trim();
    } catch (e) {
      api_1.diag.debug(`error reading machine id: ${e}`);
    }
    return;
  }
  exports.getMachineId = getMachineId;
});
