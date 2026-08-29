// var: init_ListEnforcedGuardrailsConfigurationCommand
var init_ListEnforcedGuardrailsConfigurationCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint69 = __toESM(require_dist_cjs65(), 1);
  ListEnforcedGuardrailsConfigurationCommand = class ListEnforcedGuardrailsConfigurationCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint69.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListEnforcedGuardrailsConfiguration", {}).n("BedrockClient", "ListEnforcedGuardrailsConfigurationCommand").sc(ListEnforcedGuardrailsConfiguration$).build() {
  };
});
