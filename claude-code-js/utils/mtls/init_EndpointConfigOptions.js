// var: init_EndpointConfigOptions
var init_EndpointConfigOptions = __esm(() => {
  ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => env4.AWS_EC2_METADATA_SERVICE_ENDPOINT,
    configFileSelector: (profile) => profile.ec2_metadata_service_endpoint,
    default: void 0
  };
});
