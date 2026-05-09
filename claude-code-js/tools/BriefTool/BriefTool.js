// Original: src/tools/BriefTool/BriefTool.ts
var exports_BriefTool = {};
__export(exports_BriefTool, {
  isBriefEntitled: () => isBriefEntitled,
  isBriefEnabled: () => isBriefEnabled,
  BriefTool: () => BriefTool
});
function isBriefEntitled() {
  return getKairosActive() || isEnvTruthy(process.env.CLAUDE_CODE_BRIEF) || !0;
}
function isBriefEnabled() {
  return (getKairosActive() || getUserMsgOptIn()) && isBriefEntitled();
}
var inputSchema19, outputSchema16, BriefTool;
var init_BriefTool = __esm(() => {
  init_v4();
  init_state();
  init_Tool();
  init_envUtils();
  init_attachments();
  init_prompt();
  init_UI15();
  inputSchema19 = lazySchema(() => exports_external.strictObject({
    message: exports_external.string().describe("The message for the user. Supports markdown formatting."),
    attachments: exports_external.array(exports_external.string()).optional().describe("Optional file paths (absolute or relative to cwd) to attach. Use for photos, screenshots, diffs, logs, or any file the user should see alongside your message."),
    status: exports_external.enum(["normal", "proactive"]).describe("Use 'proactive' when you're surfacing something the user hasn't asked for and needs to see now \u2014 task completion while they're away, a blocker you hit, an unsolicited status update. Use 'normal' when replying to something the user just said.")
  })), outputSchema16 = lazySchema(() => exports_external.object({
    message: exports_external.string().describe("The message"),
    attachments: exports_external.array(exports_external.object({
      path: exports_external.string(),
      size: exports_external.number(),
      isImage: exports_external.boolean(),
      file_uuid: exports_external.string().optional()
    })).optional().describe("Resolved attachment metadata"),
    sentAt: exports_external.string().optional().describe("ISO timestamp captured at tool execution on the emitting process. Optional \u2014 resumed sessions replay pre-sentAt outputs verbatim.")
  }));
  BriefTool = buildTool({
    name: BRIEF_TOOL_NAME,
    aliases: [LEGACY_BRIEF_TOOL_NAME],
    searchHint: "send a message to the user \u2014 your primary visible output channel",
    maxResultSizeChars: 1e5,
    userFacingName() {
      return "";
    },
    get inputSchema() {
      return inputSchema19();
    },
    get outputSchema() {
      return outputSchema16();
    },
    isEnabled() {
      return isBriefEnabled();
    },
    isConcurrencySafe() {
      return !0;
    },
    isReadOnly() {
      return !0;
    },
    toAutoClassifierInput(input) {
      return input.message;
    },
    async validateInput({ attachments }, _context) {
      if (!attachments || attachments.length === 0)
        return { result: !0 };
      return validateAttachmentPaths(attachments);
    },
    async description() {
      return DESCRIPTION2;
    },
    async prompt() {
      return BRIEF_TOOL_PROMPT;
    },
    mapToolResultToToolResultBlockParam(output, toolUseID) {
      let n5 = output.attachments?.length ?? 0, suffix = n5 === 0 ? "" : ` (${n5} ${plural(n5, "attachment")} included)`;
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: `Message delivered to user.${suffix}`
      };
    },
    renderToolUseMessage: renderToolUseMessage16,
    renderToolResultMessage: renderToolResultMessage15,
    async call({ message, attachments, status }, context6) {
      let sentAt = (/* @__PURE__ */ new Date()).toISOString();
      if (logEvent("tengu_brief_send", {
        proactive: status === "proactive",
        attachment_count: attachments?.length ?? 0
      }), !attachments || attachments.length === 0)
        return { data: { message, sentAt } };
      let appState = context6.getAppState(), resolved = await resolveAttachments(attachments, {
        replBridgeEnabled: appState.replBridgeEnabled,
        signal: context6.abortController.signal
      });
      return {
        data: { message, attachments: resolved, sentAt }
      };
    }
  });
});
