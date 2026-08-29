// Original: src/components/Spinner/ShimmerChar.tsx
function ShimmerChar(t0) {
  let $3 = import_compiler_runtime57.c(3), {
    char,
    index,
    glimmerIndex,
    messageColor,
    shimmerColor
  } = t0, isHighlighted = index === glimmerIndex, isNearHighlight = Math.abs(index - glimmerIndex) === 1, t1 = isHighlighted || isNearHighlight ? shimmerColor : messageColor, t2;
  if ($3[0] !== char || $3[1] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime65.jsxDEV(ThemedText, {
      color: t1,
      children: char
    }, void 0, !1, void 0, this), $3[0] = char, $3[1] = t1, $3[2] = t2;
  else
    t2 = $3[2];
  return t2;
}
var import_compiler_runtime57, jsx_dev_runtime65;
var init_ShimmerChar = __esm(() => {
  init_ink2();
  import_compiler_runtime57 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime65 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
