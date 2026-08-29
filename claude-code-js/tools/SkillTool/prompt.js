// Original: src/tools/SkillTool/prompt.ts
var exports_prompt2 = {};
__export(exports_prompt2, {
  getSkillToolInfo: () => getSkillToolInfo,
  getSkillInfo: () => getSkillInfo,
  getPrompt: () => getPrompt,
  getLimitedSkillToolCommands: () => getLimitedSkillToolCommands,
  getCharBudget: () => getCharBudget,
  formatCommandsWithinBudget: () => formatCommandsWithinBudget,
  clearPromptCache: () => clearPromptCache,
  SKILL_BUDGET_CONTEXT_PERCENT: () => SKILL_BUDGET_CONTEXT_PERCENT,
  MAX_LISTING_DESC_CHARS: () => MAX_LISTING_DESC_CHARS,
  DEFAULT_CHAR_BUDGET: () => DEFAULT_CHAR_BUDGET,
  CHARS_PER_TOKEN: () => CHARS_PER_TOKEN
});
function getCharBudget(contextWindowTokens) {
  if (Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET))
    return Number(process.env.SLASH_COMMAND_TOOL_CHAR_BUDGET);
  if (contextWindowTokens)
    return Math.floor(contextWindowTokens * CHARS_PER_TOKEN * SKILL_BUDGET_CONTEXT_PERCENT);
  return DEFAULT_CHAR_BUDGET;
}
function getCommandDescription(cmd) {
  let desc = cmd.whenToUse ? `${cmd.description} - ${cmd.whenToUse}` : cmd.description;
  return desc.length > MAX_LISTING_DESC_CHARS ? desc.slice(0, MAX_LISTING_DESC_CHARS - 1) + "\u2026" : desc;
}
function formatCommandDescription(cmd) {
  let displayName = getCommandName(cmd);
  if (cmd.name !== displayName && cmd.type === "prompt" && cmd.source === "plugin")
    logForDebugging(`Skill prompt: showing "${cmd.name}" (userFacingName="${displayName}")`);
  return `- ${cmd.name}: ${getCommandDescription(cmd)}`;
}
function formatCommandsWithinBudget(commands7, contextWindowTokens) {
  if (commands7.length === 0)
    return "";
  let budget = getCharBudget(contextWindowTokens), fullEntries = commands7.map((cmd) => ({
    cmd,
    full: formatCommandDescription(cmd)
  }));
  if (fullEntries.reduce((sum, e) => sum + stringWidth(e.full), 0) + (fullEntries.length - 1) <= budget)
    return fullEntries.map((e) => e.full).join(`
`);
  let bundledIndices = /* @__PURE__ */ new Set, restCommands = [];
  for (let i5 = 0;i5 < commands7.length; i5++) {
    let cmd = commands7[i5];
    if (cmd.type === "prompt" && cmd.source === "bundled")
      bundledIndices.add(i5);
    else
      restCommands.push(cmd);
  }
  let bundledChars = fullEntries.reduce((sum, e, i5) => bundledIndices.has(i5) ? sum + stringWidth(e.full) + 1 : sum, 0), remainingBudget = budget - bundledChars;
  if (restCommands.length === 0)
    return fullEntries.map((e) => e.full).join(`
`);
  let restNameOverhead = restCommands.reduce((sum, cmd) => sum + stringWidth(cmd.name) + 4, 0) + (restCommands.length - 1), availableForDescs = remainingBudget - restNameOverhead, maxDescLen = Math.floor(availableForDescs / restCommands.length);
  if (maxDescLen < MIN_DESC_LENGTH)
    return commands7.map((cmd, i5) => bundledIndices.has(i5) ? fullEntries[i5].full : `- ${cmd.name}`).join(`
`);
  let truncatedCount = count2(restCommands, (cmd) => stringWidth(getCommandDescription(cmd)) > maxDescLen);
  return commands7.map((cmd, i5) => {
    if (bundledIndices.has(i5))
      return fullEntries[i5].full;
    let description = getCommandDescription(cmd);
    return `- ${cmd.name}: ${truncate(description, maxDescLen)}`;
  }).join(`
`);
}
async function getSkillToolInfo(cwd2) {
  let agentCommands = await getSkillToolCommands(cwd2);
  return {
    totalCommands: agentCommands.length,
    includedCommands: agentCommands.length
  };
}
function getLimitedSkillToolCommands(cwd2) {
  return getSkillToolCommands(cwd2);
}
function clearPromptCache() {
  getPrompt.cache?.clear?.();
}
async function getSkillInfo(cwd2) {
  try {
    let skills = await getSlashCommandToolSkills(cwd2);
    return {
      totalSkills: skills.length,
      includedSkills: skills.length
    };
  } catch (error44) {
    return logError2(toError(error44)), {
      totalSkills: 0,
      includedSkills: 0
    };
  }
}
var SKILL_BUDGET_CONTEXT_PERCENT = 0.01, CHARS_PER_TOKEN = 4, DEFAULT_CHAR_BUDGET = 8000, MAX_LISTING_DESC_CHARS = 250, MIN_DESC_LENGTH = 20, getPrompt;
var init_prompt7 = __esm(() => {
  init_lodash();
  init_commands5();
  init_xml();
  init_stringWidth();
  init_debug();
  init_errors();
  init_format();
  init_log3();
  getPrompt = memoize_default(async (_cwd) => {
    return `Execute a skill within the main conversation

When users ask you to perform tasks, check if any of the available skills match. Skills provide specialized capabilities and domain knowledge.

When users reference a "slash command" or "/<something>" (e.g., "/commit", "/review-pr"), they are referring to a skill. Use this tool to invoke it.

How to invoke:
- Use this tool with the skill name and optional arguments
- Examples:
  - \`skill: "pdf"\` - invoke the pdf skill
  - \`skill: "commit", args: "-m 'Fix bug'"\` - invoke with arguments
  - \`skill: "review-pr", args: "123"\` - invoke with arguments
  - \`skill: "ms-office-suite:pdf"\` - invoke using fully qualified name

Important:
- Available skills are listed in system-reminder messages in the conversation
- When a skill matches the user's request, this is a BLOCKING REQUIREMENT: invoke the relevant Skill tool BEFORE generating any other response about the task
- NEVER mention a skill without actually calling this tool
- Don't invoke a skill already running
- Don't use this tool for built-in CLI commands (/help, /clear, etc.)
- If you see a <${COMMAND_NAME_TAG}> tag in the current turn, the skill is ALREADY loaded \u2014 follow the instructions directly
`;
  });
});
