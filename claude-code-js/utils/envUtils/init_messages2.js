// var: init_messages2
var init_messages2 = __esm(() => {
  init_MessageStream();
  init_batches2();
  init_batches2();
  init_constants();
  Messages2 = class Messages2 extends APIResource {
    constructor() {
      super(...arguments);
      this.batches = new Batches2(this._client);
    }
    create(body, options) {
      if (body.model in DEPRECATED_MODELS2)
        console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS2[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
      let timeout = this._client._options.timeout;
      if (!body.stream && timeout == null) {
        let maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
        timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
      }
      return this._client.post("/v1/messages", {
        body,
        timeout: timeout ?? 600000,
        ...options,
        stream: body.stream ?? !1
      });
    }
    stream(body, options) {
      return MessageStream.createMessage(this, body, options);
    }
    countTokens(body, options) {
      return this._client.post("/v1/messages/count_tokens", { body, ...options });
    }
  };
  DEPRECATED_MODELS2 = {
    "claude-1.3": "November 6th, 2024",
    "claude-1.3-100k": "November 6th, 2024",
    "claude-instant-1.1": "November 6th, 2024",
    "claude-instant-1.1-100k": "November 6th, 2024",
    "claude-instant-1.2": "November 6th, 2024",
    "claude-3-sonnet-20240229": "July 21st, 2025",
    "claude-2.1": "July 21st, 2025",
    "claude-2.0": "July 21st, 2025"
  };
  Messages2.Batches = Batches2;
});
