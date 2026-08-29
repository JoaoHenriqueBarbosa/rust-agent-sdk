// var: init_defaultAzureCredential
var init_defaultAzureCredential = __esm(() => {
  init_chainedTokenCredential();
  init_logging();
  init_defaultAzureCredentialFunctions();
  logger28 = credentialLogger("DefaultAzureCredential");
  DefaultAzureCredential = class DefaultAzureCredential extends ChainedTokenCredential {
    constructor(options) {
      validateRequiredEnvVars(options);
      let azureTokenCredentials = process.env.AZURE_TOKEN_CREDENTIALS ? process.env.AZURE_TOKEN_CREDENTIALS.trim().toLowerCase() : void 0, devCredentialFunctions = [
        createDefaultVisualStudioCodeCredential,
        createDefaultAzureCliCredential,
        createDefaultAzurePowershellCredential,
        createDefaultAzureDeveloperCliCredential,
        createDefaultBrokerCredential
      ], prodCredentialFunctions = [
        createDefaultEnvironmentCredential,
        createDefaultWorkloadIdentityCredential,
        createDefaultManagedIdentityCredential
      ], credentialFunctions = [], validCredentialNames = "EnvironmentCredential, WorkloadIdentityCredential, ManagedIdentityCredential, VisualStudioCodeCredential, AzureCliCredential, AzurePowerShellCredential, AzureDeveloperCliCredential";
      if (azureTokenCredentials)
        switch (azureTokenCredentials) {
          case "dev":
            credentialFunctions = devCredentialFunctions;
            break;
          case "prod":
            credentialFunctions = prodCredentialFunctions;
            break;
          case "environmentcredential":
            credentialFunctions = [createDefaultEnvironmentCredential];
            break;
          case "workloadidentitycredential":
            credentialFunctions = [createDefaultWorkloadIdentityCredential];
            break;
          case "managedidentitycredential":
            credentialFunctions = [
              () => createDefaultManagedIdentityCredential({ sendProbeRequest: !1 })
            ];
            break;
          case "visualstudiocodecredential":
            credentialFunctions = [createDefaultVisualStudioCodeCredential];
            break;
          case "azureclicredential":
            credentialFunctions = [createDefaultAzureCliCredential];
            break;
          case "azurepowershellcredential":
            credentialFunctions = [createDefaultAzurePowershellCredential];
            break;
          case "azuredeveloperclicredential":
            credentialFunctions = [createDefaultAzureDeveloperCliCredential];
            break;
          default: {
            let errorMessage2 = `Invalid value for AZURE_TOKEN_CREDENTIALS = ${process.env.AZURE_TOKEN_CREDENTIALS}. Valid values are 'prod' or 'dev' or any of these credentials - ${validCredentialNames}.`;
            throw logger28.warning(errorMessage2), Error(errorMessage2);
          }
        }
      else
        credentialFunctions = [...prodCredentialFunctions, ...devCredentialFunctions];
      let credentials = credentialFunctions.map((createCredentialFn) => {
        try {
          return createCredentialFn(options ?? {});
        } catch (err) {
          return logger28.warning(`Skipped ${createCredentialFn.name} because of an error creating the credential: ${err}`), new UnavailableDefaultCredential(createCredentialFn.name, err.message);
        }
      });
      super(...credentials);
    }
  };
});
