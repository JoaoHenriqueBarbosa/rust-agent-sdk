// var: init_DeleteProvisionedModelThroughputCommand
var init_DeleteProvisionedModelThroughputCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint34 = __toESM(require_dist_cjs65(), 1);
  DeleteProvisionedModelThroughputCommand = class DeleteProvisionedModelThroughputCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint34.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteProvisionedModelThroughput", {}).n("BedrockClient", "DeleteProvisionedModelThroughputCommand").sc(DeleteProvisionedModelThroughput$).build() {
  };
});
