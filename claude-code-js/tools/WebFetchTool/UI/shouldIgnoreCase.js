// function: shouldIgnoreCase
function shouldIgnoreCase(selector, options2) {
  return typeof selector.ignoreCase === "boolean" ? selector.ignoreCase : selector.ignoreCase === "quirks" ? !!options2.quirksMode : !options2.xmlMode && caseInsensitiveAttributes.has(selector.name);
}
