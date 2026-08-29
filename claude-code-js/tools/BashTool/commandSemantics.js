// Original: src/tools/BashTool/commandSemantics.ts
function getCommandSemantic(command12) {
  let baseCommand = heuristicallyExtractBaseCommand2(command12), semantic = COMMAND_SEMANTICS2.get(baseCommand);
  return semantic !== void 0 ? semantic : DEFAULT_SEMANTIC2;
}
function extractBaseCommand2(command12) {
  return command12.trim().split(/\s+/)[0] || "";
}
function heuristicallyExtractBaseCommand2(command12) {
  let segments = splitCommand_DEPRECATED(command12), lastCommand = segments[segments.length - 1] || command12;
  return extractBaseCommand2(lastCommand);
}
function interpretCommandResult2(command12, exitCode, stdout, stderr) {
  let result = getCommandSemantic(command12)(exitCode, stdout, stderr);
  return {
    isError: result.isError,
    message: result.message
  };
}
var DEFAULT_SEMANTIC2 = (exitCode, _stdout, _stderr) => ({
  isError: exitCode !== 0,
  message: exitCode !== 0 ? `Command failed with exit code ${exitCode}` : void 0
}), COMMAND_SEMANTICS2;
var init_commandSemantics2 = __esm(() => {
  init_commands4();
  COMMAND_SEMANTICS2 = /* @__PURE__ */ new Map([
    [
      "grep",
      (exitCode, _stdout, _stderr) => ({
        isError: exitCode >= 2,
        message: exitCode === 1 ? "No matches found" : void 0
      })
    ],
    [
      "rg",
      (exitCode, _stdout, _stderr) => ({
        isError: exitCode >= 2,
        message: exitCode === 1 ? "No matches found" : void 0
      })
    ],
    [
      "find",
      (exitCode, _stdout, _stderr) => ({
        isError: exitCode >= 2,
        message: exitCode === 1 ? "Some directories were inaccessible" : void 0
      })
    ],
    [
      "diff",
      (exitCode, _stdout, _stderr) => ({
        isError: exitCode >= 2,
        message: exitCode === 1 ? "Files differ" : void 0
      })
    ],
    [
      "test",
      (exitCode, _stdout, _stderr) => ({
        isError: exitCode >= 2,
        message: exitCode === 1 ? "Condition is false" : void 0
      })
    ],
    [
      "[",
      (exitCode, _stdout, _stderr) => ({
        isError: exitCode >= 2,
        message: exitCode === 1 ? "Condition is false" : void 0
      })
    ]
  ]);
});
