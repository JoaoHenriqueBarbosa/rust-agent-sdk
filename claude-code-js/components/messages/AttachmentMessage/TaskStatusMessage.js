// function: TaskStatusMessage
function TaskStatusMessage(t0) {
  let $3 = import_compiler_runtime90.c(4), {
    attachment
  } = t0;
  if (isAgentSwarmsEnabled() && attachment.taskType === "in_process_teammate") {
    let t12;
    if ($3[0] !== attachment)
      t12 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(TeammateTaskStatus, {
        attachment
      }, void 0, !1, void 0, this), $3[0] = attachment, $3[1] = t12;
    else
      t12 = $3[1];
    return t12;
  }
  let t1;
  if ($3[2] !== attachment)
    t1 = /* @__PURE__ */ jsx_dev_runtime101.jsxDEV(GenericTaskStatus, {
      attachment
    }, void 0, !1, void 0, this), $3[2] = attachment, $3[3] = t1;
  else
    t1 = $3[3];
  return t1;
}
