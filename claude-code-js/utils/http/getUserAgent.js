// function: getUserAgent
function getUserAgent() {
  let agentSdkVersion = process.env.CLAUDE_AGENT_SDK_VERSION ? `, agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}` : "", clientApp = process.env.CLAUDE_AGENT_SDK_CLIENT_APP ? `, client-app/${process.env.CLAUDE_AGENT_SDK_CLIENT_APP}` : "", workload = getWorkload(), workloadSuffix = workload ? `, workload/${workload}` : "";
  return `claude-cli/2.1.90 (external, ${process.env.CLAUDE_CODE_ENTRYPOINT ?? "cli"}${agentSdkVersion}${clientApp}${workloadSuffix})`;
}
