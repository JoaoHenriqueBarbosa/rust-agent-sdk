// function: matchesDomainPattern
function matchesDomainPattern(hostname2, pattern) {
  let h4 = hostname2.toLowerCase();
  if (pattern.startsWith("*.")) {
    if (isIP2(stripBrackets(h4)))
      return !1;
    let baseDomain = pattern.substring(2).toLowerCase();
    return h4.endsWith("." + baseDomain);
  }
  return h4 === pattern.toLowerCase();
}
