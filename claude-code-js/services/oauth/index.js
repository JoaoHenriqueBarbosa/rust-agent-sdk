// Original: src/services/oauth/index.ts
class OAuthService {
  codeVerifier;
  authCodeListener = null;
  port = null;
  manualAuthCodeResolver = null;
  constructor() {
    this.codeVerifier = generateCodeVerifier();
  }
  async startOAuthFlow(authURLHandler, options2) {
    this.authCodeListener = new AuthCodeListener, this.port = await this.authCodeListener.start();
    let codeChallenge = generateCodeChallenge(this.codeVerifier), state3 = generateState(), opts = {
      codeChallenge,
      state: state3,
      port: this.port,
      loginWithClaudeAi: options2?.loginWithClaudeAi,
      inferenceOnly: options2?.inferenceOnly,
      orgUUID: options2?.orgUUID,
      loginHint: options2?.loginHint,
      loginMethod: options2?.loginMethod
    }, manualFlowUrl = buildAuthUrl({ ...opts, isManual: !0 }), automaticFlowUrl = buildAuthUrl({ ...opts, isManual: !1 }), authorizationCode = await this.waitForAuthorizationCode(state3, async () => {
      if (options2?.skipBrowserOpen)
        await authURLHandler(manualFlowUrl, automaticFlowUrl);
      else
        await authURLHandler(manualFlowUrl), await openBrowser(automaticFlowUrl);
    }), isAutomaticFlow = this.authCodeListener?.hasPendingResponse() ?? !1;
    logEvent("tengu_oauth_auth_code_received", { automatic: isAutomaticFlow });
    try {
      let tokenResponse = await exchangeCodeForTokens(authorizationCode, state3, this.codeVerifier, this.port, !isAutomaticFlow, options2?.expiresIn), profileInfo = await fetchProfileInfo(tokenResponse.access_token);
      if (isAutomaticFlow) {
        let scopes = parseScopes(tokenResponse.scope);
        this.authCodeListener?.handleSuccessRedirect(scopes);
      }
      return this.formatTokens(tokenResponse, profileInfo.subscriptionType, profileInfo.rateLimitTier, profileInfo.rawProfile);
    } catch (error44) {
      if (isAutomaticFlow)
        this.authCodeListener?.handleErrorRedirect();
      throw error44;
    } finally {
      this.authCodeListener?.close();
    }
  }
  async waitForAuthorizationCode(state3, onReady) {
    return new Promise((resolve26, reject2) => {
      this.manualAuthCodeResolver = resolve26, this.authCodeListener?.waitForAuthorization(state3, onReady).then((authorizationCode) => {
        this.manualAuthCodeResolver = null, resolve26(authorizationCode);
      }).catch((error44) => {
        this.manualAuthCodeResolver = null, reject2(error44);
      });
    });
  }
  handleManualAuthCodeInput(params) {
    if (this.manualAuthCodeResolver)
      this.manualAuthCodeResolver(params.authorizationCode), this.manualAuthCodeResolver = null, this.authCodeListener?.close();
  }
  formatTokens(response7, subscriptionType, rateLimitTier, profile7) {
    return {
      accessToken: response7.access_token,
      refreshToken: response7.refresh_token,
      expiresAt: Date.now() + response7.expires_in * 1000,
      scopes: parseScopes(response7.scope),
      subscriptionType,
      rateLimitTier,
      profile: profile7,
      tokenAccount: response7.account ? {
        uuid: response7.account.uuid,
        emailAddress: response7.account.email_address,
        organizationUuid: response7.organization?.uuid
      } : void 0
    };
  }
  cleanup() {
    this.authCodeListener?.close(), this.manualAuthCodeResolver = null;
  }
}
var init_oauth2 = __esm(() => {
  init_browser();
  init_auth_code_listener();
  init_client8();
  init_crypto8();
});
