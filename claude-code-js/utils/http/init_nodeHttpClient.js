// var: init_nodeHttpClient
var init_nodeHttpClient = __esm(() => {
  init_AbortError2();
  init_httpHeaders();
  init_restError();
  init_log7();
  init_sanitizer();
  DEFAULT_TLS_SETTINGS = {};
  ReportTransform = class ReportTransform extends Transform3 {
    loadedBytes = 0;
    progressCallback;
    _transform(chunk, _encoding, callback) {
      this.push(chunk), this.loadedBytes += chunk.length;
      try {
        this.progressCallback({ loadedBytes: this.loadedBytes }), callback();
      } catch (e) {
        callback(e);
      }
    }
    constructor(progressCallback) {
      super();
      this.progressCallback = progressCallback;
    }
  };
});
