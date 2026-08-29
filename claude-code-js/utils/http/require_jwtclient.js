// var: require_jwtclient
var require_jwtclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.JWT = void 0;
  var gtoken_1 = require_src5(), jwtaccess_1 = require_jwtaccess(), oauth2client_1 = require_oauth2client(), authclient_1 = require_authclient();

  class JWT extends oauth2client_1.OAuth2Client {
    constructor(optionsOrEmail, keyFile, key, scopes, subject, keyId) {
      let opts = optionsOrEmail && typeof optionsOrEmail === "object" ? optionsOrEmail : { email: optionsOrEmail, keyFile, key, keyId, scopes, subject };
      super(opts);
      this.email = opts.email, this.keyFile = opts.keyFile, this.key = opts.key, this.keyId = opts.keyId, this.scopes = opts.scopes, this.subject = opts.subject, this.additionalClaims = opts.additionalClaims, this.credentials = { refresh_token: "jwt-placeholder", expiry_date: 1 };
    }
    createScoped(scopes) {
      let jwt3 = new JWT(this);
      return jwt3.scopes = scopes, jwt3;
    }
    async getRequestMetadataAsync(url3) {
      url3 = this.defaultServicePath ? `https://${this.defaultServicePath}/` : url3;
      let useSelfSignedJWT = !this.hasUserScopes() && url3 || this.useJWTAccessWithScope && this.hasAnyScopes() || this.universeDomain !== authclient_1.DEFAULT_UNIVERSE;
      if (this.subject && this.universeDomain !== authclient_1.DEFAULT_UNIVERSE)
        throw RangeError(`Service Account user is configured for the credential. Domain-wide delegation is not supported in universes other than ${authclient_1.DEFAULT_UNIVERSE}`);
      if (!this.apiKey && useSelfSignedJWT)
        if (this.additionalClaims && this.additionalClaims.target_audience) {
          let { tokens } = await this.refreshToken();
          return {
            headers: this.addSharedMetadataHeaders({
              Authorization: `Bearer ${tokens.id_token}`
            })
          };
        } else {
          if (!this.access)
            this.access = new jwtaccess_1.JWTAccess(this.email, this.key, this.keyId, this.eagerRefreshThresholdMillis);
          let scopes;
          if (this.hasUserScopes())
            scopes = this.scopes;
          else if (!url3)
            scopes = this.defaultScopes;
          let useScopes = this.useJWTAccessWithScope || this.universeDomain !== authclient_1.DEFAULT_UNIVERSE, headers = await this.access.getRequestHeaders(url3 !== null && url3 !== void 0 ? url3 : void 0, this.additionalClaims, useScopes ? scopes : void 0);
          return { headers: this.addSharedMetadataHeaders(headers) };
        }
      else if (this.hasAnyScopes() || this.apiKey)
        return super.getRequestMetadataAsync(url3);
      else
        return { headers: {} };
    }
    async fetchIdToken(targetAudience) {
      let gtoken = new gtoken_1.GoogleToken({
        iss: this.email,
        sub: this.subject,
        scope: this.scopes || this.defaultScopes,
        keyFile: this.keyFile,
        key: this.key,
        additionalClaims: { target_audience: targetAudience },
        transporter: this.transporter
      });
      if (await gtoken.getToken({
        forceRefresh: !0
      }), !gtoken.idToken)
        throw Error("Unknown error: Failed to fetch ID token");
      return gtoken.idToken;
    }
    hasUserScopes() {
      if (!this.scopes)
        return !1;
      return this.scopes.length > 0;
    }
    hasAnyScopes() {
      if (this.scopes && this.scopes.length > 0)
        return !0;
      if (this.defaultScopes && this.defaultScopes.length > 0)
        return !0;
      return !1;
    }
    authorize(callback) {
      if (callback)
        this.authorizeAsync().then((r4) => callback(null, r4), callback);
      else
        return this.authorizeAsync();
    }
    async authorizeAsync() {
      let result = await this.refreshToken();
      if (!result)
        throw Error("No result returned");
      return this.credentials = result.tokens, this.credentials.refresh_token = "jwt-placeholder", this.key = this.gtoken.key, this.email = this.gtoken.iss, result.tokens;
    }
    async refreshTokenNoCache(refreshToken) {
      let gtoken = this.createGToken(), tokens = {
        access_token: (await gtoken.getToken({
          forceRefresh: this.isTokenExpiring()
        })).access_token,
        token_type: "Bearer",
        expiry_date: gtoken.expiresAt,
        id_token: gtoken.idToken
      };
      return this.emit("tokens", tokens), { res: null, tokens };
    }
    createGToken() {
      if (!this.gtoken)
        this.gtoken = new gtoken_1.GoogleToken({
          iss: this.email,
          sub: this.subject,
          scope: this.scopes || this.defaultScopes,
          keyFile: this.keyFile,
          key: this.key,
          additionalClaims: this.additionalClaims,
          transporter: this.transporter
        });
      return this.gtoken;
    }
    fromJSON(json2) {
      if (!json2)
        throw Error("Must pass in a JSON object containing the service account auth settings.");
      if (!json2.client_email)
        throw Error("The incoming JSON object does not contain a client_email field");
      if (!json2.private_key)
        throw Error("The incoming JSON object does not contain a private_key field");
      this.email = json2.client_email, this.key = json2.private_key, this.keyId = json2.private_key_id, this.projectId = json2.project_id, this.quotaProjectId = json2.quota_project_id, this.universeDomain = json2.universe_domain || this.universeDomain;
    }
    fromStream(inputStream, callback) {
      if (callback)
        this.fromStreamAsync(inputStream).then(() => callback(), callback);
      else
        return this.fromStreamAsync(inputStream);
    }
    fromStreamAsync(inputStream) {
      return new Promise((resolve9, reject) => {
        if (!inputStream)
          throw Error("Must pass in a stream containing the service account auth settings.");
        let s2 = "";
        inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => s2 += chunk).on("end", () => {
          try {
            let data = JSON.parse(s2);
            this.fromJSON(data), resolve9();
          } catch (e) {
            reject(e);
          }
        });
      });
    }
    fromAPIKey(apiKey) {
      if (typeof apiKey !== "string")
        throw Error("Must provide an API Key string.");
      this.apiKey = apiKey;
    }
    async getCredentials() {
      if (this.key)
        return { private_key: this.key, client_email: this.email };
      else if (this.keyFile) {
        let creds = await this.createGToken().getCredentials(this.keyFile);
        return { private_key: creds.privateKey, client_email: creds.clientEmail };
      }
      throw Error("A key or a keyFile must be provided to getCredentials.");
    }
  }
  exports.JWT = JWT;
});
