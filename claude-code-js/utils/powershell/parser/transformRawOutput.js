// function: transformRawOutput
function transformRawOutput(raw) {
  let result = {
    valid: raw.valid,
    errors: ensureArray(raw.errors),
    statements: ensureArray(raw.statements).map(transformStatement),
    variables: ensureArray(raw.variables),
    hasStopParsing: raw.hasStopParsing,
    originalCommand: raw.originalCommand
  }, tl = ensureArray(raw.typeLiterals);
  if (tl.length > 0)
    result.typeLiterals = tl;
  if (raw.hasUsingStatements)
    result.hasUsingStatements = !0;
  if (raw.hasScriptRequirements)
    result.hasScriptRequirements = !0;
  return result;
}
