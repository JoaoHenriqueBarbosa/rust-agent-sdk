// Original: src/tools/TaskCreateTool/prompt.ts
function getPrompt4() {
  let teammateContext = isAgentSwarmsEnabled() ? " and potentially assigned to teammates" : "", teammateTips = isAgentSwarmsEnabled() ? "- Include enough detail in the description for another agent to understand and complete the task\n- New tasks are created with status 'pending' and no owner - use TaskUpdate with the `owner` parameter to assign them\n" : "";
  return `Create tasks to track complex work${teammateContext}.

## Use when:
- 3+ distinct steps, or non-trivial planning
- Plan mode, explicit user request, or multiple user-provided tasks
- Mark in_progress BEFORE starting; completed after; add follow-ups as discovered

## Skip when:
- Single trivial task (just do it directly)
- Conversational/informational request

## Fields:
- subject: imperative ("Fix auth bug")
- description: what needs to be done
- activeForm (optional): present continuous ("Fixing auth bug") for spinner

All tasks created as pending.

## Tips
- Specific subjects, clear outcomes
- Use TaskUpdate for dependencies after creation
${teammateTips}- Check TaskList first to avoid duplicates
`;
}
var DESCRIPTION14 = "Create a new task in the task list";
var init_prompt16 = __esm(() => {
  init_agentSwarmsEnabled();
});
