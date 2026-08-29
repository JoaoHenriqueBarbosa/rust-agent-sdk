// var: init_ListFoundationModelAgreementOffersCommand
var init_ListFoundationModelAgreementOffersCommand = __esm(() => {
  init_dist_es16();
  init_EndpointParameters();
  init_schemas_0();
  import_middleware_endpoint71 = __toESM(require_dist_cjs65(), 1);
  ListFoundationModelAgreementOffersCommand = class ListFoundationModelAgreementOffersCommand extends Command2.classBuilder().ep(commonParams).m(function(Command3, cs, config4, o3) {
    return [import_middleware_endpoint71.getEndpointPlugin(config4, Command3.getEndpointParameterInstructions())];
  }).s("AmazonBedrockControlPlaneService", "ListFoundationModelAgreementOffers", {}).n("BedrockClient", "ListFoundationModelAgreementOffersCommand").sc(ListFoundationModelAgreementOffers$).build() {
  };
});
