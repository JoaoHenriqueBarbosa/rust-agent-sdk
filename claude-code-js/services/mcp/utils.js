// Original: src/services/mcp/utils.ts
import { createHash as createHash8 } from "crypto";
import { join as join52 } from "path";
function filterToolsByServer(tools, serverName) {
  let prefix = `mcp__${normalizeNameForMCP(serverName)}__`;
  return tools.filter((tool) => tool.name?.startsWith(prefix));
}
function commandBelongsToServer(command12, serverName) {
  let normalized = normalizeNameForMCP(serverName), name3 = command12.name;
  if (!name3)
    return !1;
  return name3.startsWith(`mcp__${normalized}__`) || name3.startsWith(`${normalized}:`);
}
function filterMcpPromptsByServer(commands7, serverName) {
  return commands7.filter((c3) => commandBelongsToServer(c3, serverName) && !(c3.type === "prompt" && c3.loadedFrom === "mcp"));
}
function excludeToolsByServer(tools, serverName) {
  let prefix = `mcp__${normalizeNameForMCP(serverName)}__`;
  return tools.filter((tool) => !tool.name?.startsWith(prefix));
}
function excludeCommandsByServer(commands7, serverName) {
  return commands7.filter((c3) => !commandBelongsToServer(c3, serverName));
}
function excludeResourcesByServer(resources, serverName) {
  let result = { ...resources };
  return delete result[serverName], result;
}
function hashMcpConfig(config10) {
  let { scope: _scope, ...rest } = config10, stable = jsonStringify(rest, (_k, v2) => {
    if (v2 && typeof v2 === "object" && !Array.isArray(v2)) {
      let obj = v2, sorted = {};
      for (let k3 of Object.keys(obj).sort())
        sorted[k3] = obj[k3];
      return sorted;
    }
    return v2;
  });
  return createHash8("sha256").update(stable).digest("hex").slice(0, 16);
}
function excludeStalePluginClients(mcp, configs) {
  let stale = mcp.clients.filter((c3) => {
    let fresh = configs[c3.name];
    if (!fresh)
      return c3.config.scope === "dynamic";
    return hashMcpConfig(c3.config) !== hashMcpConfig(fresh);
  });
  if (stale.length === 0)
    return { ...mcp, stale: [] };
  let { tools, commands: commands7, resources } = mcp;
  for (let s2 of stale)
    tools = excludeToolsByServer(tools, s2.name), commands7 = excludeCommandsByServer(commands7, s2.name), resources = excludeResourcesByServer(resources, s2.name);
  let staleNames = new Set(stale.map((c3) => c3.name));
  return {
    clients: mcp.clients.filter((c3) => !staleNames.has(c3.name)),
    tools,
    commands: commands7,
    resources,
    stale
  };
}
function isToolFromMcpServer(toolName, serverName) {
  return mcpInfoFromString(toolName)?.serverName === serverName;
}
function isMcpTool(tool) {
  return tool.name?.startsWith("mcp__") || tool.isMcp === !0;
}
function describeMcpConfigFilePath(scope) {
  switch (scope) {
    case "user":
      return getGlobalClaudeFile();
    case "project":
      return join52(getCwd(), ".mcp.json");
    case "local":
      return `${getGlobalClaudeFile()} [project: ${getCwd()}]`;
    case "dynamic":
      return "Dynamically configured";
    case "enterprise":
      return getEnterpriseMcpFilePath();
    case "claudeai":
      return "claude.ai";
    default:
      return scope;
  }
}
function getScopeLabel(scope) {
  switch (scope) {
    case "local":
      return "Local config (private to you in this project)";
    case "project":
      return "Project config (shared via .mcp.json)";
    case "user":
      return "User config (available in all your projects)";
    case "dynamic":
      return "Dynamic config (from command line)";
    case "enterprise":
      return "Enterprise config (managed by your organization)";
    case "claudeai":
      return "claude.ai config";
    default:
      return scope;
  }
}
function ensureConfigScope(scope) {
  if (!scope)
    return "local";
  if (!ConfigScopeSchema().options.includes(scope))
    throw Error(`Invalid scope: ${scope}. Must be one of: ${ConfigScopeSchema().options.join(", ")}`);
  return scope;
}
function ensureTransport(type) {
  if (!type)
    return "stdio";
  if (type !== "stdio" && type !== "sse" && type !== "http")
    throw Error(`Invalid transport type: ${type}. Must be one of: stdio, sse, http`);
  return type;
}
function parseHeaders(headerArray) {
  let headers = {};
  for (let header of headerArray) {
    let colonIndex = header.indexOf(":");
    if (colonIndex === -1)
      throw Error(`Invalid header format: "${header}". Expected format: "Header-Name: value"`);
    let key2 = header.substring(0, colonIndex).trim(), value = header.substring(colonIndex + 1).trim();
    if (!key2)
      throw Error(`Invalid header: "${header}". Header name cannot be empty.`);
    headers[key2] = value;
  }
  return headers;
}
function getProjectMcpServerStatus(serverName) {
  let settings = getSettings_DEPRECATED(), normalizedName = normalizeNameForMCP(serverName);
  if (settings?.disabledMcpjsonServers?.some((name3) => normalizeNameForMCP(name3) === normalizedName))
    return "rejected";
  if (settings?.enabledMcpjsonServers?.some((name3) => normalizeNameForMCP(name3) === normalizedName) || settings?.enableAllProjectMcpServers)
    return "approved";
  if (hasSkipDangerousModePermissionPrompt() && isSettingSourceEnabled("projectSettings"))
    return "approved";
  if (getIsNonInteractiveSession() && isSettingSourceEnabled("projectSettings"))
    return "approved";
  return "pending";
}
function getMcpServerScopeFromToolName(toolName) {
  if (!isMcpTool({ name: toolName }))
    return null;
  let mcpInfo = mcpInfoFromString(toolName);
  if (!mcpInfo)
    return null;
  let serverConfig = getMcpConfigByName(mcpInfo.serverName);
  if (!serverConfig && mcpInfo.serverName.startsWith("claude_ai_"))
    return "claudeai";
  return serverConfig?.scope ?? null;
}
function isStdioConfig(config10) {
  return config10.type === "stdio" || config10.type === void 0;
}
function isSSEConfig(config10) {
  return config10.type === "sse";
}
function isHTTPConfig(config10) {
  return config10.type === "http";
}
function isWebSocketConfig(config10) {
  return config10.type === "ws";
}
function extractAgentMcpServers(agents) {
  let serverMap = /* @__PURE__ */ new Map;
  for (let agent of agents) {
    if (!agent.mcpServers?.length)
      continue;
    for (let spec of agent.mcpServers) {
      if (typeof spec === "string")
        continue;
      let entries = Object.entries(spec);
      if (entries.length !== 1)
        continue;
      let [serverName, serverConfig] = entries[0], existing = serverMap.get(serverName);
      if (existing) {
        if (!existing.sourceAgents.includes(agent.agentType))
          existing.sourceAgents.push(agent.agentType);
      } else
        serverMap.set(serverName, {
          config: { ...serverConfig, name: serverName },
          sourceAgents: [agent.agentType]
        });
    }
  }
  let result = [];
  for (let [name3, { config: config10, sourceAgents }] of serverMap)
    if (isStdioConfig(config10))
      result.push({
        name: name3,
        sourceAgents,
        transport: "stdio",
        command: config10.command,
        needsAuth: !1
      });
    else if (isSSEConfig(config10))
      result.push({
        name: name3,
        sourceAgents,
        transport: "sse",
        url: config10.url,
        needsAuth: !0
      });
    else if (isHTTPConfig(config10))
      result.push({
        name: name3,
        sourceAgents,
        transport: "http",
        url: config10.url,
        needsAuth: !0
      });
    else if (isWebSocketConfig(config10))
      result.push({
        name: name3,
        sourceAgents,
        transport: "ws",
        url: config10.url,
        needsAuth: !1
      });
  return result.sort((a2, b) => a2.name.localeCompare(b.name));
}
function getLoggingSafeMcpBaseUrl(config10) {
  if (!("url" in config10) || typeof config10.url !== "string")
    return;
  try {
    let url3 = new URL(config10.url);
    return url3.search = "", url3.toString().replace(/\/$/, "");
  } catch {
    return;
  }
}
var init_utils7 = __esm(() => {
  init_state();
  init_cwd2();
  init_env();
  init_constants2();
  init_settings2();
  init_slowOperations();
  init_config8();
  init_mcpStringUtils();
  init_types2();
});
