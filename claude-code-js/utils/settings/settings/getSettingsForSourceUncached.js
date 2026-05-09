// function: getSettingsForSourceUncached
function getSettingsForSourceUncached(source) {
  if (source === "policySettings") {
    let remoteSettings = getRemoteManagedSettingsSyncFromCache();
    if (remoteSettings && Object.keys(remoteSettings).length > 0)
      return remoteSettings;
    let mdmResult = getMdmSettings();
    if (Object.keys(mdmResult.settings).length > 0)
      return mdmResult.settings;
    let { settings: fileSettings2 } = loadManagedFileSettings();
    if (fileSettings2)
      return fileSettings2;
    let hkcu = getHkcuSettings();
    if (Object.keys(hkcu.settings).length > 0)
      return hkcu.settings;
    return null;
  }
  let settingsFilePath = getSettingsFilePathForSource(source), { settings: fileSettings } = settingsFilePath ? parseSettingsFile(settingsFilePath) : { settings: null };
  if (source === "flagSettings") {
    let inlineSettings = getFlagSettingsInline();
    if (inlineSettings) {
      let parsed = SettingsSchema().safeParse(inlineSettings);
      if (parsed.success)
        return mergeWith_default(fileSettings || {}, parsed.data, settingsMergeCustomizer);
    }
  }
  return fileSettings;
}
