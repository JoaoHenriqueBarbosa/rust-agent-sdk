// function: mcpToolInputToAutoClassifierInput
function mcpToolInputToAutoClassifierInput(input, toolName) {
  let keys2 = Object.keys(input);
  return keys2.length > 0 ? keys2.map((k3) => `${k3}=${String(input[k3])}`).join(" ") : toolName;
}
