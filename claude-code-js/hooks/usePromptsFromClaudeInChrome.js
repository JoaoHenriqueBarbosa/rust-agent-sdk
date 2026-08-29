// Original: src/hooks/usePromptsFromClaudeInChrome.tsx
function usePromptsFromClaudeInChrome(mcpClients, toolPermissionMode) {
  let $3 = import_compiler_runtime342.c(6);
  import_react283.useRef(void 0);
  let t0;
  if ($3[0] !== mcpClients)
    t0 = [mcpClients], $3[0] = mcpClients, $3[1] = t0;
  else
    t0 = $3[1];
  import_react283.useEffect(_temp207, t0);
  let t1, t2;
  if ($3[2] !== mcpClients || $3[3] !== toolPermissionMode)
    t1 = () => {
      let chromeClient = findChromeClient(mcpClients);
      if (!chromeClient)
        return;
      callIdeRpc("set_permission_mode", {
        mode: toolPermissionMode === "bypassPermissions" ? "skip_all_permission_checks" : "ask"
      }, chromeClient);
    }, t2 = [mcpClients, toolPermissionMode], $3[2] = mcpClients, $3[3] = toolPermissionMode, $3[4] = t1, $3[5] = t2;
  else
    t1 = $3[4], t2 = $3[5];
  import_react283.useEffect(t1, t2);
}
function _temp207() {}
function findChromeClient(clients) {
  return clients.find((client16) => client16.type === "connected" && client16.name === CLAUDE_IN_CHROME_MCP_SERVER_NAME);
}
var import_compiler_runtime342, import_react283, ClaudeInChromePromptNotificationSchema;
var init_usePromptsFromClaudeInChrome = __esm(() => {
  init_v4();
  init_client20();
  init_common3();
  import_compiler_runtime342 = __toESM(require_react_compiler_runtime_development(), 1), import_react283 = __toESM(require_react_development(), 1), ClaudeInChromePromptNotificationSchema = lazySchema(() => exports_external.object({
    method: exports_external.literal("notifications/message"),
    params: exports_external.object({
      prompt: exports_external.string(),
      image: exports_external.object({
        type: exports_external.literal("base64"),
        media_type: exports_external.enum(["image/jpeg", "image/png", "image/gif", "image/webp"]),
        data: exports_external.string()
      }).optional(),
      tabId: exports_external.number().optional()
    })
  }));
});
