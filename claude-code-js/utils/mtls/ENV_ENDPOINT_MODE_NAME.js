// var: ENV_ENDPOINT_MODE_NAME
var ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE", CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode", ENDPOINT_MODE_CONFIG_OPTIONS;
var init_EndpointModeConfigOptions = __esm(() => {
  init_EndpointMode();
  ENDPOINT_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env4) => env4[ENV_ENDPOINT_MODE_NAME],
    configFileSelector: (profile) => profile[CONFIG_ENDPOINT_MODE_NAME],
    default: EndpointMode.IPv4
  };
});
