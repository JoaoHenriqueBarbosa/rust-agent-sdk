// Original: src/memdir/memoryScan.ts
import { readdir as readdir12 } from "fs/promises";
import { basename as basename25, join as join88 } from "path";
async function scanMemoryFiles(memoryDir, signal) {
  try {
    let mdFiles = (await readdir12(memoryDir, { recursive: !0 })).filter((f) => f.endsWith(".md") && basename25(f) !== "MEMORY.md");
    return (await Promise.allSettled(mdFiles.map(async (relativePath) => {
      let filePath = join88(memoryDir, relativePath), { content, mtimeMs } = await readFileInRange(filePath, 0, FRONTMATTER_MAX_LINES, void 0, signal), { frontmatter } = parseFrontmatter(content, filePath);
      return {
        filename: relativePath,
        filePath,
        mtimeMs,
        description: frontmatter.description || null,
        type: parseMemoryType(frontmatter.type)
      };
    }))).filter((r4) => r4.status === "fulfilled").map((r4) => r4.value).sort((a2, b) => b.mtimeMs - a2.mtimeMs).slice(0, MAX_MEMORY_FILES);
  } catch {
    return [];
  }
}
function formatMemoryManifest(memories) {
  return memories.map((m4) => {
    let tag2 = m4.type ? `[${m4.type}] ` : "", ts = new Date(m4.mtimeMs).toISOString();
    return m4.description ? `- ${tag2}${m4.filename} (${ts}): ${m4.description}` : `- ${tag2}${m4.filename} (${ts})`;
  }).join(`
`);
}
var MAX_MEMORY_FILES = 200, FRONTMATTER_MAX_LINES = 30;
var init_memoryScan = __esm(() => {
  init_frontmatterParser();
  init_readFileInRange();
  init_memoryTypes();
});
