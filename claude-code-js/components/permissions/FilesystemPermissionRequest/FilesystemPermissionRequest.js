// Original: src/components/permissions/FilesystemPermissionRequest/FilesystemPermissionRequest.tsx
function pathFromToolUse(toolUseConfirm) {
  let tool = toolUseConfirm.tool;
  if ("getPath" in tool && typeof tool.getPath === "function")
    try {
      return tool.getPath(toolUseConfirm.input);
    } catch {
      return null;
    }
  return null;
}
function FilesystemPermissionRequest(t0) {
  let $3 = import_compiler_runtime304.c(30), {
    toolUseConfirm,
    onDone,
    onReject,
    verbose,
    toolUseContext,
    workerBadge
  } = t0, [theme2] = useTheme(), t1;
  if ($3[0] !== toolUseConfirm)
    t1 = pathFromToolUse(toolUseConfirm), $3[0] = toolUseConfirm, $3[1] = t1;
  else
    t1 = $3[1];
  let path26 = t1, t2;
  if ($3[2] !== toolUseConfirm.input || $3[3] !== toolUseConfirm.tool)
    t2 = toolUseConfirm.tool.userFacingName(toolUseConfirm.input), $3[2] = toolUseConfirm.input, $3[3] = toolUseConfirm.tool, $3[4] = t2;
  else
    t2 = $3[4];
  let userFacingName8 = t2, isReadOnly = toolUseConfirm.tool.isReadOnly(toolUseConfirm.input), title = `${isReadOnly ? "Read" : "Edit"} file`, parseInput = _temp186;
  if (!path26) {
    let t32;
    if ($3[5] !== onDone || $3[6] !== onReject || $3[7] !== toolUseConfirm || $3[8] !== toolUseContext || $3[9] !== verbose || $3[10] !== workerBadge)
      t32 = /* @__PURE__ */ jsx_dev_runtime392.jsxDEV(FallbackPermissionRequest, {
        toolUseConfirm,
        toolUseContext,
        onDone,
        onReject,
        verbose,
        workerBadge
      }, void 0, !1, void 0, this), $3[5] = onDone, $3[6] = onReject, $3[7] = toolUseConfirm, $3[8] = toolUseContext, $3[9] = verbose, $3[10] = workerBadge, $3[11] = t32;
    else
      t32 = $3[11];
    return t32;
  }
  let t3;
  if ($3[12] !== theme2 || $3[13] !== toolUseConfirm.input || $3[14] !== toolUseConfirm.tool || $3[15] !== verbose)
    t3 = toolUseConfirm.tool.renderToolUseMessage(toolUseConfirm.input, {
      theme: theme2,
      verbose
    }), $3[12] = theme2, $3[13] = toolUseConfirm.input, $3[14] = toolUseConfirm.tool, $3[15] = verbose, $3[16] = t3;
  else
    t3 = $3[16];
  let t4;
  if ($3[17] !== t3 || $3[18] !== userFacingName8)
    t4 = /* @__PURE__ */ jsx_dev_runtime392.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      paddingX: 2,
      paddingY: 1,
      children: /* @__PURE__ */ jsx_dev_runtime392.jsxDEV(ThemedText, {
        children: [
          userFacingName8,
          "(",
          t3,
          ")"
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this), $3[17] = t3, $3[18] = userFacingName8, $3[19] = t4;
  else
    t4 = $3[19];
  let content = t4, t5 = isReadOnly ? "read" : "write", t6;
  if ($3[20] !== content || $3[21] !== onDone || $3[22] !== onReject || $3[23] !== path26 || $3[24] !== t5 || $3[25] !== title || $3[26] !== toolUseConfirm || $3[27] !== toolUseContext || $3[28] !== workerBadge)
    t6 = /* @__PURE__ */ jsx_dev_runtime392.jsxDEV(FilePermissionDialog, {
      toolUseConfirm,
      toolUseContext,
      onDone,
      onReject,
      workerBadge,
      title,
      content,
      path: path26,
      parseInput,
      operationType: t5,
      completionType: "tool_use_single"
    }, void 0, !1, void 0, this), $3[20] = content, $3[21] = onDone, $3[22] = onReject, $3[23] = path26, $3[24] = t5, $3[25] = title, $3[26] = toolUseConfirm, $3[27] = toolUseContext, $3[28] = workerBadge, $3[29] = t6;
  else
    t6 = $3[29];
  return t6;
}
function _temp186(input) {
  return input;
}
var import_compiler_runtime304, jsx_dev_runtime392;
var init_FilesystemPermissionRequest = __esm(() => {
  init_ink2();
  init_FallbackPermissionRequest();
  init_FilePermissionDialog();
  import_compiler_runtime304 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime392 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
