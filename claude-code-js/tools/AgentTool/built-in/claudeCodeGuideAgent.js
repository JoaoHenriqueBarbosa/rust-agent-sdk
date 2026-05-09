// Original: src/tools/AgentTool/built-in/claudeCodeGuideAgent.ts
function getClaudeCodeGuideBasePrompt() {
  let localSearchHint = hasEmbeddedSearchTools() ? `${FILE_READ_TOOL_NAME}, \`find\`, and \`grep\`` : `${FILE_READ_TOOL_NAME}, ${GLOB_TOOL_NAME}, and ${GREP_TOOL_NAME}`;
  return `You are the Claude guide agent. Your primary responsibility is helping users understand and use Claude Code, the Claude Agent SDK, and the Claude API (formerly the Anthropic API) effectively.

**Your expertise spans three domains:**

1. **Claude Code** (the CLI tool): Installation, configuration, hooks, skills, MCP servers, keyboard shortcuts, IDE integrations, settings, and workflows.

2. **Claude Agent SDK**: A framework for building custom AI agents based on Claude Code technology. Available for Node.js/TypeScript and Python.

3. **Claude API**: The Claude API (formerly known as the Anthropic API) for direct model interaction, tool use, and integrations.

**Documentation sources:**

- **Claude Code docs** (${CLAUDE_CODE_DOCS_MAP_URL}): Fetch this for questions about the Claude Code CLI tool, including:
  - Installation, setup, and getting started
  - Hooks (pre/post command execution)
  - Custom skills
  - MCP server configuration
  - IDE integrations (VS Code, JetBrains)
  - Settings files and configuration
  - Keyboard shortcuts and hotkeys
  - Subagents and plugins
  - Sandboxing and security

- **Claude Agent SDK docs** (${CDP_DOCS_MAP_URL}): Fetch this for questions about building agents with the SDK, including:
  - SDK overview and getting started (Python and TypeScript)
  - Agent configuration + custom tools
  - Session management and permissions
  - MCP integration in agents
  - Hosting and deployment
  - Cost tracking and context management
  Note: Agent SDK docs are part of the Claude API documentation at the same URL.

- **Claude API docs** (${CDP_DOCS_MAP_URL}): Fetch this for questions about the Claude API (formerly the Anthropic API), including:
  - Messages API and streaming
  - Tool use (function calling) and Anthropic-defined tools (computer use, code execution, web search, text editor, bash, programmatic tool calling, tool search tool, context editing, Files API, structured outputs)
  - Vision, PDF support, and citations
  - Extended thinking and structured outputs
  - MCP connector for remote MCP servers
  - Cloud provider integrations (Bedrock, Vertex AI, Foundry)

**Approach:**
1. Determine which domain the user's question falls into
2. Use ${WEB_FETCH_TOOL_NAME} to fetch the appropriate docs map
3. Identify the most relevant documentation URLs from the map
4. Fetch the specific documentation pages
5. Provide clear, actionable guidance based on official documentation
6. Use ${WEB_SEARCH_TOOL_NAME} if docs don't cover the topic
7. Reference local project files (CLAUDE.md, .claude/ directory) when relevant using ${localSearchHint}

**Guidelines:**
- Always prioritize official documentation over assumptions
- Keep responses concise and actionable
- Include specific examples or code snippets when helpful
- Reference exact documentation URLs in your responses
- Help users discover features by proactively suggesting related commands, shortcuts, or capabilities

Complete the user's request by providing accurate, documentation-based guidance.`;
}
function getFeedbackGuideline() {
  if (isUsing3PServices())
    return "- When you cannot find an answer or the feature doesn't exist, direct the user to Do not report issues to Anthropic.";
  return "- When you cannot find an answer or the feature doesn't exist, direct the user to use /feedback to report a feature request or bug";
}
var CLAUDE_CODE_DOCS_MAP_URL = "https://code.claude.com/docs/en/claude_code_docs_map.md", CDP_DOCS_MAP_URL = "https://platform.claude.com/llms.txt", CLAUDE_CODE_GUIDE_AGENT_TYPE = "claude-code-guide", CLAUDE_CODE_GUIDE_AGENT;
var init_claudeCodeGuideAgent = __esm(() => {
  init_prompt2();
  init_prompt5();
  init_prompt3();
  init_prompt6();
  init_auth14();
  init_embeddedTools();
  init_settings2();
  init_slowOperations();
  CLAUDE_CODE_GUIDE_AGENT = {
    agentType: CLAUDE_CODE_GUIDE_AGENT_TYPE,
    whenToUse: `Use this agent when the user asks questions ("Can Claude...", "Does Claude...", "How do I...") about: (1) Claude Code (the CLI tool) - features, hooks, slash commands, MCP servers, settings, IDE integrations, keyboard shortcuts; (2) Claude Agent SDK - building custom agents; (3) Claude API (formerly Anthropic API) - API usage, tool use, Anthropic SDK usage. **IMPORTANT:** Before spawning a new agent, check if there is already a running or recently completed claude-code-guide agent that you can continue via ${SEND_MESSAGE_TOOL_NAME}.`,
    tools: hasEmbeddedSearchTools() ? [
      BASH_TOOL_NAME,
      FILE_READ_TOOL_NAME,
      WEB_FETCH_TOOL_NAME,
      WEB_SEARCH_TOOL_NAME
    ] : [
      GLOB_TOOL_NAME,
      GREP_TOOL_NAME,
      FILE_READ_TOOL_NAME,
      WEB_FETCH_TOOL_NAME,
      WEB_SEARCH_TOOL_NAME
    ],
    source: "built-in",
    baseDir: "built-in",
    model: "haiku",
    permissionMode: "dontAsk",
    getSystemPrompt({ toolUseContext }) {
      let commands7 = toolUseContext.options.commands, contextSections = [], customCommands = commands7.filter((cmd) => cmd.type === "prompt");
      if (customCommands.length > 0) {
        let commandList = customCommands.map((cmd) => `- /${cmd.name}: ${cmd.description}`).join(`
`);
        contextSections.push(`**Available custom skills in this project:**
${commandList}`);
      }
      let customAgents = toolUseContext.options.agentDefinitions.activeAgents.filter((a2) => a2.source !== "built-in");
      if (customAgents.length > 0) {
        let agentList = customAgents.map((a2) => `- ${a2.agentType}: ${a2.whenToUse}`).join(`
`);
        contextSections.push(`**Available custom agents configured:**
${agentList}`);
      }
      let mcpClients = toolUseContext.options.mcpClients;
      if (mcpClients && mcpClients.length > 0) {
        let mcpList = mcpClients.map((client15) => `- ${client15.name}`).join(`
`);
        contextSections.push(`**Configured MCP servers:**
${mcpList}`);
      }
      let pluginCommands = commands7.filter((cmd) => cmd.type === "prompt" && cmd.source === "plugin");
      if (pluginCommands.length > 0) {
        let pluginList = pluginCommands.map((cmd) => `- /${cmd.name}: ${cmd.description}`).join(`
`);
        contextSections.push(`**Available plugin skills:**
${pluginList}`);
      }
      let settings = getSettings_DEPRECATED();
      if (Object.keys(settings).length > 0) {
        let settingsJson = jsonStringify(settings, null, 2);
        contextSections.push(`**User's settings.json:**
\`\`\`json
${settingsJson}
\`\`\``);
      }
      let feedbackGuideline = getFeedbackGuideline(), basePromptWithFeedback = `${getClaudeCodeGuideBasePrompt()}
${feedbackGuideline}`;
      if (contextSections.length > 0)
        return `${basePromptWithFeedback}

---

# User's Current Configuration

The user has the following custom setup in their environment:

${contextSections.join(`

`)}

When answering questions, consider these configured features and proactively suggest them when relevant.`;
      return basePromptWithFeedback;
    }
  };
});
