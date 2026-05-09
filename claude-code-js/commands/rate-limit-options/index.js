// Original: src/commands/rate-limit-options/index.ts
var rateLimitOptions, rate_limit_options_default;
var init_rate_limit_options2 = __esm(() => {
  init_auth14();
  rateLimitOptions = {
    type: "local-jsx",
    name: "rate-limit-options",
    description: "Show options when rate limit is reached",
    isEnabled: () => {
      if (!isClaudeAISubscriber())
        return !1;
      return !0;
    },
    isHidden: !0,
    load: () => Promise.resolve().then(() => (init_rate_limit_options(), exports_rate_limit_options))
  }, rate_limit_options_default = rateLimitOptions;
});
