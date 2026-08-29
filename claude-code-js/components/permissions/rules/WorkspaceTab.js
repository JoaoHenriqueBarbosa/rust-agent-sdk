// Original: src/components/permissions/rules/WorkspaceTab.tsx
function WorkspaceTab(t0) {
  let $3 = import_compiler_runtime236.c(23), {
    onExit: onExit2,
    toolPermissionContext,
    onRequestAddDirectory,
    onRequestRemoveDirectory,
    onHeaderFocusChange
  } = t0, {
    headerFocused,
    focusHeader
  } = useTabHeaderFocus(), t1, t2;
  if ($3[0] !== headerFocused || $3[1] !== onHeaderFocusChange)
    t1 = () => {
      onHeaderFocusChange?.(headerFocused);
    }, t2 = [headerFocused, onHeaderFocusChange], $3[0] = headerFocused, $3[1] = onHeaderFocusChange, $3[2] = t1, $3[3] = t2;
  else
    t1 = $3[2], t2 = $3[3];
  import_react168.useEffect(t1, t2);
  let t3;
  if ($3[4] !== toolPermissionContext.additionalWorkingDirectories)
    t3 = Array.from(toolPermissionContext.additionalWorkingDirectories.keys()).map(_temp145), $3[4] = toolPermissionContext.additionalWorkingDirectories, $3[5] = t3;
  else
    t3 = $3[5];
  let additionalDirectories = t3, t4;
  if ($3[6] !== additionalDirectories || $3[7] !== onRequestAddDirectory || $3[8] !== onRequestRemoveDirectory)
    t4 = (selectedValue) => {
      if (selectedValue === "add-directory") {
        onRequestAddDirectory();
        return;
      }
      let directory = additionalDirectories.find((d) => d.path === selectedValue);
      if (directory && directory.isDeletable)
        onRequestRemoveDirectory(directory.path);
    }, $3[6] = additionalDirectories, $3[7] = onRequestAddDirectory, $3[8] = onRequestRemoveDirectory, $3[9] = t4;
  else
    t4 = $3[9];
  let handleDirectorySelect = t4, t5;
  if ($3[10] !== onExit2)
    t5 = () => onExit2("Workspace dialog dismissed", {
      display: "system"
    }), $3[10] = onExit2, $3[11] = t5;
  else
    t5 = $3[11];
  let handleCancel = t5, opts;
  if ($3[12] !== additionalDirectories) {
    opts = additionalDirectories.map(_temp258);
    let t62;
    if ($3[14] === Symbol.for("react.memo_cache_sentinel"))
      t62 = {
        label: `Add directory${figures_default.ellipsis}`,
        value: "add-directory"
      }, $3[14] = t62;
    else
      t62 = $3[14];
    opts.push(t62), $3[12] = additionalDirectories, $3[13] = opts;
  } else
    opts = $3[13];
  let options2 = opts, t6;
  if ($3[15] === Symbol.for("react.memo_cache_sentinel"))
    t6 = /* @__PURE__ */ jsx_dev_runtime298.jsxDEV(ThemedBox_default, {
      flexDirection: "row",
      marginTop: 1,
      marginLeft: 2,
      gap: 1,
      children: [
        /* @__PURE__ */ jsx_dev_runtime298.jsxDEV(ThemedText, {
          children: `-  ${getOriginalCwd()}`
        }, void 0, !1, void 0, this),
        /* @__PURE__ */ jsx_dev_runtime298.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "(Original working directory)"
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[15] = t6;
  else
    t6 = $3[15];
  let t7 = Math.min(10, options2.length), t8;
  if ($3[16] !== focusHeader || $3[17] !== handleCancel || $3[18] !== handleDirectorySelect || $3[19] !== headerFocused || $3[20] !== options2 || $3[21] !== t7)
    t8 = /* @__PURE__ */ jsx_dev_runtime298.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      marginBottom: 1,
      children: [
        t6,
        /* @__PURE__ */ jsx_dev_runtime298.jsxDEV(Select, {
          options: options2,
          onChange: handleDirectorySelect,
          onCancel: handleCancel,
          visibleOptionCount: t7,
          onUpFromFirstItem: focusHeader,
          isDisabled: headerFocused
        }, void 0, !1, void 0, this)
      ]
    }, void 0, !0, void 0, this), $3[16] = focusHeader, $3[17] = handleCancel, $3[18] = handleDirectorySelect, $3[19] = headerFocused, $3[20] = options2, $3[21] = t7, $3[22] = t8;
  else
    t8 = $3[22];
  return t8;
}
function _temp258(dir) {
  return {
    label: dir.path,
    value: dir.path
  };
}
function _temp145(path25) {
  return {
    path: path25,
    isCurrent: !1,
    isDeletable: !0
  };
}
var import_compiler_runtime236, import_react168, jsx_dev_runtime298;
var init_WorkspaceTab = __esm(() => {
  init_figures();
  init_state();
  init_select();
  init_ink2();
  init_Tabs();
  import_compiler_runtime236 = __toESM(require_react_compiler_runtime_development(), 1), import_react168 = __toESM(require_react_development(), 1), jsx_dev_runtime298 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
