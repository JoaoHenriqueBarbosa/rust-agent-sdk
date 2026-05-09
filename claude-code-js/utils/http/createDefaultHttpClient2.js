// function: createDefaultHttpClient2
function createDefaultHttpClient2() {
  let client14 = createDefaultHttpClient();
  return {
    async sendRequest(request2) {
      let { abortSignal, cleanup } = request2.abortSignal ? wrapAbortSignalLike(request2.abortSignal) : {};
      try {
        return request2.abortSignal = abortSignal, await client14.sendRequest(request2);
      } finally {
        cleanup?.();
      }
    }
  };
}
