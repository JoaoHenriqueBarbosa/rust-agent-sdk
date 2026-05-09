// var: init_escape2
var init_escape2 = __esm(() => {
  xmlReplacer = /["&'<>$\x80-\uFFFF]/g, xmlCodeMap = /* @__PURE__ */ new Map([
    [34, "&quot;"],
    [38, "&amp;"],
    [39, "&apos;"],
    [60, "&lt;"],
    [62, "&gt;"]
  ]), getCodePoint = String.prototype.codePointAt != null ? (str2, index) => str2.codePointAt(index) : (c3, index) => (c3.charCodeAt(index) & 64512) === 55296 ? (c3.charCodeAt(index) - 55296) * 1024 + c3.charCodeAt(index + 1) - 56320 + 65536 : c3.charCodeAt(index);
  escapeUTF8 = getEscaper(/[&<>'"]/g, xmlCodeMap), escapeAttribute = getEscaper(/["&\u00A0]/g, /* @__PURE__ */ new Map([
    [34, "&quot;"],
    [38, "&amp;"],
    [160, "&nbsp;"]
  ])), escapeText = getEscaper(/[&<>\u00A0]/g, /* @__PURE__ */ new Map([
    [38, "&amp;"],
    [60, "&lt;"],
    [62, "&gt;"],
    [160, "&nbsp;"]
  ]));
});
