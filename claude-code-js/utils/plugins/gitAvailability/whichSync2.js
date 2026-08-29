// function: whichSync2
function whichSync2(bin) {
  if (typeof globalThis.Bun < "u")
    return globalThis.Bun.which(bin);
  let result = spawnSync3("which", [bin], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
    timeout: 1000
  });
  if (result.status === 0 && result.stdout)
    return result.stdout.trim();
  return null;
}
