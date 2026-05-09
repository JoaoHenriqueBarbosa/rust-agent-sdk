// function: filterNetworkRequest
async function filterNetworkRequest(port, host, sandboxAskCallback) {
  if (!config8)
    return logForDebugging2("No config available, denying network request"), !1;
  if (!isValidHost(host))
    return logForDebugging2(`Denying malformed host: ${JSON.stringify(host)}:${port}`, {
      level: "error"
    }), !1;
  let canonicalHost = canonicalizeHost(host) ?? host;
  for (let deniedDomain of config8.network.deniedDomains)
    if (matchesDomainPattern(canonicalHost, deniedDomain))
      return logForDebugging2(`Denied by config rule: ${host}:${port}`), !1;
  for (let allowedDomain of config8.network.allowedDomains)
    if (matchesDomainPattern(canonicalHost, allowedDomain))
      return logForDebugging2(`Allowed by config rule: ${host}:${port}`), !0;
  if (!sandboxAskCallback)
    return logForDebugging2(`No matching config rule, denying: ${host}:${port}`), !1;
  logForDebugging2(`No matching config rule, asking user: ${host}:${port}`);
  try {
    if (await sandboxAskCallback({ host, port }))
      return logForDebugging2(`User allowed: ${host}:${port}`), !0;
    else
      return logForDebugging2(`User denied: ${host}:${port}`), !1;
  } catch (error44) {
    return logForDebugging2(`Error in permission callback: ${error44}`, {
      level: "error"
    }), !1;
  }
}
