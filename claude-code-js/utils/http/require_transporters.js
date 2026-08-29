// var: require_transporters
var require_transporters = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.DefaultTransporter = void 0;
  var gaxios_1 = require_src2(), options_1 = require_options(), pkg = require_package3(), PRODUCT_NAME = "google-api-nodejs-client";

  class DefaultTransporter {
    constructor() {
      this.instance = new gaxios_1.Gaxios;
    }
    configure(opts = {}) {
      if (opts.headers = opts.headers || {}, typeof window > "u") {
        let uaValue = opts.headers["User-Agent"];
        if (!uaValue)
          opts.headers["User-Agent"] = DefaultTransporter.USER_AGENT;
        else if (!uaValue.includes(`${PRODUCT_NAME}/`))
          opts.headers["User-Agent"] = `${uaValue} ${DefaultTransporter.USER_AGENT}`;
        if (!opts.headers["x-goog-api-client"]) {
          let nodeVersion = process.version.replace(/^v/, "");
          opts.headers["x-goog-api-client"] = `gl-node/${nodeVersion}`;
        }
      }
      return opts;
    }
    request(opts) {
      return opts = this.configure(opts), (0, options_1.validate)(opts), this.instance.request(opts).catch((e) => {
        throw this.processError(e);
      });
    }
    get defaults() {
      return this.instance.defaults;
    }
    set defaults(opts) {
      this.instance.defaults = opts;
    }
    processError(e) {
      let res = e.response, err = e, body = res ? res.data : null;
      if (res && body && body.error && res.status !== 200)
        if (typeof body.error === "string")
          err.message = body.error, err.status = res.status;
        else if (Array.isArray(body.error.errors))
          err.message = body.error.errors.map((err2) => err2.message).join(`
`), err.code = body.error.code, err.errors = body.error.errors;
        else
          err.message = body.error.message, err.code = body.error.code;
      else if (res && res.status >= 400)
        err.message = body, err.status = res.status;
      return err;
    }
  }
  exports.DefaultTransporter = DefaultTransporter;
  DefaultTransporter.USER_AGENT = `${PRODUCT_NAME}/${pkg.version}`;
});
