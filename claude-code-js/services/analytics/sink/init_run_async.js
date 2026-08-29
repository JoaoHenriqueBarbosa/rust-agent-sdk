// var: init_run_async
var init_run_async = __esm(() => {
  pushChunks = callbackify(async (getChunks, state, getChunksArguments, transformStream) => {
    state.currentIterable = getChunks(...getChunksArguments);
    try {
      for await (let chunk of state.currentIterable)
        transformStream.push(chunk);
    } finally {
      delete state.currentIterable;
    }
  }), destroyTransform = callbackify(async ({ currentIterable }, error41) => {
    if (currentIterable !== void 0) {
      await (error41 ? currentIterable.throw(error41) : currentIterable.return());
      return;
    }
    if (error41)
      throw error41;
  });
});
