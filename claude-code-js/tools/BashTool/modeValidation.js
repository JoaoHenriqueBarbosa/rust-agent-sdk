// Original: src/tools/BashTool/modeValidation.ts
function isFilesystemCommand(command12) {
  return ACCEPT_EDITS_ALLOWED_COMMANDS.includes(command12);
}
function validateCommandForMode(cmd, toolPermissionContext) {
  let trimmedCmd = cmd.trim(), [baseCmd] = trimmedCmd.split(/\s+/);
  if (!baseCmd)
    return {
      behavior: "passthrough",
      message: "Base command not found"
    };
  if (toolPermissionContext.mode === "acceptEdits" && isFilesystemCommand(baseCmd))
    return {
      behavior: "allow",
      updatedInput: { command: cmd },
      decisionReason: {
        type: "mode",
        mode: "acceptEdits"
      }
    };
  return {
    behavior: "passthrough",
    message: `No mode-specific handling for '${baseCmd}' in ${toolPermissionContext.mode} mode`
  };
}
function checkPermissionMode2(input, toolPermissionContext) {
  if (toolPermissionContext.mode === "bypassPermissions")
    return {
      behavior: "passthrough",
      message: "Bypass mode is handled in main permission flow"
    };
  if (toolPermissionContext.mode === "dontAsk")
    return {
      behavior: "passthrough",
      message: "DontAsk mode is handled in main permission flow"
    };
  let commands7 = splitCommand_DEPRECATED(input.command);
  for (let cmd of commands7) {
    let result = validateCommandForMode(cmd, toolPermissionContext);
    if (result.behavior !== "passthrough")
      return result;
  }
  return {
    behavior: "passthrough",
    message: "No mode-specific validation required"
  };
}
var ACCEPT_EDITS_ALLOWED_COMMANDS;
var init_modeValidation2 = __esm(() => {
  init_commands4();
  ACCEPT_EDITS_ALLOWED_COMMANDS = [
    "mkdir",
    "touch",
    "rm",
    "rmdir",
    "mv",
    "cp",
    "sed"
  ];
});
