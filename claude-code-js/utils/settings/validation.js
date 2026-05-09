// Original: src/utils/settings/validation.ts
function isInvalidTypeIssue(issue2) {
  return issue2.code === "invalid_type";
}
function isInvalidValueIssue(issue2) {
  return issue2.code === "invalid_value";
}
function isUnrecognizedKeysIssue(issue2) {
  return issue2.code === "unrecognized_keys";
}
function isTooSmallIssue(issue2) {
  return issue2.code === "too_small";
}
function getReceivedType(value) {
  if (value === null)
    return "null";
  if (value === void 0)
    return "undefined";
  if (Array.isArray(value))
    return "array";
  return typeof value;
}
function extractReceivedFromMessage(msg) {
  let match = msg.match(/received (\w+)/);
  return match ? match[1] : void 0;
}
function formatZodError(error41, filePath) {
  return error41.issues.map((issue2) => {
    let path9 = issue2.path.map(String).join("."), message = issue2.message, expected, enumValues, expectedValue, receivedValue, invalidValue;
    if (isInvalidValueIssue(issue2))
      enumValues = issue2.values.map((v) => String(v)), expectedValue = enumValues.join(" | "), receivedValue = void 0, invalidValue = void 0;
    else if (isInvalidTypeIssue(issue2)) {
      expectedValue = issue2.expected;
      let receivedType = extractReceivedFromMessage(issue2.message);
      receivedValue = receivedType ?? getReceivedType(issue2.input), invalidValue = receivedType ?? getReceivedType(issue2.input);
    } else if (isTooSmallIssue(issue2))
      expectedValue = String(issue2.minimum);
    else if (issue2.code === "custom" && "params" in issue2)
      receivedValue = issue2.params.received, invalidValue = receivedValue;
    let tip = getValidationTip({
      path: path9,
      code: issue2.code,
      expected: expectedValue,
      received: receivedValue,
      enumValues,
      message: issue2.message,
      value: receivedValue
    });
    if (isInvalidValueIssue(issue2))
      expected = enumValues?.map((v) => `"${v}"`).join(", "), message = `Invalid value. Expected one of: ${expected}`;
    else if (isInvalidTypeIssue(issue2)) {
      let receivedType = extractReceivedFromMessage(issue2.message) ?? getReceivedType(issue2.input);
      if (issue2.expected === "object" && receivedType === "null" && path9 === "")
        message = "Invalid or malformed JSON";
      else
        message = `Expected ${issue2.expected}, but received ${receivedType}`;
    } else if (isUnrecognizedKeysIssue(issue2)) {
      let keys2 = issue2.keys.join(", ");
      message = `Unrecognized ${plural(issue2.keys.length, "field")}: ${keys2}`;
    } else if (isTooSmallIssue(issue2))
      message = `Number must be greater than or equal to ${issue2.minimum}`, expected = String(issue2.minimum);
    return {
      file: filePath,
      path: path9,
      message,
      expected,
      invalidValue,
      suggestion: tip?.suggestion,
      docLink: tip?.docLink
    };
  });
}
function validateSettingsFileContent(content) {
  try {
    let jsonData = jsonParse(content), result = SettingsSchema().strict().safeParse(jsonData);
    if (result.success)
      return { isValid: !0 };
    return {
      isValid: !1,
      error: `Settings validation failed:
` + formatZodError(result.error, "settings").map((err) => `- ${err.path}: ${err.message}`).join(`
`),
      fullSchema: generateSettingsJSONSchema()
    };
  } catch (parseError) {
    return {
      isValid: !1,
      error: `Invalid JSON: ${parseError instanceof Error ? parseError.message : "Unknown parsing error"}`,
      fullSchema: generateSettingsJSONSchema()
    };
  }
}
function filterInvalidPermissionRules(data, filePath) {
  if (!data || typeof data !== "object")
    return [];
  let obj = data;
  if (!obj.permissions || typeof obj.permissions !== "object")
    return [];
  let perms = obj.permissions, warnings = [];
  for (let key of ["allow", "deny", "ask"]) {
    let rules = perms[key];
    if (!Array.isArray(rules))
      continue;
    perms[key] = rules.filter((rule) => {
      if (typeof rule !== "string")
        return warnings.push({
          file: filePath,
          path: `permissions.${key}`,
          message: `Non-string value in ${key} array was removed`,
          invalidValue: rule
        }), !1;
      let result = validatePermissionRule(rule);
      if (!result.valid) {
        let message = `Invalid permission rule "${rule}" was skipped`;
        if (result.error)
          message += `: ${result.error}`;
        if (result.suggestion)
          message += `. ${result.suggestion}`;
        return warnings.push({
          file: filePath,
          path: `permissions.${key}`,
          message,
          invalidValue: rule
        }), !1;
      }
      return !0;
    });
  }
  return warnings;
}
var init_validation2 = __esm(() => {
  init_slowOperations();
  init_permissionValidation();
  init_schemaOutput();
  init_types3();
  init_validationTips();
});
