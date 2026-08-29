// function: isJetBrainsIde
function isJetBrainsIde(ide) {
  if (!ide)
    return !1;
  let config10 = supportedIdeConfigs[ide];
  return config10 && config10.ideKind === "jetbrains";
}
