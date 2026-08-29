// var: init_fetch
var init_fetch = __esm(() => {
  init_platform2();
  init_utils();
  init_AxiosError();
  init_composeSignals();
  init_AxiosHeaders();
  init_progressEventReducer();
  init_resolveConfig();
  init_settle();
  ({ isFunction: isFunction3 } = utils_default), globalFetchAPI = (({ Request: Request2, Response: Response2 }) => ({
    Request: Request2,
    Response: Response2
  }))(utils_default.global), { ReadableStream: ReadableStream2, TextEncoder: TextEncoder2 } = utils_default.global, seedCache = /* @__PURE__ */ new Map, adapter = getFetch();
});
