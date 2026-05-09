// var: init_adapters
var init_adapters = __esm(() => {
  init_utils();
  init_http();
  init_xhr();
  init_fetch();
  init_AxiosError();
  knownAdapters = {
    http: http_default,
    xhr: xhr_default,
    fetch: {
      get: getFetch
    }
  };
  utils_default.forEach(knownAdapters, (fn, value) => {
    if (fn) {
      try {
        Object.defineProperty(fn, "name", { value });
      } catch (e) {}
      Object.defineProperty(fn, "adapterName", { value });
    }
  });
  adapters_default = {
    getAdapter,
    adapters: knownAdapters
  };
});
