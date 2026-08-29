// var: init_client15
var init_client15 = __esm(() => {
  init_headers3();
  init_error5();
  init_utils3();
  init_client();
  init_client();
  init_resources();
  AnthropicFoundry = class AnthropicFoundry extends Anthropic {
    constructor({ baseURL = readEnv3("ANTHROPIC_FOUNDRY_BASE_URL"), apiKey = readEnv3("ANTHROPIC_FOUNDRY_API_KEY"), resource = readEnv3("ANTHROPIC_FOUNDRY_RESOURCE"), azureADTokenProvider, dangerouslyAllowBrowser, ...opts } = {}) {
      if (typeof azureADTokenProvider === "function")
        dangerouslyAllowBrowser = !0;
      if (!azureADTokenProvider && !apiKey)
        throw new AnthropicError("Missing credentials. Please pass one of `apiKey` and `azureTokenProvider`, or set the `ANTHROPIC_FOUNDRY_API_KEY` environment variable.");
      if (azureADTokenProvider && apiKey)
        throw new AnthropicError("The `apiKey` and `azureADTokenProvider` arguments are mutually exclusive; only one can be passed at a time.");
      if (!baseURL) {
        if (!resource)
          throw new AnthropicError("Must provide one of the `baseURL` or `resource` arguments, or the `ANTHROPIC_FOUNDRY_RESOURCE` environment variable");
        baseURL = `https://${resource}.services.ai.azure.com/anthropic/`;
      } else if (resource)
        throw new AnthropicError("baseURL and resource are mutually exclusive");
      super({
        apiKey: azureADTokenProvider ?? apiKey,
        baseURL,
        ...opts,
        ...dangerouslyAllowBrowser !== void 0 ? { dangerouslyAllowBrowser } : {}
      });
      this.resource = null, this.messages = makeMessagesResource2(this), this.beta = makeBetaResource2(this), this.models = void 0;
    }
    async authHeaders() {
      if (typeof this._options.apiKey === "function") {
        let token;
        try {
          token = await this._options.apiKey();
        } catch (err) {
          if (err instanceof AnthropicError)
            throw err;
          throw new AnthropicError(`Failed to get token from azureADTokenProvider: ${err.message}`, { cause: err });
        }
        if (typeof token !== "string" || !token)
          throw new AnthropicError(`Expected azureADTokenProvider function argument to return a string but it returned ${token}`);
        return buildHeaders3([{ Authorization: `Bearer ${token}` }]);
      }
      if (typeof this._options.apiKey === "string")
        return buildHeaders3([{ "x-api-key": this.apiKey }]);
      return;
    }
    validateHeaders() {
      return;
    }
  };
});
