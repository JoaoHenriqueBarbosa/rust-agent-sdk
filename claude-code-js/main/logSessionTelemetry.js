// function: logSessionTelemetry
function logSessionTelemetry() {
  let model = parseUserSpecifiedModel(getInitialMainLoopModel() ?? getDefaultMainLoopModel());
  logSkillsLoaded(getCwd(), getContextWindowForModel(model, getSdkBetas())), loadAllPluginsCacheOnly().then(({
    enabled: enabled2,
    errors: errors8
  }) => {
    let managedNames = getManagedPluginNames();
    logPluginsEnabledForSession(enabled2, managedNames, getPluginSeedDirs()), logPluginLoadErrors(errors8, managedNames);
  }).catch((err2) => logError2(err2));
}
