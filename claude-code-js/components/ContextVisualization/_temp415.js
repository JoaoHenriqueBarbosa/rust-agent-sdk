// function: _temp415
function _temp415(square, colIndex) {
  if (square.categoryName === "Free space")
    return /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "\u26F6 "
    }, colIndex, !1, void 0, this);
  if (square.categoryName === RESERVED_CATEGORY_NAME2)
    return /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
      color: square.color,
      children: "\u26DD "
    }, colIndex, !1, void 0, this);
  return /* @__PURE__ */ jsx_dev_runtime186.jsxDEV(ThemedText, {
    color: square.color,
    children: square.squareFullness >= 0.7 ? "\u26C1 " : "\u26C0 "
  }, colIndex, !1, void 0, this);
}
