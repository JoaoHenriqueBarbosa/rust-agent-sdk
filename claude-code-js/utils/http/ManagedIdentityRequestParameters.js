// class: ManagedIdentityRequestParameters
class ManagedIdentityRequestParameters {
  constructor(httpMethod, endpoint7, retryPolicy) {
    this.httpMethod = httpMethod, this._baseEndpoint = endpoint7, this.headers = {}, this.bodyParameters = {}, this.queryParameters = {}, this.retryPolicy = retryPolicy || new DefaultManagedIdentityRetryPolicy;
  }
  computeUri() {
    let parameters = /* @__PURE__ */ new Map;
    if (this.queryParameters)
      exports_RequestParameterBuilder.addExtraParameters(parameters, this.queryParameters);
    let queryParametersString = exports_UrlUtils.mapToQueryString(parameters);
    return UrlString.appendQueryString(this._baseEndpoint, queryParametersString);
  }
  computeParametersBodyString() {
    let parameters = /* @__PURE__ */ new Map;
    if (this.bodyParameters)
      exports_RequestParameterBuilder.addExtraParameters(parameters, this.bodyParameters);
    return exports_UrlUtils.mapToQueryString(parameters);
  }
}
