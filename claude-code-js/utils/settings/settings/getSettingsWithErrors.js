// function: getSettingsWithErrors
function getSettingsWithErrors() {
  let cached2 = getSessionSettingsCache();
  if (cached2 !== null)
    return cached2;
  let result = loadSettingsFromDisk();
  return profileCheckpoint("loadSettingsFromDisk_end"), setSessionSettingsCache(result), result;
}
