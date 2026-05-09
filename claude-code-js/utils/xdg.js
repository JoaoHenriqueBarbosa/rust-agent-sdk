// Original: src/utils/xdg.ts
import { homedir as osHomedir2 } from "os";
import { join as join66 } from "path";
function resolveOptions(options2) {
  return {
    env: options2?.env ?? process.env,
    home: options2?.homedir ?? process.env.HOME ?? osHomedir2()
  };
}
function getXDGStateHome(options2) {
  let { env: env5, home } = resolveOptions(options2);
  return env5.XDG_STATE_HOME ?? join66(home, ".local", "state");
}
function getXDGCacheHome(options2) {
  let { env: env5, home } = resolveOptions(options2);
  return env5.XDG_CACHE_HOME ?? join66(home, ".cache");
}
function getXDGDataHome(options2) {
  let { env: env5, home } = resolveOptions(options2);
  return env5.XDG_DATA_HOME ?? join66(home, ".local", "share");
}
function getUserBinDir(options2) {
  let { home } = resolveOptions(options2);
  return join66(home, ".local", "bin");
}
var init_xdg = () => {};
