// class: ProxyLogger
class ProxyLogger {
  constructor(provider5, name3, version5, options2) {
    this._provider = provider5, this.name = name3, this.version = version5, this.options = options2;
  }
  emit(logRecord) {
    this._getLogger().emit(logRecord);
  }
  _getLogger() {
    if (this._delegate)
      return this._delegate;
    let logger34 = this._provider._getDelegateLogger(this.name, this.version, this.options);
    if (!logger34)
      return NOOP_LOGGER2;
    return this._delegate = logger34, this._delegate;
  }
}
