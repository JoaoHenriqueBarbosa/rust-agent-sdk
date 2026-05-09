// function: loadSettingSourcesFromFlag
function loadSettingSourcesFromFlag(settingSourcesArg) {
  try {
    let sources = parseSettingSourcesFlag(settingSourcesArg);
    setAllowedSettingSources(sources), resetSettingsCache();
  } catch (error44) {
    if (error44 instanceof Error)
      logError2(error44);
    process.stderr.write(source_default.red(`Error processing --setting-sources: ${errorMessage(error44)}
`)), process.exit(1);
  }
}
