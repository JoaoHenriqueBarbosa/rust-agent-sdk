// var: init_specific
var init_specific = __esm(() => {
  init_standard_stream();
  FD_REGEXP = /^fd(\d+)$/, verboseDefault = debuglog("execa").enabled ? "full" : "none", DEFAULT_OPTIONS = {
    lines: !1,
    buffer: !0,
    maxBuffer: 1e8,
    verbose: verboseDefault,
    stripFinalNewline: !0
  }, FD_SPECIFIC_OPTIONS = ["lines", "buffer", "maxBuffer", "verbose", "stripFinalNewline"];
});
