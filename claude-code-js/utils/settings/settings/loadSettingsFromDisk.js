// function: loadSettingsFromDisk
function loadSettingsFromDisk() {
  if (isLoadingSettings)
    return { settings: {}, errors: [] };
  let startTime = Date.now();
  profileCheckpoint("loadSettingsFromDisk_start"), logForDiagnosticsNoPII("info", "settings_load_started"), isLoadingSettings = !0;
  try {
    let pluginSettings = getPluginSettingsBase(), mergedSettings = {};
    if (pluginSettings)
      mergedSettings = mergeWith_default(mergedSettings, pluginSettings, settingsMergeCustomizer);
    let allErrors = [], seenErrors = /* @__PURE__ */ new Set, seenFiles = /* @__PURE__ */ new Set;
    for (let source of getEnabledSettingSources()) {
      if (source === "policySettings") {
        let policySettings = null, policyErrors = [], remoteSettings = getRemoteManagedSettingsSyncFromCache();
        if (remoteSettings && Object.keys(remoteSettings).length > 0) {
          let result = SettingsSchema().safeParse(remoteSettings);
          if (result.success)
            policySettings = result.data;
          else
            policyErrors.push(...formatZodError(result.error, "remote managed settings"));
        }
        if (!policySettings) {
          let mdmResult = getMdmSettings();
          if (Object.keys(mdmResult.settings).length > 0)
            policySettings = mdmResult.settings;
          policyErrors.push(...mdmResult.errors);
        }
        if (!policySettings) {
          let { settings, errors: errors3 } = loadManagedFileSettings();
          if (settings)
            policySettings = settings;
          policyErrors.push(...errors3);
        }
        if (!policySettings) {
          let hkcu = getHkcuSettings();
          if (Object.keys(hkcu.settings).length > 0)
            policySettings = hkcu.settings;
          policyErrors.push(...hkcu.errors);
        }
        if (policySettings)
          mergedSettings = mergeWith_default(mergedSettings, policySettings, settingsMergeCustomizer);
        for (let error41 of policyErrors) {
          let errorKey = `${error41.file}:${error41.path}:${error41.message}`;
          if (!seenErrors.has(errorKey))
            seenErrors.add(errorKey), allErrors.push(error41);
        }
        continue;
      }
      let filePath = getSettingsFilePathForSource(source);
      if (filePath) {
        let resolvedPath = resolve7(filePath);
        if (!seenFiles.has(resolvedPath)) {
          seenFiles.add(resolvedPath);
          let { settings, errors: errors3 } = parseSettingsFile(filePath);
          for (let error41 of errors3) {
            let errorKey = `${error41.file}:${error41.path}:${error41.message}`;
            if (!seenErrors.has(errorKey))
              seenErrors.add(errorKey), allErrors.push(error41);
          }
          if (settings)
            mergedSettings = mergeWith_default(mergedSettings, settings, settingsMergeCustomizer);
        }
      }
      if (source === "flagSettings") {
        let inlineSettings = getFlagSettingsInline();
        if (inlineSettings) {
          let parsed = SettingsSchema().safeParse(inlineSettings);
          if (parsed.success)
            mergedSettings = mergeWith_default(mergedSettings, parsed.data, settingsMergeCustomizer);
        }
      }
    }
    return logForDiagnosticsNoPII("info", "settings_load_completed", {
      duration_ms: Date.now() - startTime,
      source_count: seenFiles.size,
      error_count: allErrors.length
    }), { settings: mergedSettings, errors: allErrors };
  } finally {
    isLoadingSettings = !1;
  }
}
