// var: require_googleauth
var require_googleauth = __commonJS((exports) => {
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
  }, _GoogleAuth_instances, _GoogleAuth_pendingAuthClient, _GoogleAuth_prepareAndCacheClient, _GoogleAuth_determineClient;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GoogleAuth = exports.GoogleAuthExceptionMessages = exports.CLOUD_SDK_CLIENT_ID = void 0;
  var child_process_1 = __require("child_process"), fs9 = __require("fs"), gcpMetadata = require_src4(), os5 = __require("os"), path12 = __require("path"), crypto_1 = require_crypto3(), transporters_1 = require_transporters(), computeclient_1 = require_computeclient(), idtokenclient_1 = require_idtokenclient(), envDetect_1 = require_envDetect(), jwtclient_1 = require_jwtclient(), refreshclient_1 = require_refreshclient(), impersonated_1 = require_impersonated(), externalclient_1 = require_externalclient(), baseexternalclient_1 = require_baseexternalclient(), authclient_1 = require_authclient(), externalAccountAuthorizedUserClient_1 = require_externalAccountAuthorizedUserClient(), util_1 = require_util2();
  exports.CLOUD_SDK_CLIENT_ID = "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com";
  exports.GoogleAuthExceptionMessages = {
    API_KEY_WITH_CREDENTIALS: "API Keys and Credentials are mutually exclusive authentication methods and cannot be used together.",
    NO_PROJECT_ID_FOUND: `Unable to detect a Project Id in the current environment. 
To learn more about authentication and Google APIs, visit: 
https://cloud.google.com/docs/authentication/getting-started`,
    NO_CREDENTIALS_FOUND: `Unable to find credentials in current environment. 
To learn more about authentication and Google APIs, visit: 
https://cloud.google.com/docs/authentication/getting-started`,
    NO_ADC_FOUND: "Could not load the default credentials. Browse to https://cloud.google.com/docs/authentication/getting-started for more information.",
    NO_UNIVERSE_DOMAIN_FOUND: `Unable to detect a Universe Domain in the current environment.
To learn more about Universe Domain retrieval, visit: 
https://cloud.google.com/compute/docs/metadata/predefined-metadata-keys`
  };

  class GoogleAuth {
    get isGCE() {
      return this.checkIsGCE;
    }
    constructor(opts = {}) {
      if (_GoogleAuth_instances.add(this), this.checkIsGCE = void 0, this.jsonContent = null, this.cachedCredential = null, _GoogleAuth_pendingAuthClient.set(this, null), this.clientOptions = {}, this._cachedProjectId = opts.projectId || null, this.cachedCredential = opts.authClient || null, this.keyFilename = opts.keyFilename || opts.keyFile, this.scopes = opts.scopes, this.clientOptions = opts.clientOptions || {}, this.jsonContent = opts.credentials || null, this.apiKey = opts.apiKey || this.clientOptions.apiKey || null, this.apiKey && (this.jsonContent || this.clientOptions.credentials))
        throw RangeError(exports.GoogleAuthExceptionMessages.API_KEY_WITH_CREDENTIALS);
      if (opts.universeDomain)
        this.clientOptions.universeDomain = opts.universeDomain;
    }
    setGapicJWTValues(client14) {
      client14.defaultServicePath = this.defaultServicePath, client14.useJWTAccessWithScope = this.useJWTAccessWithScope, client14.defaultScopes = this.defaultScopes;
    }
    getProjectId(callback) {
      if (callback)
        this.getProjectIdAsync().then((r4) => callback(null, r4), callback);
      else
        return this.getProjectIdAsync();
    }
    async getProjectIdOptional() {
      try {
        return await this.getProjectId();
      } catch (e) {
        if (e instanceof Error && e.message === exports.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND)
          return null;
        else
          throw e;
      }
    }
    async findAndCacheProjectId() {
      let projectId = null;
      if (projectId || (projectId = await this.getProductionProjectId()), projectId || (projectId = await this.getFileProjectId()), projectId || (projectId = await this.getDefaultServiceProjectId()), projectId || (projectId = await this.getGCEProjectId()), projectId || (projectId = await this.getExternalAccountClientProjectId()), projectId)
        return this._cachedProjectId = projectId, projectId;
      else
        throw Error(exports.GoogleAuthExceptionMessages.NO_PROJECT_ID_FOUND);
    }
    async getProjectIdAsync() {
      if (this._cachedProjectId)
        return this._cachedProjectId;
      if (!this._findProjectIdPromise)
        this._findProjectIdPromise = this.findAndCacheProjectId();
      return this._findProjectIdPromise;
    }
    async getUniverseDomainFromMetadataServer() {
      var _a2;
      let universeDomain;
      try {
        universeDomain = await gcpMetadata.universe("universe-domain"), universeDomain || (universeDomain = authclient_1.DEFAULT_UNIVERSE);
      } catch (e) {
        if (e && ((_a2 = e === null || e === void 0 ? void 0 : e.response) === null || _a2 === void 0 ? void 0 : _a2.status) === 404)
          universeDomain = authclient_1.DEFAULT_UNIVERSE;
        else
          throw e;
      }
      return universeDomain;
    }
    async getUniverseDomain() {
      let universeDomain = (0, util_1.originalOrCamelOptions)(this.clientOptions).get("universe_domain");
      try {
        universeDomain !== null && universeDomain !== void 0 || (universeDomain = (await this.getClient()).universeDomain);
      } catch (_a2) {
        universeDomain !== null && universeDomain !== void 0 || (universeDomain = authclient_1.DEFAULT_UNIVERSE);
      }
      return universeDomain;
    }
    getAnyScopes() {
      return this.scopes || this.defaultScopes;
    }
    getApplicationDefault(optionsOrCallback = {}, callback) {
      let options;
      if (typeof optionsOrCallback === "function")
        callback = optionsOrCallback;
      else
        options = optionsOrCallback;
      if (callback)
        this.getApplicationDefaultAsync(options).then((r4) => callback(null, r4.credential, r4.projectId), callback);
      else
        return this.getApplicationDefaultAsync(options);
    }
    async getApplicationDefaultAsync(options = {}) {
      if (this.cachedCredential)
        return await __classPrivateFieldGet3(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, this.cachedCredential, null);
      let credential;
      if (credential = await this._tryGetApplicationCredentialsFromEnvironmentVariable(options), credential) {
        if (credential instanceof jwtclient_1.JWT)
          credential.scopes = this.scopes;
        else if (credential instanceof baseexternalclient_1.BaseExternalAccountClient)
          credential.scopes = this.getAnyScopes();
        return await __classPrivateFieldGet3(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, credential);
      }
      if (credential = await this._tryGetApplicationCredentialsFromWellKnownFile(options), credential) {
        if (credential instanceof jwtclient_1.JWT)
          credential.scopes = this.scopes;
        else if (credential instanceof baseexternalclient_1.BaseExternalAccountClient)
          credential.scopes = this.getAnyScopes();
        return await __classPrivateFieldGet3(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, credential);
      }
      if (await this._checkIsGCE())
        return options.scopes = this.getAnyScopes(), await __classPrivateFieldGet3(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, new computeclient_1.Compute(options));
      throw Error(exports.GoogleAuthExceptionMessages.NO_ADC_FOUND);
    }
    async _checkIsGCE() {
      if (this.checkIsGCE === void 0)
        this.checkIsGCE = gcpMetadata.getGCPResidency() || await gcpMetadata.isAvailable();
      return this.checkIsGCE;
    }
    async _tryGetApplicationCredentialsFromEnvironmentVariable(options) {
      let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.google_application_credentials;
      if (!credentialsPath || credentialsPath.length === 0)
        return null;
      try {
        return this._getApplicationCredentialsFromFilePath(credentialsPath, options);
      } catch (e) {
        if (e instanceof Error)
          e.message = `Unable to read the credential file specified by the GOOGLE_APPLICATION_CREDENTIALS environment variable: ${e.message}`;
        throw e;
      }
    }
    async _tryGetApplicationCredentialsFromWellKnownFile(options) {
      let location = null;
      if (this._isWindows())
        location = process.env.APPDATA;
      else {
        let home = process.env.HOME;
        if (home)
          location = path12.join(home, ".config");
      }
      if (location) {
        if (location = path12.join(location, "gcloud", "application_default_credentials.json"), !fs9.existsSync(location))
          location = null;
      }
      if (!location)
        return null;
      return await this._getApplicationCredentialsFromFilePath(location, options);
    }
    async _getApplicationCredentialsFromFilePath(filePath, options = {}) {
      if (!filePath || filePath.length === 0)
        throw Error("The file path is invalid.");
      try {
        if (filePath = fs9.realpathSync(filePath), !fs9.lstatSync(filePath).isFile())
          throw Error();
      } catch (err) {
        if (err instanceof Error)
          err.message = `The file at ${filePath} does not exist, or it is not a file. ${err.message}`;
        throw err;
      }
      let readStream2 = fs9.createReadStream(filePath);
      return this.fromStream(readStream2, options);
    }
    fromImpersonatedJSON(json2) {
      var _a2, _b, _c, _d;
      if (!json2)
        throw Error("Must pass in a JSON object containing an  impersonated refresh token");
      if (json2.type !== impersonated_1.IMPERSONATED_ACCOUNT_TYPE)
        throw Error(`The incoming JSON object does not have the "${impersonated_1.IMPERSONATED_ACCOUNT_TYPE}" type`);
      if (!json2.source_credentials)
        throw Error("The incoming JSON object does not contain a source_credentials field");
      if (!json2.service_account_impersonation_url)
        throw Error("The incoming JSON object does not contain a service_account_impersonation_url field");
      let sourceClient = this.fromJSON(json2.source_credentials);
      if (((_a2 = json2.service_account_impersonation_url) === null || _a2 === void 0 ? void 0 : _a2.length) > 256)
        throw RangeError(`Target principal is too long: ${json2.service_account_impersonation_url}`);
      let targetPrincipal = (_c = (_b = /(?<target>[^/]+):(generateAccessToken|generateIdToken)$/.exec(json2.service_account_impersonation_url)) === null || _b === void 0 ? void 0 : _b.groups) === null || _c === void 0 ? void 0 : _c.target;
      if (!targetPrincipal)
        throw RangeError(`Cannot extract target principal from ${json2.service_account_impersonation_url}`);
      let targetScopes = (_d = this.getAnyScopes()) !== null && _d !== void 0 ? _d : [];
      return new impersonated_1.Impersonated({
        ...json2,
        sourceClient,
        targetPrincipal,
        targetScopes: Array.isArray(targetScopes) ? targetScopes : [targetScopes]
      });
    }
    fromJSON(json2, options = {}) {
      let client14, preferredUniverseDomain = (0, util_1.originalOrCamelOptions)(options).get("universe_domain");
      if (json2.type === refreshclient_1.USER_REFRESH_ACCOUNT_TYPE)
        client14 = new refreshclient_1.UserRefreshClient(options), client14.fromJSON(json2);
      else if (json2.type === impersonated_1.IMPERSONATED_ACCOUNT_TYPE)
        client14 = this.fromImpersonatedJSON(json2);
      else if (json2.type === baseexternalclient_1.EXTERNAL_ACCOUNT_TYPE)
        client14 = externalclient_1.ExternalAccountClient.fromJSON(json2, options), client14.scopes = this.getAnyScopes();
      else if (json2.type === externalAccountAuthorizedUserClient_1.EXTERNAL_ACCOUNT_AUTHORIZED_USER_TYPE)
        client14 = new externalAccountAuthorizedUserClient_1.ExternalAccountAuthorizedUserClient(json2, options);
      else
        options.scopes = this.scopes, client14 = new jwtclient_1.JWT(options), this.setGapicJWTValues(client14), client14.fromJSON(json2);
      if (preferredUniverseDomain)
        client14.universeDomain = preferredUniverseDomain;
      return client14;
    }
    _cacheClientFromJSON(json2, options) {
      let client14 = this.fromJSON(json2, options);
      return this.jsonContent = json2, this.cachedCredential = client14, client14;
    }
    fromStream(inputStream, optionsOrCallback = {}, callback) {
      let options = {};
      if (typeof optionsOrCallback === "function")
        callback = optionsOrCallback;
      else
        options = optionsOrCallback;
      if (callback)
        this.fromStreamAsync(inputStream, options).then((r4) => callback(null, r4), callback);
      else
        return this.fromStreamAsync(inputStream, options);
    }
    fromStreamAsync(inputStream, options) {
      return new Promise((resolve9, reject) => {
        if (!inputStream)
          throw Error("Must pass in a stream containing the Google auth settings.");
        let chunks = [];
        inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => chunks.push(chunk)).on("end", () => {
          try {
            try {
              let data = JSON.parse(chunks.join("")), r4 = this._cacheClientFromJSON(data, options);
              return resolve9(r4);
            } catch (err) {
              if (!this.keyFilename)
                throw err;
              let client14 = new jwtclient_1.JWT({
                ...this.clientOptions,
                keyFile: this.keyFilename
              });
              return this.cachedCredential = client14, this.setGapicJWTValues(client14), resolve9(client14);
            }
          } catch (err) {
            return reject(err);
          }
        });
      });
    }
    fromAPIKey(apiKey, options = {}) {
      return new jwtclient_1.JWT({ ...options, apiKey });
    }
    _isWindows() {
      let sys = os5.platform();
      if (sys && sys.length >= 3) {
        if (sys.substring(0, 3).toLowerCase() === "win")
          return !0;
      }
      return !1;
    }
    async getDefaultServiceProjectId() {
      return new Promise((resolve9) => {
        (0, child_process_1.exec)("gcloud config config-helper --format json", (err, stdout) => {
          if (!err && stdout)
            try {
              let projectId = JSON.parse(stdout).configuration.properties.core.project;
              resolve9(projectId);
              return;
            } catch (e) {}
          resolve9(null);
        });
      });
    }
    getProductionProjectId() {
      return process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || process.env.gcloud_project || process.env.google_cloud_project;
    }
    async getFileProjectId() {
      if (this.cachedCredential)
        return this.cachedCredential.projectId;
      if (this.keyFilename) {
        let creds = await this.getClient();
        if (creds && creds.projectId)
          return creds.projectId;
      }
      let r4 = await this._tryGetApplicationCredentialsFromEnvironmentVariable();
      if (r4)
        return r4.projectId;
      else
        return null;
    }
    async getExternalAccountClientProjectId() {
      if (!this.jsonContent || this.jsonContent.type !== baseexternalclient_1.EXTERNAL_ACCOUNT_TYPE)
        return null;
      return await (await this.getClient()).getProjectId();
    }
    async getGCEProjectId() {
      try {
        return await gcpMetadata.project("project-id");
      } catch (e) {
        return null;
      }
    }
    getCredentials(callback) {
      if (callback)
        this.getCredentialsAsync().then((r4) => callback(null, r4), callback);
      else
        return this.getCredentialsAsync();
    }
    async getCredentialsAsync() {
      let client14 = await this.getClient();
      if (client14 instanceof impersonated_1.Impersonated)
        return { client_email: client14.getTargetPrincipal() };
      if (client14 instanceof baseexternalclient_1.BaseExternalAccountClient) {
        let serviceAccountEmail = client14.getServiceAccountEmail();
        if (serviceAccountEmail)
          return {
            client_email: serviceAccountEmail,
            universe_domain: client14.universeDomain
          };
      }
      if (this.jsonContent)
        return {
          client_email: this.jsonContent.client_email,
          private_key: this.jsonContent.private_key,
          universe_domain: this.jsonContent.universe_domain
        };
      if (await this._checkIsGCE()) {
        let [client_email, universe_domain] = await Promise.all([
          gcpMetadata.instance("service-accounts/default/email"),
          this.getUniverseDomain()
        ]);
        return { client_email, universe_domain };
      }
      throw Error(exports.GoogleAuthExceptionMessages.NO_CREDENTIALS_FOUND);
    }
    async getClient() {
      if (this.cachedCredential)
        return this.cachedCredential;
      __classPrivateFieldSet3(this, _GoogleAuth_pendingAuthClient, __classPrivateFieldGet3(this, _GoogleAuth_pendingAuthClient, "f") || __classPrivateFieldGet3(this, _GoogleAuth_instances, "m", _GoogleAuth_determineClient).call(this), "f");
      try {
        return await __classPrivateFieldGet3(this, _GoogleAuth_pendingAuthClient, "f");
      } finally {
        __classPrivateFieldSet3(this, _GoogleAuth_pendingAuthClient, null, "f");
      }
    }
    async getIdTokenClient(targetAudience) {
      let client14 = await this.getClient();
      if (!("fetchIdToken" in client14))
        throw Error("Cannot fetch ID token in this environment, use GCE or set the GOOGLE_APPLICATION_CREDENTIALS environment variable to a service account credentials JSON file.");
      return new idtokenclient_1.IdTokenClient({ targetAudience, idTokenProvider: client14 });
    }
    async getAccessToken() {
      return (await (await this.getClient()).getAccessToken()).token;
    }
    async getRequestHeaders(url3) {
      return (await this.getClient()).getRequestHeaders(url3);
    }
    async authorizeRequest(opts) {
      opts = opts || {};
      let url3 = opts.url || opts.uri, headers = await (await this.getClient()).getRequestHeaders(url3);
      return opts.headers = Object.assign(opts.headers || {}, headers), opts;
    }
    async request(opts) {
      return (await this.getClient()).request(opts);
    }
    getEnv() {
      return (0, envDetect_1.getEnv)();
    }
    async sign(data, endpoint7) {
      let client14 = await this.getClient(), universe = await this.getUniverseDomain();
      if (endpoint7 = endpoint7 || `https://iamcredentials.${universe}/v1/projects/-/serviceAccounts/`, client14 instanceof impersonated_1.Impersonated)
        return (await client14.sign(data)).signedBlob;
      let crypto11 = (0, crypto_1.createCrypto)();
      if (client14 instanceof jwtclient_1.JWT && client14.key)
        return await crypto11.sign(client14.key, data);
      let creds = await this.getCredentials();
      if (!creds.client_email)
        throw Error("Cannot sign data without `client_email`.");
      return this.signBlob(crypto11, creds.client_email, data, endpoint7);
    }
    async signBlob(crypto11, emailOrUniqueId, data, endpoint7) {
      let url3 = new URL(endpoint7 + `${emailOrUniqueId}:signBlob`);
      return (await this.request({
        method: "POST",
        url: url3.href,
        data: {
          payload: crypto11.encodeBase64StringUtf8(data)
        },
        retry: !0,
        retryConfig: {
          httpMethodsToRetry: ["POST"]
        }
      })).data.signedBlob;
    }
  }
  exports.GoogleAuth = GoogleAuth;
  _GoogleAuth_pendingAuthClient = /* @__PURE__ */ new WeakMap, _GoogleAuth_instances = /* @__PURE__ */ new WeakSet, _GoogleAuth_prepareAndCacheClient = async function(credential, quotaProjectIdOverride = process.env.GOOGLE_CLOUD_QUOTA_PROJECT || null) {
    let projectId = await this.getProjectIdOptional();
    if (quotaProjectIdOverride)
      credential.quotaProjectId = quotaProjectIdOverride;
    return this.cachedCredential = credential, { credential, projectId };
  }, _GoogleAuth_determineClient = async function() {
    if (this.jsonContent)
      return this._cacheClientFromJSON(this.jsonContent, this.clientOptions);
    else if (this.keyFilename) {
      let filePath = path12.resolve(this.keyFilename), stream10 = fs9.createReadStream(filePath);
      return await this.fromStreamAsync(stream10, this.clientOptions);
    } else if (this.apiKey) {
      let client14 = await this.fromAPIKey(this.apiKey, this.clientOptions);
      client14.scopes = this.scopes;
      let { credential } = await __classPrivateFieldGet3(this, _GoogleAuth_instances, "m", _GoogleAuth_prepareAndCacheClient).call(this, client14);
      return credential;
    } else {
      let { credential } = await this.getApplicationDefaultAsync(this.clientOptions);
      return credential;
    }
  };
  GoogleAuth.DefaultTransporter = transporters_1.DefaultTransporter;
});
