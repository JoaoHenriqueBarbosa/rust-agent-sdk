// class: WebsocketSignatureV4
class WebsocketSignatureV4 {
  signer;
  constructor(options) {
    this.signer = options.signer;
  }
  presign(originalRequest, options = {}) {
    return this.signer.presign(originalRequest, options);
  }
  async sign(toSign, options) {
    if (HttpRequest4.isInstance(toSign) && isWebSocketRequest(toSign))
      return {
        ...await this.signer.presign({ ...toSign, body: "" }, {
          ...options,
          expiresIn: 60,
          unsignableHeaders: new Set(Object.keys(toSign.headers).filter((header) => header !== "host"))
        }),
        body: toSign.body
      };
    else
      return this.signer.sign(toSign, options);
  }
  signMessage(message, args) {
    return this.signer.signMessage(message, args);
  }
}
