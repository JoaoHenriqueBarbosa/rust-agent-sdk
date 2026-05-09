// Original: src/utils/settings/allErrors.ts
function getSettingsWithAllErrors() {
  let result = getSettingsWithErrors(), mcpErrors = ["user", "project", "local"].flatMap((scope) => getMcpConfigsByScope(scope).errors);
  return {
    settings: result.settings,
    errors: [...result.errors, ...mcpErrors]
  };
}
var init_allErrors = __esm(() => {
  init_config8();
  init_settings2();
});
