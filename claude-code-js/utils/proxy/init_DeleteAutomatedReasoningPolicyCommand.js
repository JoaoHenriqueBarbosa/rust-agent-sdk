// var: init_DeleteAutomatedReasoningPolicyCommand
var init_DeleteAutomatedReasoningPolicyCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint22 = __toESM(require_dist_cjs65(), 1);
  DeleteAutomatedReasoningPolicyCommand = class DeleteAutomatedReasoningPolicyCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint22.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteAutomatedReasoningPolicy", {}).n("BedrockClient", "DeleteAutomatedReasoningPolicyCommand").sc(DeleteAutomatedReasoningPolicy$).build() {
  };
});
