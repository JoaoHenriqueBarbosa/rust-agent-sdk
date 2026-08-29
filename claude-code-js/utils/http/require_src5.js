// var: require_src5
var require_src5 = __commonJS((exports) => {
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
  }, _GoogleToken_instances, _GoogleToken_inFlightRequest, _GoogleToken_getTokenAsync, _GoogleToken_getTokenAsyncInner, _GoogleToken_ensureEmail, _GoogleToken_revokeTokenAsync, _GoogleToken_configure, _GoogleToken_requestToken;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GoogleToken = void 0;
  var fs9 = __require("fs"), gaxios_1 = require_src2(), jws = require_jws(), path12 = __require("path"), util_1 = __require("util"), readFile11 = fs9.readFile ? (0, util_1.promisify)(fs9.readFile) : async () => {
    throw new ErrorWithCode("use key rather than keyFile.", "MISSING_CREDENTIALS");
  }, GOOGLE_TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token", GOOGLE_REVOKE_TOKEN_URL = "https://accounts.google.com/o/oauth2/revoke?token=";

  class ErrorWithCode extends Error {
    constructor(message, code) {
      super(message);
      this.code = code;
    }
  }

  class GoogleToken {
    get accessToken() {
      return this.rawToken ? this.rawToken.access_token : void 0;
    }
    get idToken() {
      return this.rawToken ? this.rawToken.id_token : void 0;
    }
    get tokenType() {
      return this.rawToken ? this.rawToken.token_type : void 0;
    }
    get refreshToken() {
      return this.rawToken ? this.rawToken.refresh_token : void 0;
    }
    constructor(options) {
      _GoogleToken_instances.add(this), this.transporter = {
        request: (opts) => (0, gaxios_1.request)(opts)
      }, _GoogleToken_inFlightRequest.set(this, void 0), __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_configure).call(this, options);
    }
    hasExpired() {
      let now = (/* @__PURE__ */ new Date()).getTime();
      if (this.rawToken && this.expiresAt)
        return now >= this.expiresAt;
      else
        return !0;
    }
    isTokenExpiring() {
      var _a2;
      let now = (/* @__PURE__ */ new Date()).getTime(), eagerRefreshThresholdMillis = (_a2 = this.eagerRefreshThresholdMillis) !== null && _a2 !== void 0 ? _a2 : 0;
      if (this.rawToken && this.expiresAt)
        return this.expiresAt <= now + eagerRefreshThresholdMillis;
      else
        return !0;
    }
    getToken(callback, opts = {}) {
      if (typeof callback === "object")
        opts = callback, callback = void 0;
      if (opts = Object.assign({
        forceRefresh: !1
      }, opts), callback) {
        let cb = callback;
        __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_getTokenAsync).call(this, opts).then((t2) => cb(null, t2), callback);
        return;
      }
      return __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_getTokenAsync).call(this, opts);
    }
    async getCredentials(keyFile) {
      switch (path12.extname(keyFile)) {
        case ".json": {
          let key = await readFile11(keyFile, "utf8"), body = JSON.parse(key), privateKey = body.private_key, clientEmail = body.client_email;
          if (!privateKey || !clientEmail)
            throw new ErrorWithCode("private_key and client_email are required.", "MISSING_CREDENTIALS");
          return { privateKey, clientEmail };
        }
        case ".der":
        case ".crt":
        case ".pem":
          return { privateKey: await readFile11(keyFile, "utf8") };
        case ".p12":
        case ".pfx":
          throw new ErrorWithCode("*.p12 certificates are not supported after v6.1.2. Consider utilizing *.json format or converting *.p12 to *.pem using the OpenSSL CLI.", "UNKNOWN_CERTIFICATE_TYPE");
        default:
          throw new ErrorWithCode("Unknown certificate type. Type is determined based on file extension. Current supported extensions are *.json, and *.pem.", "UNKNOWN_CERTIFICATE_TYPE");
      }
    }
    revokeToken(callback) {
      if (callback) {
        __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_revokeTokenAsync).call(this).then(() => callback(), callback);
        return;
      }
      return __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_revokeTokenAsync).call(this);
    }
  }
  exports.GoogleToken = GoogleToken;
  _GoogleToken_inFlightRequest = /* @__PURE__ */ new WeakMap, _GoogleToken_instances = /* @__PURE__ */ new WeakSet, _GoogleToken_getTokenAsync = async function(opts) {
    if (__classPrivateFieldGet3(this, _GoogleToken_inFlightRequest, "f") && !opts.forceRefresh)
      return __classPrivateFieldGet3(this, _GoogleToken_inFlightRequest, "f");
    try {
      return await __classPrivateFieldSet3(this, _GoogleToken_inFlightRequest, __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_getTokenAsyncInner).call(this, opts), "f");
    } finally {
      __classPrivateFieldSet3(this, _GoogleToken_inFlightRequest, void 0, "f");
    }
  }, _GoogleToken_getTokenAsyncInner = async function(opts) {
    if (this.isTokenExpiring() === !1 && opts.forceRefresh === !1)
      return Promise.resolve(this.rawToken);
    if (!this.key && !this.keyFile)
      throw Error("No key or keyFile set.");
    if (!this.key && this.keyFile) {
      let creds = await this.getCredentials(this.keyFile);
      if (this.key = creds.privateKey, this.iss = creds.clientEmail || this.iss, !creds.clientEmail)
        __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_ensureEmail).call(this);
    }
    return __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_requestToken).call(this);
  }, _GoogleToken_ensureEmail = function() {
    if (!this.iss)
      throw new ErrorWithCode("email is required.", "MISSING_CREDENTIALS");
  }, _GoogleToken_revokeTokenAsync = async function() {
    if (!this.accessToken)
      throw Error("No token to revoke.");
    let url3 = GOOGLE_REVOKE_TOKEN_URL + this.accessToken;
    await this.transporter.request({
      url: url3,
      retry: !0
    }), __classPrivateFieldGet3(this, _GoogleToken_instances, "m", _GoogleToken_configure).call(this, {
      email: this.iss,
      sub: this.sub,
      key: this.key,
      keyFile: this.keyFile,
      scope: this.scope,
      additionalClaims: this.additionalClaims
    });
  }, _GoogleToken_configure = function(options = {}) {
    if (this.keyFile = options.keyFile, this.key = options.key, this.rawToken = void 0, this.iss = options.email || options.iss, this.sub = options.sub, this.additionalClaims = options.additionalClaims, typeof options.scope === "object")
      this.scope = options.scope.join(" ");
    else
      this.scope = options.scope;
    if (this.eagerRefreshThresholdMillis = options.eagerRefreshThresholdMillis, options.transporter)
      this.transporter = options.transporter;
  }, _GoogleToken_requestToken = async function() {
    var _a2, _b;
    let iat = Math.floor((/* @__PURE__ */ new Date()).getTime() / 1000), additionalClaims = this.additionalClaims || {}, payload = Object.assign({
      iss: this.iss,
      scope: this.scope,
      aud: GOOGLE_TOKEN_URL,
      exp: iat + 3600,
      iat,
      sub: this.sub
    }, additionalClaims), signedJWT = jws.sign({
      header: { alg: "RS256" },
      payload,
      secret: this.key
    });
    try {
      let r4 = await this.transporter.request({
        method: "POST",
        url: GOOGLE_TOKEN_URL,
        data: {
          grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
          assertion: signedJWT
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        responseType: "json",
        retryConfig: {
          httpMethodsToRetry: ["POST"]
        }
      });
      return this.rawToken = r4.data, this.expiresAt = r4.data.expires_in === null || r4.data.expires_in === void 0 ? void 0 : (iat + r4.data.expires_in) * 1000, this.rawToken;
    } catch (e) {
      this.rawToken = void 0, this.tokenExpires = void 0;
      let body = e.response && ((_a2 = e.response) === null || _a2 === void 0 ? void 0 : _a2.data) ? (_b = e.response) === null || _b === void 0 ? void 0 : _b.data : {};
      if (body.error) {
        let desc = body.error_description ? `: ${body.error_description}` : "";
        e.message = `${body.error}${desc}`;
      }
      throw e;
    }
  };
});
