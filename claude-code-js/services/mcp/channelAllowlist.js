// Original: src/services/mcp/channelAllowlist.ts
var exports_channelAllowlist = {};
__export(exports_channelAllowlist, {
  isChannelsEnabled: () => isChannelsEnabled,
  isChannelAllowlisted: () => isChannelAllowlisted,
  getChannelAllowlist: () => getChannelAllowlist
});
function getChannelAllowlist() {
  let raw = [], parsed = ChannelAllowlistSchema().safeParse(raw);
  return parsed.success ? parsed.data : [];
}
function isChannelsEnabled() {
  return !1;
}
function isChannelAllowlisted(pluginSource) {
  if (!pluginSource)
    return !1;
  let { name: name3, marketplace } = parsePluginIdentifier(pluginSource);
  if (!marketplace)
    return !1;
  return getChannelAllowlist().some((e) => e.plugin === name3 && e.marketplace === marketplace);
}
var ChannelAllowlistSchema;
var init_channelAllowlist = __esm(() => {
  init_v4();
  init_pluginIdentifier();
  ChannelAllowlistSchema = lazySchema(() => exports_external.array(exports_external.object({
    marketplace: exports_external.string(),
    plugin: exports_external.string()
  })));
});
