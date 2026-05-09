// function: generateTitle
async function generateTitle(description, abortSignal) {
  try {
    let response7 = await queryHaiku({
      systemPrompt: asSystemPrompt(["Generate a concise, technical issue title (max 80 chars) for a public GitHub issue based on this bug report for Claude Code.", "Claude Code is an agentic coding CLI based on the Anthropic API.", "The title should:", "- Include the type of issue [Bug] or [Feature Request] as the first thing in the title", "- Be concise, specific and descriptive of the actual problem", "- Use technical terminology appropriate for a software issue", '- For error messages, extract the key error (e.g., "Missing Tool Result Block" rather than the full message)', "- Be direct and clear for developers to understand the problem", '- If you cannot determine a clear issue, use "Bug Report: [brief description]"', "- Any LLM API errors are from the Anthropic API, not from any other model provider", "Your response will be directly used as the title of the Github issue, and as such should not contain any other commentary or explaination", 'Examples of good titles include: "[Bug] Auto-Compact triggers to soon", "[Bug] Anthropic API Error: Missing Tool Result Block", "[Bug] Error: Invalid Model Name for Opus"']),
      userPrompt: description,
      signal: abortSignal,
      options: {
        hasAppendSystemPrompt: !1,
        toolChoice: void 0,
        isNonInteractiveSession: !1,
        agents: [],
        querySource: "feedback",
        mcpTools: []
      }
    }), title = response7.message.content[0]?.type === "text" ? response7.message.content[0].text : "Bug Report";
    if (startsWithApiErrorPrefix(title))
      return createFallbackTitle(description);
    return title;
  } catch (error44) {
    return logError2(error44), createFallbackTitle(description);
  }
}
