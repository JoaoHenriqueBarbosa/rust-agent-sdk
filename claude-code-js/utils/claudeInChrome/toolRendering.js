// Original: src/utils/claudeInChrome/toolRendering.tsx
var exports_toolRendering = {};
__export(exports_toolRendering, {
  renderChromeToolResultMessage: () => renderChromeToolResultMessage,
  getClaudeInChromeMCPToolOverrides: () => getClaudeInChromeMCPToolOverrides
});
function renderChromeToolUseMessage(input, toolName, verbose) {
  let tabId = input.tabId;
  if (typeof tabId === "number")
    trackClaudeInChromeTabId(tabId);
  let secondaryInfo = [];
  switch (toolName) {
    case "navigate":
      if (typeof input.url === "string")
        try {
          let url3 = new URL(input.url);
          secondaryInfo.push(url3.hostname);
        } catch {
          secondaryInfo.push(truncateToWidth(input.url, 30));
        }
      break;
    case "find":
      if (typeof input.query === "string")
        secondaryInfo.push(`pattern: ${truncateToWidth(input.query, 30)}`);
      break;
    case "computer":
      if (typeof input.action === "string") {
        let action2 = input.action;
        if (action2 === "left_click" || action2 === "right_click" || action2 === "double_click" || action2 === "middle_click")
          if (typeof input.ref === "string")
            secondaryInfo.push(`${action2} on ${input.ref}`);
          else if (Array.isArray(input.coordinate))
            secondaryInfo.push(`${action2} at (${input.coordinate.join(", ")})`);
          else
            secondaryInfo.push(action2);
        else if (action2 === "type" && typeof input.text === "string")
          secondaryInfo.push(`type "${truncateToWidth(input.text, 15)}"`);
        else if (action2 === "key" && typeof input.text === "string")
          secondaryInfo.push(`key ${input.text}`);
        else if (action2 === "scroll" && typeof input.scroll_direction === "string")
          secondaryInfo.push(`scroll ${input.scroll_direction}`);
        else if (action2 === "wait" && typeof input.duration === "number")
          secondaryInfo.push(`wait ${input.duration}s`);
        else if (action2 === "left_click_drag")
          secondaryInfo.push("drag");
        else
          secondaryInfo.push(action2);
      }
      break;
    case "gif_creator":
      if (typeof input.action === "string")
        secondaryInfo.push(`${input.action}`);
      break;
    case "resize_window":
      if (typeof input.width === "number" && typeof input.height === "number")
        secondaryInfo.push(`${input.width}x${input.height}`);
      break;
    case "read_console_messages":
      if (typeof input.pattern === "string")
        secondaryInfo.push(`pattern: ${truncateToWidth(input.pattern, 20)}`);
      if (input.onlyErrors === !0)
        secondaryInfo.push("errors only");
      break;
    case "read_network_requests":
      if (typeof input.urlPattern === "string")
        secondaryInfo.push(`pattern: ${truncateToWidth(input.urlPattern, 20)}`);
      break;
    case "shortcuts_execute":
      if (typeof input.shortcutId === "string")
        secondaryInfo.push(`shortcut_id: ${input.shortcutId}`);
      break;
    case "javascript_tool":
      if (verbose && typeof input.text === "string")
        return input.text;
      return "";
    case "tabs_create_mcp":
    case "tabs_context_mcp":
    case "form_input":
    case "shortcuts_list":
    case "read_page":
    case "upload_image":
    case "get_page_text":
    case "update_plan":
      return "";
  }
  return secondaryInfo.join(", ") || null;
}
function renderChromeViewTabLink(input) {
  if (!supportsHyperlinks())
    return null;
  if (typeof input !== "object" || input === null || !("tabId" in input))
    return null;
  let tabId = typeof input.tabId === "number" ? input.tabId : typeof input.tabId === "string" ? parseInt(input.tabId, 10) : NaN;
  if (isNaN(tabId))
    return null;
  let linkUrl = `${CHROME_EXTENSION_FOCUS_TAB_URL_BASE}${tabId}`;
  return /* @__PURE__ */ jsx_dev_runtime38.jsxDEV(ThemedText, {
    children: [
      " ",
      /* @__PURE__ */ jsx_dev_runtime38.jsxDEV(Link, {
        url: linkUrl,
        children: /* @__PURE__ */ jsx_dev_runtime38.jsxDEV(ThemedText, {
          color: "subtle",
          children: "[View Tab]"
        }, void 0, !1, void 0, this)
      }, void 0, !1, void 0, this)
    ]
  }, void 0, !0, void 0, this);
}
function renderChromeToolResultMessage(output, toolName, verbose) {
  if (verbose)
    return renderToolResultMessage2(output, [], {
      verbose
    });
  let summary = null;
  switch (toolName) {
    case "navigate":
      summary = "Navigation completed";
      break;
    case "tabs_create_mcp":
      summary = "Tab created";
      break;
    case "tabs_context_mcp":
      summary = "Tabs read";
      break;
    case "form_input":
      summary = "Input completed";
      break;
    case "computer":
      summary = "Action completed";
      break;
    case "resize_window":
      summary = "Window resized";
      break;
    case "find":
      summary = "Search completed";
      break;
    case "gif_creator":
      summary = "GIF action completed";
      break;
    case "read_console_messages":
      summary = "Console messages retrieved";
      break;
    case "read_network_requests":
      summary = "Network requests retrieved";
      break;
    case "shortcuts_list":
      summary = "Shortcuts retrieved";
      break;
    case "shortcuts_execute":
      summary = "Shortcut executed";
      break;
    case "javascript_tool":
      summary = "Script executed";
      break;
    case "read_page":
      summary = "Page read";
      break;
    case "upload_image":
      summary = "Image uploaded";
      break;
    case "get_page_text":
      summary = "Page text retrieved";
      break;
    case "update_plan":
      summary = "Plan updated";
      break;
  }
  if (summary)
    return /* @__PURE__ */ jsx_dev_runtime38.jsxDEV(MessageResponse, {
      height: 1,
      children: /* @__PURE__ */ jsx_dev_runtime38.jsxDEV(ThemedText, {
        dimColor: !0,
        children: summary
      }, void 0, !1, void 0, this)
    }, void 0, !1, void 0, this);
  return null;
}
function getClaudeInChromeMCPToolOverrides(toolName) {
  return {
    userFacingName(_input) {
      return `Claude in Chrome[${toolName.replace(/_mcp$/, "")}]`;
    },
    renderToolUseMessage(input, {
      verbose
    }) {
      return renderChromeToolUseMessage(input, toolName, verbose);
    },
    renderToolUseTag(input) {
      return renderChromeViewTabLink(input);
    },
    renderToolResultMessage(output, _progressMessagesForMessage, {
      verbose
    }) {
      if (!isMCPToolResult(output))
        return null;
      return renderChromeToolResultMessage(output, toolName, verbose);
    }
  };
}
function isMCPToolResult(output) {
  return typeof output === "object" && output !== null;
}
var jsx_dev_runtime38, CHROME_EXTENSION_FOCUS_TAB_URL_BASE = "https://clau.de/chrome/tab/";
var init_toolRendering = __esm(() => {
  init_MessageResponse();
  init_supports_hyperlinks();
  init_ink2();
  init_UI2();
  init_format();
  init_common3();
  jsx_dev_runtime38 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
