// var: MACHINE_LEARNING_MSI_API_VERSION
var MACHINE_LEARNING_MSI_API_VERSION = "2017-09-01", MANAGED_IDENTITY_MACHINE_LEARNING_UNSUPPORTED_ID_TYPE_ERROR, MachineLearning;
var init_MachineLearning = __esm(() => {
  init_BaseManagedIdentitySource();
  init_Constants2();
  init_ManagedIdentityRequestParameters();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  MANAGED_IDENTITY_MACHINE_LEARNING_UNSUPPORTED_ID_TYPE_ERROR = `Only client id is supported for user-assigned managed identity in ${ManagedIdentitySourceNames.MACHINE_LEARNING}.`;
  MachineLearning = class MachineLearning extends BaseManagedIdentitySource {
    constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, msiEndpoint, secret) {
      super(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries);
      this.msiEndpoint = msiEndpoint, this.secret = secret;
    }
    static getEnvironmentVariables() {
      let msiEndpoint = process.env[ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT], secret = process.env[ManagedIdentityEnvironmentVariableNames.MSI_SECRET];
      return [msiEndpoint, secret];
    }
    static tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries) {
      let [msiEndpoint, secret] = MachineLearning.getEnvironmentVariables();
      if (!msiEndpoint || !secret)
        return logger10.info(`[Managed Identity] ${ManagedIdentitySourceNames.MACHINE_LEARNING} managed identity is unavailable because one or both of the '${ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT}' and '${ManagedIdentityEnvironmentVariableNames.MSI_SECRET}' environment variables are not defined.`, ""), null;
      let validatedMsiEndpoint = MachineLearning.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.MSI_ENDPOINT, msiEndpoint, ManagedIdentitySourceNames.MACHINE_LEARNING, logger10);
      return logger10.info(`[Managed Identity] Environment variables validation passed for ${ManagedIdentitySourceNames.MACHINE_LEARNING} managed identity. Endpoint URI: ${validatedMsiEndpoint}. Creating ${ManagedIdentitySourceNames.MACHINE_LEARNING} managed identity.`, ""), new MachineLearning(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, msiEndpoint, secret);
    }
    createRequest(resource, managedIdentityId) {
      let request2 = new ManagedIdentityRequestParameters(HttpMethod2.GET, this.msiEndpoint);
      if (request2.headers[ManagedIdentityHeaders.METADATA_HEADER_NAME] = "true", request2.headers[ManagedIdentityHeaders.ML_AND_SF_SECRET_HEADER_NAME] = this.secret, request2.queryParameters[ManagedIdentityQueryParameters.API_VERSION] = MACHINE_LEARNING_MSI_API_VERSION, request2.queryParameters[ManagedIdentityQueryParameters.RESOURCE] = resource, managedIdentityId.idType === ManagedIdentityIdType.SYSTEM_ASSIGNED)
        request2.queryParameters[ManagedIdentityUserAssignedIdQueryParameterNames.MANAGED_IDENTITY_CLIENT_ID_2017] = process.env[ManagedIdentityEnvironmentVariableNames.DEFAULT_IDENTITY_CLIENT_ID];
      else if (managedIdentityId.idType === ManagedIdentityIdType.USER_ASSIGNED_CLIENT_ID)
        request2.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityId.idType, !1, !0)] = managedIdentityId.id;
      else
        throw Error(MANAGED_IDENTITY_MACHINE_LEARNING_UNSUPPORTED_ID_TYPE_ERROR);
      return request2;
    }
  };
});
