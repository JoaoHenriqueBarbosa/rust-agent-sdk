// class: WorkloadIdentityCredential
class WorkloadIdentityCredential {
  client;
  azureFederatedTokenFileContent = void 0;
  cacheDate = void 0;
  federatedTokenFilePath;
  constructor(options) {
    let assignedEnv = processEnvVars(SupportedWorkloadEnvironmentVariables).assigned.join(", ");
    logger20.info(`Found the following environment variables: ${assignedEnv}`);
    let workloadIdentityCredentialOptions = options ?? {}, tenantId = workloadIdentityCredentialOptions.tenantId || process.env.AZURE_TENANT_ID, clientId = workloadIdentityCredentialOptions.clientId || process.env.AZURE_CLIENT_ID;
    if (this.federatedTokenFilePath = workloadIdentityCredentialOptions.tokenFilePath || process.env.AZURE_FEDERATED_TOKEN_FILE, tenantId)
      checkTenantId(logger20, tenantId);
    if (!clientId)
      throw new CredentialUnavailableError(`${credentialName3}: is unavailable. clientId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_CLIENT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!tenantId)
      throw new CredentialUnavailableError(`${credentialName3}: is unavailable. tenantId is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_TENANT_ID".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    if (!this.federatedTokenFilePath)
      throw new CredentialUnavailableError(`${credentialName3}: is unavailable. federatedTokenFilePath is a required parameter. In DefaultAzureCredential and ManagedIdentityCredential, this can be provided as an environment variable - "AZURE_FEDERATED_TOKEN_FILE".
        See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`);
    logger20.info(`Invoking ClientAssertionCredential with tenant ID: ${tenantId}, clientId: ${workloadIdentityCredentialOptions.clientId} and federated token path: [REDACTED]`), this.client = new ClientAssertionCredential(tenantId, clientId, this.readFileContents.bind(this), options);
  }
  async getToken(scopes, options) {
    if (!this.client) {
      let errorMessage2 = `${credentialName3}: is unavailable. tenantId, clientId, and federatedTokenFilePath are required parameters. 
      In DefaultAzureCredential and ManagedIdentityCredential, these can be provided as environment variables - 
      "AZURE_TENANT_ID",
      "AZURE_CLIENT_ID",
      "AZURE_FEDERATED_TOKEN_FILE". See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/workloadidentitycredential/troubleshoot`;
      throw logger20.info(errorMessage2), new CredentialUnavailableError(errorMessage2);
    }
    return logger20.info("Invoking getToken() of Client Assertion Credential"), this.client.getToken(scopes, options);
  }
  async readFileContents() {
    if (this.cacheDate !== void 0 && Date.now() - this.cacheDate >= 300000)
      this.azureFederatedTokenFileContent = void 0;
    if (!this.federatedTokenFilePath)
      throw new CredentialUnavailableError(`${credentialName3}: is unavailable. Invalid file path provided ${this.federatedTokenFilePath}.`);
    if (!this.azureFederatedTokenFileContent) {
      let value = (await readFile8(this.federatedTokenFilePath, "utf8")).trim();
      if (!value)
        throw new CredentialUnavailableError(`${credentialName3}: is unavailable. No content on the file ${this.federatedTokenFilePath}.`);
      else
        this.azureFederatedTokenFileContent = value, this.cacheDate = Date.now();
    }
    return this.azureFederatedTokenFileContent;
  }
}
