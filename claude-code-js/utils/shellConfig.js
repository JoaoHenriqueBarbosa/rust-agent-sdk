// Original: src/utils/shellConfig.ts
import { open as open8, readFile as readFile16, stat as stat18 } from "fs/promises";
import { homedir as osHomedir } from "os";
import { join as join63 } from "path";
function getShellConfigPaths(options2) {
  let home = options2?.homedir ?? osHomedir(), zshConfigDir = (options2?.env ?? process.env).ZDOTDIR || home;
  return {
    zsh: join63(zshConfigDir, ".zshrc"),
    bash: join63(home, ".bashrc"),
    fish: join63(home, ".config/fish/config.fish")
  };
}
function filterClaudeAliases(lines2) {
  let hadAlias = !1;
  return { filtered: lines2.filter((line) => {
    if (CLAUDE_ALIAS_REGEX.test(line)) {
      let match = line.match(/alias\s+claude\s*=\s*["']([^"']+)["']/);
      if (!match)
        match = line.match(/alias\s+claude\s*=\s*([^#\n]+)/);
      if (match && match[1]) {
        if (match[1].trim() === getLocalClaudePath())
          return hadAlias = !0, !1;
      }
    }
    return !0;
  }), hadAlias };
}
async function readFileLines(filePath) {
  try {
    return (await readFile16(filePath, { encoding: "utf8" })).split(`
`);
  } catch (e) {
    if (isFsInaccessible(e))
      return null;
    throw e;
  }
}
async function writeFileLines(filePath, lines2) {
  let fh = await open8(filePath, "w");
  try {
    await fh.writeFile(lines2.join(`
`), { encoding: "utf8" }), await fh.datasync();
  } finally {
    await fh.close();
  }
}
async function findClaudeAlias(options2) {
  let configs = getShellConfigPaths(options2);
  for (let configPath of Object.values(configs)) {
    let lines2 = await readFileLines(configPath);
    if (!lines2)
      continue;
    for (let line of lines2)
      if (CLAUDE_ALIAS_REGEX.test(line)) {
        let match = line.match(/alias\s+claude=["']?([^"'\s]+)/);
        if (match && match[1])
          return match[1];
      }
  }
  return null;
}
async function findValidClaudeAlias(options2) {
  let aliasTarget = await findClaudeAlias(options2);
  if (!aliasTarget)
    return null;
  let home = options2?.homedir ?? osHomedir(), expandedPath = aliasTarget.startsWith("~") ? aliasTarget.replace("~", home) : aliasTarget;
  try {
    let stats = await stat18(expandedPath);
    if (stats.isFile() || stats.isSymbolicLink())
      return aliasTarget;
  } catch {}
  return null;
}
var CLAUDE_ALIAS_REGEX;
var init_shellConfig = __esm(() => {
  init_errors();
  init_localInstaller();
  CLAUDE_ALIAS_REGEX = /^\s*alias\s+claude\s*=/;
});
