// function: createAbortController
function createAbortController(maxListeners = DEFAULT_MAX_LISTENERS) {
  let controller = new AbortController;
  return setMaxListeners2(maxListeners, controller.signal), controller;
}
