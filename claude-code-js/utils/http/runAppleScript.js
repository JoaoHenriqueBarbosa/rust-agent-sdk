// function: runAppleScript
async function runAppleScript(script, { humanReadableOutput = !0, signal } = {}) {
  if (process18.platform !== "darwin")
    throw Error("macOS only");
  let outputArguments = humanReadableOutput ? [] : ["-ss"], execOptions = {};
  if (signal)
    execOptions.signal = signal;
  let { stdout } = await execFileAsync3("osascript", ["-e", script, outputArguments], execOptions);
  return stdout.trim();
}
