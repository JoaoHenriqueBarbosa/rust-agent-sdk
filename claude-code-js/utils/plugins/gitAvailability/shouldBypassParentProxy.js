// function: shouldBypassParentProxy
function shouldBypassParentProxy(resolved, host) {
  let h4 = stripBrackets(host.toLowerCase().replace(/\.$/, ""));
  if (h4 === "localhost")
    return !0;
  let fam = isIP(h4);
  if (fam) {
    if (LOOPBACK.check(h4, fam === 6 ? "ipv6" : "ipv4"))
      return !0;
  }
  if (resolved.noProxy.all)
    return !0;
  if (fam) {
    if (resolved.noProxy.cidr.check(h4, fam === 6 ? "ipv6" : "ipv4"))
      return !0;
  }
  for (let v2 of resolved.noProxy.suffixes)
    if (v2.startsWith(".")) {
      if (h4 === v2.slice(1) || h4.endsWith(v2))
        return !0;
    } else if (h4 === v2 || h4.endsWith("." + v2))
      return !0;
  return !1;
}
