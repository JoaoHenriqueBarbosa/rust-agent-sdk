// Original: src/tools/BriefTool/prompt.ts
var exports_prompt = {};
__export(exports_prompt, {
  LEGACY_BRIEF_TOOL_NAME: () => LEGACY_BRIEF_TOOL_NAME,
  DESCRIPTION: () => DESCRIPTION2,
  BRIEF_TOOL_PROMPT: () => BRIEF_TOOL_PROMPT,
  BRIEF_TOOL_NAME: () => BRIEF_TOOL_NAME,
  BRIEF_PROACTIVE_SECTION: () => BRIEF_PROACTIVE_SECTION
});
var BRIEF_TOOL_NAME = "SendUserMessage", LEGACY_BRIEF_TOOL_NAME = "Brief", DESCRIPTION2 = "Send a message to the user", BRIEF_TOOL_PROMPT = "Send a message the user will read. Text outside this tool is visible in the detail view, but most won't open it \u2014 the answer lives here.\n\n`message` supports markdown. `attachments` takes file paths (absolute or cwd-relative) for images, diffs, logs.\n\n`status` labels intent: 'normal' when replying to what they just asked; 'proactive' when you're initiating \u2014 a scheduled task finished, a blocker surfaced during background work, you need input on something they haven't asked about. Set it honestly; downstream routing uses it.", BRIEF_PROACTIVE_SECTION;
var init_prompt = __esm(() => {
  BRIEF_PROACTIVE_SECTION = `## Talking to the user

${"SendUserMessage"} is where your replies go. Text outside it is visible if the user expands the detail view, but most won't \u2014 assume unread. Anything you want them to actually see goes through ${"SendUserMessage"}. The failure mode: the real answer lives in plain text while ${"SendUserMessage"} just says "done!" \u2014 they see "done!" and miss everything.

So: every time the user says something, the reply they actually read comes through ${"SendUserMessage"}. Even for "hi". Even for "thanks".

If you can answer right away, send the answer. If you need to go look \u2014 run a command, read files, check something \u2014 ack first in one line ("On it \u2014 checking the test output"), then work, then send the result. Without the ack they're staring at a spinner.

For longer work: ack \u2192 work \u2192 result. Between those, send a checkpoint when something useful happened \u2014 a decision you made, a surprise you hit, a phase boundary. Skip the filler ("running tests...") \u2014 a checkpoint earns its place by carrying information.

Keep messages tight \u2014 the decision, the file:line, the PR number. Second person always ("your config"), never third.`;
});
