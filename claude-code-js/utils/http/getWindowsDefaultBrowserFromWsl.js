// function: getWindowsDefaultBrowserFromWsl
async function getWindowsDefaultBrowserFromWsl() {
  let powershellPath = await powerShellPath(), rawCommand = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`, encodedCommand = Buffer13.from(rawCommand, "utf16le").toString("base64"), { stdout } = await execFile6(powershellPath, [
    "-NoProfile",
    "-NonInteractive",
    "-ExecutionPolicy",
    "Bypass",
    "-EncodedCommand",
    encodedCommand
  ], { encoding: "utf8" }), progId = stdout.trim(), browserMap = {
    ChromeHTML: "com.google.chrome",
    BraveHTML: "com.brave.Browser",
    MSEdgeHTM: "com.microsoft.edge",
    FirefoxURL: "org.mozilla.firefox"
  };
  return browserMap[progId] ? { id: browserMap[progId] } : {};
}
