// var: init_encoding_option
var init_encoding_option = __esm(() => {
  TEXT_ENCODINGS = /* @__PURE__ */ new Set(["utf8", "utf16le"]), BINARY_ENCODINGS = /* @__PURE__ */ new Set(["buffer", "hex", "base64", "base64url", "latin1", "ascii"]), ENCODINGS = /* @__PURE__ */ new Set([...TEXT_ENCODINGS, ...BINARY_ENCODINGS]), ENCODING_ALIASES = {
    "utf-8": "utf8",
    "utf-16le": "utf16le",
    "ucs-2": "utf16le",
    ucs2: "utf16le",
    binary: "latin1"
  };
});
