// function: parseNoProxy
function parseNoProxy(raw) {
  let rules = {
    all: !1,
    suffixes: [],
    cidr: new BlockList
  };
  for (let entry of raw.split(",")) {
    if (entry = entry.trim(), !entry)
      continue;
    if (entry === "*") {
      rules.all = !0;
      continue;
    }
    let slash = entry.indexOf("/");
    if (slash !== -1) {
      let ip = entry.slice(0, slash), prefixStr = entry.slice(slash + 1), fam = isIP(ip);
      if (fam && prefixStr !== "" && /^\d+$/.test(prefixStr)) {
        let prefix = Number(prefixStr), max = fam === 6 ? 128 : 32;
        if (prefix >= 0 && prefix <= max) {
          try {
            rules.cidr.addSubnet(ip, prefix, fam === 6 ? "ipv6" : "ipv4");
          } catch {}
          continue;
        }
      }
      continue;
    }
    let v2 = entry.toLowerCase(), bracketed = /^\[([^\]]+)\](?::\d+)?$/.exec(v2);
    if (bracketed)
      v2 = bracketed[1];
    if (v2.startsWith("*."))
      v2 = v2.slice(1);
    let bareFam = isIP(v2);
    if (!bareFam) {
      let colon = v2.lastIndexOf(":");
      if (colon !== -1 && /^\d+$/.test(v2.slice(colon + 1)))
        v2 = v2.slice(0, colon);
    } else
      try {
        rules.cidr.addAddress(v2, bareFam === 6 ? "ipv6" : "ipv4");
        continue;
      } catch {}
    rules.suffixes.push(v2);
  }
  return rules;
}
