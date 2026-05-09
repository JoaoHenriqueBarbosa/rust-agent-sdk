// var: require_NoopTracer
var require_NoopTracer = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: !0 });
  exports.NoopTracer = void 0;
  var context_1 = require_context2(), context_utils_1 = require_context_utils(), NonRecordingSpan_1 = require_NonRecordingSpan(), spancontext_utils_1 = require_spancontext_utils(), contextApi = context_1.ContextAPI.getInstance();

  class NoopTracer {
    startSpan(name3, options2, context3 = contextApi.active()) {
      if (Boolean(options2 === null || options2 === void 0 ? void 0 : options2.root))
        return new NonRecordingSpan_1.NonRecordingSpan;
      let parentFromContext = context3 && (0, context_utils_1.getSpanContext)(context3);
      if (isSpanContext(parentFromContext) && (0, spancontext_utils_1.isSpanContextValid)(parentFromContext))
        return new NonRecordingSpan_1.NonRecordingSpan(parentFromContext);
      else
        return new NonRecordingSpan_1.NonRecordingSpan;
    }
    startActiveSpan(name3, arg2, arg3, arg4) {
      let opts, ctx, fn;
      if (arguments.length < 2)
        return;
      else if (arguments.length === 2)
        fn = arg2;
      else if (arguments.length === 3)
        opts = arg2, fn = arg3;
      else
        opts = arg2, ctx = arg3, fn = arg4;
      let parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active(), span = this.startSpan(name3, opts, parentContext), contextWithSpanSet = (0, context_utils_1.setSpan)(parentContext, span);
      return contextApi.with(contextWithSpanSet, fn, void 0, span);
    }
  }
  exports.NoopTracer = NoopTracer;
  function isSpanContext(spanContext) {
    return spanContext !== null && typeof spanContext === "object" && "spanId" in spanContext && typeof spanContext.spanId === "string" && "traceId" in spanContext && typeof spanContext.traceId === "string" && "traceFlags" in spanContext && typeof spanContext.traceFlags === "number";
  }
});
