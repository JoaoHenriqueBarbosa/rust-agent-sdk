// Original: src/utils/pasteStore.ts
import { createHash as createHash19 } from "crypto";
import { mkdir as mkdir24, readdir as readdir19, readFile as readFile37, stat as stat34, unlink as unlink13, writeFile as writeFile29 } from "fs/promises";
import { join as join105 } from "path";
function getPasteStoreDir() {
  return join105(getClaudeConfigHomeDir(), PASTE_STORE_DIR);
}
function hashPastedText(content) {
  return createHash19("sha256").update(content).digest("hex").slice(0, 16);
}
function getPastePath(hash) {
  return join105(getPasteStoreDir(), `${hash}.txt`);
}
async function storePastedText(hash, content) {
  try {
    let dir = getPasteStoreDir();
    await mkdir24(dir, { recursive: !0 });
    let pastePath = getPastePath(hash);
    await writeFile29(pastePath, content, { encoding: "utf8", mode: 384 }), logForDebugging(`Stored paste ${hash} to ${pastePath}`);
  } catch (error44) {
    logForDebugging(`Failed to store paste: ${error44}`);
  }
}
async function retrievePastedText(hash) {
  try {
    let pastePath = getPastePath(hash);
    return await readFile37(pastePath, { encoding: "utf8" });
  } catch (error44) {
    if (!isENOENT(error44))
      logForDebugging(`Failed to retrieve paste ${hash}: ${error44}`);
    return null;
  }
}
async function cleanupOldPastes(cutoffDate) {
  let pasteDir = getPasteStoreDir(), files2;
  try {
    files2 = await readdir19(pasteDir);
  } catch {
    return;
  }
  let cutoffTime = cutoffDate.getTime();
  for (let file2 of files2) {
    if (!file2.endsWith(".txt"))
      continue;
    let filePath = join105(pasteDir, file2);
    try {
      if ((await stat34(filePath)).mtimeMs < cutoffTime)
        await unlink13(filePath), logForDebugging(`Cleaned up old paste: ${filePath}`);
    } catch {}
  }
}
var PASTE_STORE_DIR = "paste-cache";
var init_pasteStore = __esm(() => {
  init_debug();
  init_envUtils();
  init_errors();
});
