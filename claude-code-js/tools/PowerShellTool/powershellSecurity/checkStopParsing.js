// function: checkStopParsing
function checkStopParsing(parsed) {
  if (deriveSecurityFlags(parsed).hasStopParsing)
    return {
      behavior: "ask",
      message: "Command uses stop-parsing token (--%)"
    };
  return { behavior: "passthrough" };
}
