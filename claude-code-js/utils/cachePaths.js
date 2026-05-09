// Original: src/utils/cachePaths.ts
import { join as join5 } from "path";
function sanitizePath(name) {
  let sanitized = name.replace(/[^a-zA-Z0-9]/g, "-");
  if (sanitized.length <= MAX_SANITIZED_LENGTH)
    return sanitized;
  return `${sanitized.slice(0, MAX_SANITIZED_LENGTH)}-${Math.abs(djb2Hash(name)).toString(36)}`;
}
function getProjectDir(cwd2) {
  return sanitizePath(cwd2);
}
var paths, MAX_SANITIZED_LENGTH = 200, CACHE_PATHS;
var init_cachePaths = __esm(() => {
  init_env_paths();
  init_fsOperations();
  paths = envPaths("claude-cli");
  CACHE_PATHS = {
    baseLogs: () => join5(paths.cache, getProjectDir(getFsImplementation().cwd())),
    errors: () => join5(paths.cache, getProjectDir(getFsImplementation().cwd()), "errors"),
    messages: () => join5(paths.cache, getProjectDir(getFsImplementation().cwd()), "messages"),
    mcpLogs: (serverName) => join5(paths.cache, getProjectDir(getFsImplementation().cwd()), `mcp-logs-${sanitizePath(serverName)}`)
  };
});
