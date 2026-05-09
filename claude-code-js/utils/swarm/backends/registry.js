// Original: src/utils/swarm/backends/registry.ts
var exports_registry = {};
__export(exports_registry, {
  resetBackendDetection: () => resetBackendDetection,
  registerTmuxBackend: () => registerTmuxBackend,
  registerITermBackend: () => registerITermBackend,
  markInProcessFallback: () => markInProcessFallback,
  isInProcessEnabled: () => isInProcessEnabled,
  getTeammateExecutor: () => getTeammateExecutor,
  getResolvedTeammateMode: () => getResolvedTeammateMode,
  getInProcessBackend: () => getInProcessBackend,
  getCachedDetectionResult: () => getCachedDetectionResult,
  getCachedBackend: () => getCachedBackend,
  getBackendByType: () => getBackendByType,
  ensureBackendsRegistered: () => ensureBackendsRegistered,
  detectAndGetBackend: () => detectAndGetBackend
});
async function ensureBackendsRegistered() {
  if (backendsRegistered)
    return;
  await Promise.resolve().then(() => (init_TmuxBackend(), exports_TmuxBackend)), await Promise.resolve().then(() => (init_ITermBackend(), exports_ITermBackend)), backendsRegistered = !0;
}
function registerTmuxBackend(backendClass) {
  TmuxBackendClass = backendClass;
}
function registerITermBackend(backendClass) {
  logForDebugging(`[registry] registerITermBackend called, class=${backendClass?.name || "undefined"}`), ITermBackendClass = backendClass;
}
function createTmuxBackend() {
  if (!TmuxBackendClass)
    throw Error("TmuxBackend not registered. Import TmuxBackend.ts before using the registry.");
  return new TmuxBackendClass;
}
function createITermBackend() {
  if (!ITermBackendClass)
    throw Error("ITermBackend not registered. Import ITermBackend.ts before using the registry.");
  return new ITermBackendClass;
}
async function detectAndGetBackend() {
  if (await ensureBackendsRegistered(), cachedDetectionResult)
    return logForDebugging(`[BackendRegistry] Using cached backend: ${cachedDetectionResult.backend.type}`), cachedDetectionResult;
  logForDebugging("[BackendRegistry] Starting backend detection...");
  let insideTmux = await isInsideTmux(), inITerm2 = isInITerm2();
  if (logForDebugging(`[BackendRegistry] Environment: insideTmux=${insideTmux}, inITerm2=${inITerm2}`), insideTmux) {
    logForDebugging("[BackendRegistry] Selected: tmux (running inside tmux session)");
    let backend = createTmuxBackend();
    return cachedBackend = backend, cachedDetectionResult = {
      backend,
      isNative: !0,
      needsIt2Setup: !1
    }, cachedDetectionResult;
  }
  if (inITerm2) {
    let preferTmux = getPreferTmuxOverIterm2();
    if (preferTmux)
      logForDebugging("[BackendRegistry] User prefers tmux over iTerm2, skipping iTerm2 detection");
    else {
      let it2Available = await isIt2CliAvailable();
      if (logForDebugging(`[BackendRegistry] iTerm2 detected, it2 CLI available: ${it2Available}`), it2Available) {
        logForDebugging("[BackendRegistry] Selected: iterm2 (native iTerm2 with it2 CLI)");
        let backend = createITermBackend();
        return cachedBackend = backend, cachedDetectionResult = {
          backend,
          isNative: !0,
          needsIt2Setup: !1
        }, cachedDetectionResult;
      }
    }
    let tmuxAvailable2 = await isTmuxAvailable();
    if (logForDebugging(`[BackendRegistry] it2 not available, tmux available: ${tmuxAvailable2}`), tmuxAvailable2) {
      logForDebugging("[BackendRegistry] Selected: tmux (fallback in iTerm2, it2 setup recommended)");
      let backend = createTmuxBackend();
      return cachedBackend = backend, cachedDetectionResult = {
        backend,
        isNative: !1,
        needsIt2Setup: !preferTmux
      }, cachedDetectionResult;
    }
    throw logForDebugging("[BackendRegistry] ERROR: iTerm2 detected but no it2 CLI and no tmux"), Error("iTerm2 detected but it2 CLI not installed. Install it2 with: pip install it2");
  }
  let tmuxAvailable = await isTmuxAvailable();
  if (logForDebugging(`[BackendRegistry] Not in tmux or iTerm2, tmux available: ${tmuxAvailable}`), tmuxAvailable) {
    logForDebugging("[BackendRegistry] Selected: tmux (external session mode)");
    let backend = createTmuxBackend();
    return cachedBackend = backend, cachedDetectionResult = {
      backend,
      isNative: !1,
      needsIt2Setup: !1
    }, cachedDetectionResult;
  }
  throw logForDebugging("[BackendRegistry] ERROR: No pane backend available"), Error(getTmuxInstallInstructions());
}
function getTmuxInstallInstructions() {
  switch (getPlatform()) {
    case "macos":
      return `To use agent swarms, install tmux:
  brew install tmux
Then start a tmux session with: tmux new-session -s claude`;
    case "linux":
    case "wsl":
      return `To use agent swarms, install tmux:
  sudo apt install tmux    # Ubuntu/Debian
  sudo dnf install tmux    # Fedora/RHEL
Then start a tmux session with: tmux new-session -s claude`;
    case "windows":
      return `To use agent swarms, you need tmux which requires WSL (Windows Subsystem for Linux).
Install WSL first, then inside WSL run:
  sudo apt install tmux
Then start a tmux session with: tmux new-session -s claude`;
    default:
      return `To use agent swarms, install tmux using your system's package manager.
Then start a tmux session with: tmux new-session -s claude`;
  }
}
function getBackendByType(type) {
  switch (type) {
    case "tmux":
      return createTmuxBackend();
    case "iterm2":
      return createITermBackend();
  }
}
function getCachedBackend() {
  return cachedBackend;
}
function getCachedDetectionResult() {
  return cachedDetectionResult;
}
function markInProcessFallback() {
  logForDebugging("[BackendRegistry] Marking in-process fallback as active"), inProcessFallbackActive = !0;
}
function getTeammateMode() {
  return getTeammateModeFromSnapshot();
}
function isInProcessEnabled() {
  if (getIsNonInteractiveSession())
    return logForDebugging("[BackendRegistry] isInProcessEnabled: true (non-interactive session)"), !0;
  let mode = getTeammateMode(), enabled2;
  if (mode === "in-process")
    enabled2 = !0;
  else if (mode === "tmux")
    enabled2 = !1;
  else {
    if (inProcessFallbackActive)
      return logForDebugging("[BackendRegistry] isInProcessEnabled: true (fallback after pane backend unavailable)"), !0;
    let insideTmux = isInsideTmuxSync(), inITerm2 = isInITerm2();
    enabled2 = !insideTmux && !inITerm2;
  }
  return logForDebugging(`[BackendRegistry] isInProcessEnabled: ${enabled2} (mode=${mode}, insideTmux=${isInsideTmuxSync()}, inITerm2=${isInITerm2()})`), enabled2;
}
function getResolvedTeammateMode() {
  return isInProcessEnabled() ? "in-process" : "tmux";
}
function getInProcessBackend() {
  if (!cachedInProcessBackend)
    cachedInProcessBackend = createInProcessBackend();
  return cachedInProcessBackend;
}
async function getTeammateExecutor(preferInProcess = !1) {
  if (preferInProcess && isInProcessEnabled())
    return logForDebugging("[BackendRegistry] Using in-process executor"), getInProcessBackend();
  return logForDebugging("[BackendRegistry] Using pane backend executor"), getPaneBackendExecutor();
}
async function getPaneBackendExecutor() {
  if (!cachedPaneBackendExecutor) {
    let detection = await detectAndGetBackend();
    cachedPaneBackendExecutor = createPaneBackendExecutor(detection.backend), logForDebugging(`[BackendRegistry] Created PaneBackendExecutor wrapping ${detection.backend.type}`);
  }
  return cachedPaneBackendExecutor;
}
function resetBackendDetection() {
  cachedBackend = null, cachedDetectionResult = null, cachedInProcessBackend = null, cachedPaneBackendExecutor = null, backendsRegistered = !1, inProcessFallbackActive = !1;
}
var cachedBackend = null, cachedDetectionResult = null, backendsRegistered = !1, cachedInProcessBackend = null, cachedPaneBackendExecutor = null, inProcessFallbackActive = !1, TmuxBackendClass = null, ITermBackendClass = null;
var init_registry = __esm(() => {
  init_state();
  init_debug();
  init_platform();
  init_detection();
  init_InProcessBackend();
  init_it2Setup();
  init_PaneBackendExecutor();
  init_teammateModeSnapshot();
});
