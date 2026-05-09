// function: checkMemberInvocations
function checkMemberInvocations(parsed) {
  if (deriveSecurityFlags(parsed).hasMemberInvocations)
    return {
      behavior: "ask",
      message: "Command invokes .NET methods"
    };
  return { behavior: "passthrough" };
}
