// var: init_ConfidentialClientApplication
var init_ConfidentialClientApplication = __esm(() => {
  init_ClientApplication();
  init_ClientAssertion();
  init_Constants2();
  init_index_node();
  init_ClientCredentialClient();
  init_OnBehalfOfClient();
  init_ClientAuthErrorCodes2();
  /*! @azure/msal-node v5.1.2 2026-04-01 */
  ConfidentialClientApplication = class ConfidentialClientApplication extends ClientApplication {
    constructor(configuration) {
      super(configuration);
      let clientSecretNotEmpty = !!this.config.auth.clientSecret, clientAssertionNotEmpty = !!this.config.auth.clientAssertion, certificateNotEmpty = (!!this.config.auth.clientCertificate?.thumbprint || !!this.config.auth.clientCertificate?.thumbprintSha256) && !!this.config.auth.clientCertificate?.privateKey;
      if (this.appTokenProvider)
        return;
      if (clientSecretNotEmpty && clientAssertionNotEmpty || clientAssertionNotEmpty && certificateNotEmpty || clientSecretNotEmpty && certificateNotEmpty)
        throw createClientAuthError(invalidClientCredential);
      if (this.config.auth.clientSecret) {
        this.clientSecret = this.config.auth.clientSecret;
        return;
      }
      if (this.config.auth.clientAssertion) {
        this.developerProvidedClientAssertion = this.config.auth.clientAssertion;
        return;
      }
      if (!certificateNotEmpty)
        throw createClientAuthError(invalidClientCredential);
      else
        this.clientAssertion = this.config.auth.clientCertificate.thumbprintSha256 ? ClientAssertion.fromCertificateWithSha256Thumbprint(this.config.auth.clientCertificate.thumbprintSha256, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c) : ClientAssertion.fromCertificate(this.config.auth.clientCertificate.thumbprint, this.config.auth.clientCertificate.privateKey, this.config.auth.clientCertificate.x5c);
      this.appTokenProvider = void 0;
    }
    SetAppTokenProvider(provider5) {
      this.appTokenProvider = provider5;
    }
    async acquireTokenByClientCredential(request2) {
      this.logger.info("acquireTokenByClientCredential called", request2.correlationId || "");
      let clientAssertion;
      if (request2.clientAssertion)
        clientAssertion = {
          assertion: await getClientAssertion(request2.clientAssertion, this.config.auth.clientId),
          assertionType: Constants.JWT_BEARER_ASSERTION_TYPE
        };
      let baseRequest = await this.initializeBaseRequest(request2), validBaseRequest = {
        ...baseRequest,
        scopes: baseRequest.scopes.filter((scope) => !exports_Constants.OIDC_DEFAULT_SCOPES.includes(scope))
      }, validRequest = {
        ...request2,
        ...validBaseRequest,
        clientAssertion
      }, tenantId = new UrlString(validRequest.authority).getUrlComponents().PathSegments[0];
      if (Object.values(exports_Constants.AADAuthority).includes(tenantId))
        throw createClientAuthError(missingTenantIdError);
      let ENV_MSAL_FORCE_REGION = process.env[MSAL_FORCE_REGION], region;
      if (validRequest.azureRegion !== "DisableMsalForceRegion")
        if (!validRequest.azureRegion && ENV_MSAL_FORCE_REGION)
          region = ENV_MSAL_FORCE_REGION;
        else
          region = validRequest.azureRegion;
      let azureRegionConfiguration = {
        azureRegion: region,
        environmentRegion: process.env[REGION_ENVIRONMENT_VARIABLE]
      }, serverTelemetryManager = this.initializeServerTelemetryManager(ApiId.acquireTokenByClientCredential, validRequest.correlationId, validRequest.skipCache);
      try {
        let discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, azureRegionConfiguration, request2.azureCloudOptions), clientCredentialConfig = await this.buildOauthClientConfiguration(discoveredAuthority, validRequest.correlationId, "", serverTelemetryManager), clientCredentialClient = new ClientCredentialClient(clientCredentialConfig, this.appTokenProvider);
        return this.logger.verbose("Client credential client created", validRequest.correlationId), await clientCredentialClient.acquireToken(validRequest);
      } catch (e) {
        if (e instanceof AuthError)
          e.setCorrelationId(validRequest.correlationId);
        throw serverTelemetryManager.cacheFailedRequest(e), e;
      }
    }
    async acquireTokenOnBehalfOf(request2) {
      this.logger.info("acquireTokenOnBehalfOf called", request2.correlationId || "");
      let validRequest = {
        ...request2,
        ...await this.initializeBaseRequest(request2)
      };
      try {
        let discoveredAuthority = await this.createAuthority(validRequest.authority, validRequest.correlationId, void 0, request2.azureCloudOptions), onBehalfOfConfig = await this.buildOauthClientConfiguration(discoveredAuthority, validRequest.correlationId, "", void 0), oboClient = new OnBehalfOfClient(onBehalfOfConfig);
        return this.logger.verbose("On behalf of client created", validRequest.correlationId), await oboClient.acquireToken(validRequest);
      } catch (e) {
        if (e instanceof AuthError)
          e.setCorrelationId(validRequest.correlationId);
        throw e;
      }
    }
  };
});
