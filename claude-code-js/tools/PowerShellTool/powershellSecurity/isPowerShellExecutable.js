// function: isPowerShellExecutable
function isPowerShellExecutable(name3) {
  let lower = name3.toLowerCase();
  if (POWERSHELL_EXECUTABLES.has(lower))
    return !0;
  let lastSep = Math.max(lower.lastIndexOf("/"), lower.lastIndexOf("\\"));
  if (lastSep >= 0)
    return POWERSHELL_EXECUTABLES.has(lower.slice(lastSep + 1));
  return !1;
}
