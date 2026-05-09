// var: require_src9
var require_src9 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.internal = exports.diagLogLevelFromString = exports.BindOnceFuture = exports.urlMatches = exports.isUrlIgnored = exports.callWithTimeout = exports.TimeoutError = exports.merge = exports.TraceState = exports.unsuppressTracing = exports.suppressTracing = exports.isTracingSuppressed = exports.setRPCMetadata = exports.getRPCMetadata = exports.deleteRPCMetadata = exports.RPCType = exports.parseTraceParent = exports.W3CTraceContextPropagator = exports.TRACE_STATE_HEADER = exports.TRACE_PARENT_HEADER = exports.CompositePropagator = exports.otperformance = exports.getStringListFromEnv = exports.getNumberFromEnv = exports.getBooleanFromEnv = exports.getStringFromEnv = exports._globalThis = exports.SDK_INFO = exports.parseKeyPairsIntoRecord = exports.ExportResultCode = exports.unrefTimer = exports.timeInputToHrTime = exports.millisToHrTime = exports.isTimeInputHrTime = exports.isTimeInput = exports.hrTimeToTimeStamp = exports.hrTimeToNanoseconds = exports.hrTimeToMilliseconds = exports.hrTimeToMicroseconds = exports.hrTimeDuration = exports.hrTime = exports.getTimeOrigin = exports.addHrTimes = exports.loggingErrorHandler = exports.setGlobalErrorHandler = exports.globalErrorHandler = exports.sanitizeAttributes = exports.isAttributeValue = exports.AnchoredClock = exports.W3CBaggagePropagator = void 0;
  var W3CBaggagePropagator_1 = require_W3CBaggagePropagator();
  Object.defineProperty(exports, "W3CBaggagePropagator", { enumerable: !0, get: function() {
    return W3CBaggagePropagator_1.W3CBaggagePropagator;
  } });
  var anchored_clock_1 = require_anchored_clock();
  Object.defineProperty(exports, "AnchoredClock", { enumerable: !0, get: function() {
    return anchored_clock_1.AnchoredClock;
  } });
  var attributes_1 = require_attributes();
  Object.defineProperty(exports, "isAttributeValue", { enumerable: !0, get: function() {
    return attributes_1.isAttributeValue;
  } });
  Object.defineProperty(exports, "sanitizeAttributes", { enumerable: !0, get: function() {
    return attributes_1.sanitizeAttributes;
  } });
  var global_error_handler_1 = require_global_error_handler();
  Object.defineProperty(exports, "globalErrorHandler", { enumerable: !0, get: function() {
    return global_error_handler_1.globalErrorHandler;
  } });
  Object.defineProperty(exports, "setGlobalErrorHandler", { enumerable: !0, get: function() {
    return global_error_handler_1.setGlobalErrorHandler;
  } });
  var logging_error_handler_1 = require_logging_error_handler();
  Object.defineProperty(exports, "loggingErrorHandler", { enumerable: !0, get: function() {
    return logging_error_handler_1.loggingErrorHandler;
  } });
  var time_1 = require_time();
  Object.defineProperty(exports, "addHrTimes", { enumerable: !0, get: function() {
    return time_1.addHrTimes;
  } });
  Object.defineProperty(exports, "getTimeOrigin", { enumerable: !0, get: function() {
    return time_1.getTimeOrigin;
  } });
  Object.defineProperty(exports, "hrTime", { enumerable: !0, get: function() {
    return time_1.hrTime;
  } });
  Object.defineProperty(exports, "hrTimeDuration", { enumerable: !0, get: function() {
    return time_1.hrTimeDuration;
  } });
  Object.defineProperty(exports, "hrTimeToMicroseconds", { enumerable: !0, get: function() {
    return time_1.hrTimeToMicroseconds;
  } });
  Object.defineProperty(exports, "hrTimeToMilliseconds", { enumerable: !0, get: function() {
    return time_1.hrTimeToMilliseconds;
  } });
  Object.defineProperty(exports, "hrTimeToNanoseconds", { enumerable: !0, get: function() {
    return time_1.hrTimeToNanoseconds;
  } });
  Object.defineProperty(exports, "hrTimeToTimeStamp", { enumerable: !0, get: function() {
    return time_1.hrTimeToTimeStamp;
  } });
  Object.defineProperty(exports, "isTimeInput", { enumerable: !0, get: function() {
    return time_1.isTimeInput;
  } });
  Object.defineProperty(exports, "isTimeInputHrTime", { enumerable: !0, get: function() {
    return time_1.isTimeInputHrTime;
  } });
  Object.defineProperty(exports, "millisToHrTime", { enumerable: !0, get: function() {
    return time_1.millisToHrTime;
  } });
  Object.defineProperty(exports, "timeInputToHrTime", { enumerable: !0, get: function() {
    return time_1.timeInputToHrTime;
  } });
  var timer_util_1 = require_timer_util();
  Object.defineProperty(exports, "unrefTimer", { enumerable: !0, get: function() {
    return timer_util_1.unrefTimer;
  } });
  var ExportResult_1 = require_ExportResult();
  Object.defineProperty(exports, "ExportResultCode", { enumerable: !0, get: function() {
    return ExportResult_1.ExportResultCode;
  } });
  var utils_1 = require_utils7();
  Object.defineProperty(exports, "parseKeyPairsIntoRecord", { enumerable: !0, get: function() {
    return utils_1.parseKeyPairsIntoRecord;
  } });
  var platform_1 = require_platform();
  Object.defineProperty(exports, "SDK_INFO", { enumerable: !0, get: function() {
    return platform_1.SDK_INFO;
  } });
  Object.defineProperty(exports, "_globalThis", { enumerable: !0, get: function() {
    return platform_1._globalThis;
  } });
  Object.defineProperty(exports, "getStringFromEnv", { enumerable: !0, get: function() {
    return platform_1.getStringFromEnv;
  } });
  Object.defineProperty(exports, "getBooleanFromEnv", { enumerable: !0, get: function() {
    return platform_1.getBooleanFromEnv;
  } });
  Object.defineProperty(exports, "getNumberFromEnv", { enumerable: !0, get: function() {
    return platform_1.getNumberFromEnv;
  } });
  Object.defineProperty(exports, "getStringListFromEnv", { enumerable: !0, get: function() {
    return platform_1.getStringListFromEnv;
  } });
  Object.defineProperty(exports, "otperformance", { enumerable: !0, get: function() {
    return platform_1.otperformance;
  } });
  var composite_1 = require_composite();
  Object.defineProperty(exports, "CompositePropagator", { enumerable: !0, get: function() {
    return composite_1.CompositePropagator;
  } });
  var W3CTraceContextPropagator_1 = require_W3CTraceContextPropagator();
  Object.defineProperty(exports, "TRACE_PARENT_HEADER", { enumerable: !0, get: function() {
    return W3CTraceContextPropagator_1.TRACE_PARENT_HEADER;
  } });
  Object.defineProperty(exports, "TRACE_STATE_HEADER", { enumerable: !0, get: function() {
    return W3CTraceContextPropagator_1.TRACE_STATE_HEADER;
  } });
  Object.defineProperty(exports, "W3CTraceContextPropagator", { enumerable: !0, get: function() {
    return W3CTraceContextPropagator_1.W3CTraceContextPropagator;
  } });
  Object.defineProperty(exports, "parseTraceParent", { enumerable: !0, get: function() {
    return W3CTraceContextPropagator_1.parseTraceParent;
  } });
  var rpc_metadata_1 = require_rpc_metadata();
  Object.defineProperty(exports, "RPCType", { enumerable: !0, get: function() {
    return rpc_metadata_1.RPCType;
  } });
  Object.defineProperty(exports, "deleteRPCMetadata", { enumerable: !0, get: function() {
    return rpc_metadata_1.deleteRPCMetadata;
  } });
  Object.defineProperty(exports, "getRPCMetadata", { enumerable: !0, get: function() {
    return rpc_metadata_1.getRPCMetadata;
  } });
  Object.defineProperty(exports, "setRPCMetadata", { enumerable: !0, get: function() {
    return rpc_metadata_1.setRPCMetadata;
  } });
  var suppress_tracing_1 = require_suppress_tracing();
  Object.defineProperty(exports, "isTracingSuppressed", { enumerable: !0, get: function() {
    return suppress_tracing_1.isTracingSuppressed;
  } });
  Object.defineProperty(exports, "suppressTracing", { enumerable: !0, get: function() {
    return suppress_tracing_1.suppressTracing;
  } });
  Object.defineProperty(exports, "unsuppressTracing", { enumerable: !0, get: function() {
    return suppress_tracing_1.unsuppressTracing;
  } });
  var TraceState_1 = require_TraceState();
  Object.defineProperty(exports, "TraceState", { enumerable: !0, get: function() {
    return TraceState_1.TraceState;
  } });
  var merge_1 = require_merge2();
  Object.defineProperty(exports, "merge", { enumerable: !0, get: function() {
    return merge_1.merge;
  } });
  var timeout_1 = require_timeout();
  Object.defineProperty(exports, "TimeoutError", { enumerable: !0, get: function() {
    return timeout_1.TimeoutError;
  } });
  Object.defineProperty(exports, "callWithTimeout", { enumerable: !0, get: function() {
    return timeout_1.callWithTimeout;
  } });
  var url_1 = require_url();
  Object.defineProperty(exports, "isUrlIgnored", { enumerable: !0, get: function() {
    return url_1.isUrlIgnored;
  } });
  Object.defineProperty(exports, "urlMatches", { enumerable: !0, get: function() {
    return url_1.urlMatches;
  } });
  var callback_1 = require_callback();
  Object.defineProperty(exports, "BindOnceFuture", { enumerable: !0, get: function() {
    return callback_1.BindOnceFuture;
  } });
  var configuration_1 = require_configuration();
  Object.defineProperty(exports, "diagLogLevelFromString", { enumerable: !0, get: function() {
    return configuration_1.diagLogLevelFromString;
  } });
  var exporter_1 = require_exporter();
  exports.internal = {
    _export: exporter_1._export
  };
});
