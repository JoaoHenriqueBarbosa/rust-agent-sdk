// Original: src/utils/pdfUtils.ts
function parsePDFPageRange(pages) {
  let trimmed = pages.trim();
  if (!trimmed)
    return null;
  if (trimmed.endsWith("-")) {
    let first2 = parseInt(trimmed.slice(0, -1), 10);
    if (isNaN(first2) || first2 < 1)
      return null;
    return { firstPage: first2, lastPage: 1 / 0 };
  }
  let dashIndex = trimmed.indexOf("-");
  if (dashIndex === -1) {
    let page = parseInt(trimmed, 10);
    if (isNaN(page) || page < 1)
      return null;
    return { firstPage: page, lastPage: page };
  }
  let first = parseInt(trimmed.slice(0, dashIndex), 10), last = parseInt(trimmed.slice(dashIndex + 1), 10);
  if (isNaN(first) || isNaN(last) || first < 1 || last < 1 || last < first)
    return null;
  return { firstPage: first, lastPage: last };
}
function isPDFSupported() {
  return !getMainLoopModel().toLowerCase().includes("claude-3-haiku");
}
function isPDFExtension(ext) {
  let normalized = ext.startsWith(".") ? ext.slice(1) : ext;
  return DOCUMENT_EXTENSIONS.has(normalized.toLowerCase());
}
var DOCUMENT_EXTENSIONS;
var init_pdfUtils = __esm(() => {
  init_model();
  DOCUMENT_EXTENSIONS = /* @__PURE__ */ new Set(["pdf"]);
});
