// var: require_iam
var require_iam = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.IAMAuth = void 0;

  class IAMAuth {
    constructor(selector, token) {
      this.selector = selector, this.token = token, this.selector = selector, this.token = token;
    }
    getRequestHeaders() {
      return {
        "x-goog-iam-authority-selector": this.selector,
        "x-goog-iam-authorization-token": this.token
      };
    }
  }
  exports.IAMAuth = IAMAuth;
});
