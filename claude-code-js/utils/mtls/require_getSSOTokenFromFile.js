// var: require_getSSOTokenFromFile
var require_getSSOTokenFromFile = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getSSOTokenFromFile = exports.tokenIntercept = void 0;
  var promises_1 = __require("fs/promises"), getSSOTokenFilepath_1 = require_getSSOTokenFilepath();
  exports.tokenIntercept = {};
  var getSSOTokenFromFile = async (id) => {
    if (exports.tokenIntercept[id])
      return exports.tokenIntercept[id];
    let ssoTokenFilepath = (0, getSSOTokenFilepath_1.getSSOTokenFilepath)(id), ssoTokenText = await (0, promises_1.readFile)(ssoTokenFilepath, "utf8");
    return JSON.parse(ssoTokenText);
  };
  exports.getSSOTokenFromFile = getSSOTokenFromFile;
});
