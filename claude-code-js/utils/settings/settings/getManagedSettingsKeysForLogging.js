// function: getManagedSettingsKeysForLogging
function getManagedSettingsKeysForLogging(settings) {
  let validSettings = SettingsSchema().strip().parse(settings), keysToExpand = ["permissions", "sandbox", "hooks"], allKeys = [], validNestedKeys = {
    permissions: /* @__PURE__ */ new Set([
      "allow",
      "deny",
      "ask",
      "defaultMode",
      "disableBypassPermissionsMode",
      ...[],
      "additionalDirectories"
    ]),
    sandbox: /* @__PURE__ */ new Set([
      "enabled",
      "failIfUnavailable",
      "allowUnsandboxedCommands",
      "network",
      "filesystem",
      "ignoreViolations",
      "excludedCommands",
      "autoAllowBashIfSandboxed",
      "enableWeakerNestedSandbox",
      "enableWeakerNetworkIsolation",
      "ripgrep"
    ]),
    hooks: /* @__PURE__ */ new Set([
      "PreToolUse",
      "PostToolUse",
      "Notification",
      "UserPromptSubmit",
      "SessionStart",
      "SessionEnd",
      "Stop",
      "SubagentStop",
      "PreCompact",
      "PostCompact",
      "TeammateIdle",
      "TaskCreated",
      "TaskCompleted"
    ])
  };
  for (let key of Object.keys(validSettings))
    if (keysToExpand.includes(key) && validSettings[key] && typeof validSettings[key] === "object") {
      let nestedObj = validSettings[key], validKeys = validNestedKeys[key];
      if (validKeys) {
        for (let nestedKey of Object.keys(nestedObj))
          if (validKeys.has(nestedKey))
            allKeys.push(`${key}.${nestedKey}`);
      }
    } else
      allKeys.push(key);
  return allKeys.sort();
}
