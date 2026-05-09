// class: PipelineRequestImpl
class PipelineRequestImpl {
  url;
  method;
  headers;
  timeout;
  withCredentials;
  body;
  multipartBody;
  formData;
  streamResponseStatusCodes;
  enableBrowserStreams;
  proxySettings;
  disableKeepAlive;
  abortSignal;
  requestId;
  allowInsecureConnection;
  onUploadProgress;
  onDownloadProgress;
  requestOverrides;
  authSchemes;
  constructor(options) {
    this.url = options.url, this.body = options.body, this.headers = options.headers ?? createHttpHeaders(), this.method = options.method ?? "GET", this.timeout = options.timeout ?? 0, this.multipartBody = options.multipartBody, this.formData = options.formData, this.disableKeepAlive = options.disableKeepAlive ?? !1, this.proxySettings = options.proxySettings, this.streamResponseStatusCodes = options.streamResponseStatusCodes, this.withCredentials = options.withCredentials ?? !1, this.abortSignal = options.abortSignal, this.onUploadProgress = options.onUploadProgress, this.onDownloadProgress = options.onDownloadProgress, this.requestId = options.requestId || randomUUID2(), this.allowInsecureConnection = options.allowInsecureConnection ?? !1, this.enableBrowserStreams = options.enableBrowserStreams ?? !1, this.requestOverrides = options.requestOverrides, this.authSchemes = options.authSchemes;
  }
}
