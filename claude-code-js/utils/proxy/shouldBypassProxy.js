// function: shouldBypassProxy
function shouldBypassProxy(urlString, noProxy = getNoProxy()) {
  if (!noProxy)
    return !1;
  if (noProxy === "*")
    return !0;
  try {
    let url3 = new URL(urlString), hostname2 = url3.hostname.toLowerCase(), port = url3.port || (url3.protocol === "https:" ? "443" : "80"), hostWithPort = `${hostname2}:${port}`;
    return noProxy.split(/[,\s]+/).filter(Boolean).some((pattern) => {
      if (pattern = pattern.toLowerCase().trim(), pattern.includes(":"))
        return hostWithPort === pattern;
      if (pattern.startsWith(".")) {
        let suffix = pattern;
        return hostname2 === pattern.substring(1) || hostname2.endsWith(suffix);
      }
      return hostname2 === pattern;
    });
  } catch {
    return !1;
  }
}
