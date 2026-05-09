// Original: src/ink/components/Link.tsx
function Link(t0) {
  let $3 = import_compiler_runtime8.c(5), {
    children,
    url: url3,
    fallback
  } = t0, content = children ?? url3;
  if (supportsHyperlinks()) {
    let t12;
    if ($3[0] !== content || $3[1] !== url3)
      t12 = /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(Text, {
        children: /* @__PURE__ */ jsx_dev_runtime11.jsxDEV("ink-link", {
          href: url3,
          children: content
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this), $3[0] = content, $3[1] = url3, $3[2] = t12;
    else
      t12 = $3[2];
    return t12;
  }
  let t1 = fallback ?? content, t2;
  if ($3[3] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime11.jsxDEV(Text, {
      children: t1
    }, void 0, !1, void 0, this), $3[3] = t1, $3[4] = t2;
  else
    t2 = $3[4];
  return t2;
}
var import_compiler_runtime8, jsx_dev_runtime11;
var init_Link = __esm(() => {
  init_supports_hyperlinks();
  init_Text();
  import_compiler_runtime8 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime11 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
