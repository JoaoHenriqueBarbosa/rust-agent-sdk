// class: Client4
class Client4 {
  config;
  middlewareStack = import_middleware_stack7.constructStack();
  initConfig;
  handlers;
  constructor(config5) {
    this.config = config5;
    let { protocol, protocolSettings } = config5;
    if (protocolSettings) {
      if (typeof protocol === "function")
        config5.protocol = new protocol(protocolSettings);
    }
  }
  send(command7, optionsOrCb, cb) {
    let options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0, callback = typeof optionsOrCb === "function" ? optionsOrCb : cb, useHandlerCache = options === void 0 && this.config.cacheMiddleware === !0, handler;
    if (useHandlerCache) {
      if (!this.handlers)
        this.handlers = /* @__PURE__ */ new WeakMap;
      let handlers = this.handlers;
      if (handlers.has(command7.constructor))
        handler = handlers.get(command7.constructor);
      else
        handler = command7.resolveMiddleware(this.middlewareStack, this.config, options), handlers.set(command7.constructor, handler);
    } else
      delete this.handlers, handler = command7.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback)
      handler(command7).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {});
    else
      return handler(command7).then((result) => result.output);
  }
  destroy() {
    this.config?.requestHandler?.destroy?.(), delete this.handlers;
  }
}
