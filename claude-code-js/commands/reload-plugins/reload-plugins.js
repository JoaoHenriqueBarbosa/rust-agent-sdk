// Original: src/commands/reload-plugins/reload-plugins.ts
var exports_reload_plugins = {};
__export(exports_reload_plugins, {
  call: () => call50
});
function n5(count4, noun) {
  return `${count4} ${plural(count4, noun)}`;
}
var call50 = async (_args, context7) => {
  let r4 = await refreshActivePlugins(context7.setAppState), msg = `Reloaded: ${[
    n5(r4.enabled_count, "plugin"),
    n5(r4.command_count, "skill"),
    n5(r4.agent_count, "agent"),
    n5(r4.hook_count, "hook"),
    n5(r4.mcp_count, "plugin MCP server"),
    n5(r4.lsp_count, "plugin LSP server")
  ].join(" \xB7 ")}`;
  if (r4.error_count > 0)
    msg += `
${n5(r4.error_count, "error")} during load. Run /doctor for details.`;
  return { type: "text", value: msg };
};
var init_reload_plugins = __esm(() => {
  init_refresh();
});
