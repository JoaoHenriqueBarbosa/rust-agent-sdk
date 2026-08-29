// function: userAgentPolicy
function userAgentPolicy(options = {}) {
  let userAgentValue = getUserAgentValue(options.userAgentPrefix);
  return {
    name: userAgentPolicyName,
    async sendRequest(request2, next) {
      if (!request2.headers.has(UserAgentHeaderName))
        request2.headers.set(UserAgentHeaderName, await userAgentValue);
      return next(request2);
    }
  };
}
