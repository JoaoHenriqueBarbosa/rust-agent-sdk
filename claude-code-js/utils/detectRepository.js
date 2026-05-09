// Original: src/utils/detectRepository.ts
var exports_detectRepository = {};
__export(exports_detectRepository, {
  parseGitRemote: () => parseGitRemote,
  parseGitHubRepository: () => parseGitHubRepository,
  getCachedRepository: () => getCachedRepository,
  detectCurrentRepositoryWithHost: () => detectCurrentRepositoryWithHost,
  detectCurrentRepository: () => detectCurrentRepository,
  clearRepositoryCaches: () => clearRepositoryCaches
});
function clearRepositoryCaches() {
  repositoryWithHostCache.clear();
}
async function detectCurrentRepository() {
  let result = await detectCurrentRepositoryWithHost();
  if (!result)
    return null;
  if (result.host !== "github.com")
    return null;
  return `${result.owner}/${result.name}`;
}
async function detectCurrentRepositoryWithHost() {
  let cwd2 = getCwd();
  if (repositoryWithHostCache.has(cwd2))
    return repositoryWithHostCache.get(cwd2) ?? null;
  try {
    let remoteUrl = await getRemoteUrl();
    if (logForDebugging(`Git remote URL: ${remoteUrl}`), !remoteUrl)
      return logForDebugging("No git remote URL found"), repositoryWithHostCache.set(cwd2, null), null;
    let parsed = parseGitRemote(remoteUrl);
    return logForDebugging(`Parsed repository: ${parsed ? `${parsed.host}/${parsed.owner}/${parsed.name}` : null} from URL: ${remoteUrl}`), repositoryWithHostCache.set(cwd2, parsed), parsed;
  } catch (error41) {
    return logForDebugging(`Error detecting repository: ${error41}`), repositoryWithHostCache.set(cwd2, null), null;
  }
}
function getCachedRepository() {
  let parsed = repositoryWithHostCache.get(getCwd());
  if (!parsed || parsed.host !== "github.com")
    return null;
  return `${parsed.owner}/${parsed.name}`;
}
function parseGitRemote(input) {
  let trimmed = input.trim(), sshMatch = trimmed.match(/^git@([^:]+):([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (sshMatch?.[1] && sshMatch[2] && sshMatch[3]) {
    if (!looksLikeRealHostname(sshMatch[1]))
      return null;
    return {
      host: sshMatch[1],
      owner: sshMatch[2],
      name: sshMatch[3]
    };
  }
  let urlMatch = trimmed.match(/^(https?|ssh|git):\/\/(?:[^@]+@)?([^/:]+(?::\d+)?)\/([^/]+)\/([^/]+?)(?:\.git)?$/);
  if (urlMatch?.[1] && urlMatch[2] && urlMatch[3] && urlMatch[4]) {
    let protocol = urlMatch[1], hostWithPort = urlMatch[2], hostWithoutPort = hostWithPort.split(":")[0] ?? "";
    if (!looksLikeRealHostname(hostWithoutPort))
      return null;
    return {
      host: protocol === "https" || protocol === "http" ? hostWithPort : hostWithoutPort,
      owner: urlMatch[3],
      name: urlMatch[4]
    };
  }
  return null;
}
function parseGitHubRepository(input) {
  let trimmed = input.trim(), parsed = parseGitRemote(trimmed);
  if (parsed) {
    if (parsed.host !== "github.com")
      return null;
    return `${parsed.owner}/${parsed.name}`;
  }
  if (!trimmed.includes("://") && !trimmed.includes("@") && trimmed.includes("/")) {
    let parts = trimmed.split("/");
    if (parts.length === 2 && parts[0] && parts[1]) {
      let repo = parts[1].replace(/\.git$/, "");
      return `${parts[0]}/${repo}`;
    }
  }
  return logForDebugging(`Could not parse repository from: ${trimmed}`), null;
}
function looksLikeRealHostname(host) {
  if (!host.includes("."))
    return !1;
  let lastSegment = host.split(".").pop();
  if (!lastSegment)
    return !1;
  return /^[a-zA-Z]+$/.test(lastSegment);
}
var repositoryWithHostCache;
var init_detectRepository = __esm(() => {
  init_cwd2();
  init_debug();
  init_git();
  repositoryWithHostCache = /* @__PURE__ */ new Map;
});
