// var: init_ListModelCopyJobsCommand
var init_ListModelCopyJobsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint77 = __toESM(require_dist_cjs65(), 1);
  ListModelCopyJobsCommand = class ListModelCopyJobsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint77.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListModelCopyJobs", {}).n("BedrockClient", "ListModelCopyJobsCommand").sc(ListModelCopyJobs$).build() {
  };
});
