// var: init_GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand
var init_GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint40 = __toESM(require_dist_cjs65(), 1);
  GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand = class GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint40.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetAutomatedReasoningPolicyBuildWorkflowResultAssets", {}).n("BedrockClient", "GetAutomatedReasoningPolicyBuildWorkflowResultAssetsCommand").sc(GetAutomatedReasoningPolicyBuildWorkflowResultAssets$).build() {
  };
});
