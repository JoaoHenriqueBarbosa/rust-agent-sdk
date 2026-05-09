// function: checkDependencies
function checkDependencies(ripgrepConfig) {
  if (!isSupportedPlatform())
    return { errors: ["Unsupported platform"], warnings: [] };
  let errors6 = [], warnings = [], rgToCheck = ripgrepConfig ?? config8?.ripgrep ?? { command: "rg" };
  if (whichSync2(rgToCheck.command) === null)
    errors6.push(`ripgrep (${rgToCheck.command}) not found`);
  if (getPlatform2() === "linux") {
    let linuxDeps = checkLinuxDependencies(config8?.seccomp);
    errors6.push(...linuxDeps.errors), warnings.push(...linuxDeps.warnings);
  }
  return { errors: errors6, warnings };
}
