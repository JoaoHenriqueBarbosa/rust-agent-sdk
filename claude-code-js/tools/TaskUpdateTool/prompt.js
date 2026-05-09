// Original: src/tools/TaskUpdateTool/prompt.ts
var DESCRIPTION16 = "Update a task in the task list", PROMPT8 = `Update a task in the task list.

- Mark completed only when FULLY done. Keep in_progress if tests failing, partial, or blocked
- When blocked: create a new task describing the blocker
- After completing: call TaskList to find next task
- Use deleted to permanently remove a task
- Read latest state with TaskGet before updating

## Fields
- status: pending \u2192 in_progress \u2192 completed (or deleted)
- subject: imperative form ("Run tests")
- activeForm: present continuous ("Running tests")
- owner, description, metadata, addBlocks, addBlockedBy

## Examples
\`\`\`json
{"taskId": "1", "status": "in_progress"}
{"taskId": "1", "status": "completed"}
{"taskId": "1", "status": "deleted"}
{"taskId": "1", "owner": "my-name"}
{"taskId": "2", "addBlockedBy": ["1"]}
\`\`\`
`;
