// Original: src/utils/ripgrep.ts
import { execFile as execFile8, spawn as spawn2 } from "child_process";
import { existsSync as existsSync3 } from "fs";
import { homedir as homedir12 } from "os";
import * as path12 from "path";
import { fileURLToPath as fileURLToPath4 } from "url";
function ripgrepCommand() {
  let config8 = getRipgrepConfig();
  return {
    rgPath: config8.command,
    rgArgs: config8.args,
    argv0: config8.argv0
  };
}
function isEagainError(stderr) {
  return stderr.includes("os error 11") || stderr.includes("Resource temporarily unavailable");
}
function ripGrepRaw(args, target, abortSignal, callback, singleThread = !1) {
  let { rgPath, rgArgs, argv0 } = ripgrepCommand(), threadArgs = singleThread ? ["-j", "1"] : [], fullArgs = [...rgArgs, ...threadArgs, ...args, target], defaultTimeout = getPlatform() === "wsl" ? 60000 : 20000, parsedSeconds = parseInt(process.env.CLAUDE_CODE_GLOB_TIMEOUT_SECONDS || "", 10) || 0, timeout = parsedSeconds > 0 ? parsedSeconds * 1000 : defaultTimeout;
  if (argv0) {
    let child = spawn2(rgPath, fullArgs, {
      argv0,
      signal: abortSignal,
      windowsHide: !0
    }), stdout = "", stderr = "", stdoutTruncated = !1, stderrTruncated = !1;
    child.stdout?.on("data", (data) => {
      if (!stdoutTruncated) {
        if (stdout += data.toString(), stdout.length > MAX_BUFFER_SIZE)
          stdout = stdout.slice(0, MAX_BUFFER_SIZE), stdoutTruncated = !0;
      }
    }), child.stderr?.on("data", (data) => {
      if (!stderrTruncated) {
        if (stderr += data.toString(), stderr.length > MAX_BUFFER_SIZE)
          stderr = stderr.slice(0, MAX_BUFFER_SIZE), stderrTruncated = !0;
      }
    });
    let killTimeoutId, timeoutId = setTimeout(() => {
      if (process.platform === "win32")
        child.kill();
      else
        child.kill("SIGTERM"), killTimeoutId = setTimeout((c3) => c3.kill("SIGKILL"), 5000, child);
    }, timeout), settled = !1;
    return child.on("close", (code, signal) => {
      if (settled)
        return;
      if (settled = !0, clearTimeout(timeoutId), clearTimeout(killTimeoutId), code === 0 || code === 1)
        callback(null, stdout, stderr);
      else {
        let error44 = Error(`ripgrep exited with code ${code}`);
        error44.code = code ?? void 0, error44.signal = signal ?? void 0, callback(error44, stdout, stderr);
      }
    }), child.on("error", (err) => {
      if (settled)
        return;
      settled = !0, clearTimeout(timeoutId), clearTimeout(killTimeoutId), callback(err, stdout, stderr);
    }), child;
  }
  return execFile8(rgPath, fullArgs, {
    maxBuffer: MAX_BUFFER_SIZE,
    signal: abortSignal,
    timeout,
    killSignal: process.platform === "win32" ? void 0 : "SIGKILL"
  }, callback);
}
async function ripGrepFileCount(args, target, abortSignal) {
  await codesignRipgrepIfNecessary();
  let { rgPath, rgArgs, argv0 } = ripgrepCommand();
  return new Promise((resolve14, reject) => {
    let child = spawn2(rgPath, [...rgArgs, ...args, target], {
      argv0,
      signal: abortSignal,
      windowsHide: !0,
      stdio: ["ignore", "pipe", "ignore"]
    }), lines = 0;
    child.stdout?.on("data", (chunk) => {
      lines += countCharInString(chunk, `
`);
    });
    let settled = !1;
    child.on("close", (code) => {
      if (settled)
        return;
      if (settled = !0, code === 0 || code === 1)
        resolve14(lines);
      else
        reject(Error(`rg --files exited ${code}`));
    }), child.on("error", (err) => {
      if (settled)
        return;
      settled = !0, reject(err);
    });
  });
}
async function ripGrep(args, target, abortSignal) {
  return await codesignRipgrepIfNecessary(), testRipgrepOnFirstUse().catch((error44) => {
    logError2(error44);
  }), new Promise((resolve14, reject) => {
    let handleResult2 = (error44, stdout, stderr, isRetry) => {
      if (!error44) {
        resolve14(stdout.trim().split(`
`).map((line) => line.replace(/\r$/, "")).filter(Boolean));
        return;
      }
      if (error44.code === 1) {
        resolve14([]);
        return;
      }
      if (["ENOENT", "EACCES", "EPERM"].includes(error44.code)) {
        reject(error44);
        return;
      }
      if (!isRetry && isEagainError(stderr)) {
        logForDebugging("rg EAGAIN error detected, retrying with single-threaded mode (-j 1)"), logEvent("tengu_ripgrep_eagain_retry", {}), ripGrepRaw(args, target, abortSignal, (retryError, retryStdout, retryStderr) => {
          handleResult2(retryError, retryStdout, retryStderr, !0);
        }, !0);
        return;
      }
      let hasOutput = stdout && stdout.trim().length > 0, isTimeout = error44.signal === "SIGTERM" || error44.signal === "SIGKILL" || error44.code === "ABORT_ERR", isBufferOverflow = error44.code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER", lines = [];
      if (hasOutput) {
        if (lines = stdout.trim().split(`
`).map((line) => line.replace(/\r$/, "")).filter(Boolean), lines.length > 0 && (isTimeout || isBufferOverflow))
          lines = lines.slice(0, -1);
      }
      if (logForDebugging(`rg error (signal=${error44.signal}, code=${error44.code}, stderr: ${stderr}), ${lines.length} results`), error44.code !== 2 && error44.code !== "ABORT_ERR")
        logError2(error44);
      if (isTimeout && lines.length === 0) {
        reject(new RipgrepTimeoutError(`Ripgrep search timed out after ${getPlatform() === "wsl" ? 60 : 20} seconds. The search may have matched files but did not complete in time. Try searching a more specific path or pattern.`, lines));
        return;
      }
      resolve14(lines);
    };
    ripGrepRaw(args, target, abortSignal, (error44, stdout, stderr) => {
      handleResult2(error44, stdout, stderr, !1);
    });
  });
}
function getRipgrepStatus() {
  let config8 = getRipgrepConfig();
  return {
    mode: config8.mode,
    path: config8.command,
    working: ripgrepStatus?.working ?? null
  };
}
async function codesignRipgrepIfNecessary() {
  if (process.platform !== "darwin" || alreadyDoneSignCheck)
    return;
  alreadyDoneSignCheck = !0;
  let config8 = getRipgrepConfig();
  if (config8.mode !== "builtin")
    return;
  let builtinPath = config8.command;
  if (!(await execFileNoThrow("codesign", ["-vv", "-d", builtinPath], {
    preserveOutputOnError: !1
  })).stdout.split(`
`).find((line) => line.includes("linker-signed")))
    return;
  try {
    let signResult = await execFileNoThrow("codesign", [
      "--sign",
      "-",
      "--force",
      "--preserve-metadata=entitlements,requirements,flags,runtime",
      builtinPath
    ]);
    if (signResult.code !== 0)
      logError2(Error(`Failed to sign ripgrep: ${signResult.stdout} ${signResult.stderr}`));
    let quarantineResult = await execFileNoThrow("xattr", [
      "-d",
      "com.apple.quarantine",
      builtinPath
    ]);
    if (quarantineResult.code !== 0)
      logError2(Error(`Failed to remove quarantine: ${quarantineResult.stdout} ${quarantineResult.stderr}`));
  } catch (e) {
    logError2(e);
  }
}
var __filename2, __dirname3, getRipgrepConfig, MAX_BUFFER_SIZE = 20000000, RipgrepTimeoutError, countFilesRoundedRg, ripgrepStatus = null, testRipgrepOnFirstUse, alreadyDoneSignCheck = !1;
var init_ripgrep = __esm(() => {
  init_memoize();
  init_debug();
  init_envUtils();
  init_execFileNoThrow();
  init_findExecutable();
  init_log3();
  init_platform();
  __filename2 = fileURLToPath4(import.meta.url), __dirname3 = path12.join(__filename2, "../"), getRipgrepConfig = memoize_default(() => {
    if (isEnvDefinedFalsy(process.env.USE_BUILTIN_RIPGREP)) {
      let { cmd: systemPath } = findExecutable2("rg", []);
      if (systemPath !== "rg")
        return { mode: "system", command: "rg", args: [] };
    }
    if (isInBundledMode())
      return {
        mode: "embedded",
        command: process.execPath,
        args: ["--no-config"],
        argv0: "rg"
      };
    let rgRoot = path12.resolve(__dirname3, "vendor", "ripgrep"), command12 = process.platform === "win32" ? path12.resolve(rgRoot, `${process.arch}-win32`, "rg.exe") : path12.resolve(rgRoot, `${process.arch}-${process.platform}`, "rg");
    if (!existsSync3(command12)) {
      let { cmd: systemPath } = findExecutable2("rg", []);
      if (systemPath)
        return { mode: "system", command: "rg", args: [] };
    }
    return { mode: "builtin", command: command12, args: [] };
  });
  RipgrepTimeoutError = class RipgrepTimeoutError extends Error {
    partialResults;
    constructor(message, partialResults) {
      super(message);
      this.partialResults = partialResults;
      this.name = "RipgrepTimeoutError";
    }
  };
  countFilesRoundedRg = memoize_default(async (dirPath, abortSignal, ignorePatterns = []) => {
    if (path12.resolve(dirPath) === path12.resolve(homedir12()))
      return;
    try {
      let args = ["--files", "--hidden"];
      ignorePatterns.forEach((pattern) => {
        args.push("--glob", `!${pattern}`);
      });
      let count3 = await ripGrepFileCount(args, dirPath, abortSignal);
      if (count3 === 0)
        return 0;
      let magnitude = Math.floor(Math.log10(count3)), power = Math.pow(10, magnitude);
      return Math.round(count3 / power) * power;
    } catch (error44) {
      if (error44?.name !== "AbortError")
        logError2(error44);
    }
  }, (dirPath, _abortSignal, ignorePatterns = []) => `${dirPath}|${ignorePatterns.join(",")}`);
  testRipgrepOnFirstUse = memoize_default(async () => {
    if (ripgrepStatus !== null)
      return;
    let config8 = getRipgrepConfig();
    try {
      let test2;
      if (config8.argv0) {
        let proc = Bun.spawn([config8.command, "--version"], {
          argv0: config8.argv0,
          stderr: "ignore",
          stdout: "pipe"
        }), [stdout, code] = await Promise.all([
          proc.stdout.text(),
          proc.exited
        ]);
        test2 = {
          code,
          stdout
        };
      } else
        test2 = await execFileNoThrow(config8.command, [...config8.args, "--version"], {
          timeout: 5000
        });
      let working = test2.code === 0 && !!test2.stdout && test2.stdout.startsWith("ripgrep ");
      ripgrepStatus = {
        working,
        lastTested: Date.now(),
        config: config8
      }, logForDebugging(`Ripgrep first use test: ${working ? "PASSED" : "FAILED"} (mode=${config8.mode}, path=${config8.command})`), logEvent("tengu_ripgrep_availability", {
        working: working ? 1 : 0,
        using_system: config8.mode === "system" ? 1 : 0
      });
    } catch (error44) {
      ripgrepStatus = {
        working: !1,
        lastTested: Date.now(),
        config: config8
      }, logError2(error44);
    }
  });
});
