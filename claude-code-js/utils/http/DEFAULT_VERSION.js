// var: DEFAULT_VERSION
var DEFAULT_VERSION = "bedrock-2023-05-31", MODEL_ENDPOINTS, AnthropicBedrock;
var init_client14 = __esm(() => {
  init_client();
  init_resources();
  init_auth13();
  init_streaming4();
  init_values3();
  init_headers2();
  init_path3();
  init_log4();
  init_client();
  MODEL_ENDPOINTS = /* @__PURE__ */ new Set(["/v1/complete", "/v1/messages", "/v1/messages?beta=true"]);
  AnthropicBedrock = class AnthropicBedrock extends BaseAnthropic {
    constructor({ awsRegion = readEnv2("AWS_REGION") ?? "us-east-1", baseURL = readEnv2("ANTHROPIC_BEDROCK_BASE_URL") ?? `https://bedrock-runtime.${awsRegion}.amazonaws.com`, awsSecretKey = null, awsAccessKey = null, awsSessionToken = null, providerChainResolver = null, ...opts } = {}) {
      super({ baseURL, ...opts });
      this.skipAuth = !1, this.messages = makeMessagesResource(this), this.completions = new Completions(this), this.beta = makeBetaResource(this);
      let hasAccess = awsAccessKey != null, hasSecret = awsSecretKey != null;
      if (hasAccess !== hasSecret)
        loggerFor2(this).warn("Warning: Passing only one of `awsAccessKey` or `awsSecretKey` is deprecated. Please provide both keys, or provide neither and rely on the AWS credential provider chain.");
      this.awsSecretKey = awsSecretKey, this.awsAccessKey = awsAccessKey, this.awsRegion = awsRegion, this.awsSessionToken = awsSessionToken, this.skipAuth = opts.skipAuth ?? !1, this.providerChainResolver = providerChainResolver;
    }
    validateHeaders() {}
    async prepareRequest(request2, { url: url3, options }) {
      if (this.skipAuth)
        return;
      let regionName = this.awsRegion;
      if (!regionName)
        throw Error("Expected `awsRegion` option to be passed to the client or the `AWS_REGION` environment variable to be present");
      let headers = await getAuthHeaders2(request2, {
        url: url3,
        regionName,
        awsAccessKey: this.awsAccessKey,
        awsSecretKey: this.awsSecretKey,
        awsSessionToken: this.awsSessionToken,
        fetchOptions: this.fetchOptions,
        providerChainResolver: this.providerChainResolver
      });
      request2.headers = buildHeaders2([headers, request2.headers]).values;
    }
    async buildRequest(options) {
      if (options.__streamClass = Stream2, isObj(options.body))
        options.body = { ...options.body };
      if (isObj(options.body)) {
        if (!options.body.anthropic_version)
          options.body.anthropic_version = DEFAULT_VERSION;
        if (options.headers && !options.body.anthropic_beta) {
          let betas = buildHeaders2([options.headers]).values.get("anthropic-beta");
          if (betas != null)
            options.body.anthropic_beta = betas.split(",");
        }
      }
      if (MODEL_ENDPOINTS.has(options.path) && options.method === "post") {
        if (!isObj(options.body))
          throw Error("Expected request body to be an object for post /v1/messages");
        let model = options.body.model;
        options.body.model = void 0;
        let stream10 = options.body.stream;
        if (options.body.stream = void 0, stream10)
          options.path = path9`/model/${model}/invoke-with-response-stream`;
        else
          options.path = path9`/model/${model}/invoke`;
      }
      return super.buildRequest(options);
    }
  };
});
