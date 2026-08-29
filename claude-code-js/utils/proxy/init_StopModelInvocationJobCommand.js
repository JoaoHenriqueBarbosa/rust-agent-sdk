// var: init_StopModelInvocationJobCommand
var init_StopModelInvocationJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint93 = __toESM(require_dist_cjs65(), 1);
  StopModelInvocationJobCommand = class StopModelInvocationJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint93.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "StopModelInvocationJob", {}).n("BedrockClient", "StopModelInvocationJobCommand").sc(StopModelInvocationJob$).build() {
  };
});
