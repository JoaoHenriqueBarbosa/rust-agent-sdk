// var: isWsl
var isWsl = () => {
  if (process15.platform !== "linux")
    return !1;
  if (os4.release().toLowerCase().includes("microsoft")) {
    if (isInsideContainer())
      return !1;
    return !0;
  }
  try {
    if (fs6.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft"))
      return !isInsideContainer();
  } catch {}
  if (fs6.existsSync("/proc/sys/fs/binfmt_misc/WSLInterop") || fs6.existsSync("/run/WSL"))
    return !isInsideContainer();
  return !1;
}, is_wsl_default;
