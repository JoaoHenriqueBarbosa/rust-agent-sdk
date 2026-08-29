// function: readIdeLockfile
async function readIdeLockfile(path16) {
  try {
    let content = await getFsImplementation().readFile(path16, {
      encoding: "utf-8"
    }), workspaceFolders = [], pid, ideName, useWebSocket = !1, runningInWindows = !1, authToken;
    try {
      let parsedContent = jsonParse(content);
      if (parsedContent.workspaceFolders)
        workspaceFolders = parsedContent.workspaceFolders;
      pid = parsedContent.pid, ideName = parsedContent.ideName, useWebSocket = parsedContent.transport === "ws", runningInWindows = parsedContent.runningInWindows === !0, authToken = parsedContent.authToken;
    } catch (_) {
      workspaceFolders = content.split(`
`).map((line) => line.trim());
    }
    let filename = path16.split(pathSeparator).pop();
    if (!filename)
      return null;
    let port = filename.replace(".lock", "");
    return {
      workspaceFolders,
      port: parseInt(port),
      pid,
      ideName,
      useWebSocket,
      runningInWindows,
      authToken
    };
  } catch (error44) {
    return logError2(error44), null;
  }
}
