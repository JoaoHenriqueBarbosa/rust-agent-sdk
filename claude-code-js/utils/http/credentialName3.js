// var: credentialName3
var credentialName3 = "WorkloadIdentityCredential", SupportedWorkloadEnvironmentVariables, logger20;
var init_workloadIdentityCredential = __esm(() => {
  init_logging();
  init_clientAssertionCredential();
  init_errors7();
  init_tenantIdUtils();
  SupportedWorkloadEnvironmentVariables = [
    "AZURE_TENANT_ID",
    "AZURE_CLIENT_ID",
    "AZURE_FEDERATED_TOKEN_FILE"
  ], logger20 = credentialLogger(credentialName3);
});
