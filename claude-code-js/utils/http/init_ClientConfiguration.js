// var: init_ClientConfiguration
var init_ClientConfiguration = __esm(() => {
  init_ICrypto();
  init_Logger();
  init_Constants();
  init_packageMetadata();
  init_AuthorityOptions();
  init_CacheManager();
  init_ProtocolMode();
  init_ClientAuthError();
  init_StubPerformanceClient();
  init_ClientAuthErrorCodes();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  DEFAULT_SYSTEM_OPTIONS = {
    tokenRenewalOffsetSeconds: DEFAULT_TOKEN_RENEWAL_OFFSET_SEC,
    preventCorsPreflight: !1
  }, DEFAULT_LOGGER_IMPLEMENTATION = {
    loggerCallback: () => {},
    piiLoggingEnabled: !1,
    logLevel: LogLevel.Info,
    correlationId: ""
  }, DEFAULT_NETWORK_IMPLEMENTATION = {
    async sendGetRequestAsync() {
      throw createClientAuthError(methodNotImplemented);
    },
    async sendPostRequestAsync() {
      throw createClientAuthError(methodNotImplemented);
    }
  }, DEFAULT_LIBRARY_INFO = {
    sku: SKU,
    version: version2,
    cpu: "",
    os: ""
  }, DEFAULT_CLIENT_CREDENTIALS = {
    clientSecret: "",
    clientAssertion: void 0
  }, DEFAULT_AZURE_CLOUD_OPTIONS = {
    azureCloudInstance: AzureCloudInstance.None,
    tenant: `${DEFAULT_COMMON_TENANT}`
  }, DEFAULT_TELEMETRY_OPTIONS = {
    application: {
      appName: "",
      appVersion: ""
    }
  };
});
