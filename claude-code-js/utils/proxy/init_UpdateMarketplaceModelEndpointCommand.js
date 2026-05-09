// var: init_UpdateMarketplaceModelEndpointCommand
var init_UpdateMarketplaceModelEndpointCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint101 = __toESM(require_dist_cjs65(), 1);
  UpdateMarketplaceModelEndpointCommand = class UpdateMarketplaceModelEndpointCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint101.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "UpdateMarketplaceModelEndpoint", {}).n("BedrockClient", "UpdateMarketplaceModelEndpointCommand").sc(UpdateMarketplaceModelEndpoint$).build() {
  };
});
