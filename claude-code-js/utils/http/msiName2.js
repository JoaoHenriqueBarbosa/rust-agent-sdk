// var: msiName2
var msiName2 = "ManagedIdentityCredential - Token Exchange", logger21, tokenExchangeMsi;
var init_tokenExchangeMsi = __esm(() => {
  init_workloadIdentityCredential();
  init_logging();
  logger21 = credentialLogger(msiName2), tokenExchangeMsi = {
    name: "tokenExchangeMsi",
    async isAvailable(clientId) {
      let env5 = process.env, result = Boolean((clientId || env5.AZURE_CLIENT_ID) && env5.AZURE_TENANT_ID && process.env.AZURE_FEDERATED_TOKEN_FILE);
      if (!result)
        logger21.info(`${msiName2}: Unavailable. The environment variables needed are: AZURE_CLIENT_ID (or the client ID sent through the parameters), AZURE_TENANT_ID and AZURE_FEDERATED_TOKEN_FILE`);
      return result;
    },
    async getToken(configuration, getTokenOptions = {}) {
      let { scopes, clientId } = configuration, identityClientTokenCredentialOptions = {};
      return new WorkloadIdentityCredential({
        clientId,
        tenantId: process.env.AZURE_TENANT_ID,
        tokenFilePath: process.env.AZURE_FEDERATED_TOKEN_FILE,
        ...identityClientTokenCredentialOptions,
        disableInstanceDiscovery: !0
      }).getToken(scopes, getTokenOptions);
    }
  };
});
