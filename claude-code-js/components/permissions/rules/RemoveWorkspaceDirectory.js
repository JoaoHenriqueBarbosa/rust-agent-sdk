// Original: src/components/permissions/rules/RemoveWorkspaceDirectory.tsx
function RemoveWorkspaceDirectory(t0) {
  let $3 = import_compiler_runtime235.c(19), {
    directoryPath,
    onRemove,
    onCancel,
    permissionContext,
    setPermissionContext
  } = t0, t1;
  if ($3[0] !== directoryPath || $3[1] !== onRemove || $3[2] !== permissionContext || $3[3] !== setPermissionContext)
    t1 = () => {
      let updatedContext = applyPermissionUpdate(permissionContext, {
        type: "removeDirectories",
        directories: [directoryPath],
        destination: "session"
      });
      setPermissionContext(updatedContext), onRemove();
    }, $3[0] = directoryPath, $3[1] = onRemove, $3[2] = permissionContext, $3[3] = setPermissionContext, $3[4] = t1;
  else
    t1 = $3[4];
  let handleRemove = t1, t2;
  if ($3[5] !== handleRemove || $3[6] !== onCancel)
    t2 = (value) => {
      if (value === "yes")
        handleRemove();
      else
        onCancel();
    }, $3[5] = handleRemove, $3[6] = onCancel, $3[7] = t2;
  else
    t2 = $3[7];
  let handleSelect = t2, t3;
  if ($3[8] !== directoryPath)
    t3 = /* @__PURE__ */ jsx_dev_runtime297.jsxDEV(ThemedBox_default, {
      marginX: 2,
      flexDirection: "column",
      children: /* @__PURE__ */ jsx_dev_runtime297.jsxDEV(ThemedText, {
        bold: !0,
        children: directoryPath
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[8] = directoryPath, $3[9] = t3;
  else
    t3 = $3[9];
  let t4;
  if ($3[10] === Symbol.for("react.memo_cache_sentinel"))
    t4 = /* @__PURE__ */ jsx_dev_runtime297.jsxDEV(ThemedText, {
      children: "Claude Code will no longer have access to files in this directory."
    }, void 0, !1, void 0, this), $3[10] = t4;
  else
    t4 = $3[10];
  let t5;
  if ($3[11] === Symbol.for("react.memo_cache_sentinel"))
    t5 = [{
      label: "Yes",
      value: "yes"
    }, {
      label: "No",
      value: "no"
    }], $3[11] = t5;
  else
    t5 = $3[11];
  let t6;
  if ($3[12] !== handleSelect || $3[13] !== onCancel)
    t6 = /* @__PURE__ */ jsx_dev_runtime297.jsxDEV(Select, {
      onChange: handleSelect,
      onCancel,
      options: t5
    }, void 0, !1, void 0, this), $3[12] = handleSelect, $3[13] = onCancel, $3[14] = t6;
  else
    t6 = $3[14];
  let t7;
  if ($3[15] !== onCancel || $3[16] !== t3 || $3[17] !== t6)
    t7 = /* @__PURE__ */ jsx_dev_runtime297.jsxDEV(Dialog, {
      title: "Remove directory from workspace?",
      onCancel,
      color: "error",
      children: [
        t3,
        t4,
        t6
      ]
    }, void 0, !0, void 0, this), $3[15] = onCancel, $3[16] = t3, $3[17] = t6, $3[18] = t7;
  else
    t7 = $3[18];
  return t7;
}
var import_compiler_runtime235, jsx_dev_runtime297;
var init_RemoveWorkspaceDirectory = __esm(() => {
  init_select();
  init_ink2();
  init_PermissionUpdate();
  init_Dialog();
  import_compiler_runtime235 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime297 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
