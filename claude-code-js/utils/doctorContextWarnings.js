// Original: src/utils/doctorContextWarnings.ts
async function checkClaudeMdFiles() {
  let largeFiles = getLargeMemoryFiles(await getMemoryFiles());
  if (largeFiles.length === 0)
    return null;
  let details = largeFiles.sort((a2, b) => b.content.length - a2.content.length).map((file2) => `${file2.path}: ${file2.content.length.toLocaleString()} chars`);
  return {
    type: "claudemd_files",
    severity: "warning",
    message: largeFiles.length === 1 ? `Large CLAUDE.md file detected (${largeFiles[0].content.length.toLocaleString()} chars > ${MAX_MEMORY_CHARACTER_COUNT.toLocaleString()})` : `${largeFiles.length} large CLAUDE.md files detected (each > ${MAX_MEMORY_CHARACTER_COUNT.toLocaleString()} chars)`,
    details,
    currentValue: largeFiles.length,
    threshold: MAX_MEMORY_CHARACTER_COUNT
  };
}
async function checkAgentDescriptions(agentInfo) {
  if (!agentInfo)
    return null;
  let totalTokens = getAgentDescriptionsTotalTokens(agentInfo);
  if (totalTokens <= AGENT_DESCRIPTIONS_THRESHOLD)
    return null;
  let agentTokens = agentInfo.activeAgents.filter((a2) => a2.source !== "built-in").map((agent) => {
    let description = `${agent.agentType}: ${agent.whenToUse}`;
    return {
      name: agent.agentType,
      tokens: roughTokenCountEstimation(description)
    };
  }).sort((a2, b) => b.tokens - a2.tokens), details = agentTokens.slice(0, 5).map((agent) => `${agent.name}: ~${agent.tokens.toLocaleString()} tokens`);
  if (agentTokens.length > 5)
    details.push(`(${agentTokens.length - 5} more custom agents)`);
  return {
    type: "agent_descriptions",
    severity: "warning",
    message: `Large agent descriptions (~${totalTokens.toLocaleString()} tokens > ${AGENT_DESCRIPTIONS_THRESHOLD.toLocaleString()})`,
    details,
    currentValue: totalTokens,
    threshold: AGENT_DESCRIPTIONS_THRESHOLD
  };
}
async function checkMcpTools(tools, getToolPermissionContext, agentInfo) {
  let mcpTools = tools.filter((tool) => tool.isMcp);
  if (mcpTools.length === 0)
    return null;
  try {
    let model = getMainLoopModel(), { mcpToolTokens, mcpToolDetails } = await countMcpToolTokens(tools, getToolPermissionContext, agentInfo, model);
    if (mcpToolTokens <= MCP_TOOLS_THRESHOLD)
      return null;
    let toolsByServer = /* @__PURE__ */ new Map;
    for (let tool of mcpToolDetails) {
      let serverName = tool.name.split("__")[1] || "unknown", current = toolsByServer.get(serverName) || { count: 0, tokens: 0 };
      toolsByServer.set(serverName, {
        count: current.count + 1,
        tokens: current.tokens + tool.tokens
      });
    }
    let sortedServers = Array.from(toolsByServer.entries()).sort((a2, b) => b[1].tokens - a2[1].tokens), details = sortedServers.slice(0, 5).map(([name3, info]) => `${name3}: ${info.count} tools (~${info.tokens.toLocaleString()} tokens)`);
    if (sortedServers.length > 5)
      details.push(`(${sortedServers.length - 5} more servers)`);
    return {
      type: "mcp_tools",
      severity: "warning",
      message: `Large MCP tools context (~${mcpToolTokens.toLocaleString()} tokens > ${MCP_TOOLS_THRESHOLD.toLocaleString()})`,
      details,
      currentValue: mcpToolTokens,
      threshold: MCP_TOOLS_THRESHOLD
    };
  } catch (_error) {
    let estimatedTokens = mcpTools.reduce((total, tool) => {
      let chars = (tool.name?.length || 0) + tool.description.length;
      return total + roughTokenCountEstimation(chars.toString());
    }, 0);
    if (estimatedTokens <= MCP_TOOLS_THRESHOLD)
      return null;
    return {
      type: "mcp_tools",
      severity: "warning",
      message: `Large MCP tools context (~${estimatedTokens.toLocaleString()} tokens estimated > ${MCP_TOOLS_THRESHOLD.toLocaleString()})`,
      details: [
        `${mcpTools.length} MCP tools detected (token count estimated)`
      ],
      currentValue: estimatedTokens,
      threshold: MCP_TOOLS_THRESHOLD
    };
  }
}
async function checkUnreachableRules(getToolPermissionContext) {
  let context7 = await getToolPermissionContext(), sandboxAutoAllowEnabled = SandboxManager2.isSandboxingEnabled() && SandboxManager2.isAutoAllowBashIfSandboxedEnabled(), unreachable = detectUnreachableRules(context7, {
    sandboxAutoAllowEnabled
  });
  if (unreachable.length === 0)
    return null;
  let details = unreachable.flatMap((r4) => [
    `${permissionRuleValueToString(r4.rule.ruleValue)}: ${r4.reason}`,
    `  Fix: ${r4.fix}`
  ]);
  return {
    type: "unreachable_rules",
    severity: "warning",
    message: `${unreachable.length} ${plural(unreachable.length, "unreachable permission rule")} detected`,
    details,
    currentValue: unreachable.length,
    threshold: 0
  };
}
async function checkContextWarnings(tools, agentInfo, getToolPermissionContext) {
  let [claudeMdWarning, agentWarning, mcpWarning, unreachableRulesWarning] = await Promise.all([
    checkClaudeMdFiles(),
    checkAgentDescriptions(agentInfo),
    checkMcpTools(tools, getToolPermissionContext, agentInfo),
    checkUnreachableRules(getToolPermissionContext)
  ]);
  return {
    claudeMdWarning,
    agentWarning,
    mcpWarning,
    unreachableRulesWarning
  };
}
var MCP_TOOLS_THRESHOLD = 25000;
var init_doctorContextWarnings = __esm(() => {
  init_tokenEstimation();
  init_analyzeContext();
  init_claudemd();
  init_model();
  init_permissionRuleParser();
  init_shadowedRuleDetection();
  init_sandbox_adapter();
  init_statusNoticeHelpers();
});
