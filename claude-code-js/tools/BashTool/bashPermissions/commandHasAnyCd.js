// function: commandHasAnyCd
function commandHasAnyCd(command12) {
  return splitCommand(command12).some((subcmd) => isNormalizedCdCommand(subcmd.trim()));
}
