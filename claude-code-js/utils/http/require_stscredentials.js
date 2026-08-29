// var: require_stscredentials
var require_stscredentials = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.StsCredentials = void 0;
  var gaxios_1 = require_src2(), querystring = __require("querystring"), transporters_1 = require_transporters(), oauth2common_1 = require_oauth2common();

  class StsCredentials extends oauth2common_1.OAuthClientAuthHandler {
    constructor(tokenExchangeEndpoint, clientAuthentication) {
      super(clientAuthentication);
      this.tokenExchangeEndpoint = tokenExchangeEndpoint, this.transporter = new transporters_1.DefaultTransporter;
    }
    async exchangeToken(stsCredentialsOptions, additionalHeaders, options) {
      var _a2, _b, _c;
      let values2 = {
        grant_type: stsCredentialsOptions.grantType,
        resource: stsCredentialsOptions.resource,
        audience: stsCredentialsOptions.audience,
        scope: (_a2 = stsCredentialsOptions.scope) === null || _a2 === void 0 ? void 0 : _a2.join(" "),
        requested_token_type: stsCredentialsOptions.requestedTokenType,
        subject_token: stsCredentialsOptions.subjectToken,
        subject_token_type: stsCredentialsOptions.subjectTokenType,
        actor_token: (_b = stsCredentialsOptions.actingParty) === null || _b === void 0 ? void 0 : _b.actorToken,
        actor_token_type: (_c = stsCredentialsOptions.actingParty) === null || _c === void 0 ? void 0 : _c.actorTokenType,
        options: options && JSON.stringify(options)
      };
      Object.keys(values2).forEach((key) => {
        if (typeof values2[key] > "u")
          delete values2[key];
      });
      let headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };
      Object.assign(headers, additionalHeaders || {});
      let opts = {
        ...StsCredentials.RETRY_CONFIG,
        url: this.tokenExchangeEndpoint.toString(),
        method: "POST",
        headers,
        data: querystring.stringify(values2),
        responseType: "json"
      };
      this.applyClientAuthenticationOptions(opts);
      try {
        let response7 = await this.transporter.request(opts), stsSuccessfulResponse = response7.data;
        return stsSuccessfulResponse.res = response7, stsSuccessfulResponse;
      } catch (error43) {
        if (error43 instanceof gaxios_1.GaxiosError && error43.response)
          throw (0, oauth2common_1.getErrorFromOAuthErrorResponse)(error43.response.data, error43);
        throw error43;
      }
    }
  }
  exports.StsCredentials = StsCredentials;
});
