// Original: src/utils/Shell.ts
import { execFileSync as execFileSync3, spawn as spawn8 } from "child_process";
import { constants as fsConstants6, readFileSync as readFileSync20, unlinkSync as unlinkSync3 } from "fs";
import { mkdir as mkdir18, open as open9, realpath as realpath8 } from "fs/promises";
import { isAbsolute as isAbsolute16, resolve as resolve29 } from "path";
import { join as posixJoin3 } from "path/posix";
import { accessSync as accessSync2 } from "fs";
function isExecutable(shellPath) {
  try {
    return accessSync2(shellPath, fsConstants6.X_OK), !0;
  } catch (_err) {
    try {
      return execFileSync3(shellPath, ["--version"], {
        timeout: 1000,
        stdio: "ignore"
      }), !0;
    } catch {
      return !1;
    }
  }
}
async function findSuitableShell() {
  let shellOverride = process.env.CLAUDE_CODE_SHELL;
  if (shellOverride)
    if ((shellOverride.includes("bash") || shellOverride.includes("zsh")) && isExecutable(shellOverride))
      return logForDebugging(`Using shell override: ${shellOverride}`), shellOverride;
    else
      logForDebugging(`CLAUDE_CODE_SHELL="${shellOverride}" is not a valid bash/zsh path, falling back to detection`);
  let env_shell = process.env.SHELL, isEnvShellSupported = env_shell && (env_shell.includes("bash") || env_shell.includes("zsh")), preferBash = env_shell?.includes("bash"), [zshPath, bashPath] = await Promise.all([which("zsh"), which("bash")]), shellPaths = ["/bin", "/usr/bin", "/usr/local/bin", "/opt/homebrew/bin"], supportedShells = (preferBash ? ["bash", "zsh"] : ["zsh", "bash"]).flatMap((shell) => shellPaths.map((path19) => `${path19}/${shell}`));
  if (preferBash) {
    if (bashPath)
      supportedShells.unshift(bashPath);
    if (zshPath)
      supportedShells.push(zshPath);
  } else {
    if (zshPath)
      supportedShells.unshift(zshPath);
    if (bashPath)
      supportedShells.push(bashPath);
  }
  if (isEnvShellSupported && isExecutable(env_shell))
    supportedShells.unshift(env_shell);
  let shellPath = supportedShells.find((shell) => shell && isExecutable(shell));
  if (!shellPath) {
    let errorMsg = "No suitable shell found. Claude CLI requires a Posix shell environment. Please ensure you have a valid shell installed and the SHELL environment variable set.";
    throw logError2(Error(errorMsg)), Error(errorMsg);
  }
  return shellPath;
}
async function getShellConfigImpl() {
  let binShell = await findSuitableShell();
  return { provider: await createBashShellProvider(binShell) };
}
async function exec4(command12, abortSignal, shellType, options2) {
  let {
    timeout,
    onProgress,
    preventCwdChanges,
    shouldUseSandbox,
    shouldAutoBackground,
    onStdout
  } = options2 ?? {}, commandTimeout = timeout || DEFAULT_TIMEOUT2, provider5 = await resolveProvider[shellType](), id = Math.floor(Math.random() * 65536).toString(16).padStart(4, "0"), sandboxTmpDir = posixJoin3(process.env.CLAUDE_CODE_TMPDIR || "/tmp", getClaudeTempDirName()), { commandString: builtCommand, cwdFilePath } = await provider5.buildExecCommand(command12, {
    id,
    sandboxTmpDir: shouldUseSandbox ? sandboxTmpDir : void 0,
    useSandbox: shouldUseSandbox ?? !1
  }), commandString = builtCommand, cwd2 = pwd();
  try {
    await realpath8(cwd2);
  } catch {
    let fallback = getOriginalCwd();
    logForDebugging(`Shell CWD "${cwd2}" no longer exists, recovering to "${fallback}"`);
    try {
      await realpath8(fallback), setCwdState(fallback), cwd2 = fallback;
    } catch {
      return createFailedCommand(`Working directory "${cwd2}" no longer exists. Please restart Claude from an existing directory.`);
    }
  }
  if (abortSignal.aborted)
    return createAbortedCommand();
  let binShell = provider5.shellPath, isSandboxedPowerShell = shouldUseSandbox && shellType === "powershell", sandboxBinShell = isSandboxedPowerShell ? "/bin/sh" : binShell;
  if (shouldUseSandbox) {
    commandString = await SandboxManager2.wrapWithSandbox(commandString, sandboxBinShell, void 0, abortSignal);
    try {
      await getFsImplementation().mkdir(sandboxTmpDir, { mode: 448 });
    } catch (error44) {
      logForDebugging(`Failed to create ${sandboxTmpDir} directory: ${error44}`);
    }
  }
  let spawnBinary = isSandboxedPowerShell ? "/bin/sh" : binShell, shellArgs = isSandboxedPowerShell ? ["-c", commandString] : provider5.getSpawnArgs(commandString), envOverrides = await provider5.getEnvironmentOverrides(command12), usePipeMode = !!onStdout, taskId = generateTaskId("local_bash"), taskOutput = new TaskOutput(taskId, onProgress ?? null, !usePipeMode);
  await mkdir18(getTaskOutputDir(), { recursive: !0 });
  let outputHandle;
  if (!usePipeMode) {
    let O_NOFOLLOW = fsConstants6.O_NOFOLLOW ?? 0;
    outputHandle = await open9(taskOutput.path, process.platform === "win32" ? "w" : fsConstants6.O_WRONLY | fsConstants6.O_CREAT | fsConstants6.O_APPEND | O_NOFOLLOW);
  }
  try {
    let childProcess3 = spawn8(spawnBinary, shellArgs, {
      env: {
        ...subprocessEnv(),
        SHELL: shellType === "bash" ? binShell : void 0,
        GIT_EDITOR: "true",
        CLAUDECODE: "1",
        ...envOverrides,
        ...{}
      },
      cwd: cwd2,
      stdio: usePipeMode ? ["pipe", "pipe", "pipe"] : ["pipe", outputHandle?.fd, outputHandle?.fd],
      detached: provider5.detached,
      windowsHide: !0
    }), shellCommand = wrapSpawn(childProcess3, abortSignal, commandTimeout, taskOutput, shouldAutoBackground);
    if (outputHandle !== void 0)
      try {
        await outputHandle.close();
      } catch {}
    if (childProcess3.stdout && onStdout)
      childProcess3.stdout.on("data", (chunk) => {
        onStdout(typeof chunk === "string" ? chunk : chunk.toString());
      });
    let nativeCwdFilePath = getPlatform() === "windows" ? posixPathToWindowsPath(cwdFilePath) : cwdFilePath;
    return shellCommand.result.then(async (result) => {
      if (shouldUseSandbox)
        SandboxManager2.cleanupAfterCommand();
      if (result && !preventCwdChanges && !result.backgroundTaskId)
        try {
          let newCwd = readFileSync20(nativeCwdFilePath, {
            encoding: "utf8"
          }).trim();
          if (getPlatform() === "windows")
            newCwd = posixPathToWindowsPath(newCwd);
          if (newCwd.normalize("NFC") !== cwd2)
            setCwd(newCwd, cwd2), invalidateSessionEnvCache(), onCwdChangedForHooks(cwd2, newCwd);
        } catch {
          logEvent("tengu_shell_set_cwd", { success: !1 });
        }
      try {
        unlinkSync3(nativeCwdFilePath);
      } catch {}
    }), shellCommand;
  } catch (error44) {
    if (outputHandle !== void 0)
      try {
        await outputHandle.close();
      } catch {}
    return taskOutput.clear(), logForDebugging(`Shell exec error: ${errorMessage(error44)}`), createAbortedCommand(void 0, {
      code: 126,
      stderr: errorMessage(error44)
    });
  }
}
function setCwd(path19, relativeTo) {
  let resolved = isAbsolute16(path19) ? path19 : resolve29(relativeTo || getFsImplementation().cwd(), path19), physicalPath;
  try {
    physicalPath = getFsImplementation().realpathSync(resolved);
  } catch (e) {
    if (isENOENT(e))
      throw Error(`Path "${resolved}" does not exist`);
    throw e;
  }
  setCwdState(physicalPath);
  try {
    logEvent("tengu_shell_set_cwd", {
      success: !0
    });
  } catch (_error) {}
}
var DEFAULT_TIMEOUT2 = 1800000, getShellConfig, getPsProvider, resolveProvider;
var init_Shell = __esm(() => {
  init_memoize();
  init_state();
  init_Task();
  init_cwd2();
  init_debug();
  init_errors();
  init_fsOperations();
  init_log3();
  init_ShellCommand();
  init_diskOutput();
  init_TaskOutput();
  init_which();
  init_fileChangedWatcher();
  init_filesystem();
  init_platform();
  init_sandbox_adapter();
  init_sessionEnvironment();
  init_bashProvider();
  init_powershellDetection();
  init_powershellProvider();
  init_subprocessEnv();
  init_windowsPaths();
  getShellConfig = memoize_default(getShellConfigImpl), getPsProvider = memoize_default(async () => {
    let psPath = await getCachedPowerShellPath();
    if (!psPath)
      throw Error("PowerShell is not available");
    return createPowerShellProvider(psPath);
  }), resolveProvider = {
    bash: async () => (await getShellConfig()).provider,
    powershell: getPsProvider
  };
});
