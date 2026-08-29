// Original: src/services/mcp/channelNotification.ts
function wrapChannelMessage(serverName, content, meta) {
  let attrs = Object.entries(meta ?? {}).filter(([k3]) => SAFE_META_KEY.test(k3)).map(([k3, v2]) => ` ${k3}="${escapeXmlAttr(v2)}"`).join("");
  return `<${CHANNEL_TAG} source="${escapeXmlAttr(serverName)}"${attrs}>
${content}
</${CHANNEL_TAG}>`;
}
function getEffectiveChannelAllowlist(sub, orgList) {
  if ((sub === "team" || sub === "enterprise") && orgList)
    return { entries: orgList, source: "org" };
  return { entries: getChannelAllowlist(), source: "ledger" };
}
function findChannelEntry(serverName, channels) {
  let parts = serverName.split(":");
  return channels.find((c3) => c3.kind === "server" ? serverName === c3.name : parts[0] === "plugin" && parts[1] === c3.name);
}
function gateChannelServer(serverName, capabilities, pluginSource) {
  if (!capabilities?.experimental?.["claude/channel"])
    return {
      action: "skip",
      kind: "capability",
      reason: "server did not declare claude/channel capability"
    };
  if (!isChannelsEnabled())
    return {
      action: "skip",
      kind: "disabled",
      reason: "channels feature is not currently available"
    };
  if (!getClaudeAIOAuthTokens()?.accessToken)
    return {
      action: "skip",
      kind: "auth",
      reason: "channels requires claude.ai authentication (run /login)"
    };
  let sub = getSubscriptionType(), managed = sub === "team" || sub === "enterprise", policy = managed ? getSettingsForSource("policySettings") : void 0;
  if (managed && policy?.channelsEnabled !== !0)
    return {
      action: "skip",
      kind: "policy",
      reason: "channels not enabled by org policy (set channelsEnabled: true in managed settings)"
    };
  let entry = findChannelEntry(serverName, getAllowedChannels());
  if (!entry)
    return {
      action: "skip",
      kind: "session",
      reason: `server ${serverName} not in --channels list for this session`
    };
  if (entry.kind === "plugin") {
    let actual = pluginSource ? parsePluginIdentifier(pluginSource).marketplace : void 0;
    if (actual !== entry.marketplace)
      return {
        action: "skip",
        kind: "marketplace",
        reason: `you asked for plugin:${entry.name}@${entry.marketplace} but the installed ${entry.name} plugin is from ${actual ?? "an unknown source"}`
      };
    if (!entry.dev) {
      let { entries: entries2, source } = getEffectiveChannelAllowlist(sub, policy?.allowedChannelPlugins);
      if (!entries2.some((e) => e.plugin === entry.name && e.marketplace === entry.marketplace))
        return {
          action: "skip",
          kind: "allowlist",
          reason: source === "org" ? `plugin ${entry.name}@${entry.marketplace} is not on your org's approved channels list (set allowedChannelPlugins in managed settings)` : `plugin ${entry.name}@${entry.marketplace} is not on the approved channels allowlist (use --dangerously-load-development-channels for local dev)`
        };
    }
  } else if (!entry.dev)
    return {
      action: "skip",
      kind: "allowlist",
      reason: `server ${entry.name} is not on the approved channels allowlist (use --dangerously-load-development-channels for local dev)`
    };
  return { action: "register" };
}
var ChannelMessageNotificationSchema, CHANNEL_PERMISSION_METHOD = "notifications/claude/channel/permission", ChannelPermissionNotificationSchema, CHANNEL_PERMISSION_REQUEST_METHOD = "notifications/claude/channel/permission_request", SAFE_META_KEY;
var init_channelNotification = __esm(() => {
  init_v4();
  init_state();
  init_xml();
  init_auth14();
  init_pluginIdentifier();
  init_settings2();
  init_channelAllowlist();
  ChannelMessageNotificationSchema = lazySchema(() => exports_external.object({
    method: exports_external.literal("notifications/claude/channel"),
    params: exports_external.object({
      content: exports_external.string(),
      meta: exports_external.record(exports_external.string(), exports_external.string()).optional()
    })
  })), ChannelPermissionNotificationSchema = lazySchema(() => exports_external.object({
    method: exports_external.literal(CHANNEL_PERMISSION_METHOD),
    params: exports_external.object({
      request_id: exports_external.string(),
      behavior: exports_external.enum(["allow", "deny"])
    })
  })), SAFE_META_KEY = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
});
