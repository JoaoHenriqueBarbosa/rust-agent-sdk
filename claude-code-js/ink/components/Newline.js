// Original: src/ink/components/Newline.tsx
function Newline(t0) {
  let $3 = import_compiler_runtime11.c(4), {
    count: t1
  } = t0, count3 = t1 === void 0 ? 1 : t1, t2;
  if ($3[0] !== count3)
    t2 = `
`.repeat(count3), $3[0] = count3, $3[1] = t2;
  else
    t2 = $3[1];
  let t3;
  if ($3[2] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime14.jsxDEV("ink-text", {
      children: t2
    }, void 0, !1, void 0, this), $3[2] = t2, $3[3] = t3;
  else
    t3 = $3[3];
  return t3;
}
var import_compiler_runtime11, jsx_dev_runtime14;
var init_Newline = __esm(() => {
  import_compiler_runtime11 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime14 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
