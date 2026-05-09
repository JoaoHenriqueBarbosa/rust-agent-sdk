// class: LoopbackClient
class LoopbackClient {
  async listenForAuthCode(successTemplate, errorTemplate) {
    if (this.server)
      throw NodeAuthError.createLoopbackServerAlreadyExistsError();
    return new Promise((resolve9, reject) => {
      this.server = http10.createServer((req, res) => {
        let url3 = req.url;
        if (!url3) {
          res.end(errorTemplate || "Error occurred loading redirectUrl"), reject(NodeAuthError.createUnableToLoadRedirectUrlError());
          return;
        } else if (url3 === exports_Constants.FORWARD_SLASH) {
          res.end(successTemplate || "Auth code was successfully acquired. You can close this window now.");
          return;
        }
        let redirectUri = this.getRedirectUri(), parsedUrl = new URL(url3, redirectUri), authCodeResponse = exports_UrlUtils.getDeserializedResponse(parsedUrl.search) || {};
        if (authCodeResponse.code)
          res.writeHead(exports_Constants.HTTP_REDIRECT, {
            location: redirectUri
          }), res.end();
        if (authCodeResponse.error)
          res.end(errorTemplate || `Error occurred: ${authCodeResponse.error}`);
        resolve9(authCodeResponse);
      }), this.server.listen(0, "127.0.0.1");
    });
  }
  getRedirectUri() {
    if (!this.server || !this.server.listening)
      throw NodeAuthError.createNoLoopbackServerExistsError();
    let address = this.server.address();
    if (!address || typeof address === "string" || !address.port)
      throw this.closeServer(), NodeAuthError.createInvalidLoopbackAddressTypeError();
    let port = address && address.port;
    return `${Constants.HTTP_PROTOCOL}${Constants.LOCALHOST}:${port}`;
  }
  closeServer() {
    if (this.server) {
      if (this.server.close(), typeof this.server.closeAllConnections === "function")
        this.server.closeAllConnections();
      this.server.unref(), this.server = void 0;
    }
  }
}
