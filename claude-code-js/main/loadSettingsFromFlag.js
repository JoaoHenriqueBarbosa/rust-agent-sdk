// function: loadSettingsFromFlag
function loadSettingsFromFlag(settingsFile) {
  try {
    let trimmedSettings = settingsFile.trim(), looksLikeJson = trimmedSettings.startsWith("{") && trimmedSettings.endsWith("}"), settingsPath;
    if (looksLikeJson) {
      if (!safeParseJSON(trimmedSettings))
        process.stderr.write(source_default.red(`Error: Invalid JSON provided to --settings
`)), process.exit(1);
      settingsPath = generateTempFilePath("claude-settings", ".json", {
        contentHash: trimmedSettings
      }), writeFileSync_DEPRECATED(settingsPath, trimmedSettings, "utf8");
    } else {
      let {
        resolvedPath: resolvedSettingsPath
      } = safeResolvePath(getFsImplementation(), settingsFile);
      try {
        readFileSync21(resolvedSettingsPath, "utf8");
      } catch (e) {
        if (isENOENT(e))
          process.stderr.write(source_default.red(`Error: Settings file not found: ${resolvedSettingsPath}
`)), process.exit(1);
        throw e;
      }
      settingsPath = resolvedSettingsPath;
    }
    setFlagSettingsPath(settingsPath), resetSettingsCache();
  } catch (error44) {
    if (error44 instanceof Error)
      logError2(error44);
    process.stderr.write(source_default.red(`Error processing settings: ${errorMessage(error44)}
`)), process.exit(1);
  }
}
