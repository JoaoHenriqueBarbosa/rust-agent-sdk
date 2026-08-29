// var: credentialName
var credentialName = "ClientCertificateCredential", logger14;
var init_clientCertificateCredential = __esm(() => {
  init_msalClient();
  init_tenantIdUtils();
  init_logging();
  init_tracing();
  logger14 = credentialLogger(credentialName);
});
