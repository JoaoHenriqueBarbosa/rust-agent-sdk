// var: require_computeclient
var require_computeclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.Compute = void 0;
  var gaxios_1 = require_src2(), gcpMetadata = require_src4(), oauth2client_1 = require_oauth2client();

  class Compute extends oauth2client_1.OAuth2Client {
    constructor(options = {}) {
      super(options);
      this.credentials = { expiry_date: 1, refresh_token: "compute-placeholder" }, this.serviceAccountEmail = options.serviceAccountEmail || "default", this.scopes = Array.isArray(options.scopes) ? options.scopes : options.scopes ? [options.scopes] : [];
    }
    async refreshTokenNoCache(refreshToken) {
      let tokenPath = `service-accounts/${this.serviceAccountEmail}/token`, data;
      try {
        let instanceOptions = {
          property: tokenPath
        };
        if (this.scopes.length > 0)
          instanceOptions.params = {
            scopes: this.scopes.join(",")
          };
        data = await gcpMetadata.instance(instanceOptions);
      } catch (e) {
        if (e instanceof gaxios_1.GaxiosError)
          e.message = `Could not refresh access token: ${e.message}`, this.wrapError(e);
        throw e;
      }
      let tokens = data;
      if (data && data.expires_in)
        tokens.expiry_date = (/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1000, delete tokens.expires_in;
      return this.emit("tokens", tokens), { tokens, res: null };
    }
    async fetchIdToken(targetAudience) {
      let idTokenPath = `service-accounts/${this.serviceAccountEmail}/identity?format=full&audience=${targetAudience}`, idToken;
      try {
        let instanceOptions = {
          property: idTokenPath
        };
        idToken = await gcpMetadata.instance(instanceOptions);
      } catch (e) {
        if (e instanceof Error)
          e.message = `Could not fetch ID token: ${e.message}`;
        throw e;
      }
      return idToken;
    }
    wrapError(e) {
      let res = e.response;
      if (res && res.status) {
        if (e.status = res.status, res.status === 403)
          e.message = "A Forbidden error was returned while attempting to retrieve an access token for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have the correct permission scopes specified: " + e.message;
        else if (res.status === 404)
          e.message = "A Not Found error was returned while attempting to retrieve an accesstoken for the Compute Engine built-in service account. This may be because the Compute Engine instance does not have any permission scopes specified: " + e.message;
      }
    }
  }
  exports.Compute = Compute;
});
