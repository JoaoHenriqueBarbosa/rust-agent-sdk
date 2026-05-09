// var: SERVICE_FABRIC_MSI_API_VERSION
var SERVICE_FABRIC_MSI_API_VERSION = "2019-07-01-preview", ServiceFabric;
var init_ServiceFabric = __esm(() => {
  init_ManagedIdentityRequestParameters();
  init_BaseManagedIdentitySource();
  init_Constants2();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  ServiceFabric = class ServiceFabric extends BaseManagedIdentitySource {
    constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, identityEndpoint, identityHeader) {
      super(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries);
      this.identityEndpoint = identityEndpoint, this.identityHeader = identityHeader;
    }
    static getEnvironmentVariables() {
      let identityEndpoint = process.env[ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT], identityHeader = process.env[ManagedIdentityEnvironmentVariableNames.IDENTITY_HEADER], identityServerThumbprint = process.env[ManagedIdentityEnvironmentVariableNames.IDENTITY_SERVER_THUMBPRINT];
      return [identityEndpoint, identityHeader, identityServerThumbprint];
    }
    static tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, managedIdentityId) {
      let [identityEndpoint, identityHeader, identityServerThumbprint] = ServiceFabric.getEnvironmentVariables();
      if (!identityEndpoint || !identityHeader || !identityServerThumbprint)
        return logger10.info(`[Managed Identity] ${ManagedIdentitySourceNames.SERVICE_FABRIC} managed identity is unavailable because one or all of the '${ManagedIdentityEnvironmentVariableNames.IDENTITY_HEADER}', '${ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT}' or '${ManagedIdentityEnvironmentVariableNames.IDENTITY_SERVER_THUMBPRINT}' environment variables are not defined.`, ""), null;
      let validatedIdentityEndpoint = ServiceFabric.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.IDENTITY_ENDPOINT, identityEndpoint, ManagedIdentitySourceNames.SERVICE_FABRIC, logger10);
      if (logger10.info(`[Managed Identity] Environment variables validation passed for ${ManagedIdentitySourceNames.SERVICE_FABRIC} managed identity. Endpoint URI: ${validatedIdentityEndpoint}. Creating ${ManagedIdentitySourceNames.SERVICE_FABRIC} managed identity.`, ""), managedIdentityId.idType !== ManagedIdentityIdType.SYSTEM_ASSIGNED)
        logger10.warning(`[Managed Identity] ${ManagedIdentitySourceNames.SERVICE_FABRIC} user assigned managed identity is configured in the cluster, not during runtime. See also: https://learn.microsoft.com/en-us/azure/service-fabric/configure-existing-cluster-enable-managed-identity-token-service.`, "");
      return new ServiceFabric(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, identityEndpoint, identityHeader);
    }
    createRequest(resource, managedIdentityId) {
      let request2 = new ManagedIdentityRequestParameters(HttpMethod2.GET, this.identityEndpoint);
      if (request2.headers[ManagedIdentityHeaders.ML_AND_SF_SECRET_HEADER_NAME] = this.identityHeader, request2.queryParameters[ManagedIdentityQueryParameters.API_VERSION] = SERVICE_FABRIC_MSI_API_VERSION, request2.queryParameters[ManagedIdentityQueryParameters.RESOURCE] = resource, managedIdentityId.idType !== ManagedIdentityIdType.SYSTEM_ASSIGNED)
        request2.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityId.idType)] = managedIdentityId.id;
      return request2;
    }
  };
});
