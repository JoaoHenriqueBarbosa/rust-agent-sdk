// function: handleChannelEnable
function handleChannelEnable(requestId, serverName, connectionPool, output) {
  let respondError = (error44) => output.enqueue({
    type: "control_response",
    response: { subtype: "error", request_id: requestId, error: error44 }
  }), connection7 = connectionPool.find((c3) => c3.name === serverName && c3.type === "connected");
  if (!connection7 || connection7.type !== "connected")
    return respondError(`server ${serverName} is not connected`);
  let pluginSource = connection7.config.pluginSource, parsed = pluginSource ? parsePluginIdentifier(pluginSource) : void 0;
  if (!parsed?.marketplace)
    return respondError(`server ${serverName} is not plugin-sourced; channel_enable requires a marketplace plugin`);
  let entry = {
    kind: "plugin",
    name: parsed.name,
    marketplace: parsed.marketplace
  }, prior = getAllowedChannels(), already = prior.some((e) => e.kind === "plugin" && e.name === entry.name && e.marketplace === entry.marketplace);
  if (!already)
    setAllowedChannels([...prior, entry]);
  let gate = gateChannelServer(serverName, connection7.capabilities, pluginSource);
  if (gate.action === "skip") {
    if (!already)
      setAllowedChannels(prior);
    return respondError(gate.reason);
  }
  let pluginId = `${entry.name}@${entry.marketplace}`;
  logMCPDebug(serverName, "Channel notifications registered"), logEvent("tengu_mcp_channel_enable", { plugin: pluginId }), connection7.client.setNotificationHandler(ChannelMessageNotificationSchema(), async (notification) => {
    let { content, meta } = notification.params;
    logMCPDebug(serverName, `notifications/claude/channel: ${content.slice(0, 80)}`), logEvent("tengu_mcp_channel_message", {
      content_length: content.length,
      meta_key_count: Object.keys(meta ?? {}).length,
      entry_kind: "plugin",
      is_dev: !1,
      plugin: pluginId
    }), enqueue({
      mode: "prompt",
      value: wrapChannelMessage(serverName, content, meta),
      priority: "next",
      isMeta: !0,
      origin: { kind: "channel", server: serverName },
      skipSlashCommands: !0
    });
  }), output.enqueue({
    type: "control_response",
    response: {
      subtype: "success",
      request_id: requestId,
      response: void 0
    }
  });
}
