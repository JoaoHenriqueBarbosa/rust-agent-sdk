// Original: src/utils/ShellCommand.ts
import { stat as stat40 } from "fs/promises";
function prependStderr(prefix, stderr) {
  return stderr ? `${prefix} ${stderr}` : prefix;
}

class StreamWrapper {
  #stream;
  #isCleanedUp = !1;
  #taskOutput;
  #isStderr;
  #onData = this.#dataHandler.bind(this);
  constructor(stream10, taskOutput, isStderr) {
    this.#stream = stream10, this.#taskOutput = taskOutput, this.#isStderr = isStderr, stream10.setEncoding("utf-8"), stream10.on("data", this.#onData);
  }
  #dataHandler(data) {
    let str2 = typeof data === "string" ? data : data.toString();
    if (this.#isStderr)
      this.#taskOutput.writeStderr(str2);
    else
      this.#taskOutput.writeStdout(str2);
  }
  cleanup() {
    if (this.#isCleanedUp)
      return;
    this.#isCleanedUp = !0, this.#stream.removeListener("data", this.#onData), this.#stream = null, this.#taskOutput = null, this.#onData = () => {};
  }
}

class ShellCommandImpl {
  #status = "running";
  #backgroundTaskId;
  #stdoutWrapper;
  #stderrWrapper;
  #childProcess;
  #timeoutId = null;
  #sizeWatchdog = null;
  #killedForSize = !1;
  #maxOutputBytes;
  #abortSignal;
  #onTimeoutCallback;
  #timeout;
  #shouldAutoBackground;
  #resultResolver = null;
  #exitCodeResolver = null;
  #boundAbortHandler = null;
  taskOutput;
  static #handleTimeout(self2) {
    if (self2.#shouldAutoBackground && self2.#onTimeoutCallback)
      self2.#onTimeoutCallback(self2.background.bind(self2));
    else
      self2.#doKill(SIGTERM);
  }
  result;
  onTimeout;
  constructor(childProcess3, abortSignal, timeout, taskOutput, shouldAutoBackground = !1, maxOutputBytes = MAX_TASK_OUTPUT_BYTES) {
    if (this.#childProcess = childProcess3, this.#abortSignal = abortSignal, this.#timeout = timeout, this.#shouldAutoBackground = shouldAutoBackground, this.#maxOutputBytes = maxOutputBytes, this.taskOutput = taskOutput, this.#stderrWrapper = childProcess3.stderr ? new StreamWrapper(childProcess3.stderr, taskOutput, !0) : null, this.#stdoutWrapper = childProcess3.stdout ? new StreamWrapper(childProcess3.stdout, taskOutput, !1) : null, shouldAutoBackground)
      this.onTimeout = (callback) => {
        this.#onTimeoutCallback = callback;
      };
    this.result = this.#createResultPromise();
  }
  get status() {
    return this.#status;
  }
  #abortHandler() {
    if (this.#abortSignal.reason === "interrupt")
      return;
    this.kill();
  }
  #exitHandler(code, signal) {
    let exitCode = code !== null && code !== void 0 ? code : signal === "SIGTERM" ? 144 : 1;
    this.#resolveExitCode(exitCode);
  }
  #errorHandler() {
    this.#resolveExitCode(1);
  }
  #resolveExitCode(code) {
    if (this.#exitCodeResolver)
      this.#exitCodeResolver(code), this.#exitCodeResolver = null;
  }
  #cleanupListeners() {
    this.#clearSizeWatchdog();
    let timeoutId = this.#timeoutId;
    if (timeoutId)
      clearTimeout(timeoutId), this.#timeoutId = null;
    let boundAbortHandler = this.#boundAbortHandler;
    if (boundAbortHandler)
      this.#abortSignal.removeEventListener("abort", boundAbortHandler), this.#boundAbortHandler = null;
  }
  #clearSizeWatchdog() {
    if (this.#sizeWatchdog)
      clearInterval(this.#sizeWatchdog), this.#sizeWatchdog = null;
  }
  #startSizeWatchdog() {
    this.#sizeWatchdog = setInterval(() => {
      stat40(this.taskOutput.path).then((s2) => {
        if (s2.size > this.#maxOutputBytes && this.#status === "backgrounded" && this.#sizeWatchdog !== null)
          this.#killedForSize = !0, this.#clearSizeWatchdog(), this.#doKill(SIGKILL);
      }, () => {});
    }, SIZE_WATCHDOG_INTERVAL_MS), this.#sizeWatchdog.unref();
  }
  #createResultPromise() {
    this.#boundAbortHandler = this.#abortHandler.bind(this), this.#abortSignal.addEventListener("abort", this.#boundAbortHandler, {
      once: !0
    }), this.#childProcess.once("exit", this.#exitHandler.bind(this)), this.#childProcess.once("error", this.#errorHandler.bind(this)), this.#timeoutId = setTimeout(ShellCommandImpl.#handleTimeout, this.#timeout, this);
    let exitPromise = new Promise((resolve45) => {
      this.#exitCodeResolver = resolve45;
    });
    return new Promise((resolve45) => {
      this.#resultResolver = resolve45, exitPromise.then(this.#handleExit.bind(this));
    });
  }
  async#handleExit(code) {
    if (this.#cleanupListeners(), this.#status === "running" || this.#status === "backgrounded")
      this.#status = "completed";
    let stdout = await this.taskOutput.getStdout(), result = {
      code,
      stdout,
      stderr: this.taskOutput.getStderr(),
      interrupted: code === SIGKILL,
      backgroundTaskId: this.#backgroundTaskId
    };
    if (this.taskOutput.stdoutToFile && !this.#backgroundTaskId)
      if (this.taskOutput.outputFileRedundant)
        this.taskOutput.deleteOutputFile();
      else
        result.outputFilePath = this.taskOutput.path, result.outputFileSize = this.taskOutput.outputFileSize, result.outputTaskId = this.taskOutput.taskId;
    if (this.#killedForSize)
      result.stderr = prependStderr(`Background command killed: output file exceeded ${MAX_TASK_OUTPUT_BYTES_DISPLAY}`, result.stderr);
    else if (code === SIGTERM)
      result.stderr = prependStderr(`Command timed out after ${formatDuration(this.#timeout)}`, result.stderr);
    let resultResolver = this.#resultResolver;
    if (resultResolver)
      this.#resultResolver = null, resultResolver(result);
  }
  #doKill(code) {
    if (this.#status = "killed", this.#childProcess.pid)
      import_tree_kill.default(this.#childProcess.pid, "SIGKILL");
    this.#resolveExitCode(code ?? SIGKILL);
  }
  kill() {
    this.#doKill();
  }
  background(taskId) {
    if (this.#status === "running") {
      if (this.#backgroundTaskId = taskId, this.#status = "backgrounded", this.#cleanupListeners(), this.taskOutput.stdoutToFile)
        this.#startSizeWatchdog();
      else
        this.taskOutput.spillToDisk();
      return !0;
    }
    return !1;
  }
  cleanup() {
    this.#stdoutWrapper?.cleanup(), this.#stderrWrapper?.cleanup(), this.taskOutput.clear(), this.#cleanupListeners(), this.#childProcess = null, this.#abortSignal = null, this.#onTimeoutCallback = void 0;
  }
}
function wrapSpawn(childProcess3, abortSignal, timeout, taskOutput, shouldAutoBackground = !1, maxOutputBytes = MAX_TASK_OUTPUT_BYTES) {
  return new ShellCommandImpl(childProcess3, abortSignal, timeout, taskOutput, shouldAutoBackground, maxOutputBytes);
}

class AbortedShellCommand {
  status = "killed";
  result;
  taskOutput;
  constructor(opts) {
    this.taskOutput = new TaskOutput(generateTaskId("local_bash"), null), this.result = Promise.resolve({
      code: opts?.code ?? 145,
      stdout: "",
      stderr: opts?.stderr ?? "Command aborted before execution",
      interrupted: !0,
      backgroundTaskId: opts?.backgroundTaskId
    });
  }
  background() {
    return !1;
  }
  kill() {}
  cleanup() {}
}
function createAbortedCommand(backgroundTaskId, opts) {
  return new AbortedShellCommand({
    backgroundTaskId,
    ...opts
  });
}
function createFailedCommand(preSpawnError) {
  let taskOutput = new TaskOutput(generateTaskId("local_bash"), null);
  return {
    status: "completed",
    result: Promise.resolve({
      code: 1,
      stdout: "",
      stderr: preSpawnError,
      interrupted: !1,
      preSpawnError
    }),
    taskOutput,
    background() {
      return !1;
    },
    kill() {},
    cleanup() {}
  };
}
var import_tree_kill, SIGKILL = 137, SIGTERM = 143, SIZE_WATCHDOG_INTERVAL_MS = 5000;
var init_ShellCommand = __esm(() => {
  init_Task();
  init_format();
  init_diskOutput();
  init_TaskOutput();
  import_tree_kill = __toESM(require_tree_kill(), 1);
});
