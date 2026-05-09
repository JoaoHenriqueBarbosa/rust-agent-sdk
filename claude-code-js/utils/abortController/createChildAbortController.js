// function: createChildAbortController
function createChildAbortController(parent2, maxListeners) {
  let child = createAbortController(maxListeners);
  if (parent2.signal.aborted)
    return child.abort(parent2.signal.reason), child;
  let weakChild = new WeakRef(child), weakParent = new WeakRef(parent2), handler = propagateAbort.bind(weakParent, weakChild);
  return parent2.signal.addEventListener("abort", handler, { once: !0 }), child.signal.addEventListener("abort", removeAbortHandler.bind(weakParent, new WeakRef(handler)), { once: !0 }), child;
}
