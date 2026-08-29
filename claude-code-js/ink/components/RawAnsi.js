// Original: src/ink/components/RawAnsi.tsx
function RawAnsi(t0) {
  let $3 = import_compiler_runtime13.c(6), {
    lines,
    width
  } = t0;
  if (lines.length === 0)
    return null;
  let t1;
  if ($3[0] !== lines)
    t1 = lines.join(`
`), $3[0] = lines, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== lines.length || $3[3] !== t1 || $3[4] !== width)
    t2 = /* @__PURE__ */ jsx_dev_runtime16.jsxDEV("ink-raw-ansi", {
      rawText: t1,
      rawWidth: width,
      rawHeight: lines.length
    }, void 0, !1, void 0, this), $3[2] = lines.length, $3[3] = t1, $3[4] = width, $3[5] = t2;
  else
    t2 = $3[5];
  return t2;
}
var import_compiler_runtime13, jsx_dev_runtime16;
var init_RawAnsi = __esm(() => {
  import_compiler_runtime13 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime16 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
