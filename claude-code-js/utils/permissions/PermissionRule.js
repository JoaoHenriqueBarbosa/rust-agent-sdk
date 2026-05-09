// Original: src/utils/permissions/PermissionRule.ts
var permissionBehaviorSchema, permissionRuleValueSchema;
var init_PermissionRule = __esm(() => {
  init_v4();
  permissionBehaviorSchema = lazySchema(() => v4_default.enum(["allow", "deny", "ask"])), permissionRuleValueSchema = lazySchema(() => v4_default.object({
    toolName: v4_default.string(),
    ruleContent: v4_default.string().optional()
  }));
});
