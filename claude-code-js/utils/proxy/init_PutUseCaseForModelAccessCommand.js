// var: init_PutUseCaseForModelAccessCommand
var init_PutUseCaseForModelAccessCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint87 = __toESM(require_dist_cjs65(), 1);
  PutUseCaseForModelAccessCommand = class PutUseCaseForModelAccessCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint87.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "PutUseCaseForModelAccess", {}).n("BedrockClient", "PutUseCaseForModelAccessCommand").sc(PutUseCaseForModelAccess$).build() {
  };
});
