// Original: src/utils/plugins/loadPluginHooks.ts
var exports_loadPluginHooks = {};
__export(exports_loadPluginHooks, {
  setupPluginHookHotReload: () => setupPluginHookHotReload,
  resetHotReloadState: () => resetHotReloadState,
  pruneRemovedPluginHooks: () => pruneRemovedPluginHooks,
  loadPluginHooks: () => loadPluginHooks,
  getPluginAffectingSettingsSnapshot: () => getPluginAffectingSettingsSnapshot,
  clearPluginHookCache: () => clearPluginHookCache
});
function convertPluginHooksToMatchers(plugin) {
  let pluginMatchers = {
    PreToolUse: [],
    PostToolUse: [],
    PostToolUseFailure: [],
    PermissionDenied: [],
    Notification: [],
    UserPromptSubmit: [],
    SessionStart: [],
    SessionEnd: [],
    Stop: [],
    StopFailure: [],
    SubagentStart: [],
    SubagentStop: [],
    PreCompact: [],
    PostCompact: [],
    PermissionRequest: [],
    Setup: [],
    TeammateIdle: [],
    TaskCreated: [],
    TaskCompleted: [],
    Elicitation: [],
    ElicitationResult: [],
    ConfigChange: [],
    WorktreeCreate: [],
    WorktreeRemove: [],
    InstructionsLoaded: [],
    CwdChanged: [],
    FileChanged: []
  };
  if (!plugin.hooksConfig)
    return pluginMatchers;
  for (let [event, matchers] of Object.entries(plugin.hooksConfig)) {
    let hookEvent = event;
    if (!pluginMatchers[hookEvent])
      continue;
    for (let matcher of matchers)
      if (matcher.hooks.length > 0)
        pluginMatchers[hookEvent].push({
          matcher: matcher.matcher,
          hooks: matcher.hooks,
          pluginRoot: plugin.path,
          pluginName: plugin.name,
          pluginId: plugin.source
        });
  }
  return pluginMatchers;
}
function clearPluginHookCache() {
  loadPluginHooks.cache?.clear?.();
}
async function pruneRemovedPluginHooks() {
  if (!getRegisteredHooks())
    return;
  let { enabled: enabled2 } = await loadAllPluginsCacheOnly(), enabledRoots = new Set(enabled2.map((p4) => p4.path)), current = getRegisteredHooks();
  if (!current)
    return;
  let survivors = {};
  for (let [event, matchers] of Object.entries(current)) {
    let kept = matchers.filter((m4) => ("pluginRoot" in m4) && enabledRoots.has(m4.pluginRoot));
    if (kept.length > 0)
      survivors[event] = kept;
  }
  clearRegisteredPluginHooks(), registerHookCallbacks(survivors);
}
function resetHotReloadState() {
  hotReloadSubscribed = !1, lastPluginSettingsSnapshot = void 0;
}
function getPluginAffectingSettingsSnapshot() {
  let merged = getSettings_DEPRECATED(), policy = getSettingsForSource("policySettings"), sortKeys = (o5) => o5 ? Object.fromEntries(Object.entries(o5).sort()) : {};
  return jsonStringify({
    enabledPlugins: sortKeys(merged.enabledPlugins),
    extraKnownMarketplaces: sortKeys(merged.extraKnownMarketplaces),
    strictKnownMarketplaces: policy?.strictKnownMarketplaces ?? [],
    blockedMarketplaces: policy?.blockedMarketplaces ?? []
  });
}
function setupPluginHookHotReload() {
  if (hotReloadSubscribed)
    return;
  hotReloadSubscribed = !0, lastPluginSettingsSnapshot = getPluginAffectingSettingsSnapshot(), settingsChangeDetector.subscribe((source) => {
    if (source === "policySettings") {
      let newSnapshot = getPluginAffectingSettingsSnapshot();
      if (newSnapshot === lastPluginSettingsSnapshot) {
        logForDebugging("Plugin hooks: skipping reload, plugin-affecting settings unchanged");
        return;
      }
      lastPluginSettingsSnapshot = newSnapshot, logForDebugging("Plugin hooks: reloading due to plugin-affecting settings change"), clearPluginCache("loadPluginHooks: plugin-affecting settings changed"), clearPluginHookCache(), loadPluginHooks();
    }
  });
}
var hotReloadSubscribed = !1, lastPluginSettingsSnapshot, loadPluginHooks;
var init_loadPluginHooks = __esm(() => {
  init_memoize();
  init_state();
  init_debug();
  init_changeDetector();
  init_settings2();
  init_slowOperations();
  init_pluginLoader();
  loadPluginHooks = memoize_default(async () => {
    let { enabled: enabled2 } = await loadAllPluginsCacheOnly(), allPluginHooks = {
      PreToolUse: [],
      PostToolUse: [],
      PostToolUseFailure: [],
      PermissionDenied: [],
      Notification: [],
      UserPromptSubmit: [],
      SessionStart: [],
      SessionEnd: [],
      Stop: [],
      StopFailure: [],
      SubagentStart: [],
      SubagentStop: [],
      PreCompact: [],
      PostCompact: [],
      PermissionRequest: [],
      Setup: [],
      TeammateIdle: [],
      TaskCreated: [],
      TaskCompleted: [],
      Elicitation: [],
      ElicitationResult: [],
      ConfigChange: [],
      WorktreeCreate: [],
      WorktreeRemove: [],
      InstructionsLoaded: [],
      CwdChanged: [],
      FileChanged: []
    };
    for (let plugin of enabled2) {
      if (!plugin.hooksConfig)
        continue;
      logForDebugging(`Loading hooks from plugin: ${plugin.name}`);
      let pluginMatchers = convertPluginHooksToMatchers(plugin);
      for (let event of Object.keys(pluginMatchers))
        allPluginHooks[event].push(...pluginMatchers[event]);
    }
    clearRegisteredPluginHooks(), registerHookCallbacks(allPluginHooks);
    let totalHooks = Object.values(allPluginHooks).reduce((sum, matchers) => sum + matchers.reduce((s2, m4) => s2 + m4.hooks.length, 0), 0);
    logForDebugging(`Registered ${totalHooks} hooks from ${enabled2.length} plugins`);
  });
});
