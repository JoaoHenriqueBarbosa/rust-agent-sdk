// var: init_models2
var init_models2 = __esm(() => {
  init_pagination();
  init_headers();
  init_path();
  Models2 = class Models2 extends APIResource {
    retrieve(modelID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.get(path`/v1/models/${modelID}`, {
        ...options,
        headers: buildHeaders([
          { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
          options?.headers
        ])
      });
    }
    list(params = {}, options) {
      let { betas, ...query } = params ?? {};
      return this._client.getAPIList("/v1/models", Page, {
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
