// class: InteractiveBrowserCredential
class InteractiveBrowserCredential {
  tenantId;
  additionallyAllowedTenantIds;
  msalClient;
  disableAutomaticAuthentication;
  browserCustomizationOptions;
  loginHint;
  constructor(options) {
    this.tenantId = resolveTenantId(logger29, options.tenantId, options.clientId), this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants);
    let msalClientOptions = {
      ...options,
      tokenCredentialOptions: options,
      logger: logger29
    }, ibcNodeOptions = options;
    if (this.browserCustomizationOptions = ibcNodeOptions.browserCustomizationOptions, this.loginHint = ibcNodeOptions.loginHint, ibcNodeOptions?.brokerOptions?.enabled)
      if (!ibcNodeOptions?.brokerOptions?.parentWindowHandle)
        throw Error("In order to do WAM authentication, `parentWindowHandle` under `brokerOptions` is a required parameter");
      else
        msalClientOptions.brokerOptions = {
          enabled: !0,
          parentWindowHandle: ibcNodeOptions.brokerOptions.parentWindowHandle,
          legacyEnableMsaPassthrough: ibcNodeOptions.brokerOptions?.legacyEnableMsaPassthrough,
          useDefaultBrokerAccount: ibcNodeOptions.brokerOptions?.useDefaultBrokerAccount
        };
    this.msalClient = createMsalClient(options.clientId ?? DeveloperSignOnClientId, this.tenantId, msalClientOptions), this.disableAutomaticAuthentication = options?.disableAutomaticAuthentication;
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds, logger29);
      let arrayScopes = ensureScopes(scopes);
      return this.msalClient.getTokenByInteractiveRequest(arrayScopes, {
        ...newOptions,
        disableAutomaticAuthentication: this.disableAutomaticAuthentication,
        browserCustomizationOptions: this.browserCustomizationOptions,
        loginHint: this.loginHint
      });
    });
  }
  async authenticate(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.authenticate`, options, async (newOptions) => {
      let arrayScopes = ensureScopes(scopes);
      return await this.msalClient.getTokenByInteractiveRequest(arrayScopes, {
        ...newOptions,
        disableAutomaticAuthentication: !1,
        browserCustomizationOptions: this.browserCustomizationOptions,
        loginHint: this.loginHint
      }), this.msalClient.getActiveAccount();
    });
  }
}
