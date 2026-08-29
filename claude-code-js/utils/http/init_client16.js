// var: init_client16
var init_client16 = __esm(() => {
  init_client();
  init_resources();
  init_values5();
  init_headers4();
  init_client();
  import_google_auth_library = __toESM(require_src6(), 1), MODEL_ENDPOINTS2 = /* @__PURE__ */ new Set(["/v1/messages", "/v1/messages?beta=true"]);
  AnthropicVertex = class AnthropicVertex extends BaseAnthropic {
    constructor({ baseURL = readEnv4("ANTHROPIC_VERTEX_BASE_URL"), region = readEnv4("CLOUD_ML_REGION") ?? null, projectId = readEnv4("ANTHROPIC_VERTEX_PROJECT_ID") ?? null, ...opts } = {}) {
      if (!region)
        throw Error("No region was given. The client should be instantiated with the `region` option or the `CLOUD_ML_REGION` environment variable should be set.");
      super({
        baseURL: baseURL || (region === "global" ? "https://aiplatform.googleapis.com/v1" : `https://${region}-aiplatform.googleapis.com/v1`),
        ...opts
      });
      if (this.messages = makeMessagesResource3(this), this.beta = makeBetaResource3(this), this.region = region, this.projectId = projectId, this.accessToken = opts.accessToken ?? null, opts.authClient && opts.googleAuth)
        throw Error("You cannot provide both `authClient` and `googleAuth`. Please provide only one of them.");
      else if (opts.authClient)
        this._authClientPromise = Promise.resolve(opts.authClient);
      else
        this._auth = opts.googleAuth ?? new import_google_auth_library.GoogleAuth({ scopes: "https://www.googleapis.com/auth/cloud-platform" }), this._authClientPromise = this._auth.getClient();
    }
    validateHeaders() {}
    async prepareOptions(options) {
      let authClient = await this._authClientPromise, authHeaders = await authClient.getRequestHeaders(), projectId = authClient.projectId ?? authHeaders["x-goog-user-project"];
      if (!this.projectId && projectId)
        this.projectId = projectId;
      options.headers = buildHeaders4([authHeaders, options.headers]);
    }
    async buildRequest(options) {
      if (isObj2(options.body))
        options.body = { ...options.body };
      if (isObj2(options.body)) {
        if (!options.body.anthropic_version)
          options.body.anthropic_version = DEFAULT_VERSION2;
      }
      if (MODEL_ENDPOINTS2.has(options.path) && options.method === "post") {
        if (!this.projectId)
          throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
        if (!isObj2(options.body))
          throw Error("Expected request body to be an object for post /v1/messages");
        let model = options.body.model;
        options.body.model = void 0;
        let specifier = options.body.stream ?? !1 ? "streamRawPredict" : "rawPredict";
        options.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/${model}:${specifier}`;
      }
      if (options.path === "/v1/messages/count_tokens" || options.path == "/v1/messages/count_tokens?beta=true" && options.method === "post") {
        if (!this.projectId)
          throw Error("No projectId was given and it could not be resolved from credentials. The client should be instantiated with the `projectId` option or the `ANTHROPIC_VERTEX_PROJECT_ID` environment variable should be set.");
        options.path = `/projects/${this.projectId}/locations/${this.region}/publishers/anthropic/models/count-tokens:rawPredict`;
      }
      return super.buildRequest(options);
    }
  };
});
