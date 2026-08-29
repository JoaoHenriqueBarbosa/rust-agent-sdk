// var: init_ListProvisionedModelThroughputsCommand
var init_ListProvisionedModelThroughputsCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint82 = __toESM(require_dist_cjs65(), 1);
  ListProvisionedModelThroughputsCommand = class ListProvisionedModelThroughputsCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint82.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListProvisionedModelThroughputs", {}).n("BedrockClient", "ListProvisionedModelThroughputsCommand").sc(ListProvisionedModelThroughputs$).build() {
  };
});
