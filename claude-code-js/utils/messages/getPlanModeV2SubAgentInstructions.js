// function: getPlanModeV2SubAgentInstructions
function getPlanModeV2SubAgentInstructions(attachment) {
  let content = `Plan mode is active. The user indicated that they do not want you to execute yet -- you MUST NOT make any edits, run any non-readonly tools (including changing configs or making commits), or otherwise make any changes to the system. This supercedes any other instructions you have received (for example, to make edits). Instead, you should:

## Plan File Info:
${attachment.planExists ? `A plan file already exists at ${attachment.planFilePath}. You can read it and make incremental edits using the ${FileEditTool.name} tool if you need to.` : `No plan file exists yet. You should create your plan at ${attachment.planFilePath} using the ${FileWriteTool.name} tool if you need to.`}
You should build your plan incrementally by writing to or editing this file. NOTE that this is the only file you are allowed to edit - other than this you are only allowed to take READ-ONLY actions.
Answer the user's query comprehensively, using the ${ASK_USER_QUESTION_TOOL_NAME} tool if you need to ask the user clarifying questions. If you do use the ${ASK_USER_QUESTION_TOOL_NAME}, make sure to ask all clarifying questions you need to fully understand the user's intent before proceeding.`;
  return wrapMessagesInSystemReminder([
    createUserMessage({ content, isMeta: !0 })
  ]);
}
