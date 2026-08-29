// var: require_externalAccountAuthorizedUserClient
var require_externalAccountAuthorizedUserClient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.ExternalAccountAuthorizedUserClient = exports.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = void 0;
  var authclient_1 = require_authclient(), oauth2common_1 = require_oauth2common(), gaxios_1 = require_src2(), stream10 = __require("stream"), baseexternalclient_1 = require_baseexternalclient();
  exports.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE = "external_account_authorized_user";
  var DEFAULT_TOKEN_URL = "https://sts.{universeDomain}/v1/oauthtoken";

  class ExternalAccountAuthorizedUserHandler extends oauth2common_1.OAuthClientAuthHandler {
    constructor(url3, transporter, clientAuthentication) {
      super(clientAuthentication);
      this.url = url3, this.transporter = transporter;
    }
    async refreshToken(refreshToken, additionalHeaders) {
      let values2 = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      }), headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        ...additionalHeaders
      }, opts = {
        ...ExternalAccountAuthorizedUserHandler.RETRY_CONFIG,
        url: this.url,
        method: "POST",
        headers,
        data: values2.toString(),
        responseType: "json"
      };
      this.applyClientAuthenticationOptions(opts);
      try {
        let response7 = await this.transporter.request(opts), tokenRefreshResponse = response7.data;
        return tokenRefreshResponse.res = response7, tokenRefreshResponse;
      } catch (error43) {
        if (error43 instanceof gaxios_1.GaxiosError && error43.response)
          throw (0, oauth2common_1.getErrorFromOAuthErrorResponse)(error43.response.data, error43);
        throw error43;
      }
    }
  }

  class ExternalAccountAuthorizedUserClient extends authclient_1.AuthClient {
    constructor(options, additionalOptions) {
      var _a2;
      super({ ...options, ...additionalOptions });
      if (options.universe_domain)
        this.universeDomain = options.universe_domain;
      this.refreshToken = options.refresh_token;
      let clientAuth = {
        confidentialClientType: "basic",
        clientId: options.client_id,
        clientSecret: options.client_secret
      };
      if (this.externalAccountAuthorizedUserHandler = new ExternalAccountAuthorizedUserHandler((_a2 = options.token_url) !== null && _a2 !== void 0 ? _a2 : DEFAULT_TOKEN_URL.replace("{universeDomain}", this.universeDomain), this.transporter, clientAuth), this.cachedAccessToken = null, this.quotaProjectId = options.quota_project_id, typeof (additionalOptions === null || additionalOptions === void 0 ? void 0 : additionalOptions.eagerRefreshThresholdMillis) !== "number")
        this.eagerRefreshThresholdMillis = baseexternalclient_1.EXPIRATION_TIME_OFFSET;
      else
        this.eagerRefreshThresholdMillis = additionalOptions.eagerRefreshThresholdMillis;
      this.forceRefreshOnFailure = !!(additionalOptions === null || additionalOptions === void 0 ? void 0 : additionalOptions.forceRefreshOnFailure);
    }
    async getAccessToken() {
      if (!this.cachedAccessToken || this.isExpired(this.cachedAccessToken))
        await this.refreshAccessTokenAsync();
      return {
        token: this.cachedAccessToken.access_token,
        res: this.cachedAccessToken.res
      };
    }
    async getRequestHeaders() {
      let headers = {
        Authorization: `Bearer ${(await this.getAccessToken()).token}`
      };
      return this.addSharedMetadataHeaders(headers);
    }
    request(opts, callback) {
      if (callback)
        this.requestAsync(opts).then((r4) => callback(null, r4), (e) => {
          return callback(e, e.response);
        });
      else
        return this.requestAsync(opts);
    }
    async requestAsync(opts, reAuthRetried = !1) {
      let response7;
      try {
        let requestHeaders = await this.getRequestHeaders();
        if (opts.headers = opts.headers || {}, requestHeaders && requestHeaders["x-goog-user-project"])
          opts.headers["x-goog-user-project"] = requestHeaders["x-goog-user-project"];
        if (requestHeaders && requestHeaders.Authorization)
          opts.headers.Authorization = requestHeaders.Authorization;
        response7 = await this.transporter.request(opts);
      } catch (e) {
        let res = e.response;
        if (res) {
          let statusCode = res.status, isReadableStream5 = res.config.data instanceof stream10.Readable;
          if (!reAuthRetried && (statusCode === 401 || statusCode === 403) && !isReadableStream5 && this.forceRefreshOnFailure)
            return await this.refreshAccessTokenAsync(), await this.requestAsync(opts, !0);
        }
        throw e;
      }
      return response7;
    }
    async refreshAccessTokenAsync() {
      let refreshResponse = await this.externalAccountAuthorizedUserHandler.refreshToken(this.refreshToken);
      if (this.cachedAccessToken = {
        access_token: refreshResponse.access_token,
        expiry_date: (/* @__PURE__ */ new Date()).getTime() + refreshResponse.expires_in * 1000,
        res: refreshResponse.res
      }, refreshResponse.refresh_token !== void 0)
        this.refreshToken = refreshResponse.refresh_token;
      return this.cachedAccessToken;
    }
    isExpired(credentials) {
      let now = (/* @__PURE__ */ new Date()).getTime();
      return credentials.expiry_date ? now >= credentials.expiry_date - this.eagerRefreshThresholdMillis : !1;
    }
  }
  exports.ExternalAccountAuthorizedUserClient = ExternalAccountAuthorizedUserClient;
});
