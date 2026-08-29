// function: generateLogTag
function generateLogTag(command12) {
  return `CMD64_${encodeSandboxedCommand(command12)}_END_${sessionSuffix}`;
}
