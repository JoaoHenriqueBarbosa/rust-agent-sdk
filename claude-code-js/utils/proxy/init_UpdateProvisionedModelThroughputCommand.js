// var: init_UpdateProvisionedModelThroughputCommand
var init_UpdateProvisionedModelThroughputCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint102 = __toESM(require_dist_cjs65(), 1);
  UpdateProvisionedModelThroughputCommand = class UpdateProvisionedModelThroughputCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint102.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "UpdateProvisionedModelThroughput", {}).n("BedrockClient", "UpdateProvisionedModelThroughputCommand").sc(UpdateProvisionedModelThroughput$).build() {
  };
});
