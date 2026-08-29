// var: init_AssumeRootCommand
var init_AssumeRootCommand = __esm(() => {
  init_dist_es41();
  init_EndpointParameters3();
  init_schemas_03();
  import_middleware_endpoint118 = __toESM(require_dist_cjs65(), 1);
  AssumeRootCommand = class AssumeRootCommand extends Command4.classBuilder().ep(commonParams3).m(function(Command5, cs, config6, o5) {
    return [import_middleware_endpoint118.getEndpointPlugin(config6, Command5.getEndpointParameterInstructions())];
  }).s("AWSSecurityTokenServiceV20110615", "AssumeRoot", {}).n("STSClient", "AssumeRootCommand").sc(AssumeRoot$).build() {
  };
});
