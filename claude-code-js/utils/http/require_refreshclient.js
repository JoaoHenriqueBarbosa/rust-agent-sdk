// var: require_refreshclient
var require_refreshclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.UserRefreshClient = exports.USER_REFRESH_ACCOUNT_TYPE = void 0;
  var oauth2client_1 = require_oauth2client(), querystring_1 = __require("querystring");
  exports.USER_REFRESH_ACCOUNT_TYPE = "authorized_user";

  class UserRefreshClient extends oauth2client_1.OAuth2Client {
    constructor(optionsOrClientId, clientSecret, refreshToken, eagerRefreshThresholdMillis, forceRefreshOnFailure) {
      let opts = optionsOrClientId && typeof optionsOrClientId === "object" ? optionsOrClientId : {
        clientId: optionsOrClientId,
        clientSecret,
        refreshToken,
        eagerRefreshThresholdMillis,
        forceRefreshOnFailure
      };
      super(opts);
      this._refreshToken = opts.refreshToken, this.credentials.refresh_token = opts.refreshToken;
    }
    async refreshTokenNoCache(refreshToken) {
      return super.refreshTokenNoCache(this._refreshToken);
    }
    async fetchIdToken(targetAudience) {
      return (await this.transporter.request({
        ...UserRefreshClient.RETRY_CONFIG,
        url: this.endpoints.oauth2TokenUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: (0, querystring_1.stringify)({
          client_id: this._clientId,
          client_secret: this._clientSecret,
          grant_type: "refresh_token",
          refresh_token: this._refreshToken,
          target_audience: targetAudience
        })
      })).data.id_token;
    }
    fromJSON(json2) {
      if (!json2)
        throw Error("Must pass in a JSON object containing the user refresh token");
      if (json2.type !== "authorized_user")
        throw Error('The incoming JSON object does not have the "authorized_user" type');
      if (!json2.client_id)
        throw Error("The incoming JSON object does not contain a client_id field");
      if (!json2.client_secret)
        throw Error("The incoming JSON object does not contain a client_secret field");
      if (!json2.refresh_token)
        throw Error("The incoming JSON object does not contain a refresh_token field");
      this._clientId = json2.client_id, this._clientSecret = json2.client_secret, this._refreshToken = json2.refresh_token, this.credentials.refresh_token = json2.refresh_token, this.quotaProjectId = json2.quota_project_id, this.universeDomain = json2.universe_domain || this.universeDomain;
    }
    fromStream(inputStream, callback) {
      if (callback)
        this.fromStreamAsync(inputStream).then(() => callback(), callback);
      else
        return this.fromStreamAsync(inputStream);
    }
    async fromStreamAsync(inputStream) {
      return new Promise((resolve9, reject) => {
        if (!inputStream)
          return reject(Error("Must pass in a stream containing the user refresh token."));
        let s2 = "";
        inputStream.setEncoding("utf8").on("error", reject).on("data", (chunk) => s2 += chunk).on("end", () => {
          try {
            let data = JSON.parse(s2);
            return this.fromJSON(data), resolve9();
          } catch (err) {
            return reject(err);
          }
        });
      });
    }
    static fromJSON(json2) {
      let client14 = new UserRefreshClient;
      return client14.fromJSON(json2), client14;
    }
  }
  exports.UserRefreshClient = UserRefreshClient;
});
