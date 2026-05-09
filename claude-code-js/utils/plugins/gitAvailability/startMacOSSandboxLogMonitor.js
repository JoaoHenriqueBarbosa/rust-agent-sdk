// function: startMacOSSandboxLogMonitor
function startMacOSSandboxLogMonitor(callback, ignoreViolations) {
  let cmdExtractRegex = /CMD64_(.+?)_END/, sandboxExtractRegex = /Sandbox:\s+(.+)$/, wildcardPaths = ignoreViolations?.["*"] || [], commandPatterns = ignoreViolations ? Object.entries(ignoreViolations).filter(([pattern]) => pattern !== "*") : [], logProcess = spawn5("log", [
    "stream",
    "--predicate",
    `(eventMessage ENDSWITH "${sessionSuffix}")`,
    "--style",
    "compact"
  ]);
  return logProcess.stdout?.on("data", (data) => {
    let lines = data.toString().split(`
`), violationLine = lines.find((line) => line.includes("Sandbox:") && line.includes("deny")), commandLine = lines.find((line) => line.startsWith("CMD64_"));
    if (!violationLine)
      return;
    let sandboxMatch = violationLine.match(sandboxExtractRegex);
    if (!sandboxMatch?.[1])
      return;
    let violationDetails = sandboxMatch[1], command12, encodedCommand;
    if (commandLine) {
      if (encodedCommand = commandLine.match(cmdExtractRegex)?.[1], encodedCommand)
        try {
          command12 = decodeSandboxedCommand(encodedCommand);
        } catch {}
    }
    if (violationDetails.includes("mDNSResponder") || violationDetails.includes("mach-lookup com.apple.diagnosticd") || violationDetails.includes("mach-lookup com.apple.analyticsd"))
      return;
    if (ignoreViolations && command12) {
      if (wildcardPaths.length > 0) {
        if (wildcardPaths.some((path16) => violationDetails.includes(path16)))
          return;
      }
      for (let [pattern, paths2] of commandPatterns)
        if (command12.includes(pattern)) {
          if (paths2.some((path16) => violationDetails.includes(path16)))
            return;
        }
    }
    callback({
      line: violationDetails,
      command: command12,
      encodedCommand,
      timestamp: /* @__PURE__ */ new Date
    });
  }), logProcess.stderr?.on("data", (data) => {
    logForDebugging2(`[Sandbox Monitor] Log stream stderr: ${data.toString()}`);
  }), logProcess.on("error", (error44) => {
    logForDebugging2(`[Sandbox Monitor] Failed to start log stream: ${error44.message}`);
  }), logProcess.on("exit", (code) => {
    logForDebugging2(`[Sandbox Monitor] Log stream exited with code: ${code}`);
  }), () => {
    logForDebugging2("[Sandbox Monitor] Stopping log monitor"), logProcess.kill("SIGTERM");
  };
}
