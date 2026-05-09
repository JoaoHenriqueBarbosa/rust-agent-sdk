// Original: src/components/SearchBox.tsx
function SearchBox(t0) {
  let $3 = import_compiler_runtime141.c(17), {
    query: query3,
    placeholder: t1,
    isFocused,
    isTerminalFocused,
    prefix: t2,
    width,
    cursorOffset,
    borderless: t3
  } = t0, placeholder = t1 === void 0 ? "Search\u2026" : t1, prefix = t2 === void 0 ? "\u2315" : t2, borderless = t3 === void 0 ? !1 : t3, offset = cursorOffset ?? query3.length, t4 = borderless ? void 0 : "round", t5 = isFocused ? "suggestion" : void 0, t6 = !isFocused, t7 = borderless ? 0 : 1, t8 = !isFocused, t9;
  if ($3[0] !== isFocused || $3[1] !== isTerminalFocused || $3[2] !== offset || $3[3] !== placeholder || $3[4] !== query3)
    t9 = isFocused ? /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(jsx_dev_runtime178.Fragment, {
      children: query3 ? isTerminalFocused ? /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(jsx_dev_runtime178.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
            children: query3.slice(0, offset)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
            inverse: !0,
            children: offset < query3.length ? query3[offset] : " "
          }, void 0, !1, void 0, this),
          offset < query3.length && /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
            children: query3.slice(offset + 1)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
        children: query3
      }, void 0, !1, void 0, this) : isTerminalFocused ? /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(jsx_dev_runtime178.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
            inverse: !0,
            children: placeholder.charAt(0)
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
            dimColor: !0,
            children: placeholder.slice(1)
          }, void 0, !1, void 0, this)
        ]
      }, void 0, !0, void 0, this) : /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
        dimColor: !0,
        children: placeholder
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this) : query3 ? /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
      children: query3
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
      children: placeholder
    }, void 0, !1, void 0, this), $3[0] = isFocused, $3[1] = isTerminalFocused, $3[2] = offset, $3[3] = placeholder, $3[4] = query3, $3[5] = t9;
  else
    t9 = $3[5];
  let t10;
  if ($3[6] !== prefix || $3[7] !== t8 || $3[8] !== t9)
    t10 = /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedText, {
      dimColor: t8,
      children: [
        prefix,
        " ",
        t9
      ]
    }, void 0, !0, void 0, this), $3[6] = prefix, $3[7] = t8, $3[8] = t9, $3[9] = t10;
  else
    t10 = $3[9];
  let t11;
  if ($3[10] !== t10 || $3[11] !== t4 || $3[12] !== t5 || $3[13] !== t6 || $3[14] !== t7 || $3[15] !== width)
    t11 = /* @__PURE__ */ jsx_dev_runtime178.jsxDEV(ThemedBox_default, {
      flexShrink: 0,
      borderStyle: t4,
      borderColor: t5,
      borderDimColor: t6,
      paddingX: t7,
      width,
      children: t10
    }, void 0, !1, void 0, this), $3[10] = t10, $3[11] = t4, $3[12] = t5, $3[13] = t6, $3[14] = t7, $3[15] = width, $3[16] = t11;
  else
    t11 = $3[16];
  return t11;
}
var import_compiler_runtime141, jsx_dev_runtime178;
var init_SearchBox = __esm(() => {
  init_ink2();
  import_compiler_runtime141 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime178 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
