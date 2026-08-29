// var: require_loginticket
var require_loginticket = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.LoginTicket = void 0;

  class LoginTicket {
    constructor(env5, pay) {
      this.envelope = env5, this.payload = pay;
    }
    getEnvelope() {
      return this.envelope;
    }
    getPayload() {
      return this.payload;
    }
    getUserId() {
      let payload = this.getPayload();
      if (payload && payload.sub)
        return payload.sub;
      return null;
    }
    getAttributes() {
      return { envelope: this.getEnvelope(), payload: this.getPayload() };
    }
  }
  exports.LoginTicket = LoginTicket;
});
