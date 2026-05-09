// var: init_StopEvaluationJobCommand
var init_StopEvaluationJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint91 = __toESM(require_dist_cjs65(), 1);
  StopEvaluationJobCommand = class StopEvaluationJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint91.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "StopEvaluationJob", {}).n("BedrockClient", "StopEvaluationJobCommand").sc(StopEvaluationJob$).build() {
  };
});
