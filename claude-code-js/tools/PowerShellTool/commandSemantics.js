// Original: src/tools/PowerShellTool/commandSemantics.ts
function extractBaseCommand(segment) {
  let unquoted = (segment.trim().replace(/^[&.]\s+/, "").split(/\s+/)[0] || "").replace(/^["']|["']$/g, "");
  return (unquoted.split(/[\\/]/).pop() || unquoted).toLowerCase().replace(/\.exe$/, "");
}
function heuristicallyExtractBaseCommand(command12) {
  let segments = command12.split(/[;|]/).filter((s2) => s2.trim()), last2 = segments[segments.length - 1] || command12;
  return extractBaseCommand(last2);
}
function interpretCommandResult(command12, exitCode, stdout, stderr) {
  let baseCommand = heuristicallyExtractBaseCommand(command12);
  return (COMMAND_SEMANTICS.get(baseCommand) ?? DEFAULT_SEMANTIC)(exitCode, stdout, stderr);
}
var DEFAULT_SEMANTIC = (exitCode, _stdout, _stderr) => ({
  isError: exitCode !== 0,
  message: exitCode !== 0 ? `Command failed with exit code ${exitCode}` : void 0
}), GREP_SEMANTIC = (exitCode, _stdout, _stderr) => ({
  isError: exitCode >= 2,
  message: exitCode === 1 ? "No matches found" : void 0
}), COMMAND_SEMANTICS;
var init_commandSemantics = __esm(() => {
  COMMAND_SEMANTICS = /* @__PURE__ */ new Map([
    ["grep", GREP_SEMANTIC],
    ["rg", GREP_SEMANTIC],
    ["findstr", GREP_SEMANTIC],
    [
      "robocopy",
      (exitCode, _stdout, _stderr) => ({
        isError: exitCode >= 8,
        message: exitCode === 0 ? "No files copied (already in sync)" : exitCode >= 1 && exitCode < 8 ? exitCode & 1 ? "Files copied successfully" : "Robocopy completed (no errors)" : void 0
      })
    ]
  ]);
});
