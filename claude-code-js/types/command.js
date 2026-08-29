// Original: src/types/command.ts
function getCommandName(cmd) {
  return cmd.userFacingName?.() ?? cmd.name;
}
function isCommandEnabled(cmd) {
  return cmd.isEnabled?.() ?? !0;
}
