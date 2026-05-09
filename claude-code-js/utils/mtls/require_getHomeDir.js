// var: require_getHomeDir
var require_getHomeDir = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.getHomeDir = void 0;
  var os_1 = __require("os"), path_1 = __require("path"), homeDirCache = {}, getHomeDirCacheKey = () => {
    if (process && process.geteuid)
      return `${process.geteuid()}`;
    return "DEFAULT";
  }, getHomeDir = () => {
    let { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${path_1.sep}` } = process.env;
    if (HOME)
      return HOME;
    if (USERPROFILE)
      return USERPROFILE;
    if (HOMEPATH)
      return `${HOMEDRIVE}${HOMEPATH}`;
    let homeDirCacheKey = getHomeDirCacheKey();
    if (!homeDirCache[homeDirCacheKey])
      homeDirCache[homeDirCacheKey] = (0, os_1.homedir)();
    return homeDirCache[homeDirCacheKey];
  };
  exports.getHomeDir = getHomeDir;
});
