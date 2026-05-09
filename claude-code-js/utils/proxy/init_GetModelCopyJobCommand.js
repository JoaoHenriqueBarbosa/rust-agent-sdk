// var: init_GetModelCopyJobCommand
var init_GetModelCopyJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint54 = __toESM(require_dist_cjs65(), 1);
  GetModelCopyJobCommand = class GetModelCopyJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint54.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetModelCopyJob", {}).n("BedrockClient", "GetModelCopyJobCommand").sc(GetModelCopyJob$).build() {
  };
});
