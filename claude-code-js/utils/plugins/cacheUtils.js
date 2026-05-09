// Original: src/utils/plugins/cacheUtils.ts
import { readdir as readdir17, rm as rm8, stat as stat31, unlink as unlink12, writeFile as writeFile25 } from "fs/promises";
import { join as join95 } from "path";
function clearAllPluginCaches() {
  clearPluginCache(), clearPluginCommandCache(), clearPluginAgentCache(), clearPluginHookCache(), pruneRemovedPluginHooks().catch((e) => logError2(e)), clearPluginOptionsCache(), clearPluginOutputStyleCache(), clearAllOutputStylesCache();
}
function clearAllCaches() {
  clearAllPluginCaches(), clearCommandsCache(), clearAgentDefinitionsCache(), clearPromptCache(), resetSentSkillNames();
}
async function markPluginVersionOrphaned(versionPath) {
  try {
    await writeFile25(getOrphanedAtPath(versionPath), `${Date.now()}`, "utf-8");
  } catch (error44) {
    logForDebugging(`Failed to write .orphaned_at: ${versionPath}: ${error44}`);
  }
}
async function cleanupOrphanedPluginVersionsInBackground() {
  if (isPluginZipCacheEnabled())
    return;
  try {
    let installedVersions = getInstalledVersionPaths();
    if (!installedVersions)
      return;
    let cachePath = getPluginCachePath(), now2 = Date.now();
    await Promise.all([...installedVersions].map((p4) => removeOrphanedAtMarker(p4)));
    for (let marketplace of await readSubdirs(cachePath)) {
      let marketplacePath = join95(cachePath, marketplace);
      for (let plugin of await readSubdirs(marketplacePath)) {
        let pluginPath = join95(marketplacePath, plugin);
        for (let version5 of await readSubdirs(pluginPath)) {
          let versionPath = join95(pluginPath, version5);
          if (installedVersions.has(versionPath))
            continue;
          await processOrphanedPluginVersion(versionPath, now2);
        }
        await removeIfEmpty(pluginPath);
      }
      await removeIfEmpty(marketplacePath);
    }
  } catch (error44) {
    logForDebugging(`Plugin cache cleanup failed: ${error44}`);
  }
}
function getOrphanedAtPath(versionPath) {
  return join95(versionPath, ORPHANED_AT_FILENAME2);
}
async function removeOrphanedAtMarker(versionPath) {
  let orphanedAtPath = getOrphanedAtPath(versionPath);
  try {
    await unlink12(orphanedAtPath);
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT")
      return;
    logForDebugging(`Failed to remove .orphaned_at: ${versionPath}: ${error44}`);
  }
}
function getInstalledVersionPaths() {
  try {
    let paths2 = /* @__PURE__ */ new Set, diskData = loadInstalledPluginsFromDisk();
    for (let installations of Object.values(diskData.plugins))
      for (let entry of installations)
        paths2.add(entry.installPath);
    return paths2;
  } catch (error44) {
    return logForDebugging(`Failed to load installed plugins: ${error44}`), null;
  }
}
async function processOrphanedPluginVersion(versionPath, now2) {
  let orphanedAtPath = getOrphanedAtPath(versionPath), orphanedAt;
  try {
    orphanedAt = (await stat31(orphanedAtPath)).mtimeMs;
  } catch (error44) {
    if (getErrnoCode(error44) === "ENOENT") {
      await markPluginVersionOrphaned(versionPath);
      return;
    }
    logForDebugging(`Failed to stat orphaned marker: ${versionPath}: ${error44}`);
    return;
  }
  if (now2 - orphanedAt > CLEANUP_AGE_MS)
    try {
      await rm8(versionPath, { recursive: !0, force: !0 });
    } catch (error44) {
      logForDebugging(`Failed to delete orphaned version: ${versionPath}: ${error44}`);
    }
}
async function removeIfEmpty(dirPath) {
  if ((await readSubdirs(dirPath)).length === 0)
    try {
      await rm8(dirPath, { recursive: !0, force: !0 });
    } catch (error44) {
      logForDebugging(`Failed to remove empty dir: ${dirPath}: ${error44}`);
    }
}
async function readSubdirs(dirPath) {
  try {
    return (await readdir17(dirPath, { withFileTypes: !0 })).filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return [];
  }
}
var ORPHANED_AT_FILENAME2 = ".orphaned_at", CLEANUP_AGE_MS = 604800000;
var init_cacheUtils = __esm(() => {
  init_commands5();
  init_outputStyles();
  init_loadAgentsDir();
  init_prompt7();
  init_attachments2();
  init_debug();
  init_errors();
  init_log3();
  init_installedPluginsManager();
  init_loadPluginAgents();
  init_loadPluginCommands();
  init_loadPluginHooks();
  init_loadPluginOutputStyles();
  init_pluginLoader();
  init_pluginOptionsStorage();
  init_zipCache();
});
