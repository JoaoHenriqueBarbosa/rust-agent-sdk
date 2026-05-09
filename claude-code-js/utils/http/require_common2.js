// var: require_common2
var require_common2 = __commonJS((exports) => {
  var __importDefault2 = exports && exports.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  }, _a2;
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.GaxiosError = exports.GAXIOS_ERROR_SYMBOL = void 0;
  exports.defaultErrorRedactor = defaultErrorRedactor;
  var url_1 = __require("url"), util_1 = require_util(), extend_1 = __importDefault2(require_extend());
  exports.GAXIOS_ERROR_SYMBOL = Symbol.for(`${util_1.pkg.name}-gaxios-error`);

  class GaxiosError extends Error {
    static [(_a2 = exports.GAXIOS_ERROR_SYMBOL, Symbol.hasInstance)](instance) {
      if (instance && typeof instance === "object" && exports.GAXIOS_ERROR_SYMBOL in instance && instance[exports.GAXIOS_ERROR_SYMBOL] === util_1.pkg.version)
        return !0;
      return Function.prototype[Symbol.hasInstance].call(GaxiosError, instance);
    }
    constructor(message, config8, response7, error43) {
      var _b;
      super(message);
      if (this.config = config8, this.response = response7, this.error = error43, this[_a2] = util_1.pkg.version, this.config = (0, extend_1.default)(!0, {}, config8), this.response)
        this.response.config = (0, extend_1.default)(!0, {}, this.response.config);
      if (this.response) {
        try {
          this.response.data = translateData(this.config.responseType, (_b = this.response) === null || _b === void 0 ? void 0 : _b.data);
        } catch (_c) {}
        this.status = this.response.status;
      }
      if (error43 && "code" in error43 && error43.code)
        this.code = error43.code;
      if (config8.errorRedactor)
        config8.errorRedactor({
          config: this.config,
          response: this.response
        });
    }
  }
  exports.GaxiosError = GaxiosError;
  function translateData(responseType, data) {
    switch (responseType) {
      case "stream":
        return data;
      case "json":
        return JSON.parse(JSON.stringify(data));
      case "arraybuffer":
        return JSON.parse(Buffer.from(data).toString("utf8"));
      case "blob":
        return JSON.parse(data.text());
      default:
        return data;
    }
  }
  function defaultErrorRedactor(data) {
    function redactHeaders(headers) {
      if (!headers)
        return;
      for (let key of Object.keys(headers)) {
        if (/^authentication$/i.test(key))
          headers[key] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if (/^authorization$/i.test(key))
          headers[key] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if (/secret/i.test(key))
          headers[key] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
      }
    }
    function redactString(obj, key) {
      if (typeof obj === "object" && obj !== null && typeof obj[key] === "string") {
        let text = obj[key];
        if (/grant_type=/i.test(text) || /assertion=/i.test(text) || /secret/i.test(text))
          obj[key] = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
      }
    }
    function redactObject(obj) {
      if (typeof obj === "object" && obj !== null) {
        if ("grant_type" in obj)
          obj.grant_type = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if ("assertion" in obj)
          obj.assertion = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
        if ("client_secret" in obj)
          obj.client_secret = "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.";
      }
    }
    if (data.config) {
      redactHeaders(data.config.headers), redactString(data.config, "data"), redactObject(data.config.data), redactString(data.config, "body"), redactObject(data.config.body);
      try {
        let url3 = new url_1.URL("", data.config.url);
        if (url3.searchParams.has("token"))
          url3.searchParams.set("token", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
        if (url3.searchParams.has("client_secret"))
          url3.searchParams.set("client_secret", "<<REDACTED> - See `errorRedactor` option in `gaxios` for configuration>.");
        data.config.url = url3.toString();
      } catch (_b) {}
    }
    if (data.response)
      defaultErrorRedactor({ config: data.response.config }), redactHeaders(data.response.headers), redactString(data.response, "data"), redactObject(data.response.data);
    return data;
  }
});
