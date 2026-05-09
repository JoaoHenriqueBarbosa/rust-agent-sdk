// function: IDEOpenSelection
function IDEOpenSelection(t0) {
  let $3 = import_compiler_runtime167.c(18), {
    availableIDEs,
    onSelectIDE,
    onDone
  } = t0, t1;
  if ($3[0] !== availableIDEs[0]?.port)
    t1 = availableIDEs[0]?.port?.toString() ?? "", $3[0] = availableIDEs[0]?.port, $3[1] = t1;
  else
    t1 = $3[1];
  let [selectedValue, setSelectedValue] = import_react115.useState(t1), t2;
  if ($3[2] !== availableIDEs || $3[3] !== onSelectIDE)
    t2 = (value) => {
      let selectedIDE = availableIDEs.find((ide) => ide.port === parseInt(value));
      onSelectIDE(selectedIDE);
    }, $3[2] = availableIDEs, $3[3] = onSelectIDE, $3[4] = t2;
  else
    t2 = $3[4];
  let handleSelectIDE = t2, t3;
  if ($3[5] !== availableIDEs)
    t3 = availableIDEs.map(_temp420), $3[5] = availableIDEs, $3[6] = t3;
  else
    t3 = $3[6];
  let options2 = t3, t4;
  if ($3[7] !== onDone)
    t4 = function() {
      onDone("IDE selection cancelled", {
        display: "system"
      });
    }, $3[7] = onDone, $3[8] = t4;
  else
    t4 = $3[8];
  let handleCancel = t4, t5;
  if ($3[9] !== handleSelectIDE)
    t5 = (value_0) => {
      setSelectedValue(value_0), handleSelectIDE(value_0);
    }, $3[9] = handleSelectIDE, $3[10] = t5;
  else
    t5 = $3[10];
  let t6;
  if ($3[11] !== options2 || $3[12] !== selectedValue || $3[13] !== t5)
    t6 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(Select, {
      defaultValue: selectedValue,
      defaultFocusValue: selectedValue,
      options: options2,
      onChange: t5
    }, void 0, !1, void 0, this), $3[11] = options2, $3[12] = selectedValue, $3[13] = t5, $3[14] = t6;
  else
    t6 = $3[14];
  let t7;
  if ($3[15] !== handleCancel || $3[16] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(Dialog, {
      title: "Select an IDE to open the project",
      onCancel: handleCancel,
      color: "ide",
      children: t6
    }, void 0, !1, void 0, this), $3[15] = handleCancel, $3[16] = t6, $3[17] = t7;
  else
    t7 = $3[17];
  return t7;
}
