// Original: src/services/compact/prompt.ts
function getPartialCompactPrompt(customInstructions, direction = "from") {
  let prompt = `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn \u2014 you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.

` + (direction === "up_to" ? `Summarize this conversation. Your summary will be placed at the start of a continuing session; newer messages follow after. Make it thorough enough that someone reading only this summary + newer messages can fully understand and continue the work.

Before your summary, wrap analysis in <analysis> tags. For each section of the conversation, identify:
- User's explicit requests and intents
- Your approach and key decisions
- Technical concepts, code patterns, file names, code snippets, function signatures, file edits
- Errors encountered and how they were fixed
- User feedback, especially "do this differently" instructions

Sections:
1. Primary Request and Intent
2. Key Technical Concepts
3. Files and Code Sections (with snippets and why they matter)
4. Errors and fixes
5. Problem Solving
6. All user messages (non-tool-result)
7. Pending Tasks
8. Work Completed
9. Context for Continuing Work (decisions, state, context needed to continue)

<example>
<analysis>[thought process]</analysis>

<summary>
1. Primary Request and Intent: [description]
2. Key Technical Concepts: - [concept]
3. Files and Code Sections: - [filename]: [why] [snippet]
4. Errors and fixes: - [error]: [fix]
5. Problem Solving: [description]
6. All user messages: - [message]
7. Pending Tasks: - [task]
8. Work Completed: [description]
9. Context for Continuing Work: [context]
</summary>
</example>
` : PARTIAL_COMPACT_PROMPT);
  if (customInstructions && customInstructions.trim() !== "")
    prompt += `

Additional Instructions:
${customInstructions}`;
  return prompt += `

REMINDER: No tools. Plain text only \u2014 <analysis> then <summary>. Tool calls = task failure.`, prompt;
}
function getCompactPrompt(customInstructions) {
  let prompt = `CRITICAL: Respond with TEXT ONLY. Do NOT call any tools.

- Do NOT use Read, Bash, Grep, Glob, Edit, Write, or ANY other tool.
- You already have all the context you need in the conversation above.
- Tool calls will be REJECTED and will waste your only turn \u2014 you will fail the task.
- Your entire response must be plain text: an <analysis> block followed by a <summary> block.

` + `Create a detailed summary of the conversation so far. Capture technical details, code patterns, and decisions essential for continuing without losing context.

Before your summary, wrap analysis in <analysis> tags. For each section of the conversation, identify:
- User's explicit requests and intents
- Your approach and key decisions
- Technical concepts, code patterns, file names, code snippets, function signatures, file edits
- Errors encountered and how they were fixed
- User feedback, especially "do this differently" instructions

Sections:
1. Primary Request and Intent: All user requests and intents in detail
2. Key Technical Concepts: Technologies, frameworks, concepts discussed
3. Files and Code Sections: Files examined/modified/created with full snippets and why they matter (focus on recent messages)
4. Errors and fixes: All errors, how fixed, user feedback on them
5. Problem Solving: Problems solved and ongoing troubleshooting
6. All user messages: ALL non-tool-result user messages (critical for understanding feedback and intent)
7. Pending Tasks: Tasks explicitly asked but not yet done
8. Current Work: What was being worked on immediately before this request (include file names, code snippets)
9. Optional Next Step: ONLY if directly in line with the user's most recent request. Include verbatim quotes from the conversation showing where you left off. Do NOT add tangential or old tasks.

<example>
<analysis>
[thought process]
</analysis>

<summary>
1. Primary Request and Intent:
   [description]

2. Key Technical Concepts:
   - [concept]

3. Files and Code Sections:
   - [filename]
      - [why important]
      - [snippet]

4. Errors and fixes:
    - [error]: [fix] [user feedback]

5. Problem Solving:
   [description]

6. All user messages:
    - [message]

7. Pending Tasks:
   - [task]

8. Current Work:
   [description]

9. Optional Next Step:
   [step or omit]

</summary>
</example>

Follow the structure above. If the context includes additional summarization instructions, follow them too.
`;
  if (customInstructions && customInstructions.trim() !== "")
    prompt += `

Additional Instructions:
${customInstructions}`;
  return prompt += `

REMINDER: No tools. Plain text only \u2014 <analysis> then <summary>. Tool calls = task failure.`, prompt;
}
function formatCompactSummary(summary) {
  let formattedSummary = summary;
  formattedSummary = formattedSummary.replace(/<analysis>[\s\S]*?<\/analysis>/, "");
  let summaryMatch = formattedSummary.match(/<summary>([\s\S]*?)<\/summary>/);
  if (summaryMatch) {
    let content = summaryMatch[1] || "";
    formattedSummary = formattedSummary.replace(/<summary>[\s\S]*?<\/summary>/, `Summary:
${content.trim()}`);
  }
  return formattedSummary = formattedSummary.replace(/\n\n+/g, `

`), formattedSummary.trim();
}
function getCompactUserSummaryMessage(summary, suppressFollowUpQuestions, transcriptPath, recentMessagesPreserved) {
  let baseSummary = `This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

${formatCompactSummary(summary)}`;
  if (transcriptPath)
    baseSummary += `

If you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: ${transcriptPath}`;
  if (recentMessagesPreserved)
    baseSummary += `

Recent messages are preserved verbatim.`;
  if (suppressFollowUpQuestions) {
    let continuation = `${baseSummary}
Continue the conversation from where it left off without asking the user any further questions. Resume directly \u2014 do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.`;
    if (null?.isProactiveActive())
      continuation += `

You are running in autonomous/proactive mode. This is NOT a first wake-up \u2014 you were already working autonomously before compaction. Continue your work loop: pick up where you left off based on the summary above. Do not greet the user or ask what to work on.`;
    return continuation;
  }
  return baseSummary;
}
var PARTIAL_COMPACT_PROMPT;
var init_prompt20 = __esm(() => {
  PARTIAL_COMPACT_PROMPT = `Summarize ONLY the RECENT portion of the conversation (messages after earlier retained context). Earlier messages are kept intact \u2014 do NOT re-summarize them.

${`Before your summary, wrap analysis in <analysis> tags. For each section of recent messages, identify:
- User's explicit requests and intents
- Your approach and key decisions
- Technical concepts, code patterns, file names, code snippets, function signatures, file edits
- Errors encountered and how they were fixed
- User feedback, especially "do this differently" instructions`}

Sections (from recent messages only):
1. Primary Request and Intent
2. Key Technical Concepts
3. Files and Code Sections (with snippets and why they matter)
4. Errors and fixes
5. Problem Solving
6. All user messages (non-tool-result)
7. Pending Tasks
8. Current Work (immediately before this request)
9. Optional Next Step (with verbatim quotes)

<example>
<analysis>[thought process]</analysis>

<summary>
1. Primary Request and Intent: [description]
2. Key Technical Concepts: - [concept]
3. Files and Code Sections: - [filename]: [why] [snippet]
4. Errors and fixes: - [error]: [fix]
5. Problem Solving: [description]
6. All user messages: - [message]
7. Pending Tasks: - [task]
8. Current Work: [description]
9. Optional Next Step: [step or omit]
</summary>
</example>
`;
});
