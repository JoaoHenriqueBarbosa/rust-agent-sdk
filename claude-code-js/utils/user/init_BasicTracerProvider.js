// var: init_BasicTracerProvider
var init_BasicTracerProvider = __esm(() => {
  init_Tracer();
  init_config9();
  init_MultiSpanProcessor();
  init_utility();
  import_core55 = __toESM(require_src9(), 1), import_resources2 = __toESM(require_src10(), 1);
  (function(ForceFlushState2) {
    ForceFlushState2[ForceFlushState2.resolved = 0] = "resolved", ForceFlushState2[ForceFlushState2.timeout = 1] = "timeout", ForceFlushState2[ForceFlushState2.error = 2] = "error", ForceFlushState2[ForceFlushState2.unresolved = 3] = "unresolved";
  })(ForceFlushState || (ForceFlushState = {}));
});
