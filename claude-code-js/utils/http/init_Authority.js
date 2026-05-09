// var: init_Authority
var init_Authority = __esm(() => {
  init_AuthorityType();
  init_OpenIdConfigResponse();
  init_UrlString();
  init_ClientAuthError();
  init_Constants();
  init_AuthorityMetadata();
  init_ClientConfigurationError();
  init_ProtocolMode();
  init_AuthorityOptions();
  init_CloudInstanceDiscoveryResponse();
  init_CloudInstanceDiscoveryErrorResponse();
  init_RegionDiscovery();
  init_AuthError();
  init_PerformanceEvents();
  init_FunctionWrappers();
  init_CacheHelpers();
  init_ClientAuthErrorCodes();
  init_ClientConfigurationErrorCodes();
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  Authority.reservedTenantDomains = /* @__PURE__ */ new Set([
    "{tenant}",
    "{tenantid}",
    AADAuthority.COMMON,
    AADAuthority.CONSUMERS,
    AADAuthority.ORGANIZATIONS
  ]);
});
