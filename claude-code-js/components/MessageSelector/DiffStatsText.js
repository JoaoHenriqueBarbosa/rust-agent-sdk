// function: DiffStatsText
function DiffStatsText(t0) {
  let $3 = import_compiler_runtime287.c(7), {
    diffStats
  } = t0;
  if (!diffStats || !diffStats.filesChanged)
    return;
  let t1;
  if ($3[0] !== diffStats.insertions)
    t1 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
      color: "diffAddedWord",
      children: [
        "+",
        diffStats.insertions,
        " "
      ]
    }, void 0, !0, void 0, this), $3[0] = diffStats.insertions, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== diffStats.deletions)
    t2 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
      color: "diffRemovedWord",
      children: [
        "-",
        diffStats.deletions
      ]
    }, void 0, !0, void 0, this), $3[2] = diffStats.deletions, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== t1 || $3[5] !== t2)
    t3 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
      children: [
        t1,
        t2
      ]
    }, void 0, !0, void 0, this), $3[4] = t1, $3[5] = t2, $3[6] = t3;
  else
    t3 = $3[6];
  return t3;
}
