// var: IMDS_TOKEN_PATH2
var IMDS_TOKEN_PATH2 = "/metadata/identity/oauth2/token", DEFAULT_IMDS_ENDPOINT, IMDS_API_VERSION = "2018-02-01", Imds;
var init_Imds = __esm(() => {
  init_ManagedIdentityRequestParameters();
  init_BaseManagedIdentitySource();
  init_Constants2();
  init_ImdsRetryPolicy();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  DEFAULT_IMDS_ENDPOINT = `http://169.254.169.254${IMDS_TOKEN_PATH2}`;
  Imds = class Imds extends BaseManagedIdentitySource {
    constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, identityEndpoint) {
      super(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries);
      this.identityEndpoint = identityEndpoint;
    }
    static tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries) {
      let validatedIdentityEndpoint;
      if (process.env[ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST])
        logger10.info(`[Managed Identity] Environment variable ${ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST} for ${ManagedIdentitySourceNames.IMDS} returned endpoint: ${process.env[ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST]}`, ""), validatedIdentityEndpoint = Imds.getValidatedEnvVariableUrlString(ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST, `${process.env[ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST]}${IMDS_TOKEN_PATH2}`, ManagedIdentitySourceNames.IMDS, logger10);
      else
        logger10.info(`[Managed Identity] Unable to find ${ManagedIdentityEnvironmentVariableNames.AZURE_POD_IDENTITY_AUTHORITY_HOST} environment variable for ${ManagedIdentitySourceNames.IMDS}, using the default endpoint.`, ""), validatedIdentityEndpoint = DEFAULT_IMDS_ENDPOINT;
      return new Imds(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, validatedIdentityEndpoint);
    }
    createRequest(resource, managedIdentityId) {
      let request2 = new ManagedIdentityRequestParameters(HttpMethod2.GET, this.identityEndpoint);
      if (request2.headers[ManagedIdentityHeaders.METADATA_HEADER_NAME] = "true", request2.queryParameters[ManagedIdentityQueryParameters.API_VERSION] = IMDS_API_VERSION, request2.queryParameters[ManagedIdentityQueryParameters.RESOURCE] = resource, managedIdentityId.idType !== ManagedIdentityIdType.SYSTEM_ASSIGNED)
        request2.queryParameters[this.getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityId.idType, !0)] = managedIdentityId.id;
      return request2.retryPolicy = new ImdsRetryPolicy, request2;
    }
  };
});
