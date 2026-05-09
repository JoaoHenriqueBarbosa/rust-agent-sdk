// class: ManagedIdentityClient
class ManagedIdentityClient {
  constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries) {
    this.logger = logger10, this.nodeStorage = nodeStorage, this.networkClient = networkClient, this.cryptoProvider = cryptoProvider, this.disableInternalRetries = disableInternalRetries;
  }
  async sendManagedIdentityTokenRequest(managedIdentityRequest, managedIdentityId, fakeAuthority, refreshAccessToken) {
    if (!ManagedIdentityClient.identitySource)
      ManagedIdentityClient.identitySource = this.selectManagedIdentitySource(this.logger, this.nodeStorage, this.networkClient, this.cryptoProvider, this.disableInternalRetries, managedIdentityId);
    return ManagedIdentityClient.identitySource.acquireTokenWithManagedIdentity(managedIdentityRequest, managedIdentityId, fakeAuthority, refreshAccessToken);
  }
  allEnvironmentVariablesAreDefined(environmentVariables) {
    return Object.values(environmentVariables).every((environmentVariable) => {
      return environmentVariable !== void 0;
    });
  }
  getManagedIdentitySource() {
    return ManagedIdentityClient.sourceName = this.allEnvironmentVariablesAreDefined(ServiceFabric.getEnvironmentVariables()) ? ManagedIdentitySourceNames.SERVICE_FABRIC : this.allEnvironmentVariablesAreDefined(AppService.getEnvironmentVariables()) ? ManagedIdentitySourceNames.APP_SERVICE : this.allEnvironmentVariablesAreDefined(MachineLearning.getEnvironmentVariables()) ? ManagedIdentitySourceNames.MACHINE_LEARNING : this.allEnvironmentVariablesAreDefined(CloudShell.getEnvironmentVariables()) ? ManagedIdentitySourceNames.CLOUD_SHELL : this.allEnvironmentVariablesAreDefined(AzureArc.getEnvironmentVariables()) ? ManagedIdentitySourceNames.AZURE_ARC : ManagedIdentitySourceNames.DEFAULT_TO_IMDS, ManagedIdentityClient.sourceName;
  }
  selectManagedIdentitySource(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, managedIdentityId) {
    let source = ServiceFabric.tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, managedIdentityId) || AppService.tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries) || MachineLearning.tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries) || CloudShell.tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, managedIdentityId) || AzureArc.tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries, managedIdentityId) || Imds.tryCreate(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries);
    if (!source)
      throw createManagedIdentityError(unableToCreateSource);
    return source;
  }
}
