// function: removeAbortHandler
function removeAbortHandler(weakHandler) {
  let parent2 = this.deref(), handler = weakHandler.deref();
  if (parent2 && handler)
    parent2.signal.removeEventListener("abort", handler);
}
