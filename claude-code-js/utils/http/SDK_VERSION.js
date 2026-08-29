// var: SDK_VERSION
var SDK_VERSION = "4.13.1", DeveloperSignOnClientId = "04b07795-8ddb-461a-bbee-02f9e1bf7b46", DefaultTenantId = "common", AzureAuthorityHosts, DefaultAuthorityHost, DefaultAuthority = "login.microsoftonline.com", ALL_TENANTS, CACHE_CAE_SUFFIX = "cae", CACHE_NON_CAE_SUFFIX = "nocae", DEFAULT_TOKEN_CACHE_NAME = "msal.cache";
var init_constants7 = __esm(() => {
  (function(AzureAuthorityHosts2) {
    AzureAuthorityHosts2.AzureChina = "https://login.chinacloudapi.cn", AzureAuthorityHosts2.AzureGermany = "https://login.microsoftonline.de", AzureAuthorityHosts2.AzureGovernment = "https://login.microsoftonline.us", AzureAuthorityHosts2.AzurePublicCloud = "https://login.microsoftonline.com";
  })(AzureAuthorityHosts || (AzureAuthorityHosts = {}));
  DefaultAuthorityHost = AzureAuthorityHosts.AzurePublicCloud, ALL_TENANTS = ["*"];
});
