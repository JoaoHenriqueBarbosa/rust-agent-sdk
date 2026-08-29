// var: init_completions
var init_completions = __esm(() => {
  init_headers();
  Completions = class Completions extends APIResource {
    create(params, options) {
      let { betas, ...body } = params;
      return this._client.post("/v1/complete", {
        body,
        timeout: this._client._options.timeout ?? 600000,
        ...options,
        headers: buildHeaders([
          { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
          options?.headers
        ]),
        stream: params.stream ?? !1
      });
    }
  };
});
