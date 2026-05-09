// function: getVSCodeIDECommand
async function getVSCodeIDECommand(ideType) {
  let parentExecutable = getVSCodeIDECommandByParentProcess();
  if (parentExecutable)
    try {
      return await getFsImplementation().stat(parentExecutable), parentExecutable;
    } catch {}
  let ext = getPlatform() === "windows" ? ".cmd" : "";
  switch (ideType) {
    case "vscode":
      return "code" + ext;
    case "cursor":
      return "cursor" + ext;
    case "windsurf":
      return "windsurf" + ext;
    default:
      break;
  }
  return null;
}
