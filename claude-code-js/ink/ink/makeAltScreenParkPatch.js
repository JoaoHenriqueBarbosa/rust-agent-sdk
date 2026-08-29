// function: makeAltScreenParkPatch
function makeAltScreenParkPatch(terminalRows) {
  return Object.freeze({
    type: "stdout",
    content: cursorPosition(terminalRows, 1)
  });
}
