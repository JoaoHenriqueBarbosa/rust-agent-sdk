// Original: src/hooks/useDiffInIDE.ts
import { randomUUID as randomUUID32 } from "crypto";
import { basename as basename44 } from "path";
function useDiffInIDE({
  onChange,
  toolUseContext,
  filePath,
  edits,
  editMode
}) {
  let isUnmounted = import_react210.useRef(!1), [hasError, setHasError] = import_react210.useState(!1), sha = import_react210.useMemo(() => randomUUID32().slice(0, 6), []), tabName = import_react210.useMemo(() => `\u273B [Claude Code] ${basename44(filePath)} (${sha}) \u29C9`, [filePath, sha]), shouldShowDiffInIDE = hasAccessToIDEExtensionDiffFeature(toolUseContext.options.mcpClients) && getGlobalConfig().diffTool === "auto" && !filePath.endsWith(".ipynb"), ideName = getConnectedIdeName(toolUseContext.options.mcpClients) ?? "IDE";
  async function showDiff() {
    if (!shouldShowDiffInIDE)
      return;
    try {
      logEvent("tengu_ext_will_show_diff", {});
      let { oldContent, newContent } = await showDiffInIDE(filePath, edits, toolUseContext, tabName);
      if (isUnmounted.current)
        return;
      logEvent("tengu_ext_diff_accepted", {});
      let newEdits = computeEditsFromContents(filePath, oldContent, newContent, editMode);
      if (newEdits.length === 0) {
        logEvent("tengu_ext_diff_rejected", {});
        let ideClient = getConnectedIdeClient(toolUseContext.options.mcpClients);
        if (ideClient)
          await closeTabInIDE(tabName, ideClient);
        onChange({ type: "reject" }, {
          file_path: filePath,
          edits
        });
        return;
      }
      onChange({ type: "accept-once" }, {
        file_path: filePath,
        edits: newEdits
      });
    } catch (error44) {
      logError2(error44), setHasError(!0);
    }
  }
  return import_react210.useEffect(() => {
    return showDiff(), () => {
      isUnmounted.current = !0;
    };
  }, []), {
    closeTabInIDE() {
      let ideClient = getConnectedIdeClient(toolUseContext.options.mcpClients);
      if (!ideClient)
        return Promise.resolve();
      return closeTabInIDE(tabName, ideClient);
    },
    showingDiffInIDE: shouldShowDiffInIDE && !hasError,
    ideName,
    hasError
  };
}
function computeEditsFromContents(filePath, oldContent, newContent, editMode) {
  let singleHunk = editMode === "single", patch = getPatchFromContents({
    filePath,
    oldContent,
    newContent,
    singleHunk
  });
  if (patch.length === 0)
    return [];
  if (singleHunk && patch.length > 1)
    logError2(Error(`Unexpected number of hunks: ${patch.length}. Expected 1 hunk.`));
  return getEditsForPatch(patch);
}
async function showDiffInIDE(file_path, edits, toolUseContext, tabName) {
  let isCleanedUp = !1, oldFilePath = expandPath(file_path), oldContent = "";
  try {
    oldContent = readFileSync4(oldFilePath);
  } catch (e) {
    if (!isENOENT(e))
      throw e;
  }
  async function cleanup() {
    if (isCleanedUp)
      return;
    isCleanedUp = !0;
    try {
      await closeTabInIDE(tabName, ideClient);
    } catch (e) {
      logError2(e);
    }
    process.off("beforeExit", cleanup), toolUseContext.abortController.signal.removeEventListener("abort", cleanup);
  }
  toolUseContext.abortController.signal.addEventListener("abort", cleanup), process.on("beforeExit", cleanup);
  let ideClient = getConnectedIdeClient(toolUseContext.options.mcpClients);
  try {
    let { updatedFile } = getPatchForEdits({
      filePath: oldFilePath,
      fileContents: oldContent,
      edits
    });
    if (!ideClient || ideClient.type !== "connected")
      throw Error("IDE client not available");
    let ideOldPath = oldFilePath, ideRunningInWindows = ideClient.config.ideRunningInWindows === !0;
    if (getPlatform() === "wsl" && ideRunningInWindows && process.env.WSL_DISTRO_NAME)
      ideOldPath = new WindowsToWSLConverter(process.env.WSL_DISTRO_NAME).toIDEPath(oldFilePath);
    let rpcResult = await callIdeRpc("openDiff", {
      old_file_path: ideOldPath,
      new_file_path: ideOldPath,
      new_file_contents: updatedFile,
      tab_name: tabName
    }, ideClient), data = Array.isArray(rpcResult) ? rpcResult : [rpcResult];
    if (isSaveMessage(data))
      return cleanup(), {
        oldContent,
        newContent: data[1].text
      };
    else if (isClosedMessage(data))
      return cleanup(), {
        oldContent,
        newContent: updatedFile
      };
    else if (isRejectedMessage(data))
      return cleanup(), {
        oldContent,
        newContent: oldContent
      };
    throw Error("Not accepted");
  } catch (error44) {
    throw logError2(error44), cleanup(), error44;
  }
}
async function closeTabInIDE(tabName, ideClient) {
  try {
    if (!ideClient || ideClient.type !== "connected")
      throw Error("IDE client not available");
    await callIdeRpc("close_tab", { tab_name: tabName }, ideClient);
  } catch (error44) {
    logError2(error44);
  }
}
function isClosedMessage(data) {
  return Array.isArray(data) && typeof data[0] === "object" && data[0] !== null && "type" in data[0] && data[0].type === "text" && "text" in data[0] && data[0].text === "TAB_CLOSED";
}
function isRejectedMessage(data) {
  return Array.isArray(data) && typeof data[0] === "object" && data[0] !== null && "type" in data[0] && data[0].type === "text" && "text" in data[0] && data[0].text === "DIFF_REJECTED";
}
function isSaveMessage(data) {
  return Array.isArray(data) && data[0]?.type === "text" && data[0].text === "FILE_SAVED" && typeof data[1].text === "string";
}
var import_react210;
var init_useDiffInIDE = __esm(() => {
  init_fileRead();
  init_path2();
  init_utils13();
  init_config4();
  init_diff2();
  init_errors();
  init_ide();
  init_idePathConversion();
  init_log3();
  init_platform();
  import_react210 = __toESM(require_react_development(), 1);
});
