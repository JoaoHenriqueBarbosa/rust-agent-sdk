// var: require_externalclient
var require_externalclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ExternalAccountClient = void 0;
  var baseexternalclient_1 = require_baseexternalclient(), identitypoolclient_1 = require_identitypoolclient(), awsclient_1 = require_awsclient(), pluggable_auth_client_1 = require_pluggable_auth_client();

  class ExternalAccountClient {
    constructor() {
      throw Error("ExternalAccountClients should be initialized via: ExternalAccountClient.fromJSON(), directly via explicit constructors, eg. new AwsClient(options), new IdentityPoolClient(options), newPluggableAuthClientOptions, or via new GoogleAuth(options).getClient()");
    }
    static fromJSON(options, additionalOptions) {
      var _a2, _b;
      if (options && options.type === baseexternalclient_1.EXTERNAL_ACCOUNT_TYPE)
        if ((_a2 = options.credential_source) === null || _a2 === void 0 ? void 0 : _a2.environment_id)
          return new awsclient_1.AwsClient(options, additionalOptions);
        else if ((_b = options.credential_source) === null || _b === void 0 ? void 0 : _b.executable)
          return new pluggable_auth_client_1.PluggableAuthClient(options, additionalOptions);
        else
          return new identitypoolclient_1.IdentityPoolClient(options, additionalOptions);
      else
        return null;
    }
  }
  exports.ExternalAccountClient = ExternalAccountClient;
});
