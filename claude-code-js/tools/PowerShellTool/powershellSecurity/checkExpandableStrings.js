// function: checkExpandableStrings
function checkExpandableStrings(parsed) {
  if (deriveSecurityFlags(parsed).hasExpandableStrings)
    return {
      behavior: "ask",
      message: "Command contains expandable strings with embedded expressions"
    };
  return { behavior: "passthrough" };
}
