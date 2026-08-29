// class: DeviceCodeCredential
class DeviceCodeCredential {
  tenantId;
  additionallyAllowedTenantIds;
  disableAutomaticAuthentication;
  msalClient;
  userPromptCallback;
  constructor(options) {
    this.tenantId = options?.tenantId, this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants);
    let clientId = options?.clientId ?? DeveloperSignOnClientId, tenantId = resolveTenantId(logger30, options?.tenantId, clientId);
    this.userPromptCallback = options?.userPromptCallback ?? defaultDeviceCodePromptCallback, this.msalClient = createMsalClient(clientId, tenantId, {
      ...options,
      logger: logger30,
      tokenCredentialOptions: options || {}
    }), this.disableAutomaticAuthentication = options?.disableAutomaticAuthentication;
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds, logger30);
      let arrayScopes = ensureScopes(scopes);
      return this.msalClient.getTokenByDeviceCode(arrayScopes, this.userPromptCallback, {
        ...newOptions,
        disableAutomaticAuthentication: this.disableAutomaticAuthentication
      });
    });
  }
  async authenticate(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.authenticate`, options, async (newOptions) => {
      let arrayScopes = Array.isArray(scopes) ? scopes : [scopes];
      return await this.msalClient.getTokenByDeviceCode(arrayScopes, this.userPromptCallback, {
        ...newOptions,
        disableAutomaticAuthentication: !1
      }), this.msalClient.getActiveAccount();
    });
  }
}
