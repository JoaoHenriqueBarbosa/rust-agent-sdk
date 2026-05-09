// var: init_DeleteResourcePolicyCommand
var init_DeleteResourcePolicyCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint35 = __toESM(require_dist_cjs65(), 1);
  DeleteResourcePolicyCommand = class DeleteResourcePolicyCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint35.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteResourcePolicy", {}).n("BedrockClient", "DeleteResourcePolicyCommand").sc(DeleteResourcePolicy$).build() {
  };
});
