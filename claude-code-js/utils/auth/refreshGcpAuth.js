// function: refreshGcpAuth
function refreshGcpAuth(gcpAuthRefresh) {
  logForDebugging("Running GCP auth refresh command");
  let authStatusManager = AwsAuthStatusManager.getInstance();
  return authStatusManager.startAuthentication(), new Promise((resolve9) => {
    let refreshProc = exec2(gcpAuthRefresh, {
      timeout: GCP_AUTH_REFRESH_TIMEOUT_MS
    });
    refreshProc.stdout.on("data", (data) => {
      let output = data.toString().trim();
      if (output)
        authStatusManager.addOutput(output), logForDebugging(output, { level: "debug" });
    }), refreshProc.stderr.on("data", (data) => {
      let error44 = data.toString().trim();
      if (error44)
        authStatusManager.setError(error44), logForDebugging(error44, { level: "error" });
    }), refreshProc.on("close", (code, signal) => {
      if (code === 0)
        logForDebugging("GCP auth refresh completed successfully"), authStatusManager.endAuthentication(!0), resolve9(!0);
      else {
        let message = signal === "SIGTERM" ? source_default.red("GCP auth refresh timed out after 3 minutes. Run your auth command manually in a separate terminal.") : source_default.red("Error running gcpAuthRefresh (in settings or ~/.claude.json):");
        console.error(message), authStatusManager.endAuthentication(!1), resolve9(!1);
      }
    });
  });
}
