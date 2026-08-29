// class: BasicTracerProvider
class BasicTracerProvider {
  _config;
  _tracers = /* @__PURE__ */ new Map;
  _resource;
  _activeSpanProcessor;
  constructor(config10 = {}) {
    let mergedConfig = import_core55.merge({}, loadDefaultConfig(), reconfigureLimits(config10));
    this._resource = mergedConfig.resource ?? import_resources2.defaultResource(), this._config = Object.assign({}, mergedConfig, {
      resource: this._resource
    });
    let spanProcessors = [];
    if (config10.spanProcessors?.length)
      spanProcessors.push(...config10.spanProcessors);
    this._activeSpanProcessor = new MultiSpanProcessor(spanProcessors);
  }
  getTracer(name3, version5, options2) {
    let key2 = `${name3}@${version5 || ""}:${options2?.schemaUrl || ""}`;
    if (!this._tracers.has(key2))
      this._tracers.set(key2, new Tracer({ name: name3, version: version5, schemaUrl: options2?.schemaUrl }, this._config, this._resource, this._activeSpanProcessor));
    return this._tracers.get(key2);
  }
  forceFlush() {
    let timeout = this._config.forceFlushTimeoutMillis, promises = this._activeSpanProcessor._spanProcessors.map((spanProcessor) => {
      return new Promise((resolve26) => {
        let state3, timeoutInterval = setTimeout(() => {
          resolve26(Error(`Span processor did not completed within timeout period of ${timeout} ms`)), state3 = ForceFlushState.timeout;
        }, timeout);
        spanProcessor.forceFlush().then(() => {
          if (clearTimeout(timeoutInterval), state3 !== ForceFlushState.timeout)
            state3 = ForceFlushState.resolved, resolve26(state3);
        }).catch((error44) => {
          clearTimeout(timeoutInterval), state3 = ForceFlushState.error, resolve26(error44);
        });
      });
    });
    return new Promise((resolve26, reject2) => {
      Promise.all(promises).then((results) => {
        let errors8 = results.filter((result) => result !== ForceFlushState.resolved);
        if (errors8.length > 0)
          reject2(errors8);
        else
          resolve26();
      }).catch((error44) => reject2([error44]));
    });
  }
  shutdown() {
    return this._activeSpanProcessor.shutdown();
  }
}
