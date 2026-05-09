// function: checkDownloadCradles
function checkDownloadCradles(parsed) {
  for (let statement of parsed.statements) {
    let cmds = statement.commands;
    if (cmds.length < 2)
      continue;
    let hasDownloader = cmds.some((cmd) => isDownloader(cmd.name)), hasIex = cmds.some((cmd) => isIex(cmd.name));
    if (hasDownloader && hasIex)
      return {
        behavior: "ask",
        message: "Command downloads and executes remote code"
      };
  }
  let all4 = getAllCommands2(parsed);
  if (all4.some((c3) => isDownloader(c3.name)) && all4.some((c3) => isIex(c3.name)))
    return {
      behavior: "ask",
      message: "Command downloads and executes remote code"
    };
  return { behavior: "passthrough" };
}
