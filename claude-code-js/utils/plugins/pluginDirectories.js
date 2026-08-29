// Original: src/utils/plugins/pluginDirectories.ts
import { mkdirSync as mkdirSync3 } from "fs";
import { readdir as readdir7, rm, stat as stat12 } from "fs/promises";
import { delimiter, join as join34 } from "path";
function getPluginsDirectoryName() {
  if (getUseCoworkPlugins())
    return COWORK_PLUGINS_DIR;
  if (isEnvTruthy(process.env.CLAUDE_CODE_USE_COWORK_PLUGINS))
    return COWORK_PLUGINS_DIR;
  return PLUGINS_DIR;
}
function getPluginsDirectory() {
  let envOverride = process.env.CLAUDE_CODE_PLUGIN_CACHE_DIR;
  if (envOverride)
    return expandTilde(envOverride);
  return join34(getClaudeConfigHomeDir(), getPluginsDirectoryName());
}
function getPluginSeedDirs() {
  let raw = process.env.CLAUDE_CODE_PLUGIN_SEED_DIR;
  if (!raw)
    return [];
  return raw.split(delimiter).filter(Boolean).map(expandTilde);
}
function sanitizePluginId(pluginId) {
  return pluginId.replace(/[^a-zA-Z0-9\-_]/g, "-");
}
function pluginDataDirPath(pluginId) {
  return join34(getPluginsDirectory(), "data", sanitizePluginId(pluginId));
}
function getPluginDataDir(pluginId) {
  let dir = pluginDataDirPath(pluginId);
  return mkdirSync3(dir, { recursive: !0 }), dir;
}
async function getPluginDataDirSize(pluginId) {
  let dir = pluginDataDirPath(pluginId), bytes = 0, walk = async (p4) => {
    for (let entry of await readdir7(p4, { withFileTypes: !0 })) {
      let full = join34(p4, entry.name);
      if (entry.isDirectory())
        await walk(full);
      else
        try {
          bytes += (await stat12(full)).size;
        } catch {}
    }
  };
  try {
    await walk(dir);
  } catch (e) {
    if (isFsInaccessible(e))
      return null;
    throw e;
  }
  if (bytes === 0)
    return null;
  return { bytes, human: formatFileSize(bytes) };
}
async function deletePluginDataDir(pluginId) {
  let dir = pluginDataDirPath(pluginId);
  try {
    await rm(dir, { recursive: !0, force: !0 });
  } catch (e) {
    logForDebugging(`Failed to delete plugin data dir ${dir}: ${errorMessage(e)}`, { level: "warn" });
  }
}
var PLUGINS_DIR = "plugins", COWORK_PLUGINS_DIR = "cowork_plugins";
var init_pluginDirectories = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_errors();
  init_format();
  init_pathValidation();
});
