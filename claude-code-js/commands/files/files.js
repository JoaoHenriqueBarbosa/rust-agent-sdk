// Original: src/commands/files/files.ts
var exports_files2 = {};
__export(exports_files2, {
  call: () => call46
});
import { relative as relative26 } from "path";
async function call46(_args, context7) {
  let files2 = context7.readFileState ? cacheKeys(context7.readFileState) : [];
  if (files2.length === 0)
    return { type: "text", value: "No files in context" };
  return { type: "text", value: `Files in context:
${files2.map((file2) => relative26(getCwd(), file2)).join(`
`)}` };
}
var init_files4 = __esm(() => {
  init_cwd2();
  init_fileStateCache();
});
