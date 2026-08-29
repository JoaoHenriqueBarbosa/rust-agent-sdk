// class: LogsAPI
class LogsAPI {
  constructor() {
    this._proxyLoggerProvider = new ProxyLoggerProvider;
  }
  static getInstance() {
    if (!this._instance)
      this._instance = new LogsAPI;
    return this._instance;
  }
  setGlobalLoggerProvider(provider5) {
    if (_global2[GLOBAL_LOGS_API_KEY])
      return this.getLoggerProvider();
    return _global2[GLOBAL_LOGS_API_KEY] = makeGetter(API_BACKWARDS_COMPATIBILITY_VERSION, provider5, NOOP_LOGGER_PROVIDER), this._proxyLoggerProvider._setDelegate(provider5), provider5;
  }
  getLoggerProvider() {
    var _a3, _b2;
    return (_b2 = (_a3 = _global2[GLOBAL_LOGS_API_KEY]) === null || _a3 === void 0 ? void 0 : _a3.call(_global2, API_BACKWARDS_COMPATIBILITY_VERSION)) !== null && _b2 !== void 0 ? _b2 : this._proxyLoggerProvider;
  }
  getLogger(name3, version5, options2) {
    return this.getLoggerProvider().getLogger(name3, version5, options2);
  }
  disable() {
    delete _global2[GLOBAL_LOGS_API_KEY], this._proxyLoggerProvider = new ProxyLoggerProvider;
  }
}
