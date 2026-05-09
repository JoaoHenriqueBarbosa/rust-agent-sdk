// Original: src/entrypoints/cli.tsx
process.env.COREPACK_ENABLE_AUTO_PIN = "0";
if (process.env.CLAUDE_CODE_REMOTE === "true") {
  let existing = process.env.NODE_OPTIONS || "";
  process.env.NODE_OPTIONS = existing ? `${existing} --max-old-space-size=8192` : "--max-old-space-size=8192";
}
async function main2() {
  let args = process.argv.slice(2);
  if (args.length === 1 && (args[0] === "--version" || args[0] === "-v" || args[0] === "-V")) {
    console.log("2.1.90 (Claude Code)");
    return;
  }
  let {
    profileCheckpoint: profileCheckpoint2
  } = await Promise.resolve().then(() => (init_startupProfiler(), exports_startupProfiler));
  if (profileCheckpoint2("cli_entry"), process.argv[2] === "--claude-in-chrome-mcp") {
    profileCheckpoint2("cli_claude_in_chrome_mcp_path");
    let {
      runClaudeInChromeMcpServer: runClaudeInChromeMcpServer2
    } = await Promise.resolve().then(() => (init_mcpServer(), exports_mcpServer));
    await runClaudeInChromeMcpServer2();
    return;
  } else if (process.argv[2] === "--chrome-native-host") {
    profileCheckpoint2("cli_chrome_native_host_path");
    let {
      runChromeNativeHost: runChromeNativeHost2
    } = await Promise.resolve().then(() => (init_chromeNativeHost(), exports_chromeNativeHost));
    await runChromeNativeHost2();
    return;
  }
  if ((args.includes("--tmux") || args.includes("--tmux=classic")) && (args.includes("-w") || args.includes("--worktree") || args.some((a2) => a2.startsWith("--worktree=")))) {
    profileCheckpoint2("cli_tmux_worktree_fast_path");
    let {
      enableConfigs: enableConfigs2
    } = await Promise.resolve().then(() => (init_config4(), exports_config));
    enableConfigs2();
    let {
      isWorktreeModeEnabled: isWorktreeModeEnabled2
    } = await Promise.resolve().then(() => exports_worktreeModeEnabled);
    if (isWorktreeModeEnabled2()) {
      let {
        execIntoTmuxWorktree: execIntoTmuxWorktree2
      } = await Promise.resolve().then(() => (init_worktree(), exports_worktree)), result = await execIntoTmuxWorktree2(args);
      if (result.handled)
        return;
      if (result.error) {
        let {
          exitWithError: exitWithError3
        } = await Promise.resolve().then(() => exports_process);
        exitWithError3(result.error);
      }
    }
  }
  if (args.length === 1 && (args[0] === "--update" || args[0] === "--upgrade"))
    process.argv = [process.argv[0], process.argv[1], "update"];
  if (args.includes("--bare"))
    process.env.CLAUDE_CODE_SIMPLE = "1";
  let {
    startCapturingEarlyInput: startCapturingEarlyInput2
  } = await Promise.resolve().then(() => (init_earlyInput(), exports_earlyInput));
  startCapturingEarlyInput2(), profileCheckpoint2("cli_before_main_import");
  let {
    main: cliMain
  } = await Promise.resolve().then(() => (init_main3(), exports_main));
  profileCheckpoint2("cli_after_main_import"), await cliMain(), profileCheckpoint2("cli_after_main_complete");
}
main2();
