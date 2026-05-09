// Original: src/utils/process.ts
var exports_process = {};
__export(exports_process, {
  writeToStdout: () => writeToStdout,
  writeToStderr: () => writeToStderr,
  registerProcessOutputErrorHandlers: () => registerProcessOutputErrorHandlers,
  peekForStdinData: () => peekForStdinData,
  exitWithError: () => exitWithError
});
function handleEPIPE(stream) {
  return (err) => {
    if (err.code === "EPIPE")
      stream.destroy();
  };
}
function registerProcessOutputErrorHandlers() {
  process.stdout.on("error", handleEPIPE(process.stdout)), process.stderr.on("error", handleEPIPE(process.stderr));
}
function writeOut(stream, data) {
  if (stream.destroyed)
    return;
  stream.write(data);
}
function writeToStdout(data) {
  writeOut(process.stdout, data);
}
function writeToStderr(data) {
  writeOut(process.stderr, data);
}
function exitWithError(message) {
  console.error(message), process.exit(1);
}
function peekForStdinData(stream, ms) {
  return new Promise((resolve2) => {
    let done = (timedOut) => {
      clearTimeout(peek), stream.off("end", onEnd), stream.off("data", onFirstData), resolve2(timedOut);
    }, onEnd = () => done(!1), onFirstData = () => clearTimeout(peek), peek = setTimeout(done, ms, !0);
    stream.once("end", onEnd), stream.once("data", onFirstData);
  });
}
