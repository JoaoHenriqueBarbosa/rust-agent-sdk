// Original: src/utils/messages/systemInit.ts
import { randomUUID as randomUUID45 } from "crypto";
function sdkCompatToolName(name3) {
  return name3 === AGENT_TOOL_NAME ? LEGACY_AGENT_TOOL_NAME : name3;
}
function buildSystemInitMessage(inputs) {
  let outputStyle2 = getSettings_DEPRECATED()?.outputStyle ?? DEFAULT_OUTPUT_STYLE_NAME, initMessage = {
    type: "system",
    subtype: "init",
    cwd: getCwd(),
    session_id: getSessionId(),
    tools: inputs.tools.map((tool) => sdkCompatToolName(tool.name)),
    mcp_servers: inputs.mcpClients.map((client16) => ({
      name: client16.name,
      status: client16.type
    })),
    model: inputs.model,
    permissionMode: inputs.permissionMode,
    slash_commands: inputs.commands.filter((c3) => c3.userInvocable !== !1).map((c3) => c3.name),
    apiKeySource: getAnthropicApiKeyWithSource().source,
    betas: getSdkBetas(),
    claude_code_version: "2.1.90",
    output_style: outputStyle2,
    agents: inputs.agents.map((agent) => agent.agentType),
    skills: inputs.skills.filter((s2) => s2.userInvocable !== !1).map((skill) => skill.name),
    plugins: inputs.plugins.map((plugin2) => ({
      name: plugin2.name,
      path: plugin2.path,
      source: plugin2.source
    })),
    uuid: randomUUID45()
  };
  return initMessage.fast_mode_state = getFastModeState(inputs.model, inputs.fastMode), initMessage;
}
var init_systemInit = __esm(() => {
  init_state();
  init_outputStyles();
  init_constants3();
  init_auth14();
  init_cwd2();
  init_fastMode();
  init_settings2();
});
