// function: createDefaultWorkloadIdentityCredential
function createDefaultWorkloadIdentityCredential(options) {
  let managedIdentityClientId = options?.managedIdentityClientId ?? process.env.AZURE_CLIENT_ID, workloadIdentityClientId = options?.workloadIdentityClientId ?? managedIdentityClientId, workloadFile = process.env.AZURE_FEDERATED_TOKEN_FILE, tenantId = options?.tenantId ?? process.env.AZURE_TENANT_ID;
  if (workloadFile && workloadIdentityClientId) {
    let workloadIdentityCredentialOptions = {
      ...options,
      tenantId,
      clientId: workloadIdentityClientId,
      tokenFilePath: workloadFile
    };
    return new WorkloadIdentityCredential(workloadIdentityCredentialOptions);
  }
  if (tenantId) {
    let workloadIdentityClientTenantOptions = {
      ...options,
      tenantId
    };
    return new WorkloadIdentityCredential(workloadIdentityClientTenantOptions);
  }
  return new WorkloadIdentityCredential(options);
}
