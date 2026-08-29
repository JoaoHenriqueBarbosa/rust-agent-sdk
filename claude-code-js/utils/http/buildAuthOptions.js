// function: buildAuthOptions
function buildAuthOptions(authOptions) {
  return {
    clientCapabilities: [],
    azureCloudOptions: DEFAULT_AZURE_CLOUD_OPTIONS,
    instanceAware: !1,
    isMcp: !1,
    ...authOptions
  };
}
