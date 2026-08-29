// Original: src/utils/suggestions/commandSuggestions.ts
function getCommandFuse(commands7) {
  if (fuseCache?.commands === commands7)
    return fuseCache.fuse;
  let commandData = commands7.filter((cmd) => !cmd.isHidden).map((cmd) => {
    let commandName = getCommandName(cmd), parts = commandName.split(SEPARATORS).filter(Boolean);
    return {
      descriptionKey: (cmd.description ?? "").split(" ").map((word) => cleanWord(word)).filter(Boolean),
      partKey: parts.length > 1 ? parts : void 0,
      commandName,
      command: cmd,
      aliasKey: cmd.aliases
    };
  }), fuse = new Fuse(commandData, {
    includeScore: !0,
    threshold: 0.3,
    location: 0,
    distance: 100,
    keys: [
      {
        name: "commandName",
        weight: 3
      },
      {
        name: "partKey",
        weight: 2
      },
      {
        name: "aliasKey",
        weight: 2
      },
      {
        name: "descriptionKey",
        weight: 0.5
      }
    ]
  });
  return fuseCache = { commands: commands7, fuse }, fuse;
}
function isCommandMetadata(metadata) {
  return typeof metadata === "object" && metadata !== null && "name" in metadata && typeof metadata.name === "string" && "type" in metadata;
}
function findMidInputSlashCommand(input, cursorOffset) {
  if (input.startsWith("/"))
    return null;
  let match = input.slice(0, cursorOffset).match(/\s\/([a-zA-Z0-9_:-]*)$/);
  if (!match || match.index === void 0)
    return null;
  let slashPos = match.index + 1, commandMatch = input.slice(slashPos + 1).match(/^[a-zA-Z0-9_:-]*/), fullCommand = commandMatch ? commandMatch[0] : "";
  if (cursorOffset > slashPos + 1 + fullCommand.length)
    return null;
  return {
    token: "/" + fullCommand,
    startPos: slashPos,
    partialCommand: fullCommand
  };
}
function getBestCommandMatch(partialCommand, commands7) {
  if (!partialCommand)
    return null;
  let suggestions = generateCommandSuggestions("/" + partialCommand, commands7);
  if (suggestions.length === 0)
    return null;
  let query3 = partialCommand.toLowerCase();
  for (let suggestion of suggestions) {
    if (!isCommandMetadata(suggestion.metadata))
      continue;
    let name3 = getCommandName(suggestion.metadata);
    if (name3.toLowerCase().startsWith(query3)) {
      let suffix = name3.slice(partialCommand.length);
      if (suffix)
        return { suffix, fullCommand: name3 };
    }
  }
  return null;
}
function isCommandInput(input) {
  return input.startsWith("/");
}
function hasCommandArgs(input) {
  if (!isCommandInput(input))
    return !1;
  if (!input.includes(" "))
    return !1;
  if (input.endsWith(" "))
    return !1;
  return !0;
}
function formatCommand2(command19) {
  return `/${command19} `;
}
function getCommandId2(cmd) {
  let commandName = getCommandName(cmd);
  if (cmd.type === "prompt") {
    if (cmd.source === "plugin" && cmd.pluginInfo?.repository)
      return `${commandName}:${cmd.source}:${cmd.pluginInfo.repository}`;
    return `${commandName}:${cmd.source}`;
  }
  return `${commandName}:${cmd.type}`;
}
function findMatchedAlias(query3, aliases2) {
  if (!aliases2 || aliases2.length === 0 || query3 === "")
    return;
  return aliases2.find((alias2) => alias2.toLowerCase().startsWith(query3));
}
function createCommandSuggestionItem(cmd, matchedAlias) {
  let commandName = getCommandName(cmd), aliasText = matchedAlias ? ` (${matchedAlias})` : "", isWorkflow = cmd.type === "prompt" && cmd.kind === "workflow", fullDescription = (isWorkflow ? cmd.description : formatDescriptionWithSource(cmd)) + (cmd.type === "prompt" && cmd.argNames?.length ? ` (arguments: ${cmd.argNames.join(", ")})` : "");
  return {
    id: getCommandId2(cmd),
    displayText: `/${commandName}${aliasText}`,
    tag: isWorkflow ? "workflow" : void 0,
    description: fullDescription,
    metadata: cmd
  };
}
function generateCommandSuggestions(input, commands7) {
  if (!isCommandInput(input))
    return [];
  if (hasCommandArgs(input))
    return [];
  let query3 = input.slice(1).toLowerCase().trim();
  if (query3 === "") {
    let visibleCommands = commands7.filter((cmd) => !cmd.isHidden), recentlyUsed = [], commandsWithScores = visibleCommands.filter((cmd) => cmd.type === "prompt").map((cmd) => ({
      cmd,
      score: getSkillUsageScore(getCommandName(cmd))
    })).filter((item) => item.score > 0).sort((a2, b) => b.score - a2.score);
    for (let item of commandsWithScores.slice(0, 5))
      recentlyUsed.push(item.cmd);
    let recentlyUsedIds = new Set(recentlyUsed.map((cmd) => getCommandId2(cmd))), builtinCommands = [], userCommands = [], projectCommands = [], policyCommands = [], otherCommands = [];
    visibleCommands.forEach((cmd) => {
      if (recentlyUsedIds.has(getCommandId2(cmd)))
        return;
      if (cmd.type === "local" || cmd.type === "local-jsx")
        builtinCommands.push(cmd);
      else if (cmd.type === "prompt" && (cmd.source === "userSettings" || cmd.source === "localSettings"))
        userCommands.push(cmd);
      else if (cmd.type === "prompt" && cmd.source === "projectSettings")
        projectCommands.push(cmd);
      else if (cmd.type === "prompt" && cmd.source === "policySettings")
        policyCommands.push(cmd);
      else
        otherCommands.push(cmd);
    });
    let sortAlphabetically = (a2, b) => getCommandName(a2).localeCompare(getCommandName(b));
    return builtinCommands.sort(sortAlphabetically), userCommands.sort(sortAlphabetically), projectCommands.sort(sortAlphabetically), policyCommands.sort(sortAlphabetically), otherCommands.sort(sortAlphabetically), [
      ...recentlyUsed,
      ...builtinCommands,
      ...userCommands,
      ...projectCommands,
      ...policyCommands,
      ...otherCommands
    ].map((cmd) => createCommandSuggestionItem(cmd));
  }
  let hiddenExact = commands7.find((cmd) => cmd.isHidden && getCommandName(cmd).toLowerCase() === query3);
  if (hiddenExact && commands7.some((cmd) => !cmd.isHidden && getCommandName(cmd).toLowerCase() === query3))
    hiddenExact = void 0;
  let fuseSuggestions = getCommandFuse(commands7).search(query3).map((r4) => {
    let name3 = r4.item.commandName.toLowerCase(), aliases2 = r4.item.aliasKey?.map((alias2) => alias2.toLowerCase()) ?? [], usage = r4.item.command.type === "prompt" ? getSkillUsageScore(getCommandName(r4.item.command)) : 0;
    return { r: r4, name: name3, aliases: aliases2, usage };
  }).sort((a2, b) => {
    let aName = a2.name, bName = b.name, aAliases = a2.aliases, bAliases = b.aliases, aExactName = aName === query3, bExactName = bName === query3;
    if (aExactName && !bExactName)
      return -1;
    if (bExactName && !aExactName)
      return 1;
    let aExactAlias = aAliases.some((alias2) => alias2 === query3), bExactAlias = bAliases.some((alias2) => alias2 === query3);
    if (aExactAlias && !bExactAlias)
      return -1;
    if (bExactAlias && !aExactAlias)
      return 1;
    let aPrefixName = aName.startsWith(query3), bPrefixName = bName.startsWith(query3);
    if (aPrefixName && !bPrefixName)
      return -1;
    if (bPrefixName && !aPrefixName)
      return 1;
    if (aPrefixName && bPrefixName && aName.length !== bName.length)
      return aName.length - bName.length;
    let aPrefixAlias = aAliases.find((alias2) => alias2.startsWith(query3)), bPrefixAlias = bAliases.find((alias2) => alias2.startsWith(query3));
    if (aPrefixAlias && !bPrefixAlias)
      return -1;
    if (bPrefixAlias && !aPrefixAlias)
      return 1;
    if (aPrefixAlias && bPrefixAlias && aPrefixAlias.length !== bPrefixAlias.length)
      return aPrefixAlias.length - bPrefixAlias.length;
    let scoreDiff = (a2.r.score ?? 0) - (b.r.score ?? 0);
    if (Math.abs(scoreDiff) > 0.1)
      return scoreDiff;
    return b.usage - a2.usage;
  }).map((result) => {
    let cmd = result.r.item.command, matchedAlias = findMatchedAlias(query3, cmd.aliases);
    return createCommandSuggestionItem(cmd, matchedAlias);
  });
  if (hiddenExact) {
    let hiddenId = getCommandId2(hiddenExact);
    if (!fuseSuggestions.some((s2) => s2.id === hiddenId))
      return [createCommandSuggestionItem(hiddenExact), ...fuseSuggestions];
  }
  return fuseSuggestions;
}
function applyCommandSuggestion(suggestion, shouldExecute, commands7, onInputChange, setCursorOffset, onSubmit) {
  let commandName, commandObj;
  if (typeof suggestion === "string")
    commandName = suggestion, commandObj = shouldExecute ? getCommand(commandName, commands7) : void 0;
  else {
    if (!isCommandMetadata(suggestion.metadata))
      return;
    commandName = getCommandName(suggestion.metadata), commandObj = suggestion.metadata;
  }
  let newInput = formatCommand2(commandName);
  if (onInputChange(newInput), setCursorOffset(newInput.length), shouldExecute && commandObj) {
    if (commandObj.type !== "prompt" || (commandObj.argNames ?? []).length === 0)
      onSubmit(newInput, !0);
  }
}
function cleanWord(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}
function findSlashCommandPositions(text2) {
  let positions = [], regex2 = /(^|[\s])(\/[a-zA-Z][a-zA-Z0-9:\-_]*)/g, match = null;
  while ((match = regex2.exec(text2)) !== null) {
    let precedingChar = match[1] ?? "", commandName = match[2] ?? "", start = match.index + precedingChar.length;
    positions.push({ start, end: start + commandName.length });
  }
  return positions;
}
var SEPARATORS, fuseCache = null;
var init_commandSuggestions = __esm(() => {
  init_fuse();
  init_commands5();
  init_skillUsageTracking();
  SEPARATORS = /[:_-]/g;
});
