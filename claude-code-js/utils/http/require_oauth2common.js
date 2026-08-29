// var: require_oauth2common
var require_oauth2common = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.OAuthClientAuthHandler = void 0;
  exports.getErrorFromOAuthErrorResponse = getErrorFromOAuthErrorResponse;
  var querystring = __require("querystring"), crypto_1 = require_crypto3(), METHODS_SUPPORTING_REQUEST_BODY = ["PUT", "POST", "PATCH"];

  class OAuthClientAuthHandler {
    constructor(clientAuthentication) {
      this.clientAuthentication = clientAuthentication, this.crypto = (0, crypto_1.createCrypto)();
    }
    applyClientAuthenticationOptions(opts, bearerToken) {
      if (this.injectAuthenticatedHeaders(opts, bearerToken), !bearerToken)
        this.injectAuthenticatedRequestBody(opts);
    }
    injectAuthenticatedHeaders(opts, bearerToken) {
      var _a2;
      if (bearerToken)
        opts.headers = opts.headers || {}, Object.assign(opts.headers, {
          Authorization: `Bearer ${bearerToken}}`
        });
      else if (((_a2 = this.clientAuthentication) === null || _a2 === void 0 ? void 0 : _a2.confidentialClientType) === "basic") {
        opts.headers = opts.headers || {};
        let clientId = this.clientAuthentication.clientId, clientSecret = this.clientAuthentication.clientSecret || "", base64EncodedCreds = this.crypto.encodeBase64StringUtf8(`${clientId}:${clientSecret}`);
        Object.assign(opts.headers, {
          Authorization: `Basic ${base64EncodedCreds}`
        });
      }
    }
    injectAuthenticatedRequestBody(opts) {
      var _a2;
      if (((_a2 = this.clientAuthentication) === null || _a2 === void 0 ? void 0 : _a2.confidentialClientType) === "request-body") {
        let method = (opts.method || "GET").toUpperCase();
        if (METHODS_SUPPORTING_REQUEST_BODY.indexOf(method) !== -1) {
          let contentType, headers = opts.headers || {};
          for (let key in headers)
            if (key.toLowerCase() === "content-type" && headers[key]) {
              contentType = headers[key].toLowerCase();
              break;
            }
          if (contentType === "application/x-www-form-urlencoded") {
            opts.data = opts.data || "";
            let data = querystring.parse(opts.data);
            Object.assign(data, {
              client_id: this.clientAuthentication.clientId,
              client_secret: this.clientAuthentication.clientSecret || ""
            }), opts.data = querystring.stringify(data);
          } else if (contentType === "application/json")
            opts.data = opts.data || {}, Object.assign(opts.data, {
              client_id: this.clientAuthentication.clientId,
              client_secret: this.clientAuthentication.clientSecret || ""
            });
          else
            throw Error(`${contentType} content-types are not supported with ${this.clientAuthentication.confidentialClientType} client authentication`);
        } else
          throw Error(`${method} HTTP method does not support ${this.clientAuthentication.confidentialClientType} client authentication`);
      }
    }
    static get RETRY_CONFIG() {
      return {
        retry: !0,
        retryConfig: {
          httpMethodsToRetry: ["GET", "PUT", "POST", "HEAD", "OPTIONS", "DELETE"]
        }
      };
    }
  }
