// Original: src/utils/permissions/shellRuleMatching.ts
function permissionRuleExtractPrefix2(permissionRule) {
  return permissionRule.match(/^(.+):\*$/)?.[1] ?? null;
}
function hasWildcards(pattern) {
  if (pattern.endsWith(":*"))
    return !1;
  for (let i5 = 0;i5 < pattern.length; i5++)
    if (pattern[i5] === "*") {
      let backslashCount = 0, j4 = i5 - 1;
      while (j4 >= 0 && pattern[j4] === "\\")
        backslashCount++, j4--;
      if (backslashCount % 2 === 0)
        return !0;
    }
  return !1;
}
function matchWildcardPattern(pattern, command12, caseInsensitive = !1) {
  let trimmedPattern = pattern.trim(), processed = "", i5 = 0;
  while (i5 < trimmedPattern.length) {
    let char = trimmedPattern[i5];
    if (char === "\\" && i5 + 1 < trimmedPattern.length) {
      let nextChar = trimmedPattern[i5 + 1];
      if (nextChar === "*") {
        processed += "\x00ESCAPED_STAR\x00", i5 += 2;
        continue;
      } else if (nextChar === "\\") {
        processed += "\x00ESCAPED_BACKSLASH\x00", i5 += 2;
        continue;
      }
    }
    processed += char, i5++;
  }
  let regexPattern = processed.replace(/[.+?^${}()|[\]\\'"]/g, "\\$&").replace(/\*/g, ".*").replace(ESCAPED_STAR_PLACEHOLDER_RE, "\\*").replace(ESCAPED_BACKSLASH_PLACEHOLDER_RE, "\\\\"), unescapedStarCount = (processed.match(/\*/g) || []).length;
  if (regexPattern.endsWith(" .*") && unescapedStarCount === 1)
    regexPattern = regexPattern.slice(0, -3) + "( .*)?";
  let flags = "s" + (caseInsensitive ? "i" : "");
  return new RegExp(`^${regexPattern}$`, flags).test(command12);
}
function parsePermissionRule(permissionRule) {
  let prefix = permissionRuleExtractPrefix2(permissionRule);
  if (prefix !== null)
    return {
      type: "prefix",
      prefix
    };
  if (hasWildcards(permissionRule))
    return {
      type: "wildcard",
      pattern: permissionRule
    };
  return {
    type: "exact",
    command: permissionRule
  };
}
function suggestionForExactCommand(toolName, command12) {
  return [
    {
      type: "addRules",
      rules: [
        {
          toolName,
          ruleContent: command12
        }
      ],
      behavior: "allow",
      destination: "localSettings"
    }
  ];
}
function suggestionForPrefix(toolName, prefix) {
  return [
    {
      type: "addRules",
      rules: [
        {
          toolName,
          ruleContent: `${prefix}:*`
        }
      ],
      behavior: "allow",
      destination: "localSettings"
    }
  ];
}
var ESCAPED_STAR_PLACEHOLDER_RE, ESCAPED_BACKSLASH_PLACEHOLDER_RE;
var init_shellRuleMatching = __esm(() => {
  ESCAPED_STAR_PLACEHOLDER_RE = new RegExp("\x00ESCAPED_STAR\x00", "g"), ESCAPED_BACKSLASH_PLACEHOLDER_RE = new RegExp("\x00ESCAPED_BACKSLASH\x00", "g");
});
