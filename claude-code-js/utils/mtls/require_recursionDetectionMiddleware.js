// var: require_recursionDetectionMiddleware
var require_recursionDetectionMiddleware = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.recursionDetectionMiddleware = void 0;
  var lambda_invoke_store_1 = require_invoke_store(), protocol_http_1 = require_dist_cjs47(), TRACE_ID_HEADER_NAME = "X-Amzn-Trace-Id", ENV_LAMBDA_FUNCTION_NAME = "AWS_LAMBDA_FUNCTION_NAME", ENV_TRACE_ID = "_X_AMZN_TRACE_ID", recursionDetectionMiddleware = () => (next) => async (args) => {
    let { request: request2 } = args;
    if (!protocol_http_1.HttpRequest.isInstance(request2))
      return next(args);
    let traceIdHeader = Object.keys(request2.headers ?? {}).find((h2) => h2.toLowerCase() === TRACE_ID_HEADER_NAME.toLowerCase()) ?? TRACE_ID_HEADER_NAME;
    if (request2.headers.hasOwnProperty(traceIdHeader))
      return next(args);
    let functionName = process.env[ENV_LAMBDA_FUNCTION_NAME], traceIdFromEnv = process.env[ENV_TRACE_ID], traceId = (await lambda_invoke_store_1.InvokeStore.getInstanceAsync())?.getXRayTraceId() ?? traceIdFromEnv, nonEmptyString2 = (str) => typeof str === "string" && str.length > 0;
    if (nonEmptyString2(functionName) && nonEmptyString2(traceId))
      request2.headers[TRACE_ID_HEADER_NAME] = traceId;
    return next({
      ...args,
      request: request2
    });
  };
  exports.recursionDetectionMiddleware = recursionDetectionMiddleware;
});
