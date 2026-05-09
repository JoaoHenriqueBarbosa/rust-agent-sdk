// class: ManagedIdentityApplication
class ManagedIdentityApplication {
  constructor(configuration) {
    this.config = buildManagedIdentityConfiguration(configuration || {}), this.logger = new Logger(this.config.system.loggerOptions, name2, version4);
    let fakeStatusAuthorityOptions = {
      canonicalAuthority: exports_Constants.DEFAULT_AUTHORITY
    };
    if (!ManagedIdentityApplication.nodeStorage)
      ManagedIdentityApplication.nodeStorage = new NodeStorage(this.logger, this.config.managedIdentityId.id, DEFAULT_CRYPTO_IMPLEMENTATION, fakeStatusAuthorityOptions);
    this.networkClient = this.config.system.networkClient, this.cryptoProvider = new CryptoProvider;
    let fakeAuthorityOptions = {
      protocolMode: ProtocolMode.AAD,
      knownAuthorities: [DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY],
      cloudDiscoveryMetadata: "",
      authorityMetadata: ""
    };
    this.fakeAuthority = new Authority(DEFAULT_AUTHORITY_FOR_MANAGED_IDENTITY, this.networkClient, ManagedIdentityApplication.nodeStorage, fakeAuthorityOptions, this.logger, this.cryptoProvider.createNewGuid(), new StubPerformanceClient, !0), this.fakeClientCredentialClient = new ClientCredentialClient({
      authOptions: {
        clientId: this.config.managedIdentityId.id,
        authority: this.fakeAuthority
      }
    }), this.managedIdentityClient = new ManagedIdentityClient(this.logger, ManagedIdentityApplication.nodeStorage, this.networkClient, this.cryptoProvider, this.config.disableInternalRetries), this.hashUtils = new HashUtils;
  }
  async acquireToken(managedIdentityRequestParams) {
    if (!managedIdentityRequestParams.resource)
      throw createClientConfigurationError(exports_ClientConfigurationErrorCodes.urlEmptyError);
    let managedIdentityRequest = {
      forceRefresh: managedIdentityRequestParams.forceRefresh,
      resource: managedIdentityRequestParams.resource.replace("/.default", ""),
      scopes: [
        managedIdentityRequestParams.resource.replace("/.default", "")
      ],
      authority: this.fakeAuthority.canonicalAuthority,
      correlationId: this.cryptoProvider.createNewGuid(),
      claims: managedIdentityRequestParams.claims,
      clientCapabilities: this.config.clientCapabilities
    };
    if (managedIdentityRequest.forceRefresh)
      return this.acquireTokenFromManagedIdentity(managedIdentityRequest, this.config.managedIdentityId, this.fakeAuthority);
    let [cachedAuthenticationResult, lastCacheOutcome] = await this.fakeClientCredentialClient.getCachedAuthenticationResult(managedIdentityRequest, this.config, this.cryptoProvider, this.fakeAuthority, ManagedIdentityApplication.nodeStorage);
    if (managedIdentityRequest.claims) {
      let sourceName = this.managedIdentityClient.getManagedIdentitySource();
      if (cachedAuthenticationResult && SOURCES_THAT_SUPPORT_TOKEN_REVOCATION.includes(sourceName)) {
        let revokedTokenSha256Hash = this.hashUtils.sha256(cachedAuthenticationResult.accessToken).toString(exports_Constants.EncodingTypes.HEX);
        managedIdentityRequest.revokedTokenSha256Hash = revokedTokenSha256Hash;
      }
      return this.acquireTokenFromManagedIdentity(managedIdentityRequest, this.config.managedIdentityId, this.fakeAuthority);
    }
    if (cachedAuthenticationResult) {
      if (lastCacheOutcome === exports_Constants.CacheOutcome.PROACTIVELY_REFRESHED) {
        this.logger.info("ClientCredentialClient:getCachedAuthenticationResult - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed.", managedIdentityRequest.correlationId);
        let refreshAccessToken = !0;
        await this.acquireTokenFromManagedIdentity(managedIdentityRequest, this.config.managedIdentityId, this.fakeAuthority, refreshAccessToken);
      }
      return cachedAuthenticationResult;
    } else
      return this.acquireTokenFromManagedIdentity(managedIdentityRequest, this.config.managedIdentityId, this.fakeAuthority);
  }
  async acquireTokenFromManagedIdentity(managedIdentityRequest, managedIdentityId, fakeAuthority, refreshAccessToken) {
    return this.managedIdentityClient.sendManagedIdentityTokenRequest(managedIdentityRequest, managedIdentityId, fakeAuthority, refreshAccessToken);
  }
  getManagedIdentitySource() {
    return ManagedIdentityClient.sourceName || this.managedIdentityClient.getManagedIdentitySource();
  }
}
