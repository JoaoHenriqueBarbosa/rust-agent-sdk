// var: init_models
var init_models = __esm(() => {
  init_pagination();
  init_headers();
  init_path();
  Models = class Models extends APIResource {
    retrieve(modelID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.get(path`/v1/models/${modelID}?beta=true`, {
        ...options,
        headers: buildHeaders([
          { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
          options?.headers
        ])
      });
    }
    list(params = {}, options) {
      let { betas, ...query } = params ?? {};
      return this._client.getAPIList("/v1/models?beta=true", Page, {
        query,
        ...options,
        headers: buildHeaders([
          { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
          options?.headers
        ])
      });
    }
  };
});
