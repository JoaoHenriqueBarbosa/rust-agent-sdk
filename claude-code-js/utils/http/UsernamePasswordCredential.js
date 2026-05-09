// class: UsernamePasswordCredential
class UsernamePasswordCredential {
  tenantId;
  additionallyAllowedTenantIds;
  msalClient;
  username;
  password;
  constructor(tenantId, clientId, username, password, options = {}) {
    if (!tenantId)
      throw new CredentialUnavailableError("UsernamePasswordCredential: tenantId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!clientId)
      throw new CredentialUnavailableError("UsernamePasswordCredential: clientId is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!username)
      throw new CredentialUnavailableError("UsernamePasswordCredential: username is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    if (!password)
      throw new CredentialUnavailableError("UsernamePasswordCredential: password is a required parameter. To troubleshoot, visit https://aka.ms/azsdk/js/identity/usernamepasswordcredential/troubleshoot.");
    this.tenantId = tenantId, this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.username = username, this.password = password, this.msalClient = createMsalClient(clientId, this.tenantId, {
      ...options,
      tokenCredentialOptions: options ?? {}
    });
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async (newOptions) => {
      newOptions.tenantId = processMultiTenantRequest(this.tenantId, newOptions, this.additionallyAllowedTenantIds, logger16);
      let arrayScopes = ensureScopes(scopes);
      return this.msalClient.getTokenByUsernamePassword(arrayScopes, this.username, this.password, newOptions);
    });
  }
}
