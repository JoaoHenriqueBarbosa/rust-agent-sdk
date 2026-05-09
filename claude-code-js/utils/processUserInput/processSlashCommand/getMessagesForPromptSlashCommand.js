// function: getMessagesForPromptSlashCommand
async function getMessagesForPromptSlashCommand(command12, args, context6, precedingInputBlocks = [], imageContentBlocks = [], uuid8) {
  let result = await command12.getPromptForCommand(args, context6), hooksAllowedForThisSkill = !isRestrictedToPluginOnly("hooks") || isSourceAdminTrusted(command12.source);
  if (command12.hooks && hooksAllowedForThisSkill) {
    let sessionId = getSessionId();
    registerSkillHooks(context6.setAppState, sessionId, command12.hooks, command12.name, command12.type === "prompt" ? command12.skillRoot : void 0);
  }
  let skillPath = command12.source ? `${command12.source}:${command12.name}` : command12.name, skillContent = result.filter((b) => b.type === "text").map((b) => b.text).join(`

`);
  addInvokedSkill(command12.name, skillPath, skillContent, getAgentContext()?.agentId ?? null);
  let metadata = formatCommandLoadingMetadata(command12, args), additionalAllowedTools = parseToolListFromCLI(command12.allowedTools ?? []), mainMessageContent = imageContentBlocks.length > 0 || precedingInputBlocks.length > 0 ? [...imageContentBlocks, ...precedingInputBlocks, ...result] : result, attachmentMessages = await toArray2(getAttachmentMessages(result.filter((block2) => block2.type === "text").map((block2) => block2.text).join(" "), context6, null, [], context6.messages, "repl_main_thread", {
    skipSkillDiscovery: !0
  }));
  return {
    messages: [createUserMessage({
      content: metadata,
      uuid: uuid8
    }), createUserMessage({
      content: mainMessageContent,
      isMeta: !0
    }), ...attachmentMessages, createAttachmentMessage({
      type: "command_permissions",
      allowedTools: additionalAllowedTools,
      model: command12.model
    })],
    shouldQuery: !0,
    allowedTools: additionalAllowedTools,
    model: command12.model,
    effort: command12.effort,
    command: command12
  };
}
