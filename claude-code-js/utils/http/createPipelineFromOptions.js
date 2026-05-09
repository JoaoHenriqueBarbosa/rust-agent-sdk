// function: createPipelineFromOptions
function createPipelineFromOptions(options) {
  let pipeline2 = createEmptyPipeline2();
  if (isNodeLike2) {
    if (options.agent)
      pipeline2.addPolicy(agentPolicy2(options.agent));
    if (options.tlsOptions)
      pipeline2.addPolicy(tlsPolicy2(options.tlsOptions));
    pipeline2.addPolicy(proxyPolicy2(options.proxyOptions)), pipeline2.addPolicy(decompressResponsePolicy2());
  }
  if (pipeline2.addPolicy(wrapAbortSignalLikePolicy()), pipeline2.addPolicy(formDataPolicy2(), { beforePolicies: [multipartPolicyName2] }), pipeline2.addPolicy(userAgentPolicy(options.userAgentOptions)), pipeline2.addPolicy(setClientRequestIdPolicy(options.telemetryOptions?.clientRequestIdHeaderName)), pipeline2.addPolicy(multipartPolicy2(), { afterPhase: "Deserialize" }), pipeline2.addPolicy(defaultRetryPolicy2(options.retryOptions), { phase: "Retry" }), pipeline2.addPolicy(tracingPolicy({ ...options.userAgentOptions, ...options.loggingOptions }), {
    afterPhase: "Retry"
  }), isNodeLike2)
    pipeline2.addPolicy(redirectPolicy2(options.redirectOptions), { afterPhase: "Retry" });
  return pipeline2.addPolicy(logPolicy2(options.loggingOptions), { afterPhase: "Sign" }), pipeline2;
}
