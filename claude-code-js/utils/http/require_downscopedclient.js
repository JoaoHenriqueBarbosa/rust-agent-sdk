// var: require_downscopedclient
var require_downscopedclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DownscopedClient = exports.EXPIRATION_TIME_OFFSET = exports.MAX_ACCESS_BOUNDARY_RULES_COUNT = void 0;
  var stream10 = __require("stream"), authclient_1 = require_authclient(), sts = require_stscredentials(), STS_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange", STS_REQUEST_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token", STS_SUBJECT_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token";
  exports.MAX_ACCESS_BOUNDARY_RULES_COUNT = 10;
  exports.EXPIRATION_TIME_OFFSET = 300000;

  class DownscopedClient extends authclient_1.AuthClient {
    constructor(authClient, credentialAccessBoundary, additionalOptions, quotaProjectId) {
      super({ ...additionalOptions, quotaProjectId });
      if (this.authClient = authClient, this.credentialAccessBoundary = credentialAccessBoundary, credentialAccessBoundary.accessBoundary.accessBoundaryRules.length === 0)
        throw Error("At least one access boundary rule needs to be defined.");
      else if (credentialAccessBoundary.accessBoundary.accessBoundaryRules.length > exports.MAX_ACCESS_BOUNDARY_RULES_COUNT)
        throw Error(`The provided access boundary has more than ${exports.MAX_ACCESS_BOUNDARY_RULES_COUNT} access boundary rules.`);
      for (let rule of credentialAccessBoundary.accessBoundary.accessBoundaryRules)
        if (rule.availablePermissions.length === 0)
          throw Error("At least one permission should be defined in access boundary rules.");
      this.stsCredential = new sts.StsCredentials(`https://sts.${this.universeDomain}/v1/token`), this.cachedDownscopedAccessToken = null;
    }
    setCredentials(credentials) {
      if (!credentials.expiry_date)
        throw Error("The access token expiry_date field is missing in the provided credentials.");
      super.setCredentials(credentials), this.cachedDownscopedAccessToken = credentials;
    }
    async getAccessToken() {
      if (!this.cachedDownscopedAccessToken || this.isExpired(this.cachedDownscopedAccessToken))
        await this.refreshAccessTokenAsync();
      return {
        token: this.cachedDownscopedAccessToken.access_token,
        expirationTime: this.cachedDownscopedAccessToken.expiry_date,
        res: this.cachedDownscopedAccessToken.res
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
      var _a2;
      let subjectToken = (await this.authClient.getAccessToken()).token, stsCredentialsOptions = {
        grantType: STS_GRANT_TYPE,
        requestedTokenType: STS_REQUEST_TOKEN_TYPE,
        subjectToken,
        subjectTokenType: STS_SUBJECT_TOKEN_TYPE
      }, stsResponse = await this.stsCredential.exchangeToken(stsCredentialsOptions, void 0, this.credentialAccessBoundary), sourceCredExpireDate = ((_a2 = this.authClient.credentials) === null || _a2 === void 0 ? void 0 : _a2.expiry_date) || null, expiryDate = stsResponse.expires_in ? (/* @__PURE__ */ new Date()).getTime() + stsResponse.expires_in * 1000 : sourceCredExpireDate;
      return this.cachedDownscopedAccessToken = {
        access_token: stsResponse.access_token,
        expiry_date: expiryDate,
        res: stsResponse.res
      }, this.credentials = {}, Object.assign(this.credentials, this.cachedDownscopedAccessToken), delete this.credentials.res, this.emit("tokens", {
        refresh_token: null,
        expiry_date: this.cachedDownscopedAccessToken.expiry_date,
        access_token: this.cachedDownscopedAccessToken.access_token,
        token_type: "Bearer",
        id_token: null
      }), this.cachedDownscopedAccessToken;
    }
    isExpired(downscopedAccessToken) {
      let now = (/* @__PURE__ */ new Date()).getTime();
      return downscopedAccessToken.expiry_date ? now >= downscopedAccessToken.expiry_date - this.eagerRefreshThresholdMillis : !1;
    }
  }
  exports.DownscopedClient = DownscopedClient;
});
