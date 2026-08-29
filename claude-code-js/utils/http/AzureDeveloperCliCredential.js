// class: AzureDeveloperCliCredential
class AzureDeveloperCliCredential {
  tenantId;
  additionallyAllowedTenantIds;
  timeout;
  constructor(options) {
    if (options?.tenantId)
      checkTenantId(logger23, options?.tenantId), this.tenantId = options?.tenantId;
    this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds(options?.additionallyAllowedTenants), this.timeout = options?.processTimeoutInMs;
  }
  async getToken(scopes, options = {}) {
    let tenantId = processMultiTenantRequest(this.tenantId, options, this.additionallyAllowedTenantIds);
    if (tenantId)
      checkTenantId(logger23, tenantId);
    let scopeList;
    if (typeof scopes === "string")
      scopeList = [scopes];
    else
      scopeList = scopes;
    return logger23.getToken.info(`Using the scopes ${scopes}`), tracingClient.withSpan(`${this.constructor.name}.getToken`, options, async () => {
      try {
        scopeList.forEach((scope) => {
          ensureValidScopeForDevTimeCreds(scope, logger23);
        });
        let obj = await developerCliCredentialInternals.getAzdAccessToken(scopeList, tenantId, this.timeout, options.claims), isMFARequiredError = obj.stderr?.match("must use multi-factor authentication") || obj.stderr?.match("reauthentication required"), isNotLoggedInError = obj.stderr?.match("not logged in, run `azd login` to login") || obj.stderr?.match("not logged in, run `azd auth login` to login");
        if (obj.stderr?.match("azd:(.*)not found") || obj.stderr?.startsWith("'azd' is not recognized") || obj.error && obj.error.code === "ENOENT") {
          let error43 = new CredentialUnavailableError(azureDeveloperCliPublicErrorMessages.notInstalled);
          throw logger23.getToken.info(formatError2(scopes, error43)), error43;
        }
        if (isNotLoggedInError) {
          let error43 = new CredentialUnavailableError(azureDeveloperCliPublicErrorMessages.login);
          throw logger23.getToken.info(formatError2(scopes, error43)), error43;
        }
        if (isMFARequiredError) {
          let loginCmd = `azd auth login ${scopeList.reduce((previous, current) => previous.concat("--scope", current), []).join(" ")}`, error43 = new CredentialUnavailableError(`${azureDeveloperCliPublicErrorMessages.claim} ${loginCmd}`);
          throw logger23.getToken.info(formatError2(scopes, error43)), error43;
        }
        try {
          let resp = JSON.parse(obj.stdout);
          return logger23.getToken.info(formatSuccess(scopes)), {
            token: resp.token,
            expiresOnTimestamp: new Date(resp.expiresOn).getTime(),
            tokenType: "Bearer"
          };
        } catch (e) {
          if (obj.stderr)
            throw new CredentialUnavailableError(obj.stderr);
          throw e;
        }
      } catch (err) {
        let error43 = err.name === "CredentialUnavailableError" ? err : new CredentialUnavailableError(err.message || azureDeveloperCliPublicErrorMessages.unknown);
        throw logger23.getToken.info(formatError2(scopes, error43)), error43;
      }
    });
  }
}
