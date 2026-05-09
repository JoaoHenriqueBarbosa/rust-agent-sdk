// var: init_CreateMarketplaceModelEndpointCommand
var init_CreateMarketplaceModelEndpointCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint14 = __toESM(require_dist_cjs65(), 1);
  CreateMarketplaceModelEndpointCommand = class CreateMarketplaceModelEndpointCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint14.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "CreateMarketplaceModelEndpoint", {}).n("BedrockClient", "CreateMarketplaceModelEndpointCommand").sc(CreateMarketplaceModelEndpoint$).build() {
  };
});
