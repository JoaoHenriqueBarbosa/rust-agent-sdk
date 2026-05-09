// var: require_getMachineId_linux
var require_getMachineId_linux = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getMachineId = void 0;
  var fs_1 = __require("fs"), api_1 = require_src7();
  async function getMachineId() {
    let paths2 = ["/etc/machine-id", "/var/lib/dbus/machine-id"];
    for (let path16 of paths2)
      try {
        return (await fs_1.promises.readFile(path16, { encoding: "utf8" })).trim();
      } catch (e) {
        api_1.diag.debug(`error reading machine id: ${e}`);
      }
    return;
  }
  exports.getMachineId = getMachineId;
});
