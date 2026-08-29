// class: AzurePipelinesCredential
class AzurePipelinesCredential {
  clientAssertionCredential;
  identityClient;
  constructor(tenantId, clientId, serviceConnectionId, systemAccessToken, options = {}) {
    if (!clientId)
      throw new CredentialUnavailableError(`${credentialName4}: is unavailable. clientId is a required parameter.`);
    if (!tenantId)
      throw new CredentialUnavailableError(`${credentialName4}: is unavailable. tenantId is a required parameter.`);
    if (!serviceConnectionId)
      throw new CredentialUnavailableError(`${credentialName4}: is unavailable. serviceConnectionId is a required parameter.`);
    if (!systemAccessToken)
      throw new CredentialUnavailableError(`${credentialName4}: is unavailable. systemAccessToken is a required parameter.`);
    if (options.loggingOptions = {
      ...options?.loggingOptions,
      additionalAllowedHeaderNames: [
        ...options.loggingOptions?.additionalAllowedHeaderNames ?? [],
        "x-vss-e2eid",
        "x-msedge-ref"
      ]
    }, this.identityClient = new IdentityClient(options), checkTenantId(logger31, tenantId), logger31.info(`Invoking AzurePipelinesCredential with tenant ID: ${tenantId}, client ID: ${clientId}, and service connection ID: ${serviceConnectionId}`), !process.env.SYSTEM_OIDCREQUESTURI)
      throw new CredentialUnavailableError(`${credentialName4}: is unavailable. Ensure that you're running this task in an Azure Pipeline, so that following missing system variable(s) can be defined- "SYSTEM_OIDCREQUESTURI"`);
    let oidcRequestUrl = `${process.env.SYSTEM_OIDCREQUESTURI}?api-version=${OIDC_API_VERSION}&serviceConnectionId=${serviceConnectionId}`;
    logger31.info(`Invoking ClientAssertionCredential with tenant ID: ${tenantId}, client ID: ${clientId} and service connection ID: ${serviceConnectionId}`), this.clientAssertionCredential = new ClientAssertionCredential(tenantId, clientId, this.requestOidcToken.bind(this, oidcRequestUrl, systemAccessToken), options);
  }
  async getToken(scopes, options) {
    if (!this.clientAssertionCredential) {
      let errorMessage2 = `${credentialName4}: is unavailable. To use Federation Identity in Azure Pipelines, the following parameters are required - 
      tenantId,
      clientId,
      serviceConnectionId,
      systemAccessToken,
      "SYSTEM_OIDCREQUESTURI".      
      See the troubleshooting guide for more information: https://aka.ms/azsdk/js/identity/azurepipelinescredential/troubleshoot`;
      throw logger31.error(errorMessage2), new CredentialUnavailableError(errorMessage2);
    }
    return logger31.info("Invoking getToken() of Client Assertion Credential"), this.clientAssertionCredential.getToken(scopes, options);
  }
  async requestOidcToken(oidcRequestUrl, systemAccessToken) {
    logger31.info("Requesting OIDC token from Azure Pipelines..."), logger31.info(oidcRequestUrl);
    let request2 = createPipelineRequest2({
      url: oidcRequestUrl,
      method: "POST",
      headers: createHttpHeaders2({
        "Content-Type": "application/json",
        Authorization: `Bearer ${systemAccessToken}`,
        "X-TFS-FedAuthRedirect": "Suppress"
      })
    }), response7 = await this.identityClient.sendRequest(request2);
    return handleOidcResponse(response7);
  }
}
