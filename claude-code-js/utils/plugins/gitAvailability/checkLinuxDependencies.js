// function: checkLinuxDependencies
function checkLinuxDependencies(seccompConfig) {
  let errors6 = [], warnings = [];
  if (whichSync2("bwrap") === null)
    errors6.push("bubblewrap (bwrap) not installed");
  if (whichSync2("socat") === null)
    errors6.push("socat not installed");
  if (!seccompConfig?.argv0 && getApplySeccompBinaryPath(seccompConfig?.applyPath) === null)
    warnings.push("seccomp not available - unix socket access not restricted");
  return { warnings, errors: errors6 };
}
