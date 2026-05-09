// function: redirectPolicy
function redirectPolicy(options = {}) {
  let { maxRetries = 20, allowCrossOriginRedirects = !1 } = options;
  return {
    name: redirectPolicyName,
    async sendRequest(request2, next) {
      let response7 = await next(request2);
      return handleRedirect(next, response7, maxRetries, allowCrossOriginRedirects);
    }
  };
}
