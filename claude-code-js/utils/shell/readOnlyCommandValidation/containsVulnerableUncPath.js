// function: containsVulnerableUncPath
function containsVulnerableUncPath(pathOrCommand) {
  if (getPlatform() !== "windows")
    return !1;
  if (/\\\\[^\s\\/]+(?:@(?:\d+|ssl))?(?:[\\/]|$|\s)/i.test(pathOrCommand))
    return !0;
  if (/(?<!:)\/\/[^\s\\/]+(?:@(?:\d+|ssl))?(?:[\\/]|$|\s)/i.test(pathOrCommand))
    return !0;
  if (/\/\\{2,}[^\s\\/]/.test(pathOrCommand))
    return !0;
  if (/\\{2,}\/[^\s\\/]/.test(pathOrCommand))
    return !0;
  if (/@SSL@\d+/i.test(pathOrCommand) || /@\d+@SSL/i.test(pathOrCommand))
    return !0;
  if (/DavWWWRoot/i.test(pathOrCommand))
    return !0;
  if (/^\\\\(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(pathOrCommand) || /^\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})[\\/]/.test(pathOrCommand))
    return !0;
  if (/^\\\\(\[[\da-fA-F:]+\])[\\/]/.test(pathOrCommand) || /^\/\/(\[[\da-fA-F:]+\])[\\/]/.test(pathOrCommand))
    return !0;
  return !1;
}
