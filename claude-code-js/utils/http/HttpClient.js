// class: HttpClient
class HttpClient {
  async sendGetRequestAsync(url3, options, timeout) {
    return this.sendRequest(url3, HttpMethod2.GET, options, timeout);
  }
  async sendPostRequestAsync(url3, options) {
    return this.sendRequest(url3, HttpMethod2.POST, options);
  }
  async sendRequest(url3, method, options, timeout) {
    let controller = new AbortController, timeoutId;
    if (timeout)
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeout);
    let fetchOptions = {
      method,
      headers: getFetchHeaders(options),
      signal: controller.signal
    };
    if (method === HttpMethod2.POST)
      fetchOptions.body = options?.body || "";
    let response7;
    try {
      response7 = await fetch(url3, fetchOptions);
    } catch (error43) {
      if (timeoutId)
        clearTimeout(timeoutId);
      if (error43 instanceof Error && error43.name === "AbortError")
        throw createAuthError(exports_ClientAuthErrorCodes.networkError, "Request timeout");
      let baseAuthError = createAuthError(exports_ClientAuthErrorCodes.networkError, `Network request failed: ${error43 instanceof Error ? error43.message : "unknown"}`);
      throw createNetworkError(baseAuthError, void 0, void 0, error43 instanceof Error ? error43 : void 0);
    }
    if (timeoutId)
      clearTimeout(timeoutId);
    try {
      return {
        headers: getHeaderDict(response7.headers),
        body: await response7.json(),
        status: response7.status
      };
    } catch (error43) {
      throw createAuthError(exports_ClientAuthErrorCodes.tokenParsingError, `Failed to parse response: ${error43 instanceof Error ? error43.message : "unknown"}`);
    }
  }
}
