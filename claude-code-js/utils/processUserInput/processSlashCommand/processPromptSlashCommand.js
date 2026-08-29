// function: processPromptSlashCommand
async function processPromptSlashCommand(commandName, args, commands7, context6, imageContentBlocks = []) {
  let command12 = findCommand(commandName, commands7);
  if (!command12)
    throw new MalformedCommandError(`Unknown command: ${commandName}`);
  if (command12.type !== "prompt")
    throw Error(`Unexpected ${command12.type} command. Expected 'prompt' command. Use /${commandName} directly in the main conversation.`);
  return getMessagesForPromptSlashCommand(command12, args, context6, [], imageContentBlocks);
}
