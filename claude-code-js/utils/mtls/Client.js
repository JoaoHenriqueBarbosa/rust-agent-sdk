// class: Client
class Client {
  config;
  middlewareStack = import_middleware_stack.constructStack();
  initConfig;
  handlers;
  constructor(config3) {
    this.config = config3;
    let { protocol, protocolSettings } = config3;
    if (protocolSettings) {
      if (typeof protocol === "function")
        config3.protocol = new protocol(protocolSettings);
    }
  }
  send(command2, optionsOrCb, cb) {
    let options = typeof optionsOrCb !== "function" ? optionsOrCb : void 0, callback = typeof optionsOrCb === "function" ? optionsOrCb : cb, useHandlerCache = options === void 0 && this.config.cacheMiddleware === !0, handler;
    if (useHandlerCache) {
      if (!this.handlers)
        this.handlers = /* @__PURE__ */ new WeakMap;
      let handlers = this.handlers;
      if (handlers.has(command2.constructor))
        handler = handlers.get(command2.constructor);
      else
        handler = command2.resolveMiddleware(this.middlewareStack, this.config, options), handlers.set(command2.constructor, handler);
    } else
      delete this.handlers, handler = command2.resolveMiddleware(this.middlewareStack, this.config, options);
    if (callback)
      handler(command2).then((result) => callback(null, result.output), (err) => callback(err)).catch(() => {});
    else
      return handler(command2).then((result) => result.output);
  }
  destroy() {
    this.config?.requestHandler?.destroy?.(), delete this.handlers;
  }
}
