// Original: src/utils/settings/mdm/settings.ts
import { join as join16 } from "path";
function startMdmSettingsLoad() {
  if (mdmLoadPromise)
    return;
  mdmLoadPromise = (async () => {
    profileCheckpoint("mdm_load_start");
    let startTime = Date.now(), rawPromise = getMdmRawReadPromise() ?? fireRawRead(), { mdm, hkcu } = consumeRawReadResult(await rawPromise);
    mdmCache = mdm, hkcuCache = hkcu, profileCheckpoint("mdm_load_end");
    let duration3 = Date.now() - startTime;
    if (logForDebugging(`MDM settings load completed in ${duration3}ms`), Object.keys(mdm.settings).length > 0) {
      logForDebugging(`MDM settings found: ${Object.keys(mdm.settings).join(", ")}`);
      try {
        logForDiagnosticsNoPII("info", "mdm_settings_loaded", {
          duration_ms: duration3,
          key_count: Object.keys(mdm.settings).length,
          error_count: mdm.errors.length
        });
      } catch {}
    }
  })();
}
async function ensureMdmSettingsLoaded() {
  if (!mdmLoadPromise)
    startMdmSettingsLoad();
  await mdmLoadPromise;
}
function getMdmSettings() {
  return mdmCache ?? EMPTY_RESULT;
}
function getHkcuSettings() {
  return hkcuCache ?? EMPTY_RESULT;
}
function setMdmSettingsCache(mdm, hkcu) {
  mdmCache = mdm, hkcuCache = hkcu;
}
async function refreshMdmSettings() {
  let raw = await fireRawRead();
  return consumeRawReadResult(raw);
}
function parseCommandOutputAsSettings(stdout, sourcePath) {
  let data = safeParseJSON(stdout, !1);
  if (!data || typeof data !== "object")
    return { settings: {}, errors: [] };
  let ruleWarnings = filterInvalidPermissionRules(data, sourcePath), parseResult = SettingsSchema().safeParse(data);
  if (!parseResult.success) {
    let errors3 = formatZodError(parseResult.error, sourcePath);
    return { settings: {}, errors: [...ruleWarnings, ...errors3] };
  }
  return { settings: parseResult.data, errors: ruleWarnings };
}
function parseRegQueryStdout(stdout, valueName = "Settings") {
  let lines = stdout.split(/\r?\n/), escaped = valueName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), re = new RegExp(`^\\s+${escaped}\\s+REG_(?:EXPAND_)?SZ\\s+(.*)$`, "i");
  for (let line of lines) {
    let match = line.match(re);
    if (match && match[1])
      return match[1].trimEnd();
  }
  return null;
}
function consumeRawReadResult(raw) {
  if (raw.plistStdouts && raw.plistStdouts.length > 0) {
    let { stdout, label } = raw.plistStdouts[0], result = parseCommandOutputAsSettings(stdout, label);
    if (Object.keys(result.settings).length > 0)
      return { mdm: result, hkcu: EMPTY_RESULT };
  }
  if (raw.hklmStdout) {
    let jsonString = parseRegQueryStdout(raw.hklmStdout);
    if (jsonString) {
      let result = parseCommandOutputAsSettings(jsonString, `Registry: ${WINDOWS_REGISTRY_KEY_PATH_HKLM}\\${WINDOWS_REGISTRY_VALUE_NAME}`);
      if (Object.keys(result.settings).length > 0)
        return { mdm: result, hkcu: EMPTY_RESULT };
    }
  }
  if (hasManagedSettingsFile())
    return { mdm: EMPTY_RESULT, hkcu: EMPTY_RESULT };
  if (raw.hkcuStdout) {
    let jsonString = parseRegQueryStdout(raw.hkcuStdout);
    if (jsonString) {
      let result = parseCommandOutputAsSettings(jsonString, `Registry: ${WINDOWS_REGISTRY_KEY_PATH_HKCU}\\${WINDOWS_REGISTRY_VALUE_NAME}`);
      return { mdm: EMPTY_RESULT, hkcu: result };
    }
  }
  return { mdm: EMPTY_RESULT, hkcu: EMPTY_RESULT };
}
function hasManagedSettingsFile() {
  try {
    let filePath = join16(getManagedFilePath(), "managed-settings.json"), content = readFileSync4(filePath), data = safeParseJSON(content, !1);
    if (data && typeof data === "object" && Object.keys(data).length > 0)
      return !0;
  } catch {}
  try {
    let dropInDir = getManagedSettingsDropInDir(), entries = getFsImplementation().readdirSync(dropInDir);
    for (let d of entries) {
      if (!(d.isFile() || d.isSymbolicLink()) || !d.name.endsWith(".json") || d.name.startsWith("."))
        continue;
      try {
        let content = readFileSync4(join16(dropInDir, d.name)), data = safeParseJSON(content, !1);
        if (data && typeof data === "object" && Object.keys(data).length > 0)
          return !0;
      } catch {}
    }
  } catch {}
  return !1;
}
var EMPTY_RESULT, mdmCache = null, hkcuCache = null, mdmLoadPromise = null;
var init_settings = __esm(() => {
  init_debug();
  init_diagLogs();
  init_fileRead();
  init_fsOperations();
  init_json();
  init_startupProfiler();
  init_managedPath();
  init_types3();
  init_validation2();
  init_constants4();
  init_rawRead();
  EMPTY_RESULT = Object.freeze({ settings: {}, errors: [] });
});
