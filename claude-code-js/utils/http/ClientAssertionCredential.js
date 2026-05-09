// class: ClientAssertionCredential
class ClientAssertionCredential {
  msalClient;
  tenantId;
  additionallyAllowedTenantIds;
  getAssertion;
  options;
  constructor(tenantId, clientId, getAssertion, options = {}) {
    if (!tenantId)
      throw new CredentialUnavailableError("ClientAssertionCredential: tenantId is a required parameter.");
    if (!clientId)
      throw new CredentialUnavailableError("ClientAssertionCredential: clientId is a required parameter.");
    if (!getAssertion)
      throw new CredentialUnavailableError("ClientAssertionCredential: clientAssertion is a required parameter.");
    this.tenantId = tenantId, this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.options = options, this.getAssertion = getAssertion, this.msalClient = createMsalClient(clientId, tenantId, {
      ...options,
      logger: logger19,
      tokenCredentialOptions: this.options
    });
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds, logger19);
      let arrayScopes = Array.isArray(scopes) ? scopes : [scopes];
      return this.msalClient.getTokenByClientAssertion(arrayScopes, this.getAssertion, newOptions);
    });
  }
}
