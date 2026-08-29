// function: checkSplatting
function checkSplatting(parsed) {
  if (deriveSecurityFlags(parsed).hasSplatting)
    return {
      behavior: "ask",
      message: "Command uses splatting (@variable)"
    };
  return { behavior: "passthrough" };
}
