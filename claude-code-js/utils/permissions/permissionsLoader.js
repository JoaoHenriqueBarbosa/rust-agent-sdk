// Original: src/utils/permissions/permissionsLoader.ts
function shouldAllowManagedPermissionRulesOnly() {
  return getSettingsForSource("policySettings")?.allowManagedPermissionRulesOnly === !0;
}
function shouldShowAlwaysAllowOptions() {
  return !shouldAllowManagedPermissionRulesOnly();
}
function getSettingsForSourceLenient_FOR_EDITING_ONLY_NOT_FOR_READING(source) {
  let filePath = getSettingsFilePathForSource(source);
  if (!filePath)
    return null;
  try {
    let { resolvedPath: resolvedPath5 } = safeResolvePath(getFsImplementation(), filePath), content = readFileSync4(resolvedPath5);
    if (content.trim() === "")
      return {};
    let data = safeParseJSON(content, !1);
    return data && typeof data === "object" ? data : null;
  } catch {
    return null;
  }
}
function settingsJsonToRules(data, source) {
  if (!data || !data.permissions)
    return [];
  let { permissions } = data, rules = [];
  for (let behavior of SUPPORTED_RULE_BEHAVIORS) {
    let behaviorArray = permissions[behavior];
    if (behaviorArray)
      for (let ruleString of behaviorArray)
        rules.push({
          source,
          ruleBehavior: behavior,
          ruleValue: permissionRuleValueFromString(ruleString)
        });
  }
  return rules;
}
function loadAllPermissionRulesFromDisk() {
  if (shouldAllowManagedPermissionRulesOnly())
    return getPermissionRulesForSource("policySettings");
  let rules = [];
  for (let source of getEnabledSettingSources())
    rules.push(...getPermissionRulesForSource(source));
  return rules;
}
function getPermissionRulesForSource(source) {
  let settingsData = getSettingsForSource(source);
  return settingsJsonToRules(settingsData, source);
}
function deletePermissionRuleFromSettings(rule) {
  if (!EDITABLE_SOURCES.includes(rule.source))
    return !1;
  let ruleString = permissionRuleValueToString(rule.ruleValue), settingsData = getSettingsForSource(rule.source);
  if (!settingsData || !settingsData.permissions)
    return !1;
  let behaviorArray = settingsData.permissions[rule.ruleBehavior];
  if (!behaviorArray)
    return !1;
  let normalizeEntry = (raw) => permissionRuleValueToString(permissionRuleValueFromString(raw));
  if (!behaviorArray.some((raw) => normalizeEntry(raw) === ruleString))
    return !1;
  try {
    let updatedSettingsData = {
      ...settingsData,
      permissions: {
        ...settingsData.permissions,
        [rule.ruleBehavior]: behaviorArray.filter((raw) => normalizeEntry(raw) !== ruleString)
      }
    }, { error: error44 } = updateSettingsForSource(rule.source, updatedSettingsData);
    if (error44)
      return !1;
    return !0;
  } catch (error44) {
    return logError2(error44), !1;
  }
}
function getEmptyPermissionSettingsJson() {
  return {
    permissions: {}
  };
}
function addPermissionRulesToSettings({
  ruleValues,
  ruleBehavior
}, source) {
  if (shouldAllowManagedPermissionRulesOnly())
    return !1;
  if (ruleValues.length < 1)
    return !0;
  let ruleStrings = ruleValues.map(permissionRuleValueToString), settingsData = getSettingsForSource(source) || getSettingsForSourceLenient_FOR_EDITING_ONLY_NOT_FOR_READING(source) || getEmptyPermissionSettingsJson();
  try {
    let existingPermissions = settingsData.permissions || {}, existingRules = existingPermissions[ruleBehavior] || [], existingRulesSet = new Set(existingRules.map((raw) => permissionRuleValueToString(permissionRuleValueFromString(raw)))), newRules = ruleStrings.filter((rule) => !existingRulesSet.has(rule));
    if (newRules.length === 0)
      return !0;
    let updatedSettingsData = {
      ...settingsData,
      permissions: {
        ...existingPermissions,
        [ruleBehavior]: [...existingRules, ...newRules]
      }
    }, result = updateSettingsForSource(source, updatedSettingsData);
    if (result.error)
      throw result.error;
    return !0;
  } catch (error44) {
    return logError2(error44), !1;
  }
}
var SUPPORTED_RULE_BEHAVIORS, EDITABLE_SOURCES;
var init_permissionsLoader = __esm(() => {
  init_fileRead();
  init_fsOperations();
  init_json();
  init_log3();
  init_constants2();
  init_settings2();
  init_permissionRuleParser();
  SUPPORTED_RULE_BEHAVIORS = [
    "allow",
    "deny",
    "ask"
  ];
  EDITABLE_SOURCES = [
    "userSettings",
    "projectSettings",
    "localSettings"
  ];
});
