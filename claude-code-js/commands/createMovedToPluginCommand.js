// Original: src/commands/createMovedToPluginCommand.ts
function createMovedToPluginCommand({
  name: name3,
  description,
  progressMessage,
  pluginName,
  pluginCommand,
  getPromptWhileMarketplaceIsPrivate
}) {
  return {
    type: "prompt",
    name: name3,
    description,
    progressMessage,
    contentLength: 0,
    userFacingName() {
      return name3;
    },
    source: "builtin",
    async getPromptForCommand(args, context7) {
      return getPromptWhileMarketplaceIsPrivate(args, context7);
    }
  };
}
