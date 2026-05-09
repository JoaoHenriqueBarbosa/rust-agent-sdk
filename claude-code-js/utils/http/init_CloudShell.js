// var: init_CloudShell
var init_CloudShell = __esm(() => {
  init_ManagedIdentityRequestParameters();
  init_BaseManagedIdentitySource();
  init_Constants2();
  init_ManagedIdentityError();
  init_ManagedIdentityErrorCodes();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  CloudShell = class CloudShell extends BaseManagedIdentitySource {
    constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, msiEndpoint) {
      super(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries);
      this.msiEndpoint = msiEndpoint;
    }
    static getEnvironmentVariables() {
      return [process.env[ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT]];
    }
    static tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, managedIdentityId) {
      let [msiEndpoint] = CloudShell.getEnvironmentVariables();
      if (!msiEndpoint)
        return logger10.info(`[Managed Identity] ${ManagedIdentitySourceNames.CLOUD_SHELL} managed identity is unavailable because the '${ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT} environment variable is not defined.`, ""), null;
      let validatedMsiEndpoint = CloudShell.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT, msiEndpoint, ManagedIdentitySourceNames.CLOUD_SHELL, logger10);
      if (logger10.info(`[Managed Identity] Environment variable validation passed for ${ManagedIdentitySourceNames.CLOUD_SHELL} managed identity. Endpoint URI: ${validatedMsiEndpoint}. Creating ${ManagedIdentitySourceNames.CLOUD_SHELL} managed identity.`, ""), managedIdentityId.idType !== ManagedIdentityIdType.SYSTEM_ASSIGNED)
        throw createManagedIdentityError(unableToCreateCloudShell);
      return new CloudShell(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, msiEndpoint);
    }
    createRequest(resource) {
      let request2 = new ManagedIdentityRequestParameters(HttpMethod2.POST, this.msiEndpoint);
      return request2.headers[ManagedIdentityHeaders.METADATA_HEADER_NAME] = "true", request2.bodyParameters[ManagedIdentityQueryParameters.RESOURCE] = resource, request2;
    }
  };
});
