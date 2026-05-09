// Original: src/commands/add-dir/add-dir.tsx
var exports_add_dir = {};
__export(exports_add_dir, {
  call: () => call6
});
function AddDirError(t0) {
  let $3 = import_compiler_runtime128.c(10), {
    message,
    args,
    onDone
  } = t0, t1, t2;
  if ($3[0] !== onDone)
    t1 = () => {
      let timer = setTimeout(onDone, 0);
      return () => clearTimeout(timer);
    }, t2 = [onDone], $3[0] = onDone, $3[1] = t1, $3[2] = t2;
  else
    t1 = $3[1], t2 = $3[2];
  import_react91.useEffect(t1, t2);
  let t3;
  if ($3[3] !== args)
    t3 = /* @__PURE__ */ jsx_dev_runtime161.jsxDEV(ThemedText, {
      dimColor: !0,
      children: [
        figures_default.pointer,
        " /add-dir ",
        args
      ]
    }, void 0, !0, void 0, this), $3[3] = args, $3[4] = t3;
  else
    t3 = $3[4];
  let t4;
  if ($3[5] !== message)
    t4 = /* @__PURE__ */ jsx_dev_runtime161.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime161.jsxDEV(ThemedText, {
        children: message
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this), $3[5] = message, $3[6] = t4;
  else
    t4 = $3[6];
  let t5;
  if ($3[7] !== t3 || $3[8] !== t4)
    t5 = /* @__PURE__ */ jsx_dev_runtime161.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        t3,
        t4
      ]
    }, void 0, !0, void 0, this), $3[7] = t3, $3[8] = t4, $3[9] = t5;
  else
    t5 = $3[9];
  return t5;
}
async function call6(onDone, context6, args) {
  let directoryPath = (args ?? "").trim(), appState = context6.getAppState(), handleAddDirectory = async (path21, remember = !1) => {
    let permissionUpdate = {
      type: "addDirectories",
      directories: [path21],
      destination: remember ? "localSettings" : "session"
    }, latestAppState = context6.getAppState(), updatedContext = applyPermissionUpdate(latestAppState.toolPermissionContext, permissionUpdate);
    context6.setAppState((prev) => ({
      ...prev,
      toolPermissionContext: updatedContext
    }));
    let currentDirs = getAdditionalDirectoriesForClaudeMd();
    if (!currentDirs.includes(path21))
      setAdditionalDirectoriesForClaudeMd([...currentDirs, path21]);
    SandboxManager2.refreshConfig();
    let message;
    if (remember)
      try {
        persistPermissionUpdate(permissionUpdate), message = `Added ${source_default.bold(path21)} as a working directory and saved to local settings`;
      } catch (error44) {
        message = `Added ${source_default.bold(path21)} as a working directory. Failed to save to local settings: ${error44 instanceof Error ? error44.message : "Unknown error"}`;
      }
    else
      message = `Added ${source_default.bold(path21)} as a working directory for this session`;
    let messageWithHint = `${message} ${source_default.dim("\xB7 /permissions to manage")}`;
    onDone(messageWithHint);
  };
  if (!directoryPath)
    return /* @__PURE__ */ jsx_dev_runtime161.jsxDEV(AddWorkspaceDirectory, {
      permissionContext: appState.toolPermissionContext,
      onAddDirectory: handleAddDirectory,
      onCancel: () => {
        onDone("Did not add a working directory.");
      }
    }, void 0, !1, void 0, this);
  let result = await validateDirectoryForWorkspace(directoryPath, appState.toolPermissionContext);
  if (result.resultType !== "success") {
    let message = addDirHelpMessage(result);
    return /* @__PURE__ */ jsx_dev_runtime161.jsxDEV(AddDirError, {
      message,
      args: args ?? "",
      onDone: () => onDone(message)
    }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime161.jsxDEV(AddWorkspaceDirectory, {
    directoryPath: result.absolutePath,
    permissionContext: appState.toolPermissionContext,
    onAddDirectory: handleAddDirectory,
    onCancel: () => {
      onDone(`Did not add ${source_default.bold(result.absolutePath)} as a working directory.`);
    }
  }, void 0, !1, void 0, this);
}
var import_compiler_runtime128, import_react91, jsx_dev_runtime161;
var init_add_dir = __esm(() => {
  init_source();
  init_figures();
  init_state();
  init_MessageResponse();
  init_AddWorkspaceDirectory();
  init_ink2();
  init_PermissionUpdate();
  init_sandbox_adapter();
  init_validation3();
  import_compiler_runtime128 = __toESM(require_react_compiler_runtime_development(), 1), import_react91 = __toESM(require_react_development(), 1), jsx_dev_runtime161 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
