// Original: src/commands/statusline.tsx
var statusline, statusline_default;
var init_statusline = __esm(() => {
  init_constants3();
  statusline = {
    type: "prompt",
    description: "Set up Claude Code's status line UI",
    contentLength: 0,
    aliases: [],
    name: "statusline",
    progressMessage: "setting up statusLine",
    allowedTools: [AGENT_TOOL_NAME, "Read(~/**)", "Edit(~/.claude/settings.json)"],
    source: "builtin",
    disableNonInteractive: !0,
    async getPromptForCommand(args) {
      let prompt = args.trim() || "Configure my statusLine from my shell PS1 configuration";
      return [{
        type: "text",
        text: `Create an ${AGENT_TOOL_NAME} with subagent_type "statusline-setup" and the prompt "${prompt}"`
      }];
    }
  }, statusline_default = statusline;
});
