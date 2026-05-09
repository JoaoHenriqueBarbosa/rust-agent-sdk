// var: init_DeleteAutomatedReasoningPolicyBuildWorkflowCommand
var init_DeleteAutomatedReasoningPolicyBuildWorkflowCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint21 = __toESM(require_dist_cjs65(), 1);
  DeleteAutomatedReasoningPolicyBuildWorkflowCommand = class DeleteAutomatedReasoningPolicyBuildWorkflowCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint21.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteAutomatedReasoningPolicyBuildWorkflow", {}).n("BedrockClient", "DeleteAutomatedReasoningPolicyBuildWorkflowCommand").sc(DeleteAutomatedReasoningPolicyBuildWorkflow$).build() {
  };
});
