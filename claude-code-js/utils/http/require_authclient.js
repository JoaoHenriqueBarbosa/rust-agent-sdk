// var: require_authclient
var require_authclient = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.AuthClient = exports.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = exports.DEFAULT_UNIVERSE = void 0;
  var events_1 = __require("events"), gaxios_1 = require_src2(), transporters_1 = require_transporters(), util_1 = require_util2();
  exports.DEFAULT_UNIVERSE = "googleapis.com";
  exports.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS = 300000;

  class AuthClient extends events_1.EventEmitter {
    constructor(opts = {}) {
      var _a2, _b, _c, _d, _e;
      super();
      this.credentials = {}, this.eagerRefreshThresholdMillis = exports.DEFAULT_EAGER_REFRESH_THRESHOLD_MILLIS, this.forceRefreshOnFailure = !1, this.universeDomain = exports.DEFAULT_UNIVERSE;
      let options = (0, util_1.originalOrCamelOptions)(opts);
      if (this.apiKey = opts.apiKey, this.projectId = (_a2 = options.get("project_id")) !== null && _a2 !== void 0 ? _a2 : null, this.quotaProjectId = options.get("quota_project_id"), this.credentials = (_b = options.get("credentials")) !== null && _b !== void 0 ? _b : {}, this.universeDomain = (_c = options.get("universe_domain")) !== null && _c !== void 0 ? _c : exports.DEFAULT_UNIVERSE, this.transporter = (_d = opts.transporter) !== null && _d !== void 0 ? _d : new transporters_1.DefaultTransporter, opts.transporterOptions)
        this.transporter.defaults = opts.transporterOptions;
      if (opts.eagerRefreshThresholdMillis)
        this.eagerRefreshThresholdMillis = opts.eagerRefreshThresholdMillis;
      this.forceRefreshOnFailure = (_e = opts.forceRefreshOnFailure) !== null && _e !== void 0 ? _e : !1;
    }
    get gaxios() {
      if (this.transporter instanceof gaxios_1.Gaxios)
        return this.transporter;
      else if (this.transporter instanceof transporters_1.DefaultTransporter)
        return this.transporter.instance;
      else if ("instance" in this.transporter && this.transporter.instance instanceof gaxios_1.Gaxios)
        return this.transporter.instance;
      return null;
    }
    setCredentials(credentials) {
      this.credentials = credentials;
    }
    addSharedMetadataHeaders(headers) {
      if (!headers["x-goog-user-project"] && this.quotaProjectId)
        headers["x-goog-user-project"] = this.quotaProjectId;
      return headers;
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
  exports.AuthClient = AuthClient;
});
