// function: generateTitleAndBranch
async function generateTitleAndBranch(description, signal) {
  let fallbackTitle = truncateToWidth(description, 75), fallbackBranch = "claude/task";
  try {
    let userPrompt = SESSION_TITLE_AND_BRANCH_PROMPT.replace("{description}", description), firstBlock = (await queryHaiku({
      systemPrompt: asSystemPrompt([]),
      userPrompt,
      outputFormat: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            title: {
              type: "string"
            },
            branch: {
              type: "string"
            }
          },
          required: ["title", "branch"],
          additionalProperties: !1
        }
      },
      signal,
      options: {
        querySource: "teleport_generate_title",
        agents: [],
        isNonInteractiveSession: !1,
        hasAppendSystemPrompt: !1,
        mcpTools: []
      }
    })).message.content[0];
    if (firstBlock?.type !== "text")
      return {
        title: fallbackTitle,
        branchName: "claude/task"
      };
    let parsed = safeParseJSON(firstBlock.text.trim()), parseResult = exports_external.object({
      title: exports_external.string(),
      branch: exports_external.string()
    }).safeParse(parsed);
    if (parseResult.success)
      return {
        title: parseResult.data.title || fallbackTitle,
        branchName: parseResult.data.branch || "claude/task"
      };
    return {
      title: fallbackTitle,
      branchName: "claude/task"
    };
  } catch (error44) {
    return logError2(Error(`Error generating title and branch: ${error44}`)), {
      title: fallbackTitle,
      branchName: "claude/task"
    };
  }
}
