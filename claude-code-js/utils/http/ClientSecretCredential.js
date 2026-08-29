// class: ClientSecretCredential
class ClientSecretCredential {
  tenantId;
  additionallyAllowedTenantIds;
  msalClient;
  clientSecret;
  constructor(tenantId, clientId, clientSecret, options = {}) {
    if (!tenantId)
      throw new CredentialUnavailableError("ClientSecretCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!clientId)
      throw new CredentialUnavailableError("ClientSecretCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    if (!clientSecret)
      throw new CredentialUnavailableError("ClientSecretCredential: clientSecret is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/serviceprincipalauthentication/troubleshoot.");
    this.clientSecret = clientSecret, this.tenantId = tenantId, this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.msalClient = createMsalClient(clientId, tenantId, {
      ...options,
      logger: logger15,
      tokenCredentialOptions: options
    });
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds, logger15);
      let arrayScopes = ensureScopes(scopes);
      return this.msalClient.getTokenByClientSecret(arrayScopes, this.clientSecret, newOptions);
    });
  }
}
