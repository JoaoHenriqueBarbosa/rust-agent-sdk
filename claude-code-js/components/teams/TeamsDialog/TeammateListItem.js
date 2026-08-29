// function: TeammateListItem
function TeammateListItem(t0) {
  let $3 = import_compiler_runtime326.c(21), {
    teammate,
    isSelected
  } = t0, isIdle = teammate.status === "idle", shouldDim = isIdle && !isSelected, modeSymbol, t1;
  if ($3[0] !== teammate.mode) {
    let mode = teammate.mode ? permissionModeFromString(teammate.mode) : "default";
    modeSymbol = permissionModeSymbol(mode), t1 = getModeColor(mode), $3[0] = teammate.mode, $3[1] = modeSymbol, $3[2] = t1;
  } else
    modeSymbol = $3[1], t1 = $3[2];
  let modeColor = t1, t2 = isSelected ? "suggestion" : void 0, t3 = isSelected ? figures_default.pointer + " " : "  ", t4;
  if ($3[3] !== teammate.isHidden)
    t4 = teammate.isHidden && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "[hidden] "
    }, void 0, !1, void 0, this), $3[3] = teammate.isHidden, $3[4] = t4;
  else
    t4 = $3[4];
  let t5;
  if ($3[5] !== isIdle)
    t5 = isIdle && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      dimColor: !0,
      children: "[idle] "
    }, void 0, !1, void 0, this), $3[5] = isIdle, $3[6] = t5;
  else
    t5 = $3[6];
  let t6;
  if ($3[7] !== modeColor || $3[8] !== modeSymbol)
    t6 = modeSymbol && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      color: modeColor,
      children: [
        modeSymbol,
        " "
      ]
    }, void 0, !0, void 0, this), $3[7] = modeColor, $3[8] = modeSymbol, $3[9] = t6;
  else
    t6 = $3[9];
  let t7;
  if ($3[10] !== teammate.model)
    t7 = teammate.model && /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        " (",
        teammate.model,
        ")"
      ]
    }, void 0, !0, void 0, this), $3[10] = teammate.model, $3[11] = t7;
  else
    t7 = $3[11];
  let t8;
  if ($3[12] !== shouldDim || $3[13] !== t2 || $3[14] !== t3 || $3[15] !== t4 || $3[16] !== t5 || $3[17] !== t6 || $3[18] !== t7 || $3[19] !== teammate.name)
    t8 = /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
      color: t2,
      dimColor: shouldDim,
      children: [
        t3,
        t4,
        t5,
        t6,
        "@",
        teammate.name,
        t7
      ]
    }, void 0, !0, void 0, this), $3[12] = shouldDim, $3[13] = t2, $3[14] = t3, $3[15] = t4, $3[16] = t5, $3[17] = t6, $3[18] = t7, $3[19] = teammate.name, $3[20] = t8;
  else
    t8 = $3[20];
  return t8;
}
