// function: reregisterChannelHandlerAfterReconnect
function reregisterChannelHandlerAfterReconnect(connection7) {
  if (connection7.type !== "connected")
    return;
  if (gateChannelServer(connection7.name, connection7.capabilities, connection7.config.pluginSource).action !== "register")
    return;
  let entry = findChannelEntry(connection7.name, getAllowedChannels()), pluginId = entry?.kind === "plugin" ? `${entry.name}@${entry.marketplace}` : void 0;
  logMCPDebug(connection7.name, "Channel notifications re-registered after reconnect"), connection7.client.setNotificationHandler(ChannelMessageNotificationSchema(), async (notification) => {
    let { content, meta } = notification.params;
    logMCPDebug(connection7.name, `notifications/claude/channel: ${content.slice(0, 80)}`), logEvent("tengu_mcp_channel_message", {
      content_length: content.length,
      meta_key_count: Object.keys(meta ?? {}).length,
      entry_kind: entry?.kind,
      is_dev: entry?.dev ?? !1,
      plugin: pluginId
    }), enqueue({
      mode: "prompt",
      value: wrapChannelMessage(connection7.name, content, meta),
      priority: "next",
      isMeta: !0,
      origin: { kind: "channel", server: connection7.name },
      skipSlashCommands: !0
    });
  });
}
