// function: reset2
async function reset2() {
  if (cleanupBwrapMountPoints({ force: !0 }), logMonitorShutdown)
    logMonitorShutdown(), logMonitorShutdown = void 0;
  if (managerContext?.linuxBridge) {
    let { httpSocketPath, socksSocketPath, httpBridgeProcess, socksBridgeProcess } = managerContext.linuxBridge, exitPromises = [];
    if (httpBridgeProcess.pid && !httpBridgeProcess.killed)
      try {
        process.kill(httpBridgeProcess.pid, "SIGTERM"), logForDebugging2("Sent SIGTERM to HTTP bridge process"), exitPromises.push(new Promise((resolve17) => {
          httpBridgeProcess.once("exit", () => {
            logForDebugging2("HTTP bridge process exited"), resolve17();
          }), setTimeout(() => {
            if (!httpBridgeProcess.killed) {
              logForDebugging2("HTTP bridge did not exit, forcing SIGKILL", {
                level: "warn"
              });
              try {
                if (httpBridgeProcess.pid)
                  process.kill(httpBridgeProcess.pid, "SIGKILL");
              } catch {}
            }
            resolve17();
          }, 5000);
        }));
      } catch (err) {
        if (err.code !== "ESRCH")
          logForDebugging2(`Error killing HTTP bridge: ${err}`, {
            level: "error"
          });
      }
    if (socksBridgeProcess.pid && !socksBridgeProcess.killed)
      try {
        process.kill(socksBridgeProcess.pid, "SIGTERM"), logForDebugging2("Sent SIGTERM to SOCKS bridge process"), exitPromises.push(new Promise((resolve17) => {
          socksBridgeProcess.once("exit", () => {
            logForDebugging2("SOCKS bridge process exited"), resolve17();
          }), setTimeout(() => {
            if (!socksBridgeProcess.killed) {
              logForDebugging2("SOCKS bridge did not exit, forcing SIGKILL", {
                level: "warn"
              });
              try {
                if (socksBridgeProcess.pid)
                  process.kill(socksBridgeProcess.pid, "SIGKILL");
              } catch {}
            }
            resolve17();
          }, 5000);
        }));
      } catch (err) {
        if (err.code !== "ESRCH")
          logForDebugging2(`Error killing SOCKS bridge: ${err}`, {
            level: "error"
          });
      }
    if (await Promise.all(exitPromises), httpSocketPath)
      try {
        fs13.rmSync(httpSocketPath, { force: !0 }), logForDebugging2("Cleaned up HTTP socket");
      } catch (err) {
        logForDebugging2(`HTTP socket cleanup error: ${err}`, {
          level: "error"
        });
      }
    if (socksSocketPath)
      try {
        fs13.rmSync(socksSocketPath, { force: !0 }), logForDebugging2("Cleaned up SOCKS socket");
      } catch (err) {
        logForDebugging2(`SOCKS socket cleanup error: ${err}`, {
          level: "error"
        });
      }
  }
  let closePromises = [];
  if (httpProxyServer) {
    let server = httpProxyServer, httpClose = new Promise((resolve17) => {
      server.close((error44) => {
        if (error44 && error44.message !== "Server is not running.")
          logForDebugging2(`Error closing HTTP proxy server: ${error44.message}`, {
            level: "error"
          });
        resolve17();
      });
    });
    closePromises.push(httpClose);
  }
  if (socksProxyServer) {
    let socksClose = socksProxyServer.close().catch((error44) => {
      logForDebugging2(`Error closing SOCKS proxy server: ${error44.message}`, {
        level: "error"
      });
    });
    closePromises.push(socksClose);
  }
  await Promise.all(closePromises), httpProxyServer = void 0, socksProxyServer = void 0, managerContext = void 0, initializationPromise = void 0, parentProxy = void 0;
}
