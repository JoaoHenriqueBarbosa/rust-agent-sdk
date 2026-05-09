// var: init_mcp3
var init_mcp3 = __esm(() => {
  mcp = {
    type: "local-jsx",
    name: "mcp",
    description: "Manage MCP servers",
    immediate: !0,
    argumentHint: "[enable|disable [server-name]]",
    load: () => Promise.resolve().then(() => (init_mcp2(), exports_mcp))
  }, mcp_default = mcp;
});
