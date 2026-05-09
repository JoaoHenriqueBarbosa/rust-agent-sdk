// var: init_GetAccessKeyInfoCommand
var init_GetAccessKeyInfoCommand = __esm(() => {
  init_dist_es41();
  init_EndpointParameters3();
  init_schemas_03();
  import_middleware_endpoint120 = __toESM(require_dist_cjs65(), 1);
  GetAccessKeyInfoCommand = class GetAccessKeyInfoCommand extends Command4.classBuilder().ep(commonParams3).m(function(Command5, cs, config6, o5) {
    return [import_middleware_endpoint120.getEndpointPlugin(config6, Command5.getEndpointParameterInstructions())];
  }).s("AWSSecurityTokenServiceV20110615", "GetAccessKeyInfo", {}).n("STSClient", "GetAccessKeyInfoCommand").sc(GetAccessKeyInfo$).build() {
  };
});
