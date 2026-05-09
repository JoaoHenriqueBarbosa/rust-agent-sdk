// Original: src/utils/sessionIngressAuth.ts
function getTokenFromFileDescriptor() {
  let cachedToken = getSessionIngressToken();
  if (cachedToken !== void 0)
    return cachedToken;
  let fdEnv = process.env.CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR;
  if (!fdEnv) {
    let path16 = process.env.CLAUDE_SESSION_INGRESS_TOKEN_FILE ?? CCR_SESSION_INGRESS_TOKEN_PATH, fromFile = readTokenFromWellKnownFile(path16, "session ingress token");
    return setSessionIngressToken(fromFile), fromFile;
  }
  let fd2 = parseInt(fdEnv, 10);
  if (Number.isNaN(fd2))
    return logForDebugging(`CLAUDE_CODE_WEBSOCKET_AUTH_FILE_DESCRIPTOR must be a valid file descriptor number, got: ${fdEnv}`, { level: "error" }), setSessionIngressToken(null), null;
  try {
    let fsOps = getFsImplementation(), fdPath = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${fd2}` : `/proc/self/fd/${fd2}`, token = fsOps.readFileSync(fdPath, { encoding: "utf8" }).trim();
    if (!token)
      return logForDebugging("File descriptor contained empty token", {
        level: "error"
      }), setSessionIngressToken(null), null;
    return logForDebugging(`Successfully read token from file descriptor ${fd2}`), setSessionIngressToken(token), maybePersistTokenForSubprocesses(CCR_SESSION_INGRESS_TOKEN_PATH, token, "session ingress token"), token;
  } catch (error44) {
    logForDebugging(`Failed to read token from file descriptor ${fd2}: ${errorMessage(error44)}`, { level: "error" });
    let path16 = process.env.CLAUDE_SESSION_INGRESS_TOKEN_FILE ?? CCR_SESSION_INGRESS_TOKEN_PATH, fromFile = readTokenFromWellKnownFile(path16, "session ingress token");
    return setSessionIngressToken(fromFile), fromFile;
  }
}
function getSessionIngressAuthToken() {
  let envToken = process.env.CLAUDE_CODE_SESSION_ACCESS_TOKEN;
  if (envToken)
    return envToken;
  return getTokenFromFileDescriptor();
}
function getSessionIngressAuthHeaders() {
  let token = getSessionIngressAuthToken();
  if (!token)
    return {};
  if (token.startsWith("sk-ant-sid")) {
    let headers = {
      Cookie: `sessionKey=${token}`
    }, orgUuid = process.env.CLAUDE_CODE_ORGANIZATION_UUID;
    if (orgUuid)
      headers["X-Organization-Uuid"] = orgUuid;
    return headers;
  }
  return { Authorization: `Bearer ${token}` };
}
var init_sessionIngressAuth = __esm(() => {
  init_state();
  init_authFileDescriptor();
  init_debug();
  init_errors();
  init_fsOperations();
});
