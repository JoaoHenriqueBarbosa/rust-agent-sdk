// Original: src/utils/teleport/environmentSelection.ts
async function getEnvironmentSelectionInfo() {
  let environments = await fetchEnvironments();
  if (environments.length === 0)
    return {
      availableEnvironments: [],
      selectedEnvironment: null,
      selectedEnvironmentSource: null
    };
  let defaultEnvironmentId = getSettings_DEPRECATED()?.remote?.defaultEnvironmentId, selectedEnvironment = environments.find((env5) => env5.kind !== "bridge") ?? environments[0], selectedEnvironmentSource = null;
  if (defaultEnvironmentId) {
    let matchingEnvironment = environments.find((env5) => env5.environment_id === defaultEnvironmentId);
    if (matchingEnvironment) {
      selectedEnvironment = matchingEnvironment;
      for (let i5 = SETTING_SOURCES.length - 1;i5 >= 0; i5--) {
        let source = SETTING_SOURCES[i5];
        if (!source || source === "flagSettings")
          continue;
        if (getSettingsForSource(source)?.remote?.defaultEnvironmentId === defaultEnvironmentId) {
          selectedEnvironmentSource = source;
          break;
        }
      }
    }
  }
  return {
    availableEnvironments: environments,
    selectedEnvironment,
    selectedEnvironmentSource
  };
}
var init_environmentSelection = __esm(() => {
  init_constants2();
  init_settings2();
  init_environments();
});
