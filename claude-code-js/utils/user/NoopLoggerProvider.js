// class: NoopLoggerProvider
class NoopLoggerProvider {
  getLogger(_name, _version, _options) {
    return new NoopLogger;
  }
}
