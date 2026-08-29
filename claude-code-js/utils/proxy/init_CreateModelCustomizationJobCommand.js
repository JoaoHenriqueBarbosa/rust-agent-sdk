// var: init_CreateModelCustomizationJobCommand
var init_CreateModelCustomizationJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint16 = __toESM(require_dist_cjs65(), 1);
  CreateModelCustomizationJobCommand = class CreateModelCustomizationJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint16.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateModelCustomizationJob", {}).n("BedrockClient", "CreateModelCustomizationJobCommand").sc(CreateModelCustomizationJob$).build() {
  };
});
