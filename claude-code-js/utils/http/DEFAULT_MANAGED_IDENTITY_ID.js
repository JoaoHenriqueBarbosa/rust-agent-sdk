// var: DEFAULT_MANAGED_IDENTITY_ID
var DEFAULT_MANAGED_IDENTITY_ID = "system_assigned_managed_identity", DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY = "https://login.microsoftonline.com/managed_identity/", ManagedIdentityHeaders, ManagedIdentityQueryParameters, ManagedIdentityEnvironmentVariableNames, ManagedIdentitySourceNames, ManagedIdentityIdType, HttpMethod2, REGION_ENVIRONMENT_VARIABLE = "REGION_NAME", MSAL_FORCE_REGION = "MSAL_FORCE_REGION", RANDOM_OCTET_SIZE = 32, Hash5, CharSet, CACHE, Constants, ApiId, JwtConstants, LOOPBACK_SERVER_CONSTANTS, AZURE_ARC_SECRET_FILE_MAX_SIZE_BYTES = 4096;
var init_Constants2 = __esm(() => {
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  ManagedIdentityHeaders = {
    AUTHORIZATION_HEADER_NAME: "Authorization",
    METADATA_HEADER_NAME: "Metadata",
    APP_SERVICE_SECRET_HEADER_NAME: "X-IDENTITY-HEADER",
    ML_AND_SF_SECRET_HEADER_NAME: "secret"
  }, ManagedIdentityQueryParameters = {
    API_VERSION: "api-version",
    RESOURCE: "resource",
    SHA256_TOKEN_TO_REFRESH: "token_sha256_to_refresh",
    XMS_CC: "xms_cc"
  }, ManagedIdentityEnvironmentVariableNames = {
    AZURE_POD_IDENTITY_AUTHORITY_HOST: "AZURE_POD_IDENTITY_AUTHORITY_HOST",
    DEFAULT_IDENTITY_CLIENT_ID: "DEFAULT_IDENTITY_CLIENT_ID",
    IDENTITY_ENDPOINT: "IDENTITY_ENDPOINT",
    IDENTITY_HEADER: "IDENTITY_HEADER",
    IDENTITY_SERVER_THUMBPRINT: "IDENTITY_SERVER_THUMBPRINT",
    IMDS_ENDPOINT: "IMDS_ENDPOINT",
    MSI_ENDPOINT: "MSI_ENDPOINT",
    MSI_SECRET: "MSI_SECRET"
  }, ManagedIdentitySourceNames = {
    APP_SERVICE: "AppService",
    AZURE_ARC: "AzureArc",
    CLOUD_SHELL: "CloudShell",
    DEFAULT_TO_IMDS: "DefaultToImds",
    IMDS: "Imds",
    MACHINE_LEARNING: "MachineLearning",
    SERVICE_FABRIC: "ServiceFabric"
  }, ManagedIdentityIdType = {
    SYSTEM_ASSIGNED: "system-assigned",
    USER_ASSIGNED_CLIENT_ID: "user-assigned-client-id",
    USER_ASSIGNED_RESOURCE_ID: "user-assigned-resource-id",
    USER_ASSIGNED_OBJECT_ID: "user-assigned-object-id"
  }, HttpMethod2 = {
    GET: "GET",
    POST: "POST"
  }, Hash5 = {
    SHA256: "sha256"
  }, CharSet = {
    CV_CHARSET: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  }, CACHE = {
    KEY_SEPARATOR: "-"
  }, Constants = {
    MSAL_SKU: "msal.js.node",
    JWT_BEARER_ASSERTION_TYPE: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    HTTP_PROTOCOL: "http://",
    LOCALHOST: "localhost"
  }, ApiId = {
    acquireTokenSilent: 62,
    acquireTokenByUsernamePassword: 371,
    acquireTokenByDeviceCode: 671,
    acquireTokenByClientCredential: 771,
    acquireTokenByOBO: 772,
    acquireTokenWithManagedIdentity: 773,
    acquireTokenByCode: 871,
    acquireTokenByRefreshToken: 872
  }, JwtConstants = {
    RSA_256: "RS256",
    PSS_256: "PS256",
    X5T_256: "x5t#S256",
    X5T: "x5t",
    X5C: "x5c",
    AUDIENCE: "aud",
    EXPIRATION_TIME: "exp",
    ISSUER: "iss",
    SUBJECT: "sub",
    NOT_BEFORE: "nbf",
    JWT_ID: "jti"
  }, LOOPBACK_SERVER_CONSTANTS = {
    INTERVAL_MS: 100,
    TIMEOUT_MS: 5000
  };
});
