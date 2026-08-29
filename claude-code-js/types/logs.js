// Original: src/types/logs.ts
function sortLogs(logs) {
  return logs.sort((a2, b) => {
    let modifiedDiff = b.modified.getTime() - a2.modified.getTime();
    if (modifiedDiff !== 0)
      return modifiedDiff;
    return b.created.getTime() - a2.created.getTime();
  });
}

// node_modules/env-paths/index.js
import path7 from "path";
import os2 from "os";
import process12 from "process";
function envPaths(name, { suffix = "nodejs" } = {}) {
  if (typeof name !== "string")
    throw TypeError(`Expected a string, got ${typeof name}`);
  if (suffix)
    name += `-${suffix}`;
  if (process12.platform === "darwin")
    return macos(name);
  if (process12.platform === "win32")
    return windows(name);
  return linux(name);
}
var homedir3, tmpdir, env2, macos = (name) => {
  let library = path7.join(homedir3, "Library");
  return {
    data: path7.join(library, "Application Support", name),
    config: path7.join(library, "Preferences", name),
    cache: path7.join(library, "Caches", name),
    log: path7.join(library, "Logs", name),
    temp: path7.join(tmpdir, name)
  };
}, windows = (name) => {
  let appData = env2.APPDATA || path7.join(homedir3, "AppData", "Roaming"), localAppData = env2.LOCALAPPDATA || path7.join(homedir3, "AppData", "Local");
  return {
    data: path7.join(localAppData, name, "Data"),
    config: path7.join(appData, name, "Config"),
    cache: path7.join(localAppData, name, "Cache"),
    log: path7.join(localAppData, name, "Log"),
    temp: path7.join(tmpdir, name)
  };
}, linux = (name) => {
  let username = path7.basename(homedir3);
  return {
    data: path7.join(env2.XDG_DATA_HOME || path7.join(homedir3, ".local", "share"), name),
    config: path7.join(env2.XDG_CONFIG_HOME || path7.join(homedir3, ".config"), name),
    cache: path7.join(env2.XDG_CACHE_HOME || path7.join(homedir3, ".cache"), name),
    log: path7.join(env2.XDG_STATE_HOME || path7.join(homedir3, ".local", "state"), name),
    temp: path7.join(tmpdir, username, name)
  };
};
var init_env_paths = __esm(() => {
  homedir3 = os2.homedir(), tmpdir = os2.tmpdir(), { env: env2 } = process12;
});
