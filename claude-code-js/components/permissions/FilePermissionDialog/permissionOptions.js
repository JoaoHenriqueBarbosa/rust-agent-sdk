// Original: src/components/permissions/FilePermissionDialog/permissionOptions.tsx
import { homedir as homedir37 } from "os";
import { basename as basename46, join as join141, sep as sep33 } from "path";
function isInClaudeFolder(filePath) {
  let absolutePath = expandPath(filePath), claudeFolderPath = expandPath(`${getOriginalCwd()}/.claude`), normalizedAbsolutePath = normalizeCaseForComparison2(absolutePath), normalizedClaudeFolderPath = normalizeCaseForComparison2(claudeFolderPath);
  return normalizedAbsolutePath.startsWith(normalizedClaudeFolderPath + sep33.toLowerCase()) || normalizedAbsolutePath.startsWith(normalizedClaudeFolderPath + "/");
}
function isInGlobalClaudeFolder(filePath) {
  let absolutePath = expandPath(filePath), globalClaudeFolderPath = join141(homedir37(), ".claude"), normalizedAbsolutePath = normalizeCaseForComparison2(absolutePath), normalizedGlobalClaudeFolderPath = normalizeCaseForComparison2(globalClaudeFolderPath);
  return normalizedAbsolutePath.startsWith(normalizedGlobalClaudeFolderPath + sep33.toLowerCase()) || normalizedAbsolutePath.startsWith(normalizedGlobalClaudeFolderPath + "/");
}
function getFilePermissionOptions({
  filePath,
  toolPermissionContext,
  operationType = "write",
  onRejectFeedbackChange,
  onAcceptFeedbackChange,
  yesInputMode = !1,
  noInputMode = !1
}) {
  let options2 = [], modeCycleShortcut = getShortcutDisplay("chat:cycleMode", "Chat", "shift+tab");
  if (yesInputMode && onAcceptFeedbackChange)
    options2.push({
      type: "input",
      label: "Yes",
      value: "yes",
      placeholder: "and tell Claude what to do next",
      onChange: onAcceptFeedbackChange,
      allowEmptySubmitToCancel: !0,
      option: {
        type: "accept-once"
      }
    });
  else
    options2.push({
      label: "Yes",
      value: "yes",
      option: {
        type: "accept-once"
      }
    });
  let inAllowedPath = pathInAllowedWorkingPath(filePath, toolPermissionContext), inClaudeFolder = isInClaudeFolder(filePath), inGlobalClaudeFolder = isInGlobalClaudeFolder(filePath);
  if ((inClaudeFolder || inGlobalClaudeFolder) && operationType !== "read")
    options2.push({
      label: "Yes, and allow Claude to edit its own settings for this session",
      value: "yes-claude-folder",
      option: {
        type: "accept-session",
        scope: inGlobalClaudeFolder ? "global-claude-folder" : "claude-folder"
      }
    });
  else {
    let sessionLabel;
    if (inAllowedPath)
      if (operationType === "read")
        sessionLabel = "Yes, during this session";
      else
        sessionLabel = /* @__PURE__ */ jsx_dev_runtime382.jsxDEV(ThemedText, {
          children: [
            "Yes, allow all edits during this session",
            " ",
            /* @__PURE__ */ jsx_dev_runtime382.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                "(",
                modeCycleShortcut,
                ")"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this);
    else {
      let dirPath = getDirectoryForPath(filePath), dirName = basename46(dirPath) || "this directory";
      if (operationType === "read")
        sessionLabel = /* @__PURE__ */ jsx_dev_runtime382.jsxDEV(ThemedText, {
          children: [
            "Yes, allow reading from ",
            /* @__PURE__ */ jsx_dev_runtime382.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                dirName,
                "/"
              ]
            }, void 0, !0, void 0, this),
            " during this session"
          ]
        }, void 0, !0, void 0, this);
      else
        sessionLabel = /* @__PURE__ */ jsx_dev_runtime382.jsxDEV(ThemedText, {
          children: [
            "Yes, allow all edits in ",
            /* @__PURE__ */ jsx_dev_runtime382.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                dirName,
                "/"
              ]
            }, void 0, !0, void 0, this),
            " during this session ",
            /* @__PURE__ */ jsx_dev_runtime382.jsxDEV(ThemedText, {
              bold: !0,
              children: [
                "(",
                modeCycleShortcut,
                ")"
              ]
            }, void 0, !0, void 0, this)
          ]
        }, void 0, !0, void 0, this);
    }
    options2.push({
      label: sessionLabel,
      value: "yes-session",
      option: {
        type: "accept-session"
      }
    });
  }
  if (noInputMode && onRejectFeedbackChange)
    options2.push({
      type: "input",
      label: "No",
      value: "no",
      placeholder: "and tell Claude what to do differently",
      onChange: onRejectFeedbackChange,
      allowEmptySubmitToCancel: !0,
      option: {
        type: "reject"
      }
    });
  else
    options2.push({
      label: "No",
      value: "no",
      option: {
        type: "reject"
      }
    });
  return options2;
}
var jsx_dev_runtime382;
var init_permissionOptions = __esm(() => {
  init_state();
  init_ink2();
  init_shortcutFormat();
  init_path2();
  init_filesystem();
  jsx_dev_runtime382 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
