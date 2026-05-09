// Original: src/services/tools/toolOrchestration.ts
function getMaxToolUseConcurrency() {
  return parseInt(process.env.CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY || "", 10) || 10;
}
async function* runTools(toolUseMessages, assistantMessages, canUseTool, toolUseContext) {
  let currentContext = toolUseContext;
  for (let { isConcurrencySafe, blocks } of partitionToolCalls(toolUseMessages, currentContext))
    if (isConcurrencySafe) {
      let queuedContextModifiers = {};
      for await (let update of runToolsConcurrently(blocks, assistantMessages, canUseTool, currentContext)) {
        if (update.contextModifier) {
          let { toolUseID, modifyContext } = update.contextModifier;
          if (!queuedContextModifiers[toolUseID])
            queuedContextModifiers[toolUseID] = [];
          queuedContextModifiers[toolUseID].push(modifyContext);
        }
        yield {
          message: update.message,
          newContext: currentContext
        };
      }
      for (let block2 of blocks) {
        let modifiers = queuedContextModifiers[block2.id];
        if (!modifiers)
          continue;
        for (let modifier of modifiers)
          currentContext = modifier(currentContext);
      }
      yield { newContext: currentContext };
    } else
      for await (let update of runToolsSerially(blocks, assistantMessages, canUseTool, currentContext)) {
        if (update.newContext)
          currentContext = update.newContext;
        yield {
          message: update.message,
          newContext: currentContext
        };
      }
}
function partitionToolCalls(toolUseMessages, toolUseContext) {
  return toolUseMessages.reduce((acc, toolUse) => {
    let tool = findToolByName(toolUseContext.options.tools, toolUse.name), parsedInput = tool?.inputSchema.safeParse(toolUse.input), isConcurrencySafe = parsedInput?.success ? (() => {
      try {
        return Boolean(tool?.isConcurrencySafe(parsedInput.data));
      } catch {
        return !1;
      }
    })() : !1;
    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe)
      acc[acc.length - 1].blocks.push(toolUse);
    else
      acc.push({ isConcurrencySafe, blocks: [toolUse] });
    return acc;
  }, []);
}
async function* runToolsSerially(toolUseMessages, assistantMessages, canUseTool, toolUseContext) {
  let currentContext = toolUseContext;
  for (let toolUse of toolUseMessages) {
    toolUseContext.setInProgressToolUseIDs((prev) => new Set(prev).add(toolUse.id));
    for await (let update of runToolUse(toolUse, assistantMessages.find((_) => _.message.content.some((_2) => _2.type === "tool_use" && _2.id === toolUse.id)), canUseTool, currentContext)) {
      if (update.contextModifier)
        currentContext = update.contextModifier.modifyContext(currentContext);
      yield {
        message: update.message,
        newContext: currentContext
      };
    }
    markToolUseAsComplete(toolUseContext, toolUse.id);
  }
}
async function* runToolsConcurrently(toolUseMessages, assistantMessages, canUseTool, toolUseContext) {
  yield* all3(toolUseMessages.map(async function* (toolUse) {
    toolUseContext.setInProgressToolUseIDs((prev) => new Set(prev).add(toolUse.id)), yield* runToolUse(toolUse, assistantMessages.find((_) => _.message.content.some((_2) => _2.type === "tool_use" && _2.id === toolUse.id)), canUseTool, toolUseContext), markToolUseAsComplete(toolUseContext, toolUse.id);
  }), getMaxToolUseConcurrency());
}
function markToolUseAsComplete(toolUseContext, toolUseID) {
  toolUseContext.setInProgressToolUseIDs((prev) => {
    let next = new Set(prev);
    return next.delete(toolUseID), next;
  });
}
var init_toolOrchestration = __esm(() => {
  init_Tool();
  init_generators();
  init_toolExecution();
});
