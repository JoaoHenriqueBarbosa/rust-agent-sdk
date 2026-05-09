// function: execIntoTmuxWorktree
async function execIntoTmuxWorktree(args) {
  if (process.platform === "win32")
    return {
      handled: !1,
      error: "Error: --tmux is not supported on Windows"
    };
  if (spawnSync6("tmux", ["-V"], { encoding: "utf-8" }).status !== 0)
    return {
      handled: !1,
      error: `Error: tmux is not installed. ${process.platform === "darwin" ? "Install tmux with: brew install tmux" : "Install tmux with: sudo apt install tmux"}`
    };
  let worktreeName, forceClassicTmux = !1;
  for (let i5 = 0;i5 < args.length; i5++) {
    let arg = args[i5];
    if (!arg)
      continue;
    if (arg === "-w" || arg === "--worktree") {
      let next2 = args[i5 + 1];
      if (next2 && !next2.startsWith("-"))
        worktreeName = next2;
    } else if (arg.startsWith("--worktree="))
      worktreeName = arg.slice(11);
    else if (arg === "--tmux=classic")
      forceClassicTmux = !0;
  }
  let prNumber = null;
  if (worktreeName) {
    if (prNumber = parsePRReference(worktreeName), prNumber !== null)
      worktreeName = `pr-${prNumber}`;
  }
  if (!worktreeName) {
    let adjectives = ["swift", "bright", "calm", "keen", "bold"], nouns = ["fox", "owl", "elm", "oak", "ray"], adj = adjectives[Math.floor(Math.random() * adjectives.length)], noun = nouns[Math.floor(Math.random() * nouns.length)], suffix = Math.random().toString(36).slice(2, 6);
    worktreeName = `${adj}-${noun}-${suffix}`;
  }
  try {
    validateWorktreeSlug(worktreeName);
  } catch (e) {
    return {
      handled: !1,
      error: `Error: ${e.message}`
    };
  }
  let worktreeDir, repoName;
  if (hasWorktreeCreateHook()) {
    try {
      worktreeDir = (await executeWorktreeCreateHook(worktreeName)).worktreePath;
    } catch (error44) {
      return {
        handled: !1,
        error: `Error: ${errorMessage(error44)}`
      };
    }
    repoName = basename42(findCanonicalGitRoot(getCwd()) ?? getCwd()), console.log(`Using worktree via hook: ${worktreeDir}`);
  } else {
    let repoRoot = findCanonicalGitRoot(getCwd());
    if (!repoRoot)
      return {
        handled: !1,
        error: "Error: --worktree requires a git repository"
      };
    repoName = basename42(repoRoot), worktreeDir = worktreePathFor(repoRoot, worktreeName);
    try {
      let result = await getOrCreateWorktree(repoRoot, worktreeName, prNumber !== null ? { prNumber } : void 0);
      if (!result.existed)
        console.log(`Created worktree: ${worktreeDir} (based on ${result.baseBranch})`), await performPostCreationSetup(repoRoot, worktreeDir);
    } catch (error44) {
      return {
        handled: !1,
        error: `Error: ${errorMessage(error44)}`
      };
    }
  }
  let tmuxSessionName = `${repoName}_${worktreeBranchName(worktreeName)}`.replace(/[/.]/g, "_"), newArgs = [];
  for (let i5 = 0;i5 < args.length; i5++) {
    let arg = args[i5];
    if (!arg)
      continue;
    if (arg === "--tmux" || arg === "--tmux=classic")
      continue;
    if (arg === "-w" || arg === "--worktree") {
      let next2 = args[i5 + 1];
      if (next2 && !next2.startsWith("-"))
        i5++;
      continue;
    }
    if (arg.startsWith("--worktree="))
      continue;
    newArgs.push(arg);
  }
  let tmuxPrefix = "C-b", prefixResult = spawnSync6("tmux", ["show-options", "-g", "prefix"], {
    encoding: "utf-8"
  });
  if (prefixResult.status === 0 && prefixResult.stdout) {
    let match = prefixResult.stdout.match(/prefix\s+(\S+)/);
    if (match?.[1])
      tmuxPrefix = match[1];
  }
  let prefixConflicts = [
    "C-b",
    "C-c",
    "C-d",
    "C-t",
    "C-o",
    "C-r",
    "C-s",
    "C-g",
    "C-e"
  ].includes(tmuxPrefix), tmuxEnv = {
    ...process.env,
    CLAUDE_CODE_TMUX_SESSION: tmuxSessionName,
    CLAUDE_CODE_TMUX_PREFIX: tmuxPrefix,
    CLAUDE_CODE_TMUX_PREFIX_CONFLICTS: prefixConflicts ? "1" : ""
  }, sessionExists = spawnSync6("tmux", ["has-session", "-t", tmuxSessionName], { encoding: "utf-8" }).status === 0, isAlreadyInTmux = Boolean(process.env.TMUX), useControlMode = isInITerm2() && !forceClassicTmux && !isAlreadyInTmux, tmuxGlobalArgs = useControlMode ? ["-CC"] : [];
  if (useControlMode && !sessionExists) {
    let y2 = source_default.yellow;
    console.log(`
${y2("\u256D\u2500 iTerm2 Tip \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E")}
${y2("\u2502")} To open as a tab instead of a new window:                           ${y2("\u2502")}
${y2("\u2502")} iTerm2 > Settings > General > tmux > "Tabs in attaching window"     ${y2("\u2502")}
${y2("\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F")}
`);
  }
  if (!1)
    if (spawnSync6("tmux", [
      "new-session",
      "-d",
      "-s",
      tmuxSessionName,
      "-c",
      worktreeDir,
      "--",
      process.execPath,
      ...newArgs
    ], { cwd: worktreeDir, env: tmuxEnv }), spawnSync6("tmux", ["split-window", "-h", "-t", tmuxSessionName, "-c", worktreeDir], { cwd: worktreeDir }), spawnSync6("tmux", ["send-keys", "-t", tmuxSessionName, "bun run watch", "Enter"], { cwd: worktreeDir }), spawnSync6("tmux", ["split-window", "-v", "-t", tmuxSessionName, "-c", worktreeDir], { cwd: worktreeDir }), spawnSync6("tmux", ["send-keys", "-t", tmuxSessionName, "bun run start"], {
      cwd: worktreeDir
    }), spawnSync6("tmux", ["select-pane", "-t", `${tmuxSessionName}:0.0`], {
      cwd: worktreeDir
    }), isAlreadyInTmux)
      spawnSync6("tmux", ["switch-client", "-t", tmuxSessionName], {
        stdio: "inherit"
      });
    else
      spawnSync6("tmux", [...tmuxGlobalArgs, "attach-session", "-t", tmuxSessionName], {
        stdio: "inherit",
        cwd: worktreeDir
      });
  else if (isAlreadyInTmux)
    if (sessionExists)
      spawnSync6("tmux", ["switch-client", "-t", tmuxSessionName], {
        stdio: "inherit"
      });
    else
      spawnSync6("tmux", [
        "new-session",
        "-d",
        "-s",
        tmuxSessionName,
        "-c",
        worktreeDir,
        "--",
        process.execPath,
        ...newArgs
      ], { cwd: worktreeDir, env: tmuxEnv }), spawnSync6("tmux", ["switch-client", "-t", tmuxSessionName], {
        stdio: "inherit"
      });
  else {
    let tmuxArgs = [
      ...tmuxGlobalArgs,
      "new-session",
      "-A",
      "-s",
      tmuxSessionName,
      "-c",
      worktreeDir,
      "--",
      process.execPath,
      ...newArgs
    ];
    spawnSync6("tmux", tmuxArgs, {
      stdio: "inherit",
      cwd: worktreeDir,
      env: tmuxEnv
    });
  }
  return { handled: !0 };
}
