// var: init_ListEvaluationJobsCommand
var init_ListEvaluationJobsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint70 = __toESM(require_dist_cjs65(), 1);
  ListEvaluationJobsCommand = class ListEvaluationJobsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint70.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListEvaluationJobs", {}).n("BedrockClient", "ListEvaluationJobsCommand").sc(ListEvaluationJobs$).build() {
  };
});
