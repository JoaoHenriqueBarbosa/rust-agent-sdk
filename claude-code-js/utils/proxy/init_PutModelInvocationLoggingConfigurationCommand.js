// var: init_PutModelInvocationLoggingConfigurationCommand
var init_PutModelInvocationLoggingConfigurationCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint85 = __toESM(require_dist_cjs65(), 1);
  PutModelInvocationLoggingConfigurationCommand = class PutModelInvocationLoggingConfigurationCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint85.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "PutModelInvocationLoggingConfiguration", {}).n("BedrockClient", "PutModelInvocationLoggingConfigurationCommand").sc(PutModelInvocationLoggingConfiguration$).build() {
  };
});
