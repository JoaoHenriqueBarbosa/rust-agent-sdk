// Original: src/utils/hooks/fileChangedWatcher.ts
import { isAbsolute as isAbsolute15, join as join76 } from "path";
function setEnvHookNotifier(cb) {
  notifyCallback = cb;
}
function initializeFileChangedWatcher(cwd2) {
  if (initialized3)
    return;
  initialized3 = !0, currentCwd = cwd2;
  let config10 = getHooksConfigFromSnapshot();
  if (hasEnvHooks = (config10?.CwdChanged?.length ?? 0) > 0 || (config10?.FileChanged?.length ?? 0) > 0, hasEnvHooks)
    registerCleanup(async () => dispose2());
  let paths2 = resolveWatchPaths(config10);
  if (paths2.length === 0)
    return;
  startWatching(paths2);
}
function resolveWatchPaths(config10) {
  let matchers = (config10 ?? getHooksConfigFromSnapshot())?.FileChanged ?? [], staticPaths = [];
  for (let m4 of matchers) {
    if (!m4.matcher)
      continue;
    for (let name3 of m4.matcher.split("|").map((s2) => s2.trim())) {
      if (!name3)
        continue;
      staticPaths.push(isAbsolute15(name3) ? name3 : join76(currentCwd, name3));
    }
  }
  return [.../* @__PURE__ */ new Set([...staticPaths, ...dynamicWatchPaths])];
}
function startWatching(paths2) {
  logForDebugging(`FileChanged: watching ${paths2.length} paths`), watcher3 = esm_default.watch(paths2, {
    persistent: !0,
    ignoreInitial: !0,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 200 },
    ignorePermissionErrors: !0
  }), watcher3.on("change", (p4) => handleFileEvent(p4, "change")), watcher3.on("add", (p4) => handleFileEvent(p4, "add")), watcher3.on("unlink", (p4) => handleFileEvent(p4, "unlink"));
}
function handleFileEvent(path16, event) {
  logForDebugging(`FileChanged: ${event} ${path16}`), executeFileChangedHooks(path16, event).then(({ results, watchPaths, systemMessages }) => {
    if (watchPaths.length > 0)
      updateWatchPaths(watchPaths);
    for (let msg of systemMessages)
      notifyCallback?.(msg, !1);
    for (let r4 of results)
      if (!r4.succeeded && r4.output)
        notifyCallback?.(r4.output, !0);
  }).catch((e) => {
    let msg = errorMessage(e);
    logForDebugging(`FileChanged hook failed: ${msg}`, {
      level: "error"
    }), notifyCallback?.(msg, !0);
  });
}
function updateWatchPaths(paths2) {
  if (!initialized3)
    return;
  let sorted = paths2.slice().sort();
  if (sorted.length === dynamicWatchPathsSorted.length && sorted.every((p4, i5) => p4 === dynamicWatchPathsSorted[i5]))
    return;
  dynamicWatchPaths = paths2, dynamicWatchPathsSorted = sorted, restartWatching();
}
function restartWatching() {
  if (watcher3)
    watcher3.close(), watcher3 = null;
  let paths2 = resolveWatchPaths();
  if (paths2.length > 0)
    startWatching(paths2);
}
async function onCwdChangedForHooks(oldCwd, newCwd) {
  if (oldCwd === newCwd)
    return;
  let config10 = getHooksConfigFromSnapshot();
  if (!((config10?.CwdChanged?.length ?? 0) > 0 || (config10?.FileChanged?.length ?? 0) > 0))
    return;
  currentCwd = newCwd, await clearCwdEnvFiles();
  let hookResult = await executeCwdChangedHooks(oldCwd, newCwd).catch((e) => {
    let msg = errorMessage(e);
    return logForDebugging(`CwdChanged hook failed: ${msg}`, {
      level: "error"
    }), notifyCallback?.(msg, !0), {
      results: [],
      watchPaths: [],
      systemMessages: []
    };
  });
  dynamicWatchPaths = hookResult.watchPaths, dynamicWatchPathsSorted = hookResult.watchPaths.slice().sort();
  for (let msg of hookResult.systemMessages)
    notifyCallback?.(msg, !1);
  for (let r4 of hookResult.results)
    if (!r4.succeeded && r4.output)
      notifyCallback?.(r4.output, !0);
  if (initialized3)
    restartWatching();
}
function dispose2() {
  if (watcher3)
    watcher3.close(), watcher3 = null;
  dynamicWatchPaths = [], dynamicWatchPathsSorted = [], initialized3 = !1, hasEnvHooks = !1, notifyCallback = null;
}
var watcher3 = null, currentCwd, dynamicWatchPaths, dynamicWatchPathsSorted, initialized3 = !1, hasEnvHooks = !1, notifyCallback = null;
var init_fileChangedWatcher = __esm(() => {
  init_esm10();
  init_cleanupRegistry();
  init_debug();
  init_errors();
  init_hooks5();
  init_sessionEnvironment();
  init_hooksConfigSnapshot();
  dynamicWatchPaths = [], dynamicWatchPathsSorted = [];
});
