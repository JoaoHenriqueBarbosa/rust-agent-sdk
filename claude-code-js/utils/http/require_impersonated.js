// var: require_impersonated
var require_impersonated = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Impersonated = exports.IMPERSONATED_ACCOUNT_TYPE = void 0;
  var oauth2client_1 = require_oauth2client(), gaxios_1 = require_src2(), util_1 = require_util2();
  exports.IMPERSONATED_ACCOUNT_TYPE = "impersonated_service_account";

  class Impersonated extends oauth2client_1.OAuth2Client {
    constructor(options = {}) {
      var _a2, _b, _c, _d, _e, _f;
      super(options);
      if (this.credentials = {
        expiry_date: 1,
        refresh_token: "impersonated-placeholder"
      }, this.sourceClient = (_a2 = options.sourceClient) !== null && _a2 !== void 0 ? _a2 : new oauth2client_1.OAuth2Client, this.targetPrincipal = (_b = options.targetPrincipal) !== null && _b !== void 0 ? _b : "", this.delegates = (_c = options.delegates) !== null && _c !== void 0 ? _c : [], this.targetScopes = (_d = options.targetScopes) !== null && _d !== void 0 ? _d : [], this.lifetime = (_e = options.lifetime) !== null && _e !== void 0 ? _e : 3600, !(0, util_1.originalOrCamelOptions)(options).get("universe_domain"))
        this.universeDomain = this.sourceClient.universeDomain;
      else if (this.sourceClient.universeDomain !== this.universeDomain)
        throw RangeError(`Universe domain ${this.sourceClient.universeDomain} in source credentials does not match ${this.universeDomain} universe domain set for impersonated credentials.`);
      this.endpoint = (_f = options.endpoint) !== null && _f !== void 0 ? _f : `https://iamcredentials.${this.universeDomain}`;
    }
    async sign(blobToSign) {
      await this.sourceClient.getAccessToken();
      let name3 = `projects/-/serviceAccounts/${this.targetPrincipal}`, u5 = `${this.endpoint}/v1/${name3}:signBlob`, body = {
        delegates: this.delegates,
        payload: Buffer.from(blobToSign).toString("base64")
      };
      return (await this.sourceClient.request({
        ...Impersonated.RETRY_CONFIG,
        url: u5,
        data: body,
        method: "POST"
      })).data;
    }
    getTargetPrincipal() {
      return this.targetPrincipal;
    }
    async refreshToken() {
      var _a2, _b, _c, _d, _e, _f;
      try {
        await this.sourceClient.getAccessToken();
        let name3 = "projects/-/serviceAccounts/" + this.targetPrincipal, u5 = `${this.endpoint}/v1/${name3}:generateAccessToken`, body = {
          delegates: this.delegates,
          scope: this.targetScopes,
          lifetime: this.lifetime + "s"
        }, res = await this.sourceClient.request({
          ...Impersonated.RETRY_CONFIG,
          url: u5,
          data: body,
          method: "POST"
        }), tokenResponse = res.data;
        return this.credentials.access_token = tokenResponse.accessToken, this.credentials.expiry_date = Date.parse(tokenResponse.expireTime), {
          tokens: this.credentials,
          res
        };
      } catch (error43) {
        if (!(error43 instanceof Error))
          throw error43;
        let status = 0, message = "";
        if (error43 instanceof gaxios_1.GaxiosError)
          status = (_c = (_b = (_a2 = error43 === null || error43 === void 0 ? void 0 : error43.response) === null || _a2 === void 0 ? void 0 : _a2.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.status, message = (_f = (_e = (_d = error43 === null || error43 === void 0 ? void 0 : error43.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.message;
        if (status && message)
          throw error43.message = `${status}: unable to impersonate: ${message}`, error43;
        else
          throw error43.message = `unable to impersonate: ${error43}`, error43;
      }
    }
    async fetchIdToken(targetAudience, options) {
      var _a2, _b;
      await this.sourceClient.getAccessToken();
      let name3 = `projects/-/serviceAccounts/${this.targetPrincipal}`, u5 = `${this.endpoint}/v1/${name3}:generateIdToken`, body = {
        delegates: this.delegates,
        audience: targetAudience,
        includeEmail: (_a2 = options === null || options === void 0 ? void 0 : options.includeEmail) !== null && _a2 !== void 0 ? _a2 : !0,
        useEmailAzp: (_b = options === null || options === void 0 ? void 0 : options.includeEmail) !== null && _b !== void 0 ? _b : !0
      };
      return (await this.sourceClient.request({
        ...Impersonated.RETRY_CONFIG,
        url: u5,
        data: body,
        method: "POST"
      })).data.token;
    }
  }
  exports.Impersonated = Impersonated;
});
