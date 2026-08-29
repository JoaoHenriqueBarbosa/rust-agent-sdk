// var: init_environmentCredential
var init_environmentCredential = __esm(() => {
  init_errors7();
  init_logging();
  init_clientCertificateCredential();
  init_clientSecretCredential();
  init_usernamePasswordCredential();
  init_tenantIdUtils();
  init_tracing();
  AllSupportedEnvironmentVariables = [
    "AZURE_TENANT_ID",
    "AZURE_CLIENT_ID",
    "AZURE_CLIENT_SECRET",
    "AZURE_CLIENT_CERTIFICATE_PATH",
    "AZURE_CLIENT_CERTIFICATE_PASSWORD",
    "AZURE_USERNAME",
    "AZURE_PASSWORD",
    "AZURE_ADDITIONALLY_ALLOWED_TENANTS",
    "AZURE_CLIENT_SEND_CERTIFICATE_CHAIN"
  ];
  logger17 = credentialLogger(credentialName2);
});
