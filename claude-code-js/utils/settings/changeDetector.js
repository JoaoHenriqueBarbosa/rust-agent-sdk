// Original: src/utils/settings/changeDetector.ts
import { stat as stat10 } from "fs/promises";
import * as platformPath from "path";
async function initialize() {
  if (getIsRemoteMode())
    return;
  if (initialized || disposed)
    return;
  initialized = !0, startMdmPoll(), registerCleanup(dispose);
  let { dirs, settingsFiles, dropInDir } = await getWatchTargets();
  if (disposed)
    return;
  if (dirs.length === 0)
    return;
  logForDebugging(`Watching for changes in setting files ${[...settingsFiles].join(", ")}...${dropInDir ? ` and drop-in directory ${dropInDir}` : ""}`), watcher = esm_default.watch(dirs, {
    persistent: !0,
    ignoreInitial: !0,
    depth: 0,
    awaitWriteFinish: {
      stabilityThreshold: testOverrides?.stabilityThreshold ?? FILE_STABILITY_THRESHOLD_MS,
      pollInterval: testOverrides?.pollInterval ?? FILE_STABILITY_POLL_INTERVAL_MS
    },
    ignored: (path12, stats) => {
      if (stats && !stats.isFile() && !stats.isDirectory())
        return !0;
      if (path12.split(platformPath.sep).some((dir) => dir === ".git"))
        return !0;
      if (!stats || stats.isDirectory())
        return !1;
      let normalized = platformPath.normalize(path12);
      if (settingsFiles.has(normalized))
        return !1;
      if (dropInDir && normalized.startsWith(dropInDir + platformPath.sep) && normalized.endsWith(".json"))
        return !1;
      return !0;
    },
    ignorePermissionErrors: !0,
    usePolling: !1,
    atomic: !0
  }), watcher.on("change", handleChange), watcher.on("unlink", handleDelete), watcher.on("add", handleAdd);
}
function dispose() {
  if (disposed = !0, mdmPollTimer)
    clearInterval(mdmPollTimer), mdmPollTimer = null;
  for (let timer of pendingDeletions.values())
    clearTimeout(timer);
  pendingDeletions.clear(), lastMdmSnapshot = null, clearInternalWrites(), settingsChanged.clear();
  let w2 = watcher;
  return watcher = null, w2 ? w2.close() : Promise.resolve();
}
async function getWatchTargets() {
  let dirToSettingsFiles = /* @__PURE__ */ new Map, dirsWithExistingFiles = /* @__PURE__ */ new Set;
  for (let source of SETTING_SOURCES) {
    if (source === "flagSettings")
      continue;
    let path12 = getSettingsFilePathForSource(source);
    if (!path12)
      continue;
    let dir = platformPath.dirname(path12);
    if (!dirToSettingsFiles.has(dir))
      dirToSettingsFiles.set(dir, /* @__PURE__ */ new Set);
    dirToSettingsFiles.get(dir).add(path12);
    try {
      if ((await stat10(path12)).isFile())
        dirsWithExistingFiles.add(dir);
    } catch {}
  }
  let settingsFiles = /* @__PURE__ */ new Set;
  for (let dir of dirsWithExistingFiles) {
    let filesInDir = dirToSettingsFiles.get(dir);
    if (filesInDir)
      for (let file2 of filesInDir)
        settingsFiles.add(file2);
  }
  let dropInDir = null, managedDropIn = getManagedSettingsDropInDir();
  try {
    if ((await stat10(managedDropIn)).isDirectory())
      dirsWithExistingFiles.add(managedDropIn), dropInDir = managedDropIn;
  } catch {}
  return { dirs: [...dirsWithExistingFiles], settingsFiles, dropInDir };
}
function settingSourceToConfigChangeSource(source) {
  switch (source) {
    case "userSettings":
      return "user_settings";
    case "projectSettings":
      return "project_settings";
    case "localSettings":
      return "local_settings";
    case "flagSettings":
    case "policySettings":
      return "policy_settings";
  }
}
function handleChange(path12) {
  let source = getSourceForPath(path12);
  if (!source)
    return;
  let pendingTimer = pendingDeletions.get(path12);
  if (pendingTimer)
    clearTimeout(pendingTimer), pendingDeletions.delete(path12), logForDebugging(`Cancelled pending deletion of ${path12} \u2014 file was recreated`);
  if (consumeInternalWrite(path12, INTERNAL_WRITE_WINDOW_MS))
    return;
  logForDebugging(`Detected change to ${path12}`), executeConfigChangeHooks(settingSourceToConfigChangeSource(source), path12).then((results) => {
    if (hasBlockingResult(results)) {
      logForDebugging(`ConfigChange hook blocked change to ${path12}`);
      return;
    }
    fanOut(source);
  });
}
function handleAdd(path12) {
  if (!getSourceForPath(path12))
    return;
  let pendingTimer = pendingDeletions.get(path12);
  if (pendingTimer)
    clearTimeout(pendingTimer), pendingDeletions.delete(path12), logForDebugging(`Cancelled pending deletion of ${path12} \u2014 file was re-added`);
  handleChange(path12);
}
function handleDelete(path12) {
  let source = getSourceForPath(path12);
  if (!source)
    return;
  if (logForDebugging(`Detected deletion of ${path12}`), pendingDeletions.has(path12))
    return;
  let timer = setTimeout((p4, src) => {
    pendingDeletions.delete(p4), executeConfigChangeHooks(settingSourceToConfigChangeSource(src), p4).then((results) => {
      if (hasBlockingResult(results)) {
        logForDebugging(`ConfigChange hook blocked deletion of ${p4}`);
        return;
      }
      fanOut(src);
    });
  }, testOverrides?.deletionGrace ?? DELETION_GRACE_MS, path12, source);
  pendingDeletions.set(path12, timer);
}
function getSourceForPath(path12) {
  let normalizedPath = platformPath.normalize(path12), dropInDir = getManagedSettingsDropInDir();
  if (normalizedPath.startsWith(dropInDir + platformPath.sep))
    return "policySettings";
  return SETTING_SOURCES.find((source) => getSettingsFilePathForSource(source) === normalizedPath);
}
function startMdmPoll() {
  let initial = getMdmSettings(), initialHkcu = getHkcuSettings();
  lastMdmSnapshot = jsonStringify({
    mdm: initial.settings,
    hkcu: initialHkcu.settings
  }), mdmPollTimer = setInterval(() => {
    if (disposed)
      return;
    (async () => {
      try {
        let { mdm: current, hkcu: currentHkcu } = await refreshMdmSettings();
        if (disposed)
          return;
        let currentSnapshot = jsonStringify({
          mdm: current.settings,
          hkcu: currentHkcu.settings
        });
        if (currentSnapshot !== lastMdmSnapshot)
          lastMdmSnapshot = currentSnapshot, setMdmSettingsCache(current, currentHkcu), logForDebugging("Detected MDM settings change via poll"), fanOut("policySettings");
      } catch (error44) {
        logForDebugging(`MDM poll error: ${errorMessage(error44)}`);
      }
    })();
  }, testOverrides?.mdmPollInterval ?? MDM_POLL_INTERVAL_MS), mdmPollTimer.unref();
}
function fanOut(source) {
  resetSettingsCache(), settingsChanged.emit(source);
}
function notifyChange(source) {
  logForDebugging(`Programmatic settings change notification for ${source}`), fanOut(source);
}
function resetForTesting(overrides) {
  if (mdmPollTimer)
    clearInterval(mdmPollTimer), mdmPollTimer = null;
  for (let timer of pendingDeletions.values())
    clearTimeout(timer);
  pendingDeletions.clear(), lastMdmSnapshot = null, initialized = !1, disposed = !1, testOverrides = overrides ?? null;
  let w2 = watcher;
  return watcher = null, w2 ? w2.close() : Promise.resolve();
}
var FILE_STABILITY_THRESHOLD_MS = 1000, FILE_STABILITY_POLL_INTERVAL_MS = 500, INTERNAL_WRITE_WINDOW_MS = 5000, MDM_POLL_INTERVAL_MS = 1800000, DELETION_GRACE_MS, watcher = null, mdmPollTimer = null, lastMdmSnapshot = null, initialized = !1, disposed = !1, pendingDeletions, settingsChanged, testOverrides = null, subscribe, settingsChangeDetector;
var init_changeDetector = __esm(() => {
  init_esm10();
  init_state();
  init_cleanupRegistry();
  init_debug();
  init_errors();
  init_hooks5();
  init_slowOperations();
  init_constants2();
  init_internalWrites();
  init_managedPath();
  init_settings();
  init_settings2();
  init_settingsCache();
  DELETION_GRACE_MS = FILE_STABILITY_THRESHOLD_MS + FILE_STABILITY_POLL_INTERVAL_MS + 200, pendingDeletions = /* @__PURE__ */ new Map, settingsChanged = createSignal();
  subscribe = settingsChanged.subscribe;
  settingsChangeDetector = {
    initialize,
    dispose,
    subscribe,
    notifyChange,
    resetForTesting
  };
});
