// Original: src/tools/EnterPlanModeTool/prompt.ts
function getEnterPlanModeToolPromptExternal() {
  let whatHappens = isPlanModeInterviewPhaseEnabled() ? "" : WHAT_HAPPENS_SECTION;
  return `Use proactively before non-trivial implementation. Gets user sign-off before writing code.

## Use when ANY applies:
1. New feature with meaningful decisions (where to place it? what behavior?)
2. Multiple valid approaches (Redis vs in-memory, WebSockets vs SSE)
3. Code modifications affecting existing behavior/structure
4. Architectural decisions (patterns, technologies)
5. Multi-file changes (3+ files)
6. Unclear requirements needing exploration first
7. Would use ${ASK_USER_QUESTION_TOOL_NAME} to clarify approach \u2192 use EnterPlanMode instead

## Skip for:
- Typos, obvious bugs, small tweaks
- Single function with clear requirements
- Very specific, detailed user instructions
- Pure research (use Agent with explore agent)

${whatHappens}## Examples

GOOD:
- "Add user authentication" \u2014 session vs JWT, middleware structure
- "Implement dark mode" \u2014 affects many components, theme system decision
- "Add a delete button" \u2014 placement, confirmation, API, error handling, state

BAD:
- "Fix typo in README" \u2014 just do it
- "Add a console.log" \u2014 obvious
- "What files handle routing?" \u2014 research, not planning

Requires user approval. When in doubt, plan \u2014 better alignment upfront than rework.
`;
}
function getEnterPlanModeToolPrompt() {
  return getEnterPlanModeToolPromptExternal();
}
var WHAT_HAPPENS_SECTION;
var init_prompt14 = __esm(() => {
  init_planModeV2();
  init_prompt10();
  WHAT_HAPPENS_SECTION = `## Plan Mode
1. Explore codebase (Glob, Grep, Read)
2. Understand patterns and architecture
3. Design implementation approach
4. Present plan for user approval
5. Use ${ASK_USER_QUESTION_TOOL_NAME} to clarify if needed
6. ExitPlanMode when ready to implement

`;
});
