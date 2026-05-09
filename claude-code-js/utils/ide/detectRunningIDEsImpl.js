// function: detectRunningIDEsImpl
async function detectRunningIDEsImpl() {
  let runningIDEs = [];
  try {
    let platform5 = getPlatform();
    if (platform5 === "macos") {
      let stdout = (await execa('ps aux | grep -E "Visual Studio Code|Code Helper|Cursor Helper|Windsurf Helper|IntelliJ IDEA|PyCharm|WebStorm|PhpStorm|RubyMine|CLion|GoLand|Rider|DataGrip|AppCode|DataSpell|Aqua|Gateway|Fleet|Android Studio" | grep -v grep', { shell: !0, reject: !1 })).stdout ?? "";
      for (let [ide, config10] of Object.entries(supportedIdeConfigs))
        for (let keyword of config10.processKeywordsMac)
          if (stdout.includes(keyword)) {
            runningIDEs.push(ide);
            break;
          }
    } else if (platform5 === "windows") {
      let normalizedStdout = ((await execa('tasklist | findstr /I "Code.exe Cursor.exe Windsurf.exe idea64.exe pycharm64.exe webstorm64.exe phpstorm64.exe rubymine64.exe clion64.exe goland64.exe rider64.exe datagrip64.exe appcode.exe dataspell64.exe aqua64.exe gateway64.exe fleet.exe studio64.exe"', { shell: !0, reject: !1 })).stdout ?? "").toLowerCase();
      for (let [ide, config10] of Object.entries(supportedIdeConfigs))
        for (let keyword of config10.processKeywordsWindows)
          if (normalizedStdout.includes(keyword.toLowerCase())) {
            runningIDEs.push(ide);
            break;
          }
    } else if (platform5 === "linux") {
      let normalizedStdout = ((await execa('ps aux | grep -E "code|cursor|windsurf|idea|pycharm|webstorm|phpstorm|rubymine|clion|goland|rider|datagrip|dataspell|aqua|gateway|fleet|android-studio" | grep -v grep', { shell: !0, reject: !1 })).stdout ?? "").toLowerCase();
      for (let [ide, config10] of Object.entries(supportedIdeConfigs))
        for (let keyword of config10.processKeywordsLinux)
          if (normalizedStdout.includes(keyword)) {
            if (ide !== "vscode") {
              runningIDEs.push(ide);
              break;
            } else if (!normalizedStdout.includes("cursor") && !normalizedStdout.includes("appcode")) {
              runningIDEs.push(ide);
              break;
            }
          }
    }
  } catch (error44) {
    logError2(error44);
  }
  return runningIDEs;
}
