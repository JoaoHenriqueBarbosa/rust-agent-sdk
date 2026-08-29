// function: getPolicySettingsOrigin
function getPolicySettingsOrigin() {
  let remoteSettings = getRemoteManagedSettingsSyncFromCache();
  if (remoteSettings && Object.keys(remoteSettings).length > 0)
    return "remote";
  let mdmResult = getMdmSettings();
  if (Object.keys(mdmResult.settings).length > 0)
    return getPlatform() === "macos" ? "plist" : "hklm";
  let { settings: fileSettings } = loadManagedFileSettings();
  if (fileSettings)
    return "file";
  let hkcu = getHkcuSettings();
  if (Object.keys(hkcu.settings).length > 0)
    return "hkcu";
  return null;
}
