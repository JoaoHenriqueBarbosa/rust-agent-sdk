// Original: src/utils/claudeDesktop.ts
var exports_claudeDesktop = {};
__export(exports_claudeDesktop, {
  readClaudeDesktopMcpServers: () => readClaudeDesktopMcpServers,
  getClaudeDesktopConfigPath: () => getClaudeDesktopConfigPath
});
import { readdir as readdir30, readFile as readFile56, stat as stat46 } from "fs/promises";
import { homedir as homedir39 } from "os";
import { join as join151 } from "path";
async function getClaudeDesktopConfigPath() {
  let platform7 = getPlatform();
  if (!SUPPORTED_PLATFORMS.includes(platform7))
    throw Error(`Unsupported platform: ${platform7} - Claude Desktop integration only works on macOS and WSL.`);
  if (platform7 === "macos")
    return join151(homedir39(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
  let windowsHome = process.env.USERPROFILE ? process.env.USERPROFILE.replace(/\\/g, "/") : null;
  if (windowsHome) {
    let configPath = `/mnt/c${windowsHome.replace(/^[A-Z]:/, "")}/AppData/Roaming/Claude/claude_desktop_config.json`;
    try {
      return await stat46(configPath), configPath;
    } catch {}
  }
  try {
    try {
      let userDirs = await readdir30("/mnt/c/Users", { withFileTypes: !0 });
      for (let user of userDirs) {
        if (user.name === "Public" || user.name === "Default" || user.name === "Default User" || user.name === "All Users")
          continue;
        let potentialConfigPath = join151("/mnt/c/Users", user.name, "AppData", "Roaming", "Claude", "claude_desktop_config.json");
        try {
          return await stat46(potentialConfigPath), potentialConfigPath;
        } catch {}
      }
    } catch {}
  } catch (dirError) {
    logError2(dirError);
  }
  throw Error("Could not find Claude Desktop config file in Windows. Make sure Claude Desktop is installed on Windows.");
}
async function readClaudeDesktopMcpServers() {
  if (!SUPPORTED_PLATFORMS.includes(getPlatform()))
    throw Error("Unsupported platform - Claude Desktop integration only works on macOS and WSL.");
  try {
    let configPath = await getClaudeDesktopConfigPath(), configContent;
    try {
      configContent = await readFile56(configPath, { encoding: "utf8" });
    } catch (e) {
      if (getErrnoCode(e) === "ENOENT")
        return {};
      throw e;
    }
    let config11 = safeParseJSON(configContent);
    if (!config11 || typeof config11 !== "object")
      return {};
    let mcpServers = config11.mcpServers;
    if (!mcpServers || typeof mcpServers !== "object")
      return {};
    let servers = {};
    for (let [name3, serverConfig] of Object.entries(mcpServers)) {
      if (!serverConfig || typeof serverConfig !== "object")
        continue;
      let result = McpStdioServerConfigSchema().safeParse(serverConfig);
      if (result.success)
        servers[name3] = result.data;
    }
    return servers;
  } catch (error44) {
    return logError2(error44), {};
  }
}
var init_claudeDesktop = __esm(() => {
  init_types2();
  init_errors();
  init_json();
  init_log3();
  init_platform();
});
