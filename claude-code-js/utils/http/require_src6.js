// var: require_src6
var require_src6 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GoogleAuth = exports.auth = exports.DefaultTransporter = exports.PassThroughClient = exports.ExecutableError = exports.PluggableAuthClient = exports.DownscopedClient = exports.BaseExternalAccountClient = exports.ExternalAccountClient = exports.IdentityPoolClient = exports.AwsRequestSigner = exports.AwsClient = exports.UserRefreshClient = exports.LoginTicket = exports.ClientAuthentication = exports.OAuth2Client = exports.CodeChallengeMethod = exports.Impersonated = exports.JWT = exports.JWTAccess = exports.IdTokenClient = exports.IAMAuth = exports.GCPEnv = exports.Compute = exports.DEFAULT_UNIVERSE = exports.AuthClient = exports.gaxios = exports.gcpMetadata = void 0;
  var googleauth_1 = require_googleauth();
  Object.defineProperty(exports, "GoogleAuth", { enumerable: !0, get: function() {
    return googleauth_1.GoogleAuth;
  } });
  exports.gcpMetadata = require_src4();
  exports.gaxios = require_src2();
  var authclient_1 = require_authclient();
  Object.defineProperty(exports, "AuthClient", { enumerable: !0, get: function() {
    return authclient_1.AuthClient;
  } });
  Object.defineProperty(exports, "DEFAULT_UNIVERSE", { enumerable: !0, get: function() {
    return authclient_1.DEFAULT_UNIVERSE;
  } });
  var computeclient_1 = require_computeclient();
  Object.defineProperty(exports, "Compute", { enumerable: !0, get: function() {
    return computeclient_1.Compute;
  } });
  var envDetect_1 = require_envDetect();
  Object.defineProperty(exports, "GCPEnv", { enumerable: !0, get: function() {
    return envDetect_1.GCPEnv;
  } });
  var iam_1 = require_iam();
  Object.defineProperty(exports, "IAMAuth", { enumerable: !0, get: function() {
    return iam_1.IAMAuth;
  } });
  var idtokenclient_1 = require_idtokenclient();
  Object.defineProperty(exports, "IdTokenClient", { enumerable: !0, get: function() {
    return idtokenclient_1.IdTokenClient;
  } });
  var jwtaccess_1 = require_jwtaccess();
  Object.defineProperty(exports, "JWTAccess", { enumerable: !0, get: function() {
    return jwtaccess_1.JWTAccess;
  } });
  var jwtclient_1 = require_jwtclient();
  Object.defineProperty(exports, "JWT", { enumerable: !0, get: function() {
    return jwtclient_1.JWT;
  } });
  var impersonated_1 = require_impersonated();
  Object.defineProperty(exports, "Impersonated", { enumerable: !0, get: function() {
    return impersonated_1.Impersonated;
  } });
  var oauth2client_1 = require_oauth2client();
  Object.defineProperty(exports, "CodeChallengeMethod", { enumerable: !0, get: function() {
    return oauth2client_1.CodeChallengeMethod;
  } });
  Object.defineProperty(exports, "OAuth2Client", { enumerable: !0, get: function() {
    return oauth2client_1.OAuth2Client;
  } });
  Object.defineProperty(exports, "ClientAuthentication", { enumerable: !0, get: function() {
    return oauth2client_1.ClientAuthentication;
  } });
  var loginticket_1 = require_loginticket();
  Object.defineProperty(exports, "LoginTicket", { enumerable: !0, get: function() {
    return loginticket_1.LoginTicket;
  } });
  var refreshclient_1 = require_refreshclient();
  Object.defineProperty(exports, "UserRefreshClient", { enumerable: !0, get: function() {
    return refreshclient_1.UserRefreshClient;
  } });
  var awsclient_1 = require_awsclient();
  Object.defineProperty(exports, "AwsClient", { enumerable: !0, get: function() {
    return awsclient_1.AwsClient;
  } });
  var awsrequestsigner_1 = require_awsrequestsigner();
  Object.defineProperty(exports, "AwsRequestSigner", { enumerable: !0, get: function() {
    return awsrequestsigner_1.AwsRequestSigner;
  } });
  var identitypoolclient_1 = require_identitypoolclient();
  Object.defineProperty(exports, "IdentityPoolClient", { enumerable: !0, get: function() {
    return identitypoolclient_1.IdentityPoolClient;
  } });
  var externalclient_1 = require_externalclient();
  Object.defineProperty(exports, "ExternalAccountClient", { enumerable: !0, get: function() {
    return externalclient_1.ExternalAccountClient;
  } });
  var baseexternalclient_1 = require_baseexternalclient();
  Object.defineProperty(exports, "BaseExternalAccountClient", { enumerable: !0, get: function() {
    return baseexternalclient_1.BaseExternalAccountClient;
  } });
  var downscopedclient_1 = require_downscopedclient();
  Object.defineProperty(exports, "DownscopedClient", { enumerable: !0, get: function() {
    return downscopedclient_1.DownscopedClient;
  } });
  var pluggable_auth_client_1 = require_pluggable_auth_client();
  Object.defineProperty(exports, "PluggableAuthClient", { enumerable: !0, get: function() {
    return pluggable_auth_client_1.PluggableAuthClient;
  } });
  Object.defineProperty(exports, "ExecutableError", { enumerable: !0, get: function() {
    return pluggable_auth_client_1.ExecutableError;
  } });
  var passthrough_1 = require_passthrough();
  Object.defineProperty(exports, "PassThroughClient", { enumerable: !0, get: function() {
    return passthrough_1.PassThroughClient;
  } });
  var transporters_1 = require_transporters();
  Object.defineProperty(exports, "DefaultTransporter", { enumerable: !0, get: function() {
    return transporters_1.DefaultTransporter;
  } });
  var auth13 = new googleauth_1.GoogleAuth;
  exports.auth = auth13;
});
