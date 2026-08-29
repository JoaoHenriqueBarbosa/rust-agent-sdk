// function: main
async function main() {
  profileCheckpoint("main_function_start"), process.env.NoDefaultCurrentDirectoryInExePath = "1", initializeWarningHandler(), process.on("exit", () => {
    resetCursor();
  }), process.on("SIGINT", () => {
    if (process.argv.includes("-p") || process.argv.includes("--print"))
      return;
    process.exit(0);
  }), profileCheckpoint("main_warning_handler_initialized");
  let cliArgs = process.argv.slice(2), hasPrintFlag = cliArgs.includes("-p") || cliArgs.includes("--print"), hasInitOnlyFlag = cliArgs.includes("--init-only"), hasSdkUrl = cliArgs.some((arg) => arg.startsWith("--sdk-url")), isNonInteractive = hasPrintFlag || hasInitOnlyFlag || hasSdkUrl || !process.stdout.isTTY;
  if (isNonInteractive)
    stopCapturingEarlyInput();
  setIsInteractive(!isNonInteractive), initializeEntrypoint(isNonInteractive);
  let clientType = (() => {
    if (isEnvTruthy(process.env.GITHUB_ACTIONS))
      return "github-action";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-ts")
      return "sdk-typescript";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-py")
      return "sdk-python";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "sdk-cli")
      return "sdk-cli";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-vscode")
      return "claude-vscode";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "local-agent")
      return "local-agent";
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "claude-desktop")
      return "claude-desktop";
    let hasSessionIngressToken = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN || process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
    if (process.env.CLAUDE_CODE_ENTRYPOINT === "remote" || hasSessionIngressToken)
      return "remote";
    return "cli";
  })();
  setClientType(clientType);
  let previewFormat = process.env.CLAUDE_CODE_QUESTION_PREVIEW_FORMAT;
  if (previewFormat === "markdown" || previewFormat === "html")
    setQuestionPreviewFormat(previewFormat);
  else if (!clientType.startsWith("sdk-") && clientType !== "claude-desktop" && clientType !== "local-agent" && clientType !== "remote")
    setQuestionPreviewFormat("markdown");
  if (process.env.CLAUDE_CODE_ENVIRONMENT_KIND === "bridge")
    setSessionSource("remote-control");
  profileCheckpoint("main_client_type_determined"), eagerLoadSettings(), profileCheckpoint("main_before_run"), await run(), profileCheckpoint("main_after_run");
}
