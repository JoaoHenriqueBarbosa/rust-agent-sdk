// function: RunningIDESelector
function RunningIDESelector(t0) {
  let $3 = import_compiler_runtime167.c(15), {
    runningIDEs,
    onSelectIDE,
    onDone
  } = t0, [selectedValue, setSelectedValue] = import_react115.useState(runningIDEs[0] ?? ""), t1;
  if ($3[0] !== onSelectIDE)
    t1 = (value) => {
      onSelectIDE(value);
    }, $3[0] = onSelectIDE, $3[1] = t1;
  else
    t1 = $3[1];
  let handleSelectIDE = t1, t2;
  if ($3[2] !== runningIDEs)
    t2 = runningIDEs.map(_temp515), $3[2] = runningIDEs, $3[3] = t2;
  else
    t2 = $3[3];
  let options2 = t2, t3;
  if ($3[4] !== onDone)
    t3 = function() {
      onDone("IDE selection cancelled", {
        display: "system"
      });
    }, $3[4] = onDone, $3[5] = t3;
  else
    t3 = $3[5];
  let handleCancel = t3, t4;
  if ($3[6] !== handleSelectIDE)
    t4 = (value_0) => {
      setSelectedValue(value_0), handleSelectIDE(value_0);
    }, $3[6] = handleSelectIDE, $3[7] = t4;
  else
    t4 = $3[7];
  let t5;
  if ($3[8] !== options2 || $3[9] !== selectedValue || $3[10] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(Select, {
      defaultFocusValue: selectedValue,
      options: options2,
      onChange: t4
    }, void 0, !1, void 0, this), $3[8] = options2, $3[9] = selectedValue, $3[10] = t4, $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] !== handleCancel || $3[13] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(Dialog, {
      title: "Select IDE to install extension",
      onCancel: handleCancel,
      color: "ide",
      children: t5
    }, void 0, !1, void 0, this), $3[12] = handleCancel, $3[13] = t5, $3[14] = t6;
  else
    t6 = $3[14];
  return t6;
}
