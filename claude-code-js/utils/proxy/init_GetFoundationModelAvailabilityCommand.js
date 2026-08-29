// var: init_GetFoundationModelAvailabilityCommand
var init_GetFoundationModelAvailabilityCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint48 = __toESM(require_dist_cjs65(), 1);
  GetFoundationModelAvailabilityCommand = class GetFoundationModelAvailabilityCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint48.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetFoundationModelAvailability", {}).n("BedrockClient", "GetFoundationModelAvailabilityCommand").sc(GetFoundationModelAvailability$).build() {
  };
});
