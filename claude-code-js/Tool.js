// Original: src/Tool.ts
function filterToolProgressMessages(progressMessagesForMessage) {
  return progressMessagesForMessage.filter((msg) => msg.data?.type !== "hook_progress");
}
function toolMatchesName(tool, name3) {
  return tool.name === name3 || (tool.aliases?.includes(name3) ?? !1);
}
function findToolByName(tools, name3) {
  return tools.find((t2) => toolMatchesName(t2, name3));
}
function buildTool(def) {
  return {
    ...TOOL_DEFAULTS,
    userFacingName: () => def.name,
    ...def
  };
}
var getEmptyToolPermissionContext = () => ({
  mode: "default",
  additionalWorkingDirectories: /* @__PURE__ */ new Map,
  alwaysAllowRules: {},
  alwaysDenyRules: {},
  alwaysAskRules: {},
  isBypassPermissionsModeAvailable: !1
}), TOOL_DEFAULTS;
var init_Tool = __esm(() => {
  TOOL_DEFAULTS = {
    isEnabled: () => !0,
    isConcurrencySafe: (_input) => !1,
    isReadOnly: (_input) => !1,
    isDestructive: (_input) => !1,
    checkPermissions: (input, _ctx) => Promise.resolve({ behavior: "allow", updatedInput: input }),
    toAutoClassifierInput: (_input) => "",
    userFacingName: (_input) => ""
  };
});