// var: APP_SERVICE_MSI_API_VERSION
var APP_SERVICE_MSI_API_VERSION = "2019-08-01", AppService;
var init_AppService = __esm(() => {
  init_BaseManagedIdentitySource();
  init_Constants2();
  init_ManagedIdentityRequestParameters();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  AppService = class AppService extends BaseManagedIdentitySource {
    constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, identityEndpoint, identityHeader) {
      super(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries);
      this.identityEndpoint = identityEndpoint, this.identityHeader = identityHeader;
    }
    static getEnvironmentVariables() {
      let identityEndpoint = process.env[ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT], identityHeader = process.env[ManagedIdentityEnvironmentVariableNames.IDENTITY_HEADER];
      return [identityEndpoint, identityHeader];
    }
    static tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries) {
      let [identityEndpoint, identityHeader] = AppService.getEnvironmentVariables();
      if (!identityEndpoint || !identityHeader)
        return logger10.info(`[Managed Identity] ${ManagedIdentitySourceNames.APP_SERVICE} managed identity is unavailable because one or both of the '${ManagedIdentityEnvironmentVariableNames.IDENTITY_HEADER}' and '${ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT}' environment variables are not defined.`, ""), null;
      let validatedIdentityEndpoint = AppService.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT, identityEndpoint, ManagedIdentitySourceNames.APP_SERVICE, logger10);
      return logger10.info(`[Managed Identity] Environment variables validation passed for ${ManagedIdentitySourceNames.APP_SERVICE} managed identity. Endpoint URI: ${validatedIdentityEndpoint}. Creating ${ManagedIdentitySourceNames.APP_SERVICE} managed identity.`, ""), new AppService(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, identityEndpoint, identityHeader);
    }
    createRequest(resource, managedIdentityId) {
      let request2 = new ManagedIdentityRequestParameters(HttpMethod2.GET, this.identityEndpoint);
      if (request2.headers[ManagedIdentityHeaders.APP_SERVICE_SECRET_HEADER_NAME] = this.identityHeader, request2.queryParameters[ManagedIdentityQueryParameters.API_VERSION] = APP_SERVICE_MSI_API_VERSION, request2.queryParameters[ManagedIdentityQueryParameters.RESOURCE] = resource, managedIdentityId.idType !== ManagedIdentityIdType.SYSTEM_ASSIGNED)
        request2.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityId.idType)] = managedIdentityId.id;
      return request2;
    }
  };
});
