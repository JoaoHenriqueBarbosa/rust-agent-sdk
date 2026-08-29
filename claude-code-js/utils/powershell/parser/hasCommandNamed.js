// function: hasCommandNamed
function hasCommandNamed(parsed, name3) {
  let lowerName = name3.toLowerCase(), canonicalFromAlias = COMMON_ALIASES[lowerName]?.toLowerCase();
  for (let cmdName of getAllCommandNames(parsed)) {
    if (cmdName === lowerName)
      return !0;
    let canonical = COMMON_ALIASES[cmdName]?.toLowerCase();
    if (canonical === lowerName)
      return !0;
    if (canonicalFromAlias && cmdName === canonicalFromAlias)
      return !0;
    if (canonical && canonicalFromAlias && canonical === canonicalFromAlias)
      return !0;
  }
  return !1;
}
