// function: getTerminalIdeType
function getTerminalIdeType() {
  if (!isSupportedTerminal())
    return null;
  return env3.terminal;
}
