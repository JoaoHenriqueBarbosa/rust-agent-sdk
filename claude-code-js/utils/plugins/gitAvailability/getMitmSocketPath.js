// function: getMitmSocketPath
function getMitmSocketPath(host) {
  if (!config8?.network.mitmProxy)
    return;
  let { socketPath, domains } = config8.network.mitmProxy;
  for (let pattern of domains)
    if (matchesDomainPattern(host, pattern))
      return logForDebugging2(`Host ${host} matches MITM pattern ${pattern}`), socketPath;
  return;
}
