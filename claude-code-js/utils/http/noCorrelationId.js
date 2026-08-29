// var: noCorrelationId
var noCorrelationId = "noCorrelationId", IdentityClient;
var init_identityClient = __esm(() => {
  init_esm7();
  init_esm4();
  init_esm6();
  init_errors7();
  init_constants7();
  init_tracing();
  init_logging();
  IdentityClient = class IdentityClient extends ServiceClient {
    authorityHost;
    allowLoggingAccountIdentifiers;
    abortControllers;
    allowInsecureConnection = !1;
    tokenCredentialOptions;
    constructor(options) {
      let packageDetails = `azsdk-js-identity/${SDK_VERSION}`, userAgentPrefix = options?.userAgentOptions?.userAgentPrefix ? `${options.userAgentOptions.userAgentPrefix} ${packageDetails}` : `${packageDetails}`, baseUri = getIdentityClientAuthorityHost(options);
      if (!baseUri.startsWith("https:"))
        throw Error("The authorityHost address must use the 'https' protocol.");
      super({
        requestContentType: "application/json; charset=utf-8",
        retryOptions: {
          maxRetries: 3
        },
        ...options,
        userAgentOptions: {
          userAgentPrefix
        },
        baseUri
      });
      if (this.authorityHost = baseUri, this.abortControllers = /* @__PURE__ */ new Map, this.allowLoggingAccountIdentifiers = options?.loggingOptions?.allowLoggingAccountIdentifiers, this.tokenCredentialOptions = { ...options }, options?.allowInsecureConnection)
        this.allowInsecureConnection = options.allowInsecureConnection;
    }
    async sendTokenRequest(request2) {
      logger8.info(`IdentityClient: sending token request to [${request2.url}]`);
      let response7 = await this.sendRequest(request2);
      if (response7.bodyAsText && (response7.status === 200 || response7.status === 201)) {
        let parsedBody = JSON.parse(response7.bodyAsText);
        if (!parsedBody.access_token)
          return null;
        this.logIdentifiers(response7);
        let token = {
          accessToken: {
            token: parsedBody.access_token,
            expiresOnTimestamp: parseExpirationTimestamp(parsedBody),
            refreshAfterTimestamp: parseRefreshTimestamp(parsedBody),
            tokenType: "Bearer"
          },
          refreshToken: parsedBody.refresh_token
        };
        return logger8.info(`IdentityClient: [${request2.url}] token acquired, expires on ${token.accessToken.expiresOnTimestamp}`), token;
      } else {
        let error43 = new AuthenticationError2(response7.status, response7.bodyAsText);
        throw logger8.warning(`IdentityClient: authentication error. HTTP status: ${response7.status}, ${error43.errorResponse.errorDescription}`), error43;
      }
    }
    async refreshAccessToken(tenantId, clientId, scopes, refreshToken, clientSecret, options = {}) {
      if (refreshToken === void 0)
        return null;
      logger8.info(`IdentityClient: refreshing access token with client ID: ${clientId}, scopes: ${scopes} started`);
      let refreshParams = {
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: refreshToken,
        scope: scopes
      };
      if (clientSecret !== void 0)
        refreshParams.client_secret = clientSecret;
      let query = new URLSearchParams(refreshParams);
      return tracingClient.withSpan("IdentityClient.refreshAccessToken", options, async (updatedOptions) => {
        try {
          let urlSuffix = getIdentityTokenEndpointSuffix(tenantId), request2 = createPipelineRequest2({
            url: `${this.authorityHost}/${tenantId}/${urlSuffix}`,
            method: "POST",
            body: query.toString(),
            abortSignal: options.abortSignal,
            headers: createHttpHeaders2({
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded"
            }),
            tracingOptions: updatedOptions.tracingOptions
          }), response7 = await this.sendTokenRequest(request2);
          return logger8.info(`IdentityClient: refreshed token for client ID: ${clientId}`), response7;
        } catch (err) {
          if (err.name === AuthenticationErrorName && err.errorResponse.error === "interaction_required")
            return logger8.info(`IdentityClient: interaction required for client ID: ${clientId}`), null;
          else
            throw logger8.warning(`IdentityClient: failed refreshing token for client ID: ${clientId}: ${err}`), err;
        }
      });
    }
    generateAbortSignal(correlationId) {
      let controller = new AbortController, controllers = this.abortControllers.get(correlationId) || [];
      controllers.push(controller), this.abortControllers.set(correlationId, controllers);
      let existingOnAbort = controller.signal.onabort;
      return controller.signal.onabort = (...params) => {
        if (this.abortControllers.set(correlationId, void 0), existingOnAbort)
          existingOnAbort.apply(controller.signal, params);
      }, controller.signal;
    }
    abortRequests(correlationId) {
      let key = correlationId || noCorrelationId, controllers = [
        ...this.abortControllers.get(key) || [],
        ...this.abortControllers.get(noCorrelationId) || []
      ];
      if (!controllers.length)
        return;
      for (let controller of controllers)
        controller.abort();
      this.abortControllers.set(key, void 0);
    }
    getCorrelationId(options) {
      let parameter = options?.body?.split("&").map((part) => part.split("=")).find(([key]) => key === "client-request-id");
      return parameter && parameter.length ? parameter[1] || noCorrelationId : noCorrelationId;
    }
    async sendGetRequestAsync(url3, options) {
      let request2 = createPipelineRequest2({
        url: url3,
        method: "GET",
        body: options?.body,
        allowInsecureConnection: this.allowInsecureConnection,
        headers: createHttpHeaders2(options?.headers),
        abortSignal: this.generateAbortSignal(noCorrelationId)
      }), response7 = await this.sendRequest(request2);
      return this.logIdentifiers(response7), {
        body: response7.bodyAsText ? JSON.parse(response7.bodyAsText) : void 0,
        headers: response7.headers.toJSON(),
        status: response7.status
      };
    }
    async sendPostRequestAsync(url3, options) {
      let request2 = createPipelineRequest2({
        url: url3,
        method: "POST",
        body: options?.body,
        headers: createHttpHeaders2(options?.headers),
        allowInsecureConnection: this.allowInsecureConnection,
        abortSignal: this.generateAbortSignal(this.getCorrelationId(options))
      }), response7 = await this.sendRequest(request2);
      return this.logIdentifiers(response7), {
        body: response7.bodyAsText ? JSON.parse(response7.bodyAsText) : void 0,
        headers: response7.headers.toJSON(),
        status: response7.status
      };
    }
    getTokenCredentialOptions() {
      return this.tokenCredentialOptions;
    }
    logIdentifiers(response7) {
      if (!this.allowLoggingAccountIdentifiers || !response7.bodyAsText)
        return;
      let unavailableUpn = "No User Principal Name available";
      try {
        let accessToken = (response7.parsedBody || JSON.parse(response7.bodyAsText)).access_token;
        if (!accessToken)
          return;
        let base64Metadata = accessToken.split(".")[1], { appid, upn, tid, oid } = JSON.parse(Buffer.from(base64Metadata, "base64").toString("utf8"));
        logger8.info(`[Authenticated account] Client ID: ${appid}. Tenant ID: ${tid}. User Principal Name: ${upn || unavailableUpn}. Object ID (user): ${oid}`);
      } catch (e) {
        logger8.warning("allowLoggingAccountIdentifiers was set, but we couldn't log the account information. Error:", e.message);
      }
    }
  };
});
