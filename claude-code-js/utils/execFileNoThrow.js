// Original: src/utils/execFileNoThrow.ts
function execFileNoThrow(file2, args, options = {
  timeout: 10 * SECONDS_IN_MINUTE2 * MS_IN_SECOND2,
  preserveOutputOnError: !0,
  useCwd: !0
}) {
  return execFileNoThrowWithCwd(file2, args, {
    abortSignal: options.abortSignal,
    timeout: options.timeout,
    preserveOutputOnError: options.preserveOutputOnError,
    cwd: options.useCwd ? getCwd() : void 0,
    env: options.env,
    stdin: options.stdin,
    input: options.input
  });
}
function getErrorMessage(result, errorCode) {
  if (result.shortMessage)
    return result.shortMessage;
  if (typeof result.signal === "string")
    return result.signal;
  return String(errorCode);
}
function execFileNoThrowWithCwd(file2, args, {
  abortSignal,
  timeout: finalTimeout = 10 * SECONDS_IN_MINUTE2 * MS_IN_SECOND2,
  preserveOutputOnError: finalPreserveOutput = !0,
  cwd: finalCwd,
  env: finalEnv,
  maxBuffer,
  shell,
  stdin: finalStdin,
  input: finalInput
} = {
  timeout: 10 * SECONDS_IN_MINUTE2 * MS_IN_SECOND2,
  preserveOutputOnError: !0,
  maxBuffer: 1e6
}) {
  return new Promise((resolve5) => {
    execa(file2, args, {
      maxBuffer,
      signal: abortSignal,
      timeout: finalTimeout,
      cwd: finalCwd,
      env: finalEnv,
      shell,
      stdin: finalStdin,
      input: finalInput,
      reject: !1
    }).then((result) => {
      if (result.failed)
        if (finalPreserveOutput) {
          let errorCode = result.exitCode ?? 1;
          resolve5({
            stdout: result.stdout || "",
            stderr: result.stderr || "",
            code: errorCode,
            error: getErrorMessage(result, errorCode)
          });
        } else
          resolve5({ stdout: "", stderr: "", code: result.exitCode ?? 1 });
      else
        resolve5({
          stdout: result.stdout,
          stderr: result.stderr,
          code: 0
        });
    }).catch((error41) => {
      logError2(error41), resolve5({ stdout: "", stderr: "", code: 1 });
    });
  });
}
var MS_IN_SECOND2 = 1000, SECONDS_IN_MINUTE2 = 60;
var init_execFileNoThrow = __esm(() => {
  init_execa();
  init_cwd2();
  init_log3();
  init_execFileNoThrowPortable();
});
