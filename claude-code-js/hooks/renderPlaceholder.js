// Original: src/hooks/renderPlaceholder.ts
function renderPlaceholder({
  placeholder,
  value,
  showCursor,
  focus,
  terminalFocus = !0,
  invert = source_default.inverse,
  hidePlaceholderText = !1
}) {
  let renderedPlaceholder = void 0;
  if (placeholder) {
    if (hidePlaceholderText)
      renderedPlaceholder = showCursor && focus && terminalFocus ? invert(" ") : "";
    else if (renderedPlaceholder = source_default.dim(placeholder), showCursor && focus && terminalFocus)
      renderedPlaceholder = placeholder.length > 0 ? invert(placeholder[0]) + source_default.dim(placeholder.slice(1)) : invert(" ");
  }
  let showPlaceholder = value.length === 0 && Boolean(placeholder);
  return {
    renderedPlaceholder,
    showPlaceholder
  };
}
var init_renderPlaceholder = __esm(() => {
  init_source();
});
