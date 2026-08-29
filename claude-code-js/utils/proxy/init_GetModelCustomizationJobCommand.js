// var: init_GetModelCustomizationJobCommand
var init_GetModelCustomizationJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint55 = __toESM(require_dist_cjs65(), 1);
  GetModelCustomizationJobCommand = class GetModelCustomizationJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint55.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetModelCustomizationJob", {}).n("BedrockClient", "GetModelCustomizationJobCommand").sc(GetModelCustomizationJob$).build() {
  };
});
