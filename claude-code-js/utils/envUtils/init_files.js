// var: init_files
var init_files = __esm(() => {
  init_pagination();
  init_headers();
  init_uploads();
  init_path();
  Files = class Files extends APIResource {
    list(params = {}, options) {
      let { betas, ...query } = params ?? {};
      return this._client.getAPIList("/v1/files", Page, {
        query,
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
          options?.headers
        ])
      });
    }
    delete(fileID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.delete(path`/v1/files/${fileID}`, {
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
          options?.headers
        ])
      });
    }
    download(fileID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.get(path`/v1/files/${fileID}/content`, {
        ...options,
        headers: buildHeaders([
          {
            "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString(),
            Accept: "application/binary"
          },
          options?.headers
        ]),
        __binaryResponse: !0
      });
    }
    retrieveMetadata(fileID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.get(path`/v1/files/${fileID}`, {
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
          options?.headers
        ])
      });
    }
    upload(params, options) {
      let { betas, ...body } = params;
      return this._client.post("/v1/files", multipartFormRequestOptions({
        body,
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "files-api-2025-04-14"].toString() },
          options?.headers
        ])
      }, this._client));
    }
  };
});
