// Original: src/utils/plugins/marketplaceHelpers.ts
function formatFailureDetails(failures, includeReasons) {
  let details = failures.slice(0, 2).map((f) => {
    let reason = f.reason || f.error || "unknown error";
    return includeReasons ? `${f.name} (${reason})` : f.name;
  }).join(includeReasons ? "; " : ", "), remaining = failures.length - 2, moreText = remaining > 0 ? ` and ${remaining} more` : "";
  return `${details}${moreText}`;
}
function getMarketplaceSourceDisplay(source) {
  switch (source.source) {
    case "github":
      return source.repo;
    case "url":
      return source.url;
    case "git":
      return source.url;
    case "directory":
      return source.path;
    case "file":
      return source.path;
    case "settings":
      return `settings:${source.name}`;
    default:
      return "Unknown source";
  }
}
function createPluginId(pluginName, marketplaceName) {
  return `${pluginName}@${marketplaceName}`;
}
async function loadMarketplacesWithGracefulDegradation(config10) {
  let marketplaces = [], failures = [];
  for (let [name3, marketplaceConfig] of Object.entries(config10)) {
    if (!isSourceAllowedByPolicy(marketplaceConfig.source))
      continue;
    let data = null;
    try {
      data = await getMarketplace(name3);
    } catch (err2) {
      let errorMessage3 = err2 instanceof Error ? err2.message : String(err2);
      failures.push({ name: name3, error: errorMessage3 }), logError2(toError(err2));
    }
    marketplaces.push({
      name: name3,
      config: marketplaceConfig,
      data
    });
  }
  return { marketplaces, failures };
}
function formatMarketplaceLoadingErrors(failures, successCount) {
  if (failures.length === 0)
    return null;
  if (successCount > 0)
    return { type: "warning", message: failures.length === 1 ? `Warning: Failed to load marketplace '${failures[0].name}': ${failures[0].error}` : `Warning: Failed to load ${failures.length} marketplaces: ${formatFailureNames(failures)}` };
  return {
    type: "error",
    message: `Failed to load all marketplaces. Errors: ${formatFailureErrors(failures)}`
  };
}
function formatFailureNames(failures) {
  return failures.map((f) => f.name).join(", ");
}
function formatFailureErrors(failures) {
  return failures.map((f) => `${f.name}: ${f.error}`).join("; ");
}
function getStrictKnownMarketplaces() {
  let policySettings = getSettingsForSource("policySettings");
  if (!policySettings?.strictKnownMarketplaces)
    return null;
  return policySettings.strictKnownMarketplaces;
}
function getBlockedMarketplaces() {
  let policySettings = getSettingsForSource("policySettings");
  if (!policySettings?.blockedMarketplaces)
    return null;
  return policySettings.blockedMarketplaces;
}
function getPluginTrustMessage() {
  return getSettingsForSource("policySettings")?.pluginTrustMessage;
}
function areSourcesEqual(a2, b) {
  if (a2.source !== b.source)
    return !1;
  switch (a2.source) {
    case "url":
      return a2.url === b.url;
    case "github":
      return a2.repo === b.repo && (a2.ref || void 0) === (b.ref || void 0) && (a2.path || void 0) === (b.path || void 0);
    case "git":
      return a2.url === b.url && (a2.ref || void 0) === (b.ref || void 0) && (a2.path || void 0) === (b.path || void 0);
    case "npm":
      return a2.package === b.package;
    case "file":
      return a2.path === b.path;
    case "directory":
      return a2.path === b.path;
    case "settings":
      return a2.name === b.name && isEqual_default(a2.plugins, b.plugins);
    default:
      return !1;
  }
}
function extractHostFromSource(source) {
  switch (source.source) {
    case "github":
      return "github.com";
    case "git": {
      let sshMatch = source.url.match(/^[^@]+@([^:]+):/);
      if (sshMatch?.[1])
        return sshMatch[1];
      try {
        return new URL(source.url).hostname;
      } catch {
        return null;
      }
    }
    case "url":
      try {
        return new URL(source.url).hostname;
      } catch {
        return null;
      }
    default:
      return null;
  }
}
function doesSourceMatchHostPattern(source, pattern) {
  let host = extractHostFromSource(source);
  if (!host)
    return !1;
  try {
    return new RegExp(pattern.hostPattern).test(host);
  } catch {
    return logError2(Error(`Invalid hostPattern regex: ${pattern.hostPattern}`)), !1;
  }
}
function doesSourceMatchPathPattern(source, pattern) {
  if (source.source !== "file" && source.source !== "directory")
    return !1;
  try {
    return new RegExp(pattern.pathPattern).test(source.path);
  } catch {
    return logError2(Error(`Invalid pathPattern regex: ${pattern.pathPattern}`)), !1;
  }
}
function getHostPatternsFromAllowlist() {
  let allowlist = getStrictKnownMarketplaces();
  if (!allowlist)
    return [];
  return allowlist.filter((entry) => entry.source === "hostPattern").map((entry) => entry.hostPattern);
}
function extractGitHubRepoFromGitUrl(url3) {
  let sshMatch = url3.match(/^git@github\.com:([^/]+\/[^/]+?)(?:\.git)?$/);
  if (sshMatch && sshMatch[1])
    return sshMatch[1];
  let httpsMatch = url3.match(/^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\.git)?$/);
  if (httpsMatch && httpsMatch[1])
    return httpsMatch[1];
  return null;
}
function blockedConstraintMatches(blockedValue, sourceValue) {
  if (!blockedValue)
    return !0;
  return (blockedValue || void 0) === (sourceValue || void 0);
}
function areSourcesEquivalentForBlocklist(source, blocked) {
  if (source.source === blocked.source)
    switch (source.source) {
      case "github": {
        let b = blocked;
        if (source.repo !== b.repo)
          return !1;
        return blockedConstraintMatches(b.ref, source.ref) && blockedConstraintMatches(b.path, source.path);
      }
      case "git": {
        let b = blocked;
        if (source.url !== b.url)
          return !1;
        return blockedConstraintMatches(b.ref, source.ref) && blockedConstraintMatches(b.path, source.path);
      }
      case "url":
        return source.url === blocked.url;
      case "npm":
        return source.package === blocked.package;
      case "file":
        return source.path === blocked.path;
      case "directory":
        return source.path === blocked.path;
      case "settings":
        return source.name === blocked.name;
      default:
        return !1;
    }
  if (source.source === "git" && blocked.source === "github") {
    if (extractGitHubRepoFromGitUrl(source.url) === blocked.repo)
      return blockedConstraintMatches(blocked.ref, source.ref) && blockedConstraintMatches(blocked.path, source.path);
  }
  if (source.source === "github" && blocked.source === "git") {
    if (extractGitHubRepoFromGitUrl(blocked.url) === source.repo)
      return blockedConstraintMatches(blocked.ref, source.ref) && blockedConstraintMatches(blocked.path, source.path);
  }
  return !1;
}
function isSourceInBlocklist(source) {
  let blocklist = getBlockedMarketplaces();
  if (blocklist === null)
    return !1;
  return blocklist.some((blocked) => areSourcesEquivalentForBlocklist(source, blocked));
}
function isSourceAllowedByPolicy(source) {
  if (isSourceInBlocklist(source))
    return !1;
  let allowlist = getStrictKnownMarketplaces();
  if (allowlist === null)
    return !0;
  return allowlist.some((allowed) => {
    if (allowed.source === "hostPattern")
      return doesSourceMatchHostPattern(source, allowed);
    if (allowed.source === "pathPattern")
      return doesSourceMatchPathPattern(source, allowed);
    return areSourcesEqual(source, allowed);
  });
}
function formatSourceForDisplay(source) {
  switch (source.source) {
    case "github":
      return `github:${source.repo}${source.ref ? `@${source.ref}` : ""}`;
    case "url":
      return source.url;
    case "git":
      return `git:${source.url}${source.ref ? `@${source.ref}` : ""}`;
    case "npm":
      return `npm:${source.package}`;
    case "file":
      return `file:${source.path}`;
    case "directory":
      return `dir:${source.path}`;
    case "hostPattern":
      return `hostPattern:${source.hostPattern}`;
    case "pathPattern":
      return `pathPattern:${source.pathPattern}`;
    case "settings":
      return `settings:${source.name} (${source.plugins.length} ${plural(source.plugins.length, "plugin")})`;
    default:
      return "unknown source";
  }
}
async function detectEmptyMarketplaceReason({
  configuredMarketplaceCount,
  failedMarketplaceCount
}) {
  if (!await checkGitAvailable())
    return "git-not-installed";
  let allowlist = getStrictKnownMarketplaces();
  if (allowlist !== null) {
    if (allowlist.length === 0)
      return "all-blocked-by-policy";
    if (configuredMarketplaceCount === 0)
      return "policy-restricts-sources";
  }
  if (configuredMarketplaceCount === 0)
    return "no-marketplaces-configured";
  if (failedMarketplaceCount > 0 && failedMarketplaceCount === configuredMarketplaceCount)
    return "all-marketplaces-failed";
  return "all-plugins-installed";
}
var init_marketplaceHelpers = __esm(() => {
  init_isEqual();
  init_errors();
  init_log3();
  init_settings2();
  init_gitAvailability();
  init_marketplaceManager();
});
