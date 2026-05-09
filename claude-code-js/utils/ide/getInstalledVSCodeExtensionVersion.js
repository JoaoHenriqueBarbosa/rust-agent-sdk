// function: getInstalledVSCodeExtensionVersion
async function getInstalledVSCodeExtensionVersion(command12) {
  let { stdout } = await execFileNoThrow(command12, ["--list-extensions", "--show-versions"], {
    env: getInstallationEnv()
  }), lines2 = stdout?.split(`
`) || [];
  for (let line of lines2) {
    let [extensionId, version5] = line.split("@");
    if (extensionId === "anthropic.claude-code" && version5)
      return version5;
  }
  return null;
}
