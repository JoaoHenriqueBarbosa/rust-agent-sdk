// Original: src/utils/skills/skillChangeDetector.ts
import * as platformPath2 from "path";
async function initialize4() {
  if (initialized5 || disposed3)
    return;
  if (initialized5 = !0, !dynamicSkillsCallbackRegistered)
    dynamicSkillsCallbackRegistered = !0, onDynamicSkillsLoaded(() => {
      clearCommandMemoizationCaches(), skillsChanged.emit();
    });
  let paths2 = await getWatchablePaths();
  if (paths2.length === 0)
    return;
  logForDebugging(`Watching for changes in skill/command directories: ${paths2.join(", ")}...`), watcher4 = esm_default.watch(paths2, {
    persistent: !0,
    ignoreInitial: !0,
    depth: 2,
    awaitWriteFinish: {
      stabilityThreshold: testOverrides2?.stabilityThreshold ?? FILE_STABILITY_THRESHOLD_MS3,
      pollInterval: testOverrides2?.pollInterval ?? FILE_STABILITY_POLL_INTERVAL_MS3
    },
    ignored: (path27, stats2) => {
      if (stats2 && !stats2.isFile() && !stats2.isDirectory())
        return !0;
      return path27.split(platformPath2.sep).some((dir) => dir === ".git");
    },
    ignorePermissionErrors: !0,
    usePolling: USE_POLLING,
    interval: testOverrides2?.chokidarInterval ?? POLLING_INTERVAL_MS3,
    atomic: !0
  }), watcher4.on("add", handleChange4), watcher4.on("change", handleChange4), watcher4.on("unlink", handleChange4), unregisterCleanup = registerCleanup(async () => {
    await dispose3();
  });
}
function dispose3() {
  if (disposed3 = !0, unregisterCleanup)
    unregisterCleanup(), unregisterCleanup = null;
  let closePromise = Promise.resolve();
  if (watcher4)
    closePromise = watcher4.close(), watcher4 = null;
  if (reloadTimer)
    clearTimeout(reloadTimer), reloadTimer = null;
  return pendingChangedPaths.clear(), skillsChanged.clear(), closePromise;
}
async function getWatchablePaths() {
  let fs18 = getFsImplementation(), paths2 = [], userSkillsPath = getSkillsPath("userSettings", "skills");
  if (userSkillsPath)
    try {
      await fs18.stat(userSkillsPath), paths2.push(userSkillsPath);
    } catch {}
  let userCommandsPath = getSkillsPath("userSettings", "commands");
  if (userCommandsPath)
    try {
      await fs18.stat(userCommandsPath), paths2.push(userCommandsPath);
    } catch {}
  let projectSkillsPath = getSkillsPath("projectSettings", "skills");
  if (projectSkillsPath)
    try {
      let absolutePath = platformPath2.resolve(projectSkillsPath);
      await fs18.stat(absolutePath), paths2.push(absolutePath);
    } catch {}
  let projectCommandsPath = getSkillsPath("projectSettings", "commands");
  if (projectCommandsPath)
    try {
      let absolutePath = platformPath2.resolve(projectCommandsPath);
      await fs18.stat(absolutePath), paths2.push(absolutePath);
    } catch {}
  for (let dir of getAdditionalDirectoriesForClaudeMd()) {
    let additionalSkillsPath = platformPath2.join(dir, ".claude", "skills");
    try {
      await fs18.stat(additionalSkillsPath), paths2.push(additionalSkillsPath);
    } catch {}
  }
  return paths2;
}
function handleChange4(path27) {
  logForDebugging(`Detected skill change: ${path27}`), logEvent("tengu_skill_file_changed", {
    source: "chokidar"
  }), scheduleReload(path27);
}
function scheduleReload(changedPath) {
  if (pendingChangedPaths.add(changedPath), reloadTimer)
    clearTimeout(reloadTimer);
  reloadTimer = setTimeout(async () => {
    reloadTimer = null;
    let paths2 = [...pendingChangedPaths];
    pendingChangedPaths.clear();
    let results = await executeConfigChangeHooks("skills", paths2[0]);
    if (hasBlockingResult(results)) {
      logForDebugging(`ConfigChange hook blocked skill reload (${paths2.length} paths)`);
      return;
    }
    clearSkillCaches(), clearCommandsCache(), resetSentSkillNames(), skillsChanged.emit();
  }, testOverrides2?.reloadDebounce ?? RELOAD_DEBOUNCE_MS);
}
async function resetForTesting2(overrides) {
  if (watcher4)
    await watcher4.close(), watcher4 = null;
  if (reloadTimer)
    clearTimeout(reloadTimer), reloadTimer = null;
  pendingChangedPaths.clear(), skillsChanged.clear(), initialized5 = !1, disposed3 = !1, testOverrides2 = overrides ?? null;
}
var FILE_STABILITY_THRESHOLD_MS3 = 1000, FILE_STABILITY_POLL_INTERVAL_MS3 = 500, RELOAD_DEBOUNCE_MS = 300, POLLING_INTERVAL_MS3 = 2000, USE_POLLING, watcher4 = null, reloadTimer = null, pendingChangedPaths, initialized5 = !1, disposed3 = !1, dynamicSkillsCallbackRegistered = !1, unregisterCleanup = null, skillsChanged, testOverrides2 = null, subscribe3, skillChangeDetector;
var init_skillChangeDetector = __esm(() => {
  init_esm10();
  init_state();
  init_commands5();
  init_loadSkillsDir();
  init_attachments2();
  init_cleanupRegistry();
  init_debug();
  init_fsOperations();
  init_hooks5();
  USE_POLLING = typeof Bun < "u", pendingChangedPaths = /* @__PURE__ */ new Set, skillsChanged = createSignal();
  subscribe3 = skillsChanged.subscribe;
  skillChangeDetector = {
    initialize: initialize4,
    dispose: dispose3,
    subscribe: subscribe3,
    resetForTesting: resetForTesting2
  };
});
