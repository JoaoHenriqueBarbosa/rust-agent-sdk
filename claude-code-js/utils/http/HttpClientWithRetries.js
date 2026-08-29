// class: HttpClientWithRetries
class HttpClientWithRetries {
  constructor(httpClientNoRetries, retryPolicy, logger10) {
    this.httpClientNoRetries = httpClientNoRetries, this.retryPolicy = retryPolicy, this.logger = logger10;
  }
  async sendNetworkRequestAsyncHelper(httpMethod, url3, options) {
    if (httpMethod === HttpMethod2.GET)
      return this.httpClientNoRetries.sendGetRequestAsync(url3, options);
    else
      return this.httpClientNoRetries.sendPostRequestAsync(url3, options);
  }
  async sendNetworkRequestAsync(httpMethod, url3, options) {
    let response7 = await this.sendNetworkRequestAsyncHelper(httpMethod, url3, options);
    if ("isNewRequest" in this.retryPolicy)
      this.retryPolicy.isNewRequest = !0;
    let currentRetry = 0;
    while (await this.retryPolicy.pauseForRetry(response7.status, currentRetry, this.logger, response7.headers[exports_Constants.HeaderNames.RETRY_AFTER]))
      response7 = await this.sendNetworkRequestAsyncHelper(httpMethod, url3, options), currentRetry++;
    return response7;
  }
  async sendGetRequestAsync(url3, options) {
    return this.sendNetworkRequestAsync(HttpMethod2.GET, url3, options);
  }
  async sendPostRequestAsync(url3, options) {
    return this.sendNetworkRequestAsync(HttpMethod2.POST, url3, options);
  }
}
