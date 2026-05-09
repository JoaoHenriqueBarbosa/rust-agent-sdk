// function: cleanupShellAliases
async function cleanupShellAliases() {
  let messages = [], configMap = getShellConfigPaths();
  for (let [shellType, configFile] of Object.entries(configMap))
    try {
      let lines2 = await readFileLines(configFile);
      if (!lines2)
        continue;
      let { filtered, hadAlias } = filterClaudeAliases(lines2);
      if (hadAlias)
        await writeFileLines(configFile, filtered), messages.push({
          message: `Removed claude alias from ${configFile}. Run: unalias claude`,
          userActionRequired: !0,
          type: "alias"
        }), logForDebugging(`Cleaned up claude alias from ${shellType} config`);
    } catch (error44) {
      logError2(error44), messages.push({
        message: `Failed to clean up ${configFile}: ${error44}`,
        userActionRequired: !1,
        type: "error"
      });
    }
  return messages;
}
