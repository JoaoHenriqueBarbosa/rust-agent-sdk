// Original: src/utils/listSessionsImpl.ts
import { readdir as readdir11, stat as stat25 } from "fs/promises";
import { basename as basename24, join as join86 } from "path";
async function listCandidates(projectDir, doStat, projectPath) {
  let names;
  try {
    names = await readdir11(projectDir);
  } catch {
    return [];
  }
  return (await Promise.all(names.map(async (name3) => {
    if (!name3.endsWith(".jsonl"))
      return null;
    let sessionId = validateUuid(name3.slice(0, -6));
    if (!sessionId)
      return null;
    let filePath = join86(projectDir, name3);
    if (!doStat)
      return { sessionId, filePath, mtime: 0, projectPath };
    try {
      let s2 = await stat25(filePath);
      return { sessionId, filePath, mtime: s2.mtime.getTime(), projectPath };
    } catch {
      return null;
    }
  }))).filter((c3) => c3 !== null);
}
var init_listSessionsImpl = __esm(() => {
  init_getWorktreePathsPortable();
  init_sessionStoragePortable();
});
