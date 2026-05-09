// var: init_messages
var init_messages = __esm(() => {
  init_batches();
  init_batches();
  init_headers();
  init_BetaMessageStream();
  init_constants();
  DEPRECATED_MODELS = {
    "claude-1.3": "November 6th, 2024",
    "claude-1.3-100k": "November 6th, 2024",
    "claude-instant-1.1": "November 6th, 2024",
    "claude-instant-1.1-100k": "November 6th, 2024",
    "claude-instant-1.2": "November 6th, 2024",
    "claude-3-sonnet-20240229": "July 21st, 2025",
    "claude-2.1": "July 21st, 2025",
    "claude-2.0": "July 21st, 2025"
  };
  Messages = class Messages extends APIResource {
    constructor() {
      super(...arguments);
      this.batches = new Batches(this._client);
    }
    create(params, options) {
      let { betas, ...body } = params;
      if (body.model in DEPRECATED_MODELS)
        console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}
Please migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
      let timeout = this._client._options.timeout;
      if (!body.stream && timeout == null) {
        let maxNonstreamingTokens = MODEL_NONSTREAMING_TOKENS[body.model] ?? void 0;
        timeout = this._client.calculateNonstreamingTimeout(body.max_tokens, maxNonstreamingTokens);
      }
      return this._client.post("/v1/messages?beta=true", {
        body,
        timeout: timeout ?? 600000,
        ...options,
        headers: buildHeaders([
          { ...betas?.toString() != null ? { "anthropic-beta": betas?.toString() } : void 0 },
          options?.headers
        ]),
        stream: params.stream ?? !1
      });
    }
    stream(body, options) {
      return BetaMessageStream.createMessage(this, body, options);
    }
    countTokens(params, options) {
      let { betas, ...body } = params;
      return this._client.post("/v1/messages/count_tokens?beta=true", {
        body,
        ...options,
        headers: buildHeaders([
          { "anthropic-beta": [...betas ?? [], "token-counting-2024-11-01"].toString() },
          options?.headers
        ])
      });
    }
  };
  Messages.Batches = Batches;
});
