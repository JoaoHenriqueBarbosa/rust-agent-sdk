// Original: src/tools/TungstenTool/TungstenTool.ts
async function execTmuxCommand(args) {
  let fullArgs = ["-L", getClaudeSocketName(), ...args];
  if (getPlatform() === "windows") {
    let result2 = await execFileNoThrow("wsl", ["-e", "tmux", ...fullArgs], {
      env: { ...process.env, WSL_UTF8: "1" }
    });
    return {
      stdout: result2.stdout || "",
      stderr: result2.stderr || "",
      code: result2.code || 0
    };
  }
  let result = await execFileNoThrow("tmux", fullArgs);
  return {
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    code: result.code || 0
  };
}
var React39, TUNGSTEN_TOOL_NAME = "Tmux", sessionsWithTungstenUsage, initialized4 = !1, inputSchema24, TungstenTool;
var init_TungstenTool = __esm(() => {
  init_ink2();
  init_v4();
  init_Tool();
  init_tmuxSocket();
  init_execFileNoThrow();
  init_debug();
  init_platform();
  React39 = __toESM(require_react_development(), 1), sessionsWithTungstenUsage = /* @__PURE__ */ new Set;
  inputSchema24 = lazySchema(() => exports_external.strictObject({
    args: exports_external.array(exports_external.string()).describe('The tmux command arguments to execute. For example: ["send-keys", "-t", "session:0", "echo hello", "Enter"] or ["new-session", "-d", "-s", "test"].')
  })), TungstenTool = buildTool({
    name: TUNGSTEN_TOOL_NAME,
    searchHint: "tmux terminal multiplexer session management",
    maxResultSizeChars: 200000,
    get inputSchema() {
      return inputSchema24();
    },
    isEnabled() {
      return !1;
    },
    isConcurrencySafe() {
      return !1;
    },
    isReadOnly(input) {
      let readOnlyCommands = /* @__PURE__ */ new Set([
        "list-sessions",
        "ls",
        "list-windows",
        "lsw",
        "list-panes",
        "lsp",
        "capture-pane",
        "display-message",
        "show-options",
        "show-environment",
        "has-session"
      ]), firstArg = input.args?.[0];
      return firstArg ? readOnlyCommands.has(firstArg) : !1;
    },
    isDestructive(input) {
      let destructiveCommands = /* @__PURE__ */ new Set([
        "kill-session",
        "kill-server",
        "kill-window",
        "kill-pane"
      ]), firstArg = input.args?.[0];
      return firstArg ? destructiveCommands.has(firstArg) : !1;
    },
    interruptBehavior() {
      return "block";
    },
    userFacingName() {
      return "Tmux";
    },
    getActivityDescription(input) {
      if (!input?.args?.length)
        return null;
      let cmd = input.args[0];
      if (cmd === "send-keys")
        return "Sending keys to tmux";
      if (cmd === "capture-pane")
        return "Capturing tmux pane";
      if (cmd === "new-session")
        return "Creating tmux session";
      return `Running tmux ${cmd}`;
    },
    getToolUseSummary(input) {
      if (!input?.args?.length)
        return null;
      return `tmux ${input.args.join(" ")}`;
    },
    toAutoClassifierInput(input) {
      return `tmux ${input.args.join(" ")}`;
    },
    async description() {
      return "Execute tmux commands on an isolated tmux socket for terminal management.";
    },
    async prompt() {
      return `Execute tmux commands on Claude's isolated tmux socket. This tool provides access to a tmux session multiplexer for managing terminal sessions, windows, and panes.

Common operations:
- Create sessions: ["new-session", "-d", "-s", "name"]
- Send keys to a pane: ["send-keys", "-t", "session:window.pane", "command", "Enter"]
- Capture pane output: ["capture-pane", "-t", "session:window.pane", "-p"]
- List sessions: ["list-sessions"]
- Kill a session: ["kill-session", "-t", "name"]

All commands run on Claude's isolated socket \u2014 they cannot affect the user's tmux sessions.

The tmux socket is shared with the Bash tool, so environment variables set here will be visible in Bash commands and vice versa.`;
    },
    async checkPermissions(input, context6) {
      if (input.args?.[0] === "send-keys")
        return {
          behavior: "ask",
          message: `Run tmux ${input.args.join(" ")}?`,
          updatedInput: input
        };
      return { behavior: "allow", updatedInput: input };
    },
    async preparePermissionMatcher(input) {
      let fullCommand = `tmux ${input.args.join(" ")}`;
      return (pattern) => {
        if (pattern === "*")
          return !0;
        if (fullCommand.startsWith(pattern))
          return !0;
        if (pattern.endsWith("*"))
          return fullCommand.startsWith(pattern.slice(0, -1));
        return !1;
      };
    },
    async validateInput(input, context6) {
      if (!input.args || input.args.length === 0)
        return {
          result: !1,
          message: "args must contain at least one tmux subcommand",
          errorCode: 1
        };
      if (!await checkTmuxAvailable())
        return {
          result: !1,
          message: "tmux is not installed. Please install tmux to use this tool.",
          errorCode: 2
        };
      return { result: !0 };
    },
    mapToolResultToToolResultBlockParam(output, toolUseID) {
      let parts = [];
      if (output.stdout)
        parts.push(output.stdout);
      if (output.stderr)
        parts.push(`stderr: ${output.stderr}`);
      if (output.code !== 0)
        parts.push(`exit code: ${output.code}`);
      return {
        tool_use_id: toolUseID,
        type: "tool_result",
        content: parts.join(`
`) || "(no output)",
        ...output.code !== 0 ? { is_error: !0 } : {}
      };
    },
    renderToolUseMessage(input) {
      if (!input.args?.length)
        return null;
      return React39.createElement(ThemedText, null, `tmux ${input.args.join(" ")}`);
    },
    async call({ args }, context6, _canUseTool, _parentMessage, onProgress) {
      if (markTmuxToolUsed(), !initialized4)
        await ensureSocketInitialized(), initialized4 = !0;
      let socketName2 = getClaudeSocketName();
      sessionsWithTungstenUsage.add(socketName2);
      let firstArg = args[0];
      if (firstArg === "send-keys") {
        let keyArgs = args.slice(1), targetIdx = keyArgs.indexOf("-t"), target = `${socketName2}:0.0`;
        if (targetIdx >= 0 && targetIdx + 1 < keyArgs.length)
          target = keyArgs[targetIdx + 1];
        let commandStr = keyArgs.filter((a2, i5) => i5 !== targetIdx && i5 !== targetIdx + 1 && !a2.startsWith("-")).join(" ");
        context6.setAppState((prev) => ({
          ...prev,
          tungstenActiveSession: {
            sessionName: socketName2,
            socketName: socketName2,
            target
          },
          tungstenLastCommand: {
            command: commandStr || "send-keys",
            timestamp: Date.now()
          },
          tungstenPanelAutoHidden: !1
        }));
      } else if (firstArg === "new-session") {
        let sessionIdx = args.indexOf("-s"), sessionName = sessionIdx >= 0 && sessionIdx + 1 < args.length ? args[sessionIdx + 1] : "default";
        context6.setAppState((prev) => ({
          ...prev,
          tungstenActiveSession: {
            sessionName,
            socketName: socketName2,
            target: `${sessionName}:0.0`
          },
          tungstenPanelAutoHidden: !1
        }));
      }
      logForDebugging(`[Tungsten] Executing: tmux ${args.join(" ")}`);
      let result = await execTmuxCommand(args);
      if (firstArg === "capture-pane")
        context6.setAppState((prev) => ({
          ...prev,
          tungstenLastCapturedTime: Date.now()
        }));
      return {
        data: {
          stdout: result.stdout,
          stderr: result.stderr,
          code: result.code
        }
      };
    }
  });
});
