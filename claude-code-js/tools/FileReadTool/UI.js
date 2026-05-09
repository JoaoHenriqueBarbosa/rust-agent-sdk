// Original: src/tools/FileReadTool/UI.tsx
function getAgentOutputTaskId(filePath) {
  let prefix = `${getTaskOutputDir()}/`, suffix = ".output";
  if (filePath.startsWith(prefix) && filePath.endsWith(".output")) {
    let taskId = filePath.slice(prefix.length, -7);
    if (taskId.length > 0 && taskId.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(taskId))
      return taskId;
  }
  return null;
}
function renderToolUseMessage27({
  file_path,
  offset,
  limit,
  pages
}, {
  verbose
}) {
  if (!file_path)
    return null;
  if (getAgentOutputTaskId(file_path))
    return "";
  let displayPath = verbose ? file_path : getDisplayPath(file_path);
  if (pages)
    return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(jsx_dev_runtime154.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(FilePathLink, {
          filePath: file_path,
          children: displayPath
        }, void 0, !1, void 0, this),
        ` \xB7 pages ${pages}`
      ]
    }, void 0, !0, void 0, this);
  if (verbose && (offset || limit)) {
    let startLine = offset ?? 1, lineRange = limit ? `lines ${startLine}-${startLine + limit - 1}` : `from line ${startLine}`;
    return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(jsx_dev_runtime154.Fragment, {
      children: [
        /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(FilePathLink, {
          filePath: file_path,
          children: displayPath
        }, void 0, !1, void 0, this),
        ` \xB7 ${lineRange}`
      ]
    }, void 0, !0, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(FilePathLink, {
    filePath: file_path,
    children: displayPath
  }, void 0, !1, void 0, this);
}
function renderToolUseTag2({
  file_path
}) {
  let agentTaskId = file_path ? getAgentOutputTaskId(file_path) : null;
  if (!agentTaskId)
    return null;
  return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
    dimColor: !0,
    children: [
      " ",
      agentTaskId
    ]
  }, void 0, !0, void 0, this);
}
function renderToolResultMessage25(output) {
  switch (output.type) {
    case "image": {
      let {
        originalSize
      } = output.file, formattedSize = formatFileSize(originalSize);
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          children: [
            "Read image (",
            formattedSize,
            ")"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
    }
    case "notebook": {
      let {
        cells
      } = output.file;
      if (!cells || cells.length < 1)
        return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          color: "error",
          children: "No cells found in notebook"
        }, void 0, !1, void 0, this);
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          children: [
            "Read ",
            /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
              bold: !0,
              children: cells.length
            }, void 0, !1, void 0, this),
            " cells"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
    }
    case "pdf": {
      let {
        originalSize
      } = output.file, formattedSize = formatFileSize(originalSize);
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          children: [
            "Read PDF (",
            formattedSize,
            ")"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
    }
    case "parts":
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          children: [
            "Read ",
            /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
              bold: !0,
              children: output.file.count
            }, void 0, !1, void 0, this),
            " ",
            output.file.count === 1 ? "page" : "pages",
            " (",
            formatFileSize(output.file.originalSize),
            ")"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
    case "text": {
      let {
        numLines
      } = output.file;
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          children: [
            "Read ",
            /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
              bold: !0,
              children: numLines
            }, void 0, !1, void 0, this),
            " ",
            numLines === 1 ? "line" : "lines"
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
    }
    case "file_unchanged":
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "Unchanged since last read"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
  }
}
function renderToolUseErrorMessage11(result, {
  verbose
}) {
  if (!verbose && typeof result === "string") {
    if (result.includes(FILE_NOT_FOUND_CWD_NOTE))
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          color: "error",
          children: "File not found"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
    if (extractTag(result, "tool_use_error"))
      return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(MessageResponse, {
        children: /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(ThemedText, {
          color: "error",
          children: "Error reading file"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime154.jsxDEV(FallbackToolUseErrorMessage, {
    result,
    verbose
  }, void 0, !1, void 0, this);
}
function userFacingName7(input) {
  if (input?.file_path?.startsWith(getPlansDirectory()))
    return "Reading Plan";
  if (input?.file_path && getAgentOutputTaskId(input.file_path))
    return "Read agent output";
  return "Read";
}
function getToolUseSummary8(input) {
  if (!input?.file_path)
    return null;
  let agentTaskId = getAgentOutputTaskId(input.file_path);
  if (agentTaskId)
    return agentTaskId;
  return getDisplayPath(input.file_path);
}
var jsx_dev_runtime154;
var init_UI25 = __esm(() => {
  init_messages3();
  init_FallbackToolUseErrorMessage();
  init_FilePathLink();
  init_MessageResponse();
  init_ink2();
  init_file();
  init_format();
  init_plans();
  init_diskOutput();
  jsx_dev_runtime154 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
