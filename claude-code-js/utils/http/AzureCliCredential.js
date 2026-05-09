// class: AzureCliCredential
class AzureCliCredential {
  tenantId;
  additionallyAllowedTenantIds;
  timeout;
  subscription;
  constructor(options) {
    if (options?.tenantId)
      checkTenantId(logger24, options?.tenantId), this.tenantId = options?.tenantId;
    if (options?.subscription)
      checkSubscription(logger24, options?.subscription), this.subscription = options?.subscription;
    this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.timeout = options?.processTimeoutInMs;
  }
  async getToken(scopes, options = {}) {
    let scope = typeof scopes === "string" ? scopes : scopes[0], claimsValue = options.claims;
    if (claimsValue && claimsValue.trim()) {
      let loginCmd = `az login --claims-challenge ${btoa(claimsValue)} --scope ${scope}`, tenantIdFromOptions = options.tenantId;
      if (tenantIdFromOptions)
        loginCmd += ` --tenant ${tenantIdFromOptions}`;
      let error43 = new CredentialUnavailableError(`${azureCliPublicErrorMessages.claim} ${loginCmd}`);
      throw logger24.getToken.info(formatError2(scope, error43)), error43;
    }
    let tenantId = processMultiTenantRequest(this.tenantId, options, this.additionallyAllowedTenantIds);
    if (tenantId)
      checkTenantId(logger24, tenantId);
    if (this.subscription)
      checkSubscription(logger24, this.subscription);
    return logger24.getToken.info(`Using the scope ${scope}`), tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async () => {
      try {
        ensureValidScopeForDevTimeCreds(scope, logger24);
        let resource = getScopeResource(scope), obj = await cliCredentialInternals.getAzureCliAccessToken(resource, tenantId, this.subscription, this.timeout), specificScope = obj.stderr?.match("(.*)az login --scope(.*)"), isLoginError = obj.stderr?.match("(.*)az login(.*)") && !specificScope;
        if (obj.stderr?.match("az:(.*)not found") || obj.stderr?.startsWith("'az' is not recognized")) {
          let error43 = new CredentialUnavailableError(azureCliPublicErrorMessages.notInstalled);
          throw logger24.getToken.info(formatError2(scopes, error43)), error43;
        }
        if (isLoginError) {
          let error43 = new CredentialUnavailableError(azureCliPublicErrorMessages.login);
          throw logger24.getToken.info(formatError2(scopes, error43)), error43;
        }
        try {
          let responseData = obj.stdout, response7 = this.parseRawResponse(responseData);
          return logger24.getToken.info(formatSuccess(scopes)), response7;
        } catch (e) {
          if (obj.stderr)
            throw new CredentialUnavailableError(obj.stderr);
          throw e;
        }
      } catch (err) {
        let error43 = err.name === "CredentialUnavailableError" ? err : new CredentialUnavailableError(err.message || azureCliPublicErrorMessages.unknown);
        throw logger24.getToken.info(formatError2(scopes, error43)), error43;
      }
    });
  }
  parseRawResponse(rawResponse) {
    let response7 = JSON.parse(rawResponse), token = response7.accessToken, expiresOnTimestamp = Number.parseInt(response7.expires_on, 10) * 1000;
    if (!isNaN(expiresOnTimestamp))
      return logger24.getToken.info("expires_on is available and is valid, using it"), {
        token,
        expiresOnTimestamp,
        tokenType: "Bearer"
      };
    if (expiresOnTimestamp = new Date(response7.expiresOn).getTime(), isNaN(expiresOnTimestamp))
      throw new CredentialUnavailableError(`${azureCliPublicErrorMessages.unexpectedResponse} "${response7.expiresOn}"`);
    return {
      token,
      expiresOnTimestamp,
      tokenType: "Bearer"
    };
  }
}
