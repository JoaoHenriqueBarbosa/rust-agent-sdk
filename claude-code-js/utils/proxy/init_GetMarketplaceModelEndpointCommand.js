// var: init_GetMarketplaceModelEndpointCommand
var init_GetMarketplaceModelEndpointCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint53 = __toESM(require_dist_cjs65(), 1);
  GetMarketplaceModelEndpointCommand = class GetMarketplaceModelEndpointCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint53.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "GetMarketplaceModelEndpoint", {}).n("BedrockClient", "GetMarketplaceModelEndpointCommand").sc(GetMarketplaceModelEndpoint$).build() {
  };
});
