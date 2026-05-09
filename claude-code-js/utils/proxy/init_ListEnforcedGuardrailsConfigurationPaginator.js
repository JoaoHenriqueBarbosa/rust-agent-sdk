// var: init_ListEnforcedGuardrailsConfigurationPaginator
var init_ListEnforcedGuardrailsConfigurationPaginator = __esm(() => {
  init_BedrockClient();
  init_ListEnforcedGuardrailsConfigurationCommand();
  import_core18 = __toESM(require_dist_cjs37(), 1), paginateListEnforcedGuardrailsConfiguration = import_core18.createPaginator(BedrockClient, ListEnforcedGuardrailsConfigurationCommand, "nextToken", "nextToken", "");
});
