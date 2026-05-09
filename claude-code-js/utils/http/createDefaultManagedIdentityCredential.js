// function: createDefaultManagedIdentityCredential
function createDefaultManagedIdentityCredential(options = {}) {
  options.retryOptions ??= {
    maxRetries: 5,
    retryDelayInMs: 800
  }, options.sendProbeRequest ??= !0;
  let managedIdentityClientId = options?.managedIdentityClientId ?? process.env.AZURE_CLIENT_ID, workloadIdentityClientId = options?.workloadIdentityClientId ?? managedIdentityClientId, managedResourceId = options?.managedIdentityResourceId, workloadFile = process.env.AZURE_FEDERATED_TOKEN_FILE, tenantId = options?.tenantId ?? process.env.AZURE_TENANT_ID;
  if (managedResourceId) {
    let managedIdentityResourceIdOptions = {
      ...options,
      resourceId: managedResourceId
    };
    return new ManagedIdentityCredential(managedIdentityResourceIdOptions);
  }
  if (workloadFile && workloadIdentityClientId) {
    let workloadIdentityCredentialOptions = {
      ...options,
      tenantId
    };
    return new ManagedIdentityCredential(workloadIdentityClientId, workloadIdentityCredentialOptions);
  }
  if (managedIdentityClientId) {
    let managedIdentityClientOptions = {
      ...options,
      clientId: managedIdentityClientId
    };
    return new ManagedIdentityCredential(managedIdentityClientOptions);
  }
  return new ManagedIdentityCredential(options);
}
