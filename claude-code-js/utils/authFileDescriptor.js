// Original: src/utils/authFileDescriptor.ts
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync2 } from "fs";
function maybePersistTokenForSubprocesses(path9, token, tokenName) {
  if (!isEnvTruthy(process.env.CLAUDE_CODE_REMOTE))
    return;
  try {
    mkdirSync2(CCR_TOKEN_DIR, { recursive: !0, mode: 448 }), writeFileSync2(path9, token, { encoding: "utf8", mode: 384 }), logForDebugging(`Persisted ${tokenName} to ${path9} for subprocess access`);
  } catch (error41) {
    logForDebugging(`Failed to persist ${tokenName} to disk (non-fatal): ${errorMessage(error41)}`, { level: "error" });
  }
}
function readTokenFromWellKnownFile(path9, tokenName) {
  try {
    let token = getFsImplementation().readFileSync(path9, { encoding: "utf8" }).trim();
    if (!token)
      return null;
    return logForDebugging(`Read ${tokenName} from well-known file ${path9}`), token;
  } catch (error41) {
    if (!isENOENT(error41))
      logForDebugging(`Failed to read ${tokenName} from ${path9}: ${errorMessage(error41)}`, { level: "debug" });
    return null;
  }
}
function getCredentialFromFd({
  envVar,
  wellKnownPath,
  label,
  getCached,
  setCached
}) {
  let cached2 = getCached();
  if (cached2 !== void 0)
    return cached2;
  let fdEnv = process.env[envVar];
  if (!fdEnv) {
    let fromFile = readTokenFromWellKnownFile(wellKnownPath, label);
    return setCached(fromFile), fromFile;
  }
  let fd = parseInt(fdEnv, 10);
  if (Number.isNaN(fd))
    return logForDebugging(`${envVar} must be a valid file descriptor number, got: ${fdEnv}`, { level: "error" }), setCached(null), null;
  try {
    let fsOps = getFsImplementation(), fdPath = process.platform === "darwin" || process.platform === "freebsd" ? `/dev/fd/${fd}` : `/proc/self/fd/${fd}`, token = fsOps.readFileSync(fdPath, { encoding: "utf8" }).trim();
    if (!token)
      return logForDebugging(`File descriptor contained empty ${label}`, {
        level: "error"
      }), setCached(null), null;
    return logForDebugging(`Successfully read ${label} from file descriptor ${fd}`), setCached(token), maybePersistTokenForSubprocesses(wellKnownPath, token, label), token;
  } catch (error41) {
    logForDebugging(`Failed to read ${label} from file descriptor ${fd}: ${errorMessage(error41)}`, { level: "error" });
    let fromFile = readTokenFromWellKnownFile(wellKnownPath, label);
    return setCached(fromFile), fromFile;
  }
}
function getOAuthTokenFromFileDescriptor() {
  return getCredentialFromFd({
    envVar: "CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR",
    wellKnownPath: CCR_OAUTH_TOKEN_PATH,
    label: "OAuth token",
    getCached: getOauthTokenFromFd,
    setCached: setOauthTokenFromFd
  });
}
function getApiKeyFromFileDescriptor() {
  return getCredentialFromFd({
    envVar: "CLAUDE_CODE_API_KEY_FILE_DESCRIPTOR",
    wellKnownPath: CCR_API_KEY_PATH,
    label: "API key",
    getCached: getApiKeyFromFd,
    setCached: setApiKeyFromFd
  });
}
var CCR_TOKEN_DIR = "/home/claude/.claude/remote", CCR_OAUTH_TOKEN_PATH, CCR_API_KEY_PATH, CCR_SESSION_INGRESS_TOKEN_PATH;
var init_authFileDescriptor = __esm(() => {
  init_state();
  init_debug();
  init_envUtils();
  init_errors();
  init_fsOperations();
  CCR_OAUTH_TOKEN_PATH = `${CCR_TOKEN_DIR}/.oauth_token`, CCR_API_KEY_PATH = `${CCR_TOKEN_DIR}/.api_key`, CCR_SESSION_INGRESS_TOKEN_PATH = `${CCR_TOKEN_DIR}/.session_ingress_token`;
});
