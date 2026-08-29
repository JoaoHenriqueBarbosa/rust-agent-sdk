// function: getWslVersion2
function getWslVersion2() {
  if (process.platform !== "linux")
    return;
  try {
    let procVersion = fs9.readFileSync("/proc/version", { encoding: "utf8" }), wslVersionMatch = procVersion.match(/WSL(\d+)/i);
    if (wslVersionMatch && wslVersionMatch[1])
      return wslVersionMatch[1];
    if (procVersion.toLowerCase().includes("microsoft"))
      return "1";
    return;
  } catch {
    return;
  }
}
