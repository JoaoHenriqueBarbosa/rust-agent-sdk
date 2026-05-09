// Original: src/commands/permissions/permissions.tsx
var exports_permissions = {};
__export(exports_permissions, {
  call: () => call40
});
var jsx_dev_runtime300, call40 = async (onDone, context7) => {
  return /* @__PURE__ */ jsx_dev_runtime300.jsxDEV(PermissionRuleList, {
    onExit: onDone,
    onRetryDenials: (commands7) => {
      context7.setMessages((prev) => [...prev, createPermissionRetryMessage(commands7)]);
    }
  }, void 0, !1, void 0, this);
};
var init_permissions3 = __esm(() => {
  init_PermissionRuleList();
  init_messages3();
  jsx_dev_runtime300 = __toESM(require_react_jsx_dev_runtime_development(), 1);
});
