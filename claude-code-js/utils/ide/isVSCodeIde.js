// function: isVSCodeIde
function isVSCodeIde(ide) {
  if (!ide)
    return !1;
  let config10 = supportedIdeConfigs[ide];
  return config10 && config10.ideKind === "vscode";
}
