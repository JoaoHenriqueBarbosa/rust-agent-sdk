// function: checkEditableInternalPath
function checkEditableInternalPath(absolutePath, input) {
  let normalizedPath = normalize15(absolutePath);
  if (isSessionPlanFile(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Plan files for current session are allowed for writing"
      }
    };
  if (isScratchpadPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Scratchpad files for current session are allowed for writing"
      }
    };
  if (isAgentMemoryPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Agent memory files are allowed for writing"
      }
    };
  if (!hasAutoMemPathOverride() && isAutoMemPath(normalizedPath))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "auto memory files are allowed for writing"
      }
    };
  if (normalizeCaseForComparison2(normalizedPath) === normalizeCaseForComparison2(join136(getOriginalCwd(), ".claude", "launch.json")))
    return {
      behavior: "allow",
      updatedInput: input,
      decisionReason: {
        type: "other",
        reason: "Preview launch config is allowed for writing"
      }
    };
  return { behavior: "passthrough", message: "" };
}
