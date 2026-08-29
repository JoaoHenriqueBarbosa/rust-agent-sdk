// class: AuthorizationCodeCredential
class AuthorizationCodeCredential {
  msalClient;
  disableAutomaticAuthentication;
  authorizationCode;
  redirectUri;
  tenantId;
  additionallyAllowedTenantIds;
  clientSecret;
  constructor(tenantId, clientId, clientSecretOrAuthorizationCode, authorizationCodeOrRedirectUri, redirectUriOrOptions, options) {
    if (checkTenantId(logger32, tenantId), this.clientSecret = clientSecretOrAuthorizationCode, typeof redirectUriOrOptions === "string")
      this.authorizationCode = authorizationCodeOrRedirectUri, this.redirectUri = redirectUriOrOptions;
    else
      this.authorizationCode = clientSecretOrAuthorizationCode, this.redirectUri = authorizationCodeOrRedirectUri, this.clientSecret = void 0, options = redirectUriOrOptions;
    this.tenantId = tenantId, this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.msalClient = createMsalClient(clientId, tenantId, {
      ...options,
      logger: logger32,
      tokenCredentialOptions: options ?? {}
    });
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async (newOptions) => {
      let tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds);
      newOptions.tenantId = tenantId;
      let arrayScopes = ensureScopes(scopes);
      return this.msalClient.getTokenByAuthorizationCode(arrayScopes, this.redirectUri, this.authorizationCode, this.clientSecret, {
        ...newOptions,
        disableAutomaticAuthentication: this.disableAutomaticAuthentication
      });
    });
  }
}
