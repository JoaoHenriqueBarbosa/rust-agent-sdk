// Original: src/tools/AgentTool/prompt.ts
function getToolsDescription(agent) {
  let { tools, disallowedTools } = agent, hasAllowlist = tools && tools.length > 0, hasDenylist = disallowedTools && disallowedTools.length > 0;
  if (hasAllowlist && hasDenylist) {
    let denySet = new Set(disallowedTools), effectiveTools = tools.filter((t2) => !denySet.has(t2));
    if (effectiveTools.length === 0)
      return "None";
    return effectiveTools.join(", ");
  } else if (hasAllowlist)
    return tools.join(", ");
  else if (hasDenylist)
    return `All tools except ${disallowedTools.join(", ")}`;
  return "All tools";
}
function formatAgentLine(agent) {
  let toolsDescription = getToolsDescription(agent);
  return `- ${agent.agentType}: ${agent.whenToUse} (Tools: ${toolsDescription})`;
}
function shouldInjectAgentListInMessages() {
  if (isEnvTruthy(process.env.CLAUDE_CODE_AGENT_LIST_IN_MESSAGES))
    return !0;
  if (isEnvDefinedFalsy(process.env.CLAUDE_CODE_AGENT_LIST_IN_MESSAGES))
    return !1;
  return !1;
}
async function getPrompt9(agentDefinitions, isCoordinator, allowedAgentTypes) {
  let effectiveAgents = allowedAgentTypes ? agentDefinitions.filter((a2) => allowedAgentTypes.includes(a2.agentType)) : agentDefinitions, forkEnabled = isForkSubagentEnabled(), whenToForkSection = forkEnabled ? `

## When to fork

Fork (omit \`subagent_type\`) when intermediate output isn't worth keeping in context. Criterion: "will I need this output again?"
- **Research**: fork open-ended questions; launch parallel forks for independent sub-questions. Fork > fresh subagent (inherits context, shares cache).
- **Implementation**: fork when more than a couple of edits needed. Do research first.

Forks are cheap (shared cache). Don't set \`model\` on a fork \u2014 different model can't reuse parent cache. Pass a short \`name\` (lowercase, 1-2 words) for teams panel visibility.

**Don't peek.** Result includes \`output_file\` \u2014 don't Read it unless user asks. You get a completion notification; trust it. Reading mid-flight pulls fork noise into your context.

**Don't race.** After launch, you know nothing about what the fork found. Never fabricate results. The notification arrives as a user-role message in a later turn. If user asks before it lands: give status, not a guess.

**Fork prompt = directive.** Since fork inherits context, say what to do, not what the situation is. Be specific about scope. Don't re-explain background.
` : "", writingThePromptSection = `

## Writing the prompt

${forkEnabled ? "Fresh agents (with `subagent_type`) start with zero context. " : ""}Provide full context \u2014 the agent has no shared history.
- What you're trying to accomplish and why
- What you've already learned or ruled out
- Enough context for judgment calls, not just narrow instructions
- If you need a short response: say so ("report in under 200 words")
- Lookups: hand over the exact command. Investigations: hand over the question.

${forkEnabled ? "For fresh agents, terse" : "Terse"} command-style prompts produce shallow work.

**Never delegate understanding.** Don't write "based on your findings, fix the bug." Write prompts that prove you understood: include file paths, line numbers, what specifically to change.
`, forkExamples = `Example usage:

<example>
user: "What's left on this branch before we can ship?"
assistant: <thinking>Forking this \u2014 it's a survey question. I want the punch list, not the git output in my context.</thinking>
${AGENT_TOOL_NAME}({
  name: "ship-audit",
  description: "Branch ship-readiness audit",
  prompt: "Audit what's left before this branch can ship. Check: uncommitted changes, commits ahead of main, whether tests exist, whether the GrowthBook gate is wired up, whether CI-relevant files changed. Report a punch list \u2014 done vs. missing. Under 200 words."
})
assistant: Ship-readiness audit running.
<commentary>
Turn ends here. The coordinator knows nothing about the findings yet. What follows is a SEPARATE turn \u2014 the notification arrives from outside, as a user-role message. It is not something the coordinator writes.
</commentary>
[later turn \u2014 notification arrives as user message]
assistant: Audit's back. Three blockers: no tests for the new prompt path, GrowthBook gate wired but not in build_flags.yaml, and one uncommitted file.
</example>

<example>
user: "so is the gate wired up or not"
<commentary>
User asks mid-wait. The audit fork was launched to answer exactly this, and it hasn't returned. The coordinator does not have this answer. Give status, not a fabricated result.
</commentary>
assistant: Still waiting on the audit \u2014 that's one of the things it's checking. Should land shortly.
</example>

<example>
user: "Can you get a second opinion on whether this migration is safe?"
assistant: <thinking>I'll ask the code-reviewer agent \u2014 it won't see my analysis, so it can give an independent read.</thinking>
<commentary>
A subagent_type is specified, so the agent starts fresh. It needs full context in the prompt. The briefing explains what to assess and why.
</commentary>
${AGENT_TOOL_NAME}({
  name: "migration-review",
  description: "Independent migration review",
  subagent_type: "code-reviewer",
  prompt: "Review migration 0042_user_schema.sql for safety. Context: we're adding a NOT NULL column to a 50M-row table. Existing rows get a backfill default. I want a second opinion on whether the backfill approach is safe under concurrent writes \u2014 I've checked locking behavior but want independent verification. Report: is this safe, and if not, what specifically breaks?"
})
</example>
`, currentExamples = `Example usage:

<example_agent_descriptions>
"test-runner": use this agent after you are done writing code to run tests
"greeting-responder": use this agent to respond to user greetings with a friendly joke
</example_agent_descriptions>

<example>
user: "Please write a function that checks if a number is prime"
assistant: I'm going to use the ${FILE_WRITE_TOOL_NAME} tool to write the following code:
<code>
function isPrime(n) {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
</code>
<commentary>
Since a significant piece of code was written and the task was completed, now use the test-runner agent to run the tests
</commentary>
assistant: Uses the ${AGENT_TOOL_NAME} tool to launch the test-runner agent
</example>

<example>
user: "Hello"
<commentary>
Since the user is greeting, use the greeting-responder agent to respond with a friendly joke
</commentary>
assistant: "I'm going to use the ${AGENT_TOOL_NAME} tool to launch the greeting-responder agent"
</example>
`, listViaAttachment = shouldInjectAgentListInMessages(), agentListSection = listViaAttachment ? "Available agent types are listed in <system-reminder> messages in the conversation." : `Available agent types and the tools they have access to:
${effectiveAgents.map((agent) => formatAgentLine(agent)).join(`
`)}`, shared8 = `Launch a new agent to handle complex, multi-step tasks autonomously.

The ${AGENT_TOOL_NAME} tool launches specialized agents (subprocesses) that autonomously handle complex tasks. Each agent type has specific capabilities and tools available to it.

${agentListSection}

${forkEnabled ? `When using the ${AGENT_TOOL_NAME} tool, specify a subagent_type to use a specialized agent, or omit it to fork yourself \u2014 a fork inherits your full conversation context.` : `When using the ${AGENT_TOOL_NAME} tool, specify a subagent_type parameter to select which agent type to use. If omitted, the general-purpose agent is used.`}`;
  if (isCoordinator)
    return shared8;
  let embedded = hasEmbeddedSearchTools(), fileSearchHint = embedded ? "`find` via the Bash tool" : `the ${GLOB_TOOL_NAME} tool`, contentSearchHint = embedded ? "`grep` via the Bash tool" : `the ${GLOB_TOOL_NAME} tool`, whenNotToUseSection = forkEnabled ? "" : `
When NOT to use ${AGENT_TOOL_NAME}:
- Reading a specific file: use ${FILE_READ_TOOL_NAME} or ${fileSearchHint}
- Finding a class definition ("class Foo"): use ${contentSearchHint}
- Searching within 1-3 specific files: use ${FILE_READ_TOOL_NAME}
- Tasks unrelated to the agent descriptions above
`, concurrencyNote = !listViaAttachment && getSubscriptionType() !== "pro" ? `
- Launch multiple agents concurrently whenever possible, to maximize performance; to do that, use a single message with multiple tool uses` : "";
  return `${shared8}
${whenNotToUseSection}

Usage notes:
- Always include a short description (3-5 words) summarizing what the agent will do${concurrencyNote}
- Agent result is not visible to the user \u2014 send a concise summary when done.${!isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_BACKGROUND_TASKS) && !isInProcessTeammate() && !forkEnabled ? `
- Background agents: you'll be notified on completion \u2014 don't sleep/poll. Continue other work.
- **Foreground vs background**: foreground when you need results before proceeding; background when work is genuinely independent.` : ""}
- To continue a spawned agent: use ${SEND_MESSAGE_TOOL_NAME} with agent ID/name as \`to\`. ${forkEnabled ? "Fresh agents (subagent_type) start without context \u2014 provide a full description." : "Each invocation starts fresh \u2014 provide a full description."}
- Trust agent outputs.
- Tell the agent: write code or just research${forkEnabled ? "." : " (it doesn't know the user's intent)."}
- If agent description says proactively use it: do so without user asking.
- "Run in parallel" = single message with multiple ${AGENT_TOOL_NAME} tool use blocks.
- \`isolation: "worktree"\` runs in a temporary git worktree (auto-cleaned if no changes; returns path/branch if changed).${isInProcessTeammate() ? `
- run_in_background, name, team_name, mode unavailable here. Synchronous subagents only.` : isTeammate() ? `
- name, team_name, mode unavailable \u2014 teammates can't spawn teammates. Omit to spawn a subagent.` : ""}${whenToForkSection}${writingThePromptSection}

${forkEnabled ? forkExamples : currentExamples}`;
}
var init_prompt18 = __esm(() => {
  init_auth14();
  init_embeddedTools();
  init_envUtils();
  init_teammate();
  init_teammateContext();
  init_prompt2();
  init_prompt4();
  init_constants3();
  init_forkSubagent();
});
