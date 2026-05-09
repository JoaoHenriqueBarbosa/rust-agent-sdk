// function: getMCPUserAgent
function getMCPUserAgent() {
  let parts = [];
  if (process.env.CLAUDE_CODE_ENTRYPOINT)
    parts.push(process.env.CLAUDE_CODE_ENTRYPOINT);
  if (process.env.CLAUDE_AGENT_SDK_VERSION)
    parts.push(`agent-sdk/${process.env.CLAUDE_AGENT_SDK_VERSION}`);
  if (process.env.CLAUDE_AGENT_SDK_CLIENT_APP)
    parts.push(`client-app/${process.env.CLAUDE_AGENT_SDK_CLIENT_APP}`);
  return `claude-code/2.1.90${parts.length > 0 ? ` (${parts.join(", ")})` : ""}`;
}
