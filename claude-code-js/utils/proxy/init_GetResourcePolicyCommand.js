// var: init_GetResourcePolicyCommand
var init_GetResourcePolicyCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint61 = __toESM(require_dist_cjs65(), 1);
  GetResourcePolicyCommand = class GetResourcePolicyCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint61.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetResourcePolicy", {}).n("BedrockClient", "GetResourcePolicyCommand").sc(GetResourcePolicy$).build() {
  };
});
