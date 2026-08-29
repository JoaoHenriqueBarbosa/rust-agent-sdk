// Original: src/utils/permissions/PermissionUpdateSchema.ts
var permissionUpdateDestinationSchema, permissionUpdateSchema;
var init_PermissionUpdateSchema = __esm(() => {
  init_v4();
  init_PermissionMode();
  init_PermissionRule();
  permissionUpdateDestinationSchema = lazySchema(() => v4_default.enum([
    "userSettings",
    "projectSettings",
    "localSettings",
    "session",
    "cliArg"
  ])), permissionUpdateSchema = lazySchema(() => v4_default.discriminatedUnion("type", [
    v4_default.object({
      type: v4_default.literal("addRules"),
      rules: v4_default.array(permissionRuleValueSchema()),
      behavior: permissionBehaviorSchema(),
      destination: permissionUpdateDestinationSchema()
    }),
    v4_default.object({
      type: v4_default.literal("replaceRules"),
      rules: v4_default.array(permissionRuleValueSchema()),
      behavior: permissionBehaviorSchema(),
      destination: permissionUpdateDestinationSchema()
    }),
    v4_default.object({
      type: v4_default.literal("removeRules"),
      rules: v4_default.array(permissionRuleValueSchema()),
      behavior: permissionBehaviorSchema(),
      destination: permissionUpdateDestinationSchema()
    }),
    v4_default.object({
      type: v4_default.literal("setMode"),
      mode: externalPermissionModeSchema(),
      destination: permissionUpdateDestinationSchema()
    }),
    v4_default.object({
      type: v4_default.literal("addDirectories"),
      directories: v4_default.array(v4_default.string()),
      destination: permissionUpdateDestinationSchema()
    }),
    v4_default.object({
      type: v4_default.literal("removeDirectories"),
      directories: v4_default.array(v4_default.string()),
      destination: permissionUpdateDestinationSchema()
    })
  ]));
});
