// var: init_BatchDeleteEvaluationJobCommand
var init_BatchDeleteEvaluationJobCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint2 = __toESM(require_dist_cjs65(), 1);
  BatchDeleteEvaluationJobCommand = class BatchDeleteEvaluationJobCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint2.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "BatchDeleteEvaluationJob", {}).n("BedrockClient", "BatchDeleteEvaluationJobCommand").sc(BatchDeleteEvaluationJob$).build() {
  };
});
