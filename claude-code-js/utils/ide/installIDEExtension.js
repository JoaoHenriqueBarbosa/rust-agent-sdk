// function: installIDEExtension
async function installIDEExtension(ideType) {
  if (isVSCodeIde(ideType)) {
    let command12 = await getVSCodeIDECommand(ideType);
    if (command12) {
      let version5 = await getInstalledVSCodeExtensionVersion(command12);
      if (!version5 || lt(version5, getClaudeCodeVersion())) {
        await sleep3(500);
        let result = await execFileNoThrowWithCwd(command12, ["--force", "--install-extension", "anthropic.claude-code"], {
          env: getInstallationEnv()
        });
        if (result.code !== 0)
          throw Error(`${result.code}: ${result.error} ${result.stderr}`);
        version5 = getClaudeCodeVersion();
      }
      return version5;
    }
  }
  return null;
}
