// function: ElicitationDialog
function ElicitationDialog(t0) {
  let $3 = import_compiler_runtime312.c(7), {
    event,
    onResponse,
    onWaitingDismiss
  } = t0;
  if (event.params.mode === "url") {
    let t12;
    if ($3[0] !== event || $3[1] !== onResponse || $3[2] !== onWaitingDismiss)
      t12 = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ElicitationURLDialog, {
        event,
        onResponse,
        onWaitingDismiss
      }, void 0, !1, void 0, this), $3[0] = event, $3[1] = onResponse, $3[2] = onWaitingDismiss, $3[3] = t12;
    else
      t12 = $3[3];
    return t12;
  }
  let t1;
  if ($3[4] !== event || $3[5] !== onResponse)
    t1 = /* @__PURE__ */ jsx_dev_runtime401.jsxDEV(ElicitationFormDialog, {
      event,
      onResponse
    }, void 0, !1, void 0, this), $3[4] = event, $3[5] = onResponse, $3[6] = t1;
  else
    t1 = $3[6];
  return t1;
}
