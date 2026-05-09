// function: isIDEExtensionInstalled
async function isIDEExtensionInstalled(ideType) {
  if (isVSCodeIde(ideType)) {
    let command12 = await getVSCodeIDECommand(ideType);
    if (command12)
      try {
        if ((await execFileNoThrowWithCwd(command12, ["--list-extensions"], {
          env: getInstallationEnv()
        })).stdout?.includes(EXTENSION_ID))
          return !0;
      } catch {}
  } else if (isJetBrainsIde(ideType))
    return await isJetBrainsPluginInstalledCached(ideType);
  return !1;
}
