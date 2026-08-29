// function: initializeIdeIntegration
async function initializeIdeIntegration(onIdeDetected, ideToInstallExtension, onShowIdeOnboarding, onInstallationComplete) {
  findAvailableIDE().then(onIdeDetected);
  let shouldAutoInstall = getGlobalConfig().autoInstallIdeExtension ?? !0;
  if (!isEnvTruthy(process.env.CLAUDE_CODE_IDE_SKIP_AUTO_INSTALL) && shouldAutoInstall) {
    let ideType = ideToInstallExtension ?? getTerminalIdeType();
    if (ideType) {
      if (isVSCodeIde(ideType))
        isIDEExtensionInstalled(ideType).then(async (isAlreadyInstalled) => {
          maybeInstallIDEExtension(ideType).catch((error44) => {
            return {
              installed: !1,
              error: error44.message || "Installation failed",
              installedVersion: null,
              ideType
            };
          }).then((status) => {
            if (onInstallationComplete(status), status?.installed)
              findAvailableIDE().then(onIdeDetected);
            if (!isAlreadyInstalled && status?.installed === !0 && !ideOnboardingDialog().hasIdeOnboardingDialogBeenShown())
              onShowIdeOnboarding();
          });
        });
      else if (isJetBrainsIde(ideType))
        isIDEExtensionInstalled(ideType).then(async (installed) => {
          if (installed && !ideOnboardingDialog().hasIdeOnboardingDialogBeenShown())
            onShowIdeOnboarding();
        });
    }
  }
}
