// var: DEFAULT_MANAGED_IDENTITY_MAX_RETRIES
var DEFAULT_MANAGED_IDENTITY_MAX_RETRIES = 3, DEFAULT_MANAGED_IDENTITY_RETRY_DELAY_MS = 1000, DEFAULT_MANAGED_IDENTITY_HTTP_STATUS_CODES_TO_RETRY_ON;
var init_DefaultManagedIdentityRetryPolicy = __esm(() => {
  init_index_node();
  init_LinearRetryStrategy();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  DEFAULT_MANAGED_IDENTITY_HTTP_STATUS_CODES_TO_RETRY_ON = [
    exports_Constants.HTTP_NOT_FOUND,
    exports_Constants.HTTP_REQUEST_TIMEOUT,
    exports_Constants.HTTP_TOO_MANY_REQUESTS,
    exports_Constants.HTTP_SERVER_ERROR,
    exports_Constants.HTTP_SERVICE_UNAVAILABLE,
    exports_Constants.HTTP_GATEWAY_TIMEOUT
  ];
});
