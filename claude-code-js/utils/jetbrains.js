// Original: src/utils/jetbrains.ts
import { homedir as homedir20, platform as platform4 } from "os";
import { join as join56 } from "path";
function buildCommonPluginDirectoryPaths(ideName) {
  let homeDir = homedir20(), directories = [], idePatterns = ideNameToDirMap[ideName.toLowerCase()];
  if (!idePatterns)
    return directories;
  let appData = process.env.APPDATA || join56(homeDir, "AppData", "Roaming"), localAppData = process.env.LOCALAPPDATA || join56(homeDir, "AppData", "Local");
  switch (platform4()) {
    case "darwin":
      if (directories.push(join56(homeDir, "Library", "Application Support", "JetBrains"), join56(homeDir, "Library", "Application Support")), ideName.toLowerCase() === "androidstudio")
        directories.push(join56(homeDir, "Library", "Application Support", "Google"));
      break;
    case "win32":
      if (directories.push(join56(appData, "JetBrains"), join56(localAppData, "JetBrains"), join56(appData)), ideName.toLowerCase() === "androidstudio")
        directories.push(join56(localAppData, "Google"));
      break;
    case "linux":
      directories.push(join56(homeDir, ".config", "JetBrains"), join56(homeDir, ".local", "share", "JetBrains"));
      for (let pattern of idePatterns)
        directories.push(join56(homeDir, "." + pattern));
      if (ideName.toLowerCase() === "androidstudio")
        directories.push(join56(homeDir, ".config", "Google"));
      break;
    default:
      break;
  }
  return directories;
}
async function detectPluginDirectories(ideName) {
  let foundDirectories = [], fs16 = getFsImplementation(), pluginDirPaths = buildCommonPluginDirectoryPaths(ideName), idePatterns = ideNameToDirMap[ideName.toLowerCase()];
  if (!idePatterns)
    return foundDirectories;
  let regexes = idePatterns.map((p4) => new RegExp("^" + p4));
  for (let baseDir of pluginDirPaths)
    try {
      let entries = await fs16.readdir(baseDir);
      for (let regex2 of regexes)
        for (let entry of entries) {
          if (!regex2.test(entry.name))
            continue;
          if (!entry.isDirectory() && !entry.isSymbolicLink())
            continue;
          let dir = join56(baseDir, entry.name);
          if (platform4() === "linux") {
            foundDirectories.push(dir);
            continue;
          }
          let pluginDir = join56(dir, "plugins");
          try {
            await fs16.stat(pluginDir), foundDirectories.push(pluginDir);
          } catch {}
        }
    } catch {
      continue;
    }
  return foundDirectories.filter((dir, index) => foundDirectories.indexOf(dir) === index);
}
async function isJetBrainsPluginInstalled(ideType) {
  let pluginDirs = await detectPluginDirectories(ideType);
  for (let dir of pluginDirs) {
    let pluginPath = join56(dir, PLUGIN_PREFIX);
    try {
      return await getFsImplementation().stat(pluginPath), !0;
    } catch {}
  }
  return !1;
}
async function isJetBrainsPluginInstalledMemoized(ideType, forceRefresh = !1) {
  if (!forceRefresh) {
    let existing = pluginInstalledPromiseCache.get(ideType);
    if (existing)
      return existing;
  }
  let promise3 = isJetBrainsPluginInstalled(ideType).then((result) => {
    return pluginInstalledCache.set(ideType, result), result;
  });
  return pluginInstalledPromiseCache.set(ideType, promise3), promise3;
}
async function isJetBrainsPluginInstalledCached(ideType, forceRefresh = !1) {
  if (forceRefresh)
    pluginInstalledCache.delete(ideType), pluginInstalledPromiseCache.delete(ideType);
  return isJetBrainsPluginInstalledMemoized(ideType, forceRefresh);
}
function isJetBrainsPluginInstalledCachedSync(ideType) {
  return pluginInstalledCache.get(ideType) ?? !1;
}
var PLUGIN_PREFIX = "claude-code-jetbrains-plugin", ideNameToDirMap, pluginInstalledCache, pluginInstalledPromiseCache;
var init_jetbrains = __esm(() => {
  init_fsOperations();
  ideNameToDirMap = {
    pycharm: ["PyCharm"],
    intellij: ["IntelliJIdea", "IdeaIC"],
    webstorm: ["WebStorm"],
    phpstorm: ["PhpStorm"],
    rubymine: ["RubyMine"],
    clion: ["CLion"],
    goland: ["GoLand"],
    rider: ["Rider"],
    datagrip: ["DataGrip"],
    appcode: ["AppCode"],
    dataspell: ["DataSpell"],
    aqua: ["Aqua"],
    gateway: ["Gateway"],
    fleet: ["Fleet"],
    androidstudio: ["AndroidStudio"]
  };
  pluginInstalledCache = /* @__PURE__ */ new Map, pluginInstalledPromiseCache = /* @__PURE__ */ new Map;
});
