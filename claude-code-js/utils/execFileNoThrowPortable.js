// Original: src/utils/execFileNoThrowPortable.ts
function execSyncWithDefaults_DEPRECATED(command, optionsOrAbortSignal, timeout = 10 * SECONDS_IN_MINUTE * MS_IN_SECOND) {
  let __stack = [];
  try {
    let options;
    if (optionsOrAbortSignal === void 0)
      options = {};
    else if (optionsOrAbortSignal instanceof AbortSignal)
      options = {
        abortSignal: optionsOrAbortSignal,
        timeout
      };
    else
      options = optionsOrAbortSignal;
    let {
      abortSignal,
      timeout: finalTimeout = 10 * SECONDS_IN_MINUTE * MS_IN_SECOND,
      input,
      stdio = ["ignore", "pipe", "pipe"]
    } = options;
    abortSignal?.throwIfAborted();
    const _ = __using(__stack, slowLogging`exec: ${command.slice(0, 200)}`, 0);
    try {
      let result = execaSync(command, {
        env: process.env,
        maxBuffer: 1e6,
        timeout: finalTimeout,
        cwd: getCwd(),
        stdio,
        shell: !0,
        reject: !1,
        input
      });
      if (!result.stdout)
        return null;
      return result.stdout.trim() || null;
    } catch {
      return null;
    }
  } catch (_catch3) {
    var _err = _catch3, _hasErr = 1;
  } finally {
    __callDispose(__stack, _err, _hasErr);
  }
}
var MS_IN_SECOND = 1000, SECONDS_IN_MINUTE = 60;
var init_execFileNoThrowPortable = __esm(() => {
  init_execa();
  init_cwd2();
  init_slowOperations();
});
