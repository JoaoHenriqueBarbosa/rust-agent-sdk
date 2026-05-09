// class: BaseClient
class BaseClient {
  constructor(configuration) {
    this.config = buildClientConfiguration(configuration), this.logger = new Logger(this.config.loggerOptions, name2, version4), this.cryptoUtils = this.config.cryptoInterface, this.cacheManager = this.config.storageInterface, this.networkClient = this.config.networkInterface, this.serverTelemetryManager = this.config.serverTelemetryManager, this.authority = this.config.authOptions.authority, this.performanceClient = new StubPerformanceClient;
  }
  createTokenRequestHeaders(ccsCred) {
    return exports_Token.createTokenRequestHeaders(this.logger, !1, ccsCred);
  }
  async executePostToTokenEndpoint(tokenEndpoint, queryString, headers, thumbprint, correlationId) {
    return exports_Token.executePostToTokenEndpoint(tokenEndpoint, queryString, headers, thumbprint, correlationId, this.cacheManager, this.networkClient, this.logger, this.performanceClient, this.serverTelemetryManager);
  }
  async sendPostRequest(thumbprint, tokenEndpoint, options, correlationId) {
    return exports_Token.sendPostRequest(thumbprint, tokenEndpoint, options, correlationId, this.cacheManager, this.networkClient, this.logger, this.performanceClient);
  }
  createTokenQueryParameters(request2) {
    return exports_Token.createTokenQueryParameters(request2, this.config.authOptions.clientId, this.config.authOptions.redirectUri, this.performanceClient);
  }
}
