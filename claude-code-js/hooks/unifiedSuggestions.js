// Original: src/hooks/unifiedSuggestions.ts
import { basename as basename53 } from "path";
function createSuggestionFromSource(source) {
  switch (source.type) {
    case "file":
      return {
        id: `file-${source.path}`,
        displayText: source.displayText,
        description: source.description
      };
    case "mcp_resource":
      return {
        id: `mcp-resource-${source.server}__${source.uri}`,
        displayText: source.displayText,
        description: source.description
      };
    case "agent":
      return {
        id: `agent-${source.agentType}`,
        displayText: source.displayText,
        description: source.description,
        color: source.color
      };
  }
}
function truncateDescription(description) {
  return truncateToWidth(description, DESCRIPTION_MAX_LENGTH);
}
function generateAgentSuggestions(agents2, query3, showOnEmpty = !1) {
  if (!query3 && !showOnEmpty)
    return [];
  try {
    let agentSources = agents2.map((agent) => ({
      type: "agent",
      displayText: `${agent.agentType} (agent)`,
      description: truncateDescription(agent.whenToUse),
      agentType: agent.agentType,
      color: getAgentColor(agent.agentType)
    }));
    if (!query3)
      return agentSources;
    let queryLower = query3.toLowerCase();
    return agentSources.filter((agent) => agent.agentType.toLowerCase().includes(queryLower) || agent.displayText.toLowerCase().includes(queryLower));
  } catch (error44) {
    return logError2(error44), [];
  }
}
async function generateUnifiedSuggestions(query3, mcpResources, agents2, showOnEmpty = !1) {
  if (!query3 && !showOnEmpty)
    return [];
  let [fileSuggestions, agentSources] = await Promise.all([
    generateFileSuggestions(query3, showOnEmpty),
    Promise.resolve(generateAgentSuggestions(agents2, query3, showOnEmpty))
  ]), fileSources = fileSuggestions.map((suggestion) => ({
    type: "file",
    displayText: suggestion.displayText,
    description: suggestion.description,
    path: suggestion.displayText,
    filename: basename53(suggestion.displayText),
    score: suggestion.metadata?.score
  })), mcpSources = Object.values(mcpResources).flat().map((resource) => ({
    type: "mcp_resource",
    displayText: `${resource.server}:${resource.uri}`,
    description: truncateDescription(resource.description || resource.name || resource.uri),
    server: resource.server,
    uri: resource.uri,
    name: resource.name || resource.uri
  }));
  if (!query3)
    return [...fileSources, ...mcpSources, ...agentSources].slice(0, MAX_UNIFIED_SUGGESTIONS).map(createSuggestionFromSource);
  let nonFileSources = [...mcpSources, ...agentSources], scoredResults = [];
  for (let fileSource of fileSources)
    scoredResults.push({
      source: fileSource,
      score: fileSource.score ?? 0.5
    });
  if (nonFileSources.length > 0) {
    let fuseResults = new Fuse(nonFileSources, {
      includeScore: !0,
      threshold: 0.6,
      keys: [
        { name: "displayText", weight: 2 },
        { name: "name", weight: 3 },
        { name: "server", weight: 1 },
        { name: "description", weight: 1 },
        { name: "agentType", weight: 3 }
      ]
    }).search(query3, { limit: MAX_UNIFIED_SUGGESTIONS });
    for (let result of fuseResults)
      scoredResults.push({
        source: result.item,
        score: result.score ?? 0.5
      });
  }
  return scoredResults.sort((a2, b) => a2.score - b.score), scoredResults.slice(0, MAX_UNIFIED_SUGGESTIONS).map((r4) => r4.source).map(createSuggestionFromSource);
}
var MAX_UNIFIED_SUGGESTIONS = 15, DESCRIPTION_MAX_LENGTH = 60;
var init_unifiedSuggestions = __esm(() => {
  init_fuse();
  init_fileSuggestions();
  init_agentColorManager();
  init_format();
  init_log3();
});
