// function: logPolicy
function logPolicy(options = {}) {
  let logger12 = options.logger ?? logger11.info, sanitizer = new Sanitizer({
    additionalAllowedHeaderNames: options.additionalAllowedHeaderNames,
    additionalAllowedQueryParameters: options.additionalAllowedQueryParameters
  });
  return {
    name: logPolicyName,
    async sendRequest(request2, next) {
      if (!logger12.enabled)
        return next(request2);
      logger12(`Request: ${sanitizer.sanitize(request2)}`);
      let response7 = await next(request2);
      return logger12(`Response status code: ${response7.status}`), logger12(`Headers: ${sanitizer.sanitize(response7.headers)}`), response7;
    }
  };
}
