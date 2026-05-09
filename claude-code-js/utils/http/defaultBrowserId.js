// function: defaultBrowserId
async function defaultBrowserId() {
  if (process17.platform !== "darwin")
    throw Error("macOS only");
  let { stdout } = await execFileAsync2("defaults", ["read", "com.apple.LaunchServices/com.apple.launchservices.secure", "LSHandlers"]), browserId = /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(stdout)?.groups.id ?? "com.apple.Safari";
  if (browserId === "com.apple.safari")
    return "com.apple.Safari";
  return browserId;
}
