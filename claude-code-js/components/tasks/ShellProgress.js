// Original: src/components/tasks/ShellProgress.tsx
function TaskStatusText(t0) {
  let $3 = import_compiler_runtime223.c(4), {
    status: status2,
    label,
    suffix
  } = t0, displayLabel = label ?? status2, color3 = status2 === "completed" ? "success" : status2 === "failed" ? "error" : status2 === "killed" ? "warning" : void 0, t1;
  if ($3[0] !== color3 || $3[1] !== displayLabel || $3[2] !== suffix)
    t1 = /* @__PURE__ */ jsx_dev_runtime283.jsxDEV(ThemedText, {
      color: color3,
      dimColor: !0,
      children: [
        "(",
        displayLabel,
        suffix,
        ")"
      ]
    }, void 0, !0, void 0, this), $3[0] = color3, $3[1] = displayLabel, $3[2] = suffix, $3[3] = t1;
  else
    t1 = $3[3];
  return t1;
}
function ShellProgress(t0) {
  let $3 = import_compiler_runtime223.c(4), {
    shell
  } = t0;
  switch (shell.status) {
    case "completed": {
      let t1;
      if ($3[0] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime283.jsxDEV(TaskStatusText, {
          status: "completed",
          label: "done"
        }, void 0, !1, void 0, this), $3[0] = t1;
      else
        t1 = $3[0];
      return t1;
    }
    case "failed": {
      let t1;
      if ($3[1] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime283.jsxDEV(TaskStatusText, {
          status: "failed",
          label: "error"
        }, void 0, !1, void 0, this), $3[1] = t1;
      else
        t1 = $3[1];
      return t1;
    }
    case "killed": {
      let t1;
      if ($3[2] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime283.jsxDEV(TaskStatusText, {
          status: "killed",
          label: "stopped"
        }, void 0, !1, void 0, this), $3[2] = t1;
      else
        t1 = $3[2];
      return t1;
    }
    case "running":
    case "pending": {
      let t1;
      if ($3[3] === Symbol.for("react.memo_cache_sentinel"))
        t1 = /* @__PURE__ */ jsx_dev_runtime283.jsxDEV(TaskStatusText, {
          status: "running"
        }, void 0, !1, void 0, this), $3[3] = t1;
      else
        t1 = $3[3];
      return t1;
    }
  }
}
var import_compiler_runtime223, jsx_dev_runtime283;
var init_ShellProgress = __esm(() => {
  init_ink2();
  import_compiler_runtime223 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime283 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
