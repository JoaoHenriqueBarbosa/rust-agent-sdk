// Original: src/utils/tmuxSocket.ts
import { posix as posix3 } from "path";
async function execTmux(args, opts) {
  if (getPlatform() === "windows") {
    let result2 = await execFileNoThrow("wsl", ["-e", TMUX_COMMAND2, ...args], {
      env: { ...process.env, WSL_UTF8: "1" },
      ...opts
    });
    return {
      stdout: result2.stdout || "",
      stderr: result2.stderr || "",
      code: result2.code || 0
    };
  }
  let result = await execFileNoThrow(TMUX_COMMAND2, args, opts);
  return {
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    code: result.code || 0
  };
}
function getClaudeSocketName() {
  if (!socketName)
    socketName = `${CLAUDE_SOCKET_PREFIX}-${process.pid}`;
  return socketName;
}
function setClaudeSocketInfo(path19, pid) {
  socketPath = path19, serverPid = pid;
}
function isSocketInitialized() {
  return socketPath !== null && serverPid !== null;
}
function getClaudeTmuxEnv() {
  if (!socketPath || serverPid === null)
    return null;
  return `${socketPath},${serverPid},0`;
}
async function checkTmuxAvailable() {
  if (!tmuxAvailabilityChecked) {
    if (tmuxAvailable = (getPlatform() === "windows" ? await execFileNoThrow("wsl", ["-e", TMUX_COMMAND2, "-V"], {
      env: { ...process.env, WSL_UTF8: "1" },
      useCwd: !1
    }) : await execFileNoThrow("which", [TMUX_COMMAND2], {
      useCwd: !1
    })).code === 0, !tmuxAvailable)
      logForDebugging("[Socket] tmux is not installed. The Tmux tool and Teammate tool will not be available.");
    tmuxAvailabilityChecked = !0;
  }
  return tmuxAvailable;
}
function markTmuxToolUsed() {
  tmuxToolUsed = !0;
}
async function ensureSocketInitialized() {
  if (isSocketInitialized())
    return;
  if (!await checkTmuxAvailable())
    return;
  if (isInitializing && initPromise) {
    try {
      await initPromise;
    } catch {}
    return;
  }
  isInitializing = !0, initPromise = doInitialize();
  try {
    await initPromise;
  } catch (error44) {
    let err2 = toError(error44);
    logError2(err2), logForDebugging(`[Socket] Failed to initialize tmux socket: ${err2.message}. Tmux isolation will be disabled.`);
  } finally {
    isInitializing = !1;
  }
}
async function killTmuxServer() {
  let socket = getClaudeSocketName();
  logForDebugging(`[Socket] Killing tmux server for socket: ${socket}`);
  let result = await execTmux(["-L", socket, "kill-server"]);
  if (result.code === 0)
    logForDebugging("[Socket] Successfully killed tmux server");
  else
    logForDebugging(`[Socket] Failed to kill tmux server (exit ${result.code}): ${result.stderr}`);
}
async function doInitialize() {
  let socket = getClaudeSocketName(), result = await execTmux([
    "-L",
    socket,
    "new-session",
    "-d",
    "-s",
    "base",
    "-e",
    "CLAUDE_CODE_SKIP_PROMPT_HISTORY=true",
    ...getPlatform() === "windows" ? ["-e", "WSL_INTEROP=/run/WSL/1_interop"] : []
  ]);
  if (result.code !== 0) {
    if ((await execTmux([
      "-L",
      socket,
      "has-session",
      "-t",
      "base"
    ])).code !== 0)
      throw Error(`Failed to create tmux session on socket ${socket}: ${result.stderr}`);
  }
  if (registerCleanup(killTmuxServer), await execTmux([
    "-L",
    socket,
    "set-environment",
    "-g",
    "CLAUDE_CODE_SKIP_PROMPT_HISTORY",
    "true"
  ]), getPlatform() === "windows")
    await execTmux([
      "-L",
      socket,
      "set-environment",
      "-g",
      "WSL_INTEROP",
      "/run/WSL/1_interop"
    ]);
  let infoResult = await execTmux([
    "-L",
    socket,
    "display-message",
    "-p",
    "#{socket_path},#{pid}"
  ]);
  if (infoResult.code === 0) {
    let [path19, pidStr] = infoResult.stdout.trim().split(",");
    if (path19 && pidStr) {
      let pid = parseInt(pidStr, 10);
      if (!isNaN(pid)) {
        setClaudeSocketInfo(path19, pid);
        return;
      }
    }
    logForDebugging(`[Socket] Failed to parse socket info from tmux output: "${infoResult.stdout.trim()}". Using fallback path.`);
  } else
    logForDebugging(`[Socket] Failed to get socket info via display-message (exit ${infoResult.code}): ${infoResult.stderr}. Using fallback path.`);
  let uid = process.getuid?.() ?? 0, baseTmpDir = process.env.TMPDIR || "/tmp", fallbackPath = posix3.join(baseTmpDir, `tmux-${uid}`, socket), pidResult = await execTmux([
    "-L",
    socket,
    "display-message",
    "-p",
    "#{pid}"
  ]);
  if (pidResult.code === 0) {
    let pid = parseInt(pidResult.stdout.trim(), 10);
    if (!isNaN(pid)) {
      logForDebugging(`[Socket] Using fallback socket path: ${fallbackPath} (server PID: ${pid})`), setClaudeSocketInfo(fallbackPath, pid);
      return;
    }
    logForDebugging(`[Socket] Failed to parse server PID from tmux output: "${pidResult.stdout.trim()}"`);
  } else
    logForDebugging(`[Socket] Failed to get server PID (exit ${pidResult.code}): ${pidResult.stderr}`);
  throw Error(`Failed to get socket info for ${socket}: primary="${infoResult.stderr}", fallback="${pidResult.stderr}"`);
}
var TMUX_COMMAND2 = "tmux", CLAUDE_SOCKET_PREFIX = "claude", socketName = null, socketPath = null, serverPid = null, isInitializing = !1, initPromise = null, tmuxAvailabilityChecked = !1, tmuxAvailable = !1, tmuxToolUsed = !1;
var init_tmuxSocket = __esm(() => {
  init_cleanupRegistry();
  init_debug();
  init_errors();
  init_execFileNoThrow();
  init_log3();
  init_platform();
});
