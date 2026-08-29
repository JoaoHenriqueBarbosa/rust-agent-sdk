// var: require_oauth2client
var require_oauth2client = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.OAuth2Client = exports.ClientAuthentication = exports.CertificateFormat = exports.CodeChallengeMethod = void 0;
  var gaxios_1 = require_src2(), querystring = __require("querystring"), stream10 = __require("stream"), formatEcdsa = require_ecdsa_sig_formatter(), crypto_1 = require_crypto3(), authclient_1 = require_authclient(), loginticket_1 = require_loginticket(), CodeChallengeMethod;
  (function(CodeChallengeMethod2) {
    CodeChallengeMethod2.Plain = "plain", CodeChallengeMethod2.S256 = "S256";
  })(CodeChallengeMethod || (exports.CodeChallengeMethod = CodeChallengeMethod = {}));
  var CertificateFormat;
  (function(CertificateFormat2) {
    CertificateFormat2.PEM = "PEM", CertificateFormat2.JWK = "JWK";
  })(CertificateFormat || (exports.CertificateFormat = CertificateFormat = {}));
  var ClientAuthentication;
  (function(ClientAuthentication2) {
    ClientAuthentication2.ClientSecretPost = "ClientSecretPost", ClientAuthentication2.ClientSecretBasic = "ClientSecretBasic", ClientAuthentication2.None = "None";
  })(ClientAuthentication || (exports.ClientAuthentication = ClientAuthentication = {}));

  class OAuth2Client extends authclient_1.AuthClient {
    constructor(optionsOrClientId, clientSecret, redirectUri) {
      let opts = optionsOrClientId && typeof optionsOrClientId === "object" ? optionsOrClientId : { clientId: optionsOrClientId, clientSecret, redirectUri };
      super(opts);
      this.certificateCache = {}, this.certificateExpiry = null, this.certificateCacheFormat = CertificateFormat.PEM, this.refreshTokenPromises = /* @__PURE__ */ new Map, this._clientId = opts.clientId, this._clientSecret = opts.clientSecret, this.redirectUri = opts.redirectUri, this.endpoints = {
        tokenInfoUrl: "https://oauth2.googleapis.com/tokeninfo",
        oauth2AuthBaseUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        oauth2TokenUrl: "https://oauth2.googleapis.com/token",
        oauth2RevokeUrl: "https://oauth2.googleapis.com/revoke",
        oauth2FederatedSignonPemCertsUrl: "https://www.googleapis.com/oauth2/v1/certs",
        oauth2FederatedSignonJwkCertsUrl: "https://www.googleapis.com/oauth2/v3/certs",
        oauth2IapPublicKeyUrl: "https://www.gstatic.com/iap/verify/public_key",
        ...opts.endpoints
      }, this.clientAuthentication = opts.clientAuthentication || ClientAuthentication.ClientSecretPost, this.issuers = opts.issuers || [
        "accounts.google.com",
        "https://accounts.google.com",
        this.universeDomain
      ];
    }
    generateAuthUrl(opts = {}) {
      if (opts.code_challenge_method && !opts.code_challenge)
        throw Error("If a code_challenge_method is provided, code_challenge must be included.");
      if (opts.response_type = opts.response_type || "code", opts.client_id = opts.client_id || this._clientId, opts.redirect_uri = opts.redirect_uri || this.redirectUri, Array.isArray(opts.scope))
        opts.scope = opts.scope.join(" ");
      return this.endpoints.oauth2AuthBaseUrl.toString() + "?" + querystring.stringify(opts);
    }
    generateCodeVerifier() {
      throw Error("generateCodeVerifier is removed, please use generateCodeVerifierAsync instead.");
    }
    async generateCodeVerifierAsync() {
      let crypto11 = (0, crypto_1.createCrypto)(), codeVerifier = crypto11.randomBytesBase64(96).replace(/\+/g, "~").replace(/=/g, "_").replace(/\//g, "-"), codeChallenge = (await crypto11.sha256DigestBase64(codeVerifier)).split("=")[0].replace(/\+/g, "-").replace(/\//g, "_");
      return { codeVerifier, codeChallenge };
    }
    getToken(codeOrOptions, callback) {
      let options = typeof codeOrOptions === "string" ? { code: codeOrOptions } : codeOrOptions;
      if (callback)
        this.getTokenAsync(options).then((r4) => callback(null, r4.tokens, r4.res), (e) => callback(e, null, e.response));
      else
        return this.getTokenAsync(options);
    }
    async getTokenAsync(options) {
      let url3 = this.endpoints.oauth2TokenUrl.toString(), headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      }, values2 = {
        client_id: options.client_id || this._clientId,
        code_verifier: options.codeVerifier,
        code: options.code,
        grant_type: "authorization_code",
        redirect_uri: options.redirect_uri || this.redirectUri
      };
      if (this.clientAuthentication === ClientAuthentication.ClientSecretBasic) {
        let basic = Buffer.from(`${this._clientId}:${this._clientSecret}`);
        headers.Authorization = `Basic ${basic.toString("base64")}`;
      }
      if (this.clientAuthentication === ClientAuthentication.ClientSecretPost)
        values2.client_secret = this._clientSecret;
      let res = await this.transporter.request({
        ...OAuth2Client.RETRY_CONFIG,
        method: "POST",
        url: url3,
        data: querystring.stringify(values2),
        headers
      }), tokens = res.data;
      if (res.data && res.data.expires_in)
        tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + res.data.expires_in * 1000, delete tokens.expires_in;
      return this.emit("tokens", tokens), { tokens, res };
    }
    async refreshToken(refreshToken) {
      if (!refreshToken)
        return this.refreshTokenNoCache(refreshToken);
      if (this.refreshTokenPromises.has(refreshToken))
        return this.refreshTokenPromises.get(refreshToken);
      let p4 = this.refreshTokenNoCache(refreshToken).then((r4) => {
        return this.refreshTokenPromises.delete(refreshToken), r4;
      }, (e) => {
        throw this.refreshTokenPromises.delete(refreshToken), e;
      });
      return this.refreshTokenPromises.set(refreshToken, p4), p4;
    }
    async refreshTokenNoCache(refreshToken) {
      var _a2;
      if (!refreshToken)
        throw Error("No refresh token is set.");
      let url3 = this.endpoints.oauth2TokenUrl.toString(), data = {
        refresh_token: refreshToken,
        client_id: this._clientId,
        client_secret: this._clientSecret,
        grant_type: "refresh_token"
      }, res;
      try {
        res = await this.transporter.request({
          ...OAuth2Client.RETRY_CONFIG,
          method: "POST",
          url: url3,
          data: querystring.stringify(data),
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
      } catch (e) {
        if (e instanceof gaxios_1.GaxiosError && e.message === "invalid_grant" && ((_a2 = e.response) === null || _a2 === void 0 ? void 0 : _a2.data) && /ReAuth/i.test(e.response.data.error_description))
          e.message = JSON.stringify(e.response.data);
        throw e;
      }
      let tokens = res.data;
      if (res.data && res.data.expires_in)
        tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + res.data.expires_in * 1000, delete tokens.expires_in;
      return this.emit("tokens", tokens), { tokens, res };
    }
    refreshAccessToken(callback) {
      if (callback)
        this.refreshAccessTokenAsync().then((r4) => callback(null, r4.credentials, r4.res), callback);
      else
        return this.refreshAccessTokenAsync();
    }
    async refreshAccessTokenAsync() {
      let r4 = await this.refreshToken(this.credentials.refresh_token), tokens = r4.tokens;
      return tokens.refresh_token = this.credentials.refresh_token, this.credentials = tokens, { credentials: this.credentials, res: r4.res };
    }
    getAccessToken(callback) {
      if (callback)
        this.getAccessTokenAsync().then((r4) => callback(null, r4.token, r4.res), callback);
      else
        return this.getAccessTokenAsync();
    }
    async getAccessTokenAsync() {
      if (!this.credentials.access_token || this.isTokenExpiring()) {
        if (!this.credentials.refresh_token)
          if (this.refreshHandler) {
            let refreshedAccessToken = await this.processAndValidateRefreshHandler();
            if (refreshedAccessToken === null || refreshedAccessToken === void 0 ? void 0 : refreshedAccessToken.access_token)
              return this.setCredentials(refreshedAccessToken), { token: this.credentials.access_token };
          } else
            throw Error("No refresh token or refresh handler callback is set.");
        let r4 = await this.refreshAccessTokenAsync();
        if (!r4.credentials || r4.credentials && !r4.credentials.access_token)
          throw Error("Could not refresh access token.");
        return { token: r4.credentials.access_token, res: r4.res };
      } else
        return { token: this.credentials.access_token };
    }
    async getRequestHeaders(url3) {
      return (await this.getRequestMetadataAsync(url3)).headers;
    }
    async getRequestMetadataAsync(url3) {
      let thisCreds = this.credentials;
      if (!thisCreds.access_token && !thisCreds.refresh_token && !this.apiKey && !this.refreshHandler)
        throw Error("No access, refresh token, API key or refresh handler callback is set.");
      if (thisCreds.access_token && !this.isTokenExpiring()) {
        thisCreds.token_type = thisCreds.token_type || "Bearer";
        let headers2 = {
          Authorization: thisCreds.token_type + " " + thisCreds.access_token
        };
        return { headers: this.addSharedMetadataHeaders(headers2) };
      }
      if (this.refreshHandler) {
        let refreshedAccessToken = await this.processAndValidateRefreshHandler();
        if (refreshedAccessToken === null || refreshedAccessToken === void 0 ? void 0 : refreshedAccessToken.access_token) {
          this.setCredentials(refreshedAccessToken);
          let headers2 = {
            Authorization: "Bearer " + this.credentials.access_token
          };
          return { headers: this.addSharedMetadataHeaders(headers2) };
        }
      }
      if (this.apiKey)
        return { headers: { "X-Goog-Api-Key": this.apiKey } };
      let r4 = null, tokens = null;
      try {
        r4 = await this.refreshToken(thisCreds.refresh_token), tokens = r4.tokens;
      } catch (err) {
        let e = err;
        if (e.response && (e.response.status === 403 || e.response.status === 404))
          e.message = `Could not refresh access token: ${e.message}`;
        throw e;
      }
      let credentials = this.credentials;
      credentials.token_type = credentials.token_type || "Bearer", tokens.refresh_token = credentials.refresh_token, this.credentials = tokens;
      let headers = {
        Authorization: credentials.token_type + " " + tokens.access_token
      };
      return { headers: this.addSharedMetadataHeaders(headers), res: r4.res };
    }
    static getRevokeTokenUrl(token) {
      return new OAuth2Client().getRevokeTokenURL(token).toString();
    }
    getRevokeTokenURL(token) {
      let url3 = new URL(this.endpoints.oauth2RevokeUrl);
      return url3.searchParams.append("token", token), url3;
    }
    revokeToken(token, callback) {
      let opts = {
        ...OAuth2Client.RETRY_CONFIG,
        url: this.getRevokeTokenURL(token).toString(),
        method: "POST"
      };
      if (callback)
        this.transporter.request(opts).then((r4) => callback(null, r4), callback);
      else
        return this.transporter.request(opts);
    }
    revokeCredentials(callback) {
      if (callback)
        this.revokeCredentialsAsync().then((res) => callback(null, res), callback);
      else
        return this.revokeCredentialsAsync();
    }
    async revokeCredentialsAsync() {
      let token = this.credentials.access_token;
      if (this.credentials = {}, token)
        return this.revokeToken(token);
      else
        throw Error("No access token to revoke.");
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
      let r22;
      try {
        let r4 = await this.getRequestMetadataAsync(opts.url);
        if (opts.headers = opts.headers || {}, r4.headers && r4.headers["x-goog-user-project"])
          opts.headers["x-goog-user-project"] = r4.headers["x-goog-user-project"];
        if (r4.headers && r4.headers.Authorization)
          opts.headers.Authorization = r4.headers.Authorization;
        if (this.apiKey)
          opts.headers["X-Goog-Api-Key"] = this.apiKey;
        r22 = await this.transporter.request(opts);
      } catch (e) {
        let res = e.response;
        if (res) {
          let statusCode = res.status, mayRequireRefresh = this.credentials && this.credentials.access_token && this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure), mayRequireRefreshWithNoRefreshToken = this.credentials && this.credentials.access_token && !this.credentials.refresh_token && (!this.credentials.expiry_date || this.forceRefreshOnFailure) && this.refreshHandler, isReadableStream5 = res.config.data instanceof stream10.Readable, isAuthErr = statusCode === 401 || statusCode === 403;
          if (!reAuthRetried && isAuthErr && !isReadableStream5 && mayRequireRefresh)
            return await this.refreshAccessTokenAsync(), this.requestAsync(opts, !0);
          else if (!reAuthRetried && isAuthErr && !isReadableStream5 && mayRequireRefreshWithNoRefreshToken) {
            let refreshedAccessToken = await this.processAndValidateRefreshHandler();
            if (refreshedAccessToken === null || refreshedAccessToken === void 0 ? void 0 : refreshedAccessToken.access_token)
              this.setCredentials(refreshedAccessToken);
            return this.requestAsync(opts, !0);
          }
        }
        throw e;
      }
      return r22;
    }
    verifyIdToken(options, callback) {
      if (callback && typeof callback !== "function")
        throw Error("This method accepts an options object as the first parameter, which includes the idToken, audience, and maxExpiry.");
      if (callback)
        this.verifyIdTokenAsync(options).then((r4) => callback(null, r4), callback);
      else
        return this.verifyIdTokenAsync(options);
    }
    async verifyIdTokenAsync(options) {
      if (!options.idToken)
        throw Error("The verifyIdToken method requires an ID Token");
      let response7 = await this.getFederatedSignonCertsAsync();
      return await this.verifySignedJwtWithCertsAsync(options.idToken, response7.certs, options.audience, this.issuers, options.maxExpiry);
    }
    async getTokenInfo(accessToken) {
      let { data } = await this.transporter.request({
        ...OAuth2Client.RETRY_CONFIG,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`
        },
        url: this.endpoints.tokenInfoUrl.toString()
      }), info = Object.assign({
        expiry_date: (/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1000,
        scopes: data.scope.split(" ")
      }, data);
      return delete info.expires_in, delete info.scope, info;
    }
    getFederatedSignonCerts(callback) {
      if (callback)
        this.getFederatedSignonCertsAsync().then((r4) => callback(null, r4.certs, r4.res), callback);
      else
        return this.getFederatedSignonCertsAsync();
    }
    async getFederatedSignonCertsAsync() {
      let nowTime = (/* @__PURE__ */ new Date()).getTime(), format3 = (0, crypto_1.hasBrowserCrypto)() ? CertificateFormat.JWK : CertificateFormat.PEM;
      if (this.certificateExpiry && nowTime < this.certificateExpiry.getTime() && this.certificateCacheFormat === format3)
        return { certs: this.certificateCache, format: format3 };
      let res, url3;
      switch (format3) {
        case CertificateFormat.PEM:
          url3 = this.endpoints.oauth2FederatedSignonPemCertsUrl.toString();
          break;
        case CertificateFormat.JWK:
          url3 = this.endpoints.oauth2FederatedSignonJwkCertsUrl.toString();
          break;
        default:
          throw Error(`Unsupported certificate format ${format3}`);
      }
      try {
        res = await this.transporter.request({
          ...OAuth2Client.RETRY_CONFIG,
          url: url3
        });
      } catch (e) {
        if (e instanceof Error)
          e.message = `Failed to retrieve verification certificates: ${e.message}`;
        throw e;
      }
      let cacheControl = res ? res.headers["cache-control"] : void 0, cacheAge = -1;
      if (cacheControl) {
        let regexResult = new RegExp("max-age=([0-9]*)").exec(cacheControl);
        if (regexResult && regexResult.length === 2)
          cacheAge = Number(regexResult[1]) * 1000;
      }
      let certificates = {};
      switch (format3) {
        case CertificateFormat.PEM:
          certificates = res.data;
          break;
        case CertificateFormat.JWK:
          for (let key of res.data.keys)
            certificates[key.kid] = key;
          break;
        default:
          throw Error(`Unsupported certificate format ${format3}`);
      }
      let now = /* @__PURE__ */ new Date;
      return this.certificateExpiry = cacheAge === -1 ? null : new Date(now.getTime() + cacheAge), this.certificateCache = certificates, this.certificateCacheFormat = format3, { certs: certificates, format: format3, res };
    }
    getIapPublicKeys(callback) {
      if (callback)
        this.getIapPublicKeysAsync().then((r4) => callback(null, r4.pubkeys, r4.res), callback);
      else
        return this.getIapPublicKeysAsync();
    }
    async getIapPublicKeysAsync() {
      let res, url3 = this.endpoints.oauth2IapPublicKeyUrl.toString();
      try {
        res = await this.transporter.request({
          ...OAuth2Client.RETRY_CONFIG,
          url: url3
        });
      } catch (e) {
        if (e instanceof Error)
          e.message = `Failed to retrieve verification certificates: ${e.message}`;
        throw e;
      }
      return { pubkeys: res.data, res };
    }
    verifySignedJwtWithCerts() {
      throw Error("verifySignedJwtWithCerts is removed, please use verifySignedJwtWithCertsAsync instead.");
    }
    async verifySignedJwtWithCertsAsync(jwt3, certs, requiredAudience, issuers, maxExpiry) {
      let crypto11 = (0, crypto_1.createCrypto)();
      if (!maxExpiry)
        maxExpiry = OAuth2Client.DEFAULT_MAX_TOKEN_LIFETIME_SECS_;
      let segments = jwt3.split(".");
      if (segments.length !== 3)
        throw Error("Wrong number of segments in token: " + jwt3);
      let signed = segments[0] + "." + segments[1], signature7 = segments[2], envelope, payload;
      try {
        envelope = JSON.parse(crypto11.decodeBase64StringUtf8(segments[0]));
      } catch (err) {
        if (err instanceof Error)
          err.message = `Can't parse token envelope: ${segments[0]}': ${err.message}`;
        throw err;
      }
      if (!envelope)
        throw Error("Can't parse token envelope: " + segments[0]);
      try {
        payload = JSON.parse(crypto11.decodeBase64StringUtf8(segments[1]));
      } catch (err) {
        if (err instanceof Error)
          err.message = `Can't parse token payload '${segments[0]}`;
        throw err;
      }
      if (!payload)
        throw Error("Can't parse token payload: " + segments[1]);
      if (!Object.prototype.hasOwnProperty.call(certs, envelope.kid))
        throw Error("No pem found for envelope: " + JSON.stringify(envelope));
      let cert = certs[envelope.kid];
      if (envelope.alg === "ES256")
        signature7 = formatEcdsa.joseToDer(signature7, "ES256").toString("base64");
      if (!await crypto11.verify(cert, signed, signature7))
        throw Error("Invalid token signature: " + jwt3);
      if (!payload.iat)
        throw Error("No issue time in token: " + JSON.stringify(payload));
      if (!payload.exp)
        throw Error("No expiration time in token: " + JSON.stringify(payload));
      let iat = Number(payload.iat);
      if (isNaN(iat))
        throw Error("iat field using invalid format");
      let exp = Number(payload.exp);
      if (isNaN(exp))
        throw Error("exp field using invalid format");
      let now = (/* @__PURE__ */ new Date()).getTime() / 1000;
      if (exp >= now + maxExpiry)
        throw Error("Expiration time too far in future: " + JSON.stringify(payload));
      let earliest = iat - OAuth2Client.CLOCK_SKEW_SECS_, latest = exp + OAuth2Client.CLOCK_SKEW_SECS_;
      if (now < earliest)
        throw Error("Token used too early, " + now + " < " + earliest + ": " + JSON.stringify(payload));
      if (now > latest)
        throw Error("Token used too late, " + now + " > " + latest + ": " + JSON.stringify(payload));
      if (issuers && issuers.indexOf(payload.iss) < 0)
        throw Error("Invalid issuer, expected one of [" + issuers + "], but got " + payload.iss);
      if (typeof requiredAudience < "u" && requiredAudience !== null) {
        let aud = payload.aud, audVerified = !1;
        if (requiredAudience.constructor === Array)
          audVerified = requiredAudience.indexOf(aud) > -1;
        else
          audVerified = aud === requiredAudience;
        if (!audVerified)
          throw Error("Wrong recipient, payload audience != requiredAudience");
      }
      return new loginticket_1.LoginTicket(envelope, payload);
    }
    async processAndValidateRefreshHandler() {
      if (this.refreshHandler) {
        let accessTokenResponse = await this.refreshHandler();
        if (!accessTokenResponse.access_token)
          throw Error("No access token is returned by the refreshHandler callback.");
        return accessTokenResponse;
      }
      return;
    }
    isTokenExpiring() {
      let expiryDate = this.credentials.expiry_date;
      return expiryDate ? expiryDate <= (/* @__PURE__ */ new Date()).getTime() + this.eagerRefreshThresholdMillis : !1;
    }
  }
  exports.OAuth2Client = OAuth2Client;
  OAuth2Client.GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo";
  OAuth2Client.CLOCK_SKEW_SECS_ = 300;
  OAuth2Client.DEFAULT_MAX_TOKEN_LIFETIME_SECS_ = 86400;
});
