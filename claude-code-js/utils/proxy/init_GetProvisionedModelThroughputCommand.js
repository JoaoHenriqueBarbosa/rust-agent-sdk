// var: init_GetProvisionedModelThroughputCommand
var init_GetProvisionedModelThroughputCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint60 = __toESM(require_dist_cjs65(), 1);
  GetProvisionedModelThroughputCommand = class GetProvisionedModelThroughputCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint60.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetProvisionedModelThroughput", {}).n("BedrockClient", "GetProvisionedModelThroughputCommand").sc(GetProvisionedModelThroughput$).build() {
  };
});
