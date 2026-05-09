// function: _temp112
function _temp112(validation, i_1) {
  return /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
    children: [
      "\u2514 ",
      validation.name,
      ":",
      " ",
      /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
        color: validation.status === "capped" ? "warning" : "error",
        children: validation.message
      }, void 0, !1, void 0, this)
    ]
  }, i_1, !0, void 0, this);
}
