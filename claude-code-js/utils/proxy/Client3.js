// class: Client3
class Client3 {
  config;
  middlewareStack = import_middleware_stack5.constructStack();
  initConfig;
  handlers;
  constructor(config4) {
    this.config = config4;
    let { protocol, protocolSettings } = config4;
    if (protocolSettings) {
      if (typeof protocol === "function")
        config4.protocol = new protocol(protocolSettings);
    }
  }
  send(command5, optionsOrCb, cb) {
    let options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0, callback = typeof optionsOrCb === "function" ? optionsOrCb : cb, useHandlerCache = options === void 0 && this.config.cacheMiddleware === !0, handler;
    if (useHandlerCache) {
      if (!this.handlers)
        this.handlers = /* @__PURE__ */ new WeakMap;
      let handlers = this.handlers;
      if (handlers.has(command5.constructor))
        handler = handlers.get(command5.constructor);
      else
        handler = command5.resolveMiddleware(this.middlewareStack, this.config, options), handlers.set(command5.constructor, handler);
    } else
      delete this.handlers, handler = command5.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback)
      handler(command5).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {});
    else
      return handler(command5).then((result) => result.output);
  }
  destroy() {
    this.config?.requestHandler?.destroy?.(), delete this.handlers;
  }
}
