// Original: src/components/design-system/Ratchet.tsx
function Ratchet(t0) {
  let $3 = import_compiler_runtime15.c(10), {
    children,
    lock: t1
  } = t0, lock2 = t1 === void 0 ? "always" : t1, [viewportRef, t2] = useTerminalViewport(), {
    isVisible
  } = t2, {
    rows
  } = useTerminalSize(), innerRef = import_react26.useRef(null), maxHeight = import_react26.useRef(0), [minHeight, setMinHeight] = import_react26.useState(0), t3;
  if ($3[0] !== viewportRef)
    t3 = (el) => {
      viewportRef(el);
    }, $3[0] = viewportRef, $3[1] = t3;
  else
    t3 = $3[1];
  let outerRef = t3, engaged = lock2 === "always" || !isVisible, t4;
  if ($3[2] !== rows)
    t4 = () => {
      if (!innerRef.current)
        return;
      let {
        height
      } = measure_element_default(innerRef.current);
      if (height > maxHeight.current)
        maxHeight.current = Math.min(height, rows), setMinHeight(maxHeight.current);
    }, $3[2] = rows, $3[3] = t4;
  else
    t4 = $3[3];
  import_react26.useLayoutEffect(t4);
  let t5 = engaged ? minHeight : void 0, t6;
  if ($3[4] !== children)
    t6 = /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(ThemedBox_default, {
      ref: innerRef,
      flexDirection: "column",
      children
    }, void 0, !1, void 0, this), $3[4] = children, $3[5] = t6;
  else
    t6 = $3[5];
  let t7;
  if ($3[6] !== outerRef || $3[7] !== t5 || $3[8] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime18.jsxDEV(ThemedBox_default, {
      minHeight: t5,
      ref: outerRef,
      children: t6
    }, void 0, !1, void 0, this), $3[6] = outerRef, $3[7] = t5, $3[8] = t6, $3[9] = t7;
  else
    t7 = $3[9];
  return t7;
}
var import_compiler_runtime15, import_react26, jsx_dev_runtime18;
var init_Ratchet = __esm(() => {
  init_useTerminalSize();
  init_use_terminal_viewport();
  init_ink2();
  import_compiler_runtime15 = __toESM(require_react_compiler_runtime_development(), 1), import_react26 = __toESM(require_react_development(), 1), jsx_dev_runtime18 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
