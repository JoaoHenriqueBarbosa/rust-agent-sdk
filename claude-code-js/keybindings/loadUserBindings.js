// Original: src/keybindings/loadUserBindings.ts
import { readFileSync as readFileSync18 } from "fs";
import { readFile as readFile14, stat as stat15 } from "fs/promises";
import { dirname as dirname27, join as join48 } from "path";
function isKeybindingCustomizationEnabled() {
  return !0;
}
function logCustomBindingsLoadedOncePerDay(userBindingCount) {
  let today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  if (lastCustomBindingsLogDate === today)
    return;
  lastCustomBindingsLogDate = today, logEvent("tengu_custom_keybindings_loaded", {
    user_binding_count: userBindingCount
  });
}
function isKeybindingBlock2(obj) {
  if (typeof obj !== "object" || obj === null)
    return !1;
  let b = obj;
  return typeof b.context === "string" && typeof b.bindings === "object" && b.bindings !== null;
}
function isKeybindingBlockArray2(arr) {
  return Array.isArray(arr) && arr.every(isKeybindingBlock2);
}
function getKeybindingsPath() {
  return join48(getClaudeConfigHomeDir(), "keybindings.json");
}
function getDefaultParsedBindings() {
  return parseBindings(DEFAULT_BINDINGS);
}
async function loadKeybindings() {
  let defaultBindings = getDefaultParsedBindings();
  if (!isKeybindingCustomizationEnabled())
    return { bindings: defaultBindings, warnings: [] };
  let userPath = getKeybindingsPath();
  try {
    let content = await readFile14(userPath, "utf-8"), parsed = jsonParse(content), userBlocks;
    if (typeof parsed === "object" && parsed !== null && "bindings" in parsed)
      userBlocks = parsed.bindings;
    else
      return logForDebugging('[keybindings] Invalid keybindings.json: keybindings.json must have a "bindings" array'), {
        bindings: defaultBindings,
        warnings: [
          {
            type: "parse_error",
            severity: "error",
            message: 'keybindings.json must have a "bindings" array',
            suggestion: 'Use format: { "bindings": [ ... ] }'
          }
        ]
      };
    if (!isKeybindingBlockArray2(userBlocks)) {
      let errorMessage2 = !Array.isArray(userBlocks) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure", suggestion = !Array.isArray(userBlocks) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
      return logForDebugging(`[keybindings] Invalid keybindings.json: ${errorMessage2}`), {
        bindings: defaultBindings,
        warnings: [
          {
            type: "parse_error",
            severity: "error",
            message: errorMessage2,
            suggestion
          }
        ]
      };
    }
    let userParsed = parseBindings(userBlocks);
    logForDebugging(`[keybindings] Loaded ${userParsed.length} user bindings from ${userPath}`);
    let mergedBindings = [...defaultBindings, ...userParsed];
    logCustomBindingsLoadedOncePerDay(userParsed.length);
    let warnings = [
      ...checkDuplicateKeysInJson(content),
      ...validateBindings(userBlocks, mergedBindings)
    ];
    if (warnings.length > 0)
      logForDebugging(`[keybindings] Found ${warnings.length} validation issue(s)`);
    return { bindings: mergedBindings, warnings };
  } catch (error44) {
    if (isENOENT(error44))
      return { bindings: defaultBindings, warnings: [] };
    return logForDebugging(`[keybindings] Error loading ${userPath}: ${errorMessage(error44)}`), {
      bindings: defaultBindings,
      warnings: [
        {
          type: "parse_error",
          severity: "error",
          message: `Failed to parse keybindings.json: ${errorMessage(error44)}`
        }
      ]
    };
  }
}
function loadKeybindingsSync() {
  if (cachedBindings)
    return cachedBindings;
  return loadKeybindingsSyncWithWarnings().bindings;
}
function loadKeybindingsSyncWithWarnings() {
  if (cachedBindings)
    return { bindings: cachedBindings, warnings: cachedWarnings };
  let defaultBindings = getDefaultParsedBindings();
  if (!isKeybindingCustomizationEnabled())
    return cachedBindings = defaultBindings, cachedWarnings = [], { bindings: cachedBindings, warnings: cachedWarnings };
  let userPath = getKeybindingsPath();
  try {
    let content = readFileSync18(userPath, "utf-8"), parsed = jsonParse(content), userBlocks;
    if (typeof parsed === "object" && parsed !== null && "bindings" in parsed)
      userBlocks = parsed.bindings;
    else
      return cachedBindings = defaultBindings, cachedWarnings = [
        {
          type: "parse_error",
          severity: "error",
          message: 'keybindings.json must have a "bindings" array',
          suggestion: 'Use format: { "bindings": [ ... ] }'
        }
      ], { bindings: cachedBindings, warnings: cachedWarnings };
    if (!isKeybindingBlockArray2(userBlocks)) {
      let errorMessage2 = !Array.isArray(userBlocks) ? '"bindings" must be an array' : "keybindings.json contains invalid block structure", suggestion = !Array.isArray(userBlocks) ? 'Set "bindings" to an array of keybinding blocks' : 'Each block must have "context" (string) and "bindings" (object)';
      return cachedBindings = defaultBindings, cachedWarnings = [
        {
          type: "parse_error",
          severity: "error",
          message: errorMessage2,
          suggestion
        }
      ], { bindings: cachedBindings, warnings: cachedWarnings };
    }
    let userParsed = parseBindings(userBlocks);
    if (logForDebugging(`[keybindings] Loaded ${userParsed.length} user bindings from ${userPath}`), cachedBindings = [...defaultBindings, ...userParsed], logCustomBindingsLoadedOncePerDay(userParsed.length), cachedWarnings = [
      ...checkDuplicateKeysInJson(content),
      ...validateBindings(userBlocks, cachedBindings)
    ], cachedWarnings.length > 0)
      logForDebugging(`[keybindings] Found ${cachedWarnings.length} validation issue(s)`);
    return { bindings: cachedBindings, warnings: cachedWarnings };
  } catch {
    return cachedBindings = defaultBindings, cachedWarnings = [], { bindings: cachedBindings, warnings: cachedWarnings };
  }
}
async function initializeKeybindingWatcher() {
  if (initialized2 || disposed2)
    return;
  if (!isKeybindingCustomizationEnabled()) {
    logForDebugging("[keybindings] Skipping file watcher - user customization disabled");
    return;
  }
  let userPath = getKeybindingsPath(), watchDir = dirname27(userPath);
  try {
    if (!(await stat15(watchDir)).isDirectory()) {
      logForDebugging(`[keybindings] Not watching: ${watchDir} is not a directory`);
      return;
    }
  } catch {
    logForDebugging(`[keybindings] Not watching: ${watchDir} does not exist`);
    return;
  }
  initialized2 = !0, logForDebugging(`[keybindings] Watching for changes to ${userPath}`), watcher2 = esm_default.watch(userPath, {
    persistent: !0,
    ignoreInitial: !0,
    awaitWriteFinish: {
      stabilityThreshold: FILE_STABILITY_THRESHOLD_MS2,
      pollInterval: FILE_STABILITY_POLL_INTERVAL_MS2
    },
    ignorePermissionErrors: !0,
    usePolling: !1,
    atomic: !0
  }), watcher2.on("add", handleChange3), watcher2.on("change", handleChange3), watcher2.on("unlink", handleDelete2), registerCleanup(async () => disposeKeybindingWatcher());
}
function disposeKeybindingWatcher() {
  if (disposed2 = !0, watcher2)
    watcher2.close(), watcher2 = null;
  keybindingsChanged.clear();
}
async function handleChange3(path16) {
  logForDebugging(`[keybindings] Detected change to ${path16}`);
  try {
    let result = await loadKeybindings();
    cachedBindings = result.bindings, cachedWarnings = result.warnings, keybindingsChanged.emit(result);
  } catch (error44) {
    logForDebugging(`[keybindings] Error reloading: ${errorMessage(error44)}`);
  }
}
function handleDelete2(path16) {
  logForDebugging(`[keybindings] Detected deletion of ${path16}`);
  let defaultBindings = getDefaultParsedBindings();
  cachedBindings = defaultBindings, cachedWarnings = [], keybindingsChanged.emit({ bindings: defaultBindings, warnings: [] });
}
function getCachedKeybindingWarnings() {
  return cachedWarnings;
}
var FILE_STABILITY_THRESHOLD_MS2 = 500, FILE_STABILITY_POLL_INTERVAL_MS2 = 200, watcher2 = null, initialized2 = !1, disposed2 = !1, cachedBindings = null, cachedWarnings, keybindingsChanged, lastCustomBindingsLogDate = null, subscribeToKeybindingChanges;
var init_loadUserBindings = __esm(() => {
  init_esm10();
  init_cleanupRegistry();
  init_debug();
  init_envUtils();
  init_errors();
  init_slowOperations();
  init_defaultBindings();
  init_validate3();
  cachedWarnings = [], keybindingsChanged = createSignal();
  subscribeToKeybindingChanges = keybindingsChanged.subscribe;
});
