// function: encodeSandboxedCommand
function encodeSandboxedCommand(command12) {
  let truncatedCommand = command12.slice(0, 100);
  return Buffer.from(truncatedCommand).toString("base64");
}
