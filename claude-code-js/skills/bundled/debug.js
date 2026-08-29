// Original: src/skills/bundled/debug.ts
import { open as open17, stat as stat43 } from "fs/promises";
function registerDebugSkill() {
  registerBundledSkill({
    name: "debug",
    description: "Enable debug logging for this session and help diagnose issues",
    allowedTools: ["Read", "Grep", "Glob"],
    argumentHint: "[issue description]",
    disableModelInvocation: !0,
    userInvocable: !0,
    async getPromptForCommand(args) {
      let wasAlreadyLogging = enableDebugLogging(), debugLogPath = getDebugLogPath(), logInfo;
      try {
        let stats2 = await stat43(debugLogPath), readSize = Math.min(stats2.size, TAIL_READ_BYTES), startOffset = stats2.size - readSize, fd2 = await open17(debugLogPath, "r");
        try {
          let { buffer, bytesRead } = await fd2.read({
            buffer: Buffer.alloc(readSize),
            position: startOffset
          }), tail = buffer.toString("utf-8", 0, bytesRead).split(`
`).slice(-DEFAULT_DEBUG_LINES_READ).join(`
`);
          logInfo = `Log size: ${formatFileSize(stats2.size)}

### Last ${DEFAULT_DEBUG_LINES_READ} lines

\`\`\`
${tail}
\`\`\``;
        } finally {
          await fd2.close();
        }
      } catch (e) {
        logInfo = isENOENT(e) ? "No debug log exists yet \u2014 logging was just enabled." : `Failed to read last ${DEFAULT_DEBUG_LINES_READ} lines of debug log: ${errorMessage(e)}`;
      }
      return [{ type: "text", text: `# Debug Skill

Help the user debug an issue they're encountering in this current Claude Code session.
${wasAlreadyLogging ? "" : `
## Debug Logging Just Enabled

Debug logging was OFF for this session until now. Nothing prior to this /debug invocation was captured.

Tell the user that debug logging is now active at \`${debugLogPath}\`, ask them to reproduce the issue, then re-read the log. If they can't reproduce, they can also restart with \`claude --debug\` to capture logs from startup.
`}
## Session Debug Log

The debug log for the current session is at: \`${debugLogPath}\`

${logInfo}

For additional context, grep for [ERROR] and [WARN] lines across the full file.

## Issue Description

${args || "The user did not describe a specific issue. Read the debug log and summarize any errors, warnings, or notable issues."}

## Settings

Remember that settings are in:
* user - ${getSettingsFilePathForSource("userSettings")}
* project - ${getSettingsFilePathForSource("projectSettings")}
* local - ${getSettingsFilePathForSource("localSettings")}

## Instructions

1. Review the user's issue description
2. The last ${DEFAULT_DEBUG_LINES_READ} lines show the debug file format. Look for [ERROR] and [WARN] entries, stack traces, and failure patterns across the file
3. Consider launching the ${CLAUDE_CODE_GUIDE_AGENT_TYPE} subagent to understand the relevant Claude Code features
4. Explain what you found in plain language
5. Suggest concrete fixes or next steps
` }];
    }
  });
}
var DEFAULT_DEBUG_LINES_READ = 20, TAIL_READ_BYTES = 65536;
var init_debug3 = __esm(() => {
  init_claudeCodeGuideAgent();
  init_settings2();
  init_debug();
  init_errors();
  init_format();
  init_bundledSkills();
});
