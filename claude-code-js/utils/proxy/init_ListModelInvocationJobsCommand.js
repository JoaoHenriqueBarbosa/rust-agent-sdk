// var: init_ListModelInvocationJobsCommand
var init_ListModelInvocationJobsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint80 = __toESM(require_dist_cjs65(), 1);
  ListModelInvocationJobsCommand = class ListModelInvocationJobsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint80.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListModelInvocationJobs", {}).n("BedrockClient", "ListModelInvocationJobsCommand").sc(ListModelInvocationJobs$).build() {
  };
});
