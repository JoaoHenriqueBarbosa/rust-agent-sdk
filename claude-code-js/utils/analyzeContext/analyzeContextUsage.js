// function: analyzeContextUsage
async function analyzeContextUsage(messages, model, getToolPermissionContext, tools, agentDefinitions, terminalWidth, toolUseContext, mainThreadAgentDefinition, originalMessages) {
  let runtimeModel = getRuntimeMainLoopModel({
    permissionMode: (await getToolPermissionContext()).mode,
    mainLoopModel: model
  }), contextWindow = getContextWindowForModel(runtimeModel, getSdkBetas()), defaultSystemPrompt = await getSystemPrompt(tools, runtimeModel), effectiveSystemPrompt = buildEffectiveSystemPrompt({
    mainThreadAgentDefinition,
    toolUseContext: toolUseContext ?? {
      options: {}
    },
    customSystemPrompt: toolUseContext?.options.customSystemPrompt,
    defaultSystemPrompt,
    appendSystemPrompt: toolUseContext?.options.appendSystemPrompt
  }), [
    { systemPromptTokens, systemPromptSections },
    { claudeMdTokens, memoryFileDetails },
    {
      builtInToolTokens,
      deferredBuiltinDetails,
      deferredBuiltinTokens,
      systemToolDetails
    },
    { mcpToolTokens, mcpToolDetails, deferredToolTokens },
    { agentTokens, agentDetails },
    { slashCommandTokens, commandInfo },
    messageBreakdown
  ] = await Promise.all([
    countSystemTokens(effectiveSystemPrompt),
    countMemoryFileTokens(),
    countBuiltInToolTokens(tools, getToolPermissionContext, agentDefinitions, runtimeModel, messages),
    countMcpToolTokens(tools, getToolPermissionContext, agentDefinitions, runtimeModel, messages),
    countCustomAgentTokens(agentDefinitions),
    countSlashCommandTokens(tools, getToolPermissionContext, agentDefinitions),
    approximateMessageTokens(messages)
  ]), skillInfo = (await countSkillTokens(tools, getToolPermissionContext, agentDefinitions)).skillInfo, skillFrontmatterTokens = skillInfo.skillFrontmatter.reduce((sum, skill) => sum + skill.tokens, 0), messageTokens = messageBreakdown.totalTokens, isAutoCompact = isAutoCompactEnabled(), autoCompactThreshold = isAutoCompact ? getEffectiveContextWindowSize(model) - AUTOCOMPACT_BUFFER_TOKENS : void 0, cats = [];
  if (systemPromptTokens > 0)
    cats.push({
      name: "System prompt",
      tokens: systemPromptTokens,
      color: "promptBorder"
    });
  let systemToolsTokens = builtInToolTokens - skillFrontmatterTokens;
  if (systemToolsTokens > 0)
    cats.push({
      name: "System tools",
      tokens: systemToolsTokens,
      color: "inactive"
    });
  if (mcpToolTokens > 0)
    cats.push({
      name: "MCP tools",
      tokens: mcpToolTokens,
      color: "cyan_FOR_SUBAGENTS_ONLY"
    });
  if (deferredToolTokens > 0)
    cats.push({
      name: "MCP tools (deferred)",
      tokens: deferredToolTokens,
      color: "inactive",
      isDeferred: !0
    });
  if (deferredBuiltinTokens > 0)
    cats.push({
      name: "System tools (deferred)",
      tokens: deferredBuiltinTokens,
      color: "inactive",
      isDeferred: !0
    });
  if (agentTokens > 0)
    cats.push({
      name: "Custom agents",
      tokens: agentTokens,
      color: "permission"
    });
  if (claudeMdTokens > 0)
    cats.push({
      name: "Memory files",
      tokens: claudeMdTokens,
      color: "claude"
    });
  if (skillFrontmatterTokens > 0)
    cats.push({
      name: "Skills",
      tokens: skillFrontmatterTokens,
      color: "warning"
    });
  if (messageTokens !== null && messageTokens > 0)
    cats.push({
      name: "Messages",
      tokens: messageTokens,
      color: "purple_FOR_SUBAGENTS_ONLY"
    });
  let actualUsage = cats.reduce((sum, cat) => sum + (cat.isDeferred ? 0 : cat.tokens), 0), reservedTokens = 0;
  if (!1)
    ;
  else if (isAutoCompact && autoCompactThreshold !== void 0)
    reservedTokens = contextWindow - autoCompactThreshold, cats.push({
      name: RESERVED_CATEGORY_NAME,
      tokens: reservedTokens,
      color: "inactive"
    });
  else if (!isAutoCompact)
    reservedTokens = MANUAL_COMPACT_BUFFER_TOKENS, cats.push({
      name: MANUAL_COMPACT_BUFFER_NAME,
      tokens: reservedTokens,
      color: "inactive"
    });
  let freeTokens = Math.max(0, contextWindow - actualUsage - reservedTokens);
  cats.push({
    name: "Free space",
    tokens: freeTokens,
    color: "promptBorder"
  });
  let totalIncludingReserved = actualUsage, apiUsage = getCurrentUsage(originalMessages ?? messages), finalTotalTokens = (apiUsage ? apiUsage.input_tokens + apiUsage.cache_creation_input_tokens + apiUsage.cache_read_input_tokens : null) ?? totalIncludingReserved, isNarrowScreen = terminalWidth && terminalWidth < 80, GRID_WIDTH = contextWindow >= 1e6 ? isNarrowScreen ? 5 : 20 : isNarrowScreen ? 5 : 10, GRID_HEIGHT = contextWindow >= 1e6 ? 10 : isNarrowScreen ? 5 : 10, TOTAL_SQUARES = GRID_WIDTH * GRID_HEIGHT, categorySquares = cats.filter((cat) => !cat.isDeferred).map((cat) => ({
    ...cat,
    squares: cat.name === "Free space" ? Math.round(cat.tokens / contextWindow * TOTAL_SQUARES) : Math.max(1, Math.round(cat.tokens / contextWindow * TOTAL_SQUARES)),
    percentageOfTotal: Math.round(cat.tokens / contextWindow * 100)
  }));
  function createCategorySquares(category) {
    let squares = [], exactSquares = category.tokens / contextWindow * TOTAL_SQUARES, wholeSquares = Math.floor(exactSquares), fractionalPart = exactSquares - wholeSquares;
    for (let i5 = 0;i5 < category.squares; i5++) {
      let squareFullness = 1;
      if (i5 === wholeSquares && fractionalPart > 0)
        squareFullness = fractionalPart;
      squares.push({
        color: category.color,
        isFilled: !0,
        categoryName: category.name,
        tokens: category.tokens,
        percentage: category.percentageOfTotal,
        squareFullness
      });
    }
    return squares;
  }
  let gridSquares = [], reservedCategory = categorySquares.find((cat) => cat.name === RESERVED_CATEGORY_NAME || cat.name === MANUAL_COMPACT_BUFFER_NAME), nonReservedCategories = categorySquares.filter((cat) => cat.name !== RESERVED_CATEGORY_NAME && cat.name !== MANUAL_COMPACT_BUFFER_NAME && cat.name !== "Free space");
  for (let cat of nonReservedCategories) {
    let squares = createCategorySquares(cat);
    for (let square of squares)
      if (gridSquares.length < TOTAL_SQUARES)
        gridSquares.push(square);
  }
  let reservedSquareCount = reservedCategory ? reservedCategory.squares : 0, freeSpaceCat = cats.find((c3) => c3.name === "Free space"), freeSpaceTarget = TOTAL_SQUARES - reservedSquareCount;
  while (gridSquares.length < freeSpaceTarget)
    gridSquares.push({
      color: "promptBorder",
      isFilled: !0,
      categoryName: "Free space",
      tokens: freeSpaceCat?.tokens || 0,
      percentage: freeSpaceCat ? Math.round(freeSpaceCat.tokens / contextWindow * 100) : 0,
      squareFullness: 1
    });
  if (reservedCategory) {
    let squares = createCategorySquares(reservedCategory);
    for (let square of squares)
      if (gridSquares.length < TOTAL_SQUARES)
        gridSquares.push(square);
  }
  let gridRows = [];
  for (let i5 = 0;i5 < GRID_HEIGHT; i5++)
    gridRows.push(gridSquares.slice(i5 * GRID_WIDTH, (i5 + 1) * GRID_WIDTH));
  let toolsMap = /* @__PURE__ */ new Map;
  for (let [name3, tokens] of messageBreakdown.toolCallsByType.entries()) {
    let existing = toolsMap.get(name3) || { callTokens: 0, resultTokens: 0 };
    toolsMap.set(name3, { ...existing, callTokens: tokens });
  }
  for (let [name3, tokens] of messageBreakdown.toolResultsByType.entries()) {
    let existing = toolsMap.get(name3) || { callTokens: 0, resultTokens: 0 };
    toolsMap.set(name3, { ...existing, resultTokens: tokens });
  }
  let toolsByTypeArray = Array.from(toolsMap.entries()).map(([name3, { callTokens, resultTokens }]) => ({
    name: name3,
    callTokens,
    resultTokens
  })).sort((a2, b) => b.callTokens + b.resultTokens - (a2.callTokens + a2.resultTokens)), attachmentsByTypeArray = Array.from(messageBreakdown.attachmentsByType.entries()).map(([name3, tokens]) => ({ name: name3, tokens })).sort((a2, b) => b.tokens - a2.tokens), formattedMessageBreakdown = {
    toolCallTokens: messageBreakdown.toolCallTokens,
    toolResultTokens: messageBreakdown.toolResultTokens,
    attachmentTokens: messageBreakdown.attachmentTokens,
    assistantMessageTokens: messageBreakdown.assistantMessageTokens,
    userMessageTokens: messageBreakdown.userMessageTokens,
    toolCallsByType: toolsByTypeArray,
    attachmentsByType: attachmentsByTypeArray
  };
  return {
    categories: cats,
    totalTokens: finalTotalTokens,
    maxTokens: contextWindow,
    rawMaxTokens: contextWindow,
    percentage: Math.round(finalTotalTokens / contextWindow * 100),
    gridRows,
    model: runtimeModel,
    memoryFiles: memoryFileDetails,
    mcpTools: mcpToolDetails,
    deferredBuiltinTools: void 0,
    systemTools: void 0,
    systemPromptSections: void 0,
    agents: agentDetails,
    slashCommands: slashCommandTokens > 0 ? {
      totalCommands: commandInfo.totalCommands,
      includedCommands: commandInfo.includedCommands,
      tokens: slashCommandTokens
    } : void 0,
    skills: skillFrontmatterTokens > 0 ? {
      totalSkills: skillInfo.totalSkills,
      includedSkills: skillInfo.includedSkills,
      tokens: skillFrontmatterTokens,
      skillFrontmatter: skillInfo.skillFrontmatter
    } : void 0,
    autoCompactThreshold,
    isAutoCompactEnabled: isAutoCompact,
    messageBreakdown: formattedMessageBreakdown,
    apiUsage
  };
}
