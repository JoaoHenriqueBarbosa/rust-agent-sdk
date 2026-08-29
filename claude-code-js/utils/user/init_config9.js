// var: init_config9
var init_config9 = __esm(() => {
  init_AlwaysOffSampler();
  init_AlwaysOnSampler();
  init_ParentBasedSampler();
  init_TraceIdRatioBasedSampler();
  import_api8 = __toESM(require_src7(), 1), import_core50 = __toESM(require_src9(), 1);
  (function(TracesSamplerValues2) {
    TracesSamplerValues2.AlwaysOff = "always_off", TracesSamplerValues2.AlwaysOn = "always_on", TracesSamplerValues2.ParentBasedAlwaysOff = "parentbased_always_off", TracesSamplerValues2.ParentBasedAlwaysOn = "parentbased_always_on", TracesSamplerValues2.ParentBasedTraceIdRatio = "parentbased_traceidratio", TracesSamplerValues2.TraceIdRatio = "traceidratio";
  })(TracesSamplerValues || (TracesSamplerValues = {}));
});
