// var: init_BaseManagedIdentitySource
var init_BaseManagedIdentitySource = __esm(() => {
  init_index_node();
  init_Constants2();
  init_ManagedIdentityError();
  init_TimeUtils2();
  init_HttpClientWithRetries();
  init_ManagedIdentityErrorCodes();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  ManagedIdentityUserAssignedIdQueryParameterNames = {
    MANAGED_IDENTITY_CLIENT_ID_2017: "clientid",
    MANAGED_IDENTITY_CLIENT_ID: "client_id",
    MANAGED_IDENTITY_OBJECT_ID: "object_id",
    MANAGED_IDENTITY_RESOURCE_ID_IMDS: "msi_res_id",
    MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS: "mi_res_id"
  };
  BaseManagedIdentitySource.getValidatedEnvVariableUrlString = (envVariableStringName, envVariable, sourceName, logger10) => {
    try {
      return new UrlString(envVariable).urlString;
    } catch (error43) {
      throw logger10.info(`[Managed Identity] ${sourceName} managed identity is unavailable because the '${envVariableStringName}' environment variable is malformed.`, ""), createManagedIdentityError(MsiEnvironmentVariableUrlMalformedErrorCodes[envVariableStringName]);
    }
  };
});
