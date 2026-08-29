// function: initializeLinuxNetworkBridge
async function initializeLinuxNetworkBridge(httpProxyPort, socksProxyPort) {
  let socketId = randomBytes3(8).toString("hex"), httpSocketPath = join32(tmpdir2(), `claude-http-${socketId}.sock`), socksSocketPath = join32(tmpdir2(), `claude-socks-${socketId}.sock`), httpSocatArgs = [
    `UNIX-LISTEN:${httpSocketPath},fork,reuseaddr`,
    `TCP:localhost:${httpProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
  ];
  logForDebugging2(`Starting HTTP bridge: socat ${httpSocatArgs.join(" ")}`);
  let httpBridgeProcess = spawn4("socat", httpSocatArgs, {
    stdio: "ignore"
  });
  if (!httpBridgeProcess.pid)
    throw Error("Failed to start HTTP bridge process");
  httpBridgeProcess.on("error", (err) => {
    logForDebugging2(`HTTP bridge process error: ${err}`, { level: "error" });
  }), httpBridgeProcess.on("exit", (code, signal) => {
    logForDebugging2(`HTTP bridge process exited with code ${code}, signal ${signal}`, { level: code === 0 ? "info" : "error" });
  });
  let socksSocatArgs = [
    `UNIX-LISTEN:${socksSocketPath},fork,reuseaddr`,
    `TCP:localhost:${socksProxyPort},keepalive,keepidle=10,keepintvl=5,keepcnt=3`
  ];
  logForDebugging2(`Starting SOCKS bridge: socat ${socksSocatArgs.join(" ")}`);
  let socksBridgeProcess = spawn4("socat", socksSocatArgs, {
    stdio: "ignore"
  });
  if (!socksBridgeProcess.pid) {
    if (httpBridgeProcess.pid)
      try {
        process.kill(httpBridgeProcess.pid, "SIGTERM");
      } catch {}
    throw Error("Failed to start SOCKS bridge process");
  }
  socksBridgeProcess.on("error", (err) => {
    logForDebugging2(`SOCKS bridge process error: ${err}`, { level: "error" });
  }), socksBridgeProcess.on("exit", (code, signal) => {
    logForDebugging2(`SOCKS bridge process exited with code ${code}, signal ${signal}`, { level: code === 0 ? "info" : "error" });
  });
  let maxAttempts = 5;
  for (let i4 = 0;i4 < maxAttempts; i4++) {
    if (!httpBridgeProcess.pid || httpBridgeProcess.killed || !socksBridgeProcess.pid || socksBridgeProcess.killed)
      throw Error("Linux bridge process died unexpectedly");
    try {
      if (fs12.existsSync(httpSocketPath) && fs12.existsSync(socksSocketPath)) {
        logForDebugging2(`Linux bridges ready after ${i4 + 1} attempts`);
        break;
      }
    } catch (err) {
      logForDebugging2(`Error checking sockets (attempt ${i4 + 1}): ${err}`, {
        level: "error"
      });
    }
    if (i4 === maxAttempts - 1) {
      if (httpBridgeProcess.pid)
        try {
          process.kill(httpBridgeProcess.pid, "SIGTERM");
        } catch {}
      if (socksBridgeProcess.pid)
        try {
          process.kill(socksBridgeProcess.pid, "SIGTERM");
        } catch {}
      throw Error(`Failed to create bridge sockets after ${maxAttempts} attempts`);
    }
    await new Promise((resolve16) => setTimeout(resolve16, i4 * 100));
  }
  return {
    httpSocketPath,
    socksSocketPath,
    httpBridgeProcess,
    socksBridgeProcess,
    httpProxyPort,
    socksProxyPort
  };
}
