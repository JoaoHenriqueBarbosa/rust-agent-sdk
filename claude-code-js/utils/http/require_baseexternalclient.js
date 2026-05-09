// var: require_baseexternalclient
var require_baseexternalclient = __commonJS((exports) => {
  var __classPrivateFieldGet3 = exports && exports.__classPrivateFieldGet || function(receiver, state3, kind, f) {
    if (kind === "a" && !f)
      throw TypeError("Private accessor was defined without a getter");
    if (typeof state3 === "function" ? receiver !== state3 || !f : !state3.has(receiver))
      throw TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state3.get(receiver);
  }, __classPrivateFieldSet3 = exports && exports.__classPrivateFieldSet || function(receiver, state3, value, kind, f) {
    if (kind === "m")
      throw TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw TypeError("Private accessor was defined without a setter");
    if (typeof state3 === "function" ? receiver !== state3 || !f : !state3.has(receiver))
      throw TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state3.set(receiver, value), value;
  }, _BaseExternalAccountClient_instances, _BaseExternalAccountClient_pendingAccessToken, _BaseExternalAccountClient_internalRefreshAccessTokenAsync;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.BaseExternalAccountClient = exports.DEFAULT_UNIVERSE = exports.CLOUD_RESOURCE_MANAGER = exports.EXTERNAL_ACCOUNT_TYPE = exports.EXPIRATION_TIME_OFFSET = void 0;
  var stream10 = __require("stream"), authclient_1 = require_authclient(), sts = require_stscredentials(), util_1 = require_util2(), STS_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:token-exchange", STS_REQUEST_TOKEN_TYPE = "urn:ietf:params:oauth:token-type:access_token", DEFAULT_OAUTH_SCOPE = "https://www.googleapis.com/auth/cloud-platform", DEFAULT_TOKEN_LIFESPAN = 3600;
  exports.EXPIRATION_TIME_OFFSET = 300000;
  exports.EXTERNAL_ACCOUNT_TYPE = "external_account";
  exports.CLOUD_RESOURCE_MANAGER = "https://cloudresourcemanager.googleapis.com/v1/projects/";
  var WORKFORCE_AUDIENCE_PATTERN = "//iam\\.googleapis\\.com/locations/[^/]+/workforcePools/[^/]+/providers/.+", DEFAULT_TOKEN_URL = "https://sts.{universeDomain}/v1/token", pkg = require_package3(), authclient_2 = require_authclient();
  Object.defineProperty(exports, "DEFAULT_UNIVERSE", { enumerable: !0, get: function() {
    return authclient_2.DEFAULT_UNIVERSE;
  } });

  class BaseExternalAccountClient extends authclient_1.AuthClient {
    constructor(options, additionalOptions) {
      var _a2;
      super({ ...options, ...additionalOptions });
      _BaseExternalAccountClient_instances.add(this), _BaseExternalAccountClient_pendingAccessToken.set(this, null);
      let opts = (0, util_1.originalOrCamelOptions)(options), type = opts.get("type");
      if (type && type !== exports.EXTERNAL_ACCOUNT_TYPE)
        throw Error(`Expected "${exports.EXTERNAL_ACCOUNT_TYPE}" type but received "${options.type}"`);
      let clientId = opts.get("client_id"), clientSecret = opts.get("client_secret"), tokenUrl = (_a2 = opts.get("token_url")) !== null && _a2 !== void 0 ? _a2 : DEFAULT_TOKEN_URL.replace("{universeDomain}", this.universeDomain), subjectTokenType = opts.get("subject_token_type"), workforcePoolUserProject = opts.get("workforce_pool_user_project"), serviceAccountImpersonationUrl = opts.get("service_account_impersonation_url"), serviceAccountImpersonation = opts.get("service_account_impersonation"), serviceAccountImpersonationLifetime = (0, util_1.originalOrCamelOptions)(serviceAccountImpersonation).get("token_lifetime_seconds");
      if (this.cloudResourceManagerURL = new URL(opts.get("cloud_resource_manager_url") || `https://cloudresourcemanager.${this.universeDomain}/v1/projects/`), clientId)
        this.clientAuth = {
          confidentialClientType: "basic",
          clientId,
          clientSecret
        };
      this.stsCredential = new sts.StsCredentials(tokenUrl, this.clientAuth), this.scopes = opts.get("scopes") || [DEFAULT_OAUTH_SCOPE], this.cachedAccessToken = null, this.audience = opts.get("audience"), this.subjectTokenType = subjectTokenType, this.workforcePoolUserProject = workforcePoolUserProject;
      let workforceAudiencePattern = new RegExp(WORKFORCE_AUDIENCE_PATTERN);
      if (this.workforcePoolUserProject && !this.audience.match(workforceAudiencePattern))
        throw Error("workforcePoolUserProject should not be set for non-workforce pool credentials.");
      if (this.serviceAccountImpersonationUrl = serviceAccountImpersonationUrl, this.serviceAccountImpersonationLifetime = serviceAccountImpersonationLifetime, this.serviceAccountImpersonationLifetime)
        this.configLifetimeRequested = !0;
      else
        this.configLifetimeRequested = !1, this.serviceAccountImpersonationLifetime = DEFAULT_TOKEN_LIFESPAN;
      this.projectNumber = this.getProjectNumber(this.audience), this.supplierContext = {
        audience: this.audience,
        subjectTokenType: this.subjectTokenType,
        transporter: this.transporter
      };
    }
    getServiceAccountEmail() {
      var _a2;
      if (this.serviceAccountImpersonationUrl) {
        if (this.serviceAccountImpersonationUrl.length > 256)
          throw RangeError(`URL is too long: ${this.serviceAccountImpersonationUrl}`);
        let result = /serviceAccounts\/(?<email>[^:]+):generateAccessToken$/.exec(this.serviceAccountImpersonationUrl);
        return ((_a2 = result === null || result === void 0 ? void 0 : result.groups) === null || _a2 === void 0 ? void 0 : _a2.email) || null;
      }
      return null;
    }
    setCredentials(credentials) {
      super.setCredentials(credentials), this.cachedAccessToken = credentials;
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
    async getProjectId() {
      let projectNumber = this.projectNumber || this.workforcePoolUserProject;
      if (this.projectId)
        return this.projectId;
      else if (projectNumber) {
        let headers = await this.getRequestHeaders(), response7 = await this.transporter.request({
          ...BaseExternalAccountClient.RETRY_CONFIG,
          headers,
          url: `${this.cloudResourceManagerURL.toString()}${projectNumber}`,
          responseType: "json"
        });
        return this.projectId = response7.data.projectId, this.projectId;
      }
      return null;
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
      __classPrivateFieldSet3(this, _BaseExternalAccountClient_pendingAccessToken, __classPrivateFieldGet3(this, _BaseExternalAccountClient_pendingAccessToken, "f") || __classPrivateFieldGet3(this, _BaseExternalAccountClient_instances, "m", _BaseExternalAccountClient_internalRefreshAccessTokenAsync).call(this), "f");
      try {
        return await __classPrivateFieldGet3(this, _BaseExternalAccountClient_pendingAccessToken, "f");
      } finally {
        __classPrivateFieldSet3(this, _BaseExternalAccountClient_pendingAccessToken, null, "f");
      }
    }
    getProjectNumber(audience) {
      let match = audience.match(/\/projects\/([^/]+)/);
      if (!match)
        return null;
      return match[1];
    }
    async getImpersonatedAccessToken(token) {
      let opts = {
        ...BaseExternalAccountClient.RETRY_CONFIG,
        url: this.serviceAccountImpersonationUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: {
          scope: this.getScopesArray(),
          lifetime: this.serviceAccountImpersonationLifetime + "s"
        },
        responseType: "json"
      }, response7 = await this.transporter.request(opts), successResponse = response7.data;
      return {
        access_token: successResponse.accessToken,
        expiry_date: new Date(successResponse.expireTime).getTime(),
        res: response7
      };
    }
    isExpired(accessToken) {
      let now = (/* @__PURE__ */ new Date()).getTime();
      return accessToken.expiry_date ? now >= accessToken.expiry_date - this.eagerRefreshThresholdMillis : !1;
    }
    getScopesArray() {
      if (typeof this.scopes === "string")
        return [this.scopes];
      return this.scopes || [DEFAULT_OAUTH_SCOPE];
    }
    getMetricsHeaderValue() {
      let nodeVersion = process.version.replace(/^v/, ""), saImpersonation = this.serviceAccountImpersonationUrl !== void 0, credentialSourceType = this.credentialSourceType ? this.credentialSourceType : "unknown";
      return `gl-node/${nodeVersion} auth/${pkg.version} google-byoid-sdk source/${credentialSourceType} sa-impersonation/${saImpersonation} config-lifetime/${this.configLifetimeRequested}`;
    }
  }
  exports.BaseExternalAccountClient = BaseExternalAccountClient;
  _BaseExternalAccountClient_pendingAccessToken = /* @__PURE__ */ new WeakMap, _BaseExternalAccountClient_instances = /* @__PURE__ */ new WeakSet, _BaseExternalAccountClient_internalRefreshAccessTokenAsync = async function() {
    let subjectToken = await this.retrieveSubjectToken(), stsCredentialsOptions = {
      grantType: STS_GRANT_TYPE,
      audience: this.audience,
      requestedTokenType: STS_REQUEST_TOKEN_TYPE,
      subjectToken,
      subjectTokenType: this.subjectTokenType,
      scope: this.serviceAccountImpersonationUrl ? [DEFAULT_OAUTH_SCOPE] : this.getScopesArray()
    }, additionalOptions = !this.clientAuth && this.workforcePoolUserProject ? { userProject: this.workforcePoolUserProject } : void 0, additionalHeaders = {
      "x-goog-api-client": this.getMetricsHeaderValue()
    }, stsResponse = await this.stsCredential.exchangeToken(stsCredentialsOptions, additionalHeaders, additionalOptions);
    if (this.serviceAccountImpersonationUrl)
      this.cachedAccessToken = await this.getImpersonatedAccessToken(stsResponse.access_token);
    else if (stsResponse.expires_in)
      this.cachedAccessToken = {
        access_token: stsResponse.access_token,
        expiry_date: (/* @__PURE__ */ new Date()).getTime() + stsResponse.expires_in * 1000,
        res: stsResponse.res
      };
    else
      this.cachedAccessToken = {
        access_token: stsResponse.access_token,
        res: stsResponse.res
      };
    return this.credentials = {}, Object.assign(this.credentials, this.cachedAccessToken), delete this.credentials.res, this.emit("tokens", {
      refresh_token: null,
      expiry_date: this.cachedAccessToken.expiry_date,
      access_token: this.cachedAccessToken.access_token,
      token_type: "Bearer",
      id_token: null
    }), this.cachedAccessToken;
  };
});
