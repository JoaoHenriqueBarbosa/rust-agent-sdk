// function: RestoreCodeConfirmation
function RestoreCodeConfirmation(t0) {
  let $3 = import_compiler_runtime287.c(14), {
    diffStatsForRestore
  } = t0;
  if (diffStatsForRestore === void 0)
    return;
  if (!diffStatsForRestore.filesChanged || !diffStatsForRestore.filesChanged[0]) {
    let t12;
    if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
      t12 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "The code has not changed (nothing will be restored)."
      }, void 0, !1, void 0, this), $3[0] = t12;
    else
      t12 = $3[0];
    return t12;
  }
  let numFilesChanged = diffStatsForRestore.filesChanged.length, fileLabel;
  if (numFilesChanged === 1) {
    let t12;
    if ($3[1] !== diffStatsForRestore.filesChanged[0])
      t12 = path25.basename(diffStatsForRestore.filesChanged[0] || ""), $3[1] = diffStatsForRestore.filesChanged[0], $3[2] = t12;
    else
      t12 = $3[2];
    fileLabel = t12;
  } else if (numFilesChanged === 2) {
    let t12;
    if ($3[3] !== diffStatsForRestore.filesChanged[0])
      t12 = path25.basename(diffStatsForRestore.filesChanged[0] || ""), $3[3] = diffStatsForRestore.filesChanged[0], $3[4] = t12;
    else
      t12 = $3[4];
    let file1 = t12, t22;
    if ($3[5] !== diffStatsForRestore.filesChanged[1])
      t22 = path25.basename(diffStatsForRestore.filesChanged[1] || ""), $3[5] = diffStatsForRestore.filesChanged[1], $3[6] = t22;
    else
      t22 = $3[6];
    fileLabel = `${file1} and ${t22}`;
  } else {
    let t12;
    if ($3[7] !== diffStatsForRestore.filesChanged[0])
      t12 = path25.basename(diffStatsForRestore.filesChanged[0] || ""), $3[7] = diffStatsForRestore.filesChanged[0], $3[8] = t12;
    else
      t12 = $3[8];
    fileLabel = `${t12} and ${diffStatsForRestore.filesChanged.length - 1} other files`;
  }
  let t1;
  if ($3[9] !== diffStatsForRestore)
    t1 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(DiffStatsText, {
      diffStats: diffStatsForRestore
    }, void 0, !1, void 0, this), $3[9] = diffStatsForRestore, $3[10] = t1;
  else
    t1 = $3[10];
  let t2;
  if ($3[11] !== fileLabel || $3[12] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(jsx_dev_runtime370.Fragment, {
      children: /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
        dimColor: !0,
        children: [
          "The code will be restored",
          " ",
          t1,
          " in ",
          fileLabel,
          "."
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[11] = fileLabel, $3[12] = t1, $3[13] = t2;
  else
    t2 = $3[13];
  return t2;
}
