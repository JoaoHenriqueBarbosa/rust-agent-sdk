// function: parsePowerShellCommandImpl
async function parsePowerShellCommandImpl(command12) {
  let commandBytes = Buffer.byteLength(command12, "utf8");
  if (commandBytes > MAX_COMMAND_LENGTH2)
    return logForDebugging(`PowerShell parser: command too long (${commandBytes} bytes, max ${MAX_COMMAND_LENGTH2})`), makeInvalidResult(command12, `Command too long for parsing (${commandBytes} bytes). Maximum supported length is ${MAX_COMMAND_LENGTH2} bytes.`, "CommandTooLong");
  let pwshPath = await getCachedPowerShellPath();
  if (!pwshPath)
    return makeInvalidResult(command12, "PowerShell is not available", "NoPowerShell");
  let script = buildParseScript(command12), args = [
    "-NoProfile",
    "-NonInteractive",
    "-NoLogo",
    "-EncodedCommand",
    toUtf16LeBase64(script)
  ], parseTimeoutMs = getParseTimeoutMs(), stdout = "", stderr = "", code = null, timedOut = !1;
  for (let attempt = 0;attempt < 2; attempt++) {
    try {
      let result = await execa(pwshPath, args, {
        timeout: parseTimeoutMs,
        reject: !1
      });
      stdout = result.stdout, stderr = result.stderr, timedOut = result.timedOut, code = result.failed ? result.exitCode ?? 1 : 0;
    } catch (e) {
      return logForDebugging(`PowerShell parser: failed to spawn pwsh: ${e instanceof Error ? e.message : e}`), makeInvalidResult(command12, `Failed to spawn PowerShell: ${e instanceof Error ? e.message : e}`, "PwshSpawnError");
    }
    if (!timedOut)
      break;
    logForDebugging(`PowerShell parser: pwsh timed out after ${parseTimeoutMs}ms (attempt ${attempt + 1})`);
  }
  if (timedOut)
    return makeInvalidResult(command12, `pwsh timed out after ${parseTimeoutMs}ms (2 attempts)`, "PwshTimeout");
  if (code !== 0)
    return logForDebugging(`PowerShell parser: pwsh exited with code ${code}, stderr: ${stderr}`), makeInvalidResult(command12, `pwsh exited with code ${code}: ${stderr}`, "PwshError");
  let trimmed = stdout.trim();
  if (!trimmed)
    return logForDebugging("PowerShell parser: empty stdout from pwsh"), makeInvalidResult(command12, "No output from PowerShell parser", "EmptyOutput");
  try {
    let raw = jsonParse(trimmed);
    return transformRawOutput(raw);
  } catch {
    return logForDebugging(`PowerShell parser: invalid JSON output: ${trimmed.slice(0, 200)}`), makeInvalidResult(command12, "Invalid JSON from PowerShell parser", "InvalidJson");
  }
}
