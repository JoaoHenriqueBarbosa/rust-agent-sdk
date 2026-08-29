// Original: src/tools/TodoWriteTool/prompt.ts
var PROMPT5 = `Track tasks for the current session. Helps you stay organized and shows the user your progress.

## Use when:
1. Task requires 3+ distinct steps
2. Task is non-trivial/requires careful planning
3. User explicitly asks for a todo list
4. User provides multiple tasks
5. Starting a task \u2014 mark in_progress BEFORE beginning
6. Completing a task \u2014 mark completed, add follow-ups if needed

## Skip when:
- Single, trivial task (just do it directly)
- Purely conversational/informational

## Task states:
- pending / in_progress / completed
- Exactly ONE task in_progress at a time
- Mark complete IMMEDIATELY after finishing \u2014 don't batch
- Remove tasks that are no longer relevant

## Task fields:
- content: imperative ("Fix authentication bug")
- activeForm: present continuous ("Fixing authentication bug")

## Completion rules:
Only mark completed when FULLY done. Keep in_progress if:
- Tests are failing
- Implementation is partial
- Unresolved errors
- Missing files/dependencies

When blocked, create a new task describing what needs to be resolved.
`, DESCRIPTION10 = "Update the todo list for the current session. To be used proactively and often to track progress and pending tasks. Make sure that at least one task is in_progress at all times. Always provide both content (imperative) and activeForm (present continuous) for each task.";
