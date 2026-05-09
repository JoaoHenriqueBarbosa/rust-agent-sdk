// function: getAllMcpConfigs
async function getAllMcpConfigs() {
  if (doesEnterpriseMcpConfigExist())
    return getClaudeCodeMcpConfigs();
  let claudeaiPromise = fetchClaudeAIMcpConfigsIfEligible(), { servers: claudeCodeServers, errors: errors8 } = await getClaudeCodeMcpConfigs({}, claudeaiPromise), { allowed: claudeaiMcpServers } = filterMcpServersByPolicy(await claudeaiPromise), { servers: dedupedClaudeAi } = dedupClaudeAiMcpServers(claudeaiMcpServers, claudeCodeServers);
  return { servers: Object.assign({}, dedupedClaudeAi, claudeCodeServers), errors: errors8 };
}
