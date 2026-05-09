// Original: src/commands/export/export.tsx
var exports_export = {};
__export(exports_export, {
  sanitizeFilename: () => sanitizeFilename,
  extractFirstPrompt: () => extractFirstPrompt,
  call: () => call59
});
import { join as join129 } from "path";
function formatTimestamp(date6) {
  let year = date6.getFullYear(), month = String(date6.getMonth() + 1).padStart(2, "0"), day = String(date6.getDate()).padStart(2, "0"), hours = String(date6.getHours()).padStart(2, "0"), minutes = String(date6.getMinutes()).padStart(2, "0"), seconds = String(date6.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
}
function extractFirstPrompt(messages) {
  let firstUserMessage = messages.find((msg) => msg.type === "user");
  if (!firstUserMessage || firstUserMessage.type !== "user")
    return "";
  let content = firstUserMessage.message?.content, result = "";
  if (typeof content === "string")
    result = content.trim();
  else if (Array.isArray(content)) {
    let textContent2 = content.find((item) => item.type === "text");
    if (textContent2 && "text" in textContent2)
      result = textContent2.text.trim();
  }
  if (result = result.split(`
`)[0] || "", result.length > 50)
    result = result.substring(0, 49) + "\u2026";
  return result;
}
function sanitizeFilename(text2) {
  return text2.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}
async function exportWithReactRenderer(context7) {
  let tools = context7.options.tools || [];
  return renderMessagesToPlainText(context7.messages, tools);
}
async function call59(onDone, context7, args) {
  let content = await exportWithReactRenderer(context7), filename = args.trim();
  if (filename) {
    let finalFilename = filename.endsWith(".txt") ? filename : filename.replace(/\.[^.]+$/, "") + ".txt", filepath = join129(getCwd(), finalFilename);
    try {
      return writeFileSync_DEPRECATED(filepath, content, {
        encoding: "utf-8",
        flush: !0
      }), onDone(`Conversation exported to: ${filepath}`), null;
    } catch (error44) {
      return onDone(`Failed to export conversation: ${error44 instanceof Error ? error44.message : "Unknown error"}`), null;
    }
  }
  let firstPrompt = extractFirstPrompt(context7.messages), timestamp = formatTimestamp(/* @__PURE__ */ new Date), defaultFilename;
  if (firstPrompt) {
    let sanitized = sanitizeFilename(firstPrompt);
    defaultFilename = sanitized ? `${timestamp}-${sanitized}.txt` : `conversation-${timestamp}.txt`;
  } else
    defaultFilename = `conversation-${timestamp}.txt`;
  return /* @__PURE__ */ jsx_dev_runtime351.jsxDEV(ExportDialog, {
    content,
    defaultFilename,
    onDone: (result) => {
      onDone(result.message);
    }
  }, void 0, !1, void 0, this);
}
var jsx_dev_runtime351;
var init_export = __esm(() => {
  init_ExportDialog();
  init_cwd2();
  init_exportRenderer();
  init_slowOperations();
  jsx_dev_runtime351 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
