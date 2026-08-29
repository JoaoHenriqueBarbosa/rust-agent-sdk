// function: checkTypeLiterals
function checkTypeLiterals(parsed) {
  for (let t2 of parsed.typeLiterals ?? [])
    if (!isClmAllowedType(t2))
      return {
        behavior: "ask",
        message: `Command uses .NET type [${t2}] outside the ConstrainedLanguage allowlist`
      };
  return { behavior: "passthrough" };
}
