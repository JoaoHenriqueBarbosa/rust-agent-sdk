// function: buildPermissionUpdates
function buildPermissionUpdates(mode, allowedPrompts) {
  let updates = [{
    type: "setMode",
    mode: toExternalPermissionMode(mode),
    destination: "session"
  }];
  if (isClassifierPermissionsEnabled() && allowedPrompts && allowedPrompts.length > 0)
    updates.push({
      type: "addRules",
      rules: allowedPrompts.map((p4) => ({
        toolName: p4.tool,
        ruleContent: createPromptRuleContent(p4.prompt)
      })),
      behavior: "allow",
      destination: "session"
    });
  return updates;
}
