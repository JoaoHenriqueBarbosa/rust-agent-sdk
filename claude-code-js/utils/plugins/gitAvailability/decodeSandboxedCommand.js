// function: decodeSandboxedCommand
function decodeSandboxedCommand(encodedCommand) {
  return Buffer.from(encodedCommand, "base64").toString("utf8");
}
