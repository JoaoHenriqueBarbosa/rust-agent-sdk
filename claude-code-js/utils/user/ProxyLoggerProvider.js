// class: ProxyLoggerProvider
class ProxyLoggerProvider {
  getLogger(name3, version5, options2) {
    var _a3;
    return (_a3 = this._getDelegateLogger(name3, version5, options2)) !== null && _a3 !== void 0 ? _a3 : new ProxyLogger(this, name3, version5, options2);
  }
  _getDelegate() {
    var _a3;
    return (_a3 = this._delegate) !== null && _a3 !== void 0 ? _a3 : NOOP_LOGGER_PROVIDER;
  }
  _setDelegate(delegate) {
    this._delegate = delegate;
  }
  _getDelegateLogger(name3, version5, options2) {
    var _a3;
    return (_a3 = this._delegate) === null || _a3 === void 0 ? void 0 : _a3.getLogger(name3, version5, options2);
  }
}
