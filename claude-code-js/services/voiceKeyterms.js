// Original: src/services/voiceKeyterms.ts
import { basename as basename39 } from "path";
function splitIdentifier(name3) {
  return name3.replace(/([a-z])([A-Z])/g, "$1 $2").split(/[-_./\s]+/).map((w2) => w2.trim()).filter((w2) => w2.length > 2 && w2.length <= 20);
}
function fileNameWords(filePath) {
  let stem = basename39(filePath).replace(/\.[^.]+$/, "");
  return splitIdentifier(stem);
}
async function getVoiceKeyterms(recentFiles) {
  let terms = new Set(GLOBAL_KEYTERMS);
  try {
    let projectRoot = getProjectRoot();
    if (projectRoot) {
      let name3 = basename39(projectRoot);
      if (name3.length > 2 && name3.length <= 50)
        terms.add(name3);
    }
  } catch {}
  try {
    let branch2 = await getBranch();
    if (branch2)
      for (let word of splitIdentifier(branch2))
        terms.add(word);
  } catch {}
  if (recentFiles)
    for (let filePath of recentFiles) {
      if (terms.size >= MAX_KEYTERMS)
        break;
      for (let word of fileNameWords(filePath))
        terms.add(word);
    }
  return [...terms].slice(0, MAX_KEYTERMS);
}
var GLOBAL_KEYTERMS, MAX_KEYTERMS = 50;
var init_voiceKeyterms = __esm(() => {
  init_state();
  init_git();
  GLOBAL_KEYTERMS = [
    "MCP",
    "symlink",
    "grep",
    "regex",
    "localhost",
    "codebase",
    "TypeScript",
    "JSON",
    "OAuth",
    "webhook",
    "gRPC",
    "dotfiles",
    "subagent",
    "worktree"
  ];
});
