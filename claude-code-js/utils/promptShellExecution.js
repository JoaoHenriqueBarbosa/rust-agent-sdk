// Original: src/utils/promptShellExecution.ts
import { randomUUID as randomUUID15 } from "crypto";
async function executeShellCommandsInPrompt(text2, context6, slashCommandName, shell) {
  let result = text2, shellTool = shell === "powershell" && isPowerShellToolEnabled() ? getPowerShellTool() : BashTool, blockMatches = text2.matchAll(BLOCK_PATTERN), inlineMatches = text2.includes("!`") ? text2.matchAll(INLINE_PATTERN) : [];
  return await Promise.all([...blockMatches, ...inlineMatches].map(async (match) => {
    let command12 = match[1]?.trim();
    if (command12)
      try {
        let permissionResult = await hasPermissionsToUseTool(shellTool, { command: command12 }, context6, createAssistantMessage({ content: [] }), "");
        if (permissionResult.behavior !== "allow")
          throw logForDebugging(`Shell command permission check failed for command in ${slashCommandName}: ${command12}. Error: ${permissionResult.message}`), new MalformedCommandError(`Shell command permission check failed for pattern "${match[0]}": ${permissionResult.message || "Permission denied"}`);
        let { data } = await shellTool.call({ command: command12 }, context6), toolResultBlock = await processToolResultBlock(shellTool, data, randomUUID15()), output = typeof toolResultBlock.content === "string" ? toolResultBlock.content : formatBashOutput(data.stdout, data.stderr);
        result = result.replace(match[0], () => output);
      } catch (e) {
        if (e instanceof MalformedCommandError)
          throw e;
        formatBashError(e, match[0]);
      }
  })), result;
}
function formatBashOutput(stdout, stderr, inline2 = !1) {
  let parts = [];
  if (stdout.trim())
    parts.push(stdout.trim());
  if (stderr.trim())
    if (inline2)
      parts.push(`[stderr: ${stderr.trim()}]`);
    else
      parts.push(`[stderr]
${stderr.trim()}`);
  return parts.join(inline2 ? " " : `
`);
}
function formatBashError(e, pattern, inline2 = !1) {
  if (e instanceof ShellError) {
    if (e.interrupted)
      throw new MalformedCommandError(`Shell command interrupted for pattern "${pattern}": [Command interrupted]`);
    let output = formatBashOutput(e.stdout, e.stderr, inline2);
    throw new MalformedCommandError(`Shell command failed for pattern "${pattern}": ${output}`);
  }
  let message = errorMessage(e), formatted = inline2 ? `[Error: ${message}]` : `[Error]
${message}`;
  throw new MalformedCommandError(formatted);
}
var getPowerShellTool, BLOCK_PATTERN, INLINE_PATTERN;
var init_promptShellExecution = __esm(() => {
  init_BashTool();
  init_debug();
  init_errors();
  init_messages3();
  init_permissions2();
  init_toolResultStorage();
  init_shellToolUtils();
  getPowerShellTool = (() => {
    let cached3;
    return () => {
      if (!cached3)
        cached3 = (init_PowerShellTool(), __toCommonJS(exports_PowerShellTool)).PowerShellTool;
      return cached3;
    };
  })(), BLOCK_PATTERN = /```!\s*\n?([\s\S]*?)\n?```/g, INLINE_PATTERN = /(?<=^|\s)!`([^`]+)`/gm;
});
