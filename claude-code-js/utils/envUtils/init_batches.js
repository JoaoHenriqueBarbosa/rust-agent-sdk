// var: init_batches
var init_batches = __esm(() => {
  init_pagination();
  init_headers();
  init_jsonl();
  init_error2();
  init_path();
  Batches = class Batches extends APIResource {
    create(params, options) {
      let { betas, ...body } = params;
      return this._client.post("/v1/messages/batches?beta=true", {
        body,
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
          options?.headers
        ])
      });
    }
    retrieve(messageBatchID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.get(path`/v1/messages/batches/${messageBatchID}?beta=true`, {
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
          options?.headers
        ])
      });
    }
    list(params = {}, options) {
      let { betas, ...query } = params ?? {};
      return this._client.getAPIList("/v1/messages/batches?beta=true", Page, {
        query,
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
          options?.headers
        ])
      });
    }
    delete(messageBatchID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.delete(path`/v1/messages/batches/${messageBatchID}?beta=true`, {
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
          options?.headers
        ])
      });
    }
    cancel(messageBatchID, params = {}, options) {
      let { betas } = params ?? {};
      return this._client.post(path`/v1/messages/batches/${messageBatchID}/cancel?beta=true`, {
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString() },
          options?.headers
        ])
      });
    }
    async results(messageBatchID, params = {}, options) {
      let batch = await this.retrieve(messageBatchID);
      if (!batch.results_url)
        throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
      let { betas } = params ?? {};
      return this._client.get(batch.results_url, {
        ...options,
        headers: buildHeaders([
          {
            "anthropic-beta": [...betas ?? [], "message-batches-2024-09-24"].toString(),
            Accept: "application/binary"
          },
          options?.headers
        ]),
        stream: !0,
        __binaryResponse: !0
      })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
    }
  };
});
