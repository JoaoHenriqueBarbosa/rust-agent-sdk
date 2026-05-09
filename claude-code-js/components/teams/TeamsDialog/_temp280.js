// function: _temp280
function _temp280(task_0) {
  return /* @__PURE__ */ jsx_dev_runtime422.jsxDEV(ThemedText, {
    color: task_0.status === "completed" ? "success" : void 0,
    children: [
      task_0.status === "completed" ? figures_default.tick : "\u25FC",
      " ",
      task_0.subject
    ]
  }, task_0.id, !0, void 0, this);
}
