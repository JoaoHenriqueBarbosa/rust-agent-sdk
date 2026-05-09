// function: filterSettingsEnv
function filterSettingsEnv(env5) {
  return withoutCcdSpawnEnvKeys(withoutHostManagedProviderVars(withoutSSHTunnelVars(env5)));
}
