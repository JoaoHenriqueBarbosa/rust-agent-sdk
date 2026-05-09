// var: require_http_transport_utils
var require_http_transport_utils = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.compressAndSend = exports.sendWithHttp = void 0;
  var zlib4 = __require("zlib"), stream_1 = __require("stream"), is_export_retryable_1 = require_is_export_retryable(), types_1 = require_types5(), version_1 = require_version5(), DEFAULT_USER_AGENT = `OTel-OTLP-Exporter-JavaScript/${version_1.VERSION}`;
  function sendWithHttp(request2, url3, headers, compression, userAgent, agent, data, timeoutMillis) {
    return new Promise((resolve26) => {
      let parsedUrl = new URL(url3);
      if (userAgent)
        headers["User-Agent"] = `${userAgent} ${DEFAULT_USER_AGENT}`;
      else
        headers["User-Agent"] = DEFAULT_USER_AGENT;
      let options2 = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: "POST",
        headers,
        agent
      }, req = request2(options2, (res) => {
        let responseData = [];
        res.on("data", (chunk) => responseData.push(chunk)), res.on("end", () => {
          if (res.statusCode && res.statusCode <= 299)
            resolve26({
              status: "success",
              data: Buffer.concat(responseData)
            });
          else if (res.statusCode && (0, is_export_retryable_1.isExportHTTPErrorRetryable)(res.statusCode))
            resolve26({
              status: "retryable",
              retryInMillis: (0, is_export_retryable_1.parseRetryAfterToMills)(res.headers["retry-after"])
            });
          else {
            let error44 = new types_1.OTLPExporterError(res.statusMessage, res.statusCode, Buffer.concat(responseData).toString());
            resolve26({
              status: "failure",
              error: error44
            });
          }
        }), res.on("error", (error44) => {
          if (res.statusCode && res.statusCode <= 299)
            resolve26({
              status: "success"
            });
          else if (res.statusCode && (0, is_export_retryable_1.isExportHTTPErrorRetryable)(res.statusCode))
            resolve26({
              status: "retryable",
              error: error44,
              retryInMillis: (0, is_export_retryable_1.parseRetryAfterToMills)(res.headers["retry-after"])
            });
          else
            resolve26({
              status: "failure",
              error: error44
            });
        });
      });
      req.setTimeout(timeoutMillis, () => {
        req.destroy(), resolve26({
          status: "retryable",
          error: Error("Request timed out")
        });
      }), req.on("error", (error44) => {
        if (isHttpTransportNetworkErrorRetryable(error44))
          resolve26({
            status: "retryable",
            error: error44
          });
        else
          resolve26({
            status: "failure",
            error: error44
          });
      }), compressAndSend(req, compression, data, (error44) => {
        resolve26({
          status: "failure",
          error: error44
        });
      });
    });
  }
  exports.sendWithHttp = sendWithHttp;
  function compressAndSend(req, compression, data, onError) {
    let dataStream = readableFromUint8Array(data);
    if (compression === "gzip")
      req.setHeader("Content-Encoding", "gzip"), dataStream = dataStream.on("error", onError).pipe(zlib4.createGzip()).on("error", onError);
    dataStream.pipe(req).on("error", onError);
  }
  exports.compressAndSend = compressAndSend;
  function readableFromUint8Array(buff) {
    let readable2 = new stream_1.Readable;
    return readable2.push(buff), readable2.push(null), readable2;
  }
  function isHttpTransportNetworkErrorRetryable(error44) {
    let RETRYABLE_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
      "ECONNRESET",
      "ECONNREFUSED",
      "EPIPE",
      "ETIMEDOUT",
      "EAI_AGAIN",
      "ENOTFOUND",
      "ENETUNREACH",
      "EHOSTUNREACH"
    ]);
    if ("code" in error44 && typeof error44.code === "string")
      return RETRYABLE_NETWORK_ERROR_CODES.has(error44.code);
    return !1;
  }
});
