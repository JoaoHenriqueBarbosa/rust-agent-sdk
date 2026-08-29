// Original: src/components/LogoV2/FeedColumn.tsx
function FeedColumn(t0) {
  let $3 = import_compiler_runtime198.c(10), {
    feeds: feeds2,
    maxWidth
  } = t0, t1;
  if ($3[0] !== feeds2) {
    let feedWidths = feeds2.map(_temp117);
    t1 = Math.max(...feedWidths), $3[0] = feeds2, $3[1] = t1;
  } else
    t1 = $3[1];
  let actualWidth = Math.min(t1, maxWidth), t2;
  if ($3[2] !== actualWidth || $3[3] !== feeds2) {
    let t32;
    if ($3[5] !== actualWidth || $3[6] !== feeds2.length)
      t32 = (feed_0, index) => /* @__PURE__ */ jsx_dev_runtime249.jsxDEV(React79.Fragment, {
        children: [
          /* @__PURE__ */ jsx_dev_runtime249.jsxDEV(Feed, {
            config: feed_0,
            actualWidth
          }, void 0, !1, void 0, this),
          index < feeds2.length - 1 && /* @__PURE__ */ jsx_dev_runtime249.jsxDEV(Divider, {
            color: "claude",
            width: actualWidth
          }, void 0, !1, void 0, this)
        ]
      }, index, !0, void 0, this), $3[5] = actualWidth, $3[6] = feeds2.length, $3[7] = t32;
    else
      t32 = $3[7];
    t2 = feeds2.map(t32), $3[2] = actualWidth, $3[3] = feeds2, $3[4] = t2;
  } else
    t2 = $3[4];
  let t3;
  if ($3[8] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime249.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: t2
    }, void 0, !1, void 0, this), $3[8] = t2, $3[9] = t3;
  else
    t3 = $3[9];
  return t3;
}
function _temp117(feed) {
  return calculateFeedWidth(feed);
}
var import_compiler_runtime198, React79, jsx_dev_runtime249;
var init_FeedColumn = __esm(() => {
  init_ink2();
  init_Divider();
  init_Feed();
  import_compiler_runtime198 = __toESM(require_react_compiler_runtime_development(), 1), React79 = __toESM(require_react_development(), 1), jsx_dev_runtime249 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
