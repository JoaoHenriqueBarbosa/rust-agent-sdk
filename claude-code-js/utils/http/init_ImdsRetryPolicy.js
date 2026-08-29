// var: init_ImdsRetryPolicy
var init_ImdsRetryPolicy = __esm(() => {
  init_index_node();
  init_ExponentialRetryStrategy();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  HTTP_STATUS_400_CODES_FOR_EXPONENTIAL_STRATEGY = [
    exports_Constants.HTTP_NOT_FOUND,
    exports_Constants.HTTP_REQUEST_TIMEOUT,
    exports_Constants.HTTP_GONE,
    exports_Constants.HTTP_TOO_MANY_REQUESTS
  ];
});
