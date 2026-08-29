// Original: src/components/StructuredDiffList.tsx
function StructuredDiffList({
  hunks,
  dim: dim2,
  width,
  filePath,
  firstLine,
  fileContent
}) {
  return intersperse(hunks.map((hunk) => /* @__PURE__ */ jsx_dev_runtime129.jsxDEV(ThemedBox_default, {
    flexDirection: "column",
    children: /* @__PURE__ */ jsx_dev_runtime129.jsxDEV(StructuredDiff, {
      patch: hunk,
      dim: dim2,
      width,
      filePath,
      firstLine,
      fileContent
    }, void 0, !1, void 0, this)
  }, hunk.newStart, !1, void 0, this)), (i5) => /* @__PURE__ */ jsx_dev_runtime129.jsxDEV(NoSelect, {
    fromLeftEdge: !0,
    children: /* @__PURE__ */ jsx_dev_runtime129.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "..."
    }, void 0, !1, void 0, this)
  }, `ellipsis-${i5}`, !1, void 0, this));
}
var jsx_dev_runtime129;
var init_StructuredDiffList = __esm(() => {
  init_ink2();
  init_StructuredDiff();
  jsx_dev_runtime129 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
