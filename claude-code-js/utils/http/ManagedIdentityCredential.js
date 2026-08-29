// class: ManagedIdentityCredential
class ManagedIdentityCredential {
  managedIdentityApp;
  identityClient;
  clientId;
  resourceId;
  objectId;
  msiRetryConfig = {
    maxRetries: 5,
    startDelayInMs: 800,
    intervalIncrement: 2
  };
  isAvailableIdentityClient;
  sendProbeRequest;
  constructor(clientIdOrOptions, options) {
    let _options;
    if (typeof clientIdOrOptions === "string")
      this.clientId = clientIdOrOptions, _options = options ?? {};
    else
      this.clientId = clientIdOrOptions?.clientId, _options = clientIdOrOptions ?? {};
    this.resourceId = _options?.resourceId, this.objectId = _options?.objectId, this.sendProbeRequest = _options?.sendProbeRequest ?? !1;
    let providedIds = [
      { key: "clientId", value: this.clientId },
      { key: "resourceId", value: this.resourceId },
      { key: "objectId", value: this.objectId }
    ].filter((id) => id.value);
    if (providedIds.length > 1)
      throw Error(`ManagedIdentityCredential: only one of 'clientId', 'resourceId', or 'objectId' can be provided. Received values: ${JSON.stringify({ clientId: this.clientId, resourceId: this.resourceId, objectId: this.objectId })}`);
    if (_options.allowInsecureConnection = !0, _options.retryOptions?.maxRetries !== void 0)
      this.msiRetryConfig.maxRetries = _options.retryOptions.maxRetries;
    this.identityClient = new IdentityClient({
      ..._options,
      additionalPolicies: [{ policy: imdsRetryPolicy(this.msiRetryConfig), position: "perCall" }]
    }), this.managedIdentityApp = new ManagedIdentityApplication({
      managedIdentityIdParams: {
        userAssignedClientId: this.clientId,
        userAssignedResourceId: this.resourceId,
        userAssignedObjectId: this.objectId
      },
      system: {
        disableInternalRetries: !0,
        networkClient: this.identityClient,
        loggerOptions: {
          logLevel: getMSALLogLevel(getLogLevel()),
          piiLoggingEnabled: _options.loggingOptions?.enableUnsafeSupportLogging,
          loggerCallback: defaultLoggerCallback(logger22)
        }
      }
    }), this.isAvailableIdentityClient = new IdentityClient({
      ..._options,
      retryOptions: {
        maxRetries: 0
      }
    });
    let managedIdentitySource = this.managedIdentityApp.getManagedIdentitySource();
    if (managedIdentitySource === "CloudShell") {
      if (this.clientId || this.resourceId || this.objectId)
        throw logger22.warning(`CloudShell MSI detected with user-provided IDs - throwing. Received values: ${JSON.stringify({
          clientId: this.clientId,
          resourceId: this.resourceId,
          objectId: this.objectId
        })}.`), new CredentialUnavailableError("ManagedIdentityCredential: Specifying a user-assigned managed identity is not supported for CloudShell at runtime. When using Managed Identity in CloudShell, omit the clientId, resourceId, and objectId parameters.");
    }
    if (managedIdentitySource === "ServiceFabric") {
      if (this.clientId || this.resourceId || this.objectId)
        throw logger22.warning(`Service Fabric detected with user-provided IDs - throwing. Received values: ${JSON.stringify({
          clientId: this.clientId,
          resourceId: this.resourceId,
          objectId: this.objectId
        })}.`), new CredentialUnavailableError(`ManagedIdentityCredential: ${serviceFabricErrorMessage}`);
    }
    if (logger22.info(`Using ${managedIdentitySource} managed identity.`), providedIds.length === 1) {
      let { key, value } = providedIds[0];
      logger22.info(`${managedIdentitySource} with ${key}: ${value}`);
    }
  }
  async getToken(scopes, options = {}) {
    logger22.getToken.info("Using the MSAL provider for Managed Identity.");
    let resource = mapScopesToResource(scopes);
    if (!resource)
      throw new CredentialUnavailableError(`ManagedIdentityCredential: Multiple scopes are not supported. Scopes: ${JSON.stringify(scopes)}`);
    return tracingClient.withSpan("ManagedIdentityCredential.getToken", options, async () => {
      try {
        let isTokenExchangeMsi = await tokenExchangeMsi.isAvailable(this.clientId), identitySource = this.managedIdentityApp.getManagedIdentitySource(), isImdsMsi = identitySource === "DefaultToImds" || identitySource === "Imds";
        if (logger22.getToken.info(`MSAL Identity source: ${identitySource}`), isTokenExchangeMsi) {
          logger22.getToken.info("Using the token exchange managed identity.");
          let result = await tokenExchangeMsi.getToken({
            scopes,
            clientId: this.clientId,
            identityClient: this.identityClient,
            retryConfig: this.msiRetryConfig,
            resourceId: this.resourceId
          });
          if (result === null)
            throw new CredentialUnavailableError("Attempted to use the token exchange managed identity, but received a null response.");
          return result;
        } else if (isImdsMsi && this.sendProbeRequest) {
          if (logger22.getToken.info("Using the IMDS endpoint to probe for availability."), !await imdsMsi.isAvailable({
            scopes,
            clientId: this.clientId,
            getTokenOptions: options,
            identityClient: this.isAvailableIdentityClient,
            resourceId: this.resourceId
          }))
            throw new CredentialUnavailableError("Attempted to use the IMDS endpoint, but it is not available.");
        }
        logger22.getToken.info("Calling into MSAL for managed identity token.");
        let token = await this.managedIdentityApp.acquireToken({
          resource
        });
        return this.ensureValidMsalToken(scopes, token, options), logger22.getToken.info(formatSuccess(scopes)), {
          expiresOnTimestamp: token.expiresOn.getTime(),
          token: token.accessToken,
          refreshAfterTimestamp: token.refreshOn?.getTime(),
          tokenType: "Bearer"
        };
      } catch (err) {
        if (logger22.getToken.error(formatError2(scopes, err)), err.name === "AuthenticationRequiredError")
          throw err;
        if (isNetworkError(err))
          throw new CredentialUnavailableError(`ManagedIdentityCredential: Network unreachable. Message: ${err.message}`, { cause: err });
        throw new CredentialUnavailableError(`ManagedIdentityCredential: Authentication failed. Message ${err.message}`, { cause: err });
      }
    });
  }
  ensureValidMsalToken(scopes, msalToken, getTokenOptions) {
    let createError = (message) => {
      return logger22.getToken.info(message), new AuthenticationRequiredError({
        scopes: Array.isArray(scopes) ? scopes : [scopes],
        getTokenOptions,
        message
      });
    };
    if (!msalToken)
      throw createError("No response.");
    if (!msalToken.expiresOn)
      throw createError('Response had no "expiresOn" property.');
    if (!msalToken.accessToken)
      throw createError('Response had no "accessToken" property.');
  }
}
