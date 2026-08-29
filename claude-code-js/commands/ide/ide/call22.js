// function: call22
async function call22(onDone, context7, args) {
  logEvent("tengu_ext_ide_command", {});
  let {
    options: {
      dynamicMcpConfig
    },
    onChangeDynamicMcpConfig
  } = context7;
  if (args?.trim() === "open") {
    let worktreeSession = getCurrentWorktreeSession(), targetPath = worktreeSession ? worktreeSession.worktreePath : getCwd(), availableIDEs2 = (await detectIDEs(!0)).filter((ide) => ide.isValid);
    if (availableIDEs2.length === 0)
      return onDone("No IDEs with Claude Code extension detected."), null;
    return /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(IDEOpenSelection, {
      availableIDEs: availableIDEs2,
      onSelectIDE: async (selectedIDE) => {
        if (!selectedIDE) {
          onDone("No IDE selected.");
          return;
        }
        if (selectedIDE.name.toLowerCase().includes("vscode") || selectedIDE.name.toLowerCase().includes("cursor") || selectedIDE.name.toLowerCase().includes("windsurf")) {
          let {
            code
          } = await execFileNoThrow("code", [targetPath]);
          if (code === 0)
            onDone(`Opened ${worktreeSession ? "worktree" : "project"} in ${source_default.bold(selectedIDE.name)}`);
          else
            onDone(`Failed to open in ${selectedIDE.name}. Try opening manually: ${targetPath}`);
        } else if (isSupportedJetBrainsTerminal())
          onDone(`Please open the ${worktreeSession ? "worktree" : "project"} manually in ${source_default.bold(selectedIDE.name)}: ${targetPath}`);
        else
          onDone(`Please open the ${worktreeSession ? "worktree" : "project"} manually in ${source_default.bold(selectedIDE.name)}: ${targetPath}`);
      },
      onDone: () => {
        onDone("Exited without opening IDE", {
          display: "system"
        });
      }
    }, void 0, !1, void 0, this);
  }
  let detectedIDEs = await detectIDEs(!0);
  if (detectedIDEs.length === 0 && context7.onInstallIDEExtension && !isSupportedTerminal()) {
    let runningIDEs = await detectRunningIDEs(), onInstall = (ide) => {
      if (context7.onInstallIDEExtension)
        if (context7.onInstallIDEExtension(ide), isJetBrainsIde(ide))
          onDone(`Installed plugin to ${source_default.bold(toIDEDisplayName(ide))}
Please ${source_default.bold("restart your IDE")} completely for it to take effect`);
        else
          onDone(`Installed extension to ${source_default.bold(toIDEDisplayName(ide))}`);
    };
    if (runningIDEs.length > 1)
      return /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(RunningIDESelector, {
        runningIDEs,
        onSelectIDE: onInstall,
        onDone: () => {
          onDone("No IDE selected.", {
            display: "system"
          });
        }
      }, void 0, !1, void 0, this);
    else if (runningIDEs.length === 1)
      return /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(InstallOnMount, {
        ide: runningIDEs[0],
        onInstall
      }, void 0, !1, void 0, this);
  }
  let availableIDEs = detectedIDEs.filter((ide) => ide.isValid), unavailableIDEs = detectedIDEs.filter((ide) => !ide.isValid), currentIDE = await findCurrentIDE(availableIDEs, dynamicMcpConfig);
  return /* @__PURE__ */ jsx_dev_runtime209.jsxDEV(IDECommandFlow, {
    availableIDEs,
    unavailableIDEs,
    currentIDE,
    dynamicMcpConfig,
    onChangeDynamicMcpConfig,
    onDone
  }, void 0, !1, void 0, this);
}
