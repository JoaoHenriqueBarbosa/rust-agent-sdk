// class: ServiceClient
class ServiceClient {
  _endpoint;
  _requestContentType;
  _allowInsecureConnection;
  _httpClient;
  pipeline;
  constructor(options = {}) {
    if (this._requestContentType = options.requestContentType, this._endpoint = options.endpoint ?? options.baseUri, options.baseUri)
      logger13.warning("The baseUri option for SDK Clients has been deprecated, please use endpoint instead.");
    if (this._allowInsecureConnection = options.allowInsecureConnection, this._httpClient = options.httpClient || getCachedDefaultHttpClient(), this.pipeline = options.pipeline || createDefaultPipeline(options), options.additionalPolicies?.length)
      for (let { policy, position } of options.additionalPolicies) {
        let afterPhase = position === "perRetry" ? "Sign" : void 0;
        this.pipeline.addPolicy(policy, {
          afterPhase
        });
      }
  }
  async sendRequest(request2) {
    return this.pipeline.sendRequest(this._httpClient, request2);
  }
  async sendOperationRequest(operationArguments, operationSpec) {
    let endpoint7 = operationSpec.baseUrl || this._endpoint;
    if (!endpoint7)
      throw Error("If operationSpec.baseUrl is not specified, then the ServiceClient must have a endpoint string property that contains the base URL to use.");
    let url3 = getRequestUrl(endpoint7, operationSpec, operationArguments, this), request2 = createPipelineRequest2({
      url: url3
    });
    request2.method = operationSpec.httpMethod;
    let operationInfo = getOperationRequestInfo(request2);
    operationInfo.operationSpec = operationSpec, operationInfo.operationArguments = operationArguments;
    let contentType = operationSpec.contentType || this._requestContentType;
    if (contentType && operationSpec.requestBody)
      request2.headers.set("Content-Type", contentType);
    let options = operationArguments.options;
    if (options) {
      let requestOptions = options.requestOptions;
      if (requestOptions) {
        if (requestOptions.timeout)
          request2.timeout = requestOptions.timeout;
        if (requestOptions.onUploadProgress)
          request2.onUploadProgress = requestOptions.onUploadProgress;
        if (requestOptions.onDownloadProgress)
          request2.onDownloadProgress = requestOptions.onDownloadProgress;
        if (requestOptions.shouldDeserialize !== void 0)
          operationInfo.shouldDeserialize = requestOptions.shouldDeserialize;
        if (requestOptions.allowInsecureConnection)
          request2.allowInsecureConnection = !0;
      }
      if (options.abortSignal)
        request2.abortSignal = options.abortSignal;
      if (options.tracingOptions)
        request2.tracingOptions = options.tracingOptions;
    }
    if (this._allowInsecureConnection)
      request2.allowInsecureConnection = !0;
    if (request2.streamResponseStatusCodes === void 0)
      request2.streamResponseStatusCodes = getStreamingResponseStatusCodes(operationSpec);
    try {
      let rawResponse = await this.sendRequest(request2), flatResponse = flattenResponse(rawResponse, operationSpec.responses[rawResponse.status]);
      if (options?.onResponse)
        options.onResponse(rawResponse, flatResponse);
      return flatResponse;
    } catch (error43) {
      if (typeof error43 === "object" && error43?.response) {
        let rawResponse = error43.response, flatResponse = flattenResponse(rawResponse, operationSpec.responses[error43.statusCode] || operationSpec.responses.default);
        if (error43.details = flatResponse, options?.onResponse)
          options.onResponse(rawResponse, flatResponse, error43);
      }
      throw error43;
    }
  }
}
