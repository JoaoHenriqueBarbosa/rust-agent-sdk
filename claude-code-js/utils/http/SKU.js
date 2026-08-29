// var: SKU
var SKU = "msal.js.common", DEFAULT_AUTHORITY = "https://login.microsoftonline.com/common/", DEFAULT_AUTHORITY_HOST = "login.microsoftonline.com", DEFAULT_COMMON_TENANT = "common", ADFS = "adfs", DSTS = "dstsv2", AAD_INSTANCE_DISCOVERY_ENDPT = "https://login.microsoftonline.com/common/discovery/instance?api-version=1.1&authorization_endpoint=", CIAM_AUTH_URL = ".ciamlogin.com", AAD_TENANT_DOMAIN_SUFFIX = ".onmicrosoft.com", RESOURCE_DELIM = "|", CONSUMER_UTID = "9188040d-6c67-4c5b-b112-36a304b66dad", OPENID_SCOPE = "openid", PROFILE_SCOPE = "profile", OFFLINE_ACCESS_SCOPE = "offline_access", EMAIL_SCOPE = "email", CODE_GRANT_TYPE = "authorization_code", S256_CODE_CHALLENGE_METHOD = "S256", URL_FORM_CONTENT_TYPE = "application/x-www-form-urlencoded;charset=utf-8", AUTHORIZATION_PENDING = "authorization_pending", NOT_APPLICABLE = "N/A", NOT_AVAILABLE = "Not Available", FORWARD_SLASH = "/", IMDS_ENDPOINT = "http://169.254.169.254/metadata/instance/compute/location", IMDS_VERSION = "2020-06-01", IMDS_TIMEOUT = 2000, AZURE_REGION_AUTO_DISCOVER_FLAG = "TryAutoDetect", REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX = "login.microsoft.com", KNOWN_PUBLIC_CLOUDS, SHR_NONCE_VALIDITY = 240, INVALID_INSTANCE = "invalid_instance", HTTP_SUCCESS = 200, HTTP_SUCCESS_RANGE_START = 200, HTTP_SUCCESS_RANGE_END = 299, HTTP_REDIRECT = 302, HTTP_CLIENT_ERROR = 400, HTTP_CLIENT_ERROR_RANGE_START = 400, HTTP_BAD_REQUEST = 400, HTTP_UNAUTHORIZED = 401, HTTP_NOT_FOUND = 404, HTTP_REQUEST_TIMEOUT = 408, HTTP_GONE = 410, HTTP_TOO_MANY_REQUESTS = 429, HTTP_CLIENT_ERROR_RANGE_END = 499, HTTP_SERVER_ERROR = 500, HTTP_SERVER_ERROR_RANGE_START = 500, HTTP_SERVICE_UNAVAILABLE = 503, HTTP_GATEWAY_TIMEOUT = 504, HTTP_SERVER_ERROR_RANGE_END = 599, HTTP_MULTI_SIDED_ERROR = 600, HttpMethod, OIDC_DEFAULT_SCOPES, OIDC_SCOPES, HeaderNames, PersistentCacheKeys, AADAuthority, ClaimsRequestKeys, PromptValue, CodeChallengeMethodValues, OAuthResponseType, ResponseMode, GrantType, CACHE_ACCOUNT_TYPE_MSSTS = "MSSTS", CACHE_ACCOUNT_TYPE_ADFS = "ADFS", CACHE_ACCOUNT_TYPE_MSAV1 = "MSA", CACHE_ACCOUNT_TYPE_GENERIC = "Generic", CACHE_KEY_SEPARATOR = "-", CLIENT_INFO_SEPARATOR = ".", CredentialType, CacheType, APP_METADATA = "appmetadata", CLIENT_INFO = "client_info", THE_FAMILY_ID = "1", AUTHORITY_METADATA_CACHE_KEY = "authority-metadata", AUTHORITY_METADATA_REFRESH_TIME_SECONDS = 86400, AuthorityMetadataSource, SERVER_TELEM_SCHEMA_VERSION = 5, SERVER_TELEM_MAX_CUR_HEADER_BYTES = 80, SERVER_TELEM_MAX_LAST_HEADER_BYTES = 330, SERVER_TELEM_MAX_CACHED_ERRORS = 50, SERVER_TELEM_CACHE_KEY = "server-telemetry", SERVER_TELEM_CATEGORY_SEPARATOR = "|", SERVER_TELEM_VALUE_SEPARATOR = ",", SERVER_TELEM_OVERFLOW_TRUE = "1", SERVER_TELEM_OVERFLOW_FALSE = "0", SERVER_TELEM_UNKNOWN_ERROR = "unknown_error", AuthenticationScheme, DEFAULT_THROTTLE_TIME_SECONDS = 60, DEFAULT_MAX_THROTTLE_TIME_SECONDS = 3600, THROTTLING_PREFIX = "throttling", X_MS_LIB_CAPABILITY_VALUE = "retry-after, h429", INVALID_GRANT_ERROR = "invalid_grant", CLIENT_MISMATCH_ERROR = "client_mismatch", PasswordGrantConstants, RegionDiscoverySources, RegionDiscoveryOutcomes, CacheOutcome, JsonWebTokenTypes, ONE_DAY_IN_MS = 86400000, DEFAULT_TOKEN_RENEWAL_OFFSET_SEC = 300, EncodingTypes;
var init_Constants = __esm(() => {
  /*! @azure/msal-common v16.4.1 2026-04-01 */
  KNOWN_PUBLIC_CLOUDS = [
    "login.microsoftonline.com",
    "login.windows.net",
    "login.microsoft.com",
    "sts.windows.net"
  ], HttpMethod = {
    GET: "GET",
    POST: "POST"
  }, OIDC_DEFAULT_SCOPES = [
    "openid",
    "profile",
    "offline_access"
  ], OIDC_SCOPES = [...OIDC_DEFAULT_SCOPES, "email"], HeaderNames = {
    CONTENT_TYPE: "Content-Type",
    CONTENT_LENGTH: "Content-Length",
    RETRY_AFTER: "Retry-After",
    CCS_HEADER: "X-AnchorMailbox",
    WWWAuthenticate: "WWW-Authenticate",
    AuthenticationInfo: "Authentication-Info",
    X_MS_REQUEST_ID: "x-ms-request-id",
    X_MS_HTTP_VERSION: "x-ms-httpver"
  }, PersistentCacheKeys = {
    ACTIVE_ACCOUNT_FILTERS: "active-account-filters"
  }, AADAuthority = {
    COMMON: "common",
    ORGANIZATIONS: "organizations",
    CONSUMERS: "consumers"
  }, ClaimsRequestKeys = {
    ACCESS_TOKEN: "access_token",
    XMS_CC: "xms_cc"
  }, PromptValue = {
    LOGIN: "login",
    SELECT_ACCOUNT: "select_account",
    CONSENT: "consent",
    NONE: "none",
    CREATE: "create",
    NO_SESSION: "no_session"
  }, CodeChallengeMethodValues = {
    PLAIN: "plain",
    S256: "S256"
  }, OAuthResponseType = {
    CODE: "code",
    IDTOKEN_TOKEN: "id_token token",
    IDTOKEN_TOKEN_REFRESHTOKEN: "id_token token refresh_token"
  }, ResponseMode = {
    QUERY: "query",
    FRAGMENT: "fragment",
    FORM_POST: "form_post"
  }, GrantType = {
    IMPLICIT_GRANT: "implicit",
    AUTHORIZATION_CODE_GRANT: "authorization_code",
    CLIENT_CREDENTIALS_GRANT: "client_credentials",
    RESOURCE_OWNER_PASSWORD_GRANT: "password",
    REFRESH_TOKEN_GRANT: "refresh_token",
    DEVICE_CODE_GRANT: "device_code",
    JWT_BEARER: "urn:ietf:params:oauth:grant-type:jwt-bearer"
  }, CredentialType = {
    ID_TOKEN: "IdToken",
    ACCESS_TOKEN: "AccessToken",
    ACCESS_TOKEN_WITH_AUTH_SCHEME: "AccessToken_With_AuthScheme",
    REFRESH_TOKEN: "RefreshToken"
  }, CacheType = {
    ADFS: 1001,
    MSA: 1002,
    MSSTS: 1003,
    GENERIC: 1004,
    ACCESS_TOKEN: 2001,
    REFRESH_TOKEN: 2002,
    ID_TOKEN: 2003,
    APP_METADATA: 3001,
    UNDEFINED: 9999
  }, AuthorityMetadataSource = {
    CONFIG: "config",
    CACHE: "cache",
    NETWORK: "network",
    HARDCODED_VALUES: "hardcoded_values"
  }, AuthenticationScheme = {
    BEARER: "Bearer",
    POP: "pop",
    SSH: "ssh-cert"
  }, PasswordGrantConstants = {
    username: "username",
    password: "password"
  }, RegionDiscoverySources = {
    FAILED_AUTO_DETECTION: "1",
    INTERNAL_CACHE: "2",
    ENVIRONMENT_VARIABLE: "3",
    IMDS: "4"
  }, RegionDiscoveryOutcomes = {
    CONFIGURED_MATCHES_DETECTED: "1",
    CONFIGURED_NO_AUTO_DETECTION: "2",
    CONFIGURED_NOT_DETECTED: "3",
    AUTO_DETECTION_REQUESTED_SUCCESSFUL: "4",
    AUTO_DETECTION_REQUESTED_FAILED: "5"
  }, CacheOutcome = {
    NOT_APPLICABLE: "0",
    FORCE_REFRESH_OR_CLAIMS: "1",
    NO_CACHED_ACCESS_TOKEN: "2",
    CACHED_ACCESS_TOKEN_EXPIRED: "3",
    PROACTIVELY_REFRESHED: "4"
  }, JsonWebTokenTypes = {
    Jwt: "JWT",
    Jwk: "JWK",
    Pop: "pop"
  }, EncodingTypes = {
    BASE64: "base64",
    HEX: "hex",
    UTF8: "utf-8"
  };
});
