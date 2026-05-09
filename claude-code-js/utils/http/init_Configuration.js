// var: init_Configuration
var init_Configuration = __esm(() => {
  init_index_node();
  init_HttpClient();
  init_ManagedIdentityId();
  init_NodeAuthError();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  DEFAULT_AUTH_OPTIONS = {
    clientId: "",
    authority: exports_Constants.DEFAULT_AUTHORITY,
    clientSecret: "",
    clientAssertion: "",
    clientCertificate: {
      thumbprint: "",
      thumbprintSha256: "",
      privateKey: "",
      x5c: ""
    },
    knownAuthorities: [],
    cloudDiscoveryMetadata: "",
    authorityMetadata: "",
    clientCapabilities: [],
    azureCloudOptions: {
      azureCloudInstance: AzureCloudInstance.None,
      tenant: ""
    },
    isMcp: !1
  }, DEFAULT_LOGGER_OPTIONS = {
    loggerCallback: () => {},
    piiLoggingEnabled: !1,
    logLevel: LogLevel.Info
  }, DEFAULT_SYSTEM_OPTIONS2 = {
    loggerOptions: DEFAULT_LOGGER_OPTIONS,
    networkClient: new HttpClient,
    disableInternalRetries: !1,
    protocolMode: ProtocolMode.AAD
  }, DEFAULT_TELEMETRY_OPTIONS2 = {
    application: {
      appName: "",
      appVersion: ""
    }
  };
});
