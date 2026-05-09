// var: init_batches2
var init_batches2 = __esm(() => {
  init_pagination();
  init_headers();
  init_jsonl();
  init_error2();
  init_path();
  Batches2 = class Batches2 extends APIResource {
    create(body, options) {
      return this._client.post("/v1/messages/batches", { body, ...options });
    }
    retrieve(messageBatchID, options) {
      return this._client.get(path`/v1/messages/batches/${messageBatchID}`, options);
    }
    list(query = {}, options) {
      return this._client.getAPIList("/v1/messages/batches", Page, { query, ...options });
    }
    delete(messageBatchID, options) {
      return this._client.delete(path`/v1/messages/batches/${messageBatchID}`, options);
    }
    cancel(messageBatchID, options) {
      return this._client.post(path`/v1/messages/batches/${messageBatchID}/cancel`, options);
    }
    async results(messageBatchID, options) {
      let batch = await this.retrieve(messageBatchID);
      if (!batch.results_url)
        throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
      return this._client.get(batch.results_url, {
        ...options,
        headers: buildHeaders([{ Accept: "application/binary" }, options?.headers]),
        stream: !0,
        __binaryResponse: !0
      })._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
    }
  };
});
