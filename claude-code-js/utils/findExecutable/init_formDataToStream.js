// var: init_formDataToStream
var init_formDataToStream = __esm(() => {
  init_utils();
  init_readBlob();
  init_platform2();
  BOUNDARY_ALPHABET = platform_default.ALPHABET.ALPHA_DIGIT + "-_", textEncoder3 = typeof TextEncoder === "function" ? /* @__PURE__ */ new TextEncoder : new util.TextEncoder, CRLF_BYTES = textEncoder3.encode(CRLF);
  formDataToStream_default = formDataToStream;
});
