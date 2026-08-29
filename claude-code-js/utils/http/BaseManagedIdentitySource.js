// class: BaseManagedIdentitySource
class BaseManagedIdentitySource {
  constructor(logger10, nodeStorage, networkClient, cryptoProvider, disableInternalRetries) {
    this.logger = logger10, this.nodeStorage = nodeStorage, this.networkClient = networkClient, this.cryptoProvider = cryptoProvider, this.disableInternalRetries = disableInternalRetries;
  }
  async getServerTokenResponseAsync(response7, _networkClient, _networkRequest, _networkRequestOptions) {
    return this.getServerTokenResponse(response7);
  }
  getServerTokenResponse(response7) {
    let refreshIn, expiresIn;
    if (response7.body.expires_on) {
      if (isIso8601(response7.body.expires_on))
        response7.body.expires_on = new Date(response7.body.expires_on).getTime() / 1000;
      if (expiresIn = response7.body.expires_on - exports_TimeUtils.nowSeconds(), expiresIn > 7200)
        refreshIn = expiresIn / 2;
    }
    return {
      status: response7.status,
      access_token: response7.body.access_token,
      expires_in: expiresIn,
      scope: response7.body.resource,
      token_type: response7.body.token_type,
      refresh_in: refreshIn,
      correlation_id: response7.body.correlation_id || response7.body.correlationId,
      error: typeof response7.body.error === "string" ? response7.body.error : response7.body.error?.code,
      error_description: response7.body.message || (typeof response7.body.error === "string" ? response7.body.error_description : response7.body.error?.message),
      error_codes: response7.body.error_codes,
      timestamp: response7.body.timestamp,
      trace_id: response7.body.trace_id
    };
  }
  async acquireTokenWithManagedIdentity(managedIdentityRequest, managedIdentityId, fakeAuthority, refreshAccessToken) {
    let networkRequest = this.createRequest(managedIdentityRequest.resource, managedIdentityId);
    if (managedIdentityRequest.revokedTokenSha256Hash)
      this.logger.info(`[Managed Identity] The following claims are present in the request: ${managedIdentityRequest.claims}`, ""), networkRequest.queryParameters[ManagedIdentityQueryParameters.SHA256_TOKEN_TO_REFRESH] = managedIdentityRequest.revokedTokenSha256Hash;
    if (managedIdentityRequest.clientCapabilities?.length) {
      let clientCapabilities = managedIdentityRequest.clientCapabilities.toString();
      this.logger.info(`[Managed Identity] The following client capabilities are present in the request: ${clientCapabilities}`, ""), networkRequest.queryParameters[ManagedIdentityQueryParameters.XMS_CC] = clientCapabilities;
    }
    let headers = networkRequest.headers;
    headers[exports_Constants.HeaderNames.CONTENT_TYPE] = exports_Constants.URL_FORM_CONTENT_TYPE;
    let networkRequestOptions = { headers };
    if (Object.keys(networkRequest.bodyParameters).length)
      networkRequestOptions.body = networkRequest.computeParametersBodyString();
    let networkClientHelper = this.disableInternalRetries ? this.networkClient : new HttpClientWithRetries(this.networkClient, networkRequest.retryPolicy, this.logger), reqTimestamp = exports_TimeUtils.nowSeconds(), response7;
    try {
      if (networkRequest.httpMethod === HttpMethod2.POST)
        response7 = await networkClientHelper.sendPostRequestAsync(networkRequest.computeUri(), networkRequestOptions);
      else
        response7 = await networkClientHelper.sendGetRequestAsync(networkRequest.computeUri(), networkRequestOptions);
    } catch (error43) {
      if (error43 instanceof AuthError)
        throw error43;
      else
        throw createClientAuthError(exports_ClientAuthErrorCodes.networkError);
    }
    let responseHandler = new ResponseHandler(managedIdentityId.id, this.nodeStorage, this.cryptoProvider, this.logger, new StubPerformanceClient, null, null), serverTokenResponse = await this.getServerTokenResponseAsync(response7, networkClientHelper, networkRequest, networkRequestOptions);
    return responseHandler.validateTokenResponse(serverTokenResponse, serverTokenResponse.correlation_id || "", refreshAccessToken), responseHandler.handleServerTokenResponse(serverTokenResponse, fakeAuthority, reqTimestamp, managedIdentityRequest, ApiId.acquireTokenWithManagedIdentity);
  }
  getManagedIdentityUserAssignedIdQueryParameterKey(managedIdentityIdType, isImds, usesApi2017) {
    switch (managedIdentityIdType) {
      case ManagedIdentityIdType.USER_ASSIGNED_CLIENT_ID:
        return this.logger.info(`[Managed Identity] [API version ${usesApi2017 ? "2017+" : "2019+"}] Adding user assigned client id to the request.`, ""), usesApi2017 ? ManagedIdentityUserAssignedIdQueryParameterNames.MANAGED_IDENTITY_CLIENT_ID_2017 : ManagedIdentityUserAssignedIdQueryParameterNames.MANAGED_IDENTITY_CLIENT_ID;
      case ManagedIdentityIdType.USER_ASSIGNED_RESOURCE_ID:
        return this.logger.info("[Managed Identity] Adding user assigned resource id to the request.", ""), isImds ? ManagedIdentityUserAssignedIdQueryParameterNames.MANAGED_IDENTITY_RESOURCE_ID_IMDS : ManagedIdentityUserAssignedIdQueryParameterNames.MANAGED_IDENTITY_RESOURCE_ID_NON_IMDS;
      case ManagedIdentityIdType.USER_ASSIGNED_OBJECT_ID:
        return this.logger.info("[Managed Identity] Adding user assigned object id to the request.", ""), ManagedIdentityUserAssignedIdQueryParameterNames.MANAGED_IDENTITY_OBJECT_ID;
      default:
        throw createManagedIdentityError(invalidManagedIdentityIdType);
    }
  }
}
