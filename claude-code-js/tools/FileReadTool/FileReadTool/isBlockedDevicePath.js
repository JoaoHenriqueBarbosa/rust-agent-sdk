// function: isBlockedDevicePath
function isBlockedDevicePath(filePath) {
  if (BLOCKED_DEVICE_PATHS.has(filePath))
    return !0;
  if (filePath.startsWith("/proc/") && (filePath.endsWith("/fd/0") || filePath.endsWith("/fd/1") || filePath.endsWith("/fd/2")))
    return !0;
  return !1;
}
