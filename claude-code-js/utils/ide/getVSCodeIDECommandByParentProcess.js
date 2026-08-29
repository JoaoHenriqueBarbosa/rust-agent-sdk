// function: getVSCodeIDECommandByParentProcess
function getVSCodeIDECommandByParentProcess() {
  try {
    if (getPlatform() !== "macos")
      return null;
    let pid = process.ppid;
    for (let i5 = 0;i5 < 10; i5++) {
      if (!pid || pid === 0 || pid === 1)
        break;
      let command12 = execSyncWithDefaults_DEPRECATED(`ps -o command= -p ${pid}`)?.trim();
      if (command12) {
        let appNames = {
          "Visual Studio Code.app": "code",
          "Cursor.app": "cursor",
          "Windsurf.app": "windsurf",
          "Visual Studio Code - Insiders.app": "code",
          "VSCodium.app": "codium"
        }, pathToExecutable = "/Contents/MacOS/Electron";
        for (let [appName, executableName] of Object.entries(appNames)) {
          let appIndex = command12.indexOf(appName + "/Contents/MacOS/Electron");
          if (appIndex !== -1) {
            let folderPathEnd = appIndex + appName.length;
            return command12.substring(0, folderPathEnd) + "/Contents/Resources/app/bin/" + executableName;
          }
        }
      }
      let ppidStr = execSyncWithDefaults_DEPRECATED(`ps -o ppid= -p ${pid}`)?.trim();
      if (!ppidStr)
        break;
      pid = parseInt(ppidStr.trim());
    }
    return null;
  } catch {
    return null;
  }
}
