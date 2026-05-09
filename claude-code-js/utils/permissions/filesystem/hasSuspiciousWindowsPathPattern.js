// function: hasSuspiciousWindowsPathPattern
function hasSuspiciousWindowsPathPattern(path25) {
  if (getPlatform() === "windows" || getPlatform() === "wsl") {
    if (path25.indexOf(":", 2) !== -1)
      return !0;
  }
  if (/~\d/.test(path25))
    return !0;
  if (path25.startsWith("\\\\?\\") || path25.startsWith("\\\\.\\") || path25.startsWith("//?/") || path25.startsWith("//./"))
    return !0;
  if (/[.\s]+$/.test(path25))
    return !0;
  if (/\.(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(path25))
    return !0;
  if (/(^|\/|\\)\.{3,}(\/|\\|$)/.test(path25))
    return !0;
  if (containsVulnerableUncPath(path25))
    return !0;
  return !1;
}
