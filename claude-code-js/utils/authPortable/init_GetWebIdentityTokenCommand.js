// var: init_GetWebIdentityTokenCommand
var init_GetWebIdentityTokenCommand = __esm(() => {
  init_dist_es41();
  init_EndpointParameters3();
  init_schemas_03();
  import_middleware_endpoint125 = __toESM(require_dist_cjs65(), 1);
  GetWebIdentityTokenCommand = class GetWebIdentityTokenCommand extends Command4.classBuilder().ep(commonParams3).m(function(Command5, cs, config6, o5) {
    return [import_middleware_endpoint125.getEndpointPlugin(config6, Command5.getEndpointParameterInstructions())];
  }).s("AWSSecurityTokenServiceV20110615", "GetWebIdentityToken", {}).n("STSClient", "GetWebIdentityTokenCommand").sc(GetWebIdentityToken$).build() {
  };
});
