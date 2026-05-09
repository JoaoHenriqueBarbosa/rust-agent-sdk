// Original: src/services/oauth/auth-code-listener.ts
import { createServer as createServer6 } from "http";

class AuthCodeListener {
  localServer;
  port = 0;
  promiseResolver = null;
  promiseRejecter = null;
  expectedState = null;
  pendingResponse = null;
  callbackPath;
  constructor(callbackPath = "/callback") {
    this.localServer = createServer6(), this.callbackPath = callbackPath;
  }
  async start(port) {
    return new Promise((resolve26, reject2) => {
      this.localServer.once("error", (err2) => {
        reject2(Error(`Failed to start OAuth callback server: ${err2.message}`));
      }), this.localServer.listen(port ?? 0, "localhost", () => {
        let address = this.localServer.address();
        this.port = address.port, resolve26(this.port);
      });
    });
  }
  getPort() {
    return this.port;
  }
  hasPendingResponse() {
    return this.pendingResponse !== null;
  }
  async waitForAuthorization(state3, onReady) {
    return new Promise((resolve26, reject2) => {
      this.promiseResolver = resolve26, this.promiseRejecter = reject2, this.expectedState = state3, this.startLocalListener(onReady);
    });
  }
  handleSuccessRedirect(scopes, customHandler) {
    if (!this.pendingResponse)
      return;
    if (customHandler) {
      customHandler(this.pendingResponse, scopes), this.pendingResponse = null, logEvent("tengu_oauth_automatic_redirect", { custom_handler: !0 });
      return;
    }
    let successUrl = shouldUseClaudeAIAuth(scopes) ? getOauthConfig().CLAUDEAI_SUCCESS_URL : getOauthConfig().CONSOLE_SUCCESS_URL;
    this.pendingResponse.writeHead(302, { Location: successUrl }), this.pendingResponse.end(), this.pendingResponse = null, logEvent("tengu_oauth_automatic_redirect", {});
  }
  handleErrorRedirect() {
    if (!this.pendingResponse)
      return;
    let errorUrl = getOauthConfig().CLAUDEAI_SUCCESS_URL;
    this.pendingResponse.writeHead(302, { Location: errorUrl }), this.pendingResponse.end(), this.pendingResponse = null, logEvent("tengu_oauth_automatic_redirect_error", {});
  }
  startLocalListener(onReady) {
    this.localServer.on("request", this.handleRedirect.bind(this)), this.localServer.on("error", this.handleError.bind(this)), onReady();
  }
  handleRedirect(req, res) {
    let parsedUrl = new URL(req.url || "", `http://${req.headers.host || "localhost"}`);
    if (parsedUrl.pathname !== this.callbackPath) {
      res.writeHead(404), res.end();
      return;
    }
    let authCode = parsedUrl.searchParams.get("code") ?? void 0, state3 = parsedUrl.searchParams.get("state") ?? void 0;
    this.validateAndRespond(authCode, state3, res);
  }
  validateAndRespond(authCode, state3, res) {
    if (!authCode) {
      res.writeHead(400), res.end("Authorization code not found"), this.reject(Error("No authorization code received"));
      return;
    }
    if (state3 !== this.expectedState) {
      res.writeHead(400), res.end("Invalid state parameter"), this.reject(Error("Invalid state parameter"));
      return;
    }
    this.pendingResponse = res, this.resolve(authCode);
  }
  handleError(err2) {
    logError2(err2), this.close(), this.reject(err2);
  }
  resolve(authorizationCode) {
    if (this.promiseResolver)
      this.promiseResolver(authorizationCode), this.promiseResolver = null, this.promiseRejecter = null;
  }
  reject(error44) {
    if (this.promiseRejecter)
      this.promiseRejecter(error44), this.promiseResolver = null, this.promiseRejecter = null;
  }
  close() {
    if (this.pendingResponse)
      this.handleErrorRedirect();
    if (this.localServer)
      this.localServer.removeAllListeners(), this.localServer.close();
  }
}
var init_auth_code_listener = __esm(() => {
  init_oauth();
  init_log3();
  init_client8();
});
