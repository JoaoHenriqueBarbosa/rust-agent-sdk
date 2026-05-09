// function: annotateStderrWithSandboxFailures
function annotateStderrWithSandboxFailures(command12, stderr) {
  if (!config8)
    return stderr;
  let violations = sandboxViolationStore.getViolationsForCommand(command12);
  if (violations.length === 0)
    return stderr;
  let annotated = stderr;
  annotated += EOL2 + "<sandbox_violations>" + EOL2;
  for (let violation of violations)
    annotated += violation.line + EOL2;
  return annotated += "</sandbox_violations>", annotated;
}
