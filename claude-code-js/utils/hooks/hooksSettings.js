// Original: src/utils/hooks/hooksSettings.ts
import { resolve as resolve25 } from "path";
function isHookEqual(a2, b) {
  if (a2.type !== b.type)
    return !1;
  let sameIf = (x4, y2) => (x4.if ?? "") === (y2.if ?? "");
  switch (a2.type) {
    case "command":
      return b.type === "command" && a2.command === b.command && (a2.shell ?? DEFAULT_HOOK_SHELL) === (b.shell ?? DEFAULT_HOOK_SHELL) && sameIf(a2, b);
    case "prompt":
      return b.type === "prompt" && a2.prompt === b.prompt && sameIf(a2, b);
    case "agent":
      return b.type === "agent" && a2.prompt === b.prompt && sameIf(a2, b);
    case "http":
      return b.type === "http" && a2.url === b.url && sameIf(a2, b);
    case "function":
      return !1;
  }
}
function getHookDisplayText(hook) {
  if ("statusMessage" in hook && hook.statusMessage)
    return hook.statusMessage;
  switch (hook.type) {
    case "command":
      return hook.command;
    case "prompt":
      return hook.prompt;
    case "agent":
      return hook.prompt;
    case "http":
      return hook.url;
    case "callback":
      return "callback";
    case "function":
      return "function";
  }
}
function getAllHooks(appState) {
  let hooks = [];
  if (getSettingsForSource("policySettings")?.allowManagedHooksOnly !== !0) {
    let sources = [
      "userSettings",
      "projectSettings",
      "localSettings"
    ], seenFiles = /* @__PURE__ */ new Set;
    for (let source of sources) {
      let filePath = getSettingsFilePathForSource(source);
      if (filePath) {
        let resolvedPath5 = resolve25(filePath);
        if (seenFiles.has(resolvedPath5))
          continue;
        seenFiles.add(resolvedPath5);
      }
      let sourceSettings = getSettingsForSource(source);
      if (!sourceSettings?.hooks)
        continue;
      for (let [event, matchers] of Object.entries(sourceSettings.hooks))
        for (let matcher of matchers)
          for (let hookCommand of matcher.hooks)
            hooks.push({
              event,
              config: hookCommand,
              matcher: matcher.matcher,
              source
            });
    }
  }
  let sessionId = getSessionId(), sessionHooks = getSessionHooks(appState, sessionId);
  for (let [event, matchers] of sessionHooks.entries())
    for (let matcher of matchers)
      for (let hookCommand of matcher.hooks)
        hooks.push({
          event,
          config: hookCommand,
          matcher: matcher.matcher,
          source: "sessionHook"
        });
  return hooks;
}
function hookSourceDescriptionDisplayString(source) {
  switch (source) {
    case "userSettings":
      return "User settings (~/.claude/settings.json)";
    case "projectSettings":
      return "Project settings (.claude/settings.json)";
    case "localSettings":
      return "Local settings (.claude/settings.local.json)";
    case "pluginHook":
      return "Plugin hooks (~/.claude/plugins/*/hooks/hooks.json)";
    case "sessionHook":
      return "Session hooks (in-memory, temporary)";
    case "builtinHook":
      return "Built-in hooks (registered internally by Claude Code)";
    default:
      return source;
  }
}
function hookSourceHeaderDisplayString(source) {
  switch (source) {
    case "userSettings":
      return "User Settings";
    case "projectSettings":
      return "Project Settings";
    case "localSettings":
      return "Local Settings";
    case "pluginHook":
      return "Plugin Hooks";
    case "sessionHook":
      return "Session Hooks";
    case "builtinHook":
      return "Built-in Hooks";
    default:
      return source;
  }
}
function hookSourceInlineDisplayString(source) {
  switch (source) {
    case "userSettings":
      return "User";
    case "projectSettings":
      return "Project";
    case "localSettings":
      return "Local";
    case "pluginHook":
      return "Plugin";
    case "sessionHook":
      return "Session";
    case "builtinHook":
      return "Built-in";
    default:
      return source;
  }
}
function sortMatchersByPriority(matchers, hooksByEventAndMatcher, selectedEvent) {
  let sourcePriority = SOURCES.reduce((acc, source, index) => {
    return acc[source] = index, acc;
  }, {});
  return [...matchers].sort((a2, b) => {
    let aHooks = hooksByEventAndMatcher[selectedEvent]?.[a2] || [], bHooks = hooksByEventAndMatcher[selectedEvent]?.[b] || [], aSources = Array.from(new Set(aHooks.map((h4) => h4.source))), bSources = Array.from(new Set(bHooks.map((h4) => h4.source))), getSourcePriority = (source) => source === "pluginHook" || source === "builtinHook" ? 999 : sourcePriority[source], aHighestPriority = Math.min(...aSources.map(getSourcePriority)), bHighestPriority = Math.min(...bSources.map(getSourcePriority));
    if (aHighestPriority !== bHighestPriority)
      return aHighestPriority - bHighestPriority;
    return a2.localeCompare(b);
  });
}
var init_hooksSettings = __esm(() => {
  init_state();
  init_constants2();
  init_settings2();
  init_shellProvider();
  init_sessionHooks();
});
