// var: init_GetFoundationModelCommand
var init_GetFoundationModelCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint49 = __toESM(require_dist_cjs65(), 1);
  GetFoundationModelCommand = class GetFoundationModelCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint49.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetFoundationModel", {}).n("BedrockClient", "GetFoundationModelCommand").sc(GetFoundationModel$).build() {
  };
});
