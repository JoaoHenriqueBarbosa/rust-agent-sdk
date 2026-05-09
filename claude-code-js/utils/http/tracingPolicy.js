// function: tracingPolicy
function tracingPolicy(options = {}) {
  let userAgentPromise = getUserAgentValue(options.userAgentPrefix), sanitizer = new Sanitizer({
    additionalAllowedQueryParameters: options.additionalAllowedQueryParameters
  }), tracingClient2 = tryCreateTracingClient();
  return {
    name: tracingPolicyName,
    async sendRequest(request2, next) {
      if (!tracingClient2)
        return next(request2);
      let userAgent = await userAgentPromise, spanAttributes = {
        "http.url": sanitizer.sanitizeUrl(request2.url),
        "http.method": request2.method,
        "http.user_agent": userAgent,
        requestId: request2.requestId
      };
      if (userAgent)
        spanAttributes["http.user_agent"] = userAgent;
      let { span, tracingContext } = tryCreateSpan(tracingClient2, request2, spanAttributes) ?? {};
      if (!span || !tracingContext)
        return next(request2);
      try {
        let response7 = await tracingClient2.withContext(tracingContext, next, request2);
        return tryProcessResponse(span, response7), response7;
      } catch (err) {
        throw tryProcessError(span, err), err;
      }
    }
  };
}
