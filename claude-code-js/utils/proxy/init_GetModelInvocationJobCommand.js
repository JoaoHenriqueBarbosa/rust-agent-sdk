// var: init_GetModelInvocationJobCommand
var init_GetModelInvocationJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint57 = __toESM(require_dist_cjs65(), 1);
  GetModelInvocationJobCommand = class GetModelInvocationJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint57.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetModelInvocationJob", {}).n("BedrockClient", "GetModelInvocationJobCommand").sc(GetModelInvocationJob$).build() {
  };
});
