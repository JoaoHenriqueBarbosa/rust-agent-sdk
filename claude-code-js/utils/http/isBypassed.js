// function: isBypassed
function isBypassed(uri7, noProxyList, bypassedMap) {
  if (noProxyList.length === 0)
    return !1;
  let host = new URL(uri7).hostname;
  if (bypassedMap?.has(host))
    return bypassedMap.get(host);
  let isBypassedFlag = !1;
  for (let pattern of noProxyList)
    if (pattern[0] === ".") {
      if (host.endsWith(pattern))
        isBypassedFlag = !0;
      else if (host.length === pattern.length - 1 && host === pattern.slice(1))
        isBypassedFlag = !0;
    } else if (host === pattern)
      isBypassedFlag = !0;
  return bypassedMap?.set(host, isBypassedFlag), isBypassedFlag;
}
