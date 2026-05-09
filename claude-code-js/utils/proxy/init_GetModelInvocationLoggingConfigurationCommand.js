// var: init_GetModelInvocationLoggingConfigurationCommand
var init_GetModelInvocationLoggingConfigurationCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint58 = __toESM(require_dist_cjs65(), 1);
  GetModelInvocationLoggingConfigurationCommand = class GetModelInvocationLoggingConfigurationCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint58.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetModelInvocationLoggingConfiguration", {}).n("BedrockClient", "GetModelInvocationLoggingConfigurationCommand").sc(GetModelInvocationLoggingConfiguration$).build() {
  };
});
