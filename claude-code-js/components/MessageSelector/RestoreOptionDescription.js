// function: RestoreOptionDescription
function RestoreOptionDescription(t0) {
  let $3 = import_compiler_runtime287.c(11), {
    selectedRestoreOption,
    canRestoreCode,
    diffStatsForRestore
  } = t0, showCodeRestore = canRestoreCode && (selectedRestoreOption === "both" || selectedRestoreOption === "code"), t1;
  if ($3[0] !== selectedRestoreOption)
    t1 = getRestoreOptionConversationText(selectedRestoreOption), $3[0] = selectedRestoreOption, $3[1] = t1;
  else
    t1 = $3[1];
  let t2;
  if ($3[2] !== t1)
    t2 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
      dimColor: !0,
      children: t1
    }, void 0, !1, void 0, this), $3[2] = t1, $3[3] = t2;
  else
    t2 = $3[3];
  let t3;
  if ($3[4] !== diffStatsForRestore || $3[5] !== selectedRestoreOption || $3[6] !== showCodeRestore)
    t3 = !isSummarizeOption(selectedRestoreOption) && (showCodeRestore ? /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(RestoreCodeConfirmation, {
      diffStatsForRestore
    }, void 0, !1, void 0, this) : /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "The code will be unchanged."
    }, void 0, !1, void 0, this)), $3[4] = diffStatsForRestore, $3[5] = selectedRestoreOption, $3[6] = showCodeRestore, $3[7] = t3;
  else
    t3 = $3[7];
  let t4;
  if ($3[8] !== t2 || $3[9] !== t3)
    t4 = /* @__PURE__ */ jsx_dev_runtime370.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t2,
        t3
      ]
    }, void 0, !0, void 0, this), $3[8] = t2, $3[9] = t3, $3[10] = t4;
  else
    t4 = $3[10];
  return t4;
}
