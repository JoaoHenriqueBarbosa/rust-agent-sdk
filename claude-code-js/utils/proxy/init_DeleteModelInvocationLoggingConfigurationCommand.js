// var: init_DeleteModelInvocationLoggingConfigurationCommand
var init_DeleteModelInvocationLoggingConfigurationCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint32 = __toESM(require_dist_cjs65(), 1);
  DeleteModelInvocationLoggingConfigurationCommand = class DeleteModelInvocationLoggingConfigurationCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint32.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteModelInvocationLoggingConfiguration", {}).n("BedrockClient", "DeleteModelInvocationLoggingConfigurationCommand").sc(DeleteModelInvocationLoggingConfiguration$).build() {
  };
});
