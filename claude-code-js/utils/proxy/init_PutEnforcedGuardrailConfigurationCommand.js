// var: init_PutEnforcedGuardrailConfigurationCommand
var init_PutEnforcedGuardrailConfigurationCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint84 = __toESM(require_dist_cjs65(), 1);
  PutEnforcedGuardrailConfigurationCommand = class PutEnforcedGuardrailConfigurationCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint84.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "PutEnforcedGuardrailConfiguration", {}).n("BedrockClient", "PutEnforcedGuardrailConfigurationCommand").sc(PutEnforcedGuardrailConfiguration$).build() {
  };
});
