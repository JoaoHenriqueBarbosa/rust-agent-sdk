// Original: src/skills/bundled/claudeInChrome.ts
function registerClaudeInChromeSkill() {
  registerBundledSkill({
    name: "claude-in-chrome",
    description: "Automates your Chrome browser to interact with web pages - clicking elements, filling forms, capturing screenshots, reading console logs, and navigating sites. Opens pages in new tabs within your existing Chrome session. Requires site-level permissions before executing (configured in the extension).",
    whenToUse: "When the user wants to interact with web pages, automate browser tasks, capture screenshots, read console logs, or perform any browser-based actions. Always invoke BEFORE attempting to use any mcp__claude-in-chrome__* tools.",
    allowedTools: CLAUDE_IN_CHROME_MCP_TOOLS,
    userInvocable: !0,
    isEnabled: () => shouldAutoEnableClaudeInChrome(),
    async getPromptForCommand(args) {
      let prompt = `${BASE_CHROME_PROMPT}
${SKILL_ACTIVATION_MESSAGE}`;
      if (args)
        prompt += `
## Task

${args}`;
      return [{ type: "text", text: prompt }];
    }
  });
}
var CLAUDE_IN_CHROME_MCP_TOOLS, SKILL_ACTIVATION_MESSAGE = `
Now that this skill is invoked, you have access to Chrome browser automation tools. You can now use the mcp__claude-in-chrome__* tools to interact with web pages.

IMPORTANT: Start by calling mcp__claude-in-chrome__tabs_context_mcp to get information about the user's current browser tabs.
`;
var init_claudeInChrome = __esm(() => {
  init_claude_for_chrome_mcp();
  init_setup2();
  init_bundledSkills();
  CLAUDE_IN_CHROME_MCP_TOOLS = BROWSER_TOOLS.map((tool) => `mcp__claude-in-chrome__${tool.name}`);
});
