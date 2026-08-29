// Original: src/tools/MCPTool/UI.tsx
function renderToolUseMessage2(input, {
  verbose
}) {
  if (Object.keys(input).length === 0)
    return "";
  return Object.entries(input).map(([key2, value]) => {
    let rendered = jsonStringify(value);
    return `${key2}: ${rendered}`;
  }).join(", ");
}
function renderToolUseProgressMessage(progressMessagesForMessage) {
  let lastProgress = progressMessagesForMessage.at(-1);
  if (!lastProgress?.data)
    return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Running\u2026"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  let {
    progress,
    total,
    progressMessage
  } = lastProgress.data;
  if (progress === void 0)
    return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
        dimColor: !0,
        children: "Running\u2026"
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  if (total !== void 0 && total > 0) {
    let ratio = Math.min(1, Math.max(0, progress / total)), percentage = Math.round(ratio * 100);
    return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
      children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedBox_default, {
        flexDirection: "column",
        children: [
          progressMessage && /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
            dimColor: !0,
            children: progressMessage
          }, void 0, !1, void 0, this),
          /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedBox_default, {
            flexDirection: "row",
            gap: 1,
            children: [
              /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ProgressBar, {
                ratio,
                width: 20
              }, void 0, !1, void 0, this),
              /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
                dimColor: !0,
                children: [
                  percentage,
                  "%"
                ]
              }, void 0, !0, void 0, this)
            ]
          }, void 0, !0, void 0, this)
        ]
      }, void 0, !0, void 0, this)
    }, void 0, !1, void 0, this);
  }
  return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
    height: 1,
    children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
      dimColor: !0,
      children: progressMessage ?? `Processing\u2026 ${progress}`
    }, void 0, !1, void 0, this)
  }, void 0, !1, void 0, this);
}
function renderToolResultMessage2(output, _progressMessagesForMessage, {
  verbose,
  input
}) {
  let mcpOutput = output;
  if (!verbose) {
    let slackSend = trySlackSendCompact(mcpOutput, input);
    if (slackSend !== null)
      return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
          children: [
            "Sent a message to",
            " ",
            /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(Ansi, {
              children: createHyperlink(slackSend.url, slackSend.channel)
            }, void 0, !1, void 0, this)
          ]
        }, void 0, !0, void 0, this)
      }, void 0, !1, void 0, this);
  }
  let estimatedTokens = getContentSizeEstimate(mcpOutput), warningMessage = estimatedTokens > MCP_OUTPUT_WARNING_THRESHOLD_TOKENS ? `${figures_default.warning} Large MCP response (~${formatNumber(estimatedTokens)} tokens), this can fill up context quickly` : null, contentElement;
  if (Array.isArray(mcpOutput)) {
    let contentBlocks = mcpOutput.map((item, i5) => {
      if (item.type === "image")
        return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedBox_default, {
          justifyContent: "space-between",
          overflowX: "hidden",
          width: "100%",
          children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
            height: 1,
            children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
              children: "[Image]"
            }, void 0, !1, void 0, this)
          }, void 0, !1, void 0, this)
        }, i5, !1, void 0, this);
      let textContent = item.type === "text" && "text" in item && item.text !== null && item.text !== void 0 ? String(item.text) : "";
      return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(OutputLine, {
        content: textContent,
        verbose
      }, i5, !1, void 0, this);
    });
    contentElement = /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      width: "100%",
      children: contentBlocks
    }, void 0, !1, void 0, this);
  } else if (!mcpOutput)
    contentElement = /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedBox_default, {
      justifyContent: "space-between",
      overflowX: "hidden",
      width: "100%",
      children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
        height: 1,
        children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
          dimColor: !0,
          children: "(No content)"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  else
    contentElement = /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(OutputLine, {
      content: mcpOutput,
      verbose
    }, void 0, !1, void 0, this);
  if (warningMessage)
    return /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedBox_default, {
      flexDirection: "column",
      children: [
        /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(MessageResponse, {
          height: 1,
          children: /* @__PURE__ */ jsx_dev_runtime30.jsxDEV(ThemedText, {
            color: "warning",
            children: warningMessage
          }, void 0, !1, void 0, this)
        }, void 0, !1, void 0, this),
        contentElement
      ]
    }, void 0, !0, void 0, this);
  return contentElement;
}
function parseJsonEntries(content, {
  maxChars,
  maxKeys
}) {
  let trimmed = content.trim();
  if (trimmed.length === 0 || trimmed.length > maxChars || trimmed[0] !== "{")
    return null;
  let parsed;
  try {
    parsed = jsonParse(trimmed);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed))
    return null;
  let entries = Object.entries(parsed);
  if (entries.length === 0 || entries.length > maxKeys)
    return null;
  return entries;
}
function trySlackSendCompact(output, input) {
  let text2 = output;
  if (Array.isArray(output)) {
    let block2 = output.find((b) => b.type === "text");
    text2 = block2 && "text" in block2 ? block2.text : void 0;
  }
  if (typeof text2 !== "string" || !text2.includes('"message_link"'))
    return null;
  let url3 = parseJsonEntries(text2, {
    maxChars: 2000,
    maxKeys: 6
  })?.find(([k3]) => k3 === "message_link")?.[1];
  if (typeof url3 !== "string")
    return null;
  let m4 = SLACK_ARCHIVES_RE.exec(url3);
  if (!m4)
    return null;
  let inp = input, raw = inp?.channel_id ?? inp?.channel ?? m4[1], label = typeof raw === "string" && raw ? raw : "slack";
  return {
    channel: label.startsWith("#") ? label : `#${label}`,
    url: url3
  };
}
var import_compiler_runtime26, jsx_dev_runtime30, MCP_OUTPUT_WARNING_THRESHOLD_TOKENS = 1e4, SLACK_ARCHIVES_RE;
var init_UI2 = __esm(() => {
  init_figures();
  init_ProgressBar();
  init_MessageResponse();
  init_OutputLine();
  init_stringWidth();
  init_ink2();
  init_format();
  init_hyperlink();
  init_mcpValidation();
  init_slowOperations();
  import_compiler_runtime26 = __toESM(require_react_compiler_runtime_development(), 1), jsx_dev_runtime30 = __toESM(require_react_jsx_dev_runtime_development(), 1);
  SLACK_ARCHIVES_RE = /^https:\/\/[a-z0-9-]+\.slack\.com\/archives\/([A-Z0-9]+)\/p\d+$/;
});
