// var: init_GetUseCaseForModelAccessCommand
var init_GetUseCaseForModelAccessCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint62 = __toESM(require_dist_cjs65(), 1);
  GetUseCaseForModelAccessCommand = class GetUseCaseForModelAccessCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint62.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetUseCaseForModelAccess", {}).n("BedrockClient", "GetUseCaseForModelAccessCommand").sc(GetUseCaseForModelAccess$).build() {
  };
});
