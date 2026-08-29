// Original: src/utils/suggestions/slackChannelSuggestions.ts
function findSlackClient(clients) {
  return clients.find((c3) => c3.type === "connected" && c3.name.includes("slack"));
}
async function fetchChannels(clients, query3) {
  let slackClient = findSlackClient(clients);
  if (!slackClient || slackClient.type !== "connected")
    return [];
  try {
    let content = (await slackClient.client.callTool({
      name: SLACK_SEARCH_TOOL,
      arguments: {
        query: query3,
        limit: 20,
        channel_types: "public_channel,private_channel"
      }
    }, void 0, { timeout: 5000 })).content;
    if (!Array.isArray(content))
      return [];
    let rawText = content.filter((c3) => c3.type === "text").map((c3) => c3.text).join(`
`);
    return parseChannels(unwrapResults(rawText));
  } catch (error44) {
    return logForDebugging(`Failed to fetch Slack channels: ${error44}`), [];
  }
}
function unwrapResults(text2) {
  let trimmed = text2.trim();
  if (!trimmed.startsWith("{"))
    return text2;
  try {
    let parsed = resultsEnvelopeSchema().safeParse(jsonParse(trimmed));
    if (parsed.success)
      return parsed.data.results;
  } catch {}
  return text2;
}
function parseChannels(text2) {
  let channels = [], seen = /* @__PURE__ */ new Set;
  for (let line of text2.split(`
`)) {
    let m4 = line.match(/^Name:\s*#?([a-z0-9][a-z0-9_-]{0,79})\s*$/);
    if (m4 && !seen.has(m4[1]))
      seen.add(m4[1]), channels.push(m4[1]);
  }
  return channels;
}
function hasSlackMcpServer(clients) {
  return findSlackClient(clients) !== void 0;
}
function getKnownChannelsVersion() {
  return knownChannelsVersion;
}
function findSlackChannelPositions(text2) {
  let positions = [], re = /(^|\s)#([a-z0-9][a-z0-9_-]{0,79})(?=\s|$)/g, m4;
  while ((m4 = re.exec(text2)) !== null) {
    if (!knownChannels.has(m4[2]))
      continue;
    let start = m4.index + m4[1].length;
    positions.push({ start, end: start + 1 + m4[2].length });
  }
  return positions;
}
function mcpQueryFor(searchToken) {
  let lastSep = Math.max(searchToken.lastIndexOf("-"), searchToken.lastIndexOf("_"));
  return lastSep > 0 ? searchToken.slice(0, lastSep) : searchToken;
}
function findReusableCacheEntry(mcpQuery, searchToken) {
  let best, bestLen = 0;
  for (let [key3, channels] of cache8)
    if (mcpQuery.startsWith(key3) && key3.length > bestLen && channels.some((c3) => c3.startsWith(searchToken)))
      best = channels, bestLen = key3.length;
  return best;
}
async function getSlackChannelSuggestions(clients, searchToken) {
  if (!searchToken)
    return [];
  let mcpQuery = mcpQueryFor(searchToken), lower = searchToken.toLowerCase(), channels = cache8.get(mcpQuery) ?? findReusableCacheEntry(mcpQuery, lower);
  if (!channels)
    if (inflightQuery === mcpQuery && inflightPromise)
      channels = await inflightPromise;
    else {
      inflightQuery = mcpQuery, inflightPromise = fetchChannels(clients, mcpQuery), channels = await inflightPromise, cache8.set(mcpQuery, channels);
      let before2 = knownChannels.size;
      for (let c3 of channels)
        knownChannels.add(c3);
      if (knownChannels.size !== before2)
        knownChannelsVersion++, knownChannelsChanged.emit();
      if (cache8.size > 50)
        cache8.delete(cache8.keys().next().value);
      if (inflightQuery === mcpQuery)
        inflightQuery = null, inflightPromise = null;
    }
  return channels.filter((c3) => c3.startsWith(lower)).sort().slice(0, 10).map((c3) => ({
    id: `slack-channel-${c3}`,
    displayText: `#${c3}`
  }));
}
var SLACK_SEARCH_TOOL = "slack_search_channels", cache8, knownChannels, knownChannelsVersion = 0, knownChannelsChanged, subscribeKnownChannels, inflightQuery = null, inflightPromise = null, resultsEnvelopeSchema;
var init_slackChannelSuggestions = __esm(() => {
  init_zod();
  init_debug();
  init_slowOperations();
  cache8 = /* @__PURE__ */ new Map, knownChannels = /* @__PURE__ */ new Set, knownChannelsChanged = createSignal(), subscribeKnownChannels = knownChannelsChanged.subscribe;
  resultsEnvelopeSchema = lazySchema(() => exports_external2.object({ results: exports_external2.string() }));
});
