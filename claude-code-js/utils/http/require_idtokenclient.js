// var: require_idtokenclient
var require_idtokenclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.IdTokenClient = void 0;
  var oauth2client_1 = require_oauth2client();

  class IdTokenClient extends oauth2client_1.OAuth2Client {
    constructor(options) {
      super(options);
      this.targetAudience = options.targetAudience, this.idTokenProvider = options.idTokenProvider;
    }
    async getRequestMetadataAsync(url3) {
      if (!this.credentials.id_token || !this.credentials.expiry_date || this.isTokenExpiring()) {
        let idToken = await this.idTokenProvider.fetchIdToken(this.targetAudience);
        this.credentials = {
          id_token: idToken,
          expiry_date: this.getIdTokenExpiryDate(idToken)
        };
      }
      return { headers: {
        Authorization: "Bearer " + this.credentials.id_token
      } };
    }
    getIdTokenExpiryDate(idToken) {
      let payloadB64 = idToken.split(".")[1];
      if (payloadB64)
        return JSON.parse(Buffer.from(payloadB64, "base64").toString("ascii")).exp * 1000;
    }
  }
  exports.IdTokenClient = IdTokenClient;
});
