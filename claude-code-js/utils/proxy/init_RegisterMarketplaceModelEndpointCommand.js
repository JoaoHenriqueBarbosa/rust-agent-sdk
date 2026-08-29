// var: init_RegisterMarketplaceModelEndpointCommand
var init_RegisterMarketplaceModelEndpointCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint88 = __toESM(require_dist_cjs65(), 1);
  RegisterMarketplaceModelEndpointCommand = class RegisterMarketplaceModelEndpointCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint88.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "RegisterMarketplaceModelEndpoint", {}).n("BedrockClient", "RegisterMarketplaceModelEndpointCommand").sc(RegisterMarketplaceModelEndpoint$).build() {
  };
});
