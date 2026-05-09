// var: init_line
var init_line = __esm(() => {
  init_tslib();
  _LineDecoder_buffer = /* @__PURE__ */ new WeakMap, _LineDecoder_carriageReturnIndex = /* @__PURE__ */ new WeakMap;
  LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set([`
`, "\r"]);
  LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r]/g;
});
