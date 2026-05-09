// function: maybeInstallIDEExtension
async function maybeInstallIDEExtension(ideType) {
  try {
    let installedVersion = await installIDEExtension(ideType);
    if (logEvent("tengu_ext_installed", {}), !getGlobalConfig().diffTool)
      saveGlobalConfig((current) => ({ ...current, diffTool: "auto" }));
    return {
      installed: !0,
      error: null,
      installedVersion,
      ideType
    };
  } catch (error44) {
    logEvent("tengu_ext_install_error", {});
    let errorMessage2 = error44 instanceof Error ? error44.message : String(error44);
    return logError2(error44), {
      installed: !1,
      error: errorMessage2,
      installedVersion: null,
      ideType
    };
  }
}
