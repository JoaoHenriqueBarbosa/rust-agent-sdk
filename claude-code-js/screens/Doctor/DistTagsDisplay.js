// function: DistTagsDisplay
function DistTagsDisplay(t0) {
  let $3 = import_compiler_runtime159.c(8), {
    promise: promise3
  } = t0, distTags = import_react113.use(promise3);
  if (!distTags.latest) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "\u2514 Failed to fetch versions"
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  let t1;
  if ($3[1] !== distTags.stable)
    t1 = distTags.stable && /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Stable version: ",
        distTags.stable
      ]
    }, void 0, !0, void 0, this), $3[1] = distTags.stable, $3[2] = t1;
  else
    t1 = $3[2];
  let t2;
  if ($3[3] !== distTags.latest)
    t2 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(ThemedText, {
      children: [
        "\u2514 Latest version: ",
        distTags.latest
      ]
    }, void 0, !0, void 0, this), $3[3] = distTags.latest, $3[4] = t2;
  else
    t2 = $3[4];
  let t3;
  if ($3[5] !== t1 || $3[6] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime198.jsxDEV(jsx_dev_runtime198.Fragment, {
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[5] = t1, $3[6] = t2, $3[7] = t3;
  else
    t3 = $3[7];
  return t3;
}
