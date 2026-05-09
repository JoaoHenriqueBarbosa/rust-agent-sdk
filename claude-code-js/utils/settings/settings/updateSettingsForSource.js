// function: updateSettingsForSource
function updateSettingsForSource(source, settings) {
  if (source === "policySettings" || source === "flagSettings")
    return { error: null };
  let filePath = getSettingsFilePathForSource(source);
  if (!filePath)
    return { error: null };
  try {
    getFsImplementation().mkdirSync(dirname10(filePath));
    let existingSettings = getSettingsForSourceUncached(source);
    if (!existingSettings) {
      let content = null;
      try {
        content = readFileSync4(filePath);
      } catch (e) {
        if (!isENOENT(e))
          throw e;
      }
      if (content !== null) {
        let rawData = safeParseJSON(content);
        if (rawData === null)
          return {
            error: Error(`Invalid JSON syntax in settings file at ${filePath}`)
          };
        if (rawData && typeof rawData === "object")
          existingSettings = rawData, logForDebugging(`Using raw settings from ${filePath} due to validation failure`);
      }
    }
    let updatedSettings = mergeWith_default(existingSettings || {}, settings, (_objValue, srcValue, key, object2) => {
      if (srcValue === void 0 && object2 && typeof key === "string") {
        delete object2[key];
        return;
      }
      if (Array.isArray(srcValue))
        return srcValue;
      return;
    });
    if (markInternalWrite(filePath), writeFileSyncAndFlush_DEPRECATED(filePath, jsonStringify(updatedSettings, null, 2) + `
`), resetSettingsCache(), source === "localSettings")
      addFileGlobRuleToGitignore(getRelativeSettingsFilePathForSource("localSettings"), getOriginalCwd());
  } catch (e) {
    let error41 = Error(`Failed to read raw settings from ${filePath}: ${e}`);
    return logError2(error41), { error: error41 };
  }
  return { error: null };
}
