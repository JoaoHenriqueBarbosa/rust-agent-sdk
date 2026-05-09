// function: wrapAbortSignalLikePolicy
function wrapAbortSignalLikePolicy() {
  return {
    name: wrapAbortSignalLikePolicyName,
    sendRequest: async (request2, next) => {
      if (!request2.abortSignal)
        return next(request2);
      let { abortSignal, cleanup } = wrapAbortSignalLike(request2.abortSignal);
      request2.abortSignal = abortSignal;
      try {
        return await next(request2);
      } finally {
        cleanup?.();
      }
    }
  };
}
