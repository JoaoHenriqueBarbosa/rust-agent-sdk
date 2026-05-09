// class: EnvironmentCredential
class EnvironmentCredential {
  _credential = void 0;
  constructor(options) {
    let assigned = processEnvVars(AllSupportedEnvironmentVariables).assigned.join(", ");
    logger17.info(`Found the following environment variables: ${assigned}`);
    let tenantId = process.env.AZURE_TENANT_ID, clientId = process.env.AZURE_CLIENT_ID, clientSecret = process.env.AZURE_CLIENT_SECRET, additionallyAllowedTenantIds = getAdditionallyAllowedTenants(), sendCertificateChain = getSendCertificateChain(), newOptions = { ...options, additionallyAllowedTenantIds, sendCertificateChain };
    if (tenantId)
      checkTenantId(logger17, tenantId);
    if (tenantId && clientId && clientSecret) {
      logger17.info(`Invoking ClientSecretCredential with tenant ID: ${tenantId}, clientId: ${clientId} and clientSecret: [REDACTED]`), this._credential = new ClientSecretCredential(tenantId, clientId, clientSecret, newOptions);
      return;
    }
    let certificatePath = process.env.AZURE_CLIENT_CERTIFICATE_PATH, certificatePassword = process.env.AZURE_CLIENT_CERTIFICATE_PASSWORD;
    if (tenantId && clientId && certificatePath) {
      logger17.info(`Invoking ClientCertificateCredential with tenant ID: ${tenantId}, clientId: ${clientId} and certificatePath: ${certificatePath}`), this._credential = new ClientCertificateCredential(tenantId, clientId, { certificatePath, certificatePassword }, newOptions);
      return;
    }
    let username = process.env.AZURE_USERNAME, password = process.env.AZURE_PASSWORD;
    if (tenantId && clientId && username && password)
      logger17.info(`Invoking UsernamePasswordCredential with tenant ID: ${tenantId}, clientId: ${clientId} and username: ${username}`), logger17.warning("Environment is configured to use username and password authentication. This authentication method is deprecated, as it doesn't support multifactor authentication (MFA). Use a more secure credential. For more details, see https://aka.ms/azsdk/identity/mfa."), this._credential = new UsernamePasswordCredential(tenantId, clientId, username, password, newOptions);
  }
  async getToken(scopes, options = {}) {
    return tracingClient.withSpan(`${credentialName2}.getToken`, options, async (newOptions) => {
      if (this._credential)
        try {
          let result = await this._credential.getToken(scopes, newOptions);
          return logger17.getToken.info(formatSuccess(scopes)), result;
        } catch (err) {
          let authenticationError = new AuthenticationError2(400, {
            error: `${credentialName2} authentication failed. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`,
            error_description: err.message.toString().split("More details:").join("")
          });
          throw logger17.getToken.info(formatError2(scopes, authenticationError)), authenticationError;
        }
      throw new CredentialUnavailableError(`${credentialName2} is unavailable. No underlying credential could be used. To troubleshoot, visit https://aka.ms/azsdk/js/identity/environmentcredential/troubleshoot.`);
    });
  }
}
