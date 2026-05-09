// var: init_ListModelCustomizationJobsCommand
var init_ListModelCustomizationJobsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint78 = __toESM(require_dist_cjs65(), 1);
  ListModelCustomizationJobsCommand = class ListModelCustomizationJobsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint78.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListModelCustomizationJobs", {}).n("BedrockClient", "ListModelCustomizationJobsCommand").sc(ListModelCustomizationJobs$).build() {
  };
});
