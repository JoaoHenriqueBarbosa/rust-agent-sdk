// var: init_client
var init_client = __esm(() => {
  init_tslib();
  init_values();
  init_log();
  init_detect_platform();
  init_error();
  init_pagination();
  init_uploads2();
  init_resources();
  init_api_promise();
  init_detect_platform();
  init_headers();
  init_completions();
  init_models2();
  init_log();
  init_values();
  init_beta();
  init_messages2();
  _a = BaseAnthropic, _BaseAnthropic_encoder = /* @__PURE__ */ new WeakMap;
  BaseAnthropic.Anthropic = _a;
  BaseAnthropic.HUMAN_PROMPT = `

Human:`;
  BaseAnthropic.AI_PROMPT = `

Assistant:`;
  BaseAnthropic.DEFAULT_TIMEOUT = 600000;
  BaseAnthropic.AnthropicError = AnthropicError;
  BaseAnthropic.APIError = APIError;
  BaseAnthropic.APIConnectionError = APIConnectionError;
  BaseAnthropic.APIConnectionTimeoutError = APIConnectionTimeoutError;
  BaseAnthropic.APIUserAbortError = APIUserAbortError;
  BaseAnthropic.NotFoundError = NotFoundError;
  BaseAnthropic.ConflictError = ConflictError;
  BaseAnthropic.RateLimitError = RateLimitError;
  BaseAnthropic.BadRequestError = BadRequestError;
  BaseAnthropic.AuthenticationError = AuthenticationError;
  BaseAnthropic.InternalServerError = InternalServerError;
  BaseAnthropic.PermissionDeniedError = PermissionDeniedError;
  BaseAnthropic.UnprocessableEntityError = UnprocessableEntityError;
  BaseAnthropic.toFile = toFile;
  Anthropic = class Anthropic extends BaseAnthropic {
    constructor() {
      super(...arguments);
      this.completions = new Completions(this), this.messages = new Messages2(this), this.models = new Models2(this), this.beta = new Beta(this);
    }
  };
  Anthropic.Completions = Completions;
  Anthropic.Messages = Messages2;
  Anthropic.Models = Models2;
  Anthropic.Beta = Beta;
});
