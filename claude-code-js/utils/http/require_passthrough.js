// var: require_passthrough
var require_passthrough = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.PassThroughClient = void 0;
  var authclient_1 = require_authclient();

  class PassThroughClient extends authclient_1.AuthClient {
    async request(opts) {
      return this.transporter.request(opts);
    }
    async getAccessToken() {
      return {};
    }
    async getRequestHeaders() {
      return {};
    }
  }
  exports.PassThroughClient = PassThroughClient;
  var a2 = new PassThroughClient;
  a2.getAccessToken();
});
