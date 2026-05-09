// var: require_getSSOTokenFilepath
var require_getSSOTokenFilepath = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getSSOTokenFilepath = void 0;
  var crypto_1 = __require("crypto"), path_1 = __require("path"), getHomeDir_1 = require_getHomeDir(), getSSOTokenFilepath = (id) => {
    let cacheName = (0, crypto_1.createHash)("sha1").update(id).digest("hex");
    return (0, path_1.join)((0, getHomeDir_1.getHomeDir)(), ".aws", "sso", "cache", `${cacheName}.json`);
  };
  exports.getSSOTokenFilepath = getSSOTokenFilepath;
});
