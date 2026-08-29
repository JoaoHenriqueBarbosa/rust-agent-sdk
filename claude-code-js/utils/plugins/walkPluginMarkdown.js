// Original: src/utils/plugins/walkPluginMarkdown.ts
import { join as join43 } from "path";
async function walkPluginMarkdown(rootDir, onFile, opts = {}) {
  let fs15 = getFsImplementation(), label = opts.logLabel ?? "plugin";
  async function scan(dirPath, namespace) {
    try {
      let entries = await fs15.readdir(dirPath);
      if (opts.stopAtSkillDir && entries.some((e) => e.isFile() && SKILL_MD_RE.test(e.name))) {
        await Promise.all(entries.map((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md") ? onFile(join43(dirPath, entry.name), namespace) : void 0));
        return;
      }
      await Promise.all(entries.map((entry) => {
        let fullPath = join43(dirPath, entry.name);
        if (entry.isDirectory())
          return scan(fullPath, [...namespace, entry.name]);
        if (entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
          return onFile(fullPath, namespace);
        return;
      }));
    } catch (error44) {
      logForDebugging(`Failed to scan ${label} directory ${dirPath}: ${error44}`, { level: "error" });
    }
  }
  await scan(rootDir, []);
}
var SKILL_MD_RE;
var init_walkPluginMarkdown = __esm(() => {
  init_debug();
  init_fsOperations();
  SKILL_MD_RE = /^skill\.md$/i;
});
