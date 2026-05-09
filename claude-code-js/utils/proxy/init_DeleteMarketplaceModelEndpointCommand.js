// var: init_DeleteMarketplaceModelEndpointCommand
var init_DeleteMarketplaceModelEndpointCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint31 = __toESM(require_dist_cjs65(), 1);
  DeleteMarketplaceModelEndpointCommand = class DeleteMarketplaceModelEndpointCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint31.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "DeleteMarketplaceModelEndpoint", {}).n("BedrockClient", "DeleteMarketplaceModelEndpointCommand").sc(DeleteMarketplaceModelEndpoint$).build() {
  };
});
